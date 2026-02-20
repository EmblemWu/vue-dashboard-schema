<template>
  <el-card>
    <template #header>
      <div class="header-row">
        <span>商品管理</span>
        <el-button type="primary" @click="load">刷新</el-button>
      </div>
    </template>

    <el-table v-loading="loading" :data="rows">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="商品名称" min-width="220" />
      <el-table-column prop="category_name" label="分类" width="140" />
      <el-table-column prop="price" label="价格" width="120" />
      <el-table-column prop="stock" label="库存" width="120" />
      <el-table-column prop="sales" label="销量" width="120" />
      <el-table-column label="状态" width="120">
        <template #default="scope">
          <el-tag :type="tagType(scope.row.status)">
            {{ statusLabel(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchProductsApi, type Product } from '@/api/mall'

const rows = ref<Product[]>([])
const loading = ref(false)

const labelMap: Record<Product['status'], string> = {
  draft: '草稿',
  on_sale: '上架',
  off_sale: '下架'
}

const statusLabel = (status: Product['status']) => labelMap[status]
const tagType = (status: Product['status']) => (status === 'on_sale' ? 'success' : 'warning')

const load = async () => {
  loading.value = true
  try {
    rows.value = await fetchProductsApi()
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
