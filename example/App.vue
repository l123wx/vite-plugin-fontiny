<template>
    <h1 class="title">vite-plugin-fontiny</h1>
    <h1>只有在代码中出现过的中文字符会在字体文件中保留</h1>
    <input v-model="value" type="text" placeholder="在输入框中输入新文字查看效果" />
    <h1>{{ value }}</h1>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref('')
</script>
