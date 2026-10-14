import { AgendaSlide, BentoSlide, FinaleSlide, ProcessSlide, SplitSlide, StatsSlide, TitleSlide } from '@/archetypes'
import { defineDeck } from '@/engine/types'

/**
 * Your deck. Placeholder content — the real design comes from the design brief (references/design-direction.md):
 *   use defineTheme(base, { palette, fonts, motion, cardStyle… }) + fonts: [...] instead of a stock mode.
 *   - theme: 'neon-dark' | 'bright-clean' | 'colorful-pop' | 'minimal-mono' | 'night-luxe' | 'aurora-glass' | 'sunset-heat'
 *            or brandTheme(['#hex1', '#hex2'], { dark: true })
 *   - slides: { id, section?, steps?, accent?, notes?, render }
 * Press T while presenting to cycle themes, O for overview, N for notes.
 */
export default defineDeck({
  title: 'Your Deck',
  theme: 'neon-dark',
  slides: [
    {
      id: 'title',
      section: 'Intro',
      render: () => (
        <TitleSlide
          title="YOUR TITLE"
          subtitle="One line that says why this matters"
          chips={['Point one', 'Point two', 'Point three']}
          bg="none"
        />
      ),
    },
    {
      id: 'agenda',
      section: 'Intro',
      steps: 3,
      render: () => <AgendaSlide title="Today we" accent="cover three things." items={[{ title: 'The problem', sub: 'why now' }, { title: 'What we built', sub: 'how it works' }, { title: 'What’s next', sub: 'the ask' }]} />,
    },
    {
      id: 'what',
      section: 'Product',
      render: () => (
        <SplitSlide
          kicker="What it is"
          title="One sharp headline."
          accent="A second line that pops."
          bullets={['Each bullet is one sentence.', 'Lead with the outcome, not the feature.', 'Three or four bullets, never more.']}
          visual={{ kind: 'custom', node: <div className="grid size-[700px] place-items-center rounded-[40px] text-[200px]" style={{ background: 'linear-gradient(135deg, var(--k-a1), var(--k-a2))' }}>✦</div> }}
          toasts={[{ icon: '✓', title: 'Pop-ups make it feel alive', body: 'use them for proof points' }]}
        />
      ),
    },
    {
      id: 'how',
      section: 'Product',
      render: () => <ProcessSlide kicker="How it works" title="Four steps." accent="Zero friction." steps={[{ icon: '📥', title: 'Add', sub: 'your input' }, { icon: '🧠', title: 'Analyse', sub: 'AI reads it' }, { icon: '💡', title: 'Choose', sub: 'pick a concept' }, { icon: '🚀', title: 'Ship', sub: 'done' }]} />,
    },
    {
      id: 'features',
      section: 'Product',
      render: () => (
        <BentoSlide
          kicker="Features"
          title="Everything in"
          accent="one place."
          cards={[
            { tag: 'Core', title: 'Feature one', line: 'What it does, in one line.', span: 2, media: { emoji: '⚡' } },
            { tag: 'Fast', title: 'Feature two', line: 'Why it matters.', media: { emoji: '🎯' } },
            { tag: 'Safe', title: 'Feature three', line: 'Proof, not promises.', media: { emoji: '🔒' } },
            { tag: 'Smart', title: 'Feature four', line: 'Short and concrete.', media: { emoji: '🧠' } },
            { tag: 'Loved', title: 'Feature five', line: 'Keep it human.', span: 2, media: { emoji: '💜' } },
            { tag: 'Next', title: 'Feature six', line: 'Tease what’s coming.', media: { emoji: '🔭' } },
          ]}
        />
      ),
    },
    {
      id: 'numbers',
      section: 'Proof',
      render: () => <StatsSlide kicker="Numbers" title="Real numbers" accent="only." stats={[{ value: 12, suffix: 'k', label: 'example metric' }, { value: 98, suffix: '%', label: 'example rate', ring: 98 }, { value: 3, suffix: '×', label: 'example speed-up' }]} />,
    },
    { id: 'finale', section: 'Fin', render: () => <FinaleSlide line1="Your closing line." line2="Your sign-off." signoff="YOUR NAME · YOUR COMPANY" /> },
  ],
})
