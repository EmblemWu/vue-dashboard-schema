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
  const categories = (data.value as { categories?: string[] } | undefined)?.categories ?? [
    'A',
    'B',
    'C'
  ]
  const values = (data.value as { values?: number[] } | undefined)?.values ?? [12, 9, 18]

  return {
    grid: { left: 24, right: 16, top: 20, bottom: 16 },
    xAxis: { type: 'category', data: categories, axisLabel: { color: '#c8d4ea' } },
    yAxis: { type: 'value', axisLabel: { color: '#c8d4ea' } },
    tooltip: { trigger: 'axis' },
    series: [
      {
        type: 'bar',
        data: values,
        itemStyle: {
          color: '#45e2cb'
        }
      }
    ]
  }
})
</script>
