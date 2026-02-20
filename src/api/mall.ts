import { http } from '@/lib/http'

export interface Category {
  id: number
  name: string
  sort: number
  is_active: boolean
}

export interface CategoryPayload {
  name: string
  sort: number
  is_active: boolean
}

export interface Product {
  id: number
  title: string
  category: number
  category_name: string
  price: string
  stock: number
  sales: number
  status: 'draft' | 'on_sale' | 'off_sale'
  cover_url?: string
}

export interface ProductPayload {
  title: string
  category: number
  price: string
  stock: number
  sales: number
  status: Product['status']
  cover_url?: string
}

export interface OrderItem {
  id: number
  product: number
  product_title: string
  unit_price: string
  quantity: number
  amount: string
}

export interface Order {
  id: number
  order_no: string
  customer_name: string
  customer_phone: string
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'
  total_amount: string
  shipping_company: string
  tracking_no: string
  shipped_at: string | null
  items: OrderItem[]
}

export interface Customer {
  id: number
  nickname: string
  phone: string
  level: string
  total_spent: string
  order_count: number
  status: 'active' | 'disabled'
}

export interface CustomerPayload {
  nickname: string
  phone: string
  level: string
  total_spent: string
  order_count: number
  status: Customer['status']
}

export interface Coupon {
  id: number
  title: string
  code: string
  discount_amount: string
  min_spend: string
  stock: number
  claimed: number
  status: 'draft' | 'active' | 'expired'
  valid_from?: string
  valid_to?: string
}

export interface CouponPayload {
  title: string
  code: string
  discount_amount: string
  min_spend: string
  stock: number
  claimed: number
  status: Coupon['status']
  valid_from?: string
  valid_to?: string
}

export interface Notice {
  id: number
  title: string
  content: string
  status: 'draft' | 'published'
}

export interface NoticePayload {
  title: string
  content: string
  status: Notice['status']
}

export interface SiteSetting {
  id: number
  key: string
  value: string
  description: string
}

export interface SiteSettingPayload {
  key: string
  value: string
  description: string
}

export interface Manager {
  id: number
  username: string
  email: string
  is_staff: boolean
  is_superuser: boolean
  is_active: boolean
  last_login: string | null
  date_joined: string
}

export interface ManagerPayload {
  username: string
  email: string
  password?: string
  is_staff: boolean
  is_superuser: boolean
  is_active: boolean
}

export interface OverviewStats {
  product_count: number
  on_sale_count: number
  pending_orders: number
  paid_orders: number
  revenue: string
}

export const fetchOverviewApi = async () => {
  const { data } = await http.get<OverviewStats>('/dashboard/overview')
  return data
}

export const fetchCategoriesApi = async () => {
  const { data } = await http.get<Category[]>('/catalog/categories')
  return data
}

export const createCategoryApi = async (payload: CategoryPayload) => {
  const { data } = await http.post<Category>('/catalog/categories/', payload)
  return data
}

export const updateCategoryApi = async (id: number, payload: CategoryPayload) => {
  const { data } = await http.put<Category>(`/catalog/categories/${id}/`, payload)
  return data
}

export const deleteCategoryApi = async (id: number) => {
  await http.delete(`/catalog/categories/${id}/`)
}

export const fetchProductsApi = async () => {
  const { data } = await http.get<Product[]>('/catalog/products')
  return data
}

export const createProductApi = async (payload: ProductPayload) => {
  const { data } = await http.post<Product>('/catalog/products/', payload)
  return data
}

export const updateProductApi = async (id: number, payload: ProductPayload) => {
  const { data } = await http.put<Product>(`/catalog/products/${id}/`, payload)
  return data
}

export const deleteProductApi = async (id: number) => {
  await http.delete(`/catalog/products/${id}/`)
}

export const fetchOrdersApi = async () => {
  const { data } = await http.get<Order[]>('/orders/orders')
  return data
}

export const updateOrderStatusApi = async (id: number, payload: Partial<Order>) => {
  const { data } = await http.patch<Order>(`/orders/orders/${id}/`, payload)
  return data
}

export const fetchCustomersApi = async () => {
  const { data } = await http.get<Customer[]>('/common/customers')
  return data
}

export const createCustomerApi = async (payload: CustomerPayload) => {
  const { data } = await http.post<Customer>('/common/customers/', payload)
  return data
}

export const updateCustomerApi = async (id: number, payload: CustomerPayload) => {
  const { data } = await http.put<Customer>(`/common/customers/${id}/`, payload)
  return data
}

export const fetchCouponsApi = async () => {
  const { data } = await http.get<Coupon[]>('/common/coupons')
  return data
}

export const createCouponApi = async (payload: CouponPayload) => {
  const { data } = await http.post<Coupon>('/common/coupons/', payload)
  return data
}

export const updateCouponApi = async (id: number, payload: CouponPayload) => {
  const { data } = await http.put<Coupon>(`/common/coupons/${id}/`, payload)
  return data
}

export const fetchNoticesApi = async () => {
  const { data } = await http.get<Notice[]>('/common/notices')
  return data
}

export const createNoticeApi = async (payload: NoticePayload) => {
  const { data } = await http.post<Notice>('/common/notices/', payload)
  return data
}

export const updateNoticeApi = async (id: number, payload: NoticePayload) => {
  const { data } = await http.put<Notice>(`/common/notices/${id}/`, payload)
  return data
}

export const fetchSettingsApi = async () => {
  const { data } = await http.get<SiteSetting[]>('/common/settings')
  return data
}

export const updateSettingApi = async (id: number, payload: SiteSettingPayload) => {
  const { data } = await http.put<SiteSetting>(`/common/settings/${id}/`, payload)
  return data
}

export const fetchManagersApi = async () => {
  const { data } = await http.get<Manager[]>('/auth/managers/')
  return data
}

export const createManagerApi = async (payload: ManagerPayload) => {
  const { data } = await http.post<Manager>('/auth/managers/', payload)
  return data
}

export const updateManagerApi = async (id: number, payload: ManagerPayload) => {
  const { data } = await http.put<Manager>(`/auth/managers/${id}/`, payload)
  return data
}

export const resetManagerPasswordApi = async (id: number, password: string) => {
  const { data } = await http.post<{ detail: string }>(`/auth/managers/${id}/reset_password/`, {
    password
  })
  return data
}
