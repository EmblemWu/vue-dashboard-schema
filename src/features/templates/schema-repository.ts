import type { DashboardSchema } from '@/renderer/schema'
import { validateDashboardSchema } from '@/renderer/validate'

export interface TemplateCatalogItem {
  key: string
  title: string
  description: string
  version: string
  widgetCount: number
}

const schemaModules = import.meta.glob('/schemas/*.json')

const pathToKey = (path: string) => path.split('/').pop()?.replace('.json', '') ?? path

const cache = new Map<string, DashboardSchema>()

/**
 * Load all schema metadata for list/detail pages.
 */
export const loadTemplateCatalog = async () => {
  const entries = Object.entries(schemaModules)
  const catalog: TemplateCatalogItem[] = []
  const invalid: Record<string, string> = {}

  await Promise.all(
    entries.map(async ([path, loader]) => {
      const key = pathToKey(path)
      try {
        const raw = await loader()
        const value = (raw as { default: unknown }).default
        const result = validateDashboardSchema(value)
        if (!result.ok) {
          invalid[key] = result.error
          return
        }

        cache.set(key, result.schema)
        catalog.push({
          key,
          title: result.schema.title,
          description: result.schema.description ?? '无描述',
          version: result.schema.version,
          widgetCount: result.schema.widgets.length
        })
      } catch (error) {
        invalid[key] = error instanceof Error ? error.message : 'Schema load failed'
      }
    })
  )

  catalog.sort((a, b) => a.key.localeCompare(b.key))
  return { catalog, invalid }
}

/**
 * Load one validated schema by key; returns null when key not found.
 */
export const loadTemplateByKey = async (key: string): Promise<DashboardSchema | null> => {
  if (cache.has(key)) {
    return cache.get(key) ?? null
  }

  const path = Object.keys(schemaModules).find((item) => pathToKey(item) === key)
  if (!path) {
    return null
  }

  const loader = schemaModules[path]
  if (!loader) {
    return null
  }
  const raw = await loader()
  const value = (raw as { default: unknown }).default
  const result = validateDashboardSchema(value)

  if (!result.ok) {
    throw new Error(result.error)
  }

  cache.set(key, result.schema)
  return result.schema
}
