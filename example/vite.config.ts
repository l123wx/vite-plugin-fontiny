import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
// import Fontiny from '../src/index'
import Fontiny from '../'

export default defineConfig({
  base: './',
  plugins: [
    Inspect(),
    Fontiny({
      fontFileNames: ['ZCOOLKuaiLe-Regular.ttf'],
      visualizer: true,
    }),
  ],
})
