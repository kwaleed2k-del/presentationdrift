import fs from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/**
 * Which deck to run:
 *   npm run dev                         → ./deck (your deck)
 *   DECK=examples/tech-talk npm run dev   → any folder that has deck.tsx (+ optional public/)
 *   npm run gallery                     → every example, switchable with ?deck=<name>&theme=<mode>
 */
export default defineConfig(({ mode }) => {
  const deckDir = path.resolve(__dirname, process.env.DECK ?? './deck')
  const gallery = mode === 'gallery'
  const examplesDir = path.resolve(__dirname, './examples')
  // Your deck's own assets live in <deck>/public; the gallery and examples share template/public.
  const publicDir = !gallery && fs.existsSync(path.join(deckDir, 'public')) ? path.join(deckDir, 'public') : 'public'
  return {
    plugins: [react(), tailwindcss()],
    publicDir,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@deck': gallery ? path.resolve(__dirname, './src/engine/Gallery.tsx') : path.join(deckDir, 'deck.tsx'),
        '@examples': examplesDir,
      },
    },
  }
})
