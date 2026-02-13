import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/templates'
  },
  {
    path: '/templates',
    name: 'templates',
    component: () => import('@/pages/TemplatesPage.vue')
  },
  {
    path: '/templates/:schemaKey',
    name: 'template-detail',
    component: () => import('@/pages/TemplateDetailPage.vue')
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: () => import('@/pages/FavoritesPage.vue')
  },
  {
    path: '/screen/:schemaKey',
    name: 'screen',
    component: () => import('@/pages/ScreenPage.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue')
  }
]
