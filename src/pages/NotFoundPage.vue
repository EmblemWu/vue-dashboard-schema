<template>
  <main class="not-found">
    <h1>404</h1>
    <p>页面不存在</p>
    <RouterLink to="/app/overview">返回工作台</RouterLink>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.not-found {
  height: 100%;
  display: grid;
  place-content: center;
  gap: 8px;
  text-align: center;
}

.not-found h1,
.not-found p {
  margin: 0;
}

.not-found a {
  color: var(--accent);
}
</style>
