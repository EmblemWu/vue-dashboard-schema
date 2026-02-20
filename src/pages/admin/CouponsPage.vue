<template>
  <el-card>
    <template #header>
      <div class="header-row">
        <span>营销管理（优惠券）</span>
        <el-space>
          <el-input v-model="keyword" clearable placeholder="搜索券名/编码" style="width: 260px" />
          <el-button @click="load">刷新</el-button>
          <el-button type="primary" @click="openCreate">新建优惠券</el-button>
        </el-space>
      </div>
    </template>

    <el-table v-loading="loading" :data="filteredRows">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="券名称" min-width="180" />
      <el-table-column prop="code" label="券码" width="140" />
      <el-table-column prop="discount_amount" label="优惠金额" width="100" />
      <el-table-column prop="min_spend" label="门槛金额" width="100" />
      <el-table-column prop="stock" label="库存" width="90" />
      <el-table-column prop="claimed" label="已领" width="90" />
      <el-table-column label="状态" width="100">
        <template #default="scope">
          <el-tag :type="statusType(scope.row.status)">{{ statusLabel(scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="有效期" width="220">
        <template #default="scope">{{ scope.row.valid_from }} ~ {{ scope.row.valid_to }}</template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="scope">
          <el-space>
            <el-button size="small" @click="openEdit(scope.row)">编辑</el-button>
            <el-button size="small" @click="toggleStatus(scope.row)">{{
              scope.row.status === 'active' ? '下线' : '生效'
            }}</el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑优惠券' : '新建优惠券'" width="560px">
    <el-form :model="form" label-width="100px">
      <el-form-item label="券名称"><el-input v-model="form.title" /></el-form-item>
      <el-form-item label="券码"><el-input v-model="form.code" /></el-form-item>
      <el-form-item label="优惠金额"><el-input v-model="form.discount_amount" /></el-form-item>
      <el-form-item label="门槛金额"><el-input v-model="form.min_spend" /></el-form-item>
      <el-form-item label="库存"
        ><el-input-number v-model="form.stock" :min="0" style="width: 100%"
      /></el-form-item>
      <el-form-item label="已领"
        ><el-input-number v-model="form.claimed" :min="0" style="width: 100%"
      /></el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.status" style="width: 100%">
          <el-option label="草稿" value="draft" />
          <el-option label="生效中" value="active" />
          <el-option label="已过期" value="expired" />
        </el-select>
      </el-form-item>
      <el-form-item label="有效期开始"
        ><el-date-picker
          v-model="form.valid_from"
          type="date"
          value-format="YYYY-MM-DD"
          style="width: 100%"
      /></el-form-item>
      <el-form-item label="有效期结束"
        ><el-date-picker
          v-model="form.valid_to"
          type="date"
          value-format="YYYY-MM-DD"
          style="width: 100%"
      /></el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="saving" @click="save">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  createCouponApi,
  fetchCouponsApi,
  updateCouponApi,
  type Coupon,
  type CouponPayload
} from '@/api/mall'

const rows = ref<Coupon[]>([])
const loading = ref(false)
const saving = ref(false)
const keyword = ref('')
const dialogVisible = ref(false)
const isEdit = ref(false)
const editingId = ref<number | null>(null)

const form = reactive<CouponPayload>({
  title: '',
  code: '',
  discount_amount: '0',
  min_spend: '0',
  stock: 0,
  claimed: 0,
  status: 'draft',
  valid_from: '',
  valid_to: ''
})

const statusLabelMap: Record<Coupon['status'], string> = {
  draft: '草稿',
  active: '生效中',
  expired: '已过期'
}

const statusTypeMap: Record<Coupon['status'], 'primary' | 'success' | 'warning'> = {
  draft: 'warning',
  active: 'success',
  expired: 'primary'
}

const statusLabel = (status: Coupon['status']) => statusLabelMap[status]
const statusType = (status: Coupon['status']) => statusTypeMap[status]

const filteredRows = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  if (!q) {
    return rows.value
  }
  return rows.value.filter(
    (item) => item.title.toLowerCase().includes(q) || item.code.toLowerCase().includes(q)
  )
})

const load = async () => {
  loading.value = true
  try {
    rows.value = await fetchCouponsApi()
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.title = ''
  form.code = ''
  form.discount_amount = '0'
  form.min_spend = '0'
  form.stock = 0
  form.claimed = 0
  form.status = 'draft'
  form.valid_from = ''
  form.valid_to = ''
}

const openCreate = () => {
  isEdit.value = false
  editingId.value = null
  resetForm()
  dialogVisible.value = true
}

const openEdit = (row: Coupon) => {
  isEdit.value = true
  editingId.value = row.id
  form.title = row.title
  form.code = row.code
  form.discount_amount = row.discount_amount
  form.min_spend = row.min_spend
  form.stock = row.stock
  form.claimed = row.claimed
  form.status = row.status
  form.valid_from = row.valid_from ?? ''
  form.valid_to = row.valid_to ?? ''
  dialogVisible.value = true
}

const save = async () => {
  if (!form.title.trim() || !form.code.trim()) {
    ElMessage.warning('请填写券名称和券码')
    return
  }

  saving.value = true
  try {
    if (isEdit.value && editingId.value) {
      await updateCouponApi(editingId.value, form)
      ElMessage.success('优惠券已更新')
    } else {
      await createCouponApi(form)
      ElMessage.success('优惠券已创建')
    }
    dialogVisible.value = false
    await load()
  } finally {
    saving.value = false
  }
}

const toggleStatus = async (row: Coupon) => {
  const nextStatus: Coupon['status'] = row.status === 'active' ? 'expired' : 'active'
  await updateCouponApi(row.id, {
    title: row.title,
    code: row.code,
    discount_amount: row.discount_amount,
    min_spend: row.min_spend,
    stock: row.stock,
    claimed: row.claimed,
    status: nextStatus,
    valid_from: row.valid_from,
    valid_to: row.valid_to
  })
  ElMessage.success('状态已更新')
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
