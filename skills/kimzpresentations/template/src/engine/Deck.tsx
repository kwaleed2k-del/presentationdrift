import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { DeckCtx } from './context'
import { THEMES, THEME_IDS, themeVars, type Theme, type ThemeId } from './theme'
import type { Accent, DeckDef } from './types'

const W = 1920
const H = 1080

function useStageScale() {
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / W, window.innerHeight / H))
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])
  return scale
}

const param = (k: string) => new URLSearchParams(window.location.search).get(k)

function readHash(total: number) {
  const n = parseInt(window.location.hash.slice(1), 10)
  return Number.isFinite(n) && n >= 1 && n <= total ? n - 1 : 0
}

/**
 * The presenter engine.
 * Keys: → Space Enter PgDn = next · ← Backspace PgUp = back · Home/End · F fullscreen · H hide chrome
 *       O overview · T cycle theme · N speaker notes. URL: #7 jumps to slide 7, ?theme=night-luxe forces a mode.
 */
export default function Deck({ deck }: { deck: DeckDef }) {
  const scale = useStageScale()
  const { slides } = deck
  const [index, setIndex] = useState(() => readHash(slides.length))
  const [step, setStep] = useState(0)
  const [chrome, setChrome] = useState(param('chrome') !== '0')
  const [overview, setOverview] = useState(false)
  const [notes, setNotes] = useState(false)
  const [themeOverride, setThemeOverride] = useState<ThemeId | null>(() => {
    const t = param('theme')
    return t && t in THEMES ? (t as ThemeId) : null
  })
  const [toast, setToast] = useState<string | null>(null)

  const theme: Theme = themeOverride ? THEMES[themeOverride] : typeof deck.theme === 'string' ? THEMES[deck.theme] : deck.theme
  const slide = slides[index]
  const accent: Accent = slide.accent ?? [theme.a1, theme.a2]

  const go = useCallback(
    (i: number) => {
      const next = Math.max(0, Math.min(slides.length - 1, i))
      setIndex(next)
      setStep(0)
      history.replaceState(null, '', `${window.location.search}#${next + 1}`)
    },
    [slides.length],
  )
  const forward = useCallback(() => (step < (slides[index].steps ?? 1) - 1 ? setStep(step + 1) : go(index + 1)), [step, index, go, slides])
  const back = useCallback(() => (step > 0 ? setStep(step - 1) : go(index - 1)), [step, index, go])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      const k = e.key
      if (overview && k === 'Escape') setOverview(false)
      else if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(k)) forward()
      else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(k)) back()
      else if (k === 'Home') go(0)
      else if (k === 'End') go(slides.length - 1)
      else if (k === 'f') (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => {})
      else if (k === 'h') setChrome((c) => !c)
      else if (k === 'o') setOverview((o) => !o)
      else if (k === 'n') setNotes((n) => !n)
      else if (k === 't') {
        const cur = themeOverride ?? (typeof deck.theme === 'string' ? deck.theme : null)
        const next = THEME_IDS[(THEME_IDS.indexOf(cur as ThemeId) + 1) % THEME_IDS.length]
        setThemeOverride(next)
        setToast(THEMES[next].label)
      } else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [forward, back, go, overview, slides.length, themeOverride, deck.theme])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 1400)
    return () => window.clearTimeout(t)
  }, [toast])

  // Per-deck Google Fonts (design direction picks the pairing; see references/design-direction.md)
  useEffect(() => {
    if (!deck.fonts?.length) return
    const href = `https://fonts.googleapis.com/css2?${deck.fonts.map((f) => `family=${encodeURIComponent(f.includes(':') ? f : `${f}:wght@400;500;600;700;800`).replace(/%20/g, '+').replace(/%3A/g, ':').replace(/%40/g, '@').replace(/%3B/g, ';')}`).join('&')}&display=swap`
    const link = Object.assign(document.createElement('link'), { rel: 'stylesheet', href })
    document.head.appendChild(link)
    return () => link.remove()
  }, [deck.fonts])

  // Exposed for the gallery capture script (CI screenshots): slide ids + steps + current position.
  useEffect(() => {
    ;(window as unknown as { __kimz: unknown }).__kimz = { title: deck.title, slides: slides.map((s) => ({ id: s.id, steps: s.steps ?? 1 })), index, step }
  }, [deck.title, slides, index, step])

  const ctx = useMemo(() => ({ index, step, total: slides.length, theme, accent, rtl: !!deck.rtl }), [index, step, slides.length, theme, accent, deck.rtl])
  const vars = themeVars(theme)
  if (deck.rtl) {
    // Arabic glyphs first, theme faces as fallback for Latin/numbers
    vars['--k-font-display'] = `"IBM Plex Sans Arabic", ${theme.fontDisplay}`
    vars['--k-font-body'] = `"IBM Plex Sans Arabic", ${theme.fontBody}`
  }

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ ...vars, background: theme.bg } as React.CSSProperties}>
      <div
        className="absolute left-1/2 top-1/2 overflow-hidden"
        dir={deck.rtl ? 'rtl' : 'ltr'}
        style={{
          width: W,
          height: H,
          transform: `translate(-50%, -50%) scale(${scale})`,
          background: theme.bg,
          color: theme.ink,
          fontFamily: 'var(--k-font-body)',
        }}
      >
        <DeckCtx.Provider value={ctx}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${slide.id}-${theme.id}`}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.03, filter: 'blur(12px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none', transform: 'none' } }}
              exit={{ opacity: 0, scale: 0.98, filter: 'blur(12px)' }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              {slide.render()}
            </motion.div>
          </AnimatePresence>
        </DeckCtx.Provider>

        {chrome && !overview && (
          <>
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-50 h-[3px]" style={{ background: theme.dark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.06)' }}>
              <motion.div
                className="h-full"
                style={{ background: `linear-gradient(90deg, ${accent[0]}, ${accent[1]})`, boxShadow: theme.glow ? `0 0 16px ${accent[0]}` : 'none' }}
                animate={{ width: `${((index + 1) / slides.length) * 100}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
            <div className="pointer-events-none absolute bottom-6 left-16 z-50 text-[15px] uppercase tracking-[0.3em]" style={{ color: theme.muted, fontFamily: 'var(--k-font-mono)', opacity: 0.7 }}>
              {deck.footer ?? deck.title}
              {slide.section && <span style={{ color: accent[0] }}> // {slide.section}</span>}
            </div>
            <div className="pointer-events-none absolute bottom-6 right-16 z-50 text-[15px] tracking-[0.2em]" style={{ color: theme.muted, fontFamily: 'var(--k-font-mono)', opacity: 0.7 }}>
              <span style={{ color: accent[0] }}>{String(index + 1).padStart(2, '0')}</span> / {String(slides.length).padStart(2, '0')}
            </div>
          </>
        )}

        {notes && slide.notes && (
          <div className="absolute inset-x-16 bottom-16 z-50 rounded-2xl border p-6 text-[22px] leading-relaxed backdrop-blur-xl" style={{ background: theme.dark ? 'rgba(0,0,0,.75)' : 'rgba(255,255,255,.9)', borderColor: theme.border, color: theme.ink }}>
            <div className="mb-2 text-[13px] uppercase tracking-[0.3em]" style={{ color: accent[0], fontFamily: 'var(--k-font-mono)' }}>
              speaker notes
            </div>
            {slide.notes}
          </div>
        )}

        <AnimatePresence>
          {toast && (
            <motion.div className="absolute left-1/2 top-10 z-50 -translate-x-1/2 rounded-full px-6 py-2 text-[18px] font-bold" style={{ background: theme.a1, color: theme.dark ? '#000' : '#fff', fontFamily: 'var(--k-font-mono)' }} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              theme · {toast}
            </motion.div>
          )}
        </AnimatePresence>

        {overview && (
          <div className="absolute inset-0 z-50 overflow-auto p-16 backdrop-blur-xl" style={{ background: theme.dark ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,.9)' }}>
            <div className="mb-8 text-[18px] uppercase tracking-[0.3em]" style={{ color: theme.muted, fontFamily: 'var(--k-font-mono)' }}>
              overview · click a slide · esc to close
            </div>
            <div className="grid grid-cols-5 gap-5">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => {
                    go(i)
                    setOverview(false)
                  }}
                  className="flex aspect-video flex-col justify-between rounded-2xl border p-5 text-left transition-transform hover:scale-[1.03]"
                  style={{ borderColor: i === index ? theme.a1 : theme.border, background: theme.surface, color: theme.ink }}
                >
                  <span className="text-[34px] font-bold" style={{ color: theme.a1, fontFamily: 'var(--k-font-display)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[16px]" style={{ fontFamily: 'var(--k-font-mono)' }}>
                    {s.id}
                    {s.steps ? ` · ${s.steps} steps` : ''}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
