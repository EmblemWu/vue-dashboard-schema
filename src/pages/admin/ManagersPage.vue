<template>
  <el-card>
    <template #header>
      <div class="header-row">
        <span>管理员管理</span>
        <el-space>
          <el-input
            v-model="keyword"
            clearable
            placeholder="搜索用户名/邮箱"
            style="width: 260px"
          />
          <el-button @click="load">刷新</el-button>
          <el-button type="primary" @click="openCreate">新建管理员</el-button>
        </el-space>
      </div>
    </template>

    <el-table v-loading="loading" :data="filteredRows">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" min-width="140" />
      <el-table-column prop="email" label="邮箱" min-width="220" />
      <el-table-column label="角色" width="120">
        <template #default="scope">
          <el-tag :type="scope.row.is_superuser ? 'danger' : 'primary'">
            {{ scope.row.is_superuser ? '超级管理员' : '运营管理员' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.is_active ? 'success' : 'info'">
            {{ scope.row.is_active ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="最后登录" min-width="170">
        <template #default="scope">
          {{ formatDate(scope.row.last_login) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280" fixed="right">
        <template #default="scope">
          <el-space>
            <el-button size="small" @click="openEdit(scope.row)">编辑</el-button>
            <el-button size="small" @click="toggleStatus(scope.row)">
              {{ scope.row.is_active ? '停用' : '启用' }}
            </el-button>
            <el-button size="small" type="warning" @click="openResetPassword(scope.row)">
              重置密码
            </el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑管理员' : '新建管理员'" width="560px">
    <el-form :model="form" label-width="100px">
      <el-form-item label="用户名"><el-input v-model="form.username" /></el-form-item>
      <el-form-item label="邮箱"><el-input v-model="form.email" /></el-form-item>
      <el-form-item :label="isEdit ? '新密码(可选)' : '登录密码'">
        <el-input v-model="form.password" show-password type="password" />
      </el-form-item>
      <el-form-item label="管理员类型">
        <el-select v-model="form.is_superuser" style="width: 100%">
          <el-option :value="false" label="运营管理员" />
          <el-option :value="true" label="超级管理员" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.is_active" style="width: 100%">
          <el-option :value="true" label="启用" />
          <el-option :value="false" label="停用" />
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
  createManagerApi,
  fetchManagersApi,
  resetManagerPasswordApi,
  updateManagerApi,
  type Manager,
  type ManagerPayload
} from '@/api/mall'

const rows = ref<Manager[]>([])
const loading = ref(false)
const saving = ref(false)
const keyword = ref('')
const dialogVisible = ref(false)
const isEdit = ref(false)
const editingId = ref<number | null>(null)

const form = reactive<ManagerPayload>({
  username: '',
  email: '',
  password: '',
  is_staff: true,
  is_superuser: false,
  is_active: true
})

const filteredRows = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  if (!q) {
    return rows.value
  }
  return rows.value.filter(
    (item) => item.username.toLowerCase().includes(q) || item.email.toLowerCase().includes(q)
  )
})

const formatDate = (value: string | null) => {
  if (!value) {
    return '--'
  }
  return new Date(value).toLocaleString('zh-CN', { hour12: false })
}

const load = async () => {
  loading.value = true
  try {
    rows.value = await fetchManagersApi()
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.username = ''
  form.email = ''
  form.password = ''
  form.is_staff = true
  form.is_superuser = false
  form.is_active = true
}

const openCreate = () => {
  isEdit.value = false
  editingId.value = null
  resetForm()
  dialogVisible.value = true
}

const openEdit = (row: Manager) => {
  isEdit.value = true
  editingId.value = row.id
  form.username = row.username
  form.email = row.email
  form.password = ''
  form.is_staff = true
  form.is_superuser = row.is_superuser
  form.is_active = row.is_active
  dialogVisible.value = true
}

const save = async () => {
  if (!form.username.trim()) {
    ElMessage.warning('请填写用户名')
    return
  }

  if (!isEdit.value && !form.password?.trim()) {
    ElMessage.warning('请填写初始密码')
    return
  }

  saving.value = true
  try {
    const payload: ManagerPayload = {
      username: form.username.trim(),
      email: form.email.trim(),
      is_staff: true,
      is_superuser: form.is_superuser,
      is_active: form.is_active
    }

    if (form.password?.trim()) {
      payload.password = form.password.trim()
    }

    if (isEdit.value && editingId.value) {
      await updateManagerApi(editingId.value, payload)
      ElMessage.success('管理员已更新')
    } else {
      await createManagerApi(payload)
      ElMessage.success('管理员已创建')
    }
    dialogVisible.value = false
    await load()
  } finally {
    saving.value = false
  }
}

const toggleStatus = async (row: Manager) => {
  await updateManagerApi(row.id, {
    username: row.username,
    email: row.email,
    is_staff: true,
    is_superuser: row.is_superuser,
    is_active: !row.is_active
  })
  ElMessage.success('状态已更新')
  await load()
}

const openResetPassword = async (row: Manager) => {
  const newPassword = window.prompt(`请输入 ${row.username} 的新密码（至少6位）`, 'admin123')
  if (!newPassword) {
    return
  }
  if (newPassword.length < 6) {
    ElMessage.warning('密码长度至少 6 位')
    return
  }

  await resetManagerPasswordApi(row.id, newPassword)
  ElMessage.success('密码已重置')
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
