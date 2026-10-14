# Asset pipeline — screenshots, logos, photos, video

Blurry assets are the #1 thing that makes a deck look cheap. The fixes are mechanical — use the scripts.
`SKILL` below means the skill folder (where this file lives); scripts are in `SKILL/scripts/`.

Put the deck's assets in `deck/public/` (served from `/`). Reference them as `/shots/x.png`.

## Screenshots: crop, never shrink
A 1920px screenshot squeezed into a 1000px box has 0.5× text — unreadable mush, worse on a laptop with display scaling.
1. Look at the screenshot and pick the region that tells the story (a table, a panel, one form).
2. Crop it at native pixels to roughly the size it will occupy on the slide:
   ```bash
   python SKILL/scripts/assets.py crop in.png deck/public/shots/admin.png --box 276 80 1224 581 --size 1120 532 --blur 892 609 122 26
   ```
   `--size` may shrink up to ~15% (Lanczos); bigger shrinks mean you should crop tighter instead. `--blur` hides emails, internal URLs, API keys, customer names.
3. Show it at exactly that size: `BrowserFrame src w h`, `Img src w h`, RingCarousel (1120×532 default) or ScreenshotSlide pieces.
4. Several key panels? Use ScreenshotSlide with 2–3 crops side by side ("exploded UI") instead of one tiny full screen.

Need the source pixel coordinates? `python SKILL/scripts/assets.py sheet tmp.jpg in.png` then read the image, or crop a few candidates and look at them.

## Logos
Brand files often only ship a dark logo with transparency. For a dark slide:
```bash
python SKILL/scripts/assets.py logo "Logo dark.png" deck/public/brand/logo-white.png --color ffffff
```
Trims to the logo's bounds, so `width=` on the slide is the logo's real width. Never put a logo with a baked-in coloured background on a different-coloured slide.

## People photos
```bash
python SKILL/scripts/assets.py portrait selfie.jpg deck/public/people/sara.jpg --w 900
```
9:16 centre crop at 900×1600, shown at 470×836 (or 228×406 small) — 2× density, sharp. Ask before using anyone's photo; on public repos use placeholders (no `src` → glowing initial).

## Social posts / images shown small
Pre-resize to 2× the display width so the browser never does a rough downscale:
```bash
python SKILL/scripts/assets.py resize post.png deck/public/social/post-1.jpg --w 560
```

## Video
```bash
bash SKILL/scripts/encode-video.sh frames promo.mp4 strip.jpg          # look at 5 frames, pick a start
bash SKILL/scripts/encode-video.sh promo.mp4 deck/public/vid/promo.mp4 --start 1.5 --len 20 --speed 1.6
```
Produces 960×540 yuv420p H.264, keyframe every 0.5 s, no audio, faststart, speed baked in. Never `-c copy` trims (they start between keyframes and freeze) and never rely on `playbackRate`.

## Brand guidelines PDF
Extract colours, fonts, taglines and the positioning line (`python -c "import pypdf; …"`), then: `brandTheme([primary, secondary, accent])`, use the tagline as a StatementSlide/Title subtitle. Don't copy a PDF marked confidential into a repo.

## What not to show
- Weak numbers (13 users, $0.08 spend) — show structure instead (weights, zones, flows).
- Emails, internal domains, API keys (even last-4), customer names, error pages full of stack traces.
- Anything marked confidential, in a deck that will be shared.
