import path from 'node:path'
import { Buffer } from 'node:buffer'
import { type Plugin, type ResolvedConfig, createFilter } from 'vite'
import Fontmin from 'fontmin'
import { createVisualizer } from './createVisualizer'

import type { Options } from './types'

function VitePluginFontiny(options: Options): Plugin {
  const filter = createFilter(options?.include, options?.exclude)
  const usedChars = new Set()

  let _config: ResolvedConfig

  return {
    name: 'vite-plugin-fontiny',
    apply: 'build',
    configResolved(config) {
      _config = config
    },
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

        const compressedFontSource = await new Promise<Uint8Array>((resolve, reject) => {
          new Fontmin()
            .src(fontBuffer)
            .use(Fontmin.glyph({ text, basicText: true }))
            .run((err, [file]) => {
              if (err) {
                console.error(err)
                reject(err)
              }
              // @ts-expect-error file type is error
              resolve(file.contents)
            })
        })

        if (options.visualizer) {
          await createVisualizer(_config, {
            originalFontData: targetFontBundle.source,
            compressedFontData: compressedFontSource,
          })
        }

        targetFontBundle.source = compressedFontSource
      }
    },
  }
}

export default VitePluginFontiny
