import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from '@/app/App.vue'
import { routes } from '@/app/router'
import { useAuthStore } from '@/store/auth'
import '@/style.css'

const app = createApp(App)
const pinia = createPinia()

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async (to) => {
  const auth = useAuthStore(pinia)
  if (!auth.ready) {
    await auth.bootstrap()
  }

  const requiresAuth = Boolean(to.meta.requiresAuth)
  if (requiresAuth && !auth.isAuthed()) {
    return '/login'
  }

  if (to.path === '/login' && auth.isAuthed()) {
    return '/app/overview'
  }

  const permission = to.meta.permission as string | undefined
  if (requiresAuth && permission && !auth.can(permission)) {
    return '/app/overview'
  }

  return true
})

app.config.errorHandler = (error, _instance, info) => {
  console.error('[GlobalError]', info, error)
}

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
