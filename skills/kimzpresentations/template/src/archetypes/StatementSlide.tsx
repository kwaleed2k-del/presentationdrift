import { motion } from 'motion/react'
import BlurText from '@/components/BlurText'
import ShinyText from '@/components/ShinyText'
import Backdrop, { type BackdropKind } from '@/engine/Backdrop'
import { useAccent, useTheme } from '@/engine/context'
import { Card, Kicker, Reveal, Stage, isRTLText } from '@/engine/ui'

/** One big line (+ shimmering second line), optional row of problem/insight cards, and a punchline. */
export default function StatementSlide({
  kicker,
  line1,
  line2,
  cards = [],
  punchline,
  bg = 'rays',
  size = 118,
}: {
  kicker?: string
  line1: string
  line2?: string
  cards?: { icon: string; text: string }[]
  punchline?: string
  bg?: BackdropKind
  size?: number
}) {
  const t = useTheme()
  const [a, b] = useAccent()
  return (
    <Stage bg={<Backdrop kind={bg} />} className="items-center justify-center gap-12 text-center">
      {kicker && (
        <div className="flex justify-center">
          <Kicker label={kicker} />
        </div>
      )}
      <div className="leading-[0.98] tracking-[-0.035em]" style={{ fontSize: size, fontFamily: 'var(--k-font-display)', fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : undefined }}>
        {isRTLText(line1) ? (
          <Reveal className="ar">{line1}</Reveal>
        ) : (
          <BlurText text={line1} delay={90} animateBy="words" direction="top" className="justify-center" />
        )}
        {line2 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }}>
            <ShinyText text={line2} color={b} shineColor={t.dark ? '#ffffff' : t.ink} speed={2.4} />
          </motion.div>
        )}
      </div>
      {cards.length > 0 && (
        <div className="mt-4 flex justify-center gap-6">
          {cards.map((c, i) => (
            <motion.div key={c.text} initial={{ opacity: 0, y: 40, rotateX: 40 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: 1.5 + i * 0.2, type: 'spring', stiffness: 140 }}>
              <Card className="flex w-[480px] items-center gap-5 px-6 py-5 text-left">
                <span className="text-[40px]">{c.icon}</span>
                <span className="text-[24px] leading-snug" style={{ color: t.ink }}>
                  {c.text}
                </span>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
      {punchline && (
        <Reveal delay={2.4} y={20}>
          <div className="text-[26px] uppercase tracking-[0.25em]" style={{ color: a, fontFamily: 'var(--k-font-mono)' }}>
            {punchline}
          </div>
        </Reveal>
      )}
    </Stage>
  )
}
