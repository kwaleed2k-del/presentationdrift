import { motion } from 'motion/react'
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useAccent, useSlideNumber, useTheme } from './context'
import { alpha } from './theme'

export const ease = [0.22, 1, 0.36, 1] as const
/** Arabic/Hebrew detection — per-character effects break letter joining, so we fall back to word/line motion. */
export const isRTLText = (s: string) => /[֐-ࣿ]/.test(s)

/* ─────────────────────────── layout ─────────────────────────── */

/** Standard slide surface: themed background, optional grid + accent glows, padded column. */
export function Stage({ children, bg, className, glow = true, grid = true, pad = 'px-20 py-16' }: { children: ReactNode; bg?: ReactNode; className?: string; glow?: boolean; grid?: boolean; pad?: string }) {
  const t = useTheme()
  const [a, b] = useAccent()
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: `radial-gradient(ellipse at 70% 0%, ${t.bg2} 0%, ${t.bg} 65%)` }}>
      {grid && t.grid > 0 && <div className="grid-bg mask-fade pointer-events-none absolute inset-0" />}
      {bg}
      {glow && t.glow > 0 && (
        <>
          <Glow color={a} className="-left-60 -top-60" size={900} />
          <Glow color={b} className="-bottom-80 -right-40" size={800} />
        </>
      )}
      <div className={cn('relative z-10 flex h-full flex-col', pad, className)}>{children}</div>
    </div>
  )
}

export function Bg({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={cn('pointer-events-none absolute inset-0', className)}>{children}</div>
}

export function Glow({ color, className, size = 900 }: { color: string; className?: string; size?: number }) {
  const t = useTheme()
  if (!t.glow) return null
  return <div className={cn('pointer-events-none absolute rounded-full blur-[120px]', className)} style={{ width: size, height: size, background: color, opacity: t.glow }} />
}

/* ─────────────────────────── motion ─────────────────────────── */

export function Reveal({ children, delay = 0, y = 30, x = 0, className, style }: { children: ReactNode; delay?: number; y?: number; x?: number; className?: string; style?: CSSProperties }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y, x, filter: 'blur(8px)' }}
      // filter:none at the end — a lingering blur(0px) makes Chrome rasterise the subtree soft
      animate={{ opacity: 1, y: 0, x: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

/* ─────────────────────────── type ─────────────────────────── */

export function Kicker({ label, delay = 0.1, color }: { label: string; delay?: number; color?: string }) {
  const n = useSlideNumber()
  const t = useTheme()
  const acc = useAccent()
  const c = color ?? acc[0]
  return (
    <Reveal delay={delay} y={10}>
      <div className="flex items-center gap-4 text-[18px] uppercase tracking-[0.35em]" style={{ color: c, fontFamily: 'var(--k-font-mono)' }}>
        <span className="rounded-md px-2.5 py-1 text-[15px]" style={t.brutal ? { border: `2px solid ${t.ink}`, background: c, color: t.ink } : { border: `1px solid ${alpha(c, 0.4)}`, background: alpha(c, 0.08) }}>
          {n}
        </span>
        <span>{label}</span>
        <motion.span className="h-px origin-left" style={{ background: `linear-gradient(90deg, ${c}, transparent)` }} initial={{ width: 0 }} animate={{ width: 220 }} transition={{ duration: 1.2, delay: delay + 0.3, ease }} />
      </div>
    </Reveal>
  )
}

/** Display headline in the theme's display face (grotesk, or italic serif on luxe/mono). */
export function Title({ children, className, delay = 0.2, size = 88 }: { children: ReactNode; className?: string; delay?: number; size?: number }) {
  const t = useTheme()
  return (
    <Reveal delay={delay}>
      <h1 className={cn('leading-[0.95] tracking-[-0.03em]', className)} style={{ fontFamily: 'var(--k-font-display)', fontWeight: t.displayWeight, fontSize: size, color: t.ink, lineHeight: t.brutal ? 1.22 : undefined }}>
        {children}
      </h1>
    </Reveal>
  )
}

/** Accent text: gradient on most themes, solid highlighter block on brutal, italic on serif themes. */
export function Grad({ children, from, to }: { children: ReactNode; from?: string; to?: string }) {
  const t = useTheme()
  const [a, b] = useAccent()
  if (t.brutal)
    return (
      <span className="px-2" style={{ background: from ?? a, color: t.ink, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone', lineHeight: 1.22 }}>
        {children}
      </span>
    )
  return (
    <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(100deg, ${from ?? a}, ${to ?? b})`, fontStyle: t.displayItalic ? 'italic' : undefined, paddingRight: t.displayItalic ? '0.12em' : undefined, marginRight: t.displayItalic ? '-0.06em' : undefined, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}>
      {children}
    </span>
  )
}

export function Bullets({ items, delay = 0.6, className, size = 30, color }: { items: ReactNode[]; delay?: number; className?: string; size?: number; color?: string }) {
  const t = useTheme()
  const acc = useAccent()
  const c = color ?? acc[0]
  return (
    <ul className={cn('flex flex-col gap-5', className)}>
      {items.map((it, i) => (
        <motion.li key={i} className="flex items-start gap-5 leading-snug" style={{ fontSize: size, color: t.ink, opacity: 0.88 }} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 0.88, x: 0 }} transition={{ duration: 0.6, delay: delay + i * 0.18, ease }}>
          <span className="relative mt-[0.45em] flex size-3 shrink-0">
            {t.glow > 0 && <span className="absolute inset-0 animate-pulse-ring rounded-full" style={{ background: c }} />}
            <span className="relative size-3 rounded-full" style={{ background: c, boxShadow: t.glow ? `0 0 14px ${c}` : 'none', outline: t.brutal ? `2px solid ${t.ink}` : undefined }} />
          </span>
          <span>{it}</span>
        </motion.li>
      ))}
    </ul>
  )
}

export function Chip({ children, color, className, delay }: { children: ReactNode; color?: string; className?: string; delay?: number }) {
  const t = useTheme()
  const acc = useAccent()
  const c = color ?? acc[0]
  const body = (
    <span
      className={cn('inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[17px] uppercase tracking-[0.12em]', className)}
      style={t.brutal ? { border: `2px solid ${t.ink}`, background: c, color: t.ink, fontFamily: 'var(--k-font-mono)', fontWeight: 700 } : { border: `1px solid ${alpha(c, 0.35)}`, background: alpha(c, 0.1), color: t.dark ? c : t.ink, fontFamily: 'var(--k-font-mono)' }}
    >
      {children}
    </span>
  )
  if (delay === undefined) return body
  return (
    <motion.span className="inline-block" initial={{ opacity: 0, scale: 0.6, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 18, delay }}>
      {body}
    </motion.span>
  )
}

/* ─────────────────────────── surfaces ─────────────────────────── */

/** Themed card: glass on dark, white on light, ink-outlined with offset shadow on brutal. */
export function Card({ children, className, style, color }: { children: ReactNode; className?: string; style?: CSSProperties; color?: string }) {
  const t = useTheme()
  const acc = useAccent()
  const c = color ?? acc[0]
  const look: CSSProperties = t.brutal
    ? { background: t.surface, border: `3px solid ${t.ink}`, boxShadow: `8px 8px 0 ${t.ink}` }
    : { background: t.surface, border: `1px solid ${t.border}`, boxShadow: t.dark ? `0 0 60px -28px ${c}, inset 0 1px 0 rgba(255,255,255,.06)` : '0 20px 50px -30px rgba(15,23,42,.35)', backdropFilter: t.dark ? 'blur(16px)' : undefined }
  return (
    <div className={cn('relative', className)} style={{ borderRadius: t.radius, ...look, ...style }}>
      {children}
    </div>
  )
}

export function Toast({ icon, title, body, color, delay = 1, className, from = 'right' }: { icon: ReactNode; title: ReactNode; body?: ReactNode; color?: string; delay?: number; className?: string; from?: 'right' | 'left' | 'bottom' | 'top' }) {
  const t = useTheme()
  const acc = useAccent()
  const c = color ?? acc[0]
  const offset = { right: { x: 120 }, left: { x: -120 }, bottom: { y: 80 }, top: { y: -80 } }[from]
  return (
    <motion.div className={cn('absolute z-30', className)} initial={{ opacity: 0, scale: 0.85, ...offset }} animate={{ opacity: 1, scale: 1, x: 0, y: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 20, delay }}>
      <div
        className="flex min-w-[340px] items-start gap-4 rounded-2xl px-5 py-4 backdrop-blur-xl"
        style={t.brutal ? { background: t.surface, border: `3px solid ${t.ink}`, boxShadow: `6px 6px 0 ${t.ink}` } : { background: t.dark ? 'rgba(13,11,22,.9)' : 'rgba(255,255,255,.95)', border: `1px solid ${alpha(c, 0.35)}`, boxShadow: `0 20px 60px -20px ${alpha(c, t.dark ? 1 : 0.5)}` }}
      >
        <div className="grid size-11 shrink-0 place-items-center rounded-xl text-[22px]" style={{ background: alpha(c, 0.15), color: c }}>
          {icon}
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-[19px] font-semibold" style={{ color: t.ink }}>
            {title}
          </div>
          {body && (
            <div className="text-[16px] leading-snug" style={{ color: t.muted }}>
              {body}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Browser window chrome around a screenshot. For crisp text pass an image cropped to EXACTLY w×h
 * (scripts/crop.py) — never shrink a full 1920px screen into a small frame.
 */
export function BrowserFrame({ src, w, h, url, className, children }: { src?: string; w?: number; h?: number; url?: string; className?: string; children?: ReactNode }) {
  const t = useTheme()
  const [a] = useAccent()
  return (
    <div className={cn('overflow-hidden', className)} style={{ borderRadius: 18, background: t.dark ? '#0c0b12' : '#ffffff', boxShadow: t.brutal ? `0 0 0 3px ${t.ink}, 10px 10px 0 ${t.ink}` : `0 0 0 1px ${t.border}, 0 40px 120px -40px ${alpha(a, t.dark ? 0.9 : 0.4)}` }}>
      <div className="flex h-10 items-center gap-2 px-4" style={{ borderBottom: `1px solid ${t.border}`, background: t.dark ? 'rgba(255,255,255,.03)' : '#f8fafc' }}>
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        {url && (
          <span className="ml-4 rounded-md px-3 py-0.5 text-[13px]" style={{ background: t.dark ? 'rgba(255,255,255,.05)' : '#eef2f7', color: t.muted, fontFamily: 'var(--k-font-mono)' }}>
            {url}
          </span>
        )}
      </div>
      <div className="relative overflow-hidden">
        {src && <img src={src} width={w} height={h} className="block" style={w ? undefined : { width: '100%' }} draggable={false} />}
        {children}
      </div>
    </div>
  )
}

/** Exact-size image (renders 1:1 — sharp). Uses a box-shadow ring instead of a border so pixels aren't squeezed. */
export function Img({ src, w, h, className, ring, radius = 20 }: { src: string; w: number; h: number; className?: string; ring?: string; radius?: number }) {
  return (
    <div className={cn('shrink-0 overflow-hidden', className)} style={{ width: w, height: h, borderRadius: radius, boxShadow: ring ? `0 0 0 2px ${ring}, 0 30px 90px -30px ${ring}` : undefined }}>
      <img src={src} width={w} height={h} className="block size-full object-cover" draggable={false} />
    </div>
  )
}

export function Ring({ value, max = 100, size = 260, stroke = 22, color, delay = 0.4, duration = 1.8, children }: { value: number; max?: number; size?: number; stroke?: number; color?: string; delay?: number; duration?: number; children?: ReactNode }) {
  const t = useTheme()
  const acc = useAccent()
  const c = color ?? acc[0]
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={t.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.07)'} strokeWidth={stroke} fill="none" />
        <motion.circle cx={size / 2} cy={size / 2} r={r} stroke={c} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ * (1 - value / max) }} transition={{ duration, delay, ease }} style={{ filter: t.glow ? `drop-shadow(0 0 12px ${c})` : undefined }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  )
}

export type TermLine = { text: string; kind?: 'cmd' | 'ok' | 'info' | 'warn' | 'dim'; pause?: number }

/** Typing terminal. Lines of kind 'cmd' type out char by char; others print instantly. */
export function Terminal({ lines, title = 'zsh', className, speed = 28, startDelay = 400, onDone }: { lines: TermLine[]; title?: string; className?: string; speed?: number; startDelay?: number; onDone?: () => void }) {
  const [shown, setShown] = useState<string[]>([])
  const [cur, setCur] = useState(0)
  useEffect(() => {
    let cancelled = false
    const timers: number[] = []
    const wait = (ms: number) => new Promise((r) => timers.push(window.setTimeout(r, ms)))
    ;(async () => {
      await wait(startDelay)
      for (let i = 0; i < lines.length; i++) {
        if (cancelled) return
        const l = lines[i]
        setCur(i)
        if (l.kind === 'cmd') {
          for (let k = 1; k <= l.text.length; k++) {
            if (cancelled) return
            setShown((s) => [...s.slice(0, i), l.text.slice(0, k)])
            await wait(speed)
          }
        } else setShown((s) => [...s.slice(0, i), l.text])
        await wait(l.pause ?? 220)
      }
      setCur(lines.length)
      onDone?.()
    })()
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const color = { cmd: '#ffffff', ok: '#34d399', info: '#67e8f9', warn: '#fcd34d', dim: 'rgba(255,255,255,.4)' }
  return (
    <div className={cn('overflow-hidden rounded-2xl border border-white/12 bg-[#08070d]/92 backdrop-blur-xl', className)}>
      <div className="flex h-10 items-center gap-2 border-b border-white/8 px-4">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-auto text-[13px] text-white/30" style={{ fontFamily: 'var(--k-font-mono)' }}>
          {title}
        </span>
      </div>
      <div className="flex flex-col gap-1.5 p-6 text-[21px]" style={{ fontFamily: 'var(--k-font-mono)' }}>
        {shown.map((txt, i) => (
          <div key={i} style={{ color: color[lines[i].kind ?? 'dim'] }}>
            {lines[i].kind === 'cmd' && <span className="mr-3 text-fuchsia-400">❯</span>}
            {txt}
            {i === cur && lines[i].kind === 'cmd' && <span className="ml-0.5 inline-block h-[1em] w-[0.55em] translate-y-[3px] animate-blink bg-white/80" />}
          </div>
        ))}
        {cur >= lines.length && (
          <div className="text-white">
            <span className="mr-3 text-fuchsia-400">❯</span>
            <span className="inline-block h-[1em] w-[0.55em] translate-y-[3px] animate-blink bg-white/80" />
          </div>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────── fun ─────────────────────────── */

export type StickerDef = { e: string; t: string; c?: string; r?: number; pos: CSSProperties }

/** Die-cut sticker: white outline, gradient face, pops in with a spin then wobbles. */
export function Sticker({ e, t: text, c, r = -6, pos, delay = 1 }: StickerDef & { delay?: number }) {
  const t = useTheme()
  const acc = useAccent()
  const color = c ?? acc[0]
  return (
    <motion.div className="absolute z-30" style={pos} initial={{ opacity: 0, scale: 0, rotate: r - 40 }} animate={{ opacity: 1, scale: 1, rotate: r }} transition={{ delay, type: 'spring', stiffness: 260, damping: 13 }}>
      <div
        className="flex items-center gap-2.5 whitespace-nowrap rounded-full px-5 py-2.5 text-[22px] font-bold text-[#0b0910]"
        style={{
          fontFamily: 'var(--k-font-display)',
          border: t.brutal ? `3px solid ${t.ink}` : '5px solid #ffffff',
          background: `linear-gradient(135deg, #ffffff, ${color})`,
          boxShadow: t.brutal ? `5px 5px 0 ${t.ink}` : `0 14px 30px -8px rgba(0,0,0,.5), 0 0 40px -10px ${color}`,
          animation: `sticker-wobble ${3 + (Math.abs(r) % 3)}s ease-in-out ${delay + 0.6}s infinite`,
        }}
      >
        <span className="text-[28px] leading-none">{e}</span>
        {text}
      </div>
    </motion.div>
  )
}

/** Deterministic falling confetti (CSS only — cheap). */
export function Confetti({ colors, count = 34 }: { colors?: string[]; count?: number }) {
  const t = useTheme()
  const cs = colors ?? [t.a1, t.a2, t.a3, t.dark ? '#ffffff' : t.ink]
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {Array.from({ length: count }, (_, i) => {
        const size = 8 + ((i * 7) % 10)
        const dur = 6 + ((i * 13) % 50) / 10
        return (
          <span
            key={i}
            className="absolute top-0"
            style={{ left: `${(i * 37) % 100}%`, width: size, height: size * (i % 3 === 0 ? 2.2 : 1), borderRadius: i % 4 === 0 ? 999 : 2, background: cs[i % cs.length], '--drift': `${((i * 29) % 160) - 80}px`, '--spin': `${360 + ((i * 47) % 540)}deg`, animation: `confetti-fall ${dur}s linear ${(i * 0.37) % dur}s infinite`, opacity: 0.85 } as CSSProperties}
          />
        )
      })}
    </div>
  )
}

/** Giant outlined text scrolling behind a slide ("THANK YOU ✦ NAME ✦"). */
export function Banner({ text, color, opacity = 0.13 }: { text: string; color?: string; opacity?: number }) {
  const acc = useAccent()
  const c = color ?? acc[0]
  const line = `${text} ✦ `.repeat(4)
  return (
    <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden" style={{ opacity }}>
      <div className="flex w-max whitespace-nowrap text-[240px] font-bold leading-none" style={{ animation: 'marquee 40s linear infinite', color: 'transparent', WebkitTextStroke: `2px ${c}`, fontFamily: 'var(--k-font-display)' }}>
        <span>{line}</span>
        <span>{line}</span>
      </div>
    </div>
  )
}
