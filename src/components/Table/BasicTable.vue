<template>
  <div ref="wrapRef" :class="getWrapperClass">
    <BasicForm
      v-if="getBindValues.useSearchForm"
      ref="formRef"
      submitOnReset
      v-bind="getFormProps"
      :tableAction="tableAction"
      @register="registerForm"
      @submit="handleSearchInfoChange"
      @advanced-change="redoHeight"
    >
      <template #[replaceFormSlotKey(item)]="data" v-for="item in getFormSlotKeys">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </BasicForm>

    <component :is="getHeaderProps.title">
      <template #[item] v-for="item in getHeaderSlots">
        <slot :name="item"></slot>
      </template>
    </component>

    <el-table
      ref="tableRef"
      v-loading="getBindValues.loading"
      v-bind="getBindValues"
      v-show="getEmptyDataIsShowTable"
      @filter-change="filterChange"
      @sort-change="sortChange"
    >
      <el-table-column v-if="getProps?.showCheckColumn" type="selection" width="55" />
      <el-table-column v-if="getProps?.showIndexColumn" type="index" fixed="left" label="#" width="50" />

      <!-- table 内部 slots -->
      <template #[item]="data" v-for="item in Object.keys(tableSlots)" :key="item">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
      <!-- column -->
      <template v-for="column in getViewColumns" :key="column.columnKey">
        <InnerTableColumn :column="column" :slots="slots" />
      </template>
    </el-table>
    <TablePagination
      v-if="!!getPaginationInfo"
      v-bind="isBoolean(getPaginationInfo) ? {} : getPaginationInfo"
      @change="(pagination) => handlePaginationChange(pagination)"
    />
  </div>
</template>
<script lang="ts" setup>
import { BasicForm, useForm } from '@/components/index'
import { baseProps } from './props'
import { omit, pick } from 'lodash-es'
import { isBoolean, isFunction } from '@/components/utils/is'
import InnerTableColumn from './components/InnerColumn.vue'
import TablePagination from './components/Pagination.vue'
import { BasicTableProps, ColumnChangeParam, InnerHandlers } from './types/table'
import { useLoading } from './hooks/useLoading'
import { useTableForm } from './hooks/useTableForm'
import { usePagination } from './hooks/usePagination'
import { useDataSource } from './hooks/useDataSource'
import { useTableHeader } from './hooks/useTableHeader'
import { createTableContext } from './hooks/useTableContext'
import { useColumns } from './hooks/useColumns'
import { useTableHeight } from './hooks/useTableHeight'
import { SizeType, TableActionType, SorterResult } from './types/table'
// 定义emit事件
const emit = defineEmits([
  'fetch-success',
  'fetch-error',
  'register',
  'edit-end',
  'edit-cancel',
  'edit-row-end',
  'edit-change',
  'columns-change',
  // 'select',
  // 'selectAll',
  // 'selectionChange',
  // 'cellMouseEnter',
  // 'cellMouseLeave',
  // 'cellClick',
  // 'cellDblclick',
  // 'cellContextmenu',
  // 'rowClick',
  // 'rowContextmenu',
  // 'rowDblclick',
  // 'headerClick',
  // 'headerContextmenu',
  'sortChange',
  'filterChange'
  // 'currentChange',
  // 'headerDragend',
  // 'expandChange'
])
// 基础props
const props = defineProps(baseProps)
// 额外属性
const attrs = useAttrs()
// 动态设置的props
const innerPropsRef = ref<Partial<BasicTableProps>>({})
// 设置组件指引ID
const wrapRef = ref()
const formRef = ref()
const tableRef = ref()
// 插槽
const slots = useSlots()
// table内的slot
const tableSlots = computed(() => {
  return pick(slots, ['append', 'empty'])
})
// 表格数据
const tableData = ref<Recordable[]>([])
// 获取所有的props
const getProps = computed(() => {
  return { ...props, ...unref(innerPropsRef) } as BasicTableProps
})
// 注册loading
const { getLoading, setLoading } = useLoading(getProps)
// 注册form表单
const [registerForm, formActions] = useForm()
// 注册分页器
const { getPaginationInfo, getPagination, setPagination, setShowPagination, getShowPagination } =
  usePagination(getProps)
const {
  handlePaginationChange,
  handleFilterChange,
  handleClearFilters,
  handleClearSort,
  handleSortChange,
  getDataSourceRef,
  getDataSource,
  getRawDataSource,
  setTableData,
  updateTableDataRecord,
  deleteTableDataRecord,
  insertTableDataRecord,
  findTableDataRecord,
  fetch,
  getRowKey,
  reload,
  getAutoCreateKey,
  updateTableData
} = useDataSource(
  getProps,
  {
    tableData,
    getPaginationInfo,
    setLoading,
    setPagination,
    getFieldsValue: formActions.getFieldsValue,
    clearSelectedRowKeys: () => tableRef.value.clearSelection()
  },
  emit as EmitType
)
const { getViewColumns, getColumns, setCacheColumnsByField, setColumns, getColumnsRef, getCacheColumns } =
  useColumns(getProps)
const { getTableHeightRef, redoHeight } = useTableHeight(getProps, tableRef, wrapRef, formRef, getPaginationInfo)
// 处理表单 table 参数
const { getFormProps, replaceFormSlotKey, getFormSlotKeys, handleSearchInfoChange } = useTableForm(
  getProps,
  slots,
  fetch,
  getLoading
)
const getBindValues = computed(() => {
  const dataSource = unref(getDataSourceRef)
  let propsData: Recordable = {
    ...attrs,
    ...unref(getProps),
    height: unref(getTableHeightRef),
    loading: unref(getLoading),
    tableLayout: 'fixed',
    rowKey: unref(getRowKey),
    columns: toRaw(unref(getViewColumns)),
    pagination: toRaw(unref(getPaginationInfo)),
    data: dataSource
  }
  propsData = omit(propsData, ['class', 'onChange'])
  return propsData
})

const prefixCls = 'basic-table'
const getWrapperClass = computed(() => {
  const values = unref(getBindValues)
  return [
    prefixCls,
    attrs.class,
    {
      [`${prefixCls}-form-container`]: values.useSearchForm,
      [`${prefixCls}--inset`]: values.inset
    }
  ]
})
// 空数据 显示效果xian
const getEmptyDataIsShowTable = computed(() => {
  const { emptyDataIsShowTable, useSearchForm } = unref(getProps)
  if (emptyDataIsShowTable || !useSearchForm) {
    return true
  }
  return !!unref(getDataSourceRef).length
})
const handlers: InnerHandlers = {
  onColumnsChange: (data: ColumnChangeParam[]) => {
    emit('columns-change', data)
    // support useTable
    // unref(getProps)?.onColumnsChange?.(data)
  }
}
const { getHeaderProps, getHeaderSlots } = useTableHeader(getProps, slots, handlers)

// 动态设置props
function setProps(props: Partial<BasicTableProps>) {
  innerPropsRef.value = { ...unref(innerPropsRef), ...props }
}
const filterChange = (filter: Recordable) => {
  const { onFilterChange } = unref(getProps)
  handleFilterChange(filter)
  onFilterChange && isFunction(onFilterChange) && onFilterChange.call(undefined, filter as Recordable)
}
const sortChange = (sort: SorterResult) => {
  const { onSortChange } = unref(getProps)
  handleSortChange(sort)
  onSortChange && isFunction(onSortChange) && onSortChange.call(undefined, sort as SorterResult)
}
const tableAction: TableActionType = {
  reload,
  setPagination,
  setTableData,
  updateTableDataRecord,
  deleteTableDataRecord,
  insertTableDataRecord,
  findTableDataRecord,
  redoHeight,
  setColumns,
  setLoading,
  getDataSource,
  getRawDataSource,
  setProps,
  getColumns,
  getCacheColumns,
  emit,
  updateTableData,
  setShowPagination,
  getShowPagination,
  setCacheColumnsByField,
  getPagination,
  getSize: () => {
    return unref(getBindValues).size as SizeType
  },
  // 用于多选表格，清空用户的选择
  clearSelection: () => tableRef.value.clearSelection(),
  // 返回当前选中的行
  getSelectionRows: () => tableRef.value.getSelectionRows(),
  // 用于多选表格，切换某一行的选中状态， 如果使用了第二个参数，则可直接设置这一行选中与否
  toggleRowSelection: (row: Recordable, selected: boolean) => tableRef.value.toggleRowSelection(row, selected),
  // 用于多选表格，切换全选和全不选
  toggleAllSelection: () => tableRef.value.toggleAllSelection(),
  // 用于可扩展的表格或树表格，如果某行被扩展，则切换。 使用第二个参数，您可以直接设置该行应该被扩展或折叠。
  toggleRowExpansion: (row: Recordable, expanded: boolean) => tableRef.value.toggleRowExpansion(row, expanded),
  // 用于单选表格，设定某一行为选中行， 如果调用时不加参数，则会取消目前高亮行的选中状态。
  setCurrentRow: (row: Recordable) => tableRef.value.setCurrentRow(row),
  // 用于清空排序条件，数据会恢复成未排序的状态
  clearSort: () => {
    tableRef.value.clearSort()
    handleClearSort()
  },
  // 传入由columnKey 组成的数组以清除指定列的过滤条件。 如果没有参数，清除所有过滤器
  clearFilter: (columnKeys: string[]) => {
    tableRef.value.clearFilter(columnKeys)
    handleClearFilters(columnKeys)
  },
  // 对 Table 进行重新布局。 当表格可见性变化时，您可能需要调用此方法以获得正确的布局
  doLayout: () => tableRef.value.doLayout(),
  // 手动排序表格。 参数 prop 属性指定排序列，order 指定排序顺序。
  sort: (prop: string, order: string) => tableRef.value.sort(prop, order),
  // 滚动到一组特定坐标
  scrollTo: (options: ScrollToOptions | number, yCoord?: number) => tableRef.value.scrollTo(options, yCoord),
  // 设置垂直滚动位置
  setScrollTop: (top: number) => tableRef.value.setScrollTop(top),
  // 设置水平滚动位置
  setScrollLeft: (left: number) => tableRef.value.setScrollLeft(left),
  // 清除所有的sort信息并重新请求
  handleClearSort: () => handleClearSort(),
  // 清除所有的过滤信息
  handleClearFilters: (columnKeys?: string[]) => handleClearFilters(columnKeys)
}
createTableContext({ ...tableAction, wrapRef, getBindValues })
// 导出内部事件方法
defineExpose(tableAction)
// 注册表格
emit('register', tableAction, formActions)
</script>
<style lang="scss" scoped>
.basic-table {
  padding: 8px;
  box-sizing: border-box;
  max-width: 100%;
  height: 100%;
  .basic-form {
    margin-bottom: 10px;
  }
  .el-pagination {
    margin-top: 10px;
    justify-content: right;
  }
}
</style>
