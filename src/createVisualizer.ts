import fsp from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
// @ts-expect-error types deletion
import glyf2svg from 'fonteditor-core/lib/ttf/util/glyf2svg'
import { minify } from 'html-minifier'
import type { VisualizerOptions } from './types'

function bytes2kb(bytes: number) {
  return `${(bytes / 1000).toFixed(2)}KB`
}

export async function createVisualizer(options: VisualizerOptions) {
  const { fontName, glyf, unitsPerEm, descent, originalSize, compressedSize } = options

  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <style>
        .font-name {
          text-align: center;
          font-size: 50px;
          margin-bottom: 0;
        }
        .size {
          text-align: center;
          margin-bottom: 40px;
        }
        ul {
          display: grid;
          padding: 0;
          margin: 0;
          grid-template-columns: repeat(auto-fill, 60px);
          justify-content: center;
          gap: 10px;
        }
        li {
          display: flex;
          outline: 2px solid #ced0d3;
          flex-direction: column;
          overflow: hidden;
          position: relative;
          box-sizing: content-box;
          background: #fff;
          fill: #666;
        }
        li.removed {
          opacity: 0.5;
        }
        li.removed::before {
          content: '';
          display: inline-block;
          position: absolute;
          width: 150%;
          left: 50%;
          top: 50%;
          height: 2px;
          background: rgb(198 40 40 / 50%);
          transform: translate(-50%, -50%) rotate(45deg);
        }
        li.removed::after {
          content: '';
          display: inline-block;
          position: absolute;
          width: 150%;
          left: 50%;
          top: 50%;
          height: 2px;
          background: rgb(198 40 40 / 50%);
          transform: translate(-50%, -50%) rotate(-45deg);
        }
        li:hover {
          background-color: rgba(0, 0, 0, 0.7);
          fill: #e8eaed;
        }
        .operation:has(input:checked) + ul > li.removed {
          display: none;
        }
      </style>
    </head>
    <body>
      <h1 class="font-name">${fontName}</h1>
      <p class="size">
        <span style="color: rgb(234,67,53)">${bytes2kb(originalSize)}</span>
        <span style="padding: 0 5px;">\>\>\></span>
        <span style="color: rgb(52,168,83)">${bytes2kb(compressedSize)}</span>
      </p>
      <div class="operation">
        <input id="filter" type="checkbox" />
        <label for="filter">hide removed</label>
      </div>
      <ul class="iconfont-list">
        ${glyf.map((glyph) => {
          try {
            const scale = unitsPerEm > 512 ? (512 / unitsPerEm) : 1
            const path = glyf2svg(glyph, { scale })

            return `
              <li class="${glyph.isRemoved ? 'removed' : ''}" title="${glyph.unicode ? `\\u${Number(glyph.unicode.toString()).toString(16).padStart(4, '0').toLocaleUpperCase()}` : ''}">
                <svg class="glyf" viewbox="0 0 ${unitsPerEm} ${unitsPerEm}">
                  <g transform="scale(1, -1) translate(0, -${unitsPerEm + descent})">
                    <path d="${path}" />
                  </g>
                </svg>
              </li>
            `
          }
          catch (err) {
            return ''
          }
        }).join('')}
      </ul>
    </body>
    </html>
  `

  html = minify(html, {
    minifyCSS: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true,
    removeComments: true,
  })

  await fsp.writeFile(path.join(process.cwd(), 'fontiny_visualizer.html'), html, 'utf-8')
}
