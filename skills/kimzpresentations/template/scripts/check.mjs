#!/usr/bin/env node
/**
 * Layout check — walks every slide and build step in headless Chrome and fails on
 * overlapping text, text off the stage or outside its [data-box], clipped text and tiny type.
 *   npm run check                                  against the dev server on :5173
 *   node scripts/check.mjs --url http://localhost:5200
 *   node scripts/check.mjs --build                 build first and check dist/
 *   node scripts/check.mjs --settle 6000           slower machines / heavy WebGL backdrops
 *   node scripts/check.mjs --shots failures        write a jpg of every failing slide to export/check/
 * Exits 1 when something is wrong, so it can gate a commit. The same audit runs in the browser:
 * press L on any slide. Decorative overlap by design (marquees, tickers) carries data-audit-skip.
 */
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { launch, serve } from './lib/chrome.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const flag = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? (args[i + 1]?.startsWith('--') === false ? args[i + 1] : true) : fallback
}
const settle = Number(flag('settle', 3500))
const shots = flag('shots')
const verbose = args.includes('--verbose')

let url = flag('url')
let server = null
if (!url && args.includes('--build')) {
  const build = spawnSync('npm', ['run', 'build'], { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' })
  if (build.status !== 0) process.exit(build.status ?? 1)
  server = await serve(path.join(root, 'dist'))
  url = server.url
}
url ??= 'http://localhost:5173'

const page = await launch({ width: 1920, height: 1080 })
let failures = 0
let advice = 0
try {
  await page.goto(`${url}/?chrome=0#1`)
  if (!(await page.until('window.__kimz && window.__kimz.slides && window.__kimz.slides.length', { timeout: 15000 }))) {
    console.error(`✗ no deck at ${url} — start it with \`npm run dev\`, or pass --build / --url`)
    process.exit(1)
  }
  if (!(await page.eval('!!window.__kimzAudit'))) {
    console.error('✗ this deck predates the layout audit. Copy src/engine/audit.ts from the template and add `import \'./audit\'` to Deck.tsx.')
    process.exit(1)
  }
  const meta = await page.eval('JSON.stringify(window.__kimz)').then(JSON.parse)
  console.log(`• ${meta.title} — ${meta.slides.length} slides`)

  const outDir = path.join(root, 'export', 'check')
  if (shots) mkdirSync(outDir, { recursive: true })

  for (const [i, slide] of meta.slides.entries()) {
    // fresh load per slide, like the gallery and export scripts: entrance animations run from zero
    await page.goto(`${url}/?chrome=0&s=${i + 1}#${i + 1}`)
    await page.until(`window.__kimz && window.__kimz.index === ${i}`)
    await page.eval('document.fonts.ready.then(() => 1)')
    const steps = slide.steps ?? 1
    for (let step = 0; step < steps; step++) {
      await page.wait(step === 0 ? settle : Math.max(900, settle / 3))
      const found = await page.eval('JSON.stringify(window.__kimzAudit.slide().map(i => ({ kind: i.kind, text: i.text })))').then(JSON.parse)
      // small-type is advice, not a defect: micro-labels at 14-17px are a real design device
      const issues = found.filter((i) => i.kind !== 'small-type')
      const notes = found.filter((i) => i.kind === 'small-type')
      const label = `${String(i + 1).padStart(2, '0')}${steps > 1 ? `.${step}` : '  '} ${slide.id}`
      if (issues.length) {
        failures += issues.length
        console.log(`  ✗ ${label}`)
        if (shots) writeFileSync(path.join(outDir, `${String(i + 1).padStart(2, '0')}-${slide.id}-${step}.jpg`), await page.jpeg(80))
      } else console.log(`  ${notes.length ? '~' : '✓'} ${label}`)
      for (const is of issues) console.log(`      ${is.kind.padEnd(12)} ${is.text}`)
      for (const is of notes) {
        advice++
        if (verbose) console.log(`      small-type   ${is.text}`)
      }
      if (step < steps - 1) await page.key('ArrowRight')
    }
  }
} finally {
  await page.close()
  server?.close()
}

const tail = advice ? ` · ${advice} small-type note(s) on the ~ slides, --verbose lists them` : ''
console.log(failures ? `\n✗ LAYOUT FAILED — ${failures} issue(s)${shots ? ' · screenshots in export/check/' : ''}${tail}` : `\n✓ LAYOUT PASSED — no overlap, nothing outside its box, nothing clipped${tail}`)
process.exit(failures ? 1 : 0)
