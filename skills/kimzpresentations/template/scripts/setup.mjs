// Installs React Bits components from their official shadcn registry.
// React Bits is MIT + Commons Clause, so this repo installs them on your machine instead of redistributing them.
import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'

const COMPONENTS = [
  // text
  'SplitText', 'BlurText', 'DecryptedText', 'ShinyText', 'GradientText', 'RotatingText', 'GlitchText', 'TextType', 'CountUp', 'CircularText', 'ScrambledText',
  // backgrounds (WebGL / canvas)
  'Aurora', 'Hyperspeed', 'LightRays', 'Galaxy', 'DarkVeil', 'Threads', 'Particles', 'Orb', 'Silk', 'Iridescence', 'Beams', 'Plasma', 'DotGrid',
  // components
  'SpotlightCard', 'TiltedCard', 'CardSwap', 'CircularGallery', 'LogoLoop', 'ClickSpark', 'ElectricBorder', 'StarBorder', 'MagicBento',
]

const only = process.argv.slice(2)
const list = only.length ? only : COMPONENTS
let ok = 0
for (const name of list) {
  if (existsSync(`src/components/${name}.tsx`)) {
    ok++
    continue
  }
  try {
    execSync(`npx --yes shadcn@latest add @react-bits/${name}-TS-TW -y -o`, { stdio: 'pipe' })
    ok++
    console.log(`✓ ${name}`)
  } catch (e) {
    console.log(`✗ ${name}: ${String(e.stderr ?? e).split('\n')[0]}`)
  }
}
console.log(`\n${ok}/${list.length} React Bits components ready in src/components/`)
