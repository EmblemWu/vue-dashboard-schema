<template>
  <main class="page">
    <header class="page__header">
      <h1>模板详情</h1>
      <div class="links">
        <RouterLink to="/templates">返回列表</RouterLink>
        <RouterLink to="/favorites">收藏管理</RouterLink>
      </div>
    </header>

    <LoadingState v-if="store.schemaLoading" title="加载模板详情中..." />

    <ErrorState
      v-else-if="store.schemaError"
      title="模板详情加载失败"
      :description="store.schemaError"
      :on-retry="load"
    />

    <section v-else-if="store.activeSchema" class="detail" data-testid="template-detail">
      <h2>{{ store.activeSchema.title }}</h2>
      <p>{{ store.activeSchema.description || '无描述' }}</p>
      <p>
        version: {{ store.activeSchema.version }} | layout: {{ store.activeSchema.layout.mode }} |
        widgets:
        {{ store.activeSchema.widgets.length }}
      </p>
      <div class="actions">
        <Button @click="toggleFavorite">{{ favoriteLabel }}</Button>
        <RouterLink :to="`/screen/${schemaKey}`">打开大屏</RouterLink>
      </div>

      <h3>组件清单</h3>
      <ul>
        <li v-for="widget in store.activeSchema.widgets" :key="widget.id">
          {{ widget.id }} ({{ widget.type }}) -> {{ widget.datasource || 'none' }}
        </li>
      </ul>
    </section>

    <EmptyState v-else title="没有模板数据" description="请返回列表重新选择模板" />
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useFavoritesStore } from '@/features/favorites/store'
import { useDashboardStore } from '@/store/dashboard'
import Button from '@/ui/Button.vue'
import EmptyState from '@/ui/EmptyState.vue'
import ErrorState from '@/ui/ErrorState.vue'
import LoadingState from '@/ui/LoadingState.vue'

const route = useRoute()
const store = useDashboardStore()
const favorites = useFavoritesStore()

const schemaKey = computed(() => String(route.params.schemaKey || ''))

const load = async () => {
  await store.loadCatalog()
  if (schemaKey.value) {
    await store.loadSchema(schemaKey.value)
  }
}

const toggleFavorite = () => {
  if (!schemaKey.value) {
    return
  }
  favorites.toggleFavorite(schemaKey.value)
}

const favoriteLabel = computed(() =>
  favorites.isFavorite(schemaKey.value) ? '取消收藏' : '收藏模板'
)

watch(
  () => schemaKey.value,
  () => {
    void load()
  }
)

onMounted(() => {
  void load()
})
</script>

<style scoped>
.page {
  padding: 24px;
}

.page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.page__header h1 {
  margin: 0;
}

.links {
  display: flex;
  gap: 12px;
}

.links a,
.actions a {
  color: #8fe6ff;
  text-decoration: none;
}

.detail {
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  background: var(--bg-panel-soft);
}

.actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px 0 18px;
}

ul {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 6px;
}
</style>
