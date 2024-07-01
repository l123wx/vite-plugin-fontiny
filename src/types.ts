import type { TTF } from 'fonteditor-core'

import type { FilterPattern } from '@rollup/pluginutils'

export interface Options {
  /**
   * Which fonts you want to be compressed.
   */
  fontFileNames: string[]
  /**
   * Included range of scanned codes.
   *
   * @default `undefined`
   */
  include?: FilterPattern
  /**
   * Excluded range of scanned codes.
   *
   * @default `undefined`
   */
  exclude?: FilterPattern
  /**
   * If true, a visual HTML will be generated in the project root directory.
   *
   * @default `false`
   */
  visualizer?: boolean
}

export interface VisualizerOptions {
  fontName: string
  glyf: (TTF.Glyph & { isRemoved: boolean })[]
  unitsPerEm: number
  descent: number
  originalSize: number
  compressedSize: number
}
