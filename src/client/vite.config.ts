import { join, resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  server: {
    port: 10000,
  },
  plugins: [
    vue(),
    ElementPlus({}),
  ],
  resolve: {
    alias: {
      '@/': join(__dirname, 'src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: resolve(__dirname, '../../dist/client'),
    minify: false, // 'esbuild',
    emptyOutDir: true,
  },
})
