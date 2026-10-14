import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { BrowserFrame, Bullets, Grad, Kicker, Stage, Title, Toast } from '@/engine/ui'

type Visual =
  | { kind: 'screenshot'; src: string; w: number; h: number; url?: string }
  | { kind: 'image'; src: string; w: number; h: number }
  | { kind: 'video'; src: string; w: number }
  | { kind: 'custom'; node: ReactNode }

/**
 * The workhorse: headline + one-sentence bullets on one side, a visual on the other, optional pop-up toasts.
 * Pass images/screenshots at EXACT display size (w×h) so they render 1:1.
 */
export default function SplitSlide({
  kicker,
  title,
  accent,
  bullets = [],
  visual,
  toasts = [],
  flip = false,
  leftWidth = 700,
}: {
  kicker?: string
  title: ReactNode
  accent?: ReactNode
  bullets?: ReactNode[]
  visual?: Visual
  toasts?: { icon: string; title: string; body?: string; at?: string }[]
  flip?: boolean
  leftWidth?: number
}) {
  const text = (
    <div className="flex flex-col justify-center gap-9" style={{ width: leftWidth }}>
      {kicker && <Kicker label={kicker} />}
      <Title size={leftWidth < 640 ? 68 : leftWidth < 760 ? 78 : 88} className="leading-[1.02]">
        {title}
        {accent && (
          <>
            <br />
            <Grad>{accent}</Grad>
          </>
        )}
      </Title>
      {bullets.length > 0 && <Bullets items={bullets} size={28} delay={0.7} />}
    </div>
  )
  const vis = visual && (
    <motion.div className="relative flex flex-1 items-center justify-center" initial={{ opacity: 0, x: flip ? -60 : 60 }} animate={{ opacity: 1, x: 0, transitionEnd: { transform: 'none' } }} transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
      {visual.kind === 'screenshot' && <BrowserFrame src={visual.src} w={visual.w} h={visual.h} url={visual.url} />}
      {visual.kind === 'image' && <img src={visual.src} width={visual.w} height={visual.h} className="block rounded-3xl" draggable={false} />}
      {visual.kind === 'video' && <video src={visual.src} autoPlay muted loop playsInline className="rounded-3xl" style={{ width: visual.w }} />}
      {visual.kind === 'custom' && visual.node}
      {toasts.map((t, i) => (
        <Toast key={t.title} icon={t.icon} title={t.title} body={t.body} delay={1.6 + i * 0.6} className={t.at ?? (i % 2 ? '-bottom-6 right-0' : '-top-6 left-0')} from={i % 2 ? 'bottom' : 'top'} />
      ))}
    </motion.div>
  )
  return (
    <Stage className="flex-row gap-14">
      {flip ? (
        <>
          {vis}
          {text}
        </>
      ) : (
        <>
          {text}
          {vis}
        </>
      )}
    </Stage>
  )
}
