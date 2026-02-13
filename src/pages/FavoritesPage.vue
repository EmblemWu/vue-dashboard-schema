<template>
  <main class="page">
    <header class="page__header">
      <h1>收藏管理</h1>
      <RouterLink to="/templates">返回模板列表</RouterLink>
    </header>

    <EmptyState
      v-if="favoriteItems.length === 0"
      title="暂无收藏"
      description="在模板列表或详情页添加收藏后会显示在这里"
    />

    <section v-else class="grid" data-testid="favorites-list">
      <article v-for="item in favoriteItems" :key="item.key" class="card">
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
        <div class="card__actions">
          <Button @click="favorites.toggleFavorite(item.key)">移除收藏</Button>
          <RouterLink :to="`/templates/${item.key}`">查看详情</RouterLink>
          <RouterLink :to="`/screen/${item.key}`">打开大屏</RouterLink>
        </div>
      </article>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useFavoritesStore } from '@/features/favorites/store'
import { useDashboardStore } from '@/store/dashboard'
import Button from '@/ui/Button.vue'
import EmptyState from '@/ui/EmptyState.vue'

const store = useDashboardStore()
const favorites = useFavoritesStore()

onMounted(() => {
  void store.loadCatalog()
})

const favoriteItems = computed(() => {
  const keys = new Set(favorites.favorites)
  return store.catalog.filter((item) => keys.has(item.key))
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

.page__header a,
.card__actions a {
  color: #8fe6ff;
  text-decoration: none;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
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
.card p {
  margin: 0;
}

.card p {
  color: var(--text-muted);
}

.card__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
