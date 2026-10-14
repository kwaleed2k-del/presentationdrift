import { motion } from 'motion/react'
import { useState, type ReactNode } from 'react'
import DecryptedText from '@/components/DecryptedText'
import ShinyText from '@/components/ShinyText'
import Backdrop, { type BackdropKind } from '@/engine/Backdrop'
import { useAccent, useTheme } from '@/engine/context'
import { Chip, Reveal, Stage, Terminal, isRTLText, type TermLine } from '@/engine/ui'

/**
 * Opening slide. Optional typing terminal that "boots" the deck, then the title decrypts in.
 * RTL titles skip the per-character decrypt (it would break letter joining) and fade in whole.
 */
export default function TitleSlide({
  title,
  subtitle,
  kicker,
  chips = [],
  terminal,
  bg = 'hyperspeed',
  size = 180,
}: {
  title: string
  subtitle?: ReactNode
  kicker?: string
  chips?: string[]
  terminal?: TermLine[]
  bg?: BackdropKind
  size?: number
}) {
  const t = useTheme()
  const [a, b] = useAccent()
  const [ready, setReady] = useState(!terminal)
  const rtl = isRTLText(title)
  return (
    <Stage bg={<Backdrop kind={bg} />} grid={false} glow={bg === 'none'} className="items-center justify-center gap-10">
      {bg !== 'none' && t.dark && <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_10%,rgba(0,0,0,.75)_75%)]" />}
      {terminal && (
        <Reveal delay={0.2} y={-20}>
          <Terminal className="w-[780px]" lines={terminal} onDone={() => setReady(true)} />
        </Reveal>
      )}
      <div className="flex min-h-[260px] flex-col items-center text-center">
        {ready && (
          <>
            {kicker && (
              <Reveal y={10}>
                <div className="mb-6 text-[18px] uppercase tracking-[0.5em]" style={{ color: a, fontFamily: 'var(--k-font-mono)' }}>
                  {kicker}
                </div>
              </Reveal>
            )}
            <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="leading-none tracking-[-0.04em]" style={{ fontSize: size, fontFamily: 'var(--k-font-display)', fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : undefined, color: t.ink, textShadow: t.glow ? `0 0 50px ${a}99` : undefined }}>
              {rtl ? (
                <span className="ar">{title}</span>
              ) : (
                <DecryptedText text={title} animateOn="view" sequential speed={40} revealDirection="center" characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*01" encryptedClassName="opacity-70" />
              )}
            </motion.div>
            {subtitle && (
              <Reveal delay={0.8} y={10}>
                <div className="mt-6 text-[36px] font-medium">{typeof subtitle === 'string' ? <ShinyText text={subtitle} color={t.muted} shineColor={t.ink} speed={3} /> : subtitle}</div>
              </Reveal>
            )}
            {chips.length > 0 && (
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                {chips.map((c, i) => (
                  <Chip key={c} delay={1.2 + i * 0.1} color={i % 2 ? b : a}>
                    {c}
                  </Chip>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Stage>
  )
}
