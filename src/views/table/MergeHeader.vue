<template>
  <div class="p-4">
    <BasicTable @register="registerTable" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { BasicTable, useTable, BasicColumn } from '@/components/index'
import { getMergeHeaderColumns } from './tableData'

import { demoListApi } from '@/api/demo/table'

interface SpanMethodProps {
  row: Recordable
  column: BasicColumn
  rowIndex: number
  columnIndex: number
}
export default defineComponent({
  components: { BasicTable },
  setup() {
    const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: SpanMethodProps) => {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    }
    const arraySpanMethod = ({ row, column, rowIndex, columnIndex }: SpanMethodProps) => {
      if (rowIndex % 2 === 0) {
        if (columnIndex === 0) {
          return [1, 2]
        } else if (columnIndex === 1) {
          return [0, 0]
        }
      }
    }
    const [registerTable] = useTable({
      title: '合并单元格',
      border: true,
      stripe: true,
      api: demoListApi,
      columns: getMergeHeaderColumns(),
      spanMethod: arraySpanMethod
      // objectSpanMethod
    })

    return {
      registerTable
    }
  }
})
</script>
