# Pitfalls (each one cost real time — check these before saying "done")

## Rendering & sharpness
1. **Lingering `filter: blur(0px)`** after an entrance animation makes Chrome rasterise the whole subtree soft. Always `transitionEnd: { filter: 'none' }` (the engine's slide transition and `Reveal` already do).
2. **3D magnification:** a card pushed toward the camera (`translateZ(R)` under perspective) is upscaled → blurry. In rings, push the ring back by R so the front card sits at z=0 (RingCarouselSlide does this).
3. **Shrunken screenshots** → mush. Crop at native pixels and show 1:1 (`assets.py crop`). Use box-shadow rings, not borders, around exact-size images (a 1px border squeezes the image by 2px).
4. **Rotation/tilt on photos and screenshots** softens them. Keep them straight; tilt only decorative things.
5. **Dark gradient overlays on faces** — use a small name pill instead.

## CSS / Tailwind v4
6. **`--animate-*` tokens that reference per-element variables** (`var(--duration)`, `var(--after-duration)`) resolve at `:root`, become invalid, and the animation silently never runs (orbit pills stack in the centre; glitch layers freeze 10px off as "overlapping text"). Use `@utility animate-x { animation: … }` (see `src/index.css`).
7. **Keyframes inside `@theme`** are only emitted when a matching `--animate-*` utility is used; keyframes used from inline `style={{ animation }}` must live at top level.
8. **Grid + `place-items-center` with an oversized child** offsets it instead of centring (the auto track grows to the right). Use `flex items-center justify-center` for overflowing centred content.
9. Motion can't tween between `px` and `calc()` — use numbers.
10. Tailwind translate utilities use the `translate` property, Motion uses `transform` — they combine, they don't override. Don't also set `style.transform` on an element Motion animates.
10b. **React Bits classes missing (badges collapse, CircularText letters pile up):** `src/components/*.tsx` is gitignored and Tailwind v4 skips gitignored files, so their `w-[200px]`, `text-2xl`… are never generated. `src/index.css` must keep `@source "./components/*.tsx";` (a bare folder path is not enough).

## React
11. `color ?? useAccent()[0]` calls a hook conditionally → hoist: `const acc = useAccent()`.
12. Fragment-less arrays of JSX in children → key warnings; use `<>{a}{b}</>`.
13. Timers in effects: clear them in the cleanup, and guard "start once" logic (`started` flag) — a fallback timer that fires after the ready event restarts videos.

## Video
14. 1080p full-range `yuvj420p` + long GOP stutters with 3–4 simultaneous decodes; `-c copy` trims freeze until the next keyframe; `playbackRate` is unreliable. Re-encode with `encode-video.sh`.
15. Hard-refresh (Ctrl+Shift+R) after replacing a video — the browser caches the old file.

## Layout
16. **Overflow by arithmetic:** stage content is 1760×~950. Add up widths/heights of rows and gaps before writing; estimate text width as ~0.6em/char (Space Grotesk bold) — "WORKFLOW." at 132px is ~660px.
17. Toasts placed `top-right` collide with long titles — force a line break in the title or anchor toasts to the bottom.
18. Stickers on photo edges: keep them off faces; offsets ≥ −40px so they don't intrude on the text column.

## WebGL
19. One backdrop per slide. Only the current slide is mounted, so contexts free on navigation — don't render slides offscreen to "preload".
20. Present from the production build (`npm run present`): dev mode's StrictMode double-mounts WebGL and timers.

## Content
21. Invented features, numbers, quotes or names on a big screen destroy trust. Placeholders must look like placeholders.
22. Mask real users; blur internal domains and keys; never ship a confidential brand PDF or customer screenshots in a public repo.
