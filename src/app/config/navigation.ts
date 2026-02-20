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
}

export const NAV_ITEMS: NavItem[] = [
  { label: '运营概览', path: '/app/overview', icon: DataAnalysis },
  { label: '分类管理', path: '/app/categories', icon: List },
  { label: '商品管理', path: '/app/products', icon: Goods },
  { label: '订单管理', path: '/app/orders', icon: ShoppingCart },
  { label: '用户管理', path: '/app/users', icon: User },
  { label: '管理员管理', path: '/app/managers', icon: UserFilled },
  { label: '营销管理', path: '/app/coupons', icon: Discount },
  { label: '公告管理', path: '/app/notices', icon: Bell },
  { label: '系统设置', path: '/app/settings', icon: Setting }
]
