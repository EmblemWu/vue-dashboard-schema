<template>
  <main class="page">
    <header class="page__header">
      <h1>模板列表</h1>
      <div class="page__actions">
        <RouterLink to="/favorites">收藏管理</RouterLink>
      </div>
    </header>

    <LoadingState
      v-if="store.catalogLoading"
      title="加载模板中..."
      description="正在读取 schemas 配置"
    />

    <ErrorState
      v-else-if="store.catalogError"
      title="模板加载失败"
      :description="store.catalogError"
      :on-retry="load"
    />

    <EmptyState
      v-else-if="store.catalog.length === 0"
      title="没有可用模板"
      description="请在 schemas 目录添加 JSON 模板"
    />

    <section v-else class="grid" data-testid="templates-list">
      <article v-for="item in store.catalog" :key="item.key" class="card">
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
        <small
          >key: {{ item.key }} | version: {{ item.version }} | widgets:
          {{ item.widgetCount }}</small
        >
        <div class="card__actions">
          <Button @click="toggle(item.key)">{{
            fav.isFavorite(item.key) ? '取消收藏' : '收藏'
          }}</Button>
          <RouterLink :to="`/templates/${item.key}`">查看详情</RouterLink>
          <RouterLink :to="`/screen/${item.key}`">进入大屏</RouterLink>
        </div>
      </article>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useFavoritesStore } from '@/features/favorites/store'
import { useDashboardStore } from '@/store/dashboard'
import Button from '@/ui/Button.vue'
import EmptyState from '@/ui/EmptyState.vue'
import ErrorState from '@/ui/ErrorState.vue'
import LoadingState from '@/ui/LoadingState.vue'

const store = useDashboardStore()
const fav = useFavoritesStore()

const load = () => {
  void store.loadCatalog()
}

const toggle = (key: string) => {
  fav.toggleFavorite(key)
}

onMounted(load)
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

.page__actions a {
  color: var(--accent);
  text-decoration: none;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 14px;
}

.card {
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px;
  background: var(--bg-panel-soft);
  display: grid;
  gap: 10px;
}

.card h3,
.card p,
.card small {
  margin: 0;
}

.card p,
.card small {
  color: var(--text-muted);
}

.card__actions {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.card__actions a {
  color: #8fe6ff;
  text-decoration: none;
}
</style>
