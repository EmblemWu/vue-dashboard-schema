<template>
  <el-card>
    <template #header>
      <div class="header-row">
        <span>订单管理</span>
        <el-space>
          <el-input
            v-model="keyword"
            clearable
            placeholder="搜索订单号/客户"
            style="width: 260px"
          />
          <el-select v-model="statusFilter" clearable placeholder="状态筛选" style="width: 140px">
            <el-option label="待支付" value="pending" />
            <el-option label="待发货" value="paid" />
            <el-option label="已发货" value="shipped" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
          <el-button @click="load">刷新</el-button>
        </el-space>
      </div>
    </template>

    <el-table v-loading="loading" :data="filteredRows">
      <el-table-column prop="order_no" label="订单号" min-width="180" />
      <el-table-column prop="customer_name" label="客户" width="120" />
      <el-table-column prop="customer_phone" label="手机号" width="140" />
      <el-table-column prop="total_amount" label="金额" width="120" />
      <el-table-column label="状态" width="120">
        <template #default="scope">
          <el-tag :type="statusType(scope.row.status)">{{ statusLabel(scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="商品明细" min-width="240">
        <template #default="scope">
          <div v-for="item in scope.row.items" :key="item.id">
            {{ item.product_title }} x {{ item.quantity }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="scope">
          <el-space>
            <el-button
              v-for="action in statusActions(scope.row.status)"
              :key="action.label"
              size="small"
              :type="action.type"
              @click="changeStatus(scope.row, action.status)"
            >
              {{ action.label }}
            </el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchOrdersApi, updateOrderStatusApi, type Order } from '@/api/mall'

const rows = ref<Order[]>([])
const loading = ref(false)
const keyword = ref('')
const statusFilter = ref<Order['status'] | ''>('')

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

const filteredRows = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  return rows.value.filter((item) => {
    const keywordOk =
      !q || item.order_no.toLowerCase().includes(q) || item.customer_name.toLowerCase().includes(q)
    const statusOk = !statusFilter.value || item.status === statusFilter.value
    return keywordOk && statusOk
  })
})

const statusActions = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return [
        { label: '标记待发货', status: 'paid' as Order['status'], type: 'primary' as const },
        { label: '取消订单', status: 'cancelled' as Order['status'], type: 'danger' as const }
      ]
    case 'paid':
      return [{ label: '确认发货', status: 'shipped' as Order['status'], type: 'success' as const }]
    case 'shipped':
      return [
        { label: '完成订单', status: 'completed' as Order['status'], type: 'primary' as const }
      ]
    default:
      return []
  }
}

const load = async () => {
  loading.value = true
  try {
    rows.value = await fetchOrdersApi()
  } finally {
    loading.value = false
  }
}

const changeStatus = async (row: Order, status: Order['status']) => {
  await updateOrderStatusApi(row.id, status)
  ElMessage.success(`订单状态已更新为${statusLabel(status)}`)
  await load()
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
