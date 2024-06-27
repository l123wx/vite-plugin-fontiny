import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import VitePluginFontiny from '../src/index'

export default defineConfig({
  base: './',
  plugins: [
    Inspect(),
    VitePluginFontiny({
      include: ['./index.html'],
      fontFileNames: ['ZCOOLKuaiLe-Regular.ttf'],
    }),
  ],
})
