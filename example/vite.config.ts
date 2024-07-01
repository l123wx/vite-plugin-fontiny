import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import VitePluginFontiny from '../src/index'

export default defineConfig({
  base: './',
  plugins: [
    Inspect(),
    VitePluginFontiny({
      fontFileNames: ['ZCOOLKuaiLe-Regular.ttf'],
      visualizer: true,
    }),
  ],
})
