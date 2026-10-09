import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const frontendDir = path.dirname(fileURLToPath(import.meta.url));
export default defineConfig({
    cacheDir: path.resolve(frontendDir, '../../../node_modules/.vite/hu-01'),
    plugins: [react()],
});
