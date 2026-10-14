# Arabic & right-to-left decks

```tsx
export default defineDeck({ title: 'عرض', theme: 'sunset-heat', rtl: true, slides: [...] })
```
`rtl: true` sets `dir="rtl"` on the stage and puts **IBM Plex Sans Arabic** first in the display and body font stacks (Latin and digits fall back to the theme fonts).

## The one rule: never split Arabic into letters
Per-character effects (SplitText chars, DecryptedText, ScrambledText, GlitchText, CircularText) wrap each letter in its own span, which **breaks Arabic letter joining**. Archetypes already detect Arabic (`isRTLText`) and switch to word- or line-level motion. In custom slides:
- `BlurText animateBy="words"` is safe; `animateBy="letters"` is not.
- `RotatingText` is safe with `splitBy="words"`.
- Wrap Arabic lines in `className="ar"` (Arabic font + rtl) when the deck itself is LTR.

## Layout
Flex/grid order flips automatically under `dir="rtl"`. Absolute positions (`left-20`, sticker `pos`) do **not** — mirror them by hand for RTL decks.
Numbers: Arabic-Indic (٣٠) or Western (30) — follow the brand; CountUp renders Western digits.

## Mixed decks
An English deck with Arabic content (screenshots, captions, quotes): keep `rtl: false` and wrap the Arabic in `<span className="ar">…</span>`.
