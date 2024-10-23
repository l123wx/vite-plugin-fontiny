<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElFormItem, ElPagination, ElSkeleton, ElSkeletonItem, ElSwitch, ElTag, ElTooltip, vLoading } from 'element-plus'
import type { VisualizerFontJSON } from '../../../types'

const props = defineProps<{
  fontFileUrl: string
}>()

const fontJSON = ref<VisualizerFontJSON>({
  fontName: '',
  originalSize: 0,
  compressedSize: 0,
  chars: [],
})
const isLoading = ref(false)

async function loadFontJSON(url: string) {
  isLoading.value = true
  try {
    const response = await fetch(url)
    const result = await response.json()

    fontJSON.value = result
  }
  finally {
    isLoading.value = false
  }
}

watch(() => props.fontFileUrl, () => {
  if (props.fontFileUrl) {
    loadFontJSON(props.fontFileUrl)
  }
}, {
  immediate: true,
})

function bytes2kb(bytes: number) {
  return `${(bytes / 1000).toFixed(2)}KB`
}

const pageSizes = [100, 200, 500, 1000]

const current = ref(1)
const pageSize = ref(pageSizes[1])
const hideRemovedChar = ref(true)

const chars = computed(() => fontJSON.value.chars.filter(char => !(hideRemovedChar.value && char.isRemoved)))
const currentChars = computed(() => chars.value.slice((current.value - 1) * pageSize.value, current.value * pageSize.value))
</script>

<template>
  <h1 class="font-name">
    <ElSkeleton :loading="isLoading" animated>
      <template #template>
        <ElSkeletonItem style="width: 300px; height: 50px; " />
      </template>
      <template #default>
        {{ fontJSON.fontName }}
      </template>
    </ElSkeleton>
  </h1>
  <p class="size">
    <ElTag type="danger">
      {{ bytes2kb(fontJSON.originalSize) }}
    </ElTag>
    <span style="padding: 0 5px;">>>></span>
    <ElTag type="success">
      {{ bytes2kb(fontJSON.compressedSize) }}
    </ElTag>
  </p>
  <div class="operation">
    <ElPagination
      v-model:current-page="current"
      v-model:page-size="pageSize"
      :page-sizes="pageSizes"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="chars.length"
      @update:page-size="() => current = 1"
    />

    <ElFormItem label="Hide Removed" style="display: flex; align-items: center; gap: 10px;">
      <ElSwitch v-model="hideRemovedChar" size="large" @change="() => current = 1" />
    </ElFormItem>
  </div>

  <ElSkeleton :loading="isLoading" animated>
    <template #template>
      <ElSkeletonItem v-for="item in 5" :key="item" style="height: 60px; margin-bottom: 10px;" />
    </template>
    <template #default>
      <ul class="iconfont-list">
        <ElTooltip
          v-for="char in currentChars"
          :key="char.id"
          :disabled="!char.unicode"
          placement="top"
          :content="char.unicode"
          :hide-after="0"
        >
          <li :class="{ removed: char.isRemoved }" v-html="char.svg" />
        </ElTooltip>
      </ul>
    </template>
  </ElSkeleton>
</template>

<style scoped>
.font-name {
  text-align: center;
  font-size: 50px;
  margin-bottom: 0;
}

.size {
  text-align: center;
  margin-bottom: 40px;
}

.operation {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.iconfont-list {
  display: grid;
  padding: 0;
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
</style>
