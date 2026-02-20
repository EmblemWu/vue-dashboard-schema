import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/app/overview'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/LoginPage.vue')
  },
  {
    path: '/app',
    component: () => import('@/app/layout/AppShell.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/app/overview' },
      {
        path: 'overview',
        name: 'overview',
        component: () => import('@/pages/admin/OverviewPage.vue')
      },
      {
        path: 'categories',
        name: 'categories',
        component: () => import('@/pages/admin/CategoriesPage.vue')
      },
      {
        path: 'products',
        name: 'products',
        component: () => import('@/pages/admin/ProductsPage.vue')
      },
      { path: 'orders', name: 'orders', component: () => import('@/pages/admin/OrdersPage.vue') },
      { path: 'users', name: 'users', component: () => import('@/pages/admin/UsersPage.vue') },
      {
        path: 'coupons',
        name: 'coupons',
        component: () => import('@/pages/admin/CouponsPage.vue')
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/pages/admin/SettingsPage.vue')
      }
    ]
  },
  {
    path: '/screen/:schemaKey',
    name: 'screen',
    meta: { requiresAuth: true },
    component: () => import('@/pages/ScreenPage.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue')
  }
]
