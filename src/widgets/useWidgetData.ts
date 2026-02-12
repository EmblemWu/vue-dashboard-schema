import { computed } from 'vue'
import { useDashboardStore } from '@/store/dashboard'
import type { WidgetSchema } from '@/renderer/schema'

export const useWidgetData = (widget: WidgetSchema) => {
  const store = useDashboardStore()

  const state = computed(() => {
    if (!widget.datasource) {
      return undefined
    }
    return store.datasourceStore[widget.datasource]
  })

  const data = computed(() => state.value?.data)

  return {
    state,
    data
  }
}
