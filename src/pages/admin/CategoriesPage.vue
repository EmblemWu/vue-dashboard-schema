<template>
  <el-card>
    <template #header>
      <div class="header-row">
        <span>分类管理</span>
        <el-space>
          <el-input v-model="keyword" clearable placeholder="搜索分类" style="width: 220px" />
          <el-button @click="load">刷新</el-button>
          <el-button type="primary" @click="openCreate">新建分类</el-button>
        </el-space>
      </div>
    </template>

    <el-table v-loading="loading" :data="filteredRows">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="分类名" min-width="220" />
      <el-table-column prop="sort" label="排序" width="100" />
      <el-table-column label="状态" width="120">
        <template #default="scope">
          <el-tag :type="scope.row.is_active ? 'success' : 'info'">{{
            scope.row.is_active ? '启用' : '停用'
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="scope">
          <el-space>
            <el-button size="small" @click="openEdit(scope.row)">编辑</el-button>
            <el-button size="small" @click="toggleStatus(scope.row)">{{
              scope.row.is_active ? '停用' : '启用'
            }}</el-button>
            <el-button size="small" type="danger" @click="remove(scope.row)">删除</el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑分类' : '新建分类'" width="420px">
    <el-form :model="form" label-width="90px">
      <el-form-item label="分类名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="form.sort" :min="0" style="width: 100%" />
      </el-form-item>
      <el-form-item label="启用状态">
        <el-switch v-model="form.is_active" />
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
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  createCategoryApi,
  deleteCategoryApi,
  fetchCategoriesApi,
  updateCategoryApi,
  type Category,
  type CategoryPayload
} from '@/api/mall'

const rows = ref<Category[]>([])
const loading = ref(false)
const saving = ref(false)
const keyword = ref('')
const dialogVisible = ref(false)
const isEdit = ref(false)
const editingId = ref<number | null>(null)

const form = reactive<CategoryPayload>({
  name: '',
  sort: 0,
  is_active: true
})

const filteredRows = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  if (!q) {
    return rows.value
  }
  return rows.value.filter((item) => item.name.toLowerCase().includes(q))
})

const load = async () => {
  loading.value = true
  try {
    rows.value = await fetchCategoriesApi()
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.name = ''
  form.sort = 0
  form.is_active = true
}

const openCreate = () => {
  isEdit.value = false
  editingId.value = null
  resetForm()
  dialogVisible.value = true
}

const openEdit = (row: Category) => {
  isEdit.value = true
  editingId.value = row.id
  form.name = row.name
  form.sort = row.sort
  form.is_active = row.is_active
  dialogVisible.value = true
}

const save = async () => {
  if (!form.name.trim()) {
    ElMessage.warning('请填写分类名称')
    return
  }

  saving.value = true
  try {
    if (isEdit.value && editingId.value) {
      await updateCategoryApi(editingId.value, form)
      ElMessage.success('分类已更新')
    } else {
      await createCategoryApi(form)
      ElMessage.success('分类已创建')
    }
    dialogVisible.value = false
    await load()
  } finally {
    saving.value = false
  }
}

const toggleStatus = async (row: Category) => {
  await updateCategoryApi(row.id, {
    name: row.name,
    sort: row.sort,
    is_active: !row.is_active
  })
  ElMessage.success(row.is_active ? '已停用' : '已启用')
  await load()
}

const remove = async (row: Category) => {
  await ElMessageBox.confirm(`确认删除分类「${row.name}」吗？`, '删除确认', {
    type: 'warning'
  })
  await deleteCategoryApi(row.id)
  ElMessage.success('删除成功')
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
