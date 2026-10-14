import { motion } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'
import ShinyText from '@/components/ShinyText'
import { useAccent, useTheme } from '@/engine/context'
import { Grad, Kicker, Reveal, Stage } from '@/engine/ui'

export type Stop = { icon: string; t: string; s?: string }

/**
 * A glowing path draws from the first stop to the last while a comet rides it; each stop pops as the
 * comet passes. Ends with a quote and an optional shimmering sign-off. Great for "from → to" stories.
 */
export default function JourneySlide({ kicker, title, accent, stops, quote, signoff, aside }: { kicker?: string; title: ReactNode; accent?: ReactNode; stops: Stop[]; quote?: ReactNode; signoff?: string; aside?: ReactNode }) {
  const t = useTheme()
  const [a, b] = useAccent()
  const JW = aside ? 1180 : 1700
  const JH = 230
  const N = stops.length
  const pt = (i: number) => ({ x: 40 + (i * (JW - 80)) / Math.max(1, N - 1), y: JH / 2 + (i % 2 ? -52 : 52) })
  const PATH = stops.map((_, i) => pt(i)).reduce((d, p, i, arr) => {
    if (i === 0) return `M ${p.x} ${p.y}`
    const prev = arr[i - 1]
    const mx = (prev.x + p.x) / 2
    return `${d} C ${mx} ${prev.y}, ${mx} ${p.y}, ${p.x} ${p.y}`
  }, '')
  const DRAW = 3.2
  const START = 0.8
  const T = START + DRAW
  const story = (
    <div className="flex flex-col gap-8">
      {kicker && <Kicker label={kicker} />}
      <Reveal delay={0.2}>
        <div className="text-[100px] leading-[0.9] tracking-[-0.04em]" style={{ fontFamily: 'var(--k-font-display)', fontWeight: t.displayWeight, color: t.ink }}>
          {title} {accent && <Grad>{accent}</Grad>}
        </div>
      </Reveal>
      <div className="relative" style={{ width: JW, height: JH + 70 }}>
        <svg width={JW} height={JH} className="absolute left-0 top-[35px] overflow-visible">
          <defs>
            <linearGradient id="journey-path" x1="0" x2="1">
              <stop offset="0" stopColor={t.dark ? '#ffffff' : t.ink} stopOpacity="0.3" />
              <stop offset="0.6" stopColor={b} />
              <stop offset="1" stopColor={a} />
            </linearGradient>
          </defs>
          <path d={PATH} fill="none" stroke={t.border} strokeWidth="4" strokeDasharray="2 10" strokeLinecap="round" />
          <motion.path d={PATH} fill="none" stroke="url(#journey-path)" strokeWidth="5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: START, duration: DRAW, ease: 'easeInOut' }} style={{ filter: t.glow ? `drop-shadow(0 0 10px ${a})` : undefined }} />
        </svg>
        <motion.div className="absolute left-0 top-[35px] size-5 rounded-full" style={{ background: t.dark ? '#fff' : t.ink, offsetPath: `path("${PATH}")`, offsetRotate: '0deg', boxShadow: `0 0 24px 8px ${a}` } as CSSProperties} initial={{ offsetDistance: '0%', opacity: 0 }} animate={{ offsetDistance: '100%', opacity: [0, 1, 1, 0] }} transition={{ delay: START, duration: DRAW, ease: 'easeInOut' }} />
        {stops.map((st, i) => {
          const p = pt(i)
          const last = i === N - 1
          const up = i % 2 === 1
          return (
            <div key={st.t} className="absolute" style={{ left: p.x, top: p.y + 35 }}>
              <motion.div className="relative -translate-x-1/2 -translate-y-1/2" initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: START + (i / Math.max(1, N - 1)) * DRAW, type: 'spring', stiffness: 260, damping: 14 }}>
                <div className="grid place-items-center rounded-full border-[3px]" style={{ width: last ? 84 : 64, height: last ? 84 : 64, fontSize: last ? 38 : 28, background: t.dark ? '#0b0a10' : t.surface, borderColor: last ? a : i === 0 ? t.border : b, boxShadow: last ? `0 0 50px ${a}` : `0 0 24px -6px ${b}` }}>
                  {st.icon}
                </div>
                <div className={`absolute left-1/2 flex w-[220px] -translate-x-1/2 flex-col items-center text-center ${up ? 'bottom-full mb-3' : 'top-full mt-3'}`}>
                  <span className={`font-bold leading-tight ${last ? 'text-[30px]' : 'text-[24px]'}`} style={{ fontFamily: 'var(--k-font-display)', color: last ? a : t.ink }}>
                    {st.t}
                  </span>
                  {st.s && (
                    <span className="text-[13px] uppercase tracking-[0.18em]" style={{ color: t.muted, fontFamily: 'var(--k-font-mono)' }}>
                      {st.s}
                    </span>
                  )}
                </div>
              </motion.div>
            </div>
          )
        })}
      </div>
      {quote && (
        <motion.div className="text-[46px] font-bold leading-[1.1] tracking-[-0.02em]" style={{ fontFamily: 'var(--k-font-display)', color: t.ink }} initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }} transition={{ delay: T + 0.3, duration: 0.9 }}>
          {quote}
        </motion.div>
      )}
      {signoff && (
        <motion.div className="text-[60px] font-bold" style={{ fontFamily: 'var(--k-font-display)' }} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: T + 1.2, type: 'spring', stiffness: 120 }}>
          <ShinyText text={signoff} color={a} shineColor={t.dark ? '#ffffff' : t.ink} speed={2.4} />
        </motion.div>
      )}
    </div>
  )
  return (
    <Stage className="flex-row items-center gap-12">
      {story}
      {aside}
    </Stage>
  )
}
