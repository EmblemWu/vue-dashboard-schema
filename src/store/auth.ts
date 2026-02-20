import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginApi, meApi, type CurrentUser } from '@/api/auth'
import { tokenStorage } from '@/lib/http'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<CurrentUser | null>(null)
  const ready = ref(false)

  const isAuthed = () => !!tokenStorage.get()

  const login = async (username: string, password: string) => {
    const data = await loginApi(username, password)
    tokenStorage.set(data.access)
    user.value = await meApi()
  }

  const bootstrap = async () => {
    if (!isAuthed()) {
      ready.value = true
      return
    }

    try {
      user.value = await meApi()
    } catch {
      tokenStorage.clear()
      user.value = null
    } finally {
      ready.value = true
    }
  }

  const logout = () => {
    tokenStorage.clear()
    user.value = null
  }

  return { user, ready, isAuthed, login, bootstrap, logout }
})
