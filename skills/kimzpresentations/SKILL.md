---
name: kimzpresentations
description: Build cinematic, animation-heavy presentations as React web decks — neon, bright, colourful, minimal, luxe or any brand's colours — with a 20-archetype slide library (title boot terminals, 3D carousels, journeys, live UI mocks, video walls, stats, thank-you slides with stickers, drifting-car finales), a presenter engine (keyboard nav, build steps, theme switching, notes, overview) and a crisp-asset pipeline for screenshots, logos, photos and video. Use this whenever someone wants a presentation, deck, slides, keynote, pitch deck, demo day deck, product launch, QBR/quarterly review, tech talk, team showcase, "how I work" deck, thank-you slides, or wants slides that are animated, "sick", "wow", "flex", colourful or on-brand — even if they don't say "React" and even if they only paste content, screenshots or a brand PDF. Also use it to restyle or upgrade an existing deck.
---

# KimzPresentations

Turns content into a 1920×1080 React deck that runs in the browser, full screen, with motion on every slide.
The skill ships a **template** (engine + themes + archetypes), **8 example decks**, **scripts** for assets, and **references**.

```
SKILL/
  template/            ← the deck app (copy it per deck)
    deck/deck.tsx      ← THE file you write: defineDeck({ title, theme, slides })
    src/archetypes/    ← 20 slide archetypes (read references/archetypes.md)
    src/engine/        ← Deck (presenter), theme modes, ui primitives, Backdrop, Gallery
    examples/          ← 8 synthetic decks: startup-pitch, tech-talk, product-launch, quarterly-report,
                          luxury-brand, editorial-minimal, arabic-rtl, brand-colors
  films/               ← Remotion project: themed ProductFilm (hook → features → screen → stats → CTA)
  scripts/             ← doctor.mjs (setup check) · new-deck.mjs · assets.py · encode-video.sh
  references/          ← archetypes · themes · assets · content · custom-slides · rtl · pitfalls
                          design-direction · react-bits · 21st-dev · films · onboarding
```

## Workflow

### 0. First time for this person? Onboard them
Run `node SKILL/scripts/doctor.mjs` at the start of a session. If anything required is ✗, or `~/.kimzpresentations.json` doesn't exist yet (first use), walk them through `references/onboarding.md` **one step at a time**: machine tools → React Bits (nothing to sign up) → 21st.dev account + Magic MCP → Remotion (nothing to sign up) → first deck together. Keys are typed by the user (`! claude mcp add …`), never pasted into chat. Optional items (○) can wait until a deck needs them.

### 1. Understand the talk (ask only what you can't infer)
Audience and goal · length (≈1 slide/minute) · mode or brand colours · language/RTL · where the assets are (folder of screenshots, videos, photos, brand PDF) · presenting live in a browser (default) or also exporting.
If the user dumps content and says "go", infer and move — state your assumptions in one line.

### 1b. Design direction — the user's prompt decides the look
Every deck must look like it was designed for *this* prompt, not like the last deck. Read `references/design-direction.md`, write the 5-line design brief (audience, feeling, palette, type pairing, motion + card style, signature moment), show it to the user in a few lines, then build a custom theme with `defineTheme(base, { …overrides })` and `fonts: [...]`. Stock modes are starting points; the examples are not templates.

### 2. Scaffold
```bash
node SKILL/scripts/new-deck.mjs ~/my-deck --theme neon-dark --title "My Deck"
cd ~/my-deck && npm install && npm run setup     # setup installs React Bits components
npm run dev                                       # http://localhost:5173 — edits hot-reload
```
Keep decks outside synced folders (OneDrive/Dropbox) — `node_modules` sync thrashes. Use the repo's own git.

### 3. Outline → archetypes
Write the outline as one line per slide, then map each to an archetype with the decision table in `references/archetypes.md`. Story shapes for pitches, launches, reports, talks and showcases are in `references/content.md`. Share the outline briefly before building everything if the user hasn't seen the plan.

### 4. Prepare assets (this is where decks usually look cheap)
Read `references/assets.md`. Short version: **crop screenshots to the part that matters at native pixels and show them 1:1**; logos via `assets.py logo`; photos via `assets.py portrait`; every video through `encode-video.sh`. Look at each asset (read the image) before placing it — check for emails, internal URLs, keys, weak numbers, confidential marks.

### 4b. Components: React Bits first, 21st.dev for anything missing
The deck already has 33 React Bits components (text effects, 12 WebGL backdrops, cards) — catalog and gotchas in `references/react-bits.md`; add more with `npm run setup -- <Name>`.
If a slide needs something that isn't there (pricing table, globe, testimonial marquee, device mockup), **search 21st.dev** — with the Magic MCP (`mcp__magic__search` → `get_usage` → `get_component`; free tier = 2 retrievals/day) or the site — then re-theme it with tokens. Procedure: `references/21st-dev.md`.

### 4c. Films: make the videos the deck shows (Remotion)
No product video yet, or want one in the deck's colours? Copy `SKILL/films`, fill `src/film.config.ts` (scenes: hook, features, screen push-in, stats, CTA; brand hexes = deck theme), preview with `npm run studio`, render only when the user says go, then `encode-video.sh` it into `deck/public/vid/`. Details: `references/films.md`. Load the Remotion agent skills if installed for captions, voiceover, audio.

### 5. Build `deck/deck.tsx`
```tsx
import { TitleSlide, SplitSlide, FinaleSlide } from '@/archetypes'
import { defineDeck } from '@/engine/types'
import { defineTheme } from '@/engine/theme'
export default defineDeck({
  title: 'Orbit Labs · Seed',
  fonts: ['Syne', 'DM Sans'],            // any Google Fonts pairing from the design brief
  theme: defineTheme('aurora-glass', {   // custom per deck: palette, fonts, motion, cards…
    a1: '#34d399', a2: '#818cf8', a3: '#f472b6',
    fontDisplay: '"Syne", sans-serif', fontBody: '"DM Sans", sans-serif',
    motion: 'snappy', cardStyle: 'outline', radius: 18,
  }),
  slides: [
    { id: 'title', section: 'Intro', render: () => <TitleSlide title="ORBIT LABS" subtitle="…" bg="aurora" /> },
    { id: 'pages', section: 'Product', steps: 5, render: () => <RingCarouselSlide … /> },   // → walks 5 steps
    { id: 'end', render: () => <FinaleSlide line1="…" line2="…" car /> },
  ],
})
```
Compose from the archetypes directly; the `template/examples/` decks are optional references, not starting points to copy. Need something no archetype covers? Write a custom slide (`references/custom-slides.md`) — e.g. a model race, a wizard simulation, an alert email popping in.

### 6. Check-in early
After the first 3–4 hero slides, give the user the localhost link and ask for a vibe check before building the rest. Users react to motion and colour, not outlines.

### 7. Verify before saying done
- `npx tsc -p tsconfig.app.json --noEmit` and `npm run build` pass.
- Walk every slide forward and back (→/←), including all steps. If a browser tool is available, screenshot slides and look at them; otherwise say plainly that you verified by build only and list what to eyeball.
- Run the `references/pitfalls.md` checklist — especially overflow arithmetic, lingering blur filters, 1:1 assets, Tailwind `@utility` animations, RTL letter-splitting.
- Facts check: no invented numbers, quotes, features or names; placeholders look like placeholders.

### 8. Present
`npm run present` (production build on :5200). Keys: **→/Space** next · **←** back · **F** fullscreen · **H** hide chrome · **O** overview · **T** cycle themes · **N** speaker notes · `#7` in the URL jumps to slide 7, `?theme=night-luxe` forces a mode.

## Modes at a glance
`neon-dark` · `aurora-glass` · `sunset-heat` · `bright-clean` · `colorful-pop` (brutal) · `minimal-mono` (editorial serif) · `night-luxe` (gold serif) · `brandTheme([...])`. Details and backdrops: `references/themes.md`. Show the gallery to let people pick: `npm run gallery` → `?deck=<example>` then press **T**.

## Taste rules (why decks made with this feel produced)
- **No two decks alike.** The design comes from the prompt: custom palette, fonts, motion personality and card style every time; at least one signature custom slide; extras (drift car, boot terminal, confetti, stickers) only when the tone calls for them. Run the anti-sameness check in `design-direction.md`.
- Every slide has one hero motion moment, plus 2–3 small ones. Not everything moves at once.
- One-sentence bullets, two-beat headlines (plain + accent), one idea per slide.
- Pop-ups (Toast), stickers and counters make claims feel alive — attach them to real proof points.
- Section covers before each chapter; leaders and finales get the biggest effects.
- Colour comes from the theme. Don't hard-code hex in slides — use `useTheme()`/`useAccent()` or `var(--k-*)` so **T** still re-skins everything.
- Readability beats spectacle: if text and an effect fight, the effect loses.

## Licensing note
React Bits components are MIT + Commons Clause — `npm run setup` installs them from the official registry on each machine; they're git-ignored, never committed. Magic UI's Animated Beam and Orbiting Circles (MIT) are bundled in `src/components/ui/`.
