import { motion } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { useAccent, useTheme } from '@/engine/context'
import { Grad, Kicker, Reveal, Stage } from '@/engine/ui'

export type WallVideo = { src: string; label: string; sub?: string }

/**
 * Several clips playing together, muted, from 0. Encode them first with scripts/encode-video.sh
 * (540p yuv420p, short GOP, speed baked in) — 1080p full-range files stutter when 4 decode at once.
 */
export default function VideoWallSlide({ kicker, title, accent, videos, cols = 2, width = 720, note }: { kicker?: string; title: ReactNode; accent?: ReactNode; videos: WallVideo[]; cols?: number; width?: number; note?: string }) {
  const t = useTheme()
  const [a] = useAccent()
  const refs = useRef<(HTMLVideoElement | null)[]>([])
  useEffect(() => {
    refs.current.forEach((v) => {
      if (!v) return
      v.currentTime = 0
      v.play().catch(() => {})
    })
  }, [])
  return (
    <Stage className="items-center gap-7" pad="px-24 pt-12 pb-16">
      <div className="flex w-full items-end justify-between">
        <div className="flex flex-col gap-4">
          {kicker && <Kicker label={kicker} />}
          <Reveal delay={0.2}>
            <h1 className="text-[60px] leading-none tracking-[-0.03em]" style={{ fontFamily: 'var(--k-font-display)', fontWeight: t.displayWeight, color: t.ink }}>
              {title} {accent && <Grad>{accent}</Grad>}
            </h1>
          </Reveal>
        </div>
        {note && (
          <Reveal delay={0.5} className="pb-2 text-right text-[16px] uppercase tracking-[0.2em]" style={{ color: t.muted, fontFamily: 'var(--k-font-mono)' }}>
            {note}
          </Reveal>
        )}
      </div>
      <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${cols}, ${width}px)` }}>
        {videos.map((v, i) => (
          <motion.div key={v.src} className="relative overflow-hidden bg-black" style={{ width, aspectRatio: '16 / 9', borderRadius: 18, boxShadow: t.brutal ? `0 0 0 3px ${t.ink}, 8px 8px 0 ${t.ink}` : `0 0 0 1px ${t.border}, 0 30px 80px -30px ${a}` }} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1, transitionEnd: { transform: 'none' } }} transition={{ delay: 0.3 + i * 0.12, duration: 0.7 }}>
            <video ref={(el) => { refs.current[i] = el }} src={v.src} autoPlay muted playsInline loop preload="auto" className="size-full object-cover" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/85 to-transparent px-5 pb-4 pt-16">
              <div>
                <div className="text-[24px] font-bold text-white" style={{ fontFamily: 'var(--k-font-display)' }}>
                  {v.label}
                </div>
                {v.sub && (
                  <div className="text-[13px] uppercase tracking-[0.2em] text-white/55" style={{ fontFamily: 'var(--k-font-mono)' }}>
                    {v.sub}
                  </div>
                )}
              </div>
              <span className="flex items-center gap-2 text-[12px] text-white/60" style={{ fontFamily: 'var(--k-font-mono)' }}>
                <span className="size-2 animate-pulse rounded-full bg-red-500" /> LIVE
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </Stage>
  )
}
