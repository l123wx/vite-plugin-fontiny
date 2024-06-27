# vite-plugin-fontiny

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]

**Fontiny = Font + Tiny**

A tool for removing unused Chinese characters from font files.

## Roadmap

 - [ ] Generate an html page showing which Chinese characters have been retained and which have been eliminated.
 - [ ] User-defined match characters rules.
 - [ ] Supports more types of font files, like otf, woff, woff2, eot.

## Installation

```shell
npm i -D vite-plugin-fontiny
```

## Usage

```ts
// vite.config.ts
import Fontiny from 'vite-plugin-fontiny'

export default {
  plugins: [
    Fontiny({
      // options
      fontFileNames: ['Example-Font-Regular.ttf']
    }),
  ],
}
```

It will search for Chinese characters in your code, and remove the unused characters from the font file to reduce the size of the font file.

```
ZCOOLKuaiLe-Regular.ttf [3,188 KB]

↓ ↓ ↓ ↓ ↓ ↓

Search for Chinese characters in code:

[ "只", "有", "在", "代", "码", "中", "出", "现", "过", "的", "中", "文", "字", "符", "会", "在", "字", "体", "文", "件", "中", "保", "留", "在", "输", "入", "框", "中", "输", "入", "新", "文", "字", "查", "看", "效", "果" ]

↓ ↓ ↓ ↓ ↓ ↓

Remove unused characters from the font file.

↓ ↓ ↓ ↓ ↓ ↓

ZCOOLKuaiLe-Regular-Cx0eLuEs.ttf [24 KB]
```

The actual compression effect is affected by the number of Chinese characters used in the code.

## Options

#### `include`

Included range of scanned codes.

```ts
type Include = ReadonlyArray<string | RegExp> | string | RegExp | null
```

default:
```js
[
  '**/*.vue',
  '**/*.ts',
  '**/*.js',
  '**/*.tsx',
  '**/*.jsx',
  '**/*.vue?vue&type=script*'
]
```

### `exclude`

Excluded range of scanned codes.

```ts
type Exclude = ReadonlyArray<string | RegExp> | string | RegExp | null
```

default:
```js
[
  /[/\\]node_modules[/\\]/,
  /[/\\]\.git[/\\]/,
  /[/\\]\.nuxt[/\\]/
]
```

### `fontFileNames`

Which fonts you want to be compressed.

```ts
type FontFileNames = string[]
```

default: `[]`

## Credits

Thanks to [fontmin](https://github.com/ecomfe/fontmin) and [@antfu](https://github.com/antfu)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/vite-plugin-fontiny?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/vite-plugin-fontiny
[npm-downloads-src]: https://img.shields.io/npm/dm/vite-plugin-fontiny?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/vite-plugin-fontiny
[bundle-src]: https://img.shields.io/bundlephobia/minzip/vite-plugin-fontiny?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=vite-plugin-fontiny
