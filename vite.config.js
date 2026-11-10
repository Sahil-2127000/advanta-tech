import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // three.js (lazy-loaded with the 3D scene) is ~900 kB on its own; everything else stays well under 500 kB.
  build: { chunkSizeWarningLimit: 1000 },
})
