import { describe, expect, it } from 'vitest'
import { validateDashboardSchema } from '@/renderer/validate'

describe('validateDashboardSchema', () => {
  it('accepts valid schema', () => {
    const result = validateDashboardSchema({
      version: '1.1',
      id: 'x',
      title: 'demo',
      layout: { mode: 'grid' },
      datasources: {
        sourceA: { type: 'mock', generator: 'kpi-overview' }
      },
      widgets: [
        {
          id: 'w1',
          type: 'text',
          position: { x: 0, y: 0, w: 4, h: 2 }
        }
      ]
    })

    expect(result.ok).toBe(true)
  })

  it('rejects invalid schema', () => {
    const result = validateDashboardSchema({
      version: '1.1',
      id: 'x',
      title: 'demo',
      layout: { mode: 'grid' },
      datasources: {},
      widgets: []
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toContain('widgets')
    }
  })
})
