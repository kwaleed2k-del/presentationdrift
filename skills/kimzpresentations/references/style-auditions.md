# Style auditions: 3 live looks before anything gets built

People were getting decks that looked like the last deck. The cure is to **show three genuinely different looks, built
for this person, and let them pick** before you scaffold anything. This step is not optional. Skip it only when the
user hands you an exact style (a brand guide with fonts and colours, or "make it exactly like X") or says "skip the
options".

The auditions are one light HTML page (no npm, no build, no WebGL): three 16:9 mini-slides, A / B / C, each looping the
same two moments of *their* talk. They reply with a letter, or a mix ("B with A's colours"), and the winner becomes the
deck's theme.

## 1. Read the person, not just the topic
Before choosing looks, write yourself a 3-line read. Pull it from the prompt, how they write, who they are and who's in the room:
```
Presenter:   who is on stage, and their character in 3 words (e.g. "bubbly, funny, caring" · "calm, precise, senior" · "loud, competitive, sales")
Room:        who's watching and what they should feel (e.g. "the team, laughing" · "investors, convinced" · "clinicians, reassured")
Signals:     words, emojis, caps, brand colours, things they love or said they hate ("I don't like text", "make it girly", "dark mode")
```
Signals beat defaults. If they said pink, all three looks are pink, but *different* pinks with different type, motion and surfaces.
If you truly can't tell, ask one question ("Describe the vibe in three words?"), then move on.

## 2. Pick three directions that disagree
Choose from the library below (or invent new ones), then **customise each to this person**: their name, colours, language and jokes.
- **A: the safe fit.** The closest match to the read.
- **B: the bold fit.** Same character, pushed further: louder, funnier, more dramatic.
- **C: the wildcard.** A credible look from a different family that they wouldn't have thought to ask for.

The three must differ on **at least four** of these axes, together:
| Axis | Options |
|---|---|
| Palette & base | light / dark / mid-tone; which hue carries the accent |
| Type pairing | display + body (+ Arabic face if needed); serif vs grotesk vs rounded vs mono vs hand-drawn |
| Motion personality | calm-floaty · playful springs · snappy OS-like · cinematic blur · mechanical/typewriter |
| Surface | glass · chunky brutal sticker · outline/hairline · paper/print · neon glow |
| Signature mechanic | orbit · spinning circular badge · 3D ring · necklace/path · radar sweep · stack/flip cards · marquee · draw-on line · ticker · polaroid drop |
| Backdrop | dots · mesh blobs · grid · grain/halftone · none · WebGL (name the React Bits one it maps to) |

**Never offer** the look of the previous deck you built, the stock `neon-dark` + Space Grotesk combo, or three "variations" that only swap colours.

## 3. Direction library (starting points; mix freely)
| Direction | Feels | Base · palette idea | Type (display + body · Arabic) | Motion · surface | Signature mechanic |
|---|---|---|---|---|---|
| Bubblegum Pop | funny, bubbly, sticker-bomb | light pink dots · hot pink, lilac, butter, mint | Bricolage Grotesque + Figtree · Baloo Bhaijaan 2 | playful springs · brutal sticker cards | spinning CircularText badges, bubbles, polaroid drops |
| Pearl Glam | soft, elegant, glowing | blush/pearl · rose, rose-gold, lavender | Cormorant Garamond italic + Manrope · El Messiri | calm floaty blur-in · satin glass | pearls orbiting the name, pearl-necklace journey |
| Rosé Glass OS | dreamy, glossy, techy | iridescent mesh · magenta, violet | Unbounded + Onest · Readex Pro | snappy OS · frosted glass | notification stack, 3D ring carousel |
| Neon Arcade | competitive, gamer, hype | near-black · cyan, magenta, acid | Silkscreen or Press Start 2P + Space Mono · Tajawal | snappy + glitch · neon outline | score counters, level-up bars, pixel confetti |
| Comic Book | funny, loud, storytelling | yellow halftone · red, blue, black ink | Bangers + Comic Neue · Lalezar | punchy pops · panel frames | speech balloons, POW bursts, panel-by-panel reveals |
| Swiss Grid | precise, confident, design-led | white · one red, black | Archivo / Inter Tight + IBM Plex Sans · IBM Plex Sans Arabic | mechanical slides · hairline outline | grid lines drawing on, big numerals ticking |
| Editorial Ink | thoughtful, strategic | newsprint grey · ink + one spot colour | Fraunces + Source Sans 3 · Amiri | calm · paper | pull quotes, margin notes, underline draw-on |
| Night Luxe | premium, quiet, exclusive | black · gold, champagne | Cormorant Garamond + Montserrat · Aref Ruqaa | cinematic · thin gold outline | slow particles, monogram seal, gold line draw |
| Najd Dusk | rooted, warm, Gulf | sand → indigo dusk · saffron, palm green | Reem Kufi + Readex Pro · Reem Kufi | calm cinematic · solid | sun arc, dune lines, geometric star tiles |
| Botanical Calm | caring, grounded | sage/clay light · leaf green, terracotta | DM Serif Display + Nunito · Tajawal | calm · soft solid cards | growing vines, rings like tree years |
| Clinical Clean | trustworthy, careful | white · teal, sky, amber | DM Serif Display + Manrope · IBM Plex Sans Arabic | calm · solid | pulse lines, checklists ticking |
| Blueprint | engineer, analytical | navy grid · white lines, cyan | JetBrains Mono + Inter · IBM Plex Sans Arabic | mechanical · outline | schematic draw-on, dimension arrows, nodes + beams |
| Terminal Hacker | builder, dev | black · phosphor green | JetBrains Mono / VT323 · Cairo | typewriter · terminal | typing logs, scanlines, ASCII progress |
| Sports Hype | energetic, sales, launch | sunset gradient · orange, red, white | Bebas Neue + Barlow · Cairo Black | snappy · diagonal cards | scoreboard flips, speed lines, countdowns |
| Y2K Chrome | trendy, fun-tech | silver/iridescent · chrome, baby blue, pink | Syne + DM Sans · Readex Pro | floaty bounce · chrome glass | spinning 3D stars, chrome blobs, marquee |
| Retro 70s | warm, groovy, nostalgic | cream-orange · brown, mustard, rust | Shrikhand + Work Sans · Lalezar | wobbly · rounded solid | sunburst rays, wavy stripes, vinyl spin |
| Crayon Kids | playful, teaching | paper white · primary crayons | Gochi Hand / Patrick Hand + Nunito · Baloo Bhaijaan 2 | bouncy · hand-drawn outline | scribble underlines, doodle arrows, star stickers |
| Aurora Glass | visionary, AI, future | dark · teal, violet, pink aurora | Space Grotesk + Inter (use only if it fits) · IBM Plex Sans Arabic | cinematic · glass | aurora backdrop, orbiting logos, beams |

Character → good starting families:
- **funny / bubbly:** Bubblegum, Comic, Y2K, Crayon
- **elegant / premium:** Pearl Glam, Night Luxe, Editorial
- **analytical / engineer:** Blueprint, Swiss, Terminal
- **calm / caring:** Botanical, Clinical
- **energetic / sales / leader:** Sports Hype, Neon Arcade, Rosé Glass OS
- **rooted / local pride:** Najd Dusk

## 4. Build the audition page
```bash
node SKILL/scripts/auditions.mjs ~/my-deck-design        # copies the starter page and serves it on http://localhost:5400
```
Then edit `~/my-deck-design/index.html` (the starter has the engine already: 16:9 cqw stages, scene loop, pause off-screen, reduced motion):
- **Same content in all three.** Scene 1 = their opener (name, role, title, the first idea of the talk). Scene 2 = one signature moment from *their* material (the joke, the process, the big number, the product). Only the treatment differs, so they compare style, not content.
- **Different signature mechanic per look.** That shows more ideas, and every idea stays available whichever look wins.
- **Real fonts, real language.** Load each look's Google Fonts. If the talk has Arabic, show one Arabic line in each look in its Arabic face. Never split Arabic into letters.
- **Light on the machine.** CSS/SVG transforms only, no WebGL, no libraries. Name the React Bits / 21st.dev component each faked effect maps to (e.g. "Iridescence", "CircularText", "RingCarousel"), and only preview effects the deck engine can really build.
- **No private images.** Use placeholders for people's photos in the audition page. The real images go in the deck.
- **A spec card per look:** name, feeling in one line, motion, type, the circular/signature mechanic, what it's built from, and 3 to 4 ideas mapped to their sections.

If an Artifact/preview tool is available you may also publish it, but **always give a localhost link**; some people can't open artifacts.
Stop the server once they've chosen (Ctrl+C in that task, or kill the port).

## 5. After they pick
- Write the 5-line design brief from the winner (see `design-direction.md`) and turn it into `defineTheme(...)` + `fonts: [...]` + a deck CSS file for its keyframes.
- Port the winner's mechanics into shared parts (e.g. `deck/parts.tsx`: sticker box, pop-in, spinning badge, the recurring frame) so every slide speaks the same language.
- Keep `index.html` in the deck folder (`design/auditions.html`) as the record of the choice.
- **Mixes are fine** ("B with A's pearls"). Build what they said, not the nearest letter.
- **Want more?** Offer a round 2: three variations of the winner (a calmer one, a louder one, a different signature), using the same page.
