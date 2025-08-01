import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/docs/',
  root: './docs',
  publicDir: '../public',
  
  build: {
    outDir: './docs-dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'docs/index.html')
      }
    }
  },
  
  server: {
    port: 5174,
    open: true
  },
  
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': resolve(process.cwd(), 'docs/src')
    }
  }
})
