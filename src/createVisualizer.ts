import fsp from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import glyf2svg from 'glyf2svg'
import type { VisualizerOptions } from './types'

export async function createVisualizer(options: VisualizerOptions) {
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

  await fsp.writeFile(path.join(process.cwd(), 'client/font.json'), JSON.stringify(fontJSON), 'utf-8')
  await fsp.cp(path.join(process.cwd(), 'client/'), path.join(process.cwd(), '/'))
}
