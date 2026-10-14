#!/usr/bin/env node
// Scaffold a new KimzPresentations deck.
//   node <skill>/scripts/new-deck.mjs <target-dir> [--theme neon-dark] [--title "My Deck"] [--with-examples]
// Copies the template (without node_modules/dist), writes a starter deck, then prints next steps.
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const template = path.resolve(here, '../template')
const args = process.argv.slice(2)
const target = args.find((a) => !a.startsWith('--'))
const opt = (k, d) => {
  const i = args.indexOf(`--${k}`)
  return i >= 0 ? args[i + 1] : d
}
if (!target) {
  console.error('usage: new-deck.mjs <target-dir> [--theme <mode>] [--title "Deck title"] [--with-examples]')
  process.exit(1)
}
const dest = path.resolve(target)
if (existsSync(path.join(dest, 'package.json'))) {
  console.error(`✗ ${dest} already has a package.json — pick an empty folder`)
  process.exit(1)
}
mkdirSync(dest, { recursive: true })
const withExamples = args.includes('--with-examples')
cpSync(template, dest, {
  recursive: true,
  filter: (src) => {
    const rel = path.relative(template, src).replace(/\\/g, '/')
    if (rel.startsWith('node_modules') || rel.startsWith('dist')) return false
    if (!withExamples && rel.startsWith('examples/')) return false
    // React Bits sources are installed per machine by `npm run setup` (license: MIT + Commons Clause)
    if (/^src\/components\/[A-Z][^/]*\.tsx$/.test(rel)) return false
    return true
  },
})
if (!withExamples) mkdirSync(path.join(dest, 'examples'), { recursive: true })

const theme = opt('theme', 'neon-dark')
const title = opt('title', 'My Deck')
const deckFile = path.join(dest, 'deck', 'deck.tsx')
writeFileSync(deckFile, readFileSync(deckFile, 'utf8').replace("title: 'Your Deck'", `title: ${JSON.stringify(title)}`).replace("  theme: 'neon-dark',", `  theme: '${theme}',`))
const pkg = JSON.parse(readFileSync(path.join(dest, 'package.json'), 'utf8'))
pkg.name = path.basename(dest).toLowerCase().replace(/[^a-z0-9-]+/g, '-')
writeFileSync(path.join(dest, 'package.json'), JSON.stringify(pkg, null, 2) + '\n')

console.log(`✓ deck scaffolded in ${dest}

next:
  cd ${JSON.stringify(dest)}
  npm install
  npm run setup      # installs React Bits components
  npm run dev        # edit deck/deck.tsx — the browser updates live
  npm run present    # production build for the real talk`)
