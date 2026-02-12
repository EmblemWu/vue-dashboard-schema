<template>
  <div class="text-widget">
    <h2>{{ headline }}</h2>
    <p>{{ note }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { WidgetSchema } from '@/renderer/schema'
import { useWidgetData } from '@/widgets/useWidgetData'

const props = defineProps<{ widget: WidgetSchema }>()
const { data } = useWidgetData(props.widget)

const headline = computed(
  () =>
    (data.value as { headline?: string } | undefined)?.headline ||
    (props.widget.props?.text as string | undefined) ||
    'Schema Text Widget'
)

const note = computed(
  () =>
    (data.value as { note?: string } | undefined)?.note ||
    (props.widget.props?.subText as string | undefined) ||
    '通过 schema 配置文本内容与数据绑定。'
)
</script>

<style scoped>
.text-widget {
  height: 100%;
  display: grid;
  align-content: center;
  gap: 10px;
}

.text-widget h2,
.text-widget p {
  margin: 0;
}

.text-widget h2 {
  font-size: 30px;
}

.text-widget p {
  color: var(--text-muted);
}
</style>
