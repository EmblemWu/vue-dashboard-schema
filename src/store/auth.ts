import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginApi, meApi, permissionsApi, type CurrentUser } from '@/api/auth'
import { tokenStorage } from '@/lib/http'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<CurrentUser | null>(null)
  const permissions = ref<string[]>([])
  const ready = ref(false)

  const isAuthed = () => !!tokenStorage.get()

  const login = async (username: string, password: string) => {
    const data = await loginApi(username, password)
    tokenStorage.set(data.access)
    user.value = await meApi()
    permissions.value = await permissionsApi()
  }

  const bootstrap = async () => {
    if (!isAuthed()) {
      ready.value = true
      return
    }

    try {
      user.value = await meApi()
      permissions.value = await permissionsApi()
    } catch {
      tokenStorage.clear()
      user.value = null
      permissions.value = []
    } finally {
      ready.value = true
    }
  }

  const logout = () => {
    tokenStorage.clear()
    user.value = null
    permissions.value = []
  }

  const can = (code?: string) => {
    if (!code) {
      return true
    }
    return permissions.value.includes(code)
  }

  return { user, permissions, ready, isAuthed, login, bootstrap, logout, can }
})
