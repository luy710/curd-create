<script lang="tsx">
import { BasicColumn } from '../types/table'
import { PropType, Slots } from 'vue'
import { ElTableColumn } from 'element-plus'
import { renderHeader, renderCell, CI, CellRenderParams } from './renderCell'

export default defineComponent({
  name: 'MultiColumn',
  props: {
    column: {
      type: Object as PropType<BasicColumn>,
      required: true
    },
    slots: {
      type: Object as PropType<Slots>,
      default: null
    }
  },
  setup(props) {
    const renderItem = (record: Partial<BasicColumn>) => {
      const child = (record.children || record.columns || []) as Partial<BasicColumn>[]
      if (child.length) {
        return (
          <ElTableColumn
            {...record}
            v-slots={{
              header: ({ column, $index }: CI) =>
                renderHeader({ column: Object.assign(column, record), $index }, props.slots)
            }}
          >
            {child.map((item) => renderItem(item))}
          </ElTableColumn>
        )
      }
      return (
        <ElTableColumn
          {...record}
          v-slots={{
            header: ({ column, $index }: CI) =>
              renderHeader({ column: Object.assign(column, record), $index }, props.slots),
            default: ({ row, column, $index }: CellRenderParams) =>
              renderCell({ row, column: Object.assign(column, record), $index }, props.slots)
          }}
        ></ElTableColumn>
      )
    }
    return () => renderItem(props.column)
  }
})
</script>
