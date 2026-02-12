<template>
  <section class="ui-card">
    <slot />
  </section>
</template>

<style scoped>
.ui-card {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: linear-gradient(180deg, rgba(13, 34, 58, 0.9), rgba(9, 24, 42, 0.84));
  overflow: hidden;
}
</style>
