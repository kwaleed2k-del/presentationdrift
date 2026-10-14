import { BentoSlide, CompareSlide, FinaleSlide, LiveTableSlide, SplitSlide, StatementSlide, TitleSlide } from '@/archetypes'
import { defineDeck } from '@/engine/types'

// Fictional coffee brand launching an app. Neo-brutalist "colorful-pop" mode.
export default defineDeck({
  title: 'Nomad Coffee · App Launch',
  theme: 'colorful-pop',
  slides: [
    { id: 'title', section: 'Launch', render: () => <TitleSlide title="NOMAD APP" subtitle="Skip the line. Keep the vibe." kicker="launch day" chips={['Order ahead', 'Rewards', 'Pickup in 3 min']} bg="none" /> },
    { id: 'why', section: 'Why', render: () => <StatementSlide kicker="Why an app" line1="Nobody likes the queue." line2="Everybody likes the coffee." bg="none" cards={[{ icon: '⏳', text: 'Morning rush lines out the door.' }, { icon: '📱', text: 'Regulars already order by text.' }, { icon: '🎁', text: 'Loyalty lives on paper cards.' }]} /> },
    {
      id: 'app',
      section: 'Product',
      render: () => (
        <SplitSlide
          kicker="Meet the app"
          title="Order in three taps."
          accent="Pick up in three minutes."
          leftWidth={560}
          bullets={['Your usual, one tap away.', 'Live “it’s ready” notifications.', 'Rewards that fill up automatically.']}
          visual={{ kind: 'screenshot', src: '/demo/app-screen.svg', w: 1120, h: 532, url: 'nomad.coffee' }}
          toasts={[{ icon: '☕', title: 'Your oat latte is ready', body: 'Counter 2 · say hi to Sam', at: '-bottom-10 right-10' }]}
        />
      ),
    },
    {
      id: 'features',
      section: 'Product',
      render: () => (
        <BentoSlide
          kicker="What’s inside"
          title="Small app."
          accent="Big habits."
          cards={[
            { tag: 'Fast', title: 'Order ahead', line: 'Your usual in one tap.', span: 2, media: { emoji: '⚡' } },
            { tag: 'Sweet', title: 'Rewards', line: 'Every 8th cup on us.', media: { emoji: '🎁' } },
            { tag: 'Local', title: 'Map', line: 'Nearest Nomad, open now.', media: { emoji: '📍' } },
            { tag: 'Fresh', title: 'Drops', line: 'Seasonal menu first.', media: { emoji: '🍂' } },
            { tag: 'Social', title: 'Gift a cup', line: 'Send coffee to a friend.', span: 2, media: { emoji: '💌' } },
            { tag: 'Smart', title: 'Usuals', line: 'It learns your order.', media: { emoji: '🧠' } },
          ]}
        />
      ),
    },
    {
      id: 'orders',
      section: 'Ops',
      render: () => (
        <LiveTableSlide
          kicker="Behind the counter"
          title="Every order,"
          accent="live."
          features={[
            ['📋', 'Orders stream in as they’re placed'],
            ['⏱️', 'Prep timers per drink'],
            ['🔔', 'Customers pinged when ready'],
          ]}
          columns={['Order', 'Drink', 'Min']}
          rows={[
            ['#1042', 'Cold brew', 2],
            ['#1043', 'Oat latte', 3],
            ['#1044', 'Date cake', 1],
            ['#1045', 'Flat white', 3],
            ['#1046', 'Matcha', 4],
          ]}
          status={{ text: 'BREWING', color: '#6d28ff' }}
          events={[
            { at: 1.6, row: 0, status: { text: 'READY', color: '#00a88f' }, toast: { icon: '🔔', title: '#1042 is ready', body: 'Customer notified' } },
            { at: 3, row: 2, status: { text: 'READY', color: '#00a88f' } },
            { at: 4.4, row: 1, col: 2, value: 1, flash: '−2 min' },
          ]}
          note="illustrative demo data"
        />
      ),
    },
    { id: 'before-after', section: 'Impact', render: () => <CompareSlide kicker="Before / after" title="The morning," accent="fixed." columns={{ left: { label: 'Before', items: ['12-minute queue', 'Paper loyalty cards', 'Orders by text message'] }, right: { label: 'With the app', items: ['3-minute pickup', 'Rewards fill themselves', 'One tap, every morning'] } }} /> },
    { id: 'finale', section: 'Fin', render: () => <FinaleSlide kicker="available today" line1="Skip the line." line2="Download Nomad." signoff="NOMAD COFFEE · DEMO DECK" /> },
  ],
})
