import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'screen',
    component: () => import('@/pages/ScreenPage.vue')
  },
  {
    path: '/gallery',
    name: 'gallery',
    component: () => import('@/pages/SchemaGallery.vue')
  }
]
