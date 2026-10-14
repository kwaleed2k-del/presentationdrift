# Writing a custom slide

When no archetype fits (an "Arena" model race, a wizard simulation, an alert email popping in), write a component
with the engine primitives. Put it in `deck/slides/MySlide.tsx` and render it from `deck/deck.tsx`.

```tsx
import { motion } from 'motion/react'
import { useAccent, useStep, useTheme } from '@/engine/context'
import { Card, Grad, Kicker, Stage, Title, Toast } from '@/engine/ui'

export default function ModelRace() {
  const t = useTheme()            // tokens: t.ink, t.muted, t.a1, t.dark, t.brutal, t.radius…
  const [a, b] = useAccent()      // slide accent pair
  const step = useStep()          // if the slide is registered with `steps`
  return (
    <Stage className="gap-10">    {/* themed bg, grid, glows, px-20 py-16 column */}
      <Kicker label="The arena" />
      <Title>One prompt. <Grad>Zero opinions.</Grad></Title>
      <div className="grid flex-1 grid-cols-3 gap-8">
        {[…].map((m, i) => (
          <motion.div key={m.name} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 + i * 0.15 }}>
            <Card className="p-7">…</Card>
          </motion.div>
        ))}
      </div>
      <Toast className="bottom-16 right-20" icon="📊" title="Logged" body="quality · speed · cost" delay={6} />
    </Stage>
  )
}
```

## Primitives (`@/engine/ui`)
| Primitive | What |
|---|---|
| `Stage` | slide surface (bg gradient, grid, glows, padding). `bg={<Backdrop kind="rays" />}`, `pad="p-0"` to go edge-to-edge |
| `Kicker` | auto-numbered mono label with a drawing line |
| `Title`, `Grad` | display headline; accent text (gradient / brutal highlighter / italic serif) |
| `Bullets` | one-sentence bullets with pulsing dots |
| `Chip`, `Card`, `Toast` | pills, themed surfaces, spring pop-ups |
| `BrowserFrame`, `Img` | 1:1 screenshot in window chrome; exact-size image with ring |
| `Ring` | animated progress ring (WHOOP-style scores) |
| `Terminal` | typing terminal |
| `Sticker`, `Confetti`, `Banner` | die-cut stickers, falling confetti, giant scrolling outline text |
| `Reveal` | blur-up entrance wrapper (clears its filter at the end) |
| `Backdrop` (`@/engine/Backdrop`) | themed WebGL background |
| `AnimatedBeam`, `OrbitingCircles` (`@/components/ui/*`) | beams between nodes, orbiting items |
| React Bits (`@/components/*`) | SplitText, BlurText, DecryptedText, ShinyText, GradientText, RotatingText, GlitchText, TextType, CountUp, CircularText, CardSwap, TiltedCard, SpotlightCard, LogoLoop, ClickSpark, ElectricBorder… |

## Patterns that worked
- **Timelines inside a slide:** `useEffect` + `setTimeout`s that bump a local phase (`setT(1)…`) — clean them up in the return.
- **Narrated sequences:** register `steps: N` and switch on `useStep()` (a 10-step wizard sim, a carousel, an overlay email on step 2).
- **Overlay pop-in on a step:** `<AnimatePresence>{step >= 1 && <EmailCard key="mail" />}</AnimatePresence>` with a dimmed full-slide backdrop.
- **Race / progress:** `requestAnimationFrame` progress 0→1 per item, durations proportional to real timings.
- **Beams on a scaled stage:** `AnimatedBeam` already divides by the stage scale; pass refs as lazy getters (`{ get current() { return arr.current[i] } }`) because refs fill after commit.
- **Width budget:** the content box is 1760×~950 at 1920×1080. Add up widths before writing (`640 + 48 + 1072 ≤ 1760`) and estimate text as ~0.6 × font-size per character.
- **Keep hooks unconditional:** `const acc = useAccent(); const c = color ?? acc[0]` — never `color ?? useAccent()[0]`.
