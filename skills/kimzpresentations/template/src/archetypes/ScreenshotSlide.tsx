import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useAccent, useTheme } from '@/engine/context'
import { alpha } from '@/engine/theme'
import { Card, Grad, Kicker, Stage, Title } from '@/engine/ui'

export type Highlight = { x: number; y: number; w: number; h: number; label: string; side?: 'top' | 'bottom' }
export type Piece = { src: string; w: number; h: number; highlights?: Highlight[]; offsetY?: number }

/**
 * "Exploded" product UI: 1–3 screenshot crops shown at their NATIVE pixel size (1:1 = sharp),
 * each with pulsing highlight boxes, plus a features column. Crop with scripts/crop.py first.
 */
export default function ScreenshotSlide({ kicker, title, accent, pieces, features = [], badge }: { kicker?: string; title: ReactNode; accent?: ReactNode; pieces: Piece[]; features?: [string, string][]; badge?: string }) {
  const t = useTheme()
  const [a, b] = useAccent()
  return (
    <Stage className="gap-8">
      <div className="flex flex-col gap-5">
        {kicker && <Kicker label={kicker} />}
        <Title>
          {title} {accent && <Grad>{accent}</Grad>}
        </Title>
      </div>
      <div className="flex flex-1 gap-10">
        {features.length > 0 && (
          <div className="flex w-[400px] shrink-0 flex-col gap-3 pt-4">
            {features.map(([icon, f], i) => (
              <motion.div key={f} initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 + i * 0.12, type: 'spring', stiffness: 140 }}>
                <Card className="flex items-center gap-4 px-4 py-3" color={i % 2 ? b : a}>
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl text-[19px]" style={{ background: alpha(i % 2 ? b : a, 0.15) }}>
                    {icon}
                  </span>
                  <span className="text-[19px] leading-snug" style={{ color: t.ink }}>
                    {f}
                  </span>
                </Card>
              </motion.div>
            ))}
            {badge && (
              <span className="mt-1 w-fit rounded-full border px-4 py-1.5 text-[14px] uppercase tracking-[0.15em]" style={{ borderColor: alpha(t.a3, 0.5), color: t.dark ? t.a3 : t.ink, background: alpha(t.a3, 0.1), fontFamily: 'var(--k-font-mono)' }}>
                {badge}
              </span>
            )}
          </div>
        )}
        <div className="flex items-start gap-6">
          {pieces.map((p, i) => (
            <motion.div
              key={p.src}
              className="relative shrink-0 overflow-hidden"
              style={{ width: p.w, height: p.h, marginTop: p.offsetY ?? 0, borderRadius: 18, boxShadow: t.brutal ? `0 0 0 3px ${t.ink}, 8px 8px 0 ${t.ink}` : `0 0 0 1px ${t.border}, 0 40px 100px -30px ${i % 2 ? b : a}` }}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0, transitionEnd: { transform: 'none' } }}
              transition={{ delay: 0.3 + i * 0.2, type: 'spring', stiffness: 90, damping: 18 }}
            >
              <img src={p.src} width={p.w} height={p.h} className="block" draggable={false} />
              {p.highlights?.map((hl, k) => (
                <motion.div key={hl.label} className="pointer-events-none absolute" style={{ left: hl.x, top: hl.y, width: hl.w, height: hl.h }} initial={{ opacity: 0, scale: 1.3 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2 + i * 0.4 + k * 0.4, type: 'spring', stiffness: 200 }}>
                  <motion.div className="absolute -inset-1 rounded-xl border-[3px]" style={{ borderColor: a }} animate={{ boxShadow: [`0 0 0px ${a}`, `0 0 28px ${a}`, `0 0 0px ${a}`] }} transition={{ duration: 1.6, repeat: Infinity }} />
                  <span className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[14px] font-bold text-black" style={{ background: a, fontFamily: 'var(--k-font-mono)', [hl.side === 'bottom' ? 'top' : 'bottom']: 'calc(100% + 10px)' }}>
                    {hl.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </Stage>
  )
}
