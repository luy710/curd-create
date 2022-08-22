<template>
  <div class="p-4">
    <BasicTable @register="registerTable" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { BasicTable, useTable } from '@hobby/curd-create'
import { getBasicColumns } from './tableData'
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
import { demoListApi } from '@/api/demo/table'

export default defineComponent({
  components: { BasicTable },
  setup() {
    interface SummaryMethodProps<T = Recordable> {
      columns: TableColumnCtx<T>[]
      data: T[]
    }

    const getSummaries = (param: SummaryMethodProps) => {
      const { columns, data } = param
      const sums: string[] = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return
        }
        const values = data.map((item) => Number(item[column.property]))
        if (!values.every((value) => Number.isNaN(value))) {
          sums[index] = `$ ${values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!Number.isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)}`
        } else {
          sums[index] = 'N/A'
        }
      })

      return sums
    }

    const [registerTable] = useTable({
      title: '表尾行合计示例',
      api: demoListApi,
      columns: getBasicColumns(),
      showSummary: true,
      border: true,
      stripe: true,
      summaryMethod: getSummaries,
      canResize: true,
      pagination: true,
      indexColumnProps: {
        width: 120
      }
    })

    return {
      registerTable
    }
  }
})
</script>
