import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages serves a project site from /<repo>/, so the asset base has to
// match. VITE_BASE is set by the deploy workflow; locally it stays at "/".
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/',
})
