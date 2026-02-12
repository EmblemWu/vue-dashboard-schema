<template>
  <main class="screen-page">
    <TopToolbar
      :title="activeSchema?.title ?? 'Schema Dashboard'"
      :subtitle="activeSchema?.description ?? '可配置大屏渲染器'"
      :schema-key="currentSchemaKey"
      :schema-keys="schemaKeys"
      :throttle-mode="throttleMode"
      @schema-change="setSchema"
      @throttle-change="setThrottleMode"
    />

    <div ref="viewportRef" class="screen-page__viewport">
      <div class="screen-page__canvas" :style="canvasStyle">
        <div class="screen-page__scaler" :style="scalerStyle">
          <EmptyState
            v-if="!activeSchema"
            title="无可用 Schema"
            description="请检查 schemas 目录与 schema 格式。"
          />
          <SchemaRenderer v-else :schema="activeSchema" />
        </div>
      </div>
    </div>

    <aside v-if="schemaErrors.length > 0" class="screen-page__errors">
      <h3>Schema 校验错误</h3>
      <ul>
        <li v-for="item in schemaErrors" :key="item">{{ item }}</li>
      </ul>
    </aside>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import TopToolbar from '@/app/TopToolbar.vue'
import { useScreenScale } from '@/lib/scale'
import { SchemaRenderer } from '@/renderer/render'
import { useDashboardStore } from '@/store/dashboard'
import EmptyState from '@/ui/EmptyState.vue'

const store = useDashboardStore()
const viewportRef = ref<HTMLElement | null>(null)
const { baseWidth, baseHeight, scale } = useScreenScale(viewportRef)

const activeSchema = computed(() => store.activeSchema)
const schemaKeys = computed(() => store.schemaKeys)
const currentSchemaKey = computed(() => store.currentSchemaKey)
const throttleMode = computed(() => store.throttleMode)
const schemaErrors = computed(() =>
  Object.entries(store.schemaErrorMap).map(([key, message]) => `${key}: ${message}`)
)

const canvasStyle = computed(() => ({
  width: `${baseWidth * scale.value}px`,
  height: `${baseHeight * scale.value}px`
}))

const scalerStyle = computed(() => ({
  width: `${baseWidth}px`,
  height: `${baseHeight}px`,
  transform: `scale(${scale.value})`,
  transformOrigin: 'top left'
}))

const setSchema = (key: string) => store.setSchema(key)
const setThrottleMode = (mode: 'normal' | 'x5' | 'x10') => store.setThrottleMode(mode)

onMounted(() => {
  store.startRuntime()
})

onUnmounted(() => {
  store.stopRuntime()
})
</script>

<style scoped>
.screen-page {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.screen-page__viewport {
  flex: 1;
  overflow: hidden;
  display: grid;
  place-items: center;
}

.screen-page__canvas {
  position: relative;
  overflow: hidden;
}

.screen-page__scaler {
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
}

:deep(.schema-renderer) {
  width: 100%;
  height: 100%;
  padding: 12px;
}

:deep(.schema-renderer--absolute) {
  position: relative;
}

.screen-page__errors {
  position: fixed;
  right: 16px;
  bottom: 16px;
  width: min(420px, 70vw);
  background: rgba(89, 24, 27, 0.88);
  border: 1px solid rgba(231, 104, 111, 0.9);
  border-radius: 8px;
  padding: 10px 12px;
}

.screen-page__errors h3 {
  margin: 0 0 8px;
  font-size: 14px;
}

.screen-page__errors ul {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 6px;
  font-size: 12px;
}
</style>
