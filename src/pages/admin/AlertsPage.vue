<template>
  <el-row :gutter="12">
    <el-col :span="10">
      <el-card>
        <template #header>告警规则</template>
        <el-timeline>
          <el-timeline-item
            v-for="item in rules"
            :key="item.name"
            :timestamp="item.threshold"
            placement="top"
          >
            {{ item.name }}
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </el-col>

    <el-col :span="14">
      <el-card>
        <template #header>最近告警</template>
        <el-table :data="events">
          <el-table-column prop="time" label="时间" width="180" />
          <el-table-column prop="name" label="规则" width="180" />
          <el-table-column prop="detail" label="详情" />
          <el-table-column prop="level" label="级别" width="100" />
        </el-table>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
const rules = [
  { name: '支付成功率告警', threshold: '< 90% 持续 10min' },
  { name: '渠道成本异常', threshold: '环比上涨 > 20%' },
  { name: '库存下限告警', threshold: '库存 < 500' }
]

const events = [
  {
    time: '2026-02-13 10:20',
    name: '支付成功率告警',
    detail: '支付成功率 88.7%，已触发通知',
    level: 'P1'
  },
  {
    time: '2026-02-13 09:42',
    name: '渠道成本异常',
    detail: '短视频投放成本环比 +24%',
    level: 'P2'
  }
]
</script>
