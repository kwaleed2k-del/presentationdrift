import Aurora from '@/components/Aurora'
import Beams from '@/components/Beams'
import DarkVeil from '@/components/DarkVeil'
import DotGrid from '@/components/DotGrid'
import Galaxy from '@/components/Galaxy'
import Hyperspeed from '@/components/Hyperspeed'
import Iridescence from '@/components/Iridescence'
import LightRays from '@/components/LightRays'
import Particles from '@/components/Particles'
import Plasma from '@/components/Plasma'
import Silk from '@/components/Silk'
import Threads from '@/components/Threads'
import { useAccent, useTheme } from './context'
import { mix } from './theme'

export type BackdropKind = 'none' | 'hyperspeed' | 'aurora' | 'rays' | 'galaxy' | 'veil' | 'threads' | 'particles' | 'silk' | 'iridescence' | 'beams' | 'plasma' | 'dots'

/**
 * Animated WebGL/canvas backgrounds from React Bits, tinted from the theme.
 * Rule of thumb: ONE backdrop per slide (each is a WebGL context), and only one slide is mounted at a time.
 */
export default function Backdrop({ kind, opacity }: { kind: BackdropKind; opacity?: number }) {
  const t = useTheme()
  const [a, b] = useAccent()
  if (kind === 'none') return null
  const loud = kind === 'iridescence' || kind === 'plasma' || kind === 'silk'
  const op = opacity ?? (loud ? (t.dark ? 0.5 : 0.35) : t.dark ? 0.9 : 0.55)
  const el = (() => {
    switch (kind) {
      case 'hyperspeed':
        return <Hyperspeed tailColors={[b, t.a3, b]} headColors={[a, '#ffffff', a]} poleColors={[a]} speed={1.2} />
      case 'aurora':
        return <Aurora colorStops={[a, b, t.a3]} amplitude={1.1} blend={0.6} speed={0.8} />
      case 'rays':
        return <LightRays raysOrigin="top-center" raysColor={mix(a, '#ffffff', 0.5)} raysSpeed={1.1} lightSpread={0.9} rayLength={1.6} followMouse={false} noiseAmount={0.06} distortion={0.03} />
      case 'galaxy':
        return <Galaxy saturation={0.7} glowIntensity={0.45} density={1.2} twinkleIntensity={0.5} rotationSpeed={0.05} mouseInteraction={false} starColors={[a, b, '#ffffff']} />
      case 'veil':
        return <DarkVeil color={b} speed={0.6} />
      case 'threads':
        return <Threads color={a} accentColor={b} amplitude={1.3} distance={0.2} lineCount={36} enableMouseInteraction={false} />
      case 'particles':
        return <Particles particleColors={[a, b, '#ffffff']} particleCount={260} particleSpread={10} speed={0.08} particleBaseSize={90} alphaParticles moveParticlesOnHover={false} />
      case 'silk':
        return <Silk color={mix(b, t.bg, 0.4)} speed={4} />
      case 'iridescence':
        return <Iridescence color={a} speed={0.6} />
      case 'beams':
        return <Beams color={a} speed={1.5} backgroundColor={t.bg} />
      case 'plasma':
        return <Plasma color={b} speed={0.6} />
      case 'dots':
        return <DotGrid baseColor={mix(a, t.bg, 0.7)} activeColor={a} />
    }
  })()
  return (
    <div className="pointer-events-none absolute inset-0" style={{ opacity: op }}>
      {el}
    </div>
  )
}
