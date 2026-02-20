<template>
  <el-card>
    <template #header>
      <div class="header-row">
        <span>用户管理</span>
        <el-space>
          <el-input
            v-model="keyword"
            clearable
            placeholder="搜索昵称/手机号"
            style="width: 260px"
          />
          <el-button @click="load">刷新</el-button>
          <el-button type="primary" @click="openCreate">新建用户</el-button>
        </el-space>
      </div>
    </template>

    <el-table v-loading="loading" :data="filteredRows">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="nickname" label="昵称" width="140" />
      <el-table-column prop="phone" label="手机号" width="140" />
      <el-table-column prop="level" label="会员等级" width="120" />
      <el-table-column prop="total_spent" label="累计消费" width="120" />
      <el-table-column prop="order_count" label="订单数" width="100" />
      <el-table-column label="状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">{{
            scope.row.status === 'active' ? '启用' : '禁用'
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="scope">
          <el-space>
            <el-button size="small" @click="openEdit(scope.row)">编辑</el-button>
            <el-button size="small" @click="toggleStatus(scope.row)">{{
              scope.row.status === 'active' ? '禁用' : '启用'
            }}</el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑用户' : '新建用户'" width="520px">
    <el-form :model="form" label-width="100px">
      <el-form-item label="昵称"><el-input v-model="form.nickname" /></el-form-item>
      <el-form-item label="手机号"><el-input v-model="form.phone" /></el-form-item>
      <el-form-item label="会员等级"><el-input v-model="form.level" /></el-form-item>
      <el-form-item label="累计消费"><el-input v-model="form.total_spent" /></el-form-item>
      <el-form-item label="订单数"
        ><el-input-number v-model="form.order_count" :min="0" style="width: 100%"
      /></el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.status" style="width: 100%">
          <el-option label="启用" value="active" />
          <el-option label="禁用" value="disabled" />
        </el-select>
      </el-form-item>
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
  createCustomerApi,
  fetchCustomersApi,
  updateCustomerApi,
  type Customer,
  type CustomerPayload
} from '@/api/mall'

const rows = ref<Customer[]>([])
const loading = ref(false)
const saving = ref(false)
const keyword = ref('')
const dialogVisible = ref(false)
const isEdit = ref(false)
const editingId = ref<number | null>(null)

const form = reactive<CustomerPayload>({
  nickname: '',
  phone: '',
  level: '普通会员',
  total_spent: '0',
  order_count: 0,
  status: 'active'
})

const filteredRows = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  if (!q) {
    return rows.value
  }
  return rows.value.filter(
    (item) => item.nickname.toLowerCase().includes(q) || item.phone.includes(q)
  )
})

const load = async () => {
  loading.value = true
  try {
    rows.value = await fetchCustomersApi()
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.nickname = ''
  form.phone = ''
  form.level = '普通会员'
  form.total_spent = '0'
  form.order_count = 0
  form.status = 'active'
}

const openCreate = () => {
  isEdit.value = false
  editingId.value = null
  resetForm()
  dialogVisible.value = true
}

const openEdit = (row: Customer) => {
  isEdit.value = true
  editingId.value = row.id
  form.nickname = row.nickname
  form.phone = row.phone
  form.level = row.level
  form.total_spent = row.total_spent
  form.order_count = row.order_count
  form.status = row.status
  dialogVisible.value = true
}

const save = async () => {
  if (!form.nickname.trim() || !form.phone.trim()) {
    ElMessage.warning('请填写昵称与手机号')
    return
  }

  saving.value = true
  try {
    if (isEdit.value && editingId.value) {
      await updateCustomerApi(editingId.value, form)
      ElMessage.success('用户已更新')
    } else {
      await createCustomerApi(form)
      ElMessage.success('用户已创建')
    }
    dialogVisible.value = false
    await load()
  } finally {
    saving.value = false
  }
}

const toggleStatus = async (row: Customer) => {
  await updateCustomerApi(row.id, {
    nickname: row.nickname,
    phone: row.phone,
    level: row.level,
    total_spent: row.total_spent,
    order_count: row.order_count,
    status: row.status === 'active' ? 'disabled' : 'active'
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
