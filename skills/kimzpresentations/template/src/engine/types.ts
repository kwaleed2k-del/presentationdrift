import type { ReactNode } from 'react'
import type { Theme, ThemeId } from './theme'

export type Accent = readonly [string, string]

export type SlideDef = {
  /** unique, kebab-case; used in the URL hash fallback and React keys */
  id: string
  /** shown in the footer: "Deck title // Section" */
  section?: string
  /** build steps: → / ← walk steps 0..steps-1 before changing slide. Read with useStep(). */
  steps?: number
  /** override the progress-bar / footer accent for this slide */
  accent?: Accent
  /** speaker notes, toggled with N */
  notes?: string
  render: () => ReactNode
}

export type DeckDef = {
  title: string
  /** a mode id or a full Theme (e.g. brandTheme(['#D52CDE', '#FA8F46'])) */
  theme: ThemeId | Theme
  /** right-to-left deck (Arabic, Hebrew, Urdu…). Switches the body font and text direction. */
  rtl?: boolean
  /** footer text, defaults to title */
  footer?: string
  slides: SlideDef[]
}

export const defineDeck = (d: DeckDef) => d
