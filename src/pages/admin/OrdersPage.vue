<template>
  <el-card>
    <template #header>
      <div class="header-row">
        <span>订单管理</span>
        <el-button type="primary" @click="load">刷新</el-button>
      </div>
    </template>

    <el-table v-loading="loading" :data="rows">
      <el-table-column prop="order_no" label="订单号" min-width="180" />
      <el-table-column prop="customer_name" label="客户" width="120" />
      <el-table-column prop="customer_phone" label="手机号" width="140" />
      <el-table-column prop="total_amount" label="金额" width="120" />
      <el-table-column label="状态" width="120">
        <template #default="scope">
          <el-tag :type="statusType(scope.row.status)">{{ statusLabel(scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="商品明细">
        <template #default="scope">
          <div v-for="item in scope.row.items" :key="item.id">
            {{ item.product_title }} x {{ item.quantity }}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchOrdersApi, type Order } from '@/api/mall'

const rows = ref<Order[]>([])
const loading = ref(false)

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

const load = async () => {
  loading.value = true
  try {
    rows.value = await fetchOrdersApi()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void load()
})
</script>

<style scoped>
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
