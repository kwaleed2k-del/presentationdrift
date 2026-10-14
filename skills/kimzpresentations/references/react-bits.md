# React Bits in this skill

[React Bits](https://reactbits.dev) is the motion layer: text effects, WebGL backgrounds and interactive components.
License is MIT + Commons Clause, so the skill **installs** them per machine (`npm run setup`) instead of shipping them.
They land in `template/src/components/<Name>.tsx` (git-ignored) as TypeScript + Tailwind variants.

## Add more components
Browse reactbits.dev, then:
```bash
npm run setup -- Ballpit Lanyard Masonry          # any names; variant -TS-TW is chosen for you
# same as: npx shadcn@latest add @react-bits/Ballpit-TS-TW -y -o
```
Add the name to `COMPONENTS` in `template/scripts/setup.mjs` if an archetype depends on it.

## What's installed and where it's used

| Component | Kind | Used by | Notes |
|---|---|---|---|
| DecryptedText | text | TitleSlide | per-letter: Latin only |
| ShinyText | text | Title subtitle, Statement line 2, Journey sign-off | safe for any script |
| BlurText | text | StatementSlide, QuoteSlide | use `animateBy="words"` for Arabic |
| SplitText | text | FinaleSlide line 1 | GSAP; per-letter: Latin only |
| GradientText | text | FinaleSlide line 2, examples | animated multi-stop gradient |
| RotatingText | text | OrbitSlide verb | `splitBy="words"` for Arabic |
| CountUp | text | StatsSlide, any number | |
| TextType | text | custom slides (typed prompts) | |
| GlitchText | text | custom slides | needs `@utility animate-glitch-*` (already in index.css) and `w-fit` |
| ScrambledText, CircularText | text | custom slides | CircularText: size by scaling the wrapper; per-letter |
| Hyperspeed | backdrop | TitleSlide `bg="hyperspeed"` | three.js + postprocessing — heaviest |
| Aurora, LightRays, Galaxy, DarkVeil, Threads, Particles, Silk, Iridescence, Beams, Plasma, DotGrid | backdrops | `Backdrop kind=…` | one per slide |
| Orb | component | custom slides | glowing WebGL orb |
| ClickSpark | component | FinaleSlide | sparks on click |
| SpotlightCard | component | custom grids | cursor spotlight (presenter-mouse only) |
| TiltedCard | component | photos in custom slides | tilt softens images slightly |
| CardSwap | component | stacked wizard/step screenshots | fills its parent — give it a sized box |
| CircularGallery | component | curved WebGL image gallery | square-ish images work best |
| LogoLoop | component | Steal-style keyword marquees | `node` items for text |
| ElectricBorder, StarBorder | component | hero cards (leader slide) | `className="h-full"` to stretch |
| MagicBento | component | alternative bento | text is small at 1080p — prefer BentoSlide |

## Gotchas
- Pointer-driven effects (Spotlight, Tilted, MagicBento tilt) read screen coordinates; on a CSS-scaled stage they're slightly off unless the window is 1920 wide. They're decoration — fine.
- WebGL components size from their parent; give the parent explicit dimensions (`absolute inset-0`).
- Some components accept `className` but hard-code a font size (e.g. GlitchText `clamp(...)`) — override with `!text-[104px]`.
