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
