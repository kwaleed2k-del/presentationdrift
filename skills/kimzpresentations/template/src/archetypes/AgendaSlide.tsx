import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useAccent, useStep, useTheme } from '@/engine/context'
import { alpha } from '@/engine/theme'
import { Grad, Kicker, Stage, Title } from '@/engine/ui'

/** Agenda / chapters. With `steps: items.length` each → highlights the next chapter. */
export default function AgendaSlide({ kicker = 'Agenda', title, accent, items }: { kicker?: string; title: ReactNode; accent?: ReactNode; items: { title: string; sub?: string }[] }) {
  const t = useTheme()
  const [a, b] = useAccent()
  const step = useStep()
  return (
    <Stage className="grid grid-cols-[640px_1fr] items-center gap-16">
      <div className="flex flex-col gap-8">
        <Kicker label={kicker} />
        <Title size={96}>
          {title} {accent && <Grad>{accent}</Grad>}
        </Title>
      </div>
      <div className="flex flex-col gap-4">
        {items.map((it, i) => {
          const on = i === step
          return (
            <motion.div
              key={it.title}
              className="flex items-center gap-7 px-7 py-5 transition-all duration-500"
              style={{ borderRadius: t.radius, background: on ? alpha(a, t.dark ? 0.14 : 0.1) : t.surface, border: t.brutal ? `3px solid ${t.ink}` : `1px solid ${on ? a : t.border}`, boxShadow: t.brutal && on ? `6px 6px 0 ${t.ink}` : on && t.glow ? `0 0 60px -20px ${a}` : 'none' }}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: on ? 16 : 0 }}
              transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 140 }}
            >
              <span className="w-[90px] text-[56px] font-bold leading-none" style={{ fontFamily: 'var(--k-font-display)', color: on ? a : t.muted }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <div className="text-[34px] font-bold" style={{ fontFamily: 'var(--k-font-display)', color: t.ink }}>
                  {it.title}
                </div>
                {it.sub && (
                  <div className="text-[20px]" style={{ color: t.muted }}>
                    {it.sub}
                  </div>
                )}
              </div>
              {on && <span className="ml-auto text-[28px]" style={{ color: b }}>●</span>}
            </motion.div>
          )
        })}
      </div>
    </Stage>
  )
}
