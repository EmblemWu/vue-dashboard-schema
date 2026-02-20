<template>
  <section class="overview-page">
    <el-row v-loading="loading" :gutter="12">
      <el-col :span="6">
        <el-card class="kpi-card"
          ><el-statistic title="商品总数" :value="stats.product_count"
        /></el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="kpi-card"
          ><el-statistic title="在售商品" :value="stats.on_sale_count"
        /></el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="kpi-card"
          ><el-statistic title="待支付订单" :value="stats.pending_orders"
        /></el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="kpi-card"
          ><el-statistic title="累计营收" :value="Number(stats.revenue || 0)" prefix="¥"
        /></el-card>
      </el-col>
    </el-row>

    <el-row :gutter="12" class="mt12">
      <el-col :span="14">
        <el-card>
          <template #header>近7笔订单金额走势</template>
          <div class="chart-box"><EChartView :option="orderTrendOption" /></div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card>
          <template #header>订单状态分布</template>
          <div class="chart-box"><EChartView :option="orderStatusOption" /></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="12" class="mt12">
      <el-col :span="12">
        <el-card>
          <template #header>分类销售排行（Top5）</template>
          <div class="chart-box"><EChartView :option="categorySalesOption" /></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>最新订单</template>
          <el-table :data="recentOrders" size="small" height="320">
            <el-table-column prop="order_no" label="订单号" min-width="150" />
            <el-table-column prop="customer_name" label="客户" width="90" />
            <el-table-column prop="total_amount" label="金额" width="90" />
            <el-table-column prop="status" label="状态" width="90">
              <template #default="scope">
                <el-tag :type="statusType(scope.row.status)" size="small">{{
                  statusLabel(scope.row.status)
                }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import type { EChartsOption } from 'echarts'
import {
  fetchOrdersApi,
  fetchOverviewApi,
  fetchProductsApi,
  type Order,
  type OverviewStats,
  type Product
} from '@/api/mall'
import EChartView from '@/ui/EChartView.vue'

const loading = ref(false)
const stats = reactive<OverviewStats>({
  product_count: 0,
  on_sale_count: 0,
  pending_orders: 0,
  paid_orders: 0,
  revenue: '0'
})
const orders = ref<Order[]>([])
const products = ref<Product[]>([])

const load = async () => {
  loading.value = true
  try {
    const [overview, orderRows, productRows] = await Promise.all([
      fetchOverviewApi(),
      fetchOrdersApi(),
      fetchProductsApi()
    ])
    Object.assign(stats, overview)
    orders.value = orderRows
    products.value = productRows
  } finally {
    loading.value = false
  }
}

const recentOrders = computed(() => orders.value.slice(0, 7))

const statusLabelMap: Record<Order['status'], string> = {
  pending: '待支付',
  paid: '待发货',
  shipped: '已发货',
  completed: '已完成',
  cancelled: '已取消'
}

const statusTypeMap: Record<
  Order['status'],
  'primary' | 'success' | 'warning' | 'danger' | 'info'
> = {
  pending: 'warning',
  paid: 'primary',
  shipped: 'success',
  completed: 'info',
  cancelled: 'danger'
}

const statusLabel = (status: Order['status']) => statusLabelMap[status]
const statusType = (status: Order['status']) => statusTypeMap[status]

const orderTrendOption = computed<EChartsOption>(() => {
  const rows = recentOrders.value.slice().reverse()
  return {
    grid: { left: 20, right: 20, top: 24, bottom: 24 },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: rows.map((item) => item.order_no.slice(-4)) },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'line',
        smooth: true,
        areaStyle: { opacity: 0.12 },
        data: rows.map((item) => Number(item.total_amount))
      }
    ]
  }
})

const orderStatusOption = computed<EChartsOption>(() => {
  const counter: Record<Order['status'], number> = {
    pending: 0,
    paid: 0,
    shipped: 0,
    completed: 0,
    cancelled: 0
  }
  orders.value.forEach((item) => {
    counter[item.status] += 1
  })

  return {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [
      {
        type: 'pie',
        radius: ['38%', '68%'],
        data: Object.entries(counter).map(([key, value]) => ({
          name: statusLabelMap[key as Order['status']],
          value
        }))
      }
    ]
  }
})

const categorySalesOption = computed<EChartsOption>(() => {
  const map = new Map<string, number>()
  products.value.forEach((item) => {
    const prev = map.get(item.category_name) ?? 0
    map.set(item.category_name, prev + item.sales)
  })

  const rows = Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return {
    grid: { left: 24, right: 16, top: 20, bottom: 18 },
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: rows.map((item) => item[0]) },
    series: [{ type: 'bar', data: rows.map((item) => item[1]) }]
  }
})

onMounted(() => {
  void load()
})
</script>

<style scoped>
.mt12 {
  margin-top: 12px;
}

.kpi-card {
  border-radius: 10px;
}

.chart-box {
  height: 320px;
}
</style>
