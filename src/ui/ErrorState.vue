<template>
  <div class="state-wrap">
    <p class="state-title">{{ title }}</p>
    <p class="state-desc">{{ description }}</p>
    <Button v-if="onRetry" @click="onRetry">重试</Button>
  </div>
</template>

<script setup lang="ts">
import Button from '@/ui/Button.vue'

defineProps<{
  title?: string
  description?: string
  onRetry?: (() => void) | undefined
}>()
</script>

<style scoped>
.state-wrap {
  min-height: 220px;
  display: grid;
  place-content: center;
  gap: 8px;
  text-align: center;
}

.state-title {
  margin: 0;
  font-size: 18px;
  color: #ffb8b8;
}

.state-desc {
  margin: 0;
  color: var(--text-muted);
}
</style>
