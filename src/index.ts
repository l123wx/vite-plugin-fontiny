import path from 'node:path'
import { Buffer } from 'node:buffer'
import { type Plugin, createFilter } from 'vite'
import { Font } from 'fonteditor-core'
import Fontmin from 'fontmin'
import { createVisualizer } from './createVisualizer'

import type { Options } from './types'

function VitePluginFontiny(options: Options): Plugin {
  const filter = createFilter(options?.include, options?.exclude)
  const usedChars = new Set()

  return {
    name: 'vite-plugin-fontiny',
    apply: 'build',
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
        const originalTTFObject = Font.create(fontBuffer, { type: 'ttf' }).get()
        const originalSize = targetFontBundle.source.length

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

        if (options.visualizer) {
          const compressedTTFObject = Font.create(targetFontBundle.source, { type: 'ttf' }).get()
          const savedFontNameMap = compressedTTFObject.glyf.reduce<Map<string, true>>((map, item) => {
            map.set(item.name, true)
            return map
          }, new Map())

          await createVisualizer({
            fontName: originalTTFObject.name.fontFamily,
            glyf: originalTTFObject.glyf.map(item => ({ ...item, isRemoved: !savedFontNameMap.has(item.name) })),
            unitsPerEm: originalTTFObject.head.unitsPerEm,
            descent: originalTTFObject.hhea.descent,
            originalSize,
            compressedSize: targetFontBundle.source.length,
          })
        }
      }
    },
  }
}

export default VitePluginFontiny
