import type { ReactNode } from 'react'
import { Bullets, Grad, Kicker, Reveal, Stage, Terminal, Title, type TermLine } from '@/engine/ui'

/** Dev-story slide: a typing terminal (commands type out, results print) beside the headline + bullets. */
export default function TerminalSlide({ kicker, title, accent, lines, bullets = [] }: { kicker?: string; title: ReactNode; accent?: ReactNode; lines: TermLine[]; bullets?: ReactNode[] }) {
  return (
    <Stage className="grid grid-cols-[680px_1fr] items-center gap-14">
      <div className="flex flex-col gap-9">
        {kicker && <Kicker label={kicker} />}
        <Title>
          {title}
          {accent && (
            <>
              <br />
              <Grad>{accent}</Grad>
            </>
          )}
        </Title>
        {bullets.length > 0 && <Bullets items={bullets} size={27} delay={0.7} />}
      </div>
      <Reveal delay={0.4} x={60} y={0}>
        <Terminal lines={lines} className="w-full" />
      </Reveal>
    </Stage>
  )
}
