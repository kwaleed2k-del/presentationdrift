import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useAccent, useTheme } from '@/engine/context'
import { Kicker, Reveal } from '@/engine/ui'

export type Tile = { w: number; image?: string; video?: string; label?: { t: string; sub?: string; from: string; to: string }; node?: ReactNode }
const H = 250

function Row({ tiles, dur, rev }: { tiles: Tile[]; dur: number; rev?: boolean }) {
  const t = useTheme()
  const strip = (k: string) => (
    <div className="flex shrink-0 gap-5 pr-5">
      {tiles.map((tile, i) => (
        <div key={`${k}${i}`} className="shrink-0 overflow-hidden" style={{ width: tile.w, height: H, borderRadius: 18, border: t.brutal ? `3px solid ${t.ink}` : `1px solid ${t.border}`, background: '#000' }}>
          {tile.image && <img src={tile.image} className="size-full object-cover" draggable={false} />}
          {tile.video && <video src={tile.video} autoPlay muted loop playsInline className="size-full object-cover" />}
          {tile.label && (
            <div className="flex size-full flex-col justify-end p-6" style={{ background: `linear-gradient(135deg, ${tile.label.from}, ${tile.label.to})` }}>
              {tile.label.sub && (
                <div className="text-[14px] uppercase tracking-[0.25em] text-white/75" style={{ fontFamily: 'var(--k-font-mono)' }}>
                  {tile.label.sub}
                </div>
              )}
              <div className="text-[44px] font-bold leading-none text-white" style={{ fontFamily: 'var(--k-font-display)' }}>
                {tile.label.t}
              </div>
            </div>
          )}
          {tile.node}
        </div>
      ))}
    </div>
  )
  return (
    <div className="flex w-max" style={{ animation: `marquee ${dur}s linear infinite`, animationDirection: rev ? 'reverse' : 'normal' }}>
      {strip('a')}
      {strip('b')}
    </div>
  )
}

/** A tilted 3D wall of everything you made, rows scrolling in opposite directions, headline in the middle. */
export default function WallOfWorkSlide({ kicker, line1, line2, chips = [], rows }: { kicker?: string; line1: string; line2: string; chips?: string[]; rows: Tile[][] }) {
  const t = useTheme()
  const [a, b] = useAccent()
  const speeds = [60, 75, 55, 70]
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: t.bg }}>
      <motion.div className="absolute left-1/2 top-1/2 flex flex-col gap-5" style={{ width: 3600, marginLeft: -1800, marginTop: -560, transformPerspective: 1800 }} initial={{ opacity: 0, rotateX: 50, rotateZ: -14, scale: 0.8 }} animate={{ opacity: 1, rotateX: 26, rotateZ: -10, scale: 1 }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}>
        {rows.map((r, i) => (
          <Row key={i} tiles={r} dur={speeds[i % 4]} rev={i % 2 === 1} />
        ))}
      </motion.div>
      <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse 55% 50% at center, ${t.bg}eb 0%, ${t.bg}99 55%, ${t.bg}26 100%)` }} />
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-7 text-center">
        {kicker && <Kicker label={kicker} />}
        <Reveal delay={0.5}>
          <h1 className="text-[118px] leading-[0.92] tracking-[-0.04em]" style={{ fontFamily: 'var(--k-font-display)', fontWeight: t.displayWeight, color: t.ink }}>
            {line1}
            <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(100deg, ${a}, ${b}, ${t.a3})` }}>
              {line2}
            </span>
          </h1>
        </Reveal>
        <div className="flex flex-wrap justify-center gap-3">
          {chips.map((c, i) => (
            <motion.span key={c} className="rounded-full px-5 py-2 text-[18px] font-bold backdrop-blur-md" style={{ border: `1px solid ${i % 2 ? b : a}`, color: t.ink, background: t.dark ? '#05040ab0' : '#ffffffcc', fontFamily: 'var(--k-font-mono)' }} initial={{ opacity: 0, y: 20, scale: 0.7 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 1.1 + i * 0.08, type: 'spring', stiffness: 240 }}>
              {c}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  )
}
