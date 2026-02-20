<template>
  <div v-if="failed" class="chart-fallback">图表加载失败，请稍后重试</div>
  <VChart v-else class="chart" :option="option" autoresize />
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
import type { EChartsOption } from 'echarts'
import VChart from 'vue-echarts'

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
.chart {
  width: 100%;
  height: 100%;
}

.chart-fallback {
  height: 100%;
  display: grid;
  place-content: center;
  color: #6b7280;
  font-size: 13px;
}
</style>
