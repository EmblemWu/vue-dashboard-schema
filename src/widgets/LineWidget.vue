<template>
  <ChartWidget :option="option" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { EChartsOption } from 'echarts'
import type { WidgetSchema } from '@/renderer/schema'
import ChartWidget from '@/widgets/ChartWidget.vue'
import { useWidgetData } from '@/widgets/useWidgetData'

const props = defineProps<{ widget: WidgetSchema }>()
const { data } = useWidgetData(props.widget)

const option = computed<EChartsOption>(() => {
  const series =
    (data.value as { series?: Array<{ name: string; value: number }> } | undefined)?.series ?? []
  return {
    grid: { left: 24, right: 16, top: 24, bottom: 16 },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: series.map((item) => item.name),
      axisLabel: { color: '#c8d4ea' }
    },
    yAxis: { type: 'value', axisLabel: { color: '#c8d4ea' } },
    series: [
      {
        type: 'line',
        data: series.map((item) => item.value),
        smooth: true,
        areaStyle: { opacity: 0.15 },
        lineStyle: { width: 3, color: '#4bc8ff' }
      }
    ]
  }
})
</script>
