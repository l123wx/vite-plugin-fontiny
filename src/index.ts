import path from 'node:path'
import { Buffer } from 'node:buffer'
import { createFilter } from '@rollup/pluginutils'
import Fontmin from 'fontmin'

import type { Plugin } from 'vite'
import type { Options } from './types'

const defaultOptions: Options = {
  include: [
    '**/*.vue',
    '**/*.ts',
    '**/*.js',
    '**/*.tsx',
    '**/*.jsx',
    '**/*.vue?vue&type=script*',
  ],
  exclude: [/[/\\]node_modules[/\\]/, /[/\\]\.git[/\\]/, /[/\\]\.nuxt[/\\]/],
  fontFileNames: [],
}

function VitePluginFontiny(userOptions: Options): Plugin {
  const options = Object.assign(defaultOptions, userOptions)
  const filter = createFilter(options?.include, options?.exclude)
  const usedChars = new Set()

  return {
    name: 'vite-plugin-fontiny',
    transform(code, id) {
      if (!filter(id))
        return

      const chars = code.match(/[\u4E00-\u9FA5]/g)
      if (chars)
        chars.forEach(char => usedChars.add(char))

      return null
    },
    async generateBundle(_, bundle) {
      const text = Array.from(usedChars).join('')

      for (const dir of Object.keys(bundle)) {
        const targetFontBundle = bundle[dir]
        const targetFontFileName = path.basename(targetFontBundle.name!)

        if (targetFontBundle.type !== 'asset' || !options.fontFileNames.includes(targetFontFileName))
          continue

        const fontBuffer = Buffer.from(targetFontBundle.source)

        await new Promise<void>((resolve, reject) => {
          new Fontmin()
            .src(fontBuffer)
            .use(Fontmin.glyph({ text, basicText: true }))
            .run((err, [file]) => {
              if (err) {
                console.error(err)
                reject(err)
              }
              // @ts-expect-error file type is error
              targetFontBundle.source = file.contents
              resolve()
            })
        })
      }
    },
  }
}

export default VitePluginFontiny
