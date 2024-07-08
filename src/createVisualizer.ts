import path from 'node:path'
import fs from 'fs-extra'
import glyf2svg from 'glyf2svg'
import type { ResolvedConfig } from 'vite'
import { Font } from 'fonteditor-core'
import type { VisualizerData } from './types'
import { DIR_CLIENT } from './dir'
import { VISUALIZER_FONT_JSON_NAME } from './constants'

function numberToUniCodeString(num: number) {
  return num ? `\\u${Number(num.toString()).toString(16).padStart(4, '0').toLocaleUpperCase()}` : ''
}

export async function createVisualizer(ctx: ResolvedConfig, data: VisualizerData) {
  const { originalFontData, compressedFontData } = data

  const originalSize = originalFontData.length
  const compressedSize = compressedFontData.length

  const originalFontObject = Font.create(originalFontData, { type: 'ttf' }).get()
  const compressedFontObject = Font.create(compressedFontData, { type: 'ttf' }).get()
  const unitsPerEm = originalFontObject.head.unitsPerEm
  const sTypoDescender = originalFontObject['OS/2'].sTypoDescender

  const savedFontNameMap = compressedFontObject.glyf.reduce<Map<string, true>>((map, item) => {
    map.set(item.name, true)
    return map
  }, new Map())

  const fontJSON = {
    fontName: originalFontObject.name.fontFamily,
    originalSize,
    compressedSize,
    chars: originalFontObject.glyf.map((glyph, index) => {
      return {
        ...glyph,
        contours: undefined,
        id: index,
        isRemoved: !savedFontNameMap.has(glyph.name),
        unicode: glyph.unicode?.map(numberToUniCodeString).join(',') || '',
        svg: `<svg class='glyf' viewbox='0 0 ${unitsPerEm} ${unitsPerEm}'><g style="transform-origin: center; transform: scale(1, -1) translate(${(unitsPerEm - glyph.xMax - glyph.xMin) / 2}px, ${-sTypoDescender}px)"><path d='${glyf2svg(glyph)}' /></g></svg>`,
      }
    }),
  }

  const outputDir = path.join(ctx.root, '.vite-fontiny/')

  await fs.copy(DIR_CLIENT, outputDir)
  await fs.writeFile(path.join(outputDir, VISUALIZER_FONT_JSON_NAME), JSON.stringify(fontJSON), 'utf-8')
}
