/**
 * Theme modes. Every archetype reads ONLY these tokens (via useTheme() or the --k-* CSS variables),
 * so one `theme:` line in deck.tsx re-skins the whole deck.
 */
export type Theme = {
  id: string
  label: string
  dark: boolean
  bg: string // page background
  bg2: string // second stop for the background gradient
  surface: string // cards, panels
  border: string
  ink: string // primary text
  muted: string // secondary text
  a1: string // accent 1 (primary)
  a2: string // accent 2
  a3: string // accent 3 (spice)
  glow: number // 0..1 how strong the blurred colour glows are
  grid: number // 0..1 background grid strength
  fontDisplay: string
  fontBody: string
  fontMono: string
  displayWeight: number
  displayItalic?: boolean // serif/italic display (luxe, editorial)
  radius: number // card radius px
  brutal?: boolean // hard borders + offset shadows (colorful-pop)
}

const SANS = '"Inter Variable", system-ui, sans-serif'
const GROTESK = '"Space Grotesk", "Inter Variable", system-ui, sans-serif'
const SERIF = '"Fraunces Variable", Georgia, serif'
const MONO = '"JetBrains Mono", ui-monospace, monospace'

export const THEMES = {
  'neon-dark': {
    id: 'neon-dark', label: 'Neon Dark', dark: true,
    bg: '#06050b', bg2: '#0d0a1a', surface: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.10)',
    ink: '#f4f2ff', muted: 'rgba(244,242,255,0.62)', a1: '#22d3ee', a2: '#a855f7', a3: '#ec4899',
    glow: 0.28, grid: 0.4, fontDisplay: GROTESK, fontBody: SANS, fontMono: MONO, displayWeight: 700, radius: 28,
  },
  'bright-clean': {
    id: 'bright-clean', label: 'Bright Clean', dark: false,
    bg: '#fbfaf8', bg2: '#eef2ff', surface: '#ffffff', border: 'rgba(15,23,42,0.10)',
    ink: '#0f172a', muted: 'rgba(15,23,42,0.62)', a1: '#2563eb', a2: '#7c3aed', a3: '#f97316',
    glow: 0.12, grid: 0.25, fontDisplay: GROTESK, fontBody: SANS, fontMono: MONO, displayWeight: 700, radius: 24,
  },
  'colorful-pop': {
    id: 'colorful-pop', label: 'Colorful Pop', dark: false,
    bg: '#fff4d6', bg2: '#ffe4f1', surface: '#ffffff', border: '#141018',
    ink: '#141018', muted: 'rgba(20,16,24,0.7)', a1: '#ff3d7f', a2: '#6d28ff', a3: '#00c2a8',
    glow: 0.0, grid: 0.0, fontDisplay: GROTESK, fontBody: SANS, fontMono: MONO, displayWeight: 800, radius: 22, brutal: true,
  },
  'minimal-mono': {
    id: 'minimal-mono', label: 'Minimal Mono', dark: false,
    bg: '#f4f2ed', bg2: '#ebe8e0', surface: '#fbfaf7', border: 'rgba(17,17,17,0.14)',
    ink: '#111111', muted: 'rgba(17,17,17,0.58)', a1: '#111111', a2: '#e11d48', a3: '#6b7280',
    glow: 0.0, grid: 0.18, fontDisplay: SERIF, fontBody: SANS, fontMono: MONO, displayWeight: 500, displayItalic: true, radius: 6,
  },
  'night-luxe': {
    id: 'night-luxe', label: 'Night Luxe', dark: true,
    bg: '#050505', bg2: '#120f08', surface: 'rgba(255,248,230,0.04)', border: 'rgba(231,200,115,0.20)',
    ink: '#f5efe0', muted: 'rgba(245,239,224,0.6)', a1: '#e7c873', a2: '#f5e6c4', a3: '#b08d57',
    glow: 0.16, grid: 0.0, fontDisplay: SERIF, fontBody: SANS, fontMono: MONO, displayWeight: 500, displayItalic: true, radius: 20,
  },
  'aurora-glass': {
    id: 'aurora-glass', label: 'Aurora Glass', dark: true,
    bg: '#030712', bg2: '#0b1530', surface: 'rgba(255,255,255,0.07)', border: 'rgba(255,255,255,0.16)',
    ink: '#f8fafc', muted: 'rgba(248,250,252,0.65)', a1: '#34d399', a2: '#60a5fa', a3: '#f472b6',
    glow: 0.32, grid: 0.15, fontDisplay: GROTESK, fontBody: SANS, fontMono: MONO, displayWeight: 700, radius: 32,
  },
  'sunset-heat': {
    id: 'sunset-heat', label: 'Sunset Heat', dark: true,
    bg: '#120507', bg2: '#2a0a12', surface: 'rgba(255,255,255,0.05)', border: 'rgba(255,180,120,0.18)',
    ink: '#fff5ef', muted: 'rgba(255,245,239,0.62)', a1: '#fb923c', a2: '#f43f5e', a3: '#facc15',
    glow: 0.3, grid: 0.25, fontDisplay: GROTESK, fontBody: SANS, fontMono: MONO, displayWeight: 800, radius: 26,
  },
} satisfies Record<string, Theme>

export type ThemeId = keyof typeof THEMES
export const THEME_IDS = Object.keys(THEMES) as ThemeId[]

/** Build a theme from a brand's 2–3 hex colours. `dark` picks the base. */
export function brandTheme(colors: string[], opts: { dark?: boolean; label?: string; base?: ThemeId } = {}): Theme {
  const dark = opts.dark ?? true
  const base = THEMES[opts.base ?? (dark ? 'neon-dark' : 'bright-clean')]
  const [a1, a2 = a1, a3 = a2] = colors
  return {
    ...base,
    id: 'brand',
    label: opts.label ?? 'Brand',
    a1,
    a2,
    a3,
    bg: dark ? mix(a2, '#050507', 0.9) : '#fbfaf8',
    bg2: dark ? mix(a1, '#050507', 0.82) : mix(a1, '#ffffff', 0.9),
  }
}

/** Linear mix of two #rrggbb colours: t=0 → a, t=1 → b. */
export function mix(a: string, b: string, t: number) {
  const pa = hex(a)
  const pb = hex(b)
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t))
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`
}
function hex(h: string) {
  const s = h.replace('#', '')
  const n = s.length === 3 ? s.split('').map((x) => x + x).join('') : s.slice(0, 6)
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16))
}
/** #rrggbb + alpha (0..1) → rgba() — works for any accent regardless of format. */
export function alpha(color: string, a: number) {
  if (!color.startsWith('#')) return color
  const [r, g, b] = hex(color)
  return `rgba(${r},${g},${b},${a})`
}

export function themeVars(t: Theme): Record<string, string> {
  return {
    '--k-bg': t.bg,
    '--k-bg2': t.bg2,
    '--k-surface': t.surface,
    '--k-border': t.border,
    '--k-ink': t.ink,
    '--k-muted': t.muted,
    '--k-a1': t.a1,
    '--k-a2': t.a2,
    '--k-a3': t.a3,
    '--k-font-display': t.fontDisplay,
    '--k-font-body': t.fontBody,
    '--k-font-mono': t.fontMono,
    '--k-radius': `${t.radius}px`,
    '--k-grid-line': t.dark ? `rgba(255,255,255,${(0.12 * t.grid).toFixed(3)})` : `rgba(0,0,0,${(0.12 * t.grid).toFixed(3)})`,
  }
}
