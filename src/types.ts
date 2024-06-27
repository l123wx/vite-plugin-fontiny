import type { FilterPattern } from '@rollup/pluginutils'

export interface Options {
  /**
   * Included range of scanned codes
   *
   * @default
   * ```js
   * [
   *    '** /*.vue',
   *    '** /*.ts',
   *    '** /*.js',
   *    '** /*.tsx',
   *    '** /*.jsx',
   *    '** /*.vue?vue&type=script*'
   * ]
   * ```
   */
  include?: FilterPattern
  /**
   * Excluded range of scanned codes
   *
   * @default
   * ```js
   * [
   *    /[/\\]node_modules[/\\]/,
   *    /[/\\]\.git[/\\]/,
   *    /[/\\]\.nuxt[/\\]/
   * ]
   * ```
   */
  exclude?: FilterPattern
  /**
   * Which fonts you want to be compressed
   */
  fontFileNames: string[]
}
