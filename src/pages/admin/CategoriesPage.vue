<template>
  <el-card>
    <template #header>
      <div class="header-row">
        <span>分类管理</span>
        <el-button type="primary" @click="load">刷新</el-button>
      </div>
    </template>

    <el-table v-loading="loading" :data="rows">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="分类名" min-width="220" />
      <el-table-column prop="sort" label="排序" width="120" />
      <el-table-column label="状态" width="120">
        <template #default="scope">
          <el-tag :type="scope.row.is_active ? 'success' : 'info'">{{
            scope.row.is_active ? '启用' : '停用'
          }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchCategoriesApi, type Category } from '@/api/mall'

const rows = ref<Category[]>([])
const loading = ref(false)

const load = async () => {
  loading.value = true
  try {
    rows.value = await fetchCategoriesApi()
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
