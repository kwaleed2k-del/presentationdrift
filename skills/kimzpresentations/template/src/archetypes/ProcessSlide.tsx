import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useAccent, useTheme } from '@/engine/context'
import { alpha } from '@/engine/theme'
import { Bullets, Grad, Kicker, Stage, Title, Toast } from '@/engine/ui'

/** A pipeline / how-it-works track: a light runs the line and each step pops as it passes. 3–7 steps. */
export default function ProcessSlide({
  kicker,
  title,
  accent,
  steps,
  bullets = [],
  toast,
}: {
  kicker?: string
  title: ReactNode
  accent?: ReactNode
  steps: { icon: string; title: string; sub?: string }[]
  bullets?: ReactNode[]
  toast?: { icon: string; title: string; body?: string }
}) {
  const t = useTheme()
  const [a, b] = useAccent()
  const N = steps.length
  const RUN = 2.6
  const trackW = 1760 - 180
  return (
    <Stage className="gap-14">
      <div className="flex flex-col gap-6">
        {kicker && <Kicker label={kicker} />}
        <Title>
          {title}
          {accent && (
            <>
              <br />
              <Grad>{accent}</Grad>
            </>
          )}
        </Title>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-14 pb-10">
      <div className="relative h-[240px]">
        <div className="absolute left-[90px] top-[64px] h-[3px] rounded-full" style={{ width: trackW, background: t.dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.08)' }} />
        <motion.div className="absolute left-[90px] top-[64px] h-[3px] rounded-full" style={{ background: `linear-gradient(90deg, ${a}, ${b})`, boxShadow: t.glow ? `0 0 18px ${a}` : undefined }} initial={{ width: 0 }} animate={{ width: trackW }} transition={{ duration: RUN, delay: 0.6, ease: 'easeInOut' }} />
        <motion.div className="absolute top-[52px] size-7 rounded-full" style={{ background: t.dark ? '#fff' : t.ink, boxShadow: `0 0 30px 8px ${alpha(a, 0.8)}` }} initial={{ x: 76 }} animate={{ x: [76, 76 + trackW] }} transition={{ duration: RUN, delay: 0.6, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.4 }} />
        <div className="relative flex justify-between">
          {steps.map((s, i) => {
            const c = i % 2 ? b : a
            return (
              <motion.div key={s.title} className="flex w-[200px] flex-col items-center gap-4 text-center" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + (i / Math.max(1, N - 1)) * (RUN - 0.2), type: 'spring' }}>
                <div className="grid size-[128px] place-items-center text-[48px]" style={t.brutal ? { borderRadius: 24, background: c, border: `3px solid ${t.ink}`, boxShadow: `6px 6px 0 ${t.ink}` } : { borderRadius: 28, background: t.dark ? '#0a0d10' : t.surface, border: `1px solid ${alpha(c, 0.55)}`, boxShadow: `0 0 40px -10px ${alpha(c, t.dark ? 1 : 0.5)}` }}>
                  {s.icon}
                </div>
                <div className="text-[24px] font-bold" style={{ fontFamily: 'var(--k-font-display)', color: t.ink }}>
                  {s.title}
                </div>
                {s.sub && (
                  <div className="-mt-3 text-[14px] uppercase tracking-[0.15em]" style={{ color: t.muted, fontFamily: 'var(--k-font-mono)' }}>
                    {s.sub}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
      {bullets.length > 0 && <Bullets items={bullets} size={27} delay={RUN + 0.6} />}
      </div>
      {toast && <Toast className="right-20 top-20" icon={toast.icon} title={toast.title} body={toast.body} delay={RUN} from="top" />}
    </Stage>
  )
}
