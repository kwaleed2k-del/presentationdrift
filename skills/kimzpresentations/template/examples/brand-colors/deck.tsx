import { BentoSlide, FinaleSlide, OrbitSlide, StatementSlide, TitleSlide } from '@/archetypes'
import { brandTheme } from '@/engine/theme'
import { defineDeck } from '@/engine/types'

// Any brand in two lines: hand brandTheme() the brand's hex colours (from its guidelines) and every archetype follows.
export default defineDeck({
  title: 'Pulse Studio · Brand Deck',
  theme: brandTheme(['#7C3AED', '#F59E0B', '#1E1B4B'], { dark: true, label: 'Pulse Brand' }),
  slides: [
    { id: 'title', section: 'Brand', render: () => <TitleSlide title="PULSE STUDIO" subtitle="Brand colours in, whole deck out" chips={['brandTheme()', 'any hex', 'dark or light']} bg="veil" /> },
    { id: 'statement', section: 'Brand', render: () => <StatementSlide kicker="The idea" line1="Your brand," line2="every slide." punchline="pass 2–3 hex colours, done" bg="iridescence" /> },
    {
      id: 'orbit',
      section: 'Team',
      render: () => (
        <OrbitSlide
          kicker="Who we are"
          center={<span className="text-[60px] font-bold">PULSE</span>}
          inner={['Strategy', 'Design', 'Motion', 'Code']}
          outer={['Brand', 'Web', 'Video', 'Social', 'Print', '3D', 'Sound', 'Launch']}
          heading="We don’t just design."
          lead="We"
          words={['build', 'animate', 'launch', 'grow']}
          after="brands."
        />
      ),
    },
    {
      id: 'services',
      section: 'Work',
      render: () => (
        <BentoSlide
          kicker="Services"
          title="One studio,"
          accent="every surface."
          cards={[
            { tag: 'Identity', title: 'Brand systems', line: 'Logos, colour, type, voice.', span: 2, media: { emoji: '🎨' } },
            { tag: 'Motion', title: 'Films', line: 'Launch videos and loops.', media: { video: '/demo/loop-4.mp4' } },
            { tag: 'Digital', title: 'Web', line: 'Sites that move.', media: { emoji: '🌐' } },
          ]}
          rows={1}
        />
      ),
    },
    { id: 'finale', section: 'Fin', render: () => <FinaleSlide line1="Your colours." line2="Your deck." signoff="PULSE STUDIO · DEMO DECK" car /> },
  ],
})
