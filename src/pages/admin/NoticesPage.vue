<template>
  <el-card>
    <template #header>
      <div class="header-row">
        <span>公告管理</span>
        <el-space>
          <el-input v-model="keyword" clearable placeholder="搜索公告" style="width: 240px" />
          <el-button @click="load">刷新</el-button>
          <el-button type="primary" @click="openCreate">新建公告</el-button>
        </el-space>
      </div>
    </template>

    <el-table v-loading="loading" :data="filteredRows">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="公告标题" min-width="240" />
      <el-table-column prop="content" label="公告内容" min-width="300" show-overflow-tooltip />
      <el-table-column label="状态" width="120">
        <template #default="scope">
          <el-tag :type="scope.row.status === 'published' ? 'success' : 'warning'">{{
            scope.row.status === 'published' ? '已发布' : '草稿'
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="scope">
          <el-space>
            <el-button size="small" @click="openEdit(scope.row)">编辑</el-button>
            <el-button size="small" @click="toggleStatus(scope.row)">{{
              scope.row.status === 'published' ? '下线' : '发布'
            }}</el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑公告' : '新建公告'" width="620px">
    <el-form :model="form" label-width="90px">
      <el-form-item label="标题"><el-input v-model="form.title" /></el-form-item>
      <el-form-item label="内容"
        ><el-input v-model="form.content" type="textarea" :rows="6"
      /></el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.status" style="width: 100%">
          <el-option label="草稿" value="draft" />
          <el-option label="已发布" value="published" />
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
  createNoticeApi,
  fetchNoticesApi,
  updateNoticeApi,
  type Notice,
  type NoticePayload
} from '@/api/mall'

const rows = ref<Notice[]>([])
const loading = ref(false)
const saving = ref(false)
const keyword = ref('')
const dialogVisible = ref(false)
const isEdit = ref(false)
const editingId = ref<number | null>(null)

const form = reactive<NoticePayload>({
  title: '',
  content: '',
  status: 'draft'
})

const filteredRows = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  if (!q) {
    return rows.value
  }
  return rows.value.filter(
    (item) => item.title.toLowerCase().includes(q) || item.content.toLowerCase().includes(q)
  )
})

const load = async () => {
  loading.value = true
  try {
    rows.value = await fetchNoticesApi()
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.title = ''
  form.content = ''
  form.status = 'draft'
}

const openCreate = () => {
  isEdit.value = false
  editingId.value = null
  resetForm()
  dialogVisible.value = true
}

const openEdit = (row: Notice) => {
  isEdit.value = true
  editingId.value = row.id
  form.title = row.title
  form.content = row.content
  form.status = row.status
  dialogVisible.value = true
}

const save = async () => {
  if (!form.title.trim() || !form.content.trim()) {
    ElMessage.warning('请填写标题和内容')
    return
  }

  saving.value = true
  try {
    if (isEdit.value && editingId.value) {
      await updateNoticeApi(editingId.value, form)
      ElMessage.success('公告已更新')
    } else {
      await createNoticeApi(form)
      ElMessage.success('公告已创建')
    }
    dialogVisible.value = false
    await load()
  } finally {
    saving.value = false
  }
}

const toggleStatus = async (row: Notice) => {
  const next: Notice['status'] = row.status === 'published' ? 'draft' : 'published'
  await updateNoticeApi(row.id, {
    title: row.title,
    content: row.content,
    status: next
  })
  ElMessage.success(next === 'published' ? '公告已发布' : '公告已转为草稿')
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
