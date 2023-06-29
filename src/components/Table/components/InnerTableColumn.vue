<script lang="tsx">
import { ElTableColumn } from 'element-plus'
import type { PropType, Slots } from 'vue'
import type { BasicColumn } from '../types/table'
import type { CI, CellRenderParams } from './renderCell'
import { renderCell, renderHeader } from './renderCell'

export default defineComponent({
  name: 'InnerTableColumn',
  props: {
    columns: {
      type: Array as PropType<BasicColumn[]>,
      required: true,
    },
    slots: {
      type: Object as PropType<Slots>,
      default: null,
    },
  },
  setup(props) {
    const columnData = computed(() => props.columns as BasicColumn[])
    const hasChild = (column: BasicColumn): BasicColumn[] => {
      if (column.children?.length && column.columns?.length) {
        const map = new Map()
        return column.children.concat(column.columns).reduce((pre, next) => {
          if (!map.get(next.prop)) {
            map.set(next.prop, true)
            pre.push(next)
          }
          return pre
        }, [] as BasicColumn[])
      }
      return column.children || column.columns || []
    }
    const tableColumnSlots = (record: BasicColumn) => {
      const defaultSlots = {
        header: (params: CI) => {
          params.column = Object.assign(params.column, record)
          return renderHeader(params, props.slots as Slots)
        },
        default: (params: CellRenderParams) => {
          params.column = Object.assign(params.column, record)
          return renderCell(params, props.slots as Slots)
        },
      }
      if (hasChild(record) && hasChild(record).length) {
        Object.assign(defaultSlots, {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          default: () => hasChild(record).map(item => renderColumn(item)),
        })
      }
      return defaultSlots
    }
    const renderColumn = (record: BasicColumn) => {
      return <ElTableColumn {...record} v-slots={tableColumnSlots(record)} key={record.columnKey}></ElTableColumn>
    }

    return () => <>{columnData.value.map(column => renderColumn(column))}</>
  },
})
</script>
