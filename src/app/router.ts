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
        component: () => import('@/pages/admin/OverviewPage.vue'),
        meta: { permission: 'overview.read' }
      },
      {
        path: 'categories',
        name: 'categories',
        component: () => import('@/pages/admin/CategoriesPage.vue'),
        meta: { permission: 'categories.read' }
      },
      {
        path: 'products',
        name: 'products',
        component: () => import('@/pages/admin/ProductsPage.vue'),
        meta: { permission: 'products.read' }
      },
      {
        path: 'orders',
        name: 'orders',
        component: () => import('@/pages/admin/OrdersPage.vue'),
        meta: { permission: 'orders.read' }
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/pages/admin/UsersPage.vue'),
        meta: { permission: 'users.read' }
      },
      {
        path: 'managers',
        name: 'managers',
        component: () => import('@/pages/admin/ManagersPage.vue'),
        meta: { permission: 'managers.read' }
      },
      {
        path: 'coupons',
        name: 'coupons',
        component: () => import('@/pages/admin/CouponsPage.vue'),
        meta: { permission: 'coupons.read' }
      },
      {
        path: 'notices',
        name: 'notices',
        component: () => import('@/pages/admin/NoticesPage.vue'),
        meta: { permission: 'notices.read' }
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/pages/admin/SettingsPage.vue'),
        meta: { permission: 'settings.read' }
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
