# Archetype catalog

Import from `@/archetypes`. Every archetype reads only theme tokens, so it works in all modes.
Props marked `?` are optional. `ReactNode` props accept strings or JSX (e.g. `<b className="text-white">`).

## Contents
- Openers: TitleSlide, AgendaSlide, OrbitSlide, WallOfWorkSlide
- Story: StatementSlide, SplitSlide, CompareSlide, JourneySlide, QuoteSlide
- Product: ProcessSlide, BentoSlide, RingCarouselSlide, ScreenshotSlide, LiveTableSlide, TerminalSlide, VideoWallSlide
- Proof: StatsSlide, ChartSlide
- People + endings: PeopleSlide, FinaleSlide
- Picking the right one (decision table at the bottom)

---

## TitleSlide
Opener. Optional typing terminal "boots" the deck, then the title decrypts in (RTL titles fade instead).
```tsx
<TitleSlide title="ORBIT LABS" subtitle="Your calendar, on autopilot." kicker="seed round"
  chips={['AI scheduling', 'Focus time']} bg="aurora" size={180}
  terminal={[{ text: 'kimz --present', kind: 'cmd' }, { text: '✓ ready', kind: 'ok' }]} />
```
`bg`: any `BackdropKind` (see themes.md). Keep titles ≤ ~14 characters at size 180, otherwise lower `size`.

## AgendaSlide — `steps: items.length`
Chapters list; each → highlights the next item.
```tsx
{ id: 'agenda', steps: 4, render: () => <AgendaSlide title="Four things" accent="in 20 minutes." items={[{ title: 'Numbers', sub: 'what moved' }, …]} /> }
```

## OrbitSlide
"Who I am / what powers this": centre (photo, logo, emoji) inside a gradient ring, two counter-rotating rings of tool pills, headline with a rotating verb, bullets.
```tsx
<OrbitSlide center={<img src="/me.jpg" className="size-full object-cover" />} inner={['Claude', 'GPT']}
  outer={['React', 'Figma', …8]} heading="I don’t just use AI." lead="I" words={['build', 'ship', 'film']} after="with it." bullets={[…]} />
```
Inner ring ≤ 5 pills, outer ≤ 8 — more and they collide.

## WallOfWorkSlide
Tilted 3D wall of 4 rows scrolling in opposite directions, headline + chips in the middle. Show *everything you made*.
Tiles: `{ w, image? | video? | label?: { t, sub?, from, to } | node? }` — height is fixed at 250, so `w` sets the aspect (200 ≈ 4:5 post, 444 ≈ 16:9, 520 for wide screens).
```tsx
<WallOfWorkSlide line1="Everything you see," line2="I built or made." chips={[…]} rows={[[…], […], […], […]]} />
```

## StatementSlide
One huge line + shimmering second line, optional cards row and a mono punchline. Use for problems, beliefs, chapter openers.
```tsx
<StatementSlide kicker="The problem" line1="Meetings eat the week" line2="and nobody chose that."
  cards={[{ icon: '📅', text: '…' }, …3]} punchline="So we built… →" bg="rays" />
```

## SplitSlide — the workhorse
Headline + 3–4 one-sentence bullets on one side, a visual on the other, optional pop-up toasts.
```tsx
<SplitSlide kicker="Meet the app" title="Order in three taps." accent="Pick up in three minutes." leftWidth={560}
  bullets={[…]} visual={{ kind: 'screenshot', src: '/shots/app.png', w: 1120, h: 532, url: 'app.com' }}
  toasts={[{ icon: '☕', title: 'Your latte is ready', body: '…', at: '-bottom-10 right-10' }]} flip={false} />
```
`visual.kind`: `screenshot` (in a browser frame), `image`, `video`, `custom` (any node). Width budget: `leftWidth + 56 + visual width ≤ 1760`.

## CompareSlide
Either an auto-sweeping **before/after slider** (`images: { before, after, w, h }` + bullets) or **two columns** (`columns: { left: {label, items}, right: {label, items} }` — left gets ✕ and strikethrough, right gets ✓).

## JourneySlide
A glowing path draws through 3–7 stops while a comet rides it; then a quote and a shimmering sign-off. "From X to Y" stories, careers, thank-yous to a leader.
```tsx
<JourneySlide title="From chat" accent="to production." stops={[{ icon: '💬', t: 'Chatbot', s: 'copy-paste' }, …]}
  quote={<>The tools changed. <span style={{ color: 'var(--k-a1)' }}>The discipline made it work.</span></>}
  signoff="Thank you." aside={<Photo … />} />
```
`aside` (e.g. a photo) shrinks the path to 1180px so both fit.

## QuoteSlide
Giant quote mark, the quote word-by-word, attribution with optional avatar. **Real quotes only.** If you don't have one, label it `author="Example quote"`.

## ProcessSlide
Pipeline / how-it-works: a light runs along the track and each of 3–7 steps pops as it passes. Optional bullets underneath and a toast.
```tsx
<ProcessSlide title="Connect once." accent="Orbit does the rest." steps={[{ icon: '🔗', title: 'Connect', sub: 'Google · Outlook' }, …]}
  bullets={[…]} toast={{ icon: '✓', title: 'CI passed', body: '…' }} />
```

## BentoSlide
Feature grid (default 4 cols × 2 rows). Cards: `{ tag?, title, line?, color?, span?, rowSpan?, media?: { image | video | emoji | node } }`. Spans let hero cards stretch; make the spans add up to `cols × rows`.

## RingCarouselSlide — `steps: items.length`
3D ring of screenshots; each → spins to the next and swaps the caption. The front card renders 1:1 (sharp) — give it images cropped to exactly `w×h` (default 1120×532).
```tsx
{ id: 'pages', steps: 7, render: () => <RingCarouselSlide title="A whole lab," accent="seven pages." items={[{ name: 'Overview', what: 'dashboard', line: '…', src: '/shots/overview-1120x532.png' }, …]} /> }
```
Items without `src` can pass `node` (a hand-built mock).

## ScreenshotSlide
"Exploded UI": 1–3 crops at native size, each with pulsing highlight boxes + labels, and a features column (≤ 7). Total width: 400 (features) + 40 + sum(piece widths) + gaps ≤ 1760.
```tsx
<ScreenshotSlide title="Canva," accent="inside our app." badge="live on staging"
  features={[['🔤', 'Arabic-aware text'], …]}
  pieces={[{ src: '/shots/canvas-565x700.png', w: 565, h: 700, highlights: [{ x: 132, y: 518, w: 108, h: 34, label: 'Remove background' }] }]} />
```

## LiveTableSlide
Rebuilds an admin/product table as an animated mock when there are no screenshots (or to show it *working*): rows slide in, then timed events change cells, flash `+50`/`−20`, flip status pills, fire toasts. **Mask real data** and pass `note="illustrative data"`.
```tsx
<LiveTableSlide columns={['User', 'Plan', 'Credits']} rows={[[…], …]} status={{ text: 'ACTIVE', color: '#22c55e' }}
  events={[{ at: 1.6, row: 1, col: 2, value: 370, flash: '+50' }, { at: 4.4, row: 4, status: { text: 'BANNED', color: '#ef4444' }, toast: { icon: '⛔', title: 'User banned' } }]} />
```

## TerminalSlide
Headline + bullets beside a typing terminal (`kind: 'cmd'` types out; `ok | info | warn | dim` print). Dev talks, CLI products, "how I work" engineering slides.

## VideoWallSlide
2–4 clips playing together, muted, from 0. **Encode first** with `scripts/encode-video.sh` (540p, yuv420p, keyframe every 0.5 s). `width` 720 for a 2×2 wall at 1080p.

## StatsSlide
Big animated numbers in cards; `ring: 0..100` shows a progress ring instead. **Real, flattering numbers only** — a weak number on a big screen hurts more than no number. Label demo data.

## ChartSlide
Hand-drawn SVG bars (no chart library) with one `highlight` bar that carries the story, plus takeaway bullets.

## PeopleSlide
Thank-you / team / testimonial: text left (or any `left` node), photo board right (1, 2, or 5 = 1 big + 4 small), die-cut stickers on the board's edges, confetti and a scrolling "THANK YOU ✦ NAME" banner. Photos without `src` show a glowing initial (placeholder).
```tsx
<PeopleSlide person={{ name: 'Loay', tag: 'Always at my back', lines: ['…', '…'] }}
  photos={[{ src: '/people/loay-1.jpg', name: 'Loay' }, …]}
  stickers={[{ e: '🛠️', t: 'production hero', r: -9, pos: { top: -26, left: 200 } }]} />
```
Prepare photos with `scripts/assets.py portrait` (9:16, 900 wide). One person (or pair) per slide reads better than a crowded grid.

## FinaleSlide
Last slide: line 1 flies in letter by letter (word-level for RTL), line 2 in an animated gradient, sign-off, click sparks, optional `car` — a neon car drifting laps around the text with tyre smoke and skid marks.

---

## Decision table

| You want to say… | Use |
|---|---|
| "Here's who we are / what this is" | TitleSlide → OrbitSlide or WallOfWorkSlide |
| "There's a problem / we believe…" | StatementSlide |
| "Here's the thing, and here's proof" | SplitSlide |
| "It works in N steps" | ProcessSlide |
| "It does many things" | BentoSlide |
| "Look at the real product" | RingCarouselSlide (many screens) · ScreenshotSlide (one screen, point at parts) |
| "Watch it work" | LiveTableSlide (admin/data) · TerminalSlide (dev) · VideoWallSlide (films) |
| "Old way vs new way" | CompareSlide |
| "The numbers" | StatsSlide · ChartSlide (trend) |
| "From where we were to where we are" | JourneySlide |
| "Someone said it best" | QuoteSlide |
| "Thank you, people" | PeopleSlide (one per person or pair) |
| "Goodbye" | FinaleSlide |

Nothing fits? Write a custom slide with the engine primitives — see `custom-slides.md`.
