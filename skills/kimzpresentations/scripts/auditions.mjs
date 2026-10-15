#!/usr/bin/env node
// Style auditions: copy the 3-look starter page and serve it on localhost (zero dependencies).
//   node <skill>/scripts/auditions.mjs <dir> [--port 5400] [--no-serve]
// Edit <dir>/index.html (see references/style-auditions.md), the browser shows it at http://localhost:<port>.
import { copyFileSync, createReadStream, existsSync, mkdirSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const starter = path.resolve(here, '../auditions/index.html')
const args = process.argv.slice(2)
const dir = args.find((a) => !a.startsWith('--'))
const portArg = args.indexOf('--port')
const port = portArg >= 0 ? Number(args[portArg + 1]) : 5400
if (!dir) {
  console.error('usage: auditions.mjs <dir> [--port 5400] [--no-serve]')
  process.exit(1)
}
const root = path.resolve(dir)
mkdirSync(root, { recursive: true })
const page = path.join(root, 'index.html')
if (existsSync(page)) console.log(`• keeping existing ${page}`)
else {
  copyFileSync(starter, page)
  console.log(`✓ starter copied to ${page}`)
}
if (args.includes('--no-serve')) process.exit(0)

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.mp4': 'video/mp4', '.woff2': 'font/woff2' }
createServer((req, res) => {
  const url = decodeURIComponent((req.url ?? '/').split('?')[0])
  const file = path.join(root, url.endsWith('/') ? `${url}index.html` : url)
  if (!file.startsWith(root) || !existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404).end('not found')
    return
  }
  // no-store so every refresh shows the latest edit
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream', 'Cache-Control': 'no-store' })
  createReadStream(file).pipe(res)
})
  .on('error', (e) => {
    console.error(`✗ ${e.code === 'EADDRINUSE' ? `port ${port} is busy, try --port ${port + 1}` : e.message}`)
    process.exit(1)
  })
  .listen(port, '127.0.0.1', () => console.log(`✓ auditions at http://localhost:${port}  (Ctrl+C to stop)`))
