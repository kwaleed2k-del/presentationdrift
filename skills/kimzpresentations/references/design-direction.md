# Design direction — every deck gets its own look

The modes, archetypes and examples are **raw material, not a house style**. Two different prompts must
produce two decks that look like they came from two different studios. This step comes right after the
style auditions (`style-auditions.md`): the brief below is written from the look the user picked, not invented again.

## 1. Write a design brief (5 lines, show it to the user)
Derive it from the prompt, the brand, the audience and the content — not from the defaults.
```
Audience & setting:  investors in a small room / 500 people at a conference / a client on Zoom
Feeling:             (2–3 words) e.g. "calm, clinical, trustworthy" · "loud, playful, street" · "quiet luxury"
Palette:             3 hexes + base (dark/light) — from the brand guide if there is one
Type pairing:        display + body (see pairings below)
Motion & surfaces:   motion: calm|snappy|cinematic|playful|standard · cards: glass|solid|outline|brutal · radius
Signature moment:    the ONE custom slide this deck will be remembered for (see §4)
```
If the user gave a brand: colours, fonts and tone come from it. If not, pick from the brief's feeling.

## 2. Turn the brief into a theme
```tsx
import { defineTheme } from '@/engine/theme'
export default defineDeck({
  title: 'Clinic Onboarding',
  fonts: ['DM Serif Display', 'Manrope'],
  theme: defineTheme('bright-clean', {
    label: 'Clinic Calm',
    a1: '#0f766e', a2: '#38bdf8', a3: '#f59e0b',
    bg: '#f7faf9', bg2: '#e6f4f1',
    fontDisplay: '"DM Serif Display", Georgia, serif', fontBody: '"Manrope", system-ui, sans-serif',
    displayWeight: 400, displayItalic: false, motion: 'calm', cardStyle: 'solid', radius: 14, glow: 0, grid: 0.12,
  }),
  slides: [...],
})
```
Start from the closest mode, then change at least **palette + fonts + motion + card style**. Only use a mode untouched when the user asked for that look.

### Feeling → starting points
| Feeling | Base | Motion | Cards | Backdrops | Notes |
|---|---|---|---|---|---|
| Trustworthy, clinical, finance | bright-clean | calm | solid | none / dots | serif or humanist display, lots of white space |
| Futuristic, AI, dev | neon-dark / aurora-glass | cinematic or snappy | glass | beams, threads, galaxy | mono labels, glows |
| Playful, consumer, food | colorful-pop | playful | brutal or solid | none | big emoji/illustration, chunky type |
| Luxury, fashion, hospitality | night-luxe | calm | outline | particles, silk | italic serif, tracking-wide labels, few words |
| Editorial, strategy, culture | minimal-mono | calm | outline | none | serif display, red/ink accent, asymmetric layouts |
| Energetic, sports, launch night | sunset-heat | snappy | glass | hyperspeed, plasma | uppercase titles (`titleCase: 'upper'`) |
| Nature, wellness, sustainability | bright-clean (custom greens/sand) | calm | solid | silk (light) | rounded radius 24+, soft shadows |
| Government, enterprise | bright-clean (navy/teal) | standard | solid | none | restrained, data-forward |

### Type pairings (Google Fonts names for `fonts:`)
| Display | Body | Feels |
|---|---|---|
| Space Grotesk | Inter | tech, default (avoid unless it fits) |
| DM Serif Display | Manrope | warm, trustworthy |
| Playfair Display | Source Sans 3 | classic, premium |
| Fraunces | Inter | editorial, literary |
| Syne | DM Sans | bold, creative studio |
| Clash-like: Archivo Black | Archivo | loud, poster |
| Bricolage Grotesque | Figtree | friendly modern |
| Instrument Serif | Geist (or Inter) | design-led, minimal |
| Bebas Neue | Barlow | sports, events (use `titleCase: 'upper'`) |
| Unbounded | Onest | playful futuristic |
| Cormorant Garamond | Montserrat | fashion, luxury |
| Sora | Noto Sans | clean product |
| IBM Plex Sans Arabic / Tajawal / Readex Pro | same | Arabic decks (`rtl: true`) |

Load with `fonts: [...]` (online) or `npm i @fontsource/<font>` + `import '@fontsource/<font>'` in deck.tsx (offline-safe — prefer for the real talk).

## 3. Compose, don't fill a template
- **Vary the structure.** Don't open every deck with TitleSlide + terminal. Openers can be a Statement, an Orbit, a WallOfWork, a Quote, a full-bleed photo, or a custom slide.
- **Mix archetype props**: `flip` on SplitSlide, `bg` choices, `cols/rows` on Bento, `size` on titles, per-slide `accent` pairs for chapters.
- **Pick backdrops for meaning**, max 2–3 kinds per deck, and many slides with none.
- **Reserve the drifting car, boot terminal, confetti and banners** for prompts where they fit (a "flex"/celebration/tech deck). They are not defaults.
- Never copy an example deck's content or slide order; examples only show what an archetype can do.

## 4. Build one signature moment
Every deck gets at least one **custom slide written for its content** (see `custom-slides.md`) — the thing people remember:
- a model race for an AI comparison · a live order board for a café · a map of branches lighting up for a retailer
- a timeline that scrubs through a product's history · a before/after of a real redesign · a wizard that walks the product's real steps
- a dashboard rebuilt as a live animated mock · a quote wall of real customer messages
Use the user's real data and assets. If they have none, ask for one artefact (a screenshot, a number, a photo) — it beats any effect.

## 5. Anti-sameness check (before showing the user)
- [ ] Three style auditions were shown, and the theme comes from the one the user picked (or their mix)
- [ ] Theme is custom (palette + fonts + motion + cards changed), or the user asked for a stock mode
- [ ] Not neon-dark + Space Grotesk by default
- [ ] Opener isn't the stock Title+terminal unless it fits
- [ ] At least one signature custom slide built from their content
- [ ] Backdrops chosen for meaning; plenty of calm slides
- [ ] Fun extras (car, confetti, stickers, banners) only if the tone calls for them
- [ ] It would not be mistaken for another deck made with this skill
