import { BentoSlide, CompareSlide, FinaleSlide, ProcessSlide, RingCarouselSlide, StatementSlide, StatsSlide, TitleSlide } from '@/archetypes'
import { defineDeck } from '@/engine/types'

// Fictional company. All numbers are illustrative demo data.
export default defineDeck({
  title: 'Orbit Labs · Seed',
  theme: 'aurora-glass',
  slides: [
    { id: 'title', section: 'Intro', render: () => <TitleSlide title="ORBIT LABS" subtitle="Your calendar, on autopilot." kicker="seed round · demo deck" chips={['AI scheduling', 'Focus time', 'Teams of 10–500']} bg="aurora" /> },
    {
      id: 'problem',
      section: 'Problem',
      render: () => (
        <StatementSlide
          kicker="The problem"
          line1="Meetings eat the week"
          line2="and nobody chose that."
          cards={[
            { icon: '📅', text: 'Calendars fill up with meetings nobody needed.' },
            { icon: '🧠', text: 'Deep work happens in leftover minutes.' },
            { icon: '🔁', text: 'Rescheduling is a full-time job.' },
          ]}
          punchline="So we built a calendar that defends your time →"
          bg="galaxy"
        />
      ),
    },
    {
      id: 'how',
      section: 'Product',
      render: () => (
        <ProcessSlide
          kicker="How it works"
          title="Connect once."
          accent="Orbit does the rest."
          steps={[
            { icon: '🔗', title: 'Connect', sub: 'Google · Outlook' },
            { icon: '🧭', title: 'Learn', sub: 'your rhythms' },
            { icon: '🛡️', title: 'Protect', sub: 'focus blocks' },
            { icon: '🤝', title: 'Negotiate', sub: 'with other calendars' },
            { icon: '📈', title: 'Report', sub: 'hours won back' },
          ]}
          bullets={['Works with the calendars teams already use.', 'Every change is explained and can be undone in one click.']}
          toast={{ icon: '✓', title: 'Focus block protected', body: 'Moved 2 meetings to Thursday' }}
        />
      ),
    },
    {
      id: 'screens',
      section: 'Product',
      steps: 3,
      render: () => (
        <RingCarouselSlide
          kicker="The product"
          title="One dashboard,"
          accent="zero busywork."
          items={[
            { name: 'Overview', what: 'the week at a glance', line: 'Hours saved, focus time and what’s next.', src: '/demo/dashboard.svg' },
            { name: 'Mobile', what: 'on the go', line: 'Approve suggestions with one tap.', src: '/demo/app-screen.svg' },
            { name: 'Reports', what: 'for managers', line: 'See where the team’s time actually goes.', src: '/demo/dashboard.svg' },
          ]}
        />
      ),
    },
    {
      id: 'traction',
      section: 'Traction',
      render: () => <StatsSlide kicker="Traction (demo data)" title="Growing" accent="every week." stats={[{ value: 1284, label: 'meetings saved' }, { value: 312, suffix: 'h', label: 'hours back for teams' }, { value: 97, suffix: '%', label: 'on-time rate', ring: 97 }, { value: 42, label: 'pilot teams' }]} />,
    },
    {
      id: 'why',
      section: 'Market',
      render: () => (
        <CompareSlide
          kicker="Why we win"
          title="Old calendars react."
          accent="Orbit plans."
          columns={{ left: { label: 'Today', items: ['Manual rescheduling', 'Meetings by default', 'No idea where time goes'] }, right: { label: 'With Orbit', items: ['Auto-negotiated slots', 'Focus by default', 'Weekly time report'] } }}
        />
      ),
    },
    {
      id: 'team',
      section: 'Team',
      render: () => (
        <BentoSlide
          kicker="The ask"
          title="Raising"
          accent="the seed round."
          cards={[
            { tag: 'Use of funds', title: 'Product', line: 'Two engineers, one designer.', span: 2, media: { emoji: '🛠️' } },
            { tag: 'Go to market', title: 'Sales', line: 'Pilot → paid in 90 days.', media: { emoji: '📣' } },
            { tag: 'Runway', title: '18 months', line: 'To a clear Series A story.', media: { emoji: '🛫' } },
          ]}
          rows={1}
          cols={4}
        />
      ),
    },
    { id: 'finale', section: 'Fin', render: () => <FinaleSlide line1="Give teams their week back." line2="Let’s talk." signoff="ORBIT LABS · DEMO DECK" bg="aurora" /> },
  ],
})
