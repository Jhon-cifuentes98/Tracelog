import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const frontendDir = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  cacheDir: path.resolve(frontendDir, '../../../node_modules/.vite/hu-03'),
  plugins: [react(),tailwindcss(),],
})
