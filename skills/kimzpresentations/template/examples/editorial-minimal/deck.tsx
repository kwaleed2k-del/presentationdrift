import { AgendaSlide, FinaleSlide, QuoteSlide, SplitSlide, StatementSlide, TitleSlide } from '@/archetypes'
import { Card } from '@/engine/ui'
import { defineDeck } from '@/engine/types'

// Editorial / essay talk. Minimal-mono: paper, ink, italic serif, one red accent.
export default defineDeck({
  title: 'The Quiet Year',
  theme: 'minimal-mono',
  slides: [
    { id: 'title', section: 'Essay', render: () => <TitleSlide title="The Quiet Year" subtitle="Notes on building less, better" kicker="a talk in five parts" bg="none" size={170} /> },
    { id: 'parts', section: 'Essay', steps: 5, render: () => <AgendaSlide kicker="Contents" title="Five" accent="small ideas." items={[{ title: 'Say no early' }, { title: 'Ship the boring part' }, { title: 'Write it down' }, { title: 'Measure one thing' }, { title: 'Rest on purpose' }]} /> },
    { id: 'no', section: 'I', render: () => <StatementSlide kicker="Part one" line1="Every yes" line2="is a no to something else." bg="none" /> },
    {
      id: 'write',
      section: 'III',
      render: () => (
        <SplitSlide
          kicker="Part three"
          title="Write it down."
          accent="Then decide."
          bullets={['A decision you can’t write in one paragraph isn’t ready.', 'Writing turns opinions into something others can improve.', 'Keep the doc shorter than the meeting it replaces.']}
          visual={{
            kind: 'custom',
            node: (
              <Card className="w-[760px] p-12">
                <div className="mb-6 text-[15px] uppercase tracking-[0.3em] opacity-60" style={{ fontFamily: 'var(--k-font-mono)' }}>
                  decision · draft 3
                </div>
                <div className="text-[44px] italic leading-tight" style={{ fontFamily: 'var(--k-font-display)' }}>
                  We will ship the export feature before the redesign, because customers asked for it four times.
                </div>
              </Card>
            ),
          }}
        />
      ),
    },
    { id: 'quote', section: 'V', render: () => <QuoteSlide quote="Rest is not the reward for the work. It is part of the work." author="Example quote" role="replace with a real one" /> },
    { id: 'finale', section: 'Fin', render: () => <FinaleSlide kicker="fin" line1="Build less." line2="Build better." signoff="THE QUIET YEAR · DEMO TALK" /> },
  ],
})
