import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useTheme } from '@/engine/context'
import { alpha } from '@/engine/theme'
import { Card, Grad, Kicker, Stage, Title } from '@/engine/ui'

export type BentoCard = {
  tag?: string
  title: string
  line?: string
  color?: string
  span?: number // columns
  rowSpan?: number
  /** background media: image/video URL, an emoji, or any node */
  media?: { image?: string; video?: string; emoji?: string; node?: ReactNode }
}

/** Feature grid. 4 columns × 2 rows by default; spans let hero cards stretch. */
export default function BentoSlide({ kicker, title, accent, cards, cols = 4, rows = 2 }: { kicker?: string; title: ReactNode; accent?: ReactNode; cards: BentoCard[]; cols?: number; rows?: number }) {
  const t = useTheme()
  const palette = [t.a1, t.a2, t.a3]
  return (
    <Stage className="gap-10">
      <div className="flex flex-col gap-6">
        {kicker && <Kicker label={kicker} />}
        <Title>
          {title} {accent && <Grad>{accent}</Grad>}
        </Title>
      </div>
      <div className="grid flex-1 gap-6" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
        {cards.map((c, i) => {
          const col = c.color ?? palette[i % 3]
          return (
            <motion.div key={c.title} style={{ gridColumn: `span ${c.span ?? 1}`, gridRow: `span ${c.rowSpan ?? 1}` }} initial={{ opacity: 0, y: 60, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.4 + i * 0.1, type: 'spring', stiffness: 160, damping: 18 }}>
              <Card className="h-full overflow-hidden" color={col}>
                {c.media?.image && <img src={c.media.image} className="absolute inset-0 size-full object-cover opacity-60" />}
                {c.media?.video && <video src={c.media.video} autoPlay muted loop playsInline className="absolute inset-0 size-full object-cover opacity-60" />}
                {c.media?.emoji && <div className="absolute right-6 top-4 text-[92px] opacity-90">{c.media.emoji}</div>}
                {c.media?.node}
                {(c.media?.image || c.media?.video) && <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${t.dark ? t.bg : t.surface} 10%, transparent 75%)` }} />}
                <div className="relative flex h-full flex-col justify-end gap-3 p-8">
                  {c.tag && (
                    <span className="w-fit rounded-full px-3 py-1 text-[13px] font-bold uppercase tracking-[0.2em]" style={t.brutal ? { background: col, border: `2px solid ${t.ink}`, color: t.ink, fontFamily: 'var(--k-font-mono)' } : { background: alpha(col, 0.14), color: t.dark ? col : t.ink, border: `1px solid ${alpha(col, 0.4)}`, fontFamily: 'var(--k-font-mono)' }}>
                      {c.tag}
                    </span>
                  )}
                  <div className="text-[42px] font-bold leading-none" style={{ fontFamily: 'var(--k-font-display)', color: t.ink }}>
                    {c.title}
                  </div>
                  {c.line && (
                    <div className="text-[21px] leading-snug" style={{ color: t.muted }}>
                      {c.line}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </Stage>
  )
}
