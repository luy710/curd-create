import type { ComputedRef, Ref } from 'vue'
import type { FormProps, FormSchema, FormActionType } from '../types/form'
import { isArray, isFunction, isObject, isString, isDef, isNullOrUnDef, isNumber } from '@/components/utils/is'
import type { FormItemProp } from 'element-plus'
import { cloneDeep, uniqBy, get, merge } from 'lodash-es'
import { dateUtil } from '@/components/utils/dateUtil'
import { dateItemType } from '../helper'

interface UseFormActionContext {
  emit: (event: 'submit' | 'reset' | 'advanced-change' | 'register' | 'field-value-change', ...args: any[]) => void
  getProps: ComputedRef<FormProps>
  getSchema: ComputedRef<FormSchema[]>
  formModel: Recordable
  defaultValueRef: Ref<Recordable>
  formElRef: Ref<FormActionType>
  schemaRef: Ref<FormSchema[]>
  handleFormValues: Fn
}

export default function useFormEvents({
  emit,
  getProps,
  formModel,
  getSchema,
  defaultValueRef,
  formElRef,
  schemaRef,
  handleFormValues
}: UseFormActionContext) {
  // 异步重置表单数据
  async function resetFields(): Promise<void> {
    // 获取重置回调函数以及重置之后是否立即触发submit
    const { resetFunc, submitOnReset } = unref(getProps)

    if (resetFunc && isFunction(resetFunc)) {
      await resetFunc()
    }

    const formEl = unref(formElRef)
    if (!formEl) return
    // 重置之后恢复默认值
    Object.keys(formModel).forEach((key) => {
      const schema = unref(getSchema).find((item) => item.field === key)
      const isInput = schema?.component && schema.component.includes('Input')

      const defaultValue = cloneDeep(unref(defaultValueRef)[key])

      formModel[key] = isInput ? defaultValue || '' : defaultValue
    })
    // 清除表单错误信息
    nextTick(() => clearValidate())

    // 执行reset 并将表单数据导出
    emit('reset', toRaw(formModel))

    // 如果需要重置提交
    submitOnReset && handleSubmit()
  }

  // 异步设置表单的某个参数的数据
  const setFieldsValue = async (values: Recordable): Promise<void> => {
    // 获取所有的key
    const fields = unref(getSchema)
      .map((item) => item.field)
      .filter(Boolean)
    // key 支持 a.b.c的写法
    const delimiter = '.'
    const nestKeyArray = fields.filter((item) => item.indexOf(delimiter) >= 0)
    // 需要验证的key
    const validKeys: string[] = []

    Object.keys(values).forEach((key) => {
      const schema = unref(getSchema).find((item) => item.field === key)
      let value = values[key]
      // 判断有没有key, 因为可以设置a.b.c
      const hasKey = Reflect.has(values, key)

      value = schema?.component.includes('Input') ? (value && isNumber(value) ? `${value}` : value) : value

      if (hasKey && fields.includes(key)) {
        // 事件类型
        if (itemIsDateType(key)) {
          if (isArray(value)) {
            const arr = []
            for (const item of value) {
              arr.push(item ? dateUtil(item) : null)
            }
            formModel[key] = arr
          } else {
            const { componentProps } = schema || {}
            let _props = componentProps as any
            if (typeof _props === 'function') {
              _props = _props({ formModel })
            }
            formModel[key] = value ? (_props?.valueFormat ? value : dateUtil(value)) : null
          }
        } else {
          formModel[key] = value
        }
        validKeys.push(key)
      } else {
        nestKeyArray.forEach((nestKey) => {
          try {
            const value = get(values, nestKey)

            if (isDef(value)) {
              formModel[nestKey] = value
              validKeys.push(nestKey)
            }
          } catch (error: any) {
            if (isDef(unref(defaultValueRef)[nestKey])) {
              formModel[nestKey] = cloneDeep(defaultValueRef.value[nestKey])
            }
          }
        })
      }
    })
    // 设置之后主动检测一下是否符合规则
    validateField(validKeys).catch((_) => {})
  }

  // 通过参数名称删除对应的schema
  const removeSchemaByFiled = async (fields: string | string[]): Promise<any> => {
    const schemaList = cloneDeep(unref(getSchema))

    if (!fields) return
    let fieldList = isString(fields) ? [fields] : fields

    for (const field of fieldList) {
      _removeSchemaByField(field, schemaList)
    }

    schemaRef.value = schemaList
  }

  // 根据参数名称删除 formitem
  const _removeSchemaByField = (field: string, schemaList: FormSchema[]) => {
    const index = schemaList.findIndex((item) => item.field === field)
    if (index > -1) {
      delete formModel[field]
      // 引用类型会改变=元数据
      schemaList.splice(index, 1)
    }
  }

  // 动态添加 form-item，如果设置prefixField在添加在之后，如果设置了first 则加在第一个， 都没有则push
  const appendSchemaByField = async (schema: FormSchema, prefixField?: string, first = false): Promise<any> => {
    const schemaList = cloneDeep(unref(getSchema))

    if (!prefixField) {
      first ? schemaList.unshift(schema) : schemaList.push(schema)
    } else {
      const index = schemaList.findIndex((item) => item.field === prefixField)
      if (index > -1) {
        schemaList.splice(index + 1, 0, schema)
      }
    }

    _setDefaultValue(schema)
    schemaRef.value = schemaList
  }

  // 新增form-item设置默认值
  const _setDefaultValue = (data: FormSchema | FormSchema[]) => {
    let schemas: FormSchema[] = []
    if (isObject(data)) {
      schemas.push(data as FormSchema)
    }
    if (isArray(data)) {
      schemas = [...data]
    }

    const obj: Recordable = {}
    const currentFieldsValue = getFieldsValue()

    schemas.forEach((schema) => {
      if (
        schema.component !== 'Divider' &&
        Reflect.has(schema, 'field') &&
        schema.field &&
        isNullOrUnDef(schema.defaultValue) &&
        !(schema.field in currentFieldsValue)
      ) {
        obj[schema.field] = schema.defaultValue
      }
    })

    setFieldsValue(obj)
  }

  // 获取表单值
  const getFieldsValue = (): Recordable => {
    const formEl = unref(formElRef)
    if (!formEl) return {}
    return handleFormValues(toRaw(unref(formModel)))
  }

  // 表单清除, 亦可清除指定参数的错误信息
  const clearValidate = async (props?: FormItemProp): Promise<void> => {
    await unref(formElRef).clearValidate(props)
  }

  // 重置表单item, 一个或者多个
  const resetSchema = async (data: Partial<FormSchema> | Partial<FormSchema>[]): Promise<void> => {
    let updateData: Partial<FormSchema>[] = []

    if (isObject(data)) {
      updateData.push(data as Partial<FormSchema>)
    }

    if (isArray(data)) {
      updateData.push(...data)
    }

    const hasField = updateData.every(
      (item) => item.component === 'Divider' || (Reflect.has(item, 'field') && item.field)
    )

    if (!hasField) {
      throw new Error('所有需要更新的 Schema 数组的子表单必须包含 `field` 字段')
    }

    schemaRef.value = updateData as FormSchema[]
  }

  // 更新一个或者多个schema
  const updateSchema = async (data: Partial<FormSchema> | Partial<FormSchema>[]): Promise<void> => {
    let updateData: Partial<FormSchema>[] = []

    if (isObject(data)) {
      updateData.push(data as Partial<FormSchema>)
    }

    if (isArray(data)) {
      updateData.push(...data)
    }

    const hasField = updateData.every(
      (item) => item.component === 'Divider' || (Reflect.has(item, 'field') && item.field)
    )

    if (!hasField) {
      throw new Error('所有需要更新的 Schema 数组的子表单必须包含 `field` 字段')
    }

    const schemas: FormSchema[] = []

    updateData.forEach((item) => {
      unref(getSchema).forEach((val) => {
        if (val.field === item.field) {
          const newSchema = merge(val, item)
          schemas.push(newSchema)
        } else {
          schemas.push(val)
        }
      })
    })

    _setDefaultValue(schemas)
    schemaRef.value = uniqBy(schemas, 'field')
  }

  // 判断是不是时间类型
  const itemIsDateType = (key?: string) => {
    return unref(getSchema).some((item) => {
      return item.field === key ? dateItemType.includes(item.component) : false
    })
  }

  // 验证某个字段
  const validateField = async (props?: FormItemProp): Promise<any> => {
    return await unref(formElRef).validateField(props)
  }

  // 验证整个表单
  const validate = async (): Promise<boolean> => {
    return await unref(formElRef).validate()
  }
  // 滚动到某一个表单的验证信息
  const scrollToField = (props: FormItemProp) => {
    return unref(formElRef).scrollToField(props)
  }

  // 表单提交事件
  const handleSubmit = async (e?: Event): Promise<void> => {
    e && e?.preventDefault()
    // 如果设置了自定义表单提交事件则直接执行
    const { submitFunc } = unref(getProps)
    if (submitFunc && isFunction(submitFunc)) {
      await submitFunc()
      return
    }

    // 首先需要执行表单验证，之后交给表单参数处理 最后emit submit事件
    const formEl = unref(formElRef)
    if (!formEl) return
    try {
      const isValid = await validate()
      if (!isValid) return
      const res = handleFormValues(getFieldsValue())
      emit('submit', res)
    } catch (error: any) {
      throw new Error(error)
    }
  }

  return {
    handleSubmit,
    clearValidate,
    validate,
    validateField,
    getFieldsValue,
    updateSchema,
    resetSchema,
    appendSchemaByField,
    removeSchemaByFiled,
    resetFields,
    setFieldsValue,
    scrollToField
  }
}
