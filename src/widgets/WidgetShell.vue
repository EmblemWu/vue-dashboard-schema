<template>
  <Card class="widget-shell" :class="{ 'widget-shell--absolute': isAbsolute }">
    <header class="widget-shell__header">
      <h4>{{ widget.title || widget.id }}</h4>
      <span v-if="state?.error" class="widget-shell__badge widget-shell__badge--error">
        {{ state.stale ? 'stale' : 'error' }}
      </span>
      <span v-else-if="state?.loading" class="widget-shell__badge widget-shell__badge--loading"
        >loading</span
      >
      <span v-else class="widget-shell__badge widget-shell__badge--ok">ok</span>
    </header>
    <div class="widget-shell__body">
      <slot />
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Card from '@/ui/Card.vue'
import { useDashboardStore } from '@/store/dashboard'
import type { WidgetSchema } from '@/renderer/schema'

const props = defineProps<{
  widget: WidgetSchema
}>()

const store = useDashboardStore()
const state = computed(() =>
  props.widget.datasource ? store.datasourceStore[props.widget.datasource] : undefined
)

const isAbsolute = computed(() => store.activeSchema?.layout.mode === 'absolute')
</script>

<style scoped>
.widget-shell {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.widget-shell--absolute {
  position: absolute;
}

.widget-shell__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 10px 14px 0;
}

.widget-shell__header h4 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.widget-shell__badge {
  font-size: 11px;
  border-radius: 999px;
  padding: 2px 8px;
  text-transform: uppercase;
}

.widget-shell__badge--ok {
  color: #062533;
  background: #90f6cf;
}

.widget-shell__badge--error {
  color: #fff;
  background: var(--danger);
}

.widget-shell__badge--loading {
  color: #352003;
  background: var(--warning);
}

.widget-shell__body {
  flex: 1;
  min-height: 0;
  padding: 8px 12px 12px;
}
</style>
