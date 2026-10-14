import { motion } from 'motion/react'
import type { CSSProperties } from 'react'
import ClickSpark from '@/components/ClickSpark'
import GradientText from '@/components/GradientText'
import SplitText from '@/components/SplitText'
import Backdrop, { type BackdropKind } from '@/engine/Backdrop'
import { useAccent, useTheme } from '@/engine/context'
import { Reveal, Stage, isRTLText } from '@/engine/ui'

// Drift lap: an ellipse around the headline (counter-clockwise on screen).
const CX = 960
const CY = 560
const RX = 760
const RY = 330
const lap = (rx: number, ry: number) => `M ${CX - rx} ${CY} a ${rx} ${ry} 0 1 0 ${rx * 2} 0 a ${rx} ${ry} 0 1 0 ${-rx * 2} 0`
const LAP = lap(RX, RY)
const LOOP = 7

/** Neon top-down muscle car (generic, unbranded): long hood, twin stripes, quad tails. Points +x. */
function Car({ body, stripe1, stripe2, glass }: { body: string; stripe1: string; stripe2: string; glass: string }) {
  return (
    <svg width="320" height="150" viewBox="0 0 320 150" className="overflow-visible" style={{ filter: `drop-shadow(0 0 14px ${body}) drop-shadow(0 0 30px ${body}88)` }}>
      <defs>
        <linearGradient id="car-stripe" x1="0" x2="1">
          <stop offset="0" stopColor={stripe1} />
          <stop offset="1" stopColor={stripe2} />
        </linearGradient>
        <radialGradient id="car-beam" cx="0" cy="0.5" r="1">
          <stop offset="0" stopColor="#fff7d6" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff7d6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M 300 38 L 470 0 L 470 70 Z" fill="url(#car-beam)" />
      <path d="M 300 112 L 470 80 L 470 150 Z" fill="url(#car-beam)" />
      {[
        [48, 6],
        [48, 124],
        [222, 6],
        [222, 124],
      ].map(([x, y]) => (
        <rect key={`${x}${y}`} x={x} y={y} width="48" height="20" rx="5" fill="#050407" stroke="#3b3346" strokeWidth="2" />
      ))}
      <path d="M 18 30 Q 14 75 18 120 Q 22 134 48 136 L 262 134 Q 296 130 306 108 Q 314 75 306 42 Q 296 20 262 16 L 48 14 Q 22 16 18 30 Z" fill="#1a1024" stroke={body} strokeWidth="3" />
      <rect x="18" y="58" width="290" height="11" fill="url(#car-stripe)" />
      <rect x="18" y="81" width="290" height="11" fill="url(#car-stripe)" />
      <path d="M 78 34 L 104 30 L 104 120 L 78 116 Z" fill="#0b0a12" stroke={glass} strokeWidth="2" />
      <rect x="104" y="30" width="62" height="90" rx="8" fill="#140c1c" stroke={glass} strokeWidth="2" />
      <path d="M 166 30 L 204 38 L 204 112 L 166 120 Z" fill="#0b0a12" stroke={glass} strokeWidth="2" />
      <rect x="168" y="10" width="14" height="10" rx="3" fill={body} />
      <rect x="168" y="130" width="14" height="10" rx="3" fill={body} />
      <rect x="296" y="30" width="10" height="20" rx="3" fill="#fff7d6" />
      <rect x="296" y="100" width="10" height="20" rx="3" fill="#fff7d6" />
      {[30, 46, 92, 108].map((y) => (
        <rect key={y} x="14" y={y} width="8" height="12" rx="2" fill="#ff2e63" />
      ))}
    </svg>
  )
}

const onLap = (delay: number, extra?: CSSProperties): CSSProperties => ({ offsetPath: `path("${LAP}")`, offsetRotate: 'auto -28deg', animation: `drift-lap ${LOOP}s linear ${delay}s infinite`, ...extra })

/**
 * The last slide. Two lines (letters fly in, then an animated gradient line), a sign-off, click sparks,
 * and optionally a neon car drifting laps around it with tyre smoke + skid marks (`car`).
 */
export default function FinaleSlide({ kicker = 'that’s a wrap', line1, line2, signoff, car = false, bg = 'none' }: { kicker?: string; line1: string; line2: string; signoff?: string; car?: boolean; bg?: BackdropKind }) {
  const t = useTheme()
  const [a, b] = useAccent()
  const rtl = isRTLText(line1)
  return (
    <ClickSpark sparkColor={[a, b, t.a3]} sparkCount={12} sparkRadius={40} sparkSize={14}>
      <div className="relative h-[1080px] w-[1920px]">
        <Stage bg={<Backdrop kind={bg} />} pad="p-0" className="items-center justify-center">
          {car && (
            <>
              <svg className="pointer-events-none absolute inset-0" width="1920" height="1080">
                {[RX - 34, RX + 34].map((rx, i) => (
                  <motion.path key={rx} d={lap(rx, RY + (i ? 34 : -34))} fill="none" stroke={t.dark ? '#ffffff' : t.ink} strokeOpacity="0.07" strokeWidth="14" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: LOOP, ease: 'linear', delay: 0.6 }} />
                ))}
              </svg>
              {Array.from({ length: 14 }, (_, k) => {
                const size = 50 + k * 14
                return <div key={k} className="pointer-events-none absolute left-0 top-0 rounded-full" style={onLap(0.6 + 0.09 * (k + 1), { width: size, height: size, background: `radial-gradient(circle, ${k % 3 === 0 ? `${a}99` : k % 3 === 1 ? `${b}88` : '#ffffff77'}, transparent 70%)`, filter: `blur(${6 + k}px)`, opacity: 0.9 - k * 0.055 })} />
              })}
              <div className="pointer-events-none absolute left-0 top-0 z-10" style={onLap(0.6)}>
                <Car body={a} stripe1={t.a3} stripe2={a} glass={b} />
              </div>
            </>
          )}
          <div className="relative z-20 flex flex-col items-center gap-8 text-center">
            <Reveal delay={0.2} y={10}>
              <span className="rounded-full px-5 py-1.5 text-[18px] uppercase tracking-[0.4em]" style={{ border: `1px solid ${a}66`, color: a, background: `${a}14`, fontFamily: 'var(--k-font-mono)' }}>
                {kicker}
              </span>
            </Reveal>
            {rtl ? (
              <Reveal className="ar text-[118px] font-bold leading-none" style={{ color: t.ink }}>
                {line1}
              </Reveal>
            ) : (
              <SplitText text={line1} tag="h1" className="text-[118px] font-bold leading-none tracking-[-0.04em]" delay={40} duration={0.7} splitType="chars" from={{ opacity: 0, y: 60 }} to={{ opacity: 1, y: 0 }} />
            )}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.3, duration: 0.8 }} style={{ fontFamily: 'var(--k-font-display)' }}>
              <GradientText colors={[a, t.a3, b, a]} animationSpeed={5} className="text-[132px] font-bold leading-none tracking-[-0.04em]">
                {line2}
              </GradientText>
            </motion.div>
            {signoff && (
              <Reveal delay={2.2} className="mt-4 text-[18px] tracking-[0.3em]" style={{ color: t.muted, fontFamily: 'var(--k-font-mono)' }}>
                {signoff}
              </Reveal>
            )}
          </div>
        </Stage>
      </div>
    </ClickSpark>
  )
}
