import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import CountUp from '@/components/CountUp'
import { useTheme } from '@/engine/context'
import { Card, Grad, Kicker, Reveal, Ring, Stage, Title } from '@/engine/ui'

export type Stat = { value: number; label: string; prefix?: string; suffix?: string; decimals?: number; ring?: number /* 0..100 → show a ring */ }

/** Big animated numbers. Only show numbers that are real and flattering — weak numbers hurt more than none. */
export default function StatsSlide({ kicker, title, accent, stats, note, cols }: { kicker?: string; title: ReactNode; accent?: ReactNode; stats: Stat[]; note?: ReactNode; cols?: number }) {
  const t = useTheme()
  const palette = [t.a1, t.a2, t.a3]
  const c = cols ?? Math.min(4, stats.length)
  return (
    <Stage className="gap-12">
      <div className="flex flex-col gap-6">
        {kicker && <Kicker label={kicker} />}
        <Title>
          {title} {accent && <Grad>{accent}</Grad>}
        </Title>
      </div>
      <div className="grid flex-1 content-center gap-7" style={{ gridTemplateColumns: `repeat(${c}, 1fr)` }}>
        {stats.map((s, i) => {
          const col = palette[i % 3]
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 40, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.4 + i * 0.12, type: 'spring', stiffness: 140 }}>
              <Card className="flex h-full flex-col items-start gap-3 p-9" color={col}>
                {s.ring !== undefined ? (
                  <Ring value={s.ring} size={170} stroke={16} color={col} delay={0.6 + i * 0.12}>
                    <span className="text-[44px] font-bold" style={{ fontFamily: 'var(--k-font-display)', color: t.ink }}>
                      {s.prefix}
                      <CountUp to={s.value} duration={1.8} delay={0.6 + i * 0.12} />
                      {s.suffix}
                    </span>
                  </Ring>
                ) : (
                  <span className="text-[96px] font-bold leading-none tracking-[-0.03em]" style={{ fontFamily: 'var(--k-font-display)', color: t.brutal ? t.ink : col }}>
                    {s.prefix}
                    <CountUp to={s.value} duration={1.8} delay={0.6 + i * 0.12} separator="," />
                    {s.suffix}
                  </span>
                )}
                <span className="text-[24px] leading-snug" style={{ color: t.muted }}>
                  {s.label}
                </span>
              </Card>
            </motion.div>
          )
        })}
      </div>
      {note && (
        <Reveal delay={1.4} className="text-[22px]" style={{ color: t.muted }}>
          {note}
        </Reveal>
      )}
    </Stage>
  )
}
