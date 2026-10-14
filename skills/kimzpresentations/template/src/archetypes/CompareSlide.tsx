import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect, type ReactNode } from 'react'
import { useAccent, useTheme } from '@/engine/context'
import { Bullets, Card, Grad, Kicker, Stage, Title } from '@/engine/ui'

/** Auto-sweeping before/after slider for two same-size images. */
function Sweep({ before, after, w, h }: { before: string; after: string; w: number; h: number }) {
  const [a] = useAccent()
  const t = useTheme()
  const x = useMotionValue(100)
  const clip = useTransform(x, (v) => `inset(0 ${100 - v}% 0 0)`)
  const left = useTransform(x, (v) => `${v}%`)
  useEffect(() => {
    const c = animate(x, [100, 8, 92, 50], { duration: 5, delay: 1, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse', repeatDelay: 1 })
    return () => c.stop()
  }, [x])
  return (
    <div className="relative overflow-hidden" style={{ width: w, height: h, borderRadius: t.radius, boxShadow: t.brutal ? `0 0 0 3px ${t.ink}, 10px 10px 0 ${t.ink}` : `0 40px 120px -40px ${a}` }}>
      <img src={after} className="absolute inset-0 size-full object-cover" />
      <motion.img src={before} className="absolute inset-0 size-full object-cover" style={{ clipPath: clip }} />
      <motion.div className="absolute inset-y-0 w-[3px] -translate-x-1/2" style={{ left, background: a }}>
        <div className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 text-[18px]" style={{ borderColor: a, color: a, background: t.bg }}>
          ⇆
        </div>
      </motion.div>
      <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-[13px] text-white" style={{ fontFamily: 'var(--k-font-mono)' }}>
        BEFORE
      </span>
      <span className="absolute right-4 top-4 rounded-full px-3 py-1 text-[13px] font-bold text-black" style={{ background: a, fontFamily: 'var(--k-font-mono)' }}>
        AFTER
      </span>
    </div>
  )
}

/**
 * Two ways to compare:
 *  - images: { before, after, w, h } → animated sweep slider + bullets beside it
 *  - columns: { left, right } → "old way vs new way" two-column cards
 */
export default function CompareSlide({
  kicker,
  title,
  accent,
  images,
  columns,
  bullets = [],
}: {
  kicker?: string
  title: ReactNode
  accent?: ReactNode
  images?: { before: string; after: string; w: number; h: number }
  columns?: { left: { label: string; items: string[] }; right: { label: string; items: string[] } }
  bullets?: ReactNode[]
}) {
  const t = useTheme()
  const [a, b] = useAccent()
  return (
    <Stage className="gap-10">
      <div className="flex flex-col gap-6">
        {kicker && <Kicker label={kicker} />}
        <Title>
          {title} {accent && <Grad>{accent}</Grad>}
        </Title>
      </div>
      {images && (
        <div className="flex flex-1 items-center gap-16">
          <Sweep {...images} />
          {bullets.length > 0 && <Bullets items={bullets} size={28} />}
        </div>
      )}
      {columns && (
        <div className="grid flex-1 grid-cols-2 content-center items-start gap-10">
          {[columns.left, columns.right].map((col, i) => (
            <motion.div key={col.label} initial={{ opacity: 0, x: i ? 60 : -60 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.3, type: 'spring', stiffness: 100 }}>
              <Card className="flex flex-col gap-7 p-12" color={i ? b : a} style={i === 0 ? { opacity: 0.75 } : undefined}>
                <span className="text-[16px] font-bold uppercase tracking-[0.3em]" style={{ color: i ? b : t.muted, fontFamily: 'var(--k-font-mono)' }}>
                  {col.label}
                </span>
                {col.items.map((it, k) => (
                  <motion.div key={it} className="flex items-start gap-4 text-[34px] leading-snug" style={{ color: t.ink }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.3 + k * 0.12 }}>
                    <span style={{ color: i ? b : '#ef4444' }}>{i ? '✓' : '✕'}</span>
                    <span style={i === 0 ? { textDecoration: 'line-through', textDecorationColor: 'rgba(239,68,68,.5)' } : undefined}>{it}</span>
                  </motion.div>
                ))}
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </Stage>
  )
}
