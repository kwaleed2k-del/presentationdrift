import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useAccent, useTheme } from '@/engine/context'
import { Bullets, Card, Grad, Kicker, Stage, Title } from '@/engine/ui'

export type Bar = { label: string; value: number; highlight?: boolean }

/** Hand-drawn SVG bar chart (no chart lib) + takeaway bullets. Highlight the bar that tells the story. */
export default function ChartSlide({ kicker, title, accent, bars, unit = '', bullets = [], max }: { kicker?: string; title: ReactNode; accent?: ReactNode; bars: Bar[]; unit?: string; bullets?: ReactNode[]; max?: number }) {
  const t = useTheme()
  const [a, b] = useAccent()
  const W = 1000
  const H = 560
  const top = max ?? Math.max(...bars.map((x) => x.value)) * 1.15
  const bw = (W - 60) / bars.length
  return (
    <Stage className="gap-10">
      <div className="flex flex-col gap-6">
        {kicker && <Kicker label={kicker} />}
        <Title>
          {title} {accent && <Grad>{accent}</Grad>}
        </Title>
      </div>
      <div className="flex flex-1 items-center gap-14">
        <Card className="p-8">
          <svg width={W} height={H} className="overflow-visible">
            {[0.25, 0.5, 0.75, 1].map((g) => (
              <line key={g} x1={40} x2={W} y1={H - 40 - (H - 80) * g} y2={H - 40 - (H - 80) * g} stroke={t.border} strokeDasharray="4 8" />
            ))}
            {bars.map((bar, i) => {
              const h = ((H - 80) * bar.value) / top
              const x = 60 + i * bw + bw * 0.15
              const c = bar.highlight ? a : t.dark ? 'rgba(255,255,255,.18)' : 'rgba(0,0,0,.12)'
              return (
                <g key={bar.label}>
                  <motion.rect x={x} width={bw * 0.7} rx={t.brutal ? 0 : 10} fill={bar.highlight ? `url(#bar-grad)` : c} stroke={t.brutal ? t.ink : 'none'} strokeWidth={3} initial={{ y: H - 40, height: 0 }} animate={{ y: H - 40 - h, height: h }} transition={{ delay: 0.5 + i * 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }} />
                  <motion.text x={x + bw * 0.35} y={H - 52 - h} textAnchor="middle" fontSize="24" fontWeight="700" fill={bar.highlight ? a : t.muted} style={{ fontFamily: 'var(--k-font-display)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 + i * 0.1 }}>
                    {bar.value}
                    {unit}
                  </motion.text>
                  <text x={x + bw * 0.35} y={H - 8} textAnchor="middle" fontSize="18" fill={t.muted} style={{ fontFamily: 'var(--k-font-mono)' }}>
                    {bar.label}
                  </text>
                </g>
              )
            })}
            <defs>
              <linearGradient id="bar-grad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor={a} />
                <stop offset="1" stopColor={b} />
              </linearGradient>
            </defs>
          </svg>
        </Card>
        {bullets.length > 0 && <Bullets items={bullets} size={28} delay={1.4} />}
      </div>
    </Stage>
  )
}
