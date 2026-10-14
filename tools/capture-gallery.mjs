// Captures the README gallery: every slide of every example deck + one slide in every theme.
// Runs in CI (.github/workflows/gallery.yml) against `vite preview` of the gallery build.
//   BASE=http://localhost:4173 node tools/capture-gallery.mjs
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const tpl = path.join(root, 'skills/kimzpresentations/template')
const BASE = process.env.BASE ?? 'http://localhost:4173'
const OUT = path.join(root, 'docs/images')
const decks = readdirSync(path.join(tpl, 'examples'), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort()
const themes = [...readFileSync(path.join(tpl, 'src/engine/theme.ts'), 'utf8').matchAll(/'([a-z-]+)': \{\r?\n\s+id:/g)].map((m) => m[1])
const THEME_SLIDE = { deck: 'startup-pitch', n: 3 } // one slide shown in every mode

const browser = await chromium.launch({
  channel: 'chrome', // real Chrome: H.264 video + WebGL via SwiftShader
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'],
})
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 })
const wait = (ms) => page.waitForTimeout(ms)
const shot = (file) => page.screenshot({ path: file, type: 'jpeg', quality: 80 })

rmSync(path.join(OUT, 'decks'), { recursive: true, force: true })
rmSync(path.join(OUT, 'themes'), { recursive: true, force: true })
const gallery = {}

for (const deck of decks) {
  const dir = path.join(OUT, 'decks', deck)
  mkdirSync(dir, { recursive: true })
  await page.goto(`${BASE}/?deck=${deck}&chrome=0#1`, { waitUntil: 'networkidle' })
  await page.waitForFunction(() => window.__kimz?.slides?.length > 0)
  const meta = await page.evaluate(() => window.__kimz)
  gallery[deck] = { title: meta.title, shots: [] }
  for (let i = 0; i < meta.slides.length; i++) {
    const s = meta.slides[i]
    // Fresh page load per slide (the `s` param forces a reload): CI runners have no GPU, so WebGL
    // backdrops crawl — navigating with → would screenshot the next slide mid-transition.
    if (i > 0) await page.goto(`${BASE}/?deck=${deck}&chrome=0&s=${i + 1}#${i + 1}`, { waitUntil: 'networkidle' })
    await page.waitForFunction((n) => window.__kimz?.index === n, i)
    await wait(i === 0 ? 10000 : 8000) // let entrance animations (and boot terminals) finish
    for (let k = 1; k < s.steps; k++) {
      await page.keyboard.press('ArrowRight') // walk build steps; capture the last one
      await wait(1500)
    }
    const file = path.join(dir, `${String(i + 1).padStart(2, '0')}-${s.id}.jpg`)
    await shot(file)
    gallery[deck].shots.push(path.relative(root, file).replace(/\\/g, '/'))
    console.log(`✓ ${deck} ${i + 1}/${meta.slides.length} ${s.id}`)
  }
}

const themeShots = []
mkdirSync(path.join(OUT, 'themes'), { recursive: true })
for (const t of themes) {
  await page.goto(`${BASE}/?deck=${THEME_SLIDE.deck}&theme=${t}&chrome=0#${THEME_SLIDE.n}`, { waitUntil: 'networkidle' })
  await wait(8000)
  const file = path.join(OUT, 'themes', `${t}.jpg`)
  await shot(file)
  themeShots.push({ t, file: path.relative(root, file).replace(/\\/g, '/') })
  console.log(`✓ theme ${t}`)
}
await browser.close()

// README gallery block between markers
const img = (src, alt) => `<img src="${src}" alt="${alt}" width="32%">`
let md = '### Every mode (press **T** in any deck to switch live)\n\n'
md += themeShots.map((s) => `<a href="${s.file}">${img(s.file, s.t)}</a>`).join('\n') + '\n\n'
md += themeShots.map((s) => `\`${s.t}\``).join(' · ') + '\n\n'
const filmsDir = path.join(OUT, 'films')
const films = existsSync(filmsDir) ? readdirSync(filmsDir).filter((f) => f.endsWith('.jpg')).sort() : []
if (films.length) {
  md += '### Remotion product films — `films/` (rendered stills)\n\n'
  md += films.map((f) => `<a href="docs/images/films/${f}">${img(`docs/images/films/${f}`, f)}</a>`).join('\n') + '\n\n'
}
for (const [deck, g] of Object.entries(gallery)) {
  md += `### ${g.title} — \`examples/${deck}\`\n\n`
  md += g.shots.map((f) => `<a href="${f}">${img(f, path.basename(f))}</a>`).join('\n') + '\n\n'
}
const readme = path.join(root, 'README.md')
const src = readFileSync(readme, 'utf8')
const START = '<!-- gallery:start -->'
const END = '<!-- gallery:end -->'
const next = src.includes(START) ? src.replace(new RegExp(`${START}[\\s\\S]*${END}`), `${START}\n${md}${END}`) : src.replace('## Gallery\n', `## Gallery\n\n${START}\n${md}${END}\n`)
writeFileSync(readme, next)
console.log(`\n✓ ${Object.values(gallery).reduce((n, g) => n + g.shots.length, 0)} slide shots + ${themeShots.length} theme shots → README`)
