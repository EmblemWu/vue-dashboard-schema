import { z } from 'zod'
import { SCHEMA_VERSION, type DashboardSchema } from '@/renderer/schema'

const positionSchema = z.object({
  x: z.number().min(0),
  y: z.number().min(0),
  w: z.number().positive(),
  h: z.number().positive()
})

const datasourceSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('mock'),
    generator: z.string().min(1),
    intervalMs: z.number().int().positive().optional()
  }),
  z.object({
    type: z.literal('http'),
    url: z.string().url(),
    method: z.enum(['GET', 'POST']).optional(),
    intervalMs: z.number().int().positive().optional(),
    headers: z.record(z.string(), z.string()).optional(),
    body: z.unknown().optional()
  })
])

const widgetSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['text', 'number-card', 'line', 'bar', 'pie', 'table']),
  title: z.string().optional(),
  datasource: z.string().optional(),
  refreshIntervalMs: z.number().int().positive().optional(),
  position: positionSchema,
  props: z.record(z.string(), z.unknown()).optional()
})

const dashboardSchema = z.object({
  version: z.enum([SCHEMA_VERSION.V1, SCHEMA_VERSION.V1_1]),
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  layout: z.object({
    mode: z.enum(['grid', 'absolute']),
    columns: z.number().int().positive().optional(),
    rowHeight: z.number().positive().optional(),
    gap: z.number().nonnegative().optional(),
    baseWidth: z.number().positive().optional(),
    baseHeight: z.number().positive().optional()
  }),
  datasources: z.record(z.string(), datasourceSchema),
  widgets: z.array(widgetSchema).min(1)
})

type SchemaValidationSuccess = {
  ok: true
  schema: DashboardSchema
}

type SchemaValidationFailure = {
  ok: false
  error: string
}

export type ValidationResult = SchemaValidationSuccess | SchemaValidationFailure

export const validateDashboardSchema = (input: unknown): ValidationResult => {
  const parsed = dashboardSchema.safeParse(input)

  if (!parsed.success) {
    const details = parsed.error.issues
      .slice(0, 3)
      .map((issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`)
      .join('; ')

    return { ok: false, error: details }
  }

  return { ok: true, schema: parsed.data as DashboardSchema }
}
