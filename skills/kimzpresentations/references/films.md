# Product films with Remotion

`SKILL/films/` is a Remotion project that makes themed product films — the clips that play on a
`VideoWallSlide`, in a `SplitSlide` visual, or as a standalone promo. Same colours as the deck.

```bash
cd SKILL/films && npm install
npm run studio          # preview + edit props live (http://localhost:3000/ProductFilm)
npm run render          # → out/product-film.mp4   (only when the user asks; renders are heavy)
bash ../scripts/encode-video.sh out/product-film.mp4 <deck>/public/vid/film.mp4 --len 20
```
Copy the project per film (`cp -r SKILL/films ~/my-film`) so the skill's copy stays clean.

## The film = a config
Edit `src/film.config.ts` (or the props panel in Studio — it's a zod schema):
```ts
{
  brand: { name, a1, a2, a3, bg, ink },          // use the deck's theme / brand hexes
  rtl: false,                                      // true for Arabic (word-level motion, Arabic font)
  scenes: [
    { kind: 'hook', seconds: 3.5, kicker?, line1, line2 },                 // word-by-word rise + gradient line
    { kind: 'features', seconds: 4.5, title, items: [{ icon, title, line? }] },  // ≤4 spring-in cards
    { kind: 'screen', seconds: 4.5, title, src: 'shots/x.png', focus: { x, y, zoom }, callout? }, // Ken Burns push-in to a point
    { kind: 'stats', seconds: 4, title, items: [{ value, suffix, label }] },      // counting numbers
    { kind: 'cta', seconds: 3.5, line, sub? },                              // brand + big line + pill
  ],
}
```
Scenes alternate fade / slide transitions (15 frames). Duration is computed:
**total = Σ scene frames − 15 × (scenes − 1)** — never hard-code it, or the end goes blank.

## Rules (Remotion)
- Animate with `useCurrentFrame()` + `interpolate()` / `spring()`. CSS transitions/animations and Tailwind `animate-*` don't render.
- Assets go in `films/public/` and are referenced with `staticFile('path')`.
- Prefer the `scale` / `translate` style props over `transform` strings.
- Preview in Studio first and get a yes before rendering; renders are CPU-heavy. A single frame check: `npx remotion still ProductFilm out/f.jpg --frame=60 --scale=0.5`.
- Real screenshots in `screen` scenes: crop them first (`assets.py crop`) — the push-in magnifies, so start from native pixels.

## Add a scene type
1. Add a variant to `Scene` in `src/schema.ts` (`z.object({ kind: z.literal('quote'), … })`).
2. Write the component in `src/scenes.tsx` (copy `Hook`/`Cta`, reuse `Backplate`).
3. Add the `case` in `SceneView` (`src/ProductFilm.tsx`).

## Remotion skills
If the Remotion agent skills are installed (`remotion-best-practices`, …) load them for anything beyond this template — captions, voiceover (ElevenLabs), audio, maps, 3D, light leaks.
