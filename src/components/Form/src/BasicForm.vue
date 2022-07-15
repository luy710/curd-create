<template>
  <el-form v-bind="getBindValue" :class="getFormClass" ref="formElRef" :model="formModel">
    <el-row v-bind="getRow">
      <!-- form表单 header 插槽 -->
      <slot name="formHeader" />
      <template v-for="schema in getSchema" :key="schema.field"> </template>
    </el-row>
  </el-form>
</template>

<script lang="ts" setup>
import { basicProps } from './props'
import { dateUtil } from '@/components/utils/dateUtil'
import { FormProps, FormSchema, FormActionType } from './types/form'
import { dateItemType } from './helper'
import { cloneDeep } from 'lodash-es'
// 获取props
const props = defineProps(basicProps)
// 定义表单对象
const formModel = reactive<Recordable>({})
// 表单默认值对象
const defaultValueRef = ref<Recordable>({})
//
const isInitedDefaultRef = ref(false)
// 用于存储 手动新增、修改的props
const propsRef = ref<Partial<FormProps>>({})
// 设置响应式schema数组，当发生schema变动时，用于替换保存schema，避免直接操作 props
const schemaRef = ref<Nullable<FormSchema[]>>(null)
// 组件ref
const formElRef = ref<Nullable<FormActionType>>(null)
// 样式前缀
const prefixCls = 'basic-form'
// 除props 额外的参数
const attrs = useAttrs()
// 动态样式
const getFormClass = computed(() => {
  return [
    prefixCls,
    {
      [`${prefixCls}--compact`]: props?.compact
    }
  ]
})
// 获取form 的基础配置
const getProps = computed((): FormProps => ({ ...props, ...unref(propsRef) } as FormProps))
// 组合 props
const getBindValue = computed<Recordable>(() => ({ ...attrs, ...unref(getProps) }))
// 获取row的style以及组件配置
const getRow = computed(() => {
  const { baseRowStyle, rowProps } = props
  return {
    style: baseRowStyle,
    ...rowProps
  }
})
// 获取form schema 配置列表
const getSchema = computed((): FormSchema[] => {
  const schemas: FormSchema[] = unref(schemaRef) || (unref(getProps).schemas as FormSchema[])
  for (const schema of schemas) {
    const { defaultValue, component } = schema
    // 如果是日期组件 默认值需要预处理
    if (defaultValue && dateItemType.includes(component)) {
      if (Array.isArray(defaultValue)) {
        const def: any = []
        defaultValue.forEach((item) => {
          def.push(dateUtil(item))
        })
        schema.defaultValue = def
      } else {
        schema.defaultValue = dateUtil(defaultValue)
      }
    }
  }
  // 如果显示操作按钮组
  if (unref(getProps).showAdvancedButton) {
    return cloneDeep(schemas.filter((schema) => schema.component !== 'Divider') as FormSchema[])
  } else {
    return cloneDeep(schemas)
  }
})
</script>

<style lang="less" scoped></style>
