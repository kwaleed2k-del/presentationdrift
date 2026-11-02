// Screenshots each .page in docs/covers.html to docs/images/covers/<n>-<slug>.png
// usage: node shoot-covers.mjs <debugPort> <url>   (headless Chrome with --remote-debugging-port)
import { writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'

const [, , port, url] = process.argv
const SLUGS = ['01-bubblegum-pop', '02-night-luxe', '03-blueprint', '04-najd-dusk-arabic', '05-comic-book']
const OUT = path.join(import.meta.dirname, 'images/covers')
mkdirSync(OUT, { recursive: true })

const tab = await (await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`, { method: 'PUT' })).json()
const ws = new WebSocket(tab.webSocketDebuggerUrl)
let id = 0
const pending = new Map()
ws.onmessage = (m) => {
  const d = JSON.parse(m.data)
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d.result); pending.delete(d.id) }
}
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })) })
await new Promise((r) => (ws.onopen = r))

await send('Emulation.setDeviceMetricsOverride', { width: 1340, height: 900, deviceScaleFactor: 1, mobile: false })
await new Promise((r) => setTimeout(r, 6000))
await send('Runtime.evaluate', { expression: 'document.fonts.ready.then(()=>1)', awaitPromise: true, returnByValue: true })
await new Promise((r) => setTimeout(r, 1200))

const boxes = (await send('Runtime.evaluate', {
  expression: `JSON.stringify([...document.querySelectorAll('.page')].map(p=>{const r=p.getBoundingClientRect();return{x:r.x+scrollX,y:r.y+scrollY,w:r.width,h:r.height}}))`,
  returnByValue: true,
})).result.value
const rects = JSON.parse(boxes)

for (const [i, r] of rects.entries()) {
  const shot = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    clip: { x: r.x, y: r.y, width: r.w, height: r.h, scale: 1.25 },
  })
  const file = path.join(OUT, `${SLUGS[i] ?? 'cover-' + (i + 1)}.png`)
  writeFileSync(file, Buffer.from(shot.data, 'base64'))
  console.log('wrote', file)
}
process.exit(0)
