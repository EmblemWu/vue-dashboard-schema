import type { DatasourceHttpConfig } from '@/renderer/schema'

export const requestHttpDatasource = async (config: DatasourceHttpConfig) => {
  const response = await fetch(config.url, {
    method: config.method ?? 'GET',
    headers: config.headers,
    body: config.method === 'POST' ? JSON.stringify(config.body) : undefined
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return response.json()
}
