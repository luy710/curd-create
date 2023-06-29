<script lang="ts" setup>
import { omit } from 'lodash-es'
import { ElTable, ElTableColumn } from 'element-plus'
import { baseProps } from './props'
import InnerTableColumn from './components/InnerTableColumn.vue'
import TablePagination from './components/Pagination.vue'
import type {
  BasicTableProps,
  ColumnChangeParam,
  InnerHandlers,
  SizeType,
  SorterResult,
  TableActionType,
} from './types/table'
import { useLoading } from './hooks/useLoading'
import { useTableForm } from './hooks/useTableForm'
import { usePagination } from './hooks/usePagination'
import { useDataSource } from './hooks/useDataSource'
import { useTableHeader } from './hooks/useTableHeader'
import { createTableContext } from './hooks/useTableContext'
import { useColumns } from './hooks/useColumns'
import { useTableHeight } from './hooks/useTableHeight'
import { isBoolean, isFunction, isString } from '@/components/utils/is'
import { BasicForm, useForm } from '@/components/index'

// 基础props
const props = defineProps(baseProps)
// 定义emit事件
const emit = defineEmits([
  'fetchSuccess',
  'fetchError',
  'register',
  'editEnd',
  'editCancel',
  'editRowEnd',
  'editChange',
  'columnsChange',
  'change',
  'sortChange',
  'filterChange',
])
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
const { getPaginationInfo, getPagination, setPagination, setShowPagination, getShowPagination }
  = usePagination(getProps)
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
  updateTableData,
} = useDataSource(
  getProps,
  {
    tableData,
    getPaginationInfo,
    setLoading,
    setPagination,
    getFieldsValue: formActions.getFieldsValue,
    clearSelectedRowKeys: () => tableRef.value.clearSelection(),
  },
  emit as EmitType,
)
const {
  getViewColumns,
  getColumns,
  setCacheColumnsByField,
  setColumns,
  getColumnsRef,
  getCacheColumns,
  getExpandColumnProps,
  getInndexColumnProps,
  getSelectColumnProps,
} = useColumns(getProps)
const { getTableHeightRef, redoHeight } = useTableHeight(getProps, tableRef, wrapRef, formRef, getPaginationInfo)
// 处理表单 table 参数
const { getFormProps, replaceFormSlotKey, getFormSlotKeys, handleSearchInfoChange } = useTableForm(
  getProps,
  slots,
  fetch,
  getLoading,
)
const getBindValues = computed<any>(() => {
  const dataSource = unref(getDataSourceRef)
  let propsData: Partial<BasicTableProps> = {
    ...attrs,
    ...unref(getProps),
    height: unref(getTableHeightRef) as number | string,
    loading: unref(getLoading),
    tableLayout: 'fixed',
    rowKey: unref(getRowKey),
    columns: toRaw(unref(getViewColumns)),
    pagination: toRaw(unref(getPaginationInfo)),
    data: dataSource,
  }
  propsData = omit(propsData, ['class', 'onChange', 'loading'])
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
      [`${prefixCls}--inset`]: values.inset,
    },
  ]
})
// 空数据 显示效果xian
const getEmptyDataIsShowTable = computed(() => {
  const { emptyDataIsShowTable, useSearchForm } = unref(getProps)
  if (emptyDataIsShowTable || !useSearchForm)
    return true

  return !!unref(getDataSourceRef).length
})
const handlers: InnerHandlers = {
  onColumnsChange: (data: ColumnChangeParam[]) => {
    emit('columnsChange', data)
    // support useTable
    unref(getProps)?.onColumnsChange?.(data)
  },
}
const { getHeaderProps, getHeaderSlots } = useTableHeader(getProps, slots, handlers)

// 动态设置props
function setProps(props: Partial<BasicTableProps>) {
  innerPropsRef.value = { ...unref(innerPropsRef), ...props }
}
function filterChange(filter: Recordable) {
  const { onFilterChange } = unref(getProps)
  handleFilterChange(filter)
  onFilterChange && isFunction(onFilterChange) && onFilterChange(filter as Recordable)
}
function sortChange(sort: SorterResult) {
  const { onSortChange } = unref(getProps)
  handleSortChange(sort)
  onSortChange && isFunction(onSortChange) && onSortChange(sort as SorterResult)
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
  emit: emit as EmitType,
  updateTableData,
  setShowPagination,
  getShowPagination,
  setCacheColumnsByField,
  getPaginationRef: getPagination,
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
  handleClearFilters: (columnKeys?: string[]) => handleClearFilters(columnKeys),
  // 展开所有
  expandAll: () => {
    getDataSource().forEach((row) => {
      tableRef.value.toggleRowExpansion(row, true)
    })
  },
  // 收起所有
  collapseAll: () => {
    getDataSource().forEach((row) => {
      tableRef.value.toggleRowExpansion(row, false)
    })
  },
  // 获取所有选中行的row-key
  getSelectRowKeys: (): (string | number)[] => {
    const key = unref(getRowKey)
    return (tableRef.value.getSelectionRows() as Recordable[]).map((item: Recordable) => {
      if (isString(key))
        return item[key]

      if (isFunction(key))
        return key(item)

      return null
    })
  },
  // 根据rowkey设置选中
  setSelectedRowKeys: (keys: (string | number)[]) => {
    const key = unref(getRowKey)
    getDataSource().forEach((row: Recordable) => {
      if (isString(key))
        keys.includes(row[key]) && tableRef.value.toggleRowSelection(row, true)

      if (isFunction(key))
        keys.includes(key(row)) && tableRef.value.toggleRowSelection(row, true)
    })
  },
}
createTableContext({ ...tableAction, wrapRef, getBindValues })
// 导出内部事件方法
defineExpose(tableAction)
// 注册表格
emit('register', tableAction, formActions)
</script>

<template>
  <div ref="wrapRef" :class="getWrapperClass">
    <BasicForm
      v-if="getBindValues.useSearchForm"
      ref="formRef"
      submit-on-reset
      v-bind="getFormProps as any"
      :table-action="tableAction"
      @register="registerForm"
      @submit="handleSearchInfoChange"
      @advanced-change="redoHeight"
    >
      <template v-for="item in getFormSlotKeys" #[replaceFormSlotKey(item)]="data">
        <slot :name="item" v-bind="data || {}" />
      </template>
    </BasicForm>

    <component :is="getHeaderProps.title">
      <template v-for="item in getHeaderSlots" #[item]>
        <slot :name="item" />
      </template>
    </component>

    <ElTable
      v-show="getEmptyDataIsShowTable"
      ref="tableRef"
      :loading="getLoading"
      v-bind="getBindValues"
      @filterChange="filterChange"
      @sortChange="sortChange"
    >
      <template v-for="item in ['append', 'empty']" #[item]="data" :key="item">
        <slot :name="item" v-bind="data || {}" />
      </template>
      <ElTableColumn v-if="getProps?.showExpandColumn" type="expand" v-bind="getExpandColumnProps">
        <template #header="props">
          <slot :name="getExpandColumnProps.slots?.headerSlot || 'expandedRowHender'" v-bind="props" />
        </template>
        <template #default="props">
          <slot :name="getExpandColumnProps.slots?.cellSlot || 'expandedRowRender'" v-bind="props" />
        </template>
      </ElTableColumn>
      <ElTableColumn v-if="getProps?.showSelectionColumn" type="selection" v-bind="getSelectColumnProps" />
      <ElTableColumn
        v-if="getProps?.showIndexColumn && !getProps.isTreeTable"
        type="index"
        v-bind="getInndexColumnProps"
      />

      <!-- column -->
      <InnerTableColumn :columns="getViewColumns" :slots="$slots" />
    </ElTable>
    <TablePagination
      v-if="!!getPaginationInfo"
      v-bind="isBoolean(getPaginationInfo) ? {} : getPaginationInfo"
      @change="(pagination:any) => handlePaginationChange(pagination)"
    />
  </div>
</template>

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

  &--inset {
    padding: 0;
  }
}
</style>
