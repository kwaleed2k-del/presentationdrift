import { FinaleSlide, PeopleSlide, QuoteSlide, StatementSlide, TitleSlide, WallOfWorkSlide, type Tile } from '@/archetypes'
import { defineDeck } from '@/engine/types'

// Fictional maison. Night-luxe: black, gold, italic serif.
const tile = (t: string, sub: string, from: string, to: string, w = 340): Tile => ({ w, label: { t, sub, from, to } })

export default defineDeck({
  title: 'Maison Aurelle · AW Collection',
  theme: 'night-luxe',
  slides: [
    { id: 'title', section: 'Maison', render: () => <TitleSlide title="Maison Aurelle" subtitle="Autumn / Winter collection" kicker="paris · demo deck" bg="particles" size={160} /> },
    { id: 'statement', section: 'Vision', render: () => <StatementSlide kicker="The vision" line1="Quiet luxury," line2="loudly crafted." punchline="Every piece made to be kept, not replaced" bg="rays" /> },
    {
      id: 'wall',
      section: 'Collection',
      render: () => (
        <WallOfWorkSlide
          kicker="The collection"
          line1="Forty pieces."
          line2="One story."
          chips={['Cashmere', 'Silk', 'Leather', 'Gold hardware']}
          rows={[
            [tile('Cashmere', 'look 01', '#3b2f1c', '#b08d57'), tile('Silk', 'look 02', '#1a1712', '#e7c873', 520), tile('Noir', 'look 03', '#0b0b0b', '#3a3226'), tile('Or', 'look 04', '#6b5426', '#f5e6c4')],
            [tile('Atelier', 'hand-finished', '#2a2117', '#9c7a43', 520), tile('Leather', 'look 05', '#3a2412', '#b08d57'), tile('Velvet', 'look 06', '#1f1410', '#7a5a3a'), tile('Ivory', 'look 07', '#cbbf9f', '#f5efe0')],
            [tile('Gold', 'hardware', '#5a4520', '#e7c873'), tile('Wool', 'look 08', '#2b261d', '#8a7a5c', 520), tile('Night', 'look 09', '#050505', '#2a2418'), tile('Amber', 'look 10', '#6b3f12', '#e0a85a')],
            [tile('Linen', 'look 11', '#8a7d64', '#e9dfc8'), tile('Onyx', 'look 12', '#0a0a0a', '#3b3b3b'), tile('Bronze', 'look 13', '#4a3218', '#b07a3a', 520), tile('Pearl', 'look 14', '#bdb3a0', '#faf6ec')],
          ]}
        />
      ),
    },
    { id: 'quote', section: 'Craft', render: () => <QuoteSlide quote="A garment should outlive the season it was made for." author="Example quote" role="replace with a real one" /> },
    {
      id: 'atelier',
      section: 'Atelier',
      render: () => (
        <PeopleSlide
          kicker="The atelier"
          person={{ name: 'The Makers', tag: 'thank you', lines: ['Twelve artisans, one workshop.', 'Every seam finished by hand.', 'Swap these placeholders for real portraits.'] }}
          photos={[{ name: 'Artisan' }, { name: 'Tailor' }]}
          stickers={[
            { e: '🪡', t: 'hand-finished', r: -8, pos: { top: -26, left: -40 } },
            { e: '✨', t: 'made to keep', r: 7, pos: { bottom: -22, right: 20 } },
          ]}
          banner="MERCI ✦ THE ATELIER"
        />
      ),
    },
    { id: 'finale', section: 'Fin', render: () => <FinaleSlide kicker="merci" line1="Made to be kept." line2="Maison Aurelle." signoff="AW COLLECTION · DEMO DECK" bg="particles" /> },
  ],
})
