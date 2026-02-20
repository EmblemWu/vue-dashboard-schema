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
  items: OrderItem[]
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

export const updateOrderStatusApi = async (id: number, status: Order['status']) => {
  const { data } = await http.patch<Order>(`/orders/orders/${id}/`, { status })
  return data
}
