/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  // Production is served from https://ashwynkmr.github.io/reel-picks/ (GitHub Pages),
  // so built assets need the repo name as a prefix. `vite preview` serves that same
  // build, so it needs the prefix too; only the dev server runs at "/".
  base: command === 'build' || isPreview ? '/reel-picks/' : '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
}))
