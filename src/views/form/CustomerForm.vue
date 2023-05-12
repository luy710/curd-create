<script lang="ts">
import { defineComponent, h } from 'vue'
import { ElInput, ElMessage } from 'element-plus'
import type { FormSchema } from '@/components'
import { BasicForm, useForm } from '@/components'

const schemas: FormSchema[] = [
  {
    field: 'field1',
    component: 'Input',
    label: 'render方式',
    colProps: {
      span: 8,
    },
    rules: [{ required: true }],
    render: ({ model, field }) => {
      return h(ElInput, {
        placeholder: '请输入',
        modelValue: model[field],
        onInput: (value: any) => {
          model[field] = value
        },
      })
    },
  },
  {
    field: 'field2',
    component: 'Input',
    label: 'render组件slot',
    colProps: {
      span: 8,
    },
    rules: [{ required: true }],
    renderComponentContent: () => {
      return {
        suffix: () => 'suffix',
      }
    },
  },
  {
    field: 'field3',
    component: 'Input',
    label: '自定义Slot',
    slot: 'f3',
    colProps: {
      span: 8,
    },
    rules: [{ required: true }],
  },
]
export default defineComponent({
  components: { BasicForm },
  setup() {
    const [register, { setProps }] = useForm({
      labelWidth: 120,
      schemas,
      actionColOptions: {
        span: 24,
      },
    })
    return {
      register,
      schemas,
      handleSubmit: (values: any) => {
        ElMessage.success(`click search,values:${JSON.stringify(values)}`)
      },
      setProps,
    }
  },
})
</script>

<template>
  <el-card title="自定义表单">
    <BasicForm @register="register" @submit="handleSubmit">
      <template #f3="{ model, field }">
        <el-input v-model="model[field]" placeholder="自定义slot" />
      </template>
    </BasicForm>
  </el-card>
</template>
