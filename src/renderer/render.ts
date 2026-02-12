import { computed, defineComponent, h } from 'vue'
import type { Component } from 'vue'
import type { DashboardSchema, WidgetSchema, WidgetType } from '@/renderer/schema'
import BarWidget from '@/widgets/BarWidget.vue'
import LineWidget from '@/widgets/LineWidget.vue'
import NumberCardWidget from '@/widgets/NumberCardWidget.vue'
import PieWidget from '@/widgets/PieWidget.vue'
import TableWidget from '@/widgets/TableWidget.vue'
import TextWidget from '@/widgets/TextWidget.vue'
import WidgetShell from '@/widgets/WidgetShell.vue'

const widgetMap: Record<WidgetType, Component> = {
  text: TextWidget,
  'number-card': NumberCardWidget,
  line: LineWidget,
  bar: BarWidget,
  pie: PieWidget,
  table: TableWidget
}

const gridStyle = (schema: DashboardSchema, widget: WidgetSchema) => {
  const columns = schema.layout.columns ?? 24
  const gap = schema.layout.gap ?? 12
  const rowHeight = schema.layout.rowHeight ?? 72

  return {
    gridColumn: `${widget.position.x + 1} / span ${Math.min(columns, widget.position.w)}`,
    gridRow: `${widget.position.y + 1} / span ${widget.position.h}`,
    minHeight: `${widget.position.h * rowHeight + (widget.position.h - 1) * gap}px`
  }
}

const absoluteStyle = (schema: DashboardSchema, widget: WidgetSchema) => {
  const widthBase = schema.layout.baseWidth ?? 1920
  const heightBase = schema.layout.baseHeight ?? 1080
  return {
    left: `${(widget.position.x / widthBase) * 100}%`,
    top: `${(widget.position.y / heightBase) * 100}%`,
    width: `${(widget.position.w / widthBase) * 100}%`,
    height: `${(widget.position.h / heightBase) * 100}%`
  }
}

export const SchemaRenderer = defineComponent({
  name: 'SchemaRenderer',
  props: {
    schema: {
      type: Object as () => DashboardSchema,
      required: true
    }
  },
  setup(props) {
    const containerStyle = computed(() => {
      const layout = props.schema.layout
      if (layout.mode === 'grid') {
        return {
          display: 'grid',
          gridTemplateColumns: `repeat(${layout.columns ?? 24}, minmax(0, 1fr))`,
          gridAutoRows: `${layout.rowHeight ?? 72}px`,
          gap: `${layout.gap ?? 12}px`
        }
      }

      return {
        position: 'relative'
      }
    })

    return () =>
      h(
        'section',
        {
          class: ['schema-renderer', `schema-renderer--${props.schema.layout.mode}`],
          style: containerStyle.value
        },
        props.schema.widgets.map((widget) => {
          const widgetStyle =
            props.schema.layout.mode === 'grid'
              ? gridStyle(props.schema, widget)
              : absoluteStyle(props.schema, widget)

          const component = widgetMap[widget.type]

          return h(
            WidgetShell,
            {
              key: widget.id,
              widget,
              style: widgetStyle
            },
            {
              default: () => h(component, { widget })
            }
          )
        })
      )
  }
})
