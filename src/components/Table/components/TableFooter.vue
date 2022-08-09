<template>
  <ElTable
    v-if="summaryFunc || summaryData"
    :showHeader="false"
    :border="false"
    :pagination="false"
    :data="getDataSource"
    :rowKey="(r) => r[rowKey]"
    :columns="getColumns"
    tableLayout="fixed"
    :scroll="scroll"
  >
    <template v-for="columns in getColumns">
      <el-table-column v-bind="columns">
        <template v-if="columns?.customRender" #default="scope">
          {{ columns?.customRender(scope) }}
        </template>
      </el-table-column>
    </template>
  </ElTable>
</template>
<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent, unref, computed, toRaw } from 'vue'
import { ElTable } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { isFunction } from '@/components/utils/is'
import type { BasicColumn } from '../types/table'
import { INDEX_COLUMN_FLAG } from '../constant'
import { useTableContext } from '../hooks/useTableContext'

const SUMMARY_ROW_KEY = '_row'
const SUMMARY_INDEX_KEY = '_index'
export default defineComponent({
  name: 'BasicTableFooter',
  components: { ElTable },
  props: {
    summaryFunc: {
      type: Function as PropType<Fn>
    },
    summaryData: {
      type: Array as PropType<Recordable[]>
    },
    scroll: {
      type: Object as PropType<Recordable>
    },
    rowKey: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const table = useTableContext()

    const getDataSource = computed((): Recordable[] => {
      const { summaryFunc, summaryData } = props
      if (summaryData?.length) {
        summaryData.forEach((item, i) => (item[props.rowKey] = `${i}`))
        return summaryData
      }
      if (!isFunction(summaryFunc)) {
        return []
      }
      let dataSource = toRaw(unref(table.getDataSource()))
      dataSource = summaryFunc(dataSource)
      dataSource.forEach((item: Recordable, i: number) => {
        item[props.rowKey] = `${i}`
      })
      return dataSource
    })

    const getColumns = computed(() => {
      const dataSource = unref(getDataSource)
      const columns: BasicColumn[] = cloneDeep(table.getColumns())
      const index = columns.findIndex((item: Recordable) => item.flag === INDEX_COLUMN_FLAG)
      const hasRowSummary = dataSource.some((item) => Reflect.has(item, SUMMARY_ROW_KEY))
      const hasIndexSummary = dataSource.some((item) => Reflect.has(item, SUMMARY_INDEX_KEY))

      if (index !== -1) {
        if (hasIndexSummary) {
          columns[index].customRender = ({ record }: Recordable) => record[SUMMARY_INDEX_KEY]
          columns[index].showOverflowTooltip = false
        } else {
          Reflect.deleteProperty(columns[index], 'customRender')
        }
      }

      if (table.getRowSelection() && hasRowSummary) {
        const isFixed = columns.some((col) => col.fixed === 'left')
        columns.unshift({
          width: 60,
          title: 'selection',
          key: 'selectionKey',
          align: 'center',
          ...(isFixed ? { fixed: 'left' } : {}),
          customRender: ({ record }) => record[SUMMARY_ROW_KEY]
        })
      }
      return columns
    })
    return { getColumns, getDataSource }
  }
})
</script>
