import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/app/overview'
  },
  {
    path: '/app',
    component: () => import('@/app/layout/AppShell.vue'),
    children: [
      {
        path: '',
        redirect: '/app/overview'
      },
      {
        path: 'overview',
        name: 'overview',
        component: () => import('@/pages/admin/OverviewPage.vue')
      },
      {
        path: 'dashboards',
        name: 'dashboards',
        component: () => import('@/pages/admin/DashboardCenterPage.vue')
      },
      {
        path: 'dashboards/:schemaKey',
        name: 'dashboard-detail',
        component: () => import('@/pages/admin/DashboardDetailPage.vue')
      },
      {
        path: 'analysis',
        name: 'analysis',
        component: () => import('@/pages/admin/AnalysisPage.vue')
      },
      {
        path: 'datasources',
        name: 'datasources',
        component: () => import('@/pages/admin/DatasourcesPage.vue')
      },
      {
        path: 'alerts',
        name: 'alerts',
        component: () => import('@/pages/admin/AlertsPage.vue')
      },
      {
        path: 'favorites',
        name: 'favorites',
        component: () => import('@/pages/admin/FavoritesAdminPage.vue')
      }
    ]
  },
  {
    path: '/screen/:schemaKey',
    name: 'screen',
    component: () => import('@/pages/ScreenPage.vue')
  },
  {
    path: '/templates',
    redirect: '/app/dashboards'
  },
  {
    path: '/templates/:schemaKey',
    redirect: (to) => `/app/dashboards/${String(to.params.schemaKey ?? '')}`
  },
  {
    path: '/favorites',
    redirect: '/app/favorites'
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue')
  }
]
