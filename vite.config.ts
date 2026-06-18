import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],          // ← Hapus inspectAttr()
  base: '/',                   // ← Vercel pakai root path
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
