import { THEMES, THEME_IDS } from './theme'
import { defineDeck, type DeckDef } from './types'

/**
 * `npm run gallery` — every example in ./examples, switchable by URL:
 *   /?deck=startup-pitch            open an example
 *   /?deck=startup-pitch&theme=night-luxe#3   force a theme, jump to slide 3
 *   /                               the gallery index
 */
const modules = import.meta.glob<{ default: DeckDef }>('../../examples/*/deck.tsx', { eager: true })
const decks = Object.fromEntries(Object.entries(modules).map(([p, m]) => [p.split('/').at(-2)!, m.default]))

const pick = new URLSearchParams(window.location.search).get('deck')

const index = defineDeck({
  title: 'KimzPresentations · Gallery',
  theme: 'neon-dark',
  slides: [
    {
      id: 'gallery',
      render: () => (
        <div className="h-full w-full overflow-hidden p-20" style={{ background: 'radial-gradient(ellipse at 70% 0%, #1a1030, #06050b 65%)', color: '#f4f2ff' }}>
          <div className="mb-3 text-[18px] uppercase tracking-[0.4em] text-cyan-300" style={{ fontFamily: 'var(--k-font-mono)' }}>
            kimzpresentations · gallery
          </div>
          <h1 className="mb-12 text-[84px] font-bold leading-none tracking-[-0.03em]" style={{ fontFamily: 'var(--k-font-display)' }}>
            Pick a deck. <span className="bg-gradient-to-r from-cyan-300 to-fuchsia-400 bg-clip-text text-transparent">Press T to re-skin it.</span>
          </h1>
          <div className="grid grid-cols-3 gap-6">
            {Object.entries(decks).map(([name, d]) => {
              const th = typeof d.theme === 'string' ? THEMES[d.theme] : d.theme
              return (
                <a key={name} href={`?deck=${name}#1`} className="flex h-[230px] flex-col justify-between rounded-3xl p-7 transition-transform hover:scale-[1.03]" style={{ background: `linear-gradient(135deg, ${th.bg2}, ${th.bg})`, border: `1px solid ${th.border}`, color: th.ink }}>
                  <div className="flex gap-2">
                    {[th.a1, th.a2, th.a3].map((c) => (
                      <span key={c} className="size-6 rounded-full" style={{ background: c }} />
                    ))}
                  </div>
                  <div>
                    <div className="text-[36px] font-bold" style={{ fontFamily: th.fontDisplay }}>
                      {d.title}
                    </div>
                    <div className="text-[15px] uppercase tracking-[0.2em] opacity-60" style={{ fontFamily: 'var(--k-font-mono)' }}>
                      {name} · {th.label} · {d.slides.length} slides
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
          <div className="mt-10 text-[16px] uppercase tracking-[0.2em] opacity-50" style={{ fontFamily: 'var(--k-font-mono)' }}>
            themes: {THEME_IDS.join(' · ')}
          </div>
        </div>
      ),
    },
  ],
})

export default (pick && decks[pick]) || index
