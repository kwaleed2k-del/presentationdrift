/**
 * Layout audit — the "no overlapping text, nothing outside its box" guarantee.
 *   press L                → audit the slide on screen (red outlines + a badge; L again clears)
 *   ?audit=all             → walk every slide and step, then print a report into <pre id="audit-report">
 *   npm run check          → the same walk in headless Chrome, exits non-zero on failures
 *
 * Checks: text overlapping other text, text outside the 1920×1080 stage, text outside a [data-box]
 * card, text clipped by an overflow:hidden ancestor, and type smaller than MIN_TYPE.
 *
 * It groups text by its nearest block-level ancestor on purpose: SplitText, DecryptedText and
 * CircularText render one span per character, and at tight tracking those spans legitimately
 * overlap. Comparing blocks instead of elements keeps that from crying wolf.
 * Anything decorative that breaks the rules by design (marquees, LogoLoop, duplicated ticker rows)
 * should carry data-audit-skip.
 */
export type Issue = { kind: 'overlap' | 'off-stage' | 'outside-box' | 'clipped' | 'tiny-type' | 'small-type'; text: string; rect: DOMRect }

/** 'small-type' is advice, everything else is a defect — `npm run check` only fails on defects */
export const WARN_ONLY: Issue['kind'][] = ['small-type']

const TOL = 2
/** below this nothing survives a projector; 14–18px is legible but worth a second look (micro-labels live there) */
const MIN_TYPE = 14
const SOFT_TYPE = 18
// NOT aria-hidden: React Bits' DecryptedText/SplitText mark the *visible* animated characters
// aria-hidden and keep a .sr-only copy for screen readers. Skipping aria-hidden made the audit
// blind to every headline built out of per-character spans.
const SKIP = '[data-audit-skip],.sr-only'

const stageEl = () => document.querySelector('[data-kimz-stage]') ?? document.querySelector('[data-hud-stage]')

function visible(el: Element): boolean {
  let o = 1
  for (let n: Element | null = el; n; n = n.parentElement) {
    const cs = getComputedStyle(n)
    if (cs.display === 'none' || cs.visibility === 'hidden') return false
    o *= Number(cs.opacity)
  }
  return o > 0.05
}

/** the nearest ancestor that is not an inline box — character spans and <em> fold into their paragraph */
function blockOf(el: Element): Element {
  for (let n: Element | null = el; n; n = n.parentElement) {
    if (!getComputedStyle(n).display.startsWith('inline')) return n
  }
  return el
}

/** text line boxes, trimmed to ~0.8em around the centre: font ascent/descent padding is not ink */
function textRects(el: Element, scale: number): DOMRect[] {
  const out: DOMRect[] = []
  const fs = parseFloat(getComputedStyle(el).fontSize) || 16
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType !== Node.TEXT_NODE || !node.textContent?.trim()) continue
    const range = document.createRange()
    range.selectNodeContents(node)
    for (const rect of Array.from(range.getClientRects())) {
      if (rect.width <= 1 || rect.height <= 1) continue
      const h = Math.min(rect.height, fs * 0.8 * scale)
      out.push(new DOMRect(rect.left, rect.top + (rect.height - h) / 2, rect.width, h))
    }
  }
  return out
}

const hits = (a: DOMRect, b: DOMRect) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > TOL && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > TOL
const outside = (r: DOMRect, box: DOMRect) => r.left < box.left - TOL || r.right > box.right + TOL || r.top < box.top - TOL || r.bottom > box.bottom + TOL
/** how much of r sits outside box, 0..1 — a hair over the edge is rounding, a quarter out is a bug */
function outFraction(r: DOMRect, box: DOMRect): number {
  const w = Math.max(0, Math.min(r.right, box.right) - Math.max(r.left, box.left))
  const h = Math.max(0, Math.min(r.bottom, box.bottom) - Math.max(r.top, box.top))
  const area = r.width * r.height
  return area <= 0 ? 0 : 1 - (w * h) / area
}

export function auditSlide(): Issue[] {
  const stage = stageEl()
  if (!stage) return []
  const stageRect = stage.getBoundingClientRect()
  const scale = stageRect.width / 1920 || 1
  const issues: Issue[] = []
  const groups = new Map<Element, { rects: DOMRect[]; text: string }>()

  for (const el of Array.from(stage.querySelectorAll('*'))) {
    if (el.closest(SKIP)) continue
    const rects = textRects(el, scale)
    if (!rects.length || !visible(el)) continue
    const text = (el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 60)

    const fs = parseFloat(getComputedStyle(el).fontSize) || 16
    if (fs < SOFT_TYPE) issues.push({ kind: fs < MIN_TYPE ? 'tiny-type' : 'small-type', text: `${Math.round(fs)}px · ${text}`, rect: rects[0] })

    for (const r of rects) {
      if (outside(r, stageRect)) issues.push({ kind: 'off-stage', text, rect: r })
      const box = el.closest('[data-box]')
      if (box && box !== el && outside(r, box.getBoundingClientRect())) issues.push({ kind: 'outside-box', text, rect: r })
      for (let p = el.parentElement; p && p !== stage; p = p.parentElement) {
        const ov = getComputedStyle(p).overflow
        if ((ov.includes('hidden') || ov.includes('clip')) && outFraction(r, p.getBoundingClientRect()) > 0.25) {
          issues.push({ kind: 'clipped', text, rect: r })
          break
        }
      }
    }

    const key = blockOf(el)
    const g = groups.get(key)
    if (g) {
      g.rects.push(...rects)
      if (g.text.length < 60) g.text = `${g.text} ${text}`.trim().slice(0, 60)
    } else groups.set(key, { rects: [...rects], text })
  }

  const list = [...groups.entries()]
  for (let a = 0; a < list.length; a++)
    for (let b = a + 1; b < list.length; b++) {
      const [elA, A] = list[a]
      const [elB, B] = list[b]
      if (elA.contains(elB) || elB.contains(elA)) continue
      const hit = A.rects.find((ra) => B.rects.some((rb) => hits(ra, rb)))
      if (hit) issues.push({ kind: 'overlap', text: `${A.text}  ×  ${B.text}`, rect: hit })
    }
  return issues
}

// ── on-screen overlay (press L) ───────────────────────────────────────────────
let layer: HTMLDivElement | null = null
const clear = () => {
  layer?.remove()
  layer = null
}
function draw(issues: Issue[]) {
  clear()
  layer = document.createElement('div')
  Object.assign(layer.style, { position: 'fixed', inset: '0', pointerEvents: 'none', zIndex: '99999' })
  for (const i of issues.filter((x) => !WARN_ONLY.includes(x.kind))) {
    const b = document.createElement('div')
    Object.assign(b.style, { position: 'fixed', left: `${i.rect.left}px`, top: `${i.rect.top}px`, width: `${i.rect.width}px`, height: `${i.rect.height}px`, outline: '2px solid #ff2d55', background: 'rgba(255,45,85,.15)' })
    layer.appendChild(b)
  }
  const badge = document.createElement('div')
  const defects = issues.filter((i) => !WARN_ONLY.includes(i.kind))
  badge.textContent = defects.length ? `LAYOUT ✗ ${defects.length}: ${[...new Set(defects.map((i) => i.kind))].join(', ')}` : `LAYOUT ✓ no overlap, nothing outside its box${issues.length ? ` · ${issues.length} small-type note(s)` : ''}`
  Object.assign(badge.style, { position: 'fixed', left: '16px', top: '16px', padding: '8px 14px', font: '700 14px system-ui', color: '#fff', background: defects.length ? '#d7263d' : '#13a869', borderRadius: '8px' })
  layer.appendChild(badge)
  document.body.appendChild(layer)
  if (issues.length) console.table(issues.map((i) => ({ kind: i.kind, text: i.text })))
}

const wait = (ms: number) => new Promise((r) => window.setTimeout(r, ms))

type Kimz = { slides: { id: string; steps: number }[] }
const kimz = () => (window as unknown as { __kimz?: Kimz }).__kimz

/** walk every slide and step; `settle` is how long each state gets to animate in */
async function auditAll(settle = 3500) {
  await wait(settle)
  const k = kimz()
  if (!k) return { failed: 1, lines: ['no deck found (window.__kimz missing)'] }
  const lines: string[] = []
  let failed = 0
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }))
  for (let s = 0; s < k.slides.length; s++) {
    for (let st = 0; st < (k.slides[s].steps || 1); st++) {
      await wait(st === 0 ? settle : Math.max(900, settle / 3))
      const issues = auditSlide()
      failed += issues.filter((i) => !WARN_ONLY.includes(i.kind)).length
      lines.push(`${String(s + 1).padStart(2, '0')}.${st} ${k.slides[s].id}: ${issues.length ? issues.map((i) => `${i.kind} [${i.text}]`).join(' | ') : 'ok'}`)
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    }
  }
  return { failed, lines }
}

if (typeof window !== 'undefined') {
  ;(window as unknown as { __kimzAudit: unknown }).__kimzAudit = { slide: auditSlide, all: auditAll }

  window.addEventListener('keydown', (e) => {
    if (e.key !== 'l' || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
    if (layer) clear()
    else draw(auditSlide())
  })

  if (new URLSearchParams(window.location.search).get('audit') === 'all') {
    void auditAll().then(({ failed, lines }) => {
      const pre = document.createElement('pre')
      pre.id = 'audit-report'
      pre.textContent = `AUDIT ${failed ? `FAILED: ${failed} issue(s)` : 'PASSED'}\n${lines.join('\n')}`
      Object.assign(pre.style, { position: 'fixed', inset: '20px', overflow: 'auto', zIndex: '100000', background: '#0b0f14', color: '#d7ffe9', font: '13px/1.5 monospace', padding: '16px', border: '2px solid #3dff9a', whiteSpace: 'pre-wrap' })
      document.body.appendChild(pre)
      console.log(pre.textContent)
    })
  }
}
