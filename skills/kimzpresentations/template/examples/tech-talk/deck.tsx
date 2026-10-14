import { FinaleSlide, JourneySlide, OrbitSlide, ProcessSlide, ScreenshotSlide, TerminalSlide, TitleSlide, VideoWallSlide } from '@/archetypes'
import { defineDeck } from '@/engine/types'

// A conference-style tech talk. Fictional speaker and product.
export default defineDeck({
  title: 'Shipping With Agents',
  theme: 'neon-dark',
  slides: [
    {
      id: 'boot',
      section: 'Boot',
      render: () => (
        <TitleSlide
          title="SHIPPING WITH AGENTS"
          subtitle="How a two-person team ships like ten"
          chips={['Agents', 'Worktrees', 'CI', 'Evals']}
          terminal={[
            { text: 'agent --plan "ship the feature"', kind: 'cmd', pause: 350 },
            { text: '✓ brainstorm ........ done', kind: 'ok', pause: 120 },
            { text: '✓ plan .............. 7 tasks', kind: 'ok', pause: 120 },
            { text: '✓ tests ............. 42 passing', kind: 'ok', pause: 120 },
            { text: '✓ review ............ approved', kind: 'ok', pause: 300 },
          ]}
        />
      ),
    },
    {
      id: 'stack',
      section: 'Stack',
      render: () => (
        <OrbitSlide
          kicker="The stack"
          center={<span className="text-[110px]">🤖</span>}
          inner={['Planner', 'Coder', 'Reviewer', 'Tester']}
          outer={['GitHub', 'CI', 'Docker', 'Preview envs', 'Slack', 'Evals', 'Docs', 'Sentry']}
          heading="Agents don’t replace engineers."
          lead="They"
          words={['plan', 'test', 'review', 'ship']}
          after="with us."
          bullets={['Every agent has one job and a clear definition of done.', 'Humans approve plans and merges, agents do the legwork.']}
        />
      ),
    },
    {
      id: 'loop',
      section: 'Workflow',
      render: () => (
        <TerminalSlide
          kicker="The loop"
          title="Plan first."
          accent="Code second."
          bullets={['Brainstorm → plan → test-first → review, every time.', 'Parallel worktrees: several features in flight at once.', 'If the plan is wrong, nothing downstream is right.']}
          lines={[
            { text: 'git worktree add ../feat-billing', kind: 'cmd' },
            { text: 'Preparing worktree (new branch feat-billing)', kind: 'dim' },
            { text: 'agent run plan.md --parallel 3', kind: 'cmd' },
            { text: '→ task 1/7 schema .............. ✓', kind: 'info' },
            { text: '→ task 2/7 api ................. ✓', kind: 'info' },
            { text: '→ task 3/7 ui .................. ✓', kind: 'info' },
            { text: 'npm test', kind: 'cmd' },
            { text: '42 passing (3.1s)', kind: 'ok' },
          ]}
        />
      ),
    },
    {
      id: 'pipeline',
      section: 'Workflow',
      render: () => (
        <ProcessSlide
          kicker="Dev → prod"
          title="Small PRs. Green CI."
          accent="Preview everything."
          steps={[
            { icon: '⎇', title: 'Branch', sub: 'one feature' },
            { icon: '⇄', title: 'PR', sub: 'small diff' },
            { icon: '✓', title: 'CI', sub: 'tests + build' },
            { icon: '👀', title: 'Preview', sub: 'per PR' },
            { icon: '🚀', title: 'Ship', sub: 'one click' },
          ]}
          toast={{ icon: '✓', title: 'CI passed', body: 'tests · build · preview deployed' }}
        />
      ),
    },
    {
      id: 'ui',
      section: 'Demo',
      render: () => (
        <ScreenshotSlide
          kicker="Crisp screenshots"
          title="Show the real UI,"
          accent="at real size."
          pieces={[{ src: '/demo/dashboard.svg', w: 1120, h: 532, highlights: [{ x: 828, y: 450, w: 240, h: 40, label: 'one-click action' }, { x: 664, y: 104, w: 200, h: 104, label: 'the metric that matters', side: 'bottom' }] }]}
          features={[
            ['🔍', 'Crop to what matters'],
            ['📐', 'Show it 1:1, never shrunk'],
            ['🎯', 'Point at it with a highlight'],
          ]}
        />
      ),
    },
    {
      id: 'films',
      section: 'Demo',
      render: () => (
        <VideoWallSlide
          kicker="Product films"
          title="Every feature gets a film."
          accent="Coded, not edited."
          note="4 clips · playing together"
          videos={[
            { src: '/demo/loop-1.mp4', label: 'Onboarding', sub: 'demo clip' },
            { src: '/demo/loop-2.mp4', label: 'Dashboard', sub: 'demo clip' },
            { src: '/demo/loop-3.mp4', label: 'Reports', sub: 'demo clip' },
            { src: '/demo/loop-4.mp4', label: 'Mobile', sub: 'demo clip' },
          ]}
        />
      ),
    },
    {
      id: 'journey',
      section: 'Story',
      render: () => (
        <JourneySlide
          kicker="The journey"
          title="From chat"
          accent="to production."
          stops={[
            { icon: '💬', t: 'Chatbot', s: 'copy-paste' },
            { icon: '🧠', t: 'Pair agent', s: 'in the editor' },
            { icon: '🗂️', t: 'Plans', s: 'written first' },
            { icon: '🧪', t: 'Evals', s: 'measured' },
            { icon: '🚀', t: 'Production', s: 'shipped weekly' },
          ]}
          quote={
            <>
              The tools changed. <span style={{ color: 'var(--k-a1)' }}>The discipline made it work.</span>
            </>
          }
          signoff="Thank you."
        />
      ),
    },
    { id: 'finale', section: 'Fin', render: () => <FinaleSlide line1="Plan. Test. Ship." line2="Repeat." signoff="SHIPPING WITH AGENTS · DEMO TALK" car /> },
  ],
})
