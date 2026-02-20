<template>
  <el-card>
    <template #header>
      <div class="header-row">
        <span>指标分析</span>
        <el-space>
          <el-select v-model="timeRange" style="width: 140px">
            <el-option label="近7天" value="7d" />
            <el-option label="近30天" value="30d" />
          </el-select>
          <el-select v-model="segment" style="width: 160px">
            <el-option label="全部渠道" value="all" />
            <el-option label="自然流量" value="organic" />
            <el-option label="广告投放" value="ads" />
          </el-select>
        </el-space>
      </div>
    </template>

    <el-row :gutter="12">
      <el-col :span="14">
        <div class="chart-box"><EChartView :option="trendOption" /></div>
      </el-col>
      <el-col :span="10">
        <div class="chart-box"><EChartView :option="barOption" /></div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { EChartsOption } from 'echarts'
import EChartView from '@/ui/EChartView.vue'

const timeRange = ref<'7d' | '30d'>('7d')
const segment = ref<'all' | 'organic' | 'ads'>('all')

const trendOption = computed<EChartsOption>(() => {
  const x =
    timeRange.value === '7d'
      ? ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7']
      : Array.from({ length: 10 }, (_, i) => `W${i + 1}`)
  const base = segment.value === 'ads' ? 140 : segment.value === 'organic' ? 95 : 120
  const y = x.map((_, i) => Math.round(base + Math.sin(i) * 22 + i * 3))
  return {
    title: { text: '转化率趋势' },
    grid: { left: 24, right: 18, top: 46, bottom: 24 },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: x },
    yAxis: { type: 'value' },
    series: [{ type: 'line', smooth: true, data: y, areaStyle: { opacity: 0.12 } }]
  }
})

const barOption = computed<EChartsOption>(() => ({
  title: { text: '渠道贡献对比' },
  grid: { left: 24, right: 18, top: 46, bottom: 24 },
  xAxis: { type: 'category', data: ['自然', '广告', '社媒', '活动'] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [32, 41, 26, 19] }]
}))
</script>

<style scoped>
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-box {
  height: 360px;
}
</style>
