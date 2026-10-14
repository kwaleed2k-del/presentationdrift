import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState, type ReactNode } from 'react'
import { useAccent, useTheme } from '@/engine/context'
import { alpha } from '@/engine/theme'
import { Card, Grad, Kicker, Reveal, Stage, Title, Toast } from '@/engine/ui'

export type Cell = string | number
export type TableEvent = {
  at: number // seconds after the slide appears
  row: number
  col?: number
  value?: Cell // new value for that cell
  flash?: string // floating "+50" / "−20" label
  status?: { text: string; color: string } // replaces the status pill of the row
  toast?: { icon: string; title: string; body?: string }
}

/**
 * Rebuild an admin/product table as a live animated mock (when there are no screenshots, or to show it working).
 * Data should be masked/illustrative — say so with `note`. Events play on a timeline.
 */
export default function LiveTableSlide({ kicker, title, accent, features = [], columns, rows, status, events, note }: { kicker?: string; title: ReactNode; accent?: ReactNode; features?: [string, string][]; columns: string[]; rows: Cell[][]; status?: { text: string; color: string }; events: TableEvent[]; note?: string }) {
  const t = useTheme()
  const [a, b] = useAccent()
  const [data, setData] = useState(rows)
  const [statuses, setStatuses] = useState(rows.map(() => status))
  const [flashes, setFlashes] = useState<Record<number, string>>({})
  const [toast, setToast] = useState<TableEvent['toast'] | null>(null)
  const [active, setActive] = useState(-1)

  useEffect(() => {
    const ids = events.map((ev) =>
      window.setTimeout(() => {
        setActive(ev.row)
        if (ev.col !== undefined && ev.value !== undefined) setData((d) => d.map((r, i) => (i === ev.row ? r.map((c, k) => (k === ev.col ? ev.value! : c)) : r)))
        if (ev.status) setStatuses((s) => s.map((x, i) => (i === ev.row ? ev.status : x)))
        if (ev.flash) setFlashes((f) => ({ ...f, [ev.row]: ev.flash! }))
        if (ev.toast) setToast(ev.toast)
      }, ev.at * 1000),
    )
    return () => ids.forEach(clearTimeout)
  }, [events])

  const cols = `${columns.map((_, i) => (i === 0 ? '1.6fr' : '1fr')).join(' ')}${status ? ' 0.9fr' : ''}`
  return (
    <Stage className="grid grid-cols-[560px_1fr] items-center gap-12">
      <div className="flex flex-col gap-8">
        {kicker && <Kicker label={kicker} />}
        <Title size={80}>
          {title} {accent && <Grad>{accent}</Grad>}
        </Title>
        <div className="flex flex-col gap-3">
          {features.map(([icon, f], i) => (
            <motion.div key={f} initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.1, type: 'spring', stiffness: 140 }}>
              <Card className="flex items-center gap-4 px-4 py-3" color={i % 2 ? b : a}>
                <span className="grid size-10 shrink-0 place-items-center rounded-xl text-[20px]" style={{ background: alpha(i % 2 ? b : a, 0.15) }}>
                  {icon}
                </span>
                <span className="text-[20px]" style={{ color: t.ink }}>
                  {f}
                </span>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      <Reveal delay={0.3}>
        <Card className="overflow-hidden" color={a}>
          <div className="grid gap-3 px-6 py-3 text-[13px] uppercase tracking-[0.2em]" style={{ gridTemplateColumns: cols, color: t.muted, borderBottom: `1px solid ${t.border}`, fontFamily: 'var(--k-font-mono)' }}>
            {columns.map((c) => (
              <span key={c}>{c}</span>
            ))}
            {status && <span>Status</span>}
          </div>
          {data.map((r, i) => (
            <motion.div key={i} className="relative grid items-center gap-3 px-6 py-4 text-[18px] transition-colors duration-500" style={{ gridTemplateColumns: cols, borderBottom: `1px solid ${t.border}`, background: i === active ? alpha(statuses[i]?.color ?? a, 0.1) : 'transparent', color: t.ink }} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.08 }}>
              {r.map((c, k) => (
                <span key={k} className="relative truncate" style={{ fontFamily: k === 0 ? 'var(--k-font-mono)' : undefined }}>
                  {c}
                  {k === r.length - 1 && (
                    <AnimatePresence>
                      {flashes[i] && (
                        <motion.span key={flashes[i]} className="absolute -top-5 left-14 text-[15px] font-bold" style={{ color: flashes[i].startsWith('+') ? '#22c55e' : '#ef4444', fontFamily: 'var(--k-font-mono)' }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: [0, 1, 1, 0], y: -14 }} transition={{ duration: 1.6 }}>
                          {flashes[i]}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  )}
                </span>
              ))}
              {statuses[i] && (
                <span>
                  <span className="rounded-full px-3 py-1 text-[12px] font-bold tracking-wider transition-colors duration-500" style={{ border: `1px solid ${alpha(statuses[i]!.color, 0.5)}`, color: statuses[i]!.color, background: alpha(statuses[i]!.color, 0.12), fontFamily: 'var(--k-font-mono)' }}>
                    {statuses[i]!.text}
                  </span>
                </span>
              )}
            </motion.div>
          ))}
        </Card>
        {note && (
          <div className="mt-4 text-[13px] uppercase tracking-[0.2em]" style={{ color: t.muted, fontFamily: 'var(--k-font-mono)' }}>
            {note}
          </div>
        )}
      </Reveal>
      <AnimatePresence>{toast && <Toast key={toast.title} className="bottom-14 right-20" icon={toast.icon} title={toast.title} body={toast.body} delay={0} />}</AnimatePresence>
    </Stage>
  )
}
