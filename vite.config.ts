import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Project pages are served from https://<user>.github.io/<repo>/, so the
// production build needs that subpath as base. Dev keeps the root path.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/logo-farblabor/' : '/',
  plugins: [react()],
}))
