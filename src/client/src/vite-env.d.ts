/// <reference types="vite/client" />

declare interface FontJSON {
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
