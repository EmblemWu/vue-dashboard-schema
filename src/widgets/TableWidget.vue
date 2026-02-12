<template>
  <div class="table-widget">
    <table>
      <thead>
        <tr>
          <th>区域</th>
          <th>销售额</th>
          <th>转化率</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.region">
          <td>{{ row.region }}</td>
          <td>{{ row.sales }}</td>
          <td>{{ row.conversion }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { WidgetSchema } from '@/renderer/schema'
import { useWidgetData } from '@/widgets/useWidgetData'

interface Row {
  region: string
  sales: number
  conversion: string
}

const props = defineProps<{ widget: WidgetSchema }>()
const { data } = useWidgetData(props.widget)

const rows = computed<Row[]>(() => {
  const fromData = (data.value as { rows?: Row[] } | undefined)?.rows
  if (fromData && fromData.length > 0) {
    return fromData
  }

  return [
    { region: '华东', sales: 820, conversion: '5.8%' },
    { region: '华南', sales: 690, conversion: '4.9%' },
    { region: '华北', sales: 610, conversion: '4.2%' }
  ]
})
</script>

<style scoped>
.table-widget {
  height: 100%;
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid rgba(103, 160, 247, 0.2);
}

thead th {
  color: #9fc1eb;
  font-size: 12px;
}

tbody tr:hover {
  background: rgba(64, 121, 183, 0.15);
}
</style>
