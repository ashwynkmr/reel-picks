/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Production is served from https://ashwynkmr.github.io/reel-picks/ (GitHub Pages),
  // so built asset URLs need the repo name as a prefix. Dev stays at "/".
  base: command === 'build' ? '/reel-picks/' : '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
}))
