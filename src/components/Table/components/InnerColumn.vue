<script lang="tsx">
import { BasicColumn } from '../types/table'
import type { Slots } from 'vue'
import MultiColumn from './MultiTableHeader.vue'
import { ElTableColumn } from 'element-plus'
import { renderHeader, renderCell, CI, CellRenderParams, renderExpandCell, ExpandCellParams } from './renderCell'
import { pick } from 'lodash-es'

export default defineComponent({
  name: 'InnerColumn',
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
    const columnData = computed(() => props.column)
    const tableColumnSlots = (record: BasicColumn) => {
      const defaultSlots = {
        header: ({ column, $index }: CI) =>
          renderHeader({ column: Object.assign(column, record), $index }, props.slots),
        default: ({ row, column, $index }: CellRenderParams) =>
          renderCell({ row, column: Object.assign(column, record), $index }, props.slots)
      }
      let params: Recordable = {}
      if (['selection', 'index', 'expand'].includes(record?.type as string)) {
        const { slots } = record
        if (slots && slots.headerSlot) {
          if (props.slots[slots.headerSlot]) {
            Object.assign(params, pick(defaultSlots, ['header']))
          }
        }

        if (slots && slots.cellSlot) {
          if (props.slots[slots.cellSlot]) {
            if (record.type === 'expand') {
              params.default = (params: ExpandCellParams) => renderExpandCell(params, props.slots, props.column)
            } else {
              Object.assign(params, pick(defaultSlots, ['default']))
            }
          }
        }
      } else {
        Object.assign(params, defaultSlots)
      }
      return params
    }
    const renderDom = (record: BasicColumn) => {
      // 多级表头
      if (record.isMulti) {
        return <MultiColumn column={record} slots={props.slots}></MultiColumn>
      } else {
        return <ElTableColumn {...record} v-slots={{ ...tableColumnSlots(record) }}></ElTableColumn>
      }
    }
    return () => renderDom(columnData.value)
  }
})
</script>

<style lang="scss" scoped>
.custom-cell-title {
  display: inline-flex;
  align-items: center;
}
</style>
