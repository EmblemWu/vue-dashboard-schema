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
      <el-table-column label="发货信息" min-width="200">
        <template #default="scope">
          <span v-if="scope.row.tracking_no"
            >{{ scope.row.shipping_company }} / {{ scope.row.tracking_no }}</span
          >
          <span v-else>未发货</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280" fixed="right">
        <template #default="scope">
          <el-space>
            <el-button size="small" @click="openDetail(scope.row)">详情</el-button>
            <el-button
              v-for="action in statusActions(scope.row.status)"
              :key="action.label"
              size="small"
              :type="action.type"
              @click="executeAction(scope.row, action.status)"
            >
              {{ action.label }}
            </el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-drawer v-model="detailVisible" title="订单详情" size="40%" destroy-on-close>
    <template v-if="selectedOrder">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="订单号">{{ selectedOrder.order_no }}</el-descriptions-item>
        <el-descriptions-item label="客户"
          >{{ selectedOrder.customer_name }} /
          {{ selectedOrder.customer_phone }}</el-descriptions-item
        >
        <el-descriptions-item label="状态">{{
          statusLabel(selectedOrder.status)
        }}</el-descriptions-item>
        <el-descriptions-item label="发货信息">
          {{ selectedOrder.shipping_company || '-' }} / {{ selectedOrder.tracking_no || '-' }}
        </el-descriptions-item>
      </el-descriptions>
      <el-divider />
      <el-table :data="selectedOrder.items" size="small">
        <el-table-column prop="product_title" label="商品" />
        <el-table-column prop="unit_price" label="单价" width="100" />
        <el-table-column prop="quantity" label="数量" width="80" />
        <el-table-column prop="amount" label="金额" width="100" />
      </el-table>
    </template>
  </el-drawer>

  <el-dialog v-model="shipVisible" title="订单发货" width="480px">
    <el-form :model="shipForm" label-width="110px">
      <el-form-item label="物流公司"><el-input v-model="shipForm.shipping_company" /></el-form-item>
      <el-form-item label="物流单号"><el-input v-model="shipForm.tracking_no" /></el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="shipVisible = false">取消</el-button>
      <el-button type="primary" :loading="shipping" @click="confirmShip">确认发货</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchOrdersApi, updateOrderStatusApi, type Order } from '@/api/mall'

const rows = ref<Order[]>([])
const loading = ref(false)
const keyword = ref('')
const statusFilter = ref<Order['status'] | ''>('')
const detailVisible = ref(false)
const selectedOrder = ref<Order | null>(null)

const shipVisible = ref(false)
const shipping = ref(false)
const shippingOrderId = ref<number | null>(null)
const shipForm = reactive({
  shipping_company: '',
  tracking_no: ''
})

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
      return [{ label: '去发货', status: 'shipped' as Order['status'], type: 'success' as const }]
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

const openDetail = (row: Order) => {
  selectedOrder.value = row
  detailVisible.value = true
}

const executeAction = async (row: Order, status: Order['status']) => {
  if (status === 'shipped') {
    shippingOrderId.value = row.id
    shipForm.shipping_company = row.shipping_company || '顺丰速运'
    shipForm.tracking_no = row.tracking_no || ''
    shipVisible.value = true
    return
  }

  await updateOrderStatusApi(row.id, { status })
  ElMessage.success(`订单状态已更新为${statusLabel(status)}`)
  await load()
}

const confirmShip = async () => {
  if (!shippingOrderId.value) {
    return
  }
  if (!shipForm.shipping_company.trim() || !shipForm.tracking_no.trim()) {
    ElMessage.warning('请填写物流公司和物流单号')
    return
  }

  shipping.value = true
  try {
    await updateOrderStatusApi(shippingOrderId.value, {
      status: 'shipped',
      shipping_company: shipForm.shipping_company,
      tracking_no: shipForm.tracking_no,
      shipped_at: new Date().toISOString()
    })
    ElMessage.success('订单已发货')
    shipVisible.value = false
    await load()
  } finally {
    shipping.value = false
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
