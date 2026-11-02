#!/usr/bin/env node
/**
 * Export the deck as files people can open without you in the room.
 *   npm run export                      build, then write export/<deck>.pdf, .pptx and export/slides/*.jpg
 *   node scripts/export.mjs --url http://localhost:5173   export a running dev server instead
 *   node scripts/export.mjs --steps     one page per build step, not just the finished slide
 *   node scripts/export.mjs --only pdf  (or pptx, or images)
 *   node scripts/export.mjs --settle 6000   wait longer per slide (slow machines, WebGL backdrops)
 *
 * The pages are the deck's own frames, captured at 1920×1080 and placed full-bleed on 960×540 pt
 * pages, so the file looks exactly like the deck. That means the text is NOT selectable: printing
 * the live DOM instead would flatten the animations and break the gradient-text effects, so frames
 * win. Speaker notes do travel: they become real PowerPoint notes.
 */
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { launch, serve } from './lib/chrome.mjs'
import { buildPdf } from './lib/pdf.mjs'
import { buildPptx } from './lib/pptx.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const flag = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? (args[i + 1]?.startsWith('--') === false ? args[i + 1] : true) : fallback
}
const only = flag('only')
const want = (kind) => !only || only === kind
const everyStep = args.includes('--steps')
const settle = Number(flag('settle', 3500))
const outDir = path.resolve(root, String(flag('out', 'export')))

let url = flag('url')
let server = null
if (!url) {
  const dist = path.join(root, 'dist')
  if (!existsSync(path.join(dist, 'index.html'))) {
    console.log('• no dist/ yet — building')
    const build = spawnSync('npm', ['run', 'build'], { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' })
    if (build.status !== 0) process.exit(build.status ?? 1)
  }
  server = await serve(dist)
  url = server.url
}

const page = await launch({ width: 1920, height: 1080 })
const frames = []
try {
  await page.goto(`${url}/?chrome=0#1`)
  if (!(await page.until('window.__kimz && window.__kimz.slides && window.__kimz.slides.length'))) {
    console.error('✗ the deck never came up (no window.__kimz). Is this a kimzPresentations deck?')
    process.exit(1)
  }
  const meta = await page.eval('JSON.stringify(window.__kimz)').then(JSON.parse)
  console.log(`• ${meta.title} — ${meta.slides.length} slides`)

  for (const [i, slide] of meta.slides.entries()) {
    // Fresh load per slide: a hash-only change does not reload, and reloading means every slide
    // starts its entrance animation from zero instead of being caught mid-transition.
    await page.goto(`${url}/?chrome=0&s=${i + 1}#${i + 1}`)
    await page.until(`window.__kimz && window.__kimz.index === ${i}`)
    await page.eval('document.fonts.ready.then(() => 1)')
    await page.wait(settle)
    const steps = slide.steps ?? 1
    for (let step = 0; step < steps; step++) {
      if (step > 0) {
        await page.key('ArrowRight')
        await page.wait(Math.max(900, settle / 3))
      }
      if (!everyStep && step < steps - 1) continue // only the finished slide
      frames.push({
        jpeg: await page.jpeg(92),
        notes: slide.notes ?? '',
        title: slide.id,
        name: `${String(i + 1).padStart(2, '0')}-${slide.id}${everyStep && steps > 1 ? `-${step + 1}` : ''}`,
      })
    }
    console.log(`  ✓ ${i + 1}/${meta.slides.length} ${slide.id}${steps > 1 ? ` (${steps} steps)` : ''}`)
  }

  const base = (meta.title || 'deck').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'deck'
  rmSync(path.join(outDir, 'slides'), { recursive: true, force: true })
  mkdirSync(path.join(outDir, 'slides'), { recursive: true })
  const written = []

  if (want('images')) {
    for (const f of frames) writeFileSync(path.join(outDir, 'slides', `${f.name}.jpg`), f.jpeg)
    written.push(`slides/ — ${frames.length} jpg`)
  }
  if (want('pdf')) {
    const file = path.join(outDir, `${base}.pdf`)
    writeFileSync(file, buildPdf(frames, { title: meta.title }))
    written.push(`${base}.pdf`)
  }
  if (want('pptx')) {
    const file = path.join(outDir, `${base}.pptx`)
    writeFileSync(file, buildPptx(frames, { title: meta.title }))
    written.push(`${base}.pptx`)
  }
  console.log(`\n✓ ${outDir}\n  ${written.join('\n  ')}`)
} finally {
  await page.close()
  server?.close()
}
