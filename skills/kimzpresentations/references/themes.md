# Themes & backdrops

Set once in `deck/deck.tsx`: `theme: 'neon-dark'`. Press **T** while presenting to cycle every mode live
(great for letting a client pick), or force one with `?theme=night-luxe` in the URL.

## The modes

| id | Feel | Use for |
|---|---|---|
| `neon-dark` | Black, cyan/violet/pink glows, grotesk type | Tech talks, AI products, "flex" decks, demo days |
| `aurora-glass` | Deep navy, green/blue/pink aurora, glass cards | Startup pitches, SaaS, futuristic but calm |
| `sunset-heat` | Dark red-black, orange/rose/yellow | Energy, marketing, sports, launches at night |
| `bright-clean` | Off-white, blue/violet/orange, soft shadows | Board meetings, quarterly reviews, clients who print |
| `colorful-pop` | Cream, hot pink/violet/teal, **brutal** ink borders + offset shadows | Consumer apps, playful launches, food, retail |
| `minimal-mono` | Paper, ink, italic serif, one red accent | Essays, strategy, editorial, design-led talks |
| `night-luxe` | Black, gold, italic serif | Luxury, fashion, premium brands, award nights, thank-yous |
| `brand` | `brandTheme(['#hex1', '#hex2', '#hex3'], { dark: true })` | Any company deck — pull the hexes from the brand guidelines |

```tsx
import { brandTheme } from '@/engine/theme'
theme: brandTheme(['#7C3AED', '#F59E0B', '#1E1B4B'], { dark: true, label: 'Acme' })
```
`brandTheme` keeps the base mode's fonts/radius and derives `bg`/`bg2` from the brand colours. Pass `base: 'colorful-pop'` (etc.) to inherit a different personality.

## Tokens (what archetypes read)
`bg bg2 surface border ink muted a1 a2 a3 glow grid fontDisplay fontBody fontMono displayWeight displayItalic radius brutal dark`
- In components: `const t = useTheme()` and `const [a, b] = useAccent()` (slide accent, else theme a1/a2).
- In CSS/className: `var(--k-bg)`, `var(--k-ink)`, `var(--k-a1)`, `var(--k-font-display)` …
- Per-slide accent override: `{ id, accent: ['#facc15', '#22d3ee'], render }` — recolours the kicker, bullets, progress bar and footer for that slide only (e.g. a brand section inside a personal deck).

Add a new mode by adding an entry to `THEMES` in `src/engine/theme.ts` — every archetype picks it up.

## Backdrops (`bg=` on Title/Statement/Finale, or `<Backdrop kind=… />` in custom slides)
`none · hyperspeed · aurora · rays · galaxy · veil · threads · particles · silk · iridescence · beams · plasma · dots`

All are React Bits WebGL/canvas effects tinted from the theme. **One per slide** — each is a WebGL context; only the current slide is mounted, so contexts are released when you move on.

| Backdrop | Mood |
|---|---|
| hyperspeed | launch, speed, "boot" openers |
| aurora | calm premium, finales |
| rays | spotlight statements, reveals |
| galaxy | vision, big-picture, covers |
| veil / silk | soft luxury, emotional slides |
| threads | elegant motion behind text-heavy slides |
| particles | celebrations, thank-yous, luxe |
| iridescence / plasma | bold brand moments |
| beams | tech, infrastructure |
| dots | interactive grids, playful |

Light modes (`bright-clean`, `minimal-mono`, `colorful-pop`) look best with `bg="none"` or subtle `dots`; heavy WebGL on cream rarely helps.
