import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from '@/app/App.vue'
import { routes } from '@/app/router'
import '@/style.css'

const app = createApp(App)
const pinia = createPinia()

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

app.config.errorHandler = (error, _instance, info) => {
  console.error('[GlobalError]', info, error)
}

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
