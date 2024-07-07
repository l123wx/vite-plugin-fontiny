import path from 'node:path'
import fs from 'fs-extra'
import glyf2svg from 'glyf2svg'
import type { ResolvedConfig } from 'vite'
import type { VisualizerOptions } from './types'
import { DIR_CLIENT } from './dir'
import { VISUALIZER_FONT_JSON_NAME } from './constants'

export async function createVisualizer(config: ResolvedConfig, options: VisualizerOptions) {
  const { fontName, glyf, unitsPerEm, descent, originalSize, compressedSize } = options

  const fontJSON = {
    fontName,
    originalSize,
    compressedSize,
    chars: glyf.map((glyph, index) => ({
      id: index,
      isRemoved: glyph.isRemoved,
      unicode: glyph.unicode ? `\\u${Number(glyph.unicode.toString()).toString(16).padStart(4, '0').toLocaleUpperCase()}` : '',
      svg: `<svg class='glyf' viewbox='0 0 ${unitsPerEm} ${unitsPerEm}'><g transform='scale(1, -1) translate(0, -${unitsPerEm + descent})'><path d='${glyf2svg(glyph)}' /></g></svg>`,
    })),
  }

  const outputDir = path.join(config.root, '.vite-fontiny/')

  await fs.copy(DIR_CLIENT, outputDir)
  await fs.writeFile(path.join(outputDir, VISUALIZER_FONT_JSON_NAME), JSON.stringify(fontJSON), 'utf-8')
}
