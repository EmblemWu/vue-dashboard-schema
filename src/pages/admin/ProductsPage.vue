<template>
  <el-card>
    <template #header>
      <div class="header-row">
        <span>商品管理</span>
        <el-space>
          <el-input v-model="keyword" clearable placeholder="搜索商品" style="width: 220px" />
          <el-select v-model="statusFilter" clearable placeholder="状态筛选" style="width: 140px">
            <el-option label="草稿" value="draft" />
            <el-option label="上架" value="on_sale" />
            <el-option label="下架" value="off_sale" />
          </el-select>
          <el-button @click="load">刷新</el-button>
          <el-button type="primary" @click="openCreate">新建商品</el-button>
        </el-space>
      </div>
    </template>

    <el-table v-loading="loading" :data="filteredRows">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="商品名称" min-width="220" />
      <el-table-column prop="category_name" label="分类" width="140" />
      <el-table-column prop="price" label="价格" width="120" />
      <el-table-column prop="stock" label="库存" width="100" />
      <el-table-column prop="sales" label="销量" width="100" />
      <el-table-column label="状态" width="120">
        <template #default="scope">
          <el-tag :type="tagType(scope.row.status)">{{ statusLabel(scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280" fixed="right">
        <template #default="scope">
          <el-space>
            <el-button size="small" @click="openEdit(scope.row)">编辑</el-button>
            <el-button size="small" @click="toggleStatus(scope.row)">{{
              scope.row.status === 'on_sale' ? '下架' : '上架'
            }}</el-button>
            <el-button size="small" type="danger" @click="remove(scope.row)">删除</el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑商品' : '新建商品'" width="520px">
    <el-form :model="form" label-width="100px">
      <el-form-item label="商品名称">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="form.category" style="width: 100%">
          <el-option
            v-for="item in categories"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model="form.price" />
      </el-form-item>
      <el-form-item label="库存">
        <el-input-number v-model="form.stock" :min="0" style="width: 100%" />
      </el-form-item>
      <el-form-item label="销量">
        <el-input-number v-model="form.sales" :min="0" style="width: 100%" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.status" style="width: 100%">
          <el-option label="草稿" value="draft" />
          <el-option label="上架" value="on_sale" />
          <el-option label="下架" value="off_sale" />
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
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  createProductApi,
  deleteProductApi,
  fetchCategoriesApi,
  fetchProductsApi,
  updateProductApi,
  type Category,
  type Product,
  type ProductPayload
} from '@/api/mall'

const rows = ref<Product[]>([])
const categories = ref<Category[]>([])
const loading = ref(false)
const saving = ref(false)
const keyword = ref('')
const statusFilter = ref<Product['status'] | ''>('')
const dialogVisible = ref(false)
const isEdit = ref(false)
const editingId = ref<number | null>(null)

const form = reactive<ProductPayload>({
  title: '',
  category: 0,
  price: '0',
  stock: 0,
  sales: 0,
  status: 'draft',
  cover_url: ''
})

const labelMap: Record<Product['status'], string> = {
  draft: '草稿',
  on_sale: '上架',
  off_sale: '下架'
}

const statusLabel = (status: Product['status']) => labelMap[status]
const tagType = (status: Product['status']) => (status === 'on_sale' ? 'success' : 'warning')

const filteredRows = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  return rows.value.filter((item) => {
    const keywordOk = !q || item.title.toLowerCase().includes(q)
    const statusOk = !statusFilter.value || item.status === statusFilter.value
    return keywordOk && statusOk
  })
})

const load = async () => {
  loading.value = true
  try {
    const [productRows, categoryRows] = await Promise.all([
      fetchProductsApi(),
      fetchCategoriesApi()
    ])
    rows.value = productRows
    categories.value = categoryRows
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.title = ''
  form.category = categories.value[0]?.id ?? 0
  form.price = '0'
  form.stock = 0
  form.sales = 0
  form.status = 'draft'
  form.cover_url = ''
}

const openCreate = () => {
  isEdit.value = false
  editingId.value = null
  resetForm()
  dialogVisible.value = true
}

const openEdit = (row: Product) => {
  isEdit.value = true
  editingId.value = row.id
  form.title = row.title
  form.category = row.category
  form.price = row.price
  form.stock = row.stock
  form.sales = row.sales
  form.status = row.status
  form.cover_url = row.cover_url ?? ''
  dialogVisible.value = true
}

const save = async () => {
  if (!form.title.trim()) {
    ElMessage.warning('请填写商品名称')
    return
  }
  if (!form.category) {
    ElMessage.warning('请选择分类')
    return
  }

  saving.value = true
  try {
    if (isEdit.value && editingId.value) {
      await updateProductApi(editingId.value, form)
      ElMessage.success('商品已更新')
    } else {
      await createProductApi(form)
      ElMessage.success('商品已创建')
    }
    dialogVisible.value = false
    await load()
  } finally {
    saving.value = false
  }
}

const toggleStatus = async (row: Product) => {
  const nextStatus: Product['status'] = row.status === 'on_sale' ? 'off_sale' : 'on_sale'
  await updateProductApi(row.id, {
    title: row.title,
    category: row.category,
    price: row.price,
    stock: row.stock,
    sales: row.sales,
    status: nextStatus,
    cover_url: row.cover_url ?? ''
  })
  ElMessage.success(nextStatus === 'on_sale' ? '商品已上架' : '商品已下架')
  await load()
}

const remove = async (row: Product) => {
  await ElMessageBox.confirm(`确认删除商品「${row.title}」吗？`, '删除确认', {
    type: 'warning'
  })
  await deleteProductApi(row.id)
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
