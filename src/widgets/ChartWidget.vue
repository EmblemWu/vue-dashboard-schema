<template>
  <VChart class="chart-widget" :option="option" autoresize />
</template>

<script setup lang="ts">
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
</script>

<style scoped>
.chart-widget {
  width: 100%;
  height: 100%;
}
</style>
