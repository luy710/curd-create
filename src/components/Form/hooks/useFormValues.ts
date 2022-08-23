import { isArray, isFunction, isObject, isString, isNullOrUnDef } from '@/components/utils/is'
import { dateUtil } from '@/components/utils/dateUtil'
import type { Ref, ComputedRef } from 'vue'
import type { FormProps, FormSchema } from '../types/form'
import { cloneDeep, set } from 'lodash-es'
import { unref } from 'vue'

interface UseFormValuesContext {
  formModel: Recordable
  getProps: ComputedRef<FormProps>
  getSchema: ComputedRef<FormSchema[]>
  defaultValueRef: Ref<Recordable>
}
// 解构数组链接键。此方法将改变目标。
const tryDeconstructArray = (key: string, value: any, target: Recordable) => {
  const pattern = /^\[(.+)\]$/
  if (pattern.test(key)) {
    const match = key.match(pattern)
    if (match && match[1]) {
      const keys = match[1].split(',')
      value = Array.isArray(value) ? value : [value]
      keys.forEach((k, index) => {
        set(target, k.trim(), value[index])
      })
      return true
    }
  }
}

// 对象解构链接键，此方法会改变目标值
const tryDeconstructObject = (key: string, value: any, target: Recordable) => {
  const pattern = /^\{(.+)\}$/

  if (pattern.test(key)) {
    const match = key.match(pattern)

    if (match && match[1]) {
      const keys = match[1].split(',')

      value = isObject(value) ? value : {}

      keys.forEach((k) => {
        set(target, k.trim(), value[k.trim()])
      })

      return true
    }
  }
}

export default function useFormValues({ defaultValueRef, getSchema, formModel, getProps }: UseFormValuesContext) {
  // 预处理表单 values
  const handleFormValues = (values: Recordable) => {
    if (!isObject(values)) return {}
    const res = {}
    // 转换成键值对
    for (const item of Object.entries(values)) {
      let [, value] = item
      const [key] = item
      // 如果没有key 或者 是数组 函数 则跳过继续
      if (!key || (isArray(value) && value.length === 0) || isFunction(value)) continue
      // 获取公共表单时间格式处理
      const transformDateFunc = unref(getProps).transformDateFunc
      // 处理时间对象
      if (isObject(value) && value?.format) {
        value = transformDateFunc?.(value)
      }
      // 处理时间数组
      if (isArray(value) && value[0]?.format && value[1]?.format) {
        value = value.map((el) => transformDateFunc?.(el))
      }
      // 如果是字符串需要trim
      if (isString(value)) {
        value = value.trim()
      }

      // 其他类型则需要解构赋值
      if (!tryDeconstructArray(key, value, res) && !tryDeconstructObject(key, value, res)) {
        set(res, key, value)
      }
    }

    return handleRangeTimeValue(res)
  }

  // 通过预设的字段格式 处理时间范围
  const handleRangeTimeValue = (values: Recordable) => {
    const fieldMapToTime = unref(getProps).fieldMapToTime

    if (!fieldMapToTime && !isArray(fieldMapToTime)) return values

    for (const [field, [startTimeKey, endTimeKey], format = 'YYYY-MM-DD'] of fieldMapToTime) {
      if (!field || !startTimeKey || !endTimeKey || !values[field]) continue

      const [startTime, endTime]: string[] = values[field]

      values[startTimeKey] = dateUtil(startTime).format(format)
      values[endTimeKey] = dateUtil(endTime).format(format)
      Reflect.deleteProperty(values, field)
    }
    return values
  }

  // 初始化设置默认值
  const initDefault = () => {
    const schemas = unref(getSchema)

    const obj: Recordable = {}

    schemas.forEach((schema) => {
      const { defaultValue } = schema
      if (!isNullOrUnDef(defaultValue)) {
        obj[schema.field] = defaultValue

        if (formModel[schema.field] === undefined) {
          formModel[schema.field] = defaultValue
        }
      } else {
        formModel[schema.field] = undefined
      }
    })

    defaultValueRef.value = cloneDeep(obj)
  }

  return { handleFormValues, initDefault }
}
