#!/usr/bin/env node
// KimzPresentations setup check. Prints ✓ / ✗ with the exact fix for this OS.
//   node <skill>/scripts/doctor.mjs                 check everything
//   node <skill>/scripts/doctor.mjs --mark 21st      remember "21st.dev account created"
// State lives in ~/.kimzpresentations.json (no secrets are stored there).
import { execSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const STATE = path.join(os.homedir(), '.kimzpresentations.json')
const state = existsSync(STATE) ? JSON.parse(readFileSync(STATE, 'utf8')) : {}
const markIdx = process.argv.indexOf('--mark')
if (markIdx > -1) {
  const what = process.argv[markIdx + 1]
  state[what] = new Date().toISOString().slice(0, 10)
  writeFileSync(STATE, JSON.stringify(state, null, 2))
  console.log(`✓ remembered: ${what}`)
  process.exit(0)
}

const plat = process.platform // win32 | darwin | linux
const fix = (win, mac, linux) => (plat === 'win32' ? win : plat === 'darwin' ? mac : linux)
const run = (cmd) => {
  try {
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'], timeout: 30000 }).toString().trim()
  } catch {
    return null
  }
}
const rows = []
const check = (name, ok, detail, howToFix, required = true) => rows.push({ name, ok, detail, howToFix, required })

// ── tools ─────────────────────────────────────────────
const nodeMajor = Number(process.versions.node.split('.')[0])
check('Node.js ≥ 20', nodeMajor >= 20, `v${process.versions.node}`, fix('winget install OpenJS.NodeJS.LTS', 'brew install node', 'https://nodejs.org (or nvm install --lts)'))
const npmV = run('npm --version')
check('npm', !!npmV, npmV ?? 'missing', 'comes with Node.js')
const git = run('git --version')
check('git', !!git, git ?? 'missing', fix('winget install Git.Git', 'xcode-select --install', 'sudo apt install git'))
const py = run('python --version') ?? run('python3 --version')
const pyCmd = run('python --version') ? 'python' : 'python3'
check('Python 3', !!py, py ?? 'missing', fix('winget install Python.Python.3.12', 'brew install python', 'sudo apt install python3 python3-pip'))
const pil = py && run(`${pyCmd} -c "import PIL; print(PIL.__version__)"`)
check('Pillow (screenshot/photo scripts)', !!pil, pil ?? 'missing', `${pyCmd} -m pip install pillow`)
const ff = run('ffmpeg -version')
check('ffmpeg (video encoding)', !!ff, ff ? ff.split('\n')[0].split(' ').slice(0, 3).join(' ') : 'missing', fix('winget install Gyan.FFmpeg', 'brew install ffmpeg', 'sudo apt install ffmpeg'))

// ── accounts / integrations ───────────────────────────
// React Bits: no account. Installed per deck by `npm run setup`.
check('React Bits', true, 'no account needed — `npm run setup` installs components', '', false)

const mcp = run('claude mcp list')
const magicLine = mcp?.split('\n').find((l) => /^magic|21st/i.test(l))
const magicOk = !!magicLine && /connected/i.test(magicLine)
check('21st.dev Magic MCP', magicOk, magicLine ? (magicOk ? 'connected' : 'added but not connected') : state['21st'] ? 'account created, MCP not added yet' : 'not set up', 'follow references/onboarding.md → "21st.dev"', false)

check('Remotion (product films)', true, 'no sign-in needed — `cd films && npm install && npm run studio`', '', false)

// ── report ────────────────────────────────────────────
let missingRequired = 0
for (const r of rows) {
  const icon = r.ok ? '✓' : r.required ? '✗' : '○'
  if (!r.ok && r.required) missingRequired++
  console.log(`${icon} ${r.name.padEnd(36)} ${r.detail}${!r.ok && r.howToFix ? `\n    → ${r.howToFix}` : ''}`)
}
console.log(missingRequired ? `\n${missingRequired} required item(s) missing.` : '\nReady to build decks. (○ = optional, set up when you need it)')
process.exit(missingRequired ? 1 : 0)
