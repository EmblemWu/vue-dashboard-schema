<template>
  <el-card>
    <template #header>收藏看板</template>

    <el-empty v-if="rows.length === 0" description="暂无收藏模板" />

    <el-table v-else :data="rows" data-testid="favorites-list">
      <el-table-column prop="key" label="Key" width="220" />
      <el-table-column prop="title" label="标题" min-width="240" />
      <el-table-column prop="description" label="描述" min-width="280" />
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="scope">
          <el-space>
            <el-button size="small" @click="unfavorite(scope.row.key)">移除</el-button>
            <el-button size="small" type="primary" @click="goDetail(scope.row.key)">详情</el-button>
            <el-button size="small" type="success" @click="goScreen(scope.row.key)">预览</el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFavoritesStore } from '@/features/favorites/store'
import { useDashboardStore } from '@/store/dashboard'

const router = useRouter()
const store = useDashboardStore()
const favorites = useFavoritesStore()

onMounted(() => {
  void store.loadCatalog()
})

const rows = computed(() => {
  const keys = new Set(favorites.favorites)
  return store.catalog.filter((item) => keys.has(item.key))
})

const unfavorite = (key: string) => favorites.toggleFavorite(key)
const goDetail = (key: string) => void router.push(`/app/dashboards/${key}`)
const goScreen = (key: string) => void router.push(`/screen/${key}`)
</script>
