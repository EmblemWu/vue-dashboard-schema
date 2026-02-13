<template>
  <div class="state-wrap">
    <p class="state-title">{{ title }}</p>
    <p class="state-desc">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
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
}

.state-desc {
  margin: 0;
  color: var(--text-muted);
}
</style>
