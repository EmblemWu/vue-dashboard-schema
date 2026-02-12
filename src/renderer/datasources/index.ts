import { reactive } from 'vue'
import { requestHttpDatasource } from '@/renderer/datasources/http'
import { mockGenerators } from '@/renderer/datasources/mock'
import type { DashboardSchema, DatasourceConfig } from '@/renderer/schema'

export interface DatasourceRuntimeRecord {
  data: unknown
  error: string | null
  loading: boolean
  lastSuccessAt: number | null
  stale: boolean
}

interface DatasourceState {
  config: DatasourceConfig
  intervalMs: number
  nextAt: number
  inflight: Promise<void> | null
}

const DEFAULT_INTERVAL = 3000

export const datasourceStore = reactive<Record<string, DatasourceRuntimeRecord>>({})

const states = new Map<string, DatasourceState>()

const ensureRecord = (key: string) => {
  if (!datasourceStore[key]) {
    datasourceStore[key] = {
      data: null,
      error: null,
      loading: false,
      lastSuccessAt: null,
      stale: false
    }
  }
  return datasourceStore[key]
}

export const configureDatasourceRuntime = (
  schema: DashboardSchema,
  widgetIntervals: Record<string, number>
) => {
  states.clear()

  Object.entries(schema.datasources).forEach(([key, config]) => {
    const fromWidget = widgetIntervals[key]
    const base = config.intervalMs ?? DEFAULT_INTERVAL
    const intervalMs = fromWidget ? Math.min(fromWidget, base) : base

    states.set(key, {
      config,
      intervalMs,
      nextAt: 0,
      inflight: null
    })

    ensureRecord(key)
  })
}

const loadSource = async (key: string, state: DatasourceState) => {
  const record = ensureRecord(key)
  if (state.inflight) {
    return state.inflight
  }

  record.loading = true

  state.inflight = (async () => {
    try {
      let payload: unknown

      if (state.config.type === 'mock') {
        const generator = mockGenerators[state.config.generator]
        if (!generator) {
          throw new Error(`Unknown mock generator: ${state.config.generator}`)
        }
        payload = generator()
      } else {
        payload = await requestHttpDatasource(state.config)
      }

      record.data = payload
      record.error = null
      record.lastSuccessAt = Date.now()
      record.stale = false
    } catch (error) {
      record.error = error instanceof Error ? error.message : 'Unknown datasource error'
      record.stale = record.lastSuccessAt !== null
    } finally {
      record.loading = false
      state.inflight = null
    }
  })()

  return state.inflight
}

export const fetchDueDatasources = async (now: number, throttleFactor: number) => {
  const jobs: Promise<void>[] = []

  states.forEach((state, key) => {
    if (now < state.nextAt) {
      return
    }

    state.nextAt = now + state.intervalMs * throttleFactor
    jobs.push(loadSource(key, state))
  })

  await Promise.allSettled(jobs)
}

export const forceRefreshAllDatasources = async () => {
  const jobs: Promise<void>[] = []

  states.forEach((state, key) => {
    state.nextAt = Date.now() + state.intervalMs
    jobs.push(loadSource(key, state))
  })

  await Promise.allSettled(jobs)
}

export const resetDatasourceRuntime = () => {
  states.clear()
  Object.keys(datasourceStore).forEach((key) => {
    delete datasourceStore[key]
  })
}
