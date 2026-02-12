<template>
  <div class="empty-state">
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<style scoped>
.empty-state {
  height: 100%;
  display: grid;
  place-content: center;
  gap: 10px;
  color: var(--text-muted);
  text-align: center;
}

.empty-state h3,
.empty-state p {
  margin: 0;
}
</style>
