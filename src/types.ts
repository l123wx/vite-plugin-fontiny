import type { FilterPattern } from '@rollup/pluginutils'

export interface Options {
  /**
   * SVG minification, only work for build
   *
   * @default true
   */
  include?: FilterPattern
  exclude?: FilterPattern
  fontFileNames: string[]
}
