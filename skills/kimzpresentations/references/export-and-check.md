# Check it, then hand it over — `npm run check` and `npm run export`

Two commands in every deck. Both drive headless Chrome over the DevTools protocol with **no extra
dependencies** (Node 22+ and a Chrome or Edge install; `scripts/doctor.mjs` checks for both).

---

## `npm run check` — the layout audit

Walks every slide **and every build step** and fails on:

| kind | means |
|---|---|
| `overlap` | text sitting on top of other text |
| `off-stage` | text outside the 1920×1080 stage |
| `outside-box` | text escaping the `[data-box]` card it belongs to |
| `clipped` | more than a quarter of a line eaten by an `overflow:hidden` ancestor |
| `tiny-type` | type under 14px — unreadable on a projector |
| `small-type` | 14–17px — **advice, not a failure**; micro-labels legitimately live here |

```bash
npm run dev            # in one terminal
npm run check          # in another — audits http://localhost:5173
npm run check -- --build          # build first and audit dist/ instead
npm run check -- --settle 6000    # slower machine, heavy WebGL backdrop
npm run check -- --shots failures # write a jpg of every failing slide to export/check/
npm run check -- --verbose        # also list the small-type notes
```

Exit code is 1 when anything fails, so it can gate a commit. Slides marked `~` passed but carry
small-type advice.

**The same audit runs in the browser: press `L` on any slide.** Failing text gets a red outline and
a badge appears top-left. Press `L` again to clear.

### Mark decorative exceptions
Marquees, tickers and duplicated logo loops break these rules on purpose. Put `data-audit-skip` on
them (the attribute is inherited by everything inside) and the audit leaves them alone.

```tsx
<div data-audit-skip className="marquee">…</div>
```

### Mark your cards
`outside-box` only fires inside an element marked `data-box`. Add it to card/panel wrappers, and the
audit will tell you when a long string escapes the card instead of you finding out on the projector.

### Why it groups text by block
`SplitText`, `DecryptedText` and `CircularText` render **one span per character**, and at tight
tracking those spans overlap each other legitimately. The audit merges every inline run into its
nearest block-level ancestor and compares blocks, so character spans never cry wolf.
It does **not** skip `aria-hidden` text: React Bits marks the *visible* animated characters
aria-hidden and keeps an `.sr-only` copy for screen readers, so skipping it would make the audit
blind to every animated headline.

---

## `npm run export` — PDF, PowerPoint and stills

```bash
npm run export                          # builds, then writes export/
npm run export -- --url http://localhost:5173   # export a running dev server
npm run export -- --steps               # one page per build step, not just the finished slide
npm run export -- --only pdf            # or pptx, or images
npm run export -- --settle 6000         # counters and long entrances need longer
```

Writes into `export/`:

- **`<Deck Title>.pdf`** — one page per slide at **960×540 pt** (13.333×7.5 in), so it prints and
  imports at 1:1 with no scaling.
- **`<Deck Title>.pptx`** — the same frames as full-bleed pictures on 16:9 slides, with each slide's
  `notes` attached as **real PowerPoint speaker notes**. Opens in Office without a repair prompt.
- **`slides/01-<id>.jpg …`** — 1920×1080 stills for WhatsApp, LinkedIn or a one-pager.

### The pages are frames, not vector text
The text in the PDF is **not selectable**, and that is deliberate. Printing the live DOM instead
would flatten every animation to its initial state (opacity 0) and `background-clip:text` gradient
headlines print as a visible box outline. Frames are what the audience actually saw.
Say this plainly when handing the file over.

### Settle time is the thing to tune
Each slide is loaded fresh (a hash change alone does not reload, so entrance animations would be
caught mid-transition) and then given `--settle` ms before the shot. If a `CountUp` stat still reads
0 or a boot terminal is half-typed in the export, raise it. Default 3500 ms; CI without a GPU needs
8000+.

### Notes travel only from a deck built on this engine
`notes` reach the PPTX through `window.__kimz`. A deck scaffolded before this version exports fine,
but with empty notes — copy the current `src/engine/Deck.tsx` and `src/engine/audit.ts` into it to
get notes and the `L` audit.
