<template>
  <div class="number-card">
    <div class="number-card__value">{{ value.toLocaleString() }}</div>
    <div class="number-card__meta">
      <span>{{ label }}</span>
      <span :class="trendClass">{{ trend }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { WidgetSchema } from '@/renderer/schema'
import { useWidgetData } from '@/widgets/useWidgetData'

const props = defineProps<{ widget: WidgetSchema }>()
const { data } = useWidgetData(props.widget)

const value = computed(() => {
  const maybe = (data.value as { totalUsers?: number; activeUsers?: number } | undefined)
    ?.totalUsers
  return maybe ?? Number(props.widget.props?.value ?? 0)
})

const label = computed(() => String(props.widget.props?.label ?? '总用户'))

const trend = computed(() => {
  const rate =
    (data.value as { rate?: number } | undefined)?.rate ?? Number(props.widget.props?.rate ?? 0)
  return `${rate >= 0 ? '+' : ''}${rate}%`
})

const trendClass = computed(() =>
  trend.value.startsWith('-') ? 'number-card__trend--down' : 'number-card__trend--up'
)
</script>

<style scoped>
.number-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 14px;
}

.number-card__value {
  font-size: 40px;
  font-weight: 700;
}

.number-card__meta {
  display: flex;
  justify-content: space-between;
  color: var(--text-muted);
}

.number-card__trend--up {
  color: #8ff8c6;
}

.number-card__trend--down {
  color: #ff9ca0;
}
</style>
