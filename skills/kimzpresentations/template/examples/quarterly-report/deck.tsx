import { AgendaSlide, ChartSlide, CompareSlide, FinaleSlide, SplitSlide, StatsSlide, TitleSlide } from '@/archetypes'
import { Card } from '@/engine/ui'
import { defineDeck } from '@/engine/types'

// Fictional company quarterly review. Bright, clean, board-room safe.
export default defineDeck({
  title: 'Northwind · Q3 Review',
  theme: 'bright-clean',
  slides: [
    { id: 'title', section: 'Q3', render: () => <TitleSlide title="Q3 REVIEW" subtitle="Northwind Logistics · quarterly business review" chips={['Revenue', 'Delivery', 'Next quarter']} bg="none" /> },
    { id: 'agenda', section: 'Q3', steps: 4, render: () => <AgendaSlide title="Four things" accent="in 20 minutes." items={[{ title: 'Headline numbers', sub: 'what moved' }, { title: 'Delivery performance', sub: 'by month' }, { title: 'What changed', sub: 'old vs new process' }, { title: 'Q4 plan', sub: 'priorities + asks' }]} /> },
    { id: 'numbers', section: 'Numbers', render: () => <StatsSlide kicker="Headline numbers (demo data)" title="A record" accent="quarter." stats={[{ value: 4.8, decimals: 1, prefix: '$', suffix: 'M', label: 'revenue' }, { value: 18, suffix: '%', label: 'growth vs Q2' }, { value: 96, suffix: '%', label: 'on-time delivery', ring: 96 }, { value: 31, label: 'new enterprise accounts' }]} /> },
    { id: 'chart', section: 'Numbers', render: () => <ChartSlide kicker="On-time delivery (demo data)" title="Every month" accent="better." unit="%" bars={[{ label: 'Jan', value: 81 }, { label: 'Feb', value: 83 }, { label: 'Mar', value: 85 }, { label: 'Apr', value: 88 }, { label: 'May', value: 90 }, { label: 'Jun', value: 93 }, { label: 'Jul', value: 94 }, { label: 'Aug', value: 95 }, { label: 'Sep', value: 96, highlight: true }]} bullets={['Route planning moved to the new optimizer in April.', 'September hit 96% for the first time.']} /> },
    { id: 'change', section: 'Process', render: () => <CompareSlide kicker="What changed" title="From spreadsheets" accent="to a system." columns={{ left: { label: 'Q2', items: ['Routes planned by hand', 'Delays found after the fact', 'Weekly status emails'] }, right: { label: 'Q3', items: ['Optimized routes nightly', 'Delays flagged in real time', 'Live dashboard for every client'] } }} /> },
    {
      id: 'q4',
      section: 'Q4',
      render: () => (
        <SplitSlide
          kicker="Q4 plan"
          title="Three priorities."
          accent="One ask."
          bullets={['Expand real-time tracking to all regions.', 'Cut first-mile delays by half.', 'Ask: approve two more route analysts.']}
          visual={{
            kind: 'custom',
            node: (
              <div className="grid grid-cols-2 gap-6">
                {['📍 Tracking', '⏱️ First mile', '🧑‍💼 Analysts', '📊 Dashboards'].map((x) => (
                  <Card key={x} className="grid h-[200px] w-[340px] place-items-center text-[34px] font-bold">
                    {x}
                  </Card>
                ))}
              </div>
            ),
          }}
        />
      ),
    },
    { id: 'finale', section: 'Fin', render: () => <FinaleSlide kicker="thank you" line1="Record quarter." line2="Questions welcome." signoff="NORTHWIND · DEMO DECK" /> },
  ],
})
