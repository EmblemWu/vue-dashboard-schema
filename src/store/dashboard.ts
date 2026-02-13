import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import {
  configureDatasourceRuntime,
  datasourceStore,
  resetDatasourceRuntime
} from '@/renderer/datasources'
import type { DashboardSchema } from '@/renderer/schema'
import { dashboardScheduler } from '@/renderer/scheduler'
import {
  loadTemplateByKey,
  loadTemplateCatalog,
  type TemplateCatalogItem
} from '@/features/templates/schema-repository'

export type ThrottleMode = 'normal' | 'x5' | 'x10'

const throttleMap: Record<ThrottleMode, number> = {
  normal: 1,
  x5: 5,
  x10: 10
}

export const useDashboardStore = defineStore('dashboard', () => {
  const catalog = ref<TemplateCatalogItem[]>([])
  const schemaErrorMap = ref<Record<string, string>>({})
  const catalogLoading = ref(false)
  const catalogError = ref<string | null>(null)

  const currentSchemaKey = ref<string>('')
  const activeSchema = ref<DashboardSchema | null>(null)
  const schemaLoading = ref(false)
  const schemaError = ref<string | null>(null)

  const throttleMode = ref<ThrottleMode>('normal')

  const schemaKeys = computed(() => catalog.value.map((item) => item.key))
  const schedulerFactor = computed(() => throttleMap[throttleMode.value])

  const collectWidgetIntervals = (schema: DashboardSchema) => {
    const intervals: Record<string, number> = {}

    schema.widgets.forEach((widget) => {
      if (!widget.datasource || !widget.refreshIntervalMs) {
        return
      }

      const current = intervals[widget.datasource]
      intervals[widget.datasource] = current
        ? Math.min(current, widget.refreshIntervalMs)
        : widget.refreshIntervalMs
    })

    return intervals
  }

  const applySchema = (schema: DashboardSchema | null) => {
    if (!schema) {
      resetDatasourceRuntime()
      return
    }

    configureDatasourceRuntime(schema, collectWidgetIntervals(schema))
  }

  watch(
    [activeSchema, schedulerFactor],
    ([schema, factor]) => {
      applySchema(schema)
      dashboardScheduler.setThrottleFactor(factor)
    },
    { immediate: true }
  )

  const loadCatalog = async () => {
    if (catalogLoading.value) {
      return
    }

    catalogLoading.value = true
    catalogError.value = null
    try {
      const result = await loadTemplateCatalog()
      catalog.value = result.catalog
      schemaErrorMap.value = result.invalid
      if (!currentSchemaKey.value && result.catalog.length > 0) {
        const first = result.catalog[0]
        if (first) {
          currentSchemaKey.value = first.key
        }
      }
    } catch (error) {
      catalogError.value = error instanceof Error ? error.message : '模板列表加载失败'
    } finally {
      catalogLoading.value = false
    }
  }

  const loadSchema = async (key: string) => {
    schemaLoading.value = true
    schemaError.value = null
    currentSchemaKey.value = key

    try {
      const schema = await loadTemplateByKey(key)
      if (!schema) {
        activeSchema.value = null
        schemaError.value = `模板不存在: ${key}`
        return
      }
      activeSchema.value = schema
    } catch (error) {
      activeSchema.value = null
      schemaError.value = error instanceof Error ? error.message : '模板加载失败'
    } finally {
      schemaLoading.value = false
    }
  }

  const setThrottleMode = (mode: ThrottleMode) => {
    throttleMode.value = mode
  }

  const startRuntime = () => {
    dashboardScheduler.start()
  }

  const stopRuntime = () => {
    dashboardScheduler.stop()
  }

  return {
    catalog,
    schemaErrorMap,
    catalogLoading,
    catalogError,
    currentSchemaKey,
    activeSchema,
    schemaLoading,
    schemaError,
    schemaKeys,
    datasourceStore,
    throttleMode,
    loadCatalog,
    loadSchema,
    setThrottleMode,
    startRuntime,
    stopRuntime
  }
})
