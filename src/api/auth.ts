import { http } from '@/lib/http'

export interface LoginResponse {
  access: string
  refresh: string
}

export interface CurrentUser {
  id: number
  username: string
  is_staff: boolean
  is_superuser: boolean
}

export interface PermissionResponse {
  permissions: string[]
}

export const loginApi = async (username: string, password: string) => {
  const { data } = await http.post<LoginResponse>('/auth/login', { username, password })
  return data
}

export const meApi = async () => {
  const { data } = await http.get<CurrentUser>('/auth/me')
  return data
}

export const permissionsApi = async () => {
  const { data } = await http.get<PermissionResponse>('/auth/permissions')
  return data.permissions
}
