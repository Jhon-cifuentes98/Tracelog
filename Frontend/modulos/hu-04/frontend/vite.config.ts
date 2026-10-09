import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const frontendDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  cacheDir: path.resolve(frontendDir, '../../../node_modules/.vite/hu-04'),
  plugins: [
    react(),
    tailwindcss(),
  ],
})