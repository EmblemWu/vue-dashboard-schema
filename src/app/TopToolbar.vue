<template>
  <header class="top-toolbar">
    <div class="top-toolbar__left">
      <h1>{{ title }}</h1>
      <small>{{ subtitle }}</small>
    </div>

    <div class="top-toolbar__actions">
      <RouterLink to="/templates">模板列表</RouterLink>
      <RouterLink to="/favorites">收藏管理</RouterLink>
      <label>
        模板
        <select
          :value="schemaKey"
          @change="$emit('schema-change', ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="key in schemaKeys" :key="key" :value="key">{{ key }}</option>
        </select>
      </label>

      <div class="top-toolbar__btns">
        <Button
          v-for="mode in throttleModes"
          :key="mode"
          :active="mode === throttleMode"
          @click="$emit('throttle-change', mode)"
        >
          {{ labels[mode] }}
        </Button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Button from '@/ui/Button.vue'
import type { ThrottleMode } from '@/store/dashboard'

const throttleModes: ThrottleMode[] = ['normal', 'x5', 'x10']
const labels: Record<ThrottleMode, string> = {
  normal: '正常',
  x5: '降频 x5',
  x10: '降频 x10'
}

defineProps<{
  title: string
  subtitle: string
  schemaKey: string
  schemaKeys: string[]
  throttleMode: ThrottleMode
}>()

defineEmits<{
  'schema-change': [key: string]
  'throttle-change': [mode: ThrottleMode]
}>()
</script>

<style scoped>
.top-toolbar {
  height: 68px;
  padding: 12px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border);
  background: rgba(8, 17, 31, 0.72);
}

.top-toolbar__left h1 {
  margin: 0;
  font-size: 22px;
}

.top-toolbar__left small {
  color: var(--text-muted);
}

.top-toolbar__actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.top-toolbar__actions > a {
  color: #8fe6ff;
  text-decoration: none;
}

.top-toolbar__actions label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
}

.top-toolbar select {
  min-width: 180px;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid var(--border);
  color: var(--text-main);
  background: rgba(16, 35, 57, 0.92);
}

.top-toolbar__btns {
  display: flex;
  gap: 8px;
}
</style>
