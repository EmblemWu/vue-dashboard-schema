import { Bell, Connection, DataAnalysis, Grid, Monitor, Star } from '@element-plus/icons-vue'
import type { Component } from 'vue'

export interface NavItem {
  label: string
  path: string
  icon: Component
}

export const NAV_ITEMS: NavItem[] = [
  { label: '运营概览', path: '/app/overview', icon: Monitor },
  { label: '看板中心', path: '/app/dashboards', icon: Grid },
  { label: '指标分析', path: '/app/analysis', icon: DataAnalysis },
  { label: '数据源管理', path: '/app/datasources', icon: Connection },
  { label: '告警中心', path: '/app/alerts', icon: Bell },
  { label: '我的收藏', path: '/app/favorites', icon: Star }
]
