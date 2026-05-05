import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Workspace package: ensure resolution from apps/portal (pnpm + exports map)
      '@tuaka/utils': path.resolve(__dirname, '../../packages/utils/src/index.ts'),
    },
  },
})
