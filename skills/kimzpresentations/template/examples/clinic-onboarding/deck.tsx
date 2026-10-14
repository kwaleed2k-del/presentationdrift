import { CompareSlide, FinaleSlide, ProcessSlide, SplitSlide, StatementSlide } from '@/archetypes'
import { Card } from '@/engine/ui'
import { defineTheme } from '@/engine/theme'
import { defineDeck } from '@/engine/types'

// Fictional clinic. Shows a CUSTOM theme from a design brief:
// feeling "calm, clinical, trustworthy" → teal/sky/amber, DM Serif Display + Manrope, calm motion, solid cards.
export default defineDeck({
  title: 'Willow Clinic · Patient Onboarding',
  fonts: ['DM Serif Display', 'Manrope'],
  theme: defineTheme('bright-clean', {
    label: 'Clinic Calm',
    a1: '#0f766e', a2: '#0ea5e9', a3: '#f59e0b',
    bg: '#f7faf9', bg2: '#e3f2ef', ink: '#0f2a28', muted: 'rgba(15,42,40,0.62)',
    fontDisplay: '"DM Serif Display", Georgia, serif', fontBody: '"Manrope", system-ui, sans-serif',
    displayWeight: 400, motion: 'calm', cardStyle: 'solid', radius: 14, glow: 0, grid: 0.1,
  }),
  slides: [
    { id: 'open', section: 'Welcome', render: () => <StatementSlide kicker="Willow Clinic" line1="Care that starts" line2="before the first visit." bg="none" punchline="A calmer onboarding for every new patient" /> },
    {
      id: 'why',
      section: 'Why',
      render: () => (
        <SplitSlide
          kicker="The problem"
          title="Forms at the front desk."
          accent="Twenty minutes, every visit."
          bullets={['Patients repeat their history every time.', 'Staff re-type paper forms into the system.', 'Nobody knows what to bring.']}
          visual={{ kind: 'custom', node: <Card className="grid h-[520px] w-[760px] place-items-center text-[160px]">📋</Card> }}
        />
      ),
    },
    { id: 'how', section: 'How', render: () => <ProcessSlide kicker="The new flow" title="Three gentle steps." accent="All before arrival." steps={[{ icon: '✉️', title: 'Invite', sub: 'by SMS' }, { icon: '📝', title: 'Fill once', sub: 'on the phone' }, { icon: '🩺', title: 'Arrive ready', sub: 'doctor has it' }]} /> },
    { id: 'change', section: 'Impact', render: () => <CompareSlide kicker="Before / after (illustrative)" title="Less waiting," accent="more care." columns={{ left: { label: 'Today', items: ['Clipboard at reception', 'History asked again', 'Late starts'] }, right: { label: 'With onboarding', items: ['Done at home', 'History on file', 'On-time visits'] } }} /> },
    { id: 'end', section: 'Fin', render: () => <FinaleSlide kicker="thank you" line1="Calmer visits." line2="Starting next month." signoff="WILLOW CLINIC · DEMO DECK" /> },
  ],
})
