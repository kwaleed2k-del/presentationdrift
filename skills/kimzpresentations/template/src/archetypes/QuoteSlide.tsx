import { motion } from 'motion/react'
import BlurText from '@/components/BlurText'
import { useAccent, useTheme } from '@/engine/context'
import { Reveal, Stage, isRTLText } from '@/engine/ui'

/** One big quote, attribution, optional avatar. Use real quotes only. */
export default function QuoteSlide({ quote, author, role, avatar }: { quote: string; author: string; role?: string; avatar?: string }) {
  const t = useTheme()
  const [a] = useAccent()
  return (
    <Stage className="items-center justify-center px-40 text-center">
      <motion.div className="text-[220px] leading-none" style={{ color: a, fontFamily: 'var(--k-font-display)', opacity: 0.9 }} initial={{ opacity: 0, scale: 0.5, rotate: -20 }} animate={{ opacity: 0.9, scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 120 }}>
        “
      </motion.div>
      <div className="-mt-16 text-[64px] leading-[1.15] tracking-[-0.02em]" style={{ fontFamily: 'var(--k-font-display)', fontWeight: t.displayWeight === 700 ? 600 : t.displayWeight, fontStyle: t.displayItalic ? 'italic' : undefined, color: t.ink }}>
        {isRTLText(quote) ? <Reveal className="ar">{quote}</Reveal> : <BlurText text={quote} delay={60} animateBy="words" direction="bottom" className="justify-center" />}
      </div>
      <Reveal delay={1.6} className="mt-12 flex items-center gap-5">
        {avatar && <img src={avatar} width={72} height={72} className="rounded-full object-cover" style={{ boxShadow: `0 0 0 3px ${a}` }} />}
        <div className="text-left">
          <div className="text-[28px] font-bold" style={{ color: t.ink }}>
            {author}
          </div>
          {role && (
            <div className="text-[18px] uppercase tracking-[0.2em]" style={{ color: t.muted, fontFamily: 'var(--k-font-mono)' }}>
              {role}
            </div>
          )}
        </div>
      </Reveal>
    </Stage>
  )
}
