import {
  Bell,
  DataAnalysis,
  Discount,
  Goods,
  List,
  Setting,
  ShoppingCart,
  User,
  UserFilled
} from '@element-plus/icons-vue'
import type { Component } from 'vue'

export interface NavItem {
  label: string
  path: string
  icon: Component
  permission?: string
}

export const NAV_ITEMS: NavItem[] = [
  { label: '运营概览', path: '/app/overview', icon: DataAnalysis, permission: 'overview.read' },
  { label: '分类管理', path: '/app/categories', icon: List, permission: 'categories.read' },
  { label: '商品管理', path: '/app/products', icon: Goods, permission: 'products.read' },
  { label: '订单管理', path: '/app/orders', icon: ShoppingCart, permission: 'orders.read' },
  { label: '用户管理', path: '/app/users', icon: User, permission: 'users.read' },
  { label: '管理员管理', path: '/app/managers', icon: UserFilled, permission: 'managers.read' },
  { label: '营销管理', path: '/app/coupons', icon: Discount, permission: 'coupons.read' },
  { label: '公告管理', path: '/app/notices', icon: Bell, permission: 'notices.read' },
  { label: '系统设置', path: '/app/settings', icon: Setting, permission: 'settings.read' }
]
