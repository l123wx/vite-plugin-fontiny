<script setup lang="ts">
import { ref } from 'vue'
import { ElTabPane, ElTabs } from 'element-plus'
import FontInfo from './components/FontInfo.vue'

interface FontFile {
  name: string
  path: string
}

const fontList = ref<FontFile[]>([])

async function loadFontList() {
  const response = await fetch('/fontData/index.json')
  const result = await response.json()

  fontList.value = result
}

loadFontList()
</script>

<template>
  <ElTabs type="card">
    <ElTabPane v-for="item in fontList" :key="item.path" :label="item.name" lazy>
      <FontInfo :font-file-url="item.path" />
    </ElTabPane>
  </ElTabs>
</template>

<style scoped></style>
