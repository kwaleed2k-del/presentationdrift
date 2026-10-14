import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useAccent, useTheme } from '@/engine/context'
import { alpha } from '@/engine/theme'
import { Banner, Bullets, Confetti, Grad, Kicker, Reveal, Stage, Sticker, type StickerDef } from '@/engine/ui'

export type Person = { name: string; tag?: string; lines: ReactNode[] }
export type PhotoDef = { src?: string; name: string }

/** Straight 9:16 photo card. No rotation, no overlay — faces stay sharp. No src → glowing initial placeholder. */
export function Photo({ src, name, w, h, color, delay = 0.5 }: PhotoDef & { w: number; h: number; color: string; delay?: number }) {
  const t = useTheme()
  return (
    <motion.div className="relative shrink-0 overflow-hidden" style={{ width: w, height: h, borderRadius: 24, background: t.dark ? '#0d0b14' : t.surface, boxShadow: t.brutal ? `0 0 0 3px ${t.ink}, 8px 8px 0 ${t.ink}` : `0 0 0 3px ${color}, 0 30px 90px -30px ${color}` }} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0, transitionEnd: { transform: 'none' } }} transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
      {src ? (
        <img src={src} width={w} height={h} className="block size-full object-cover" draggable={false} />
      ) : (
        <div className="grid size-full place-items-center" style={{ background: `radial-gradient(circle at 50% 40%, ${alpha(color, 0.3)}, transparent 70%)` }}>
          <span className="font-bold" style={{ fontSize: w * 0.45, fontFamily: 'var(--k-font-display)', color: t.ink, textShadow: t.glow ? `0 0 50px ${color}` : undefined }}>
            {name[0]}
          </span>
        </div>
      )}
      <span className="absolute bottom-4 left-4 rounded-full bg-black/55 px-4 py-1.5 text-[20px] font-bold text-white backdrop-blur-md" style={{ fontFamily: 'var(--k-font-display)' }}>
        {name}
      </span>
    </motion.div>
  )
}

/**
 * Thank-you / team / testimonial slide: text left, photo board right (1, 2, or 1 big + 4 small for 5),
 * die-cut stickers on the board's edges, falling confetti and a giant "THANK YOU ✦ NAME" banner.
 * Pass `left` to replace the text block with any custom story (e.g. a JourneySlide-like path).
 */
export default function PeopleSlide({ kicker, person, photos, stickers = [], party = true, banner, extra, left }: { kicker?: string; person: Person; photos: PhotoDef[]; stickers?: StickerDef[]; party?: boolean; banner?: string; extra?: ReactNode; left?: ReactNode }) {
  const t = useTheme()
  const [a, b] = useAccent()
  const H = 836
  const big = (i: number) => <Photo key={i} {...photos[i]} w={470} h={H} color={i % 2 ? b : a} delay={0.4 + i * 0.15} />
  const small = (i: number) => <Photo key={i} {...photos[i]} w={228} h={(H - 24) / 2} color={i % 2 ? b : a} delay={0.6 + i * 0.12} />
  return (
    <Stage
      bg={
        party ? (
          <>
            <Banner text={banner ?? `THANK YOU ✦ ${person.name.toUpperCase()}`} />
            <Confetti />
          </>
        ) : undefined
      }
    >
      {kicker && <Kicker label={kicker} />}
      <div className="grid flex-1 grid-cols-[1fr_auto] items-center gap-12">
        {left ?? (
          <div className="flex flex-col gap-6">
            {person.tag && (
              <Reveal delay={0.3} y={10}>
                <span className="rounded-full px-4 py-1.5 text-[16px] font-bold uppercase tracking-[0.25em]" style={t.brutal ? { border: `2px solid ${t.ink}`, background: a, color: t.ink, fontFamily: 'var(--k-font-mono)' } : { border: `1px solid ${alpha(a, 0.4)}`, background: alpha(a, 0.08), color: t.dark ? a : t.ink, fontFamily: 'var(--k-font-mono)' }}>
                  {person.tag}
                </span>
              </Reveal>
            )}
            <Reveal delay={0.45}>
              <div className="text-[100px] font-bold leading-[0.9] tracking-[-0.04em]" style={{ fontFamily: 'var(--k-font-display)' }}>
                <Grad>{person.name}</Grad>
              </div>
            </Reveal>
            <Bullets items={person.lines} size={26} delay={0.75} />
          </div>
        )}
        <div className="relative flex items-center gap-6">
          {photos.length === 5 ? (
            <>
              <div className="flex flex-col gap-6">{[1, 2].map(small)}</div>
              {big(0)}
              <div className="flex flex-col gap-6">{[3, 4].map(small)}</div>
            </>
          ) : (
            photos.map((_, i) => big(i))
          )}
          {extra}
          {stickers.map((s, i) => (
            <Sticker key={s.t} {...s} delay={1.4 + i * 0.25} />
          ))}
        </div>
      </div>
    </Stage>
  )
}
