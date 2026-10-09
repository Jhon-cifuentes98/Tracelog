import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  cacheDir: path.resolve(import.meta.dirname, '../../../node_modules/.vite/hu-14'),
  plugins: [react()],
})
