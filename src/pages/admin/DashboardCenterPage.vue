<template>
  <el-card>
    <template #header>
      <div class="header-row">
        <span>看板模板中心</span>
        <el-input
          v-model="keyword"
          placeholder="搜索模板 key/title"
          clearable
          style="width: 280px"
        />
      </div>
    </template>

    <el-alert
      v-if="Object.keys(store.schemaErrorMap).length > 0"
      title="部分模板校验失败，已自动忽略"
      type="warning"
      show-icon
      :closable="false"
      class="mb12"
    />

    <el-skeleton v-if="store.catalogLoading" :rows="6" animated />

    <el-empty v-else-if="store.catalog.length === 0" description="暂无模板数据" />

    <el-table v-else :data="filteredRows" data-testid="templates-list">
      <el-table-column prop="key" label="Key" width="220" />
      <el-table-column prop="title" label="标题" min-width="240" />
      <el-table-column prop="description" label="描述" min-width="280" />
      <el-table-column prop="version" label="版本" width="100" />
      <el-table-column prop="widgetCount" label="组件数" width="100" />
      <el-table-column label="操作" width="280" fixed="right">
        <template #default="scope">
          <el-space>
            <el-button size="small" @click="toggleFavorite(scope.row.key)">
              {{ favorites.isFavorite(scope.row.key) ? '取消收藏' : '收藏' }}
            </el-button>
            <el-button size="small" type="primary" @click="goDetail(scope.row.key)">详情</el-button>
            <el-button size="small" type="success" @click="goScreen(scope.row.key)">预览</el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFavoritesStore } from '@/features/favorites/store'
import { useDashboardStore } from '@/store/dashboard'

const store = useDashboardStore()
const favorites = useFavoritesStore()
const router = useRouter()
const keyword = ref('')

onMounted(() => {
  void store.loadCatalog()
})

const filteredRows = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  if (!q) {
    return store.catalog
  }

  return store.catalog.filter(
    (item) => item.key.toLowerCase().includes(q) || item.title.toLowerCase().includes(q)
  )
})

const toggleFavorite = (key: string) => favorites.toggleFavorite(key)
const goDetail = (key: string) => void router.push(`/app/dashboards/${key}`)
const goScreen = (key: string) => void router.push(`/screen/${key}`)
</script>

<style scoped>
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mb12 {
  margin-bottom: 12px;
}
</style>
