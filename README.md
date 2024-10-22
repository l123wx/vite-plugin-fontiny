# vite-plugin-fontiny

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]

简体中文 | [English](README_EN.md)

**Fontiny = Font + Tiny**

Fontiny 是用于将字体文件中未被使用过的中文字符删除的工具。

目前只支持 ttf 格式的字体文件，未来会支持更多格式。

## 待办

 - [x] 生成一个 HTML 页面，展示哪些中文字符被保留，哪些被删除。
 - [ ] 用户可以自定义匹配字符的规则。
 - [ ] 支持更多类型的字体文件,如 otf、woff、woff2、eot。

## 安装

```shell
npm i -D vite-plugin-fontiny
```

## 使用方法

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

```css
@font-face {
  font-family: "Example Font";
  src: url("./assets/Example-Font-Regular.ttf") format("truetype")
}
```

Fontiny 不关心字体文件具体在什么路径，也不关心是在哪个 css 文件中使用了，只要这个字体在 css 中被使用了，并且在 fontFileNames 列表中，就会对它进行处理。

它会在你的代码中搜索中文字符，并从字体文件中删除未被使用的中文字符，达到减小字体文件的大小的目的。

```
ZCOOLKuaiLe-Regular.ttf [3,188 KB]

↓ ↓ ↓ ↓ ↓ ↓

在代码中搜索中文字符

[ "只", "有", "在", "代", "码", "中", "出", "现", "过", "的", "中", "文", "字", "符", "会", "在", "字", "体", "文", "件", "中", "保", "留", "在", "输", "入", "框", "中", "输", "入", "新", "文", "字", "查", "看", "效", "果" ]

↓ ↓ ↓ ↓ ↓ ↓

从字体文件中删除未使用的字符

↓ ↓ ↓ ↓ ↓ ↓

ZCOOLKuaiLe-Regular-Cx0eLuEs.ttf [24 KB]
```

实际压缩效果受代码中使用的中文字符数量影响

## 插件参数

### `fontFileNames`

想要压缩的字体文件名称

```ts
type FontFileNames = string[]
```

required: `true`

#### `include`

代码扫描的范围

```ts
type Include = ReadonlyArray<string | RegExp> | string | RegExp | null | undefined
```

required: `false` 默认值: `undefined`

### `exclude`

不进行代码扫描的范围

```ts
type Exclude = ReadonlyArray<string | RegExp> | string | RegExp | null | undefined
```

required: `false` 默认值: `undefined`

### `visualizer`

如果设为 `true`，会在生成一个可视化页面展示压缩效果

运行 `vite build` 后，会在 `.vite-fontiny` 目录生成这个可视化页面，可以运行 `npx serve .vite-inspect` 命令来查看页面

```ts
type Visualizer = boolean
```

required: `false` 默认值: `false`

![可视化页面示例图片](./docs/visualizer_example.png)

## 致谢

特别感谢 [fonteditor-core](https://github.com/kekee000/fonteditor-core)、 [fontmin](https://github.com/ecomfe/fontmin) 和 [@antfu](https://github.com/antfu)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/vite-plugin-fontiny?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/vite-plugin-fontiny
[npm-downloads-src]: https://img.shields.io/npm/dm/vite-plugin-fontiny?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/vite-plugin-fontiny
[bundle-src]: https://img.shields.io/bundlephobia/minzip/vite-plugin-fontiny?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=vite-plugin-fontiny
