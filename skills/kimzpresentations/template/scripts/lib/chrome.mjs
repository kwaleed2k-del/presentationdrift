// Headless Chrome over the DevTools protocol, with no dependencies.
// Used by scripts/export.mjs (slide images → PDF/PPTX) and scripts/check.mjs (layout audit).
// Needs Node 22+: the CDP socket uses the global WebSocket, which older Node does not have.
import { spawn } from 'node:child_process'
import { createReadStream, existsSync, mkdtempSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import os from 'node:os'
import path from 'node:path'

export const needsNode22 = () => {
  if (typeof WebSocket === 'undefined') {
    console.error(`✗ this script needs Node 22+ (found v${process.versions.node}); it talks to Chrome over a WebSocket.`)
    process.exit(1)
  }
}

/** Chrome (or Edge, which is always there on Windows) — override with KIMZ_CHROME=/path/to/chrome */
export function findChrome() {
  const candidates = [
    process.env.KIMZ_CHROME,
    ...(process.platform === 'win32'
      ? [
          'C:/Program Files/Google/Chrome/Application/chrome.exe',
          'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
          path.join(os.homedir(), 'AppData/Local/Google/Chrome/Application/chrome.exe'),
          'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
          'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
        ]
      : process.platform === 'darwin'
        ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge']
        : ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/snap/bin/chromium', '/usr/bin/microsoft-edge']),
  ].filter(Boolean)
  const found = candidates.find((c) => existsSync(c))
  if (!found) {
    console.error('✗ no Chrome found. Install Google Chrome, or point KIMZ_CHROME at a Chromium build.')
    process.exit(1)
  }
  return found
}

/** A tiny static file server (zero deps), so a built deck can be opened over http:// rather than file:// */
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif', '.mp4': 'video/mp4', '.webm': 'video/webm', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf' }
export function serve(root, port = 0) {
  const dir = path.resolve(root)
  const server = createServer((req, res) => {
    const url = decodeURIComponent((req.url ?? '/').split('?')[0])
    let file = path.join(dir, url)
    if (!file.startsWith(dir)) return void res.writeHead(403).end('no')
    if (!existsSync(file) || statSync(file).isDirectory()) file = path.join(dir, 'index.html')
    if (!existsSync(file)) return void res.writeHead(404).end('not found')
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream', 'Cache-Control': 'no-store' })
    createReadStream(file).pipe(res)
  })
  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => resolve({ url: `http://127.0.0.1:${server.address().port}`, close: () => server.close() }))
  })
}

/**
 * Launch headless Chrome and return a session.
 * No --disable-gpu: that blanks the WebGL backdrops. SwiftShader renders them without a real GPU.
 */
export async function launch({ width = 1920, height = 1080, scale = 1 } = {}) {
  needsNode22()
  const bin = findChrome()
  const profile = mkdtempSync(path.join(os.tmpdir(), 'kimz-chrome-'))
  const port = 9222 + Math.floor(Math.random() * 600)
  const child = spawn(
    bin,
    [
      '--headless=new',
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profile}`,
      `--window-size=${width},${height}`,
      '--hide-scrollbars',
      '--use-angle=swiftshader',
      '--enable-unsafe-swiftshader',
      '--ignore-gpu-blocklist',
      '--autoplay-policy=no-user-gesture-required',
      '--mute-audio',
      '--no-first-run',
      '--no-default-browser-check',
      'about:blank',
    ],
    { stdio: 'ignore', detached: false },
  )

  // wait for the debugging endpoint
  const deadline = Date.now() + 25000
  let version = null
  while (Date.now() < deadline && !version) {
    try {
      version = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json()
    } catch {
      await new Promise((r) => setTimeout(r, 250))
    }
  }
  if (!version) {
    child.kill()
    console.error('✗ Chrome did not start (no DevTools endpoint). Try KIMZ_CHROME=<path to chrome>.')
    process.exit(1)
  }

  const tab = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json()
  const ws = new WebSocket(tab.webSocketDebuggerUrl)
  const pending = new Map()
  const events = new Map()
  let id = 0
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data)
    if (d.id && pending.has(d.id)) {
      const { resolve, reject } = pending.get(d.id)
      pending.delete(d.id)
      d.error ? reject(new Error(d.error.message)) : resolve(d.result)
    } else if (d.method && events.has(d.method)) events.get(d.method).forEach((fn) => fn(d.params))
  }
  await new Promise((r) => (ws.onopen = r))

  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const i = ++id
      pending.set(i, { resolve, reject })
      ws.send(JSON.stringify({ id: i, method, params }))
    })
  const on = (method, fn) => events.set(method, [...(events.get(method) ?? []), fn])

  await send('Page.enable')
  await send('Runtime.enable')
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: scale, mobile: false })

  const session = {
    send,
    on,
    /** evaluate an expression in the page and return its value */
    async eval(expression) {
      const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? 'evaluate failed')
      return r.result.value
    },
    /** go to a url and wait for the load event */
    async goto(url) {
      const loaded = new Promise((r) => on('Page.loadEventFired', r))
      await send('Page.navigate', { url })
      await loaded
    },
    /** wait until an expression is truthy */
    async until(expression, { timeout = 30000, every = 200 } = {}) {
      const end = Date.now() + timeout
      for (;;) {
        if (await session.eval(`!!(${expression})`)) return true
        if (Date.now() > end) return false
        await new Promise((r) => setTimeout(r, every))
      }
    },
    /** press a key the way the presenter engine listens for it */
    key: (k) => session.eval(`(window.dispatchEvent(new KeyboardEvent('keydown',{key:${JSON.stringify(k)},bubbles:true})),1)`),
    wait: (ms) => new Promise((r) => setTimeout(r, ms)),
    async jpeg(quality = 92) {
      const { data } = await send('Page.captureScreenshot', { format: 'jpeg', quality, captureBeyondViewport: false })
      return Buffer.from(data, 'base64')
    },
    async close() {
      try {
        await send('Browser.close')
      } catch {
        /* already gone */
      }
      try {
        ws.close()
      } catch {
        /* ignore */
      }
      child.kill()
    },
  }
  return session
}
