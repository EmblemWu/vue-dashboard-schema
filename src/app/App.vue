<template>
  <AppErrorBoundary>
    <router-view />
  </AppErrorBoundary>
</template>

<script setup lang="ts">
import AppErrorBoundary from '@/app/AppErrorBoundary.vue'
</script>
