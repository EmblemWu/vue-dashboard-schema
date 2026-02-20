<template>
  <el-card>
    <template #header>数据源管理</template>
    <el-table :data="rows">
      <el-table-column prop="name" label="名称" width="220" />
      <el-table-column prop="type" label="类型" width="120" />
      <el-table-column prop="endpoint" label="Endpoint" min-width="280" />
      <el-table-column prop="interval" label="刷新间隔" width="120" />
      <el-table-column label="状态" width="120">
        <template #default="scope">
          <el-tag :type="scope.row.status === 'healthy' ? 'success' : 'warning'">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default>
          <el-space>
            <el-button size="small">测试连接</el-button>
            <el-button size="small" type="primary">编辑</el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
const rows = [
  {
    name: '订单核心指标',
    type: 'http',
    endpoint: 'https://api.example.com/metrics/orders',
    interval: '3s',
    status: 'healthy'
  },
  {
    name: '渠道贡献明细',
    type: 'http',
    endpoint: 'https://api.example.com/metrics/channel',
    interval: '5s',
    status: 'healthy'
  },
  {
    name: '本地模拟数据',
    type: 'mock',
    endpoint: 'mock://kpi-overview',
    interval: '2s',
    status: 'degraded'
  }
]
</script>
