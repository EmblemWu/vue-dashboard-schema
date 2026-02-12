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
    tooltip: { trigger: 'item' },
    legend: {
      bottom: 0,
      textStyle: {
        color: '#c8d4ea'
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '45%'],
        data: series,
        label: {
          color: '#dbe8ff'
        }
      }
    ]
  }
})
</script>
