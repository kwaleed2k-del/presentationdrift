# PresentationDrift ✦ — the KimzPresentations skill

**A Claude Code skill that builds cinematic, animation-heavy presentations** in any style — neon, bright, colourful, minimal, luxe, or your brand's own colours.
Give Claude your content (or a folder of screenshots, videos, photos and a brand PDF) and it composes a 1920×1080 React deck from a library of 20 animated slide archetypes, runs it in your browser, and presents it full screen.

> Born from a real "How I Work" deck — every pitfall hit along the way is written into the skill so your deck doesn't hit it.

---

## Powered by

| | What it does in KimzPresentations |
|---|---|
| **[React Bits](https://reactbits.dev)** | The motion layer: **33 components**. Text effects (DecryptedText, SplitText, BlurText, ShinyText, GradientText, RotatingText, GlitchText, CountUp…), **12 WebGL backdrops** (Hyperspeed, Aurora, LightRays, Galaxy, Threads, Particles, Silk, Iridescence, Beams, Plasma, DarkVeil, DotGrid) and components (ClickSpark, ElectricBorder, CardSwap, TiltedCard, LogoLoop…). Installed per machine by `npm run setup`. → [`references/react-bits.md`](skills/kimzpresentations/references/react-bits.md) |
| **[21st.dev](https://21st.dev)** | Component registry. Bundled: Magic UI **Animated Beam** + **Orbiting Circles**. With the **21st.dev Magic MCP** connected, Claude searches 21st.dev for whatever a slide needs (pricing tables, globes, marquees, mockups), pulls it and re-themes it. → [`references/21st-dev.md`](skills/kimzpresentations/references/21st-dev.md) |
| **[Remotion](https://remotion.dev)** | **Product films** for your video walls: a themed `ProductFilm` composition (hook → features → screenshot fly-through → stats → CTA) driven by a JSON config, previewed in Remotion Studio. → [`films/`](skills/kimzpresentations/films) |
| **[Motion](https://motion.dev)** | Every entrance, spring, build step and 3D carousel. |
| **Tailwind v4 · Vite · React 19** | The deck app. |

---

## Install
In Claude Code (terminal):
```
/plugin marketplace add kwaleed2k-del/presentationdrift
/plugin install kimzpresentations@presentationdrift
```
Or as a personal skill:
```bash
git clone https://github.com/kwaleed2k-del/presentationdrift.git
cp -r presentationdrift/skills/kimzpresentations ~/.claude/skills/
```

**First run:** just ask Claude for a deck. On first use it runs a setup check and walks you through everything, one step at a time:
1. machine tools (Node, Python + Pillow, ffmpeg)
2. **React Bits**: nothing to sign up, installed automatically
3. **21st.dev**: create a free account, add the Magic MCP (you type the key, never in chat)
4. **Remotion**: nothing to sign up, product films run locally
5. your first deck, live in the browser

Run the check yourself any time: `node ~/.claude/plugins/…/skills/kimzpresentations/scripts/doctor.mjs` (Claude knows the path).

Then just ask: *"make me a pitch deck for …"*, *"turn these screenshots into a launch presentation, colourful"*, *"build a thank-you section for my team"*.

**Requirements:** Node 20+, npm, Python 3 + Pillow (asset scripts), ffmpeg (video script).

---

## What's inside

| | |
|---|---|
| **Presenter engine** | keyboard nav, build **steps**, `#7` deep links, **F** fullscreen, **H** hide chrome, **O** overview, **T** cycle themes live, **N** speaker notes |
| **7 modes + brand** | `neon-dark` · `aurora-glass` · `sunset-heat` · `bright-clean` · `colorful-pop` · `minimal-mono` · `night-luxe` · `brandTheme(['#hex', …])` |
| **20 archetypes** | Title (boot terminal) · Statement · Split · Bento · Process · Stats · Chart · Compare (sweep slider) · 3D Ring Carousel · Screenshot (exploded 1:1 UI) · Live Table mock · Terminal · Video Wall · Journey path · Orbit · Wall of Work · Quote · Agenda · People (photos + stickers + confetti) · Finale (drifting car) |
| **Remotion films** | `films/` makes themed product films (hook, features, screenshot push-in, counting stats, CTA) from one config, preview in Remotion Studio, encode for the video wall |
| **21st.dev Magic MCP** | Claude searches 21st.dev for any missing component and re-themes it for your deck |
| **12 animated backdrops** | hyperspeed, aurora, rays, galaxy, veil, threads, particles, silk, iridescence, beams, plasma, dots |
| **Asset scripts** | crop screenshots to 1:1, blur secrets, cut out logos, 9:16 portraits, pre-resize, encode videos that never stutter |
| **8 example decks** | startup pitch · tech talk · product launch · quarterly report · luxury brand · editorial · Arabic RTL · brand colours |
| **RTL** | Arabic decks with correct letter joining (no per-letter effects on Arabic) |

## Gallery

<!-- gallery:start -->
### Every mode (press **T** in any deck to switch live)

<a href="docs/images/themes/neon-dark.jpg"><img src="docs/images/themes/neon-dark.jpg" alt="neon-dark" width="32%"></a>
<a href="docs/images/themes/bright-clean.jpg"><img src="docs/images/themes/bright-clean.jpg" alt="bright-clean" width="32%"></a>
<a href="docs/images/themes/colorful-pop.jpg"><img src="docs/images/themes/colorful-pop.jpg" alt="colorful-pop" width="32%"></a>
<a href="docs/images/themes/minimal-mono.jpg"><img src="docs/images/themes/minimal-mono.jpg" alt="minimal-mono" width="32%"></a>
<a href="docs/images/themes/night-luxe.jpg"><img src="docs/images/themes/night-luxe.jpg" alt="night-luxe" width="32%"></a>
<a href="docs/images/themes/aurora-glass.jpg"><img src="docs/images/themes/aurora-glass.jpg" alt="aurora-glass" width="32%"></a>
<a href="docs/images/themes/sunset-heat.jpg"><img src="docs/images/themes/sunset-heat.jpg" alt="sunset-heat" width="32%"></a>

`neon-dark` · `bright-clean` · `colorful-pop` · `minimal-mono` · `night-luxe` · `aurora-glass` · `sunset-heat`

### Remotion product films — `films/` (rendered stills)

<a href="docs/images/films/product-film-165.jpg"><img src="docs/images/films/product-film-165.jpg" alt="product-film-165.jpg" width="32%"></a>
<a href="docs/images/films/product-film-300.jpg"><img src="docs/images/films/product-film-300.jpg" alt="product-film-300.jpg" width="32%"></a>
<a href="docs/images/films/product-film-420.jpg"><img src="docs/images/films/product-film-420.jpg" alt="product-film-420.jpg" width="32%"></a>
<a href="docs/images/films/product-film-45.jpg"><img src="docs/images/films/product-film-45.jpg" alt="product-film-45.jpg" width="32%"></a>
<a href="docs/images/films/product-film-520.jpg"><img src="docs/images/films/product-film-520.jpg" alt="product-film-520.jpg" width="32%"></a>
<a href="docs/images/films/product-film-ar-90.jpg"><img src="docs/images/films/product-film-ar-90.jpg" alt="product-film-ar-90.jpg" width="32%"></a>

### منصة ريادة · عرض تجريبي — `examples/arabic-rtl`

<a href="docs/images/decks/arabic-rtl/01-title.jpg"><img src="docs/images/decks/arabic-rtl/01-title.jpg" alt="01-title.jpg" width="32%"></a>
<a href="docs/images/decks/arabic-rtl/02-problem.jpg"><img src="docs/images/decks/arabic-rtl/02-problem.jpg" alt="02-problem.jpg" width="32%"></a>
<a href="docs/images/decks/arabic-rtl/03-how.jpg"><img src="docs/images/decks/arabic-rtl/03-how.jpg" alt="03-how.jpg" width="32%"></a>
<a href="docs/images/decks/arabic-rtl/04-numbers.jpg"><img src="docs/images/decks/arabic-rtl/04-numbers.jpg" alt="04-numbers.jpg" width="32%"></a>
<a href="docs/images/decks/arabic-rtl/05-finale.jpg"><img src="docs/images/decks/arabic-rtl/05-finale.jpg" alt="05-finale.jpg" width="32%"></a>

### Pulse Studio · Brand Deck — `examples/brand-colors`

<a href="docs/images/decks/brand-colors/01-title.jpg"><img src="docs/images/decks/brand-colors/01-title.jpg" alt="01-title.jpg" width="32%"></a>
<a href="docs/images/decks/brand-colors/02-statement.jpg"><img src="docs/images/decks/brand-colors/02-statement.jpg" alt="02-statement.jpg" width="32%"></a>
<a href="docs/images/decks/brand-colors/03-orbit.jpg"><img src="docs/images/decks/brand-colors/03-orbit.jpg" alt="03-orbit.jpg" width="32%"></a>
<a href="docs/images/decks/brand-colors/04-services.jpg"><img src="docs/images/decks/brand-colors/04-services.jpg" alt="04-services.jpg" width="32%"></a>
<a href="docs/images/decks/brand-colors/05-finale.jpg"><img src="docs/images/decks/brand-colors/05-finale.jpg" alt="05-finale.jpg" width="32%"></a>

### The Quiet Year — `examples/editorial-minimal`

<a href="docs/images/decks/editorial-minimal/01-title.jpg"><img src="docs/images/decks/editorial-minimal/01-title.jpg" alt="01-title.jpg" width="32%"></a>
<a href="docs/images/decks/editorial-minimal/02-parts.jpg"><img src="docs/images/decks/editorial-minimal/02-parts.jpg" alt="02-parts.jpg" width="32%"></a>
<a href="docs/images/decks/editorial-minimal/03-no.jpg"><img src="docs/images/decks/editorial-minimal/03-no.jpg" alt="03-no.jpg" width="32%"></a>
<a href="docs/images/decks/editorial-minimal/04-write.jpg"><img src="docs/images/decks/editorial-minimal/04-write.jpg" alt="04-write.jpg" width="32%"></a>
<a href="docs/images/decks/editorial-minimal/05-quote.jpg"><img src="docs/images/decks/editorial-minimal/05-quote.jpg" alt="05-quote.jpg" width="32%"></a>
<a href="docs/images/decks/editorial-minimal/06-finale.jpg"><img src="docs/images/decks/editorial-minimal/06-finale.jpg" alt="06-finale.jpg" width="32%"></a>

### Maison Aurelle · AW Collection — `examples/luxury-brand`

<a href="docs/images/decks/luxury-brand/01-title.jpg"><img src="docs/images/decks/luxury-brand/01-title.jpg" alt="01-title.jpg" width="32%"></a>
<a href="docs/images/decks/luxury-brand/02-statement.jpg"><img src="docs/images/decks/luxury-brand/02-statement.jpg" alt="02-statement.jpg" width="32%"></a>
<a href="docs/images/decks/luxury-brand/03-wall.jpg"><img src="docs/images/decks/luxury-brand/03-wall.jpg" alt="03-wall.jpg" width="32%"></a>
<a href="docs/images/decks/luxury-brand/04-quote.jpg"><img src="docs/images/decks/luxury-brand/04-quote.jpg" alt="04-quote.jpg" width="32%"></a>
<a href="docs/images/decks/luxury-brand/05-atelier.jpg"><img src="docs/images/decks/luxury-brand/05-atelier.jpg" alt="05-atelier.jpg" width="32%"></a>
<a href="docs/images/decks/luxury-brand/06-finale.jpg"><img src="docs/images/decks/luxury-brand/06-finale.jpg" alt="06-finale.jpg" width="32%"></a>

### Nomad Coffee · App Launch — `examples/product-launch`

<a href="docs/images/decks/product-launch/01-title.jpg"><img src="docs/images/decks/product-launch/01-title.jpg" alt="01-title.jpg" width="32%"></a>
<a href="docs/images/decks/product-launch/02-why.jpg"><img src="docs/images/decks/product-launch/02-why.jpg" alt="02-why.jpg" width="32%"></a>
<a href="docs/images/decks/product-launch/03-app.jpg"><img src="docs/images/decks/product-launch/03-app.jpg" alt="03-app.jpg" width="32%"></a>
<a href="docs/images/decks/product-launch/04-features.jpg"><img src="docs/images/decks/product-launch/04-features.jpg" alt="04-features.jpg" width="32%"></a>
<a href="docs/images/decks/product-launch/05-orders.jpg"><img src="docs/images/decks/product-launch/05-orders.jpg" alt="05-orders.jpg" width="32%"></a>
<a href="docs/images/decks/product-launch/06-before-after.jpg"><img src="docs/images/decks/product-launch/06-before-after.jpg" alt="06-before-after.jpg" width="32%"></a>
<a href="docs/images/decks/product-launch/07-finale.jpg"><img src="docs/images/decks/product-launch/07-finale.jpg" alt="07-finale.jpg" width="32%"></a>

### Northwind · Q3 Review — `examples/quarterly-report`

<a href="docs/images/decks/quarterly-report/01-title.jpg"><img src="docs/images/decks/quarterly-report/01-title.jpg" alt="01-title.jpg" width="32%"></a>
<a href="docs/images/decks/quarterly-report/02-agenda.jpg"><img src="docs/images/decks/quarterly-report/02-agenda.jpg" alt="02-agenda.jpg" width="32%"></a>
<a href="docs/images/decks/quarterly-report/03-numbers.jpg"><img src="docs/images/decks/quarterly-report/03-numbers.jpg" alt="03-numbers.jpg" width="32%"></a>
<a href="docs/images/decks/quarterly-report/04-chart.jpg"><img src="docs/images/decks/quarterly-report/04-chart.jpg" alt="04-chart.jpg" width="32%"></a>
<a href="docs/images/decks/quarterly-report/05-change.jpg"><img src="docs/images/decks/quarterly-report/05-change.jpg" alt="05-change.jpg" width="32%"></a>
<a href="docs/images/decks/quarterly-report/06-q4.jpg"><img src="docs/images/decks/quarterly-report/06-q4.jpg" alt="06-q4.jpg" width="32%"></a>
<a href="docs/images/decks/quarterly-report/07-finale.jpg"><img src="docs/images/decks/quarterly-report/07-finale.jpg" alt="07-finale.jpg" width="32%"></a>

### Orbit Labs · Seed — `examples/startup-pitch`

<a href="docs/images/decks/startup-pitch/01-title.jpg"><img src="docs/images/decks/startup-pitch/01-title.jpg" alt="01-title.jpg" width="32%"></a>
<a href="docs/images/decks/startup-pitch/02-problem.jpg"><img src="docs/images/decks/startup-pitch/02-problem.jpg" alt="02-problem.jpg" width="32%"></a>
<a href="docs/images/decks/startup-pitch/03-how.jpg"><img src="docs/images/decks/startup-pitch/03-how.jpg" alt="03-how.jpg" width="32%"></a>
<a href="docs/images/decks/startup-pitch/04-screens.jpg"><img src="docs/images/decks/startup-pitch/04-screens.jpg" alt="04-screens.jpg" width="32%"></a>
<a href="docs/images/decks/startup-pitch/05-traction.jpg"><img src="docs/images/decks/startup-pitch/05-traction.jpg" alt="05-traction.jpg" width="32%"></a>
<a href="docs/images/decks/startup-pitch/06-why.jpg"><img src="docs/images/decks/startup-pitch/06-why.jpg" alt="06-why.jpg" width="32%"></a>
<a href="docs/images/decks/startup-pitch/07-team.jpg"><img src="docs/images/decks/startup-pitch/07-team.jpg" alt="07-team.jpg" width="32%"></a>
<a href="docs/images/decks/startup-pitch/08-finale.jpg"><img src="docs/images/decks/startup-pitch/08-finale.jpg" alt="08-finale.jpg" width="32%"></a>

### Shipping With Agents — `examples/tech-talk`

<a href="docs/images/decks/tech-talk/01-boot.jpg"><img src="docs/images/decks/tech-talk/01-boot.jpg" alt="01-boot.jpg" width="32%"></a>
<a href="docs/images/decks/tech-talk/02-stack.jpg"><img src="docs/images/decks/tech-talk/02-stack.jpg" alt="02-stack.jpg" width="32%"></a>
<a href="docs/images/decks/tech-talk/03-loop.jpg"><img src="docs/images/decks/tech-talk/03-loop.jpg" alt="03-loop.jpg" width="32%"></a>
<a href="docs/images/decks/tech-talk/04-pipeline.jpg"><img src="docs/images/decks/tech-talk/04-pipeline.jpg" alt="04-pipeline.jpg" width="32%"></a>
<a href="docs/images/decks/tech-talk/05-ui.jpg"><img src="docs/images/decks/tech-talk/05-ui.jpg" alt="05-ui.jpg" width="32%"></a>
<a href="docs/images/decks/tech-talk/06-films.jpg"><img src="docs/images/decks/tech-talk/06-films.jpg" alt="06-films.jpg" width="32%"></a>
<a href="docs/images/decks/tech-talk/07-journey.jpg"><img src="docs/images/decks/tech-talk/07-journey.jpg" alt="07-journey.jpg" width="32%"></a>
<a href="docs/images/decks/tech-talk/08-finale.jpg"><img src="docs/images/decks/tech-talk/08-finale.jpg" alt="08-finale.jpg" width="32%"></a>

<!-- gallery:end -->

<!-- Screenshots of every mode and archetype go in docs/images/ -->
Run it yourself:
```bash
cd skills/kimzpresentations/template
npm install && npm run setup
npm run gallery          # open http://localhost:5173 → pick a deck → press T to re-skin it
```

## Make a deck by hand
```bash
node skills/kimzpresentations/scripts/new-deck.mjs ~/my-deck --theme night-luxe --title "My Talk"
cd ~/my-deck && npm install && npm run setup && npm run dev
# edit deck/deck.tsx
npm run present          # production build for the real talk
```

## Credits
- Text effects, backgrounds and components: [React Bits](https://reactbits.dev) (MIT + Commons Clause — installed by `npm run setup`, not redistributed).
- Animated Beam & Orbiting Circles: [Magic UI](https://magicui.design) via [21st.dev](https://21st.dev) (MIT).
- Motion: [Motion](https://motion.dev). Styling: Tailwind CSS v4. Build: Vite.

Made by Kareem Elsayed.
