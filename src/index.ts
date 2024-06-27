import path from 'node:path'
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

function VitePluginFontiny(options: Options = {}): Plugin {
  const options = Object.assign(defaultOptions, userOptions)
  const filter = createFilter(options?.include, options?.exclude)
  const usedChars = new Set()

  return {
    name: 'unplugin-fontmin',
    transformInclude(id) {
      return filter(id)
    },
    transform(code) {
      const chars = code.match(/[\u4E00-\u9FA5]/g)
      if (chars)
        chars.forEach(char => usedChars.add(char))

      return null
    },
    vite: {
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
              .use(Fontmin.glyph({ text, basicText: true,
              }))
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
    },
  }
}

export default VitePluginFontiny


bundle[fileName] = {
  name: fileName,
  type: 'asset',
  fileName: join(config.build.assetsDir, fileName),
  source,
  needsCodeReference: true,
}