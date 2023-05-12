import type { ComputedRef, Ref } from 'vue'
import type { FormActionType, FormProps, FormSchema } from '../types/form'

// import { watchEffect, unref, nextTick } from 'vue'
interface UseAutoFocusContext {
  getSchema: ComputedRef<FormSchema[]>
  getProps: ComputedRef<FormProps>
  isInitedDefault: Ref<boolean>
  formElRef: Ref<FormActionType>
}

export default function useAutoFocus({ getSchema, getProps, formElRef, isInitedDefault }: UseAutoFocusContext) {
  watchEffect(async () => {
    // 已经初始化默认值 或者 未设置自动聚焦 则返回
    if (unref(isInitedDefault) || !unref(getProps).autoFocusFirstItem)
      return

    await nextTick()

    const schemas = unref(getSchema)
    const formEl = unref(formElRef)
    const el = (formEl as any).$el as HTMLElement

    if (!formEl || !el || !schemas || schemas.length === 0)
      return

    const firstItem = schemas[0]
    if (!firstItem.component.includes('Input'))
      return

    const InputEl = el.querySelector('.el-row:first-child input') as Nullable<HTMLInputElement>

    if (!InputEl)
      return

    InputEl?.focus()
  })
}
