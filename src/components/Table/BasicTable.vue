<template>
  <div ref="wrapRef" :class="['custom-wrapper', getWrapperClass]">
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

    <el-table ref="tableRef" v-bind="getBindValues" v-show="getEmptyDataIsShowTable">
      <el-table-column v-if="innerPropsRef?.showCheckColumn" type="selection" width="55" />

      <!-- table 内部 slots -->
      <template #[item]="data" v-for="item in Object.keys(tableSlots)" :key="item">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
      <!-- column -->
      <template v-for="column in getViewColumns">
        <InnerTableColumn :column="column" :slots="slots" />
      </template>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { BasicForm, useForm } from '@/components/index'
import { baseProps } from './props'
import { omit, pick } from 'lodash-es'

import InnerTableColumn from './components/InnerColumn.vue'

import { BasicTableProps, ColumnChangeParam, InnerHandlers } from './types/table'
import { useLoading } from './hooks/useLoading'
import { useTableForm } from './hooks/useTableForm'
import { usePagination } from './hooks/usePagination'
import { useDataSource } from './hooks/useDataSource'
import { useTableHeader } from './hooks/useTableHeader'
import { createTableContext } from './hooks/useTableContext'

import { useColumns } from './hooks/useColumns'
import { useTableScroll } from './hooks/useTableScroll'

import { SizeType, TableActionType } from './types/table'

// 定义emit事件
const emit = defineEmits([
  'fetch-success',
  'fetch-error',
  'register',
  'row-click',
  'row-dbClick',
  'row-contextmenu',
  'row-mouseenter',
  'row-mouseleave',
  'edit-end',
  'edit-cancel',
  'edit-row-end',
  'edit-change',
  'expanded-rows-change',
  'change',
  'columns-change'
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
  handleTableChange: onTableChange,
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

const { getScrollRef, redoHeight } = useTableScroll(
  getProps,
  tableRef,
  getColumnsRef,
  getDataSourceRef,
  wrapRef,
  formRef
)

// 处理表单 table 参数
const { getFormProps, replaceFormSlotKey, getFormSlotKeys, handleSearchInfoChange } = useTableForm(
  getProps,
  slots,
  fetch,
  getLoading
)

const handlers: InnerHandlers = {
  onColumnsChange: (data: ColumnChangeParam[]) => {
    emit('columns-change', data)
    // support useTable
    // unref(getProps)?.onColumnsChange?.(data)
  }
}

const { getHeaderProps } = useTableHeader(getProps, slots, handlers)
console.log('slots: ', slots)
const getBindValues = computed(() => {
  const dataSource = unref(getDataSourceRef)
  let propsData: Recordable = {
    ...attrs,
    ...unref(getProps),
    scroll: unref(getScrollRef),
    loading: unref(getLoading),
    ...unref(getHeaderProps),
    tableLayout: 'fixed',
    rowKey: unref(getRowKey),
    columns: toRaw(unref(getViewColumns)),
    pagination: toRaw(unref(getPaginationInfo)),
    dataSource
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

// 动态设置props
function setProps(props: Partial<BasicTableProps>) {
  innerPropsRef.value = { ...unref(innerPropsRef), ...props }
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
  getSize: () => {
    return unref(getBindValues).size as SizeType
  }
}

createTableContext({ ...tableAction, wrapRef, getBindValues })

// 导出内部事件方法
defineExpose(tableAction)
// 注册表格
emit('register', tableAction, formActions)
</script>

<style lang="less" scoped></style>
