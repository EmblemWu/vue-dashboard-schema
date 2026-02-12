export const SCHEMA_VERSION = {
  V1: '1.0',
  V1_1: '1.1'
} as const

export type SchemaVersion = (typeof SCHEMA_VERSION)[keyof typeof SCHEMA_VERSION]

export type LayoutMode = 'grid' | 'absolute'
export type WidgetType = 'text' | 'number-card' | 'line' | 'bar' | 'pie' | 'table'

export interface LayoutConfig {
  mode: LayoutMode
  columns?: number
  rowHeight?: number
  gap?: number
  baseWidth?: number
  baseHeight?: number
}

export interface DatasourceMockConfig {
  type: 'mock'
  generator: string
  intervalMs?: number
}

export interface DatasourceHttpConfig {
  type: 'http'
  url: string
  method?: 'GET' | 'POST'
  intervalMs?: number
  headers?: Record<string, string>
  body?: unknown
}

export type DatasourceConfig = DatasourceMockConfig | DatasourceHttpConfig

export interface WidgetSchema {
  id: string
  type: WidgetType
  title?: string
  datasource?: string
  refreshIntervalMs?: number
  position: {
    x: number
    y: number
    w: number
    h: number
  }
  props?: Record<string, unknown>
}

export interface DashboardSchema {
  version: SchemaVersion
  id: string
  title: string
  description?: string
  layout: LayoutConfig
  datasources: Record<string, DatasourceConfig>
  widgets: WidgetSchema[]
}
