<template>
  <main class="gallery-page">
    <h1>Schema Gallery</h1>
    <p>当前可用模板：{{ keys.join(', ') || '无' }}</p>
    <router-link to="/">返回大屏</router-link>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDashboardStore } from '@/store/dashboard'

const store = useDashboardStore()
const keys = computed(() => store.schemaKeys)
</script>

<style scoped>
.gallery-page {
  height: 100%;
  display: grid;
  place-content: center;
  gap: 12px;
}

.gallery-page h1,
.gallery-page p {
  margin: 0;
}
</style>
