<template>
  <section class="overview">
    <el-row :gutter="12">
      <el-col v-for="card in kpis" :key="card.label" :span="6">
        <el-card shadow="hover">
          <el-statistic :title="card.label" :value="card.value" />
          <div class="delta" :class="{ up: card.delta >= 0, down: card.delta < 0 }">
            {{ card.delta >= 0 ? '+' : '' }}{{ card.delta }}%
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="12" class="mt12">
      <el-col :span="16">
        <el-card>
          <template #header>7日核心指标趋势</template>
          <div class="chart-box">
            <EChartView :option="lineOption" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>渠道贡献</template>
          <div class="chart-box">
            <EChartView :option="pieOption" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="mt12">
      <template #header>待关注事项</template>
      <el-table :data="todoRows">
        <el-table-column prop="module" label="模块" width="160" />
        <el-table-column prop="issue" label="问题" />
        <el-table-column prop="owner" label="负责人" width="120" />
        <el-table-column prop="priority" label="优先级" width="120" />
      </el-table>
    </el-card>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { EChartsOption } from 'echarts'
import EChartView from '@/ui/EChartView.vue'

const kpis = [
  { label: '今日活跃用户', value: 12190, delta: 5.2 },
  { label: '支付订单', value: 2840, delta: 2.9 },
  { label: '支付转化率', value: 4.62, delta: -0.4 },
  { label: 'GMV(万元)', value: 389.5, delta: 8.1 }
]

const lineOption = computed<EChartsOption>(() => ({
  grid: { left: 26, right: 16, top: 24, bottom: 24 },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  yAxis: { type: 'value' },
  series: [
    {
      type: 'line',
      smooth: true,
      data: [120, 146, 131, 178, 186, 205, 199],
      areaStyle: { opacity: 0.1 }
    },
    {
      type: 'line',
      smooth: true,
      data: [88, 93, 110, 124, 136, 141, 155],
      areaStyle: { opacity: 0.1 }
    }
  ]
}))

const pieOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'item' },
  series: [
    {
      type: 'pie',
      radius: ['45%', '70%'],
      data: [
        { value: 40, name: '自然流量' },
        { value: 26, name: '广告流量' },
        { value: 20, name: '社媒' },
        { value: 14, name: '活动' }
      ]
    }
  ]
}))

const todoRows = [
  { module: '支付漏斗', issue: '支付成功率连续2小时低于阈值', owner: 'Li', priority: '高' },
  { module: '渠道ROI', issue: '短视频渠道成本上涨15%', owner: 'Wang', priority: '中' },
  { module: '库存健康', issue: '华东区域两款商品低库存', owner: 'Chen', priority: '中' }
]
</script>

<style scoped>
.mt12 {
  margin-top: 12px;
}

.chart-box {
  height: 320px;
}

.delta {
  margin-top: 8px;
  font-size: 13px;
}

.up {
  color: #16a34a;
}

.down {
  color: #dc2626;
}
</style>
