<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormActionType, FormProps, FormSchema } from '@/components'
import { BasicForm } from '@/components'

const schemas: FormSchema[] = [
  {
    field: 'field1',
    component: 'Input',
    label: '字段1',
    colProps: {
      span: 8,
    },
    componentProps: {
      placeholder: '自定义placeholder',
      onChange: (e: any) => {
        console.log(e)
      },
    },
  },
  {
    field: 'field2',
    component: 'Input',
    label: '字段2',
    colProps: {
      span: 8,
    },
  },
  {
    field: 'field3',
    component: 'DatePicker',
    label: '字段3',
    colProps: {
      span: 8,
    },
  },
  {
    field: 'field4',
    component: 'Select',
    label: '字段4',
    colProps: {
      span: 8,
    },
    componentProps: {
      options: [
        {
          label: '选项1',
          value: '1',
          key: '1',
        },
        {
          label: '选项2',
          value: '2',
          key: '2',
        },
      ],
    },
  },
  {
    field: 'field5',
    component: 'CheckboxGroup',
    label: '字段5',
    colProps: {
      span: 8,
    },
    componentProps: {
      options: [
        {
          label: '选项1',
          value: '1',
        },
        {
          label: '选项2',
          value: '2',
        },
      ],
    },
  },
  {
    field: 'field7',
    component: 'RadioGroup',
    label: '字段7',
    colProps: {
      span: 8,
    },
    componentProps: {
      options: [
        {
          label: '选项1',
          value: '1',
        },
        {
          label: '选项2',
          value: '2',
        },
      ],
    },
  },
]

export default defineComponent({
  components: { BasicForm },
  setup() {
    const formElRef = ref<Nullable<FormActionType>>(null)
    const bprops = reactive({
      submitButtonOptions: {
        // disabled: true,
        loading: true,
        innerTxt: 'queshisubmit',
      },
    })
    return {
      formElRef,
      schemas,
      bprops,
      setHandler: () => {
        bprops.submitButtonOptions.loading = !bprops.submitButtonOptions.loading
        formElRef.value?.setProps(bprops)
      },
      handleSubmit: (values: any) => {
        ElMessage({
          type: 'success',
          message: `click search,values:${JSON.stringify(values)}`,
        })
      },
      setProps(props: FormProps) {
        const formEl = formElRef.value
        console.log(formEl, '//////')
        if (!formEl)
          return
        formEl.setProps(props)
      },
    }
  },
})
</script>

<template>
  <el-card title="Ref操作示例">
    <div class="mb-4">
      <el-button class="mr-2" @click="setProps({ labelWidth: 150 })">
        更改labelWidth
      </el-button>
      <el-button class="mr-2" @click="setProps({ labelWidth: 120 })">
        还原labelWidth
      </el-button>
      <el-button class="mr-2" @click="setProps({ size: 'large' })">
        更改Size
      </el-button>
      <el-button class="mr-2" @click="setProps({ size: 'default' })">
        还原Size
      </el-button>
      <el-button class="mr-2" @click="setProps({ disabled: true })">
        禁用表单
      </el-button>
      <el-button class="mr-2" @click="setProps({ disabled: false })">
        解除禁用
      </el-button>
      <el-button class="mr-2" @click="setProps({ compact: true })">
        紧凑表单
      </el-button>
      <el-button class="mr-2" @click="setProps({ compact: false })">
        还原正常间距
      </el-button>
      <el-button class="mr-2" @click="setProps({ actionColOptions: { span: 8 } })">
        操作按钮位置
      </el-button>
    </div>
    <div class="mb-4">
      <el-button class="mr-2" @click="setProps({ showActionButtonGroup: false })">
        隐藏操作按钮
      </el-button>
      <el-button class="mr-2" @click="setProps({ showActionButtonGroup: true })">
        显示操作按钮
      </el-button>
      <el-button class="mr-2" @click="setProps({ showResetButton: false })">
        隐藏重置按钮
      </el-button>
      <el-button class="mr-2" @click="setProps({ showResetButton: true })">
        显示重置按钮
      </el-button>
      <el-button class="mr-2" @click="setProps({ showSubmitButton: false })">
        隐藏查询按钮
      </el-button>
      <el-button class="mr-2" @click="setProps({ showSubmitButton: true })">
        显示查询按钮
      </el-button>
      <el-button
        class="mr-2"
        @click="
          setProps({
            resetButtonOptions: {
              disabled: true,
              innerTxt: '重置New',
            },
          })
        "
      >
        修改重置按钮
      </el-button>
      <el-button class="mr-2" @click="setHandler">
        修改查询按钮
      </el-button>
    </div>
    <el-card title="使用ref调用表单内部函数示例">
      <BasicForm
        ref="formElRef"
        :schemas="schemas"
        :label-width="100"
        :action-col-options="{ span: 24 }"
        @submit="handleSubmit"
      />

      <el-button v-bind="bprops.submitButtonOptions">
        ddddddd
      </el-button>
    </el-card>
  </el-card>
</template>

<style lang="scss" scoped>
.mb-4 {
  margin-bottom: 0.8rem;
}
</style>
