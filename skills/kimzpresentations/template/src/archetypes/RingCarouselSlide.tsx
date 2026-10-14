import { AnimatePresence, motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useAccent, useStep, useTheme } from '@/engine/context'
import { Grad, Kicker, Reveal, Stage } from '@/engine/ui'

export type RingItem = { name: string; what?: string; line?: string; src?: string; node?: ReactNode }

/**
 * 3D ring of cards. Register it with `steps: items.length` — each → spins to the next card.
 * Sharpness trick: the ring is pushed back by R, so the FRONT card sits at z=0 and renders 1:1.
 * Give it images cropped to exactly w×h (default 1120×532).
 */
export default function RingCarouselSlide({ kicker, title, accent, items, w = 1120, h = 532 }: { kicker?: string; title: ReactNode; accent?: ReactNode; items: RingItem[]; w?: number; h?: number }) {
  const t = useTheme()
  const [a, b] = useAccent()
  const step = Math.min(useStep(), items.length - 1)
  const STEP = 360 / items.length
  const R = Math.round(w / 2 / Math.tan(Math.PI / items.length)) + 60
  const cur = items[step]
  return (
    <Stage className="items-center" pad="px-20 pt-14 pb-16">
      {kicker && <Kicker label={kicker} />}
      <Reveal delay={0.2}>
        <h1 className="mt-5 text-[64px] tracking-[-0.03em]" style={{ fontFamily: 'var(--k-font-display)', fontWeight: t.displayWeight, color: t.ink }}>
          {title} {accent && <Grad>{accent}</Grad>}
        </h1>
      </Reveal>
      <div className="relative mt-2 w-full" style={{ height: h + 30, perspective: 2600 }}>
        <motion.div className="absolute left-1/2 top-1/2" style={{ transformStyle: 'preserve-3d', width: 0, height: 0 }} initial={{ z: -R, rotateY: 60 }} animate={{ z: -R, rotateY: -step * STEP }} transition={{ type: 'spring', stiffness: 70, damping: 16 }}>
          {items.map((it, i) => {
            const on = i === step
            return (
              <div
                key={it.name + i}
                className="absolute overflow-hidden"
                style={{
                  width: w,
                  height: h,
                  left: -w / 2,
                  top: -h / 2,
                  borderRadius: 18,
                  background: t.dark ? '#0d0b14' : t.surface,
                  transform: `rotateY(${i * STEP}deg) translateZ(${R}px)`,
                  boxShadow: on ? `0 0 0 ${t.brutal ? 3 : 2}px ${t.brutal ? t.ink : b}, 0 0 90px -10px ${b}` : `0 0 0 1px ${t.border}`,
                  opacity: on ? 1 : 0.4,
                  transition: 'box-shadow .4s, opacity .4s',
                  backfaceVisibility: 'hidden',
                }}
              >
                {it.src ? <img src={it.src} width={w} height={h} className="block size-full object-cover object-top" draggable={false} /> : it.node}
                <div className="absolute left-4 top-4 rounded-full bg-black/75 px-3 py-1 text-[15px] font-bold text-white" style={{ fontFamily: 'var(--k-font-mono)' }}>
                  {String(i + 1).padStart(2, '0')} · {it.name}
                </div>
              </div>
            )
          })}
        </motion.div>
      </div>
      <div className="mt-4 h-[120px] text-center">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
            <div className="text-[20px] uppercase tracking-[0.3em]" style={{ color: b, fontFamily: 'var(--k-font-mono)' }}>
              {cur.name}
              {cur.what && ` · ${cur.what}`}
            </div>
            {cur.line && (
              <div className="mt-3 text-[32px]" style={{ color: t.ink, opacity: 0.85 }}>
                {cur.line}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex gap-2">
        {items.map((_, i) => (
          <span key={i} className="h-1.5 rounded-full transition-all duration-300" style={{ width: i === step ? 36 : 12, background: i === step ? a : t.border }} />
        ))}
      </div>
    </Stage>
  )
}
