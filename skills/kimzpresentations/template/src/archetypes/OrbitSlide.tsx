import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import RotatingText from '@/components/RotatingText'
import { OrbitingCircles } from '@/components/ui/orbiting-circles'
import { useAccent, useTheme } from '@/engine/context'
import { Bullets, Kicker, Reveal, Stage } from '@/engine/ui'

function Pill({ t: text, color }: { t: string; color: string }) {
  const t = useTheme()
  return (
    <span className="whitespace-nowrap rounded-full px-4 py-2 text-[18px] font-bold backdrop-blur-md" style={t.brutal ? { border: `2px solid ${t.ink}`, background: color, color: t.ink, fontFamily: 'var(--k-font-mono)' } : { border: `1px solid ${color}`, background: t.dark ? '#0b0a12cc' : '#ffffffdd', color: t.dark ? color : t.ink, boxShadow: t.glow ? `0 0 24px -6px ${color}` : undefined, fontFamily: 'var(--k-font-mono)' }}>
      {text}
    </span>
  )
}

/**
 * "Who am I / what powers this": a centre (photo, logo or word) with two counter-rotating rings of tool pills,
 * plus a headline with a rotating verb and bullets. Orbit = Magic UI OrbitingCircles (needs @utility animate-orbit).
 */
export default function OrbitSlide({ kicker, center, inner, outer, lead = 'I', words, after = 'with it.', heading, bullets = [] }: { kicker?: string; center: ReactNode; inner: string[]; outer: string[]; lead?: string; words?: string[]; after?: string; heading?: ReactNode; bullets?: ReactNode[] }) {
  const t = useTheme()
  const [a, b] = useAccent()
  return (
    <Stage className="grid grid-cols-[900px_1fr] items-center" pad="px-0 py-0">
      <motion.div className="relative mx-auto flex size-[860px] items-center justify-center" initial={{ opacity: 0, scale: 0.7, rotate: -20 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
        <div className="relative grid size-[300px] place-items-center overflow-hidden rounded-full p-[5px]" style={{ background: `conic-gradient(from 0deg, ${a}, ${b}, ${t.a3}, ${a})` }}>
          <div className="grid size-full place-items-center overflow-hidden rounded-full" style={{ background: t.bg }}>
            {center}
          </div>
        </div>
        {inner.map((x, i) => (
          <OrbitingCircles key={x} radius={230} duration={24} delay={(24 / inner.length) * i} path={i === 0} pathClassName={t.dark ? 'stroke-white/15' : 'stroke-black/15'}>
            <Pill t={x} color={a} />
          </OrbitingCircles>
        ))}
        {outer.map((x, i) => (
          <OrbitingCircles key={x} radius={385} duration={40} delay={(40 / outer.length) * i} reverse path={i === 0} pathClassName={t.dark ? 'stroke-white/10' : 'stroke-black/10'}>
            <Pill t={x} color={i % 2 ? t.a3 : b} />
          </OrbitingCircles>
        ))}
      </motion.div>
      <div className="flex flex-col gap-10 pr-24">
        {kicker && <Kicker label={kicker} />}
        <Reveal delay={0.3}>
          <h1 className="text-[88px] leading-[0.95] tracking-[-0.03em]" style={{ fontFamily: 'var(--k-font-display)', fontWeight: t.displayWeight, color: t.ink }}>
            {heading}
            {words && (
              <span className="mt-4 flex items-center gap-5">
                {lead}
                <RotatingText texts={words} mainClassName="overflow-hidden rounded-2xl px-5 py-1" style={{ background: `linear-gradient(90deg, ${a}, ${b})`, color: t.dark ? '#06050b' : '#ffffff' }} staggerFrom="last" staggerDuration={0.025} splitLevelClassName="overflow-hidden pb-1" rotationInterval={1800} transition={{ type: 'spring', damping: 30, stiffness: 400 }} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '-120%' }} />
                {after}
              </span>
            )}
          </h1>
        </Reveal>
        {bullets.length > 0 && <Bullets items={bullets} delay={0.8} />}
      </div>
    </Stage>
  )
}
