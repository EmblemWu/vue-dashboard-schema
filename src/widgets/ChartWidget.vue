<template>
  <div v-if="failed" class="chart-widget chart-widget--fallback">
    图表资源加载失败，已降级为文本展示
  </div>
  <VChart v-else class="chart-widget" :option="option" autoresize />
</template>

<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue'
import { use } from 'echarts/core'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  DatasetComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  DatasetComponent
])

defineProps<{
  option: EChartsOption
}>()

const failed = ref(false)
onErrorCaptured(() => {
  failed.value = true
  return false
})
</script>

<style scoped>
.chart-widget {
  width: 100%;
  height: 100%;
}

.chart-widget--fallback {
  display: grid;
  place-content: center;
  color: var(--text-muted);
  font-size: 13px;
}
</style>
