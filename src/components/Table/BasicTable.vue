<template>
  <div ref="wrapRef" :class="['custom-wrapper', getWrapperClass]">
    <BasicForm ref="formRef"> </BasicForm>
  </div>
</template>

<script lang="ts" setup>
import BasicForm from '@/components/Form/BasicForm.vue'
import { baseProps } from './props'
import { BasicTableProps } from './types/table'

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

// 表格数据
const tableData = ref<Recordable[]>([])

// 获取所有的props
const getProps = computed(() => {
  return { ...props, ...unref(innerPropsRef) } as BasicTableProps
})
const getBindValues = computed(() => {
  const dataSource = unref(getDataSourceRef)
  let propsData: Recordable = {
    ...attrs,
    customRow,
    ...unref(getProps),
    ...unref(getHeaderProps),
    scroll: unref(getScrollRef),
    loading: unref(getLoading),
    tableLayout: 'fixed',
    rowSelection: unref(getRowSelectionRef),
    rowKey: unref(getRowKey),
    columns: toRaw(unref(getViewColumns)),
    pagination: toRaw(unref(getPaginationInfo)),
    dataSource,
    footer: unref(getFooterProps),
    ...unref(getExpandOption)
  }
  // if (slots.expandedRowRender) {
  //   propsData = omit(propsData, 'scroll');
  // }

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
</script>

<style lang="less" scoped></style>
