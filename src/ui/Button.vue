<template>
  <button class="ui-button" :class="{ 'ui-button--active': active }" type="button">
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  active?: boolean
}>()
</script>

<style scoped>
.ui-button {
  border: 1px solid var(--border);
  background: rgba(24, 54, 89, 0.88);
  color: var(--text-main);
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.18s ease;
}

.ui-button:hover {
  background: rgba(50, 94, 143, 0.88);
}

.ui-button--active {
  border-color: var(--accent);
  color: #062533;
  background: linear-gradient(120deg, #42d6cd, #a4f8f0);
}
</style>
