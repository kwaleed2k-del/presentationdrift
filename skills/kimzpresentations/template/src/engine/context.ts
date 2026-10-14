import { createContext, useContext } from 'react'
import { THEMES, type Theme } from './theme'
import type { Accent } from './types'

type DeckState = { index: number; step: number; total: number; theme: Theme; accent: Accent; rtl: boolean }

export const DeckCtx = createContext<DeckState>({ index: 0, step: 0, total: 1, theme: THEMES['neon-dark'], accent: ['#22d3ee', '#a855f7'], rtl: false })

export const useDeck = () => useContext(DeckCtx)
export const useTheme = () => useContext(DeckCtx).theme
/** Current build step on slides that declare `steps`. */
export const useStep = () => useContext(DeckCtx).step
/** The slide's two accent colours (slide.accent, else theme a1/a2). */
export const useAccent = () => useContext(DeckCtx).accent
export const useSlideNumber = () => String(useContext(DeckCtx).index + 1).padStart(2, '0')
