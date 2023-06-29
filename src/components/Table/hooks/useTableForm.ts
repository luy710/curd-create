import type { ComputedRef, Slots } from 'vue'
import type { BasicTableProps, FetchParams } from '../types/table'
import type { FormProps } from '@/components/Form/types/form'
import { isFunction } from '@/components/utils/is'

export function useTableForm(
  propsRef: ComputedRef<BasicTableProps>,
  slots: Slots,
  fetch: (opt?: FetchParams | undefined) => Promise<void>,
  getLoading: ComputedRef<boolean | undefined>,
) {
  // 获取表单相关配置
  const getFormProps = computed<FormProps>(() => {
    const { formConfig } = unref(propsRef)
    const { submitButtonOptions } = formConfig || {}
    return {
      showAdvancedButton: true,
      ...formConfig,
      submitButtonOptions: { loading: unref(getLoading), ...submitButtonOptions },
      compact: true,
    }
  })
  // 获取所有表单相关的插槽， form- 都是属于表单的
  const getFormSlotKeys: ComputedRef<string[]> = computed(() => {
    const keys = Object.keys(slots)
    return keys.map(item => (item.startsWith('form-') ? item : null)).filter(item => !!item) as string[]
  })
  // 绑定的时候需要移除form-
  function replaceFormSlotKey(key: string) {
    if (!key)
      return ''
    return key?.replace?.(/form\-/, '') ?? ''
  }
  // 查询
  function handleSearchInfoChange(info: Recordable) {
    const { handleSearchInfoFn } = unref(propsRef)
    if (handleSearchInfoFn && isFunction(handleSearchInfoFn))
      info = handleSearchInfoFn(info) || info

    fetch({ searchInfo: info, page: 1 })
  }

  return {
    getFormProps,
    replaceFormSlotKey,
    getFormSlotKeys,
    handleSearchInfoChange,
  }
}
