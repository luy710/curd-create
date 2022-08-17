import type { BasicTableProps, TableActionType, FetchParams, BasicColumn } from '../types/table'
import type { PaginationProps } from 'element-plus'
import type { DynamicProps } from '#/utils'
import type { FormActionType } from '@/components/Form/types/form'
import type { WatchStopHandle } from 'vue'
import { getDynamicProps } from '@/components/utils'
import { ref, onUnmounted, unref, watch, toRaw } from 'vue'

type Props = Partial<DynamicProps<BasicTableProps>>

type UseTableMethod = TableActionType & {
  getForm: () => FormActionType
}

export function useTable(tableProps?: Props): [
  (instance: TableActionType, formInstance: UseTableMethod) => void,
  TableActionType & {
    getForm: () => FormActionType
  }
] {
  const tableRef = ref<Nullable<TableActionType>>(null)
  const loadedRef = ref<Nullable<boolean>>(false)
  const formRef = ref<Nullable<UseTableMethod>>(null)

  let stopWatch: WatchStopHandle

  function register(instance: TableActionType, formInstance: UseTableMethod) {
    onUnmounted(() => {
      tableRef.value = null
      loadedRef.value = null
    })

    if (unref(loadedRef) && instance === unref(tableRef)) return

    tableRef.value = instance
    formRef.value = formInstance
    tableProps && instance.setProps(getDynamicProps(tableProps))
    loadedRef.value = true

    stopWatch?.()

    stopWatch = watch(
      () => tableProps,
      () => {
        tableProps && instance.setProps(getDynamicProps(tableProps))
      },
      {
        immediate: true,
        deep: true
      }
    )
  }

  function getTableInstance(): TableActionType {
    const table = unref(tableRef)
    if (!table) {
      console.error(
        'The table instance has not been obtained yet, please make sure the table is presented when performing the table operation!'
      )
    }
    return table as TableActionType
  }

  const methods: UseTableMethod = {
    reload: async (opt?: FetchParams) => {
      return await getTableInstance().reload(opt)
    },
    setProps: (props: Partial<BasicTableProps>) => {
      getTableInstance().setProps(props)
    },
    redoHeight: () => {
      getTableInstance().redoHeight()
    },
    setLoading: (loading: boolean) => {
      getTableInstance().setLoading(loading)
    },
    getDataSource: () => {
      return getTableInstance().getDataSource()
    },
    getRawDataSource: () => {
      return getTableInstance().getRawDataSource()
    },
    getColumns: ({ ignoreIndex = false }: { ignoreIndex?: boolean } = {}) => {
      const columns = getTableInstance().getColumns({ ignoreIndex }) || []
      return toRaw(columns)
    },
    // @ts-ignore
    setColumns: (columns: BasicColumn[]) => {
      getTableInstance().setColumns(columns)
    },
    setTableData: (values: any[]) => {
      return getTableInstance().setTableData(values)
    },
    setPagination: (info: Partial<PaginationProps>) => {
      return getTableInstance().setPagination(info)
    },
    getPaginationRef: () => {
      return getTableInstance().getPaginationRef()
    },
    getSize: () => {
      return toRaw(getTableInstance().getSize())
    },
    updateTableData: (index: number, key: string, value: any) => {
      return getTableInstance().updateTableData(index, key, value)
    },
    deleteTableDataRecord: (rowKey: string | number | string[] | number[]) => {
      return getTableInstance().deleteTableDataRecord(rowKey)
    },
    insertTableDataRecord: (record: Recordable | Recordable[], index?: number) => {
      return getTableInstance().insertTableDataRecord(record, index)
    },
    updateTableDataRecord: (rowKey: string | number, record: Recordable) => {
      return getTableInstance().updateTableDataRecord(rowKey, record)
    },
    findTableDataRecord: (rowKey: string | number) => {
      return getTableInstance().findTableDataRecord(rowKey)
    },
    getCacheColumns: () => {
      return toRaw(getTableInstance().getCacheColumns())
    },
    getForm: () => {
      return unref(formRef) as unknown as FormActionType
    },
    setShowPagination: async (show: boolean) => {
      getTableInstance().setShowPagination(show)
    },
    getShowPagination: () => {
      return toRaw(getTableInstance().getShowPagination())
    },

    // 用于多选表格，清空用户的选择
    clearSelection: () => getTableInstance().clearSelection(),
    // 返回当前选中的行
    getSelectionRows: () => getTableInstance().getSelectionRows(),
    // 用于多选表格，切换某一行的选中状态， 如果使用了第二个参数，则可直接设置这一行选中与否
    toggleRowSelection: (row: Recordable, selected: boolean) => getTableInstance().toggleRowSelection(row, selected),
    // 用于多选表格，切换全选和全不选
    toggleAllSelection: () => getTableInstance().toggleAllSelection(),
    // 用于可扩展的表格或树表格，如果某行被扩展，则切换。 使用第二个参数，您可以直接设置该行应该被扩展或折叠。
    toggleRowExpansion: (row: Recordable, expanded: boolean) => getTableInstance().toggleRowExpansion(row, expanded),
    // 用于单选表格，设定某一行为选中行， 如果调用时不加参数，则会取消目前高亮行的选中状态。
    setCurrentRow: (row: Recordable) => getTableInstance().setCurrentRow(row),
    // 用于清空排序条件，数据会恢复成未排序的状态
    clearSort: () => {
      getTableInstance().clearSort()
      getTableInstance().handleClearSort()
    },
    // 传入由columnKey 组成的数组以清除指定列的过滤条件。 如果没有参数，清除所有过滤器
    clearFilter: (columnKeys: string[]) => {
      getTableInstance().clearFilter(columnKeys)
      getTableInstance().handleClearFilters(columnKeys)
    },
    // 对 Table 进行重新布局。 当表格可见性变化时，您可能需要调用此方法以获得正确的布局
    doLayout: () => getTableInstance().doLayout(),
    // 手动排序表格。 参数 prop 属性指定排序列，order 指定排序顺序。
    sort: (prop: string, order: string) => getTableInstance().sort(prop, order),
    // 滚动到一组特定坐标
    scrollTo: (options: ScrollToOptions | number, yCoord?: number) => getTableInstance().scrollTo(options, yCoord),
    // 设置垂直滚动位置
    setScrollTop: (top: number) => getTableInstance().setScrollTop(top),
    // 设置水平滚动位置
    setScrollLeft: (left: number) => getTableInstance().setScrollLeft(left),
    // 清除所有的sort信息并重新请求
    handleClearSort: () => getTableInstance().handleClearSort(),
    // 清除所有的过滤信息
    handleClearFilters: (columnKeys?: string[]) => getTableInstance().handleClearFilters(columnKeys),
    // 展开所有
    expandAll: () => {
      getTableInstance()
        .getDataSource()
        .forEach((row) => {
          getTableInstance().toggleRowExpansion(row, true)
        })
    },
    // 收起所有
    collapseAll: () => {
      getTableInstance()
        .getDataSource()
        .forEach((row) => {
          getTableInstance().toggleRowExpansion(row, false)
        })
    },
    // 获取所有选中行的row-key
    getSelectRowKeys: (): (string | number)[] => {
      return getTableInstance().getSelectRowKeys()
    },
    // 根据rowkey设置选中
    setSelectedRowKeys: (keys: (string | number)[]) => {
      getTableInstance().setSelectedRowKeys(keys)
    }
  }

  return [register, methods]
}
