<template>
  <section v-if="error" class="app-error-boundary">
    <h1>应用出现异常</h1>
    <p>{{ error }}</p>
    <Button @click="reset">回到模板列表</Button>
  </section>
  <slot v-else />
</template>

<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/ui/Button.vue'

const router = useRouter()
const error = ref<string | null>(null)

onErrorCaptured((err) => {
  error.value = err instanceof Error ? err.message : 'Unknown application error'
  return false
})

const reset = () => {
  error.value = null
  void router.push('/templates')
}
</script>

<style scoped>
.app-error-boundary {
  min-height: 100%;
  display: grid;
  place-content: center;
  gap: 10px;
  text-align: center;
}

.app-error-boundary h1,
.app-error-boundary p {
  margin: 0;
}
</style>
