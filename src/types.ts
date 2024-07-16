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

export interface VisualizerData {
  originalFontData: string | Uint8Array
  compressedFontData: string | Uint8Array
}

export interface VisualizerFontJSON {
  fontName: string
  originalSize: number
  compressedSize: number
  chars: {
    unicode: string
    svg: string
    id: number
    isRemoved: boolean
  }[]
}

export interface FontJSONInfo {
  name: string
  path: string
}
