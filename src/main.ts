import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from '@/app/App.vue'
import { routes } from '@/app/router'
import '@/style.css'

const app = createApp(App)
const pinia = createPinia()

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

app.use(pinia)
app.use(router)
app.mount('#app')
