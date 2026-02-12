import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import {
  configureDatasourceRuntime,
  datasourceStore,
  resetDatasourceRuntime
} from '@/renderer/datasources'
import type { DashboardSchema } from '@/renderer/schema'
import { dashboardScheduler } from '@/renderer/scheduler'
import { validateDashboardSchema } from '@/renderer/validate'

export type ThrottleMode = 'normal' | 'x5' | 'x10'

const throttleMap: Record<ThrottleMode, number> = {
  normal: 1,
  x5: 5,
  x10: 10
}

const schemaModules = import.meta.glob('/schemas/*.json', {
  eager: true,
  import: 'default'
}) as Record<string, unknown>

const normalizeKey = (path: string) => path.split('/').pop()?.replace('.json', '') ?? path

export const useDashboardStore = defineStore('dashboard', () => {
  const schemaMap = ref<Record<string, DashboardSchema>>({})
  const schemaErrorMap = ref<Record<string, string>>({})
  const currentSchemaKey = ref<string>('')
  const throttleMode = ref<ThrottleMode>('normal')

  Object.entries(schemaModules).forEach(([path, value]) => {
    const key = normalizeKey(path)
    const result = validateDashboardSchema(value)
    if (!result.ok) {
      schemaErrorMap.value[key] = result.error ?? 'invalid schema'
      return
    }
    schemaMap.value[key] = result.schema
  })

  const schemaKeys = computed(() => Object.keys(schemaMap.value))

  if (!currentSchemaKey.value && schemaKeys.value.length > 0) {
    const firstKey = schemaKeys.value[0]
    if (firstKey) {
      currentSchemaKey.value = firstKey
    }
  }

  const activeSchema = computed(() => schemaMap.value[currentSchemaKey.value])

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

  const applySchema = (schema: DashboardSchema | undefined) => {
    if (!schema) {
      resetDatasourceRuntime()
      return
    }

    const intervals = collectWidgetIntervals(schema)
    configureDatasourceRuntime(schema, intervals)
  }

  watch(
    [activeSchema, schedulerFactor],
    ([schema, factor]) => {
      applySchema(schema)
      dashboardScheduler.setThrottleFactor(factor)
    },
    {
      immediate: true
    }
  )

  const setSchema = (key: string) => {
    if (schemaMap.value[key]) {
      currentSchemaKey.value = key
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
    schemaMap,
    schemaErrorMap,
    currentSchemaKey,
    schemaKeys,
    activeSchema,
    datasourceStore,
    throttleMode,
    setSchema,
    setThrottleMode,
    startRuntime,
    stopRuntime
  }
})
