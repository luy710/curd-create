<template>
  <el-card title="Ref操作示例">
    <div class="mb-4">
      <el-button @click="setProps({ labelWidth: 150 })" class="mr-2"> 更改labelWidth </el-button>
      <el-button @click="setProps({ labelWidth: 120 })" class="mr-2"> 还原labelWidth </el-button>
      <el-button @click="setProps({ size: 'large' })" class="mr-2"> 更改Size </el-button>
      <el-button @click="setProps({ size: 'default' })" class="mr-2"> 还原Size </el-button>
      <el-button @click="setProps({ disabled: true })" class="mr-2"> 禁用表单 </el-button>
      <el-button @click="setProps({ disabled: false })" class="mr-2"> 解除禁用 </el-button>
      <el-button @click="setProps({ compact: true })" class="mr-2"> 紧凑表单 </el-button>
      <el-button @click="setProps({ compact: false })" class="mr-2"> 还原正常间距 </el-button>
      <el-button @click="setProps({ actionColOptions: { span: 8 } })" class="mr-2"> 操作按钮位置 </el-button>
    </div>
    <div class="mb-4">
      <el-button @click="setProps({ showActionButtonGroup: false })" class="mr-2"> 隐藏操作按钮 </el-button>
      <el-button @click="setProps({ showActionButtonGroup: true })" class="mr-2"> 显示操作按钮 </el-button>
      <el-button @click="setProps({ showResetButton: false })" class="mr-2"> 隐藏重置按钮 </el-button>
      <el-button @click="setProps({ showResetButton: true })" class="mr-2"> 显示重置按钮 </el-button>
      <el-button @click="setProps({ showSubmitButton: false })" class="mr-2"> 隐藏查询按钮 </el-button>
      <el-button @click="setProps({ showSubmitButton: true })" class="mr-2"> 显示查询按钮 </el-button>
      <el-button
        @click="
          setProps({
            resetButtonOptions: {
              disabled: true,
              innerTxt: '重置New'
            }
          })
        "
        class="mr-2"
      >
        修改重置按钮
      </el-button>
      <el-button @click="setHandler" class="mr-2"> 修改查询按钮 </el-button>
    </div>
    <el-card title="使用ref调用表单内部函数示例">
      <BasicForm
        :schemas="schemas"
        ref="formElRef"
        :labelWidth="100"
        @submit="handleSubmit"
        :actionColOptions="{ span: 24 }"
      />

      <el-button v-bind="bprops.submitButtonOptions">ddddddd</el-button>
    </el-card>
  </el-card>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { BasicForm, FormSchema, FormActionType, FormProps } from '@/components/Form/index'
import { ElMessage } from 'element-plus'

const schemas: FormSchema[] = [
  {
    field: 'field1',
    component: 'Input',
    label: '字段1',
    colProps: {
      span: 8
    },
    componentProps: {
      placeholder: '自定义placeholder',
      onChange: (e: any) => {
        console.log(e)
      }
    }
  },
  {
    field: 'field2',
    component: 'Input',
    label: '字段2',
    colProps: {
      span: 8
    }
  },
  {
    field: 'field3',
    component: 'DatePicker',
    label: '字段3',
    colProps: {
      span: 8
    }
  },
  {
    field: 'field4',
    component: 'Select',
    label: '字段4',
    colProps: {
      span: 8
    },
    componentProps: {
      options: [
        {
          label: '选项1',
          value: '1',
          key: '1'
        },
        {
          label: '选项2',
          value: '2',
          key: '2'
        }
      ]
    }
  },
  {
    field: 'field5',
    component: 'CheckboxGroup',
    label: '字段5',
    colProps: {
      span: 8
    },
    componentProps: {
      options: [
        {
          label: '选项1',
          value: '1'
        },
        {
          label: '选项2',
          value: '2'
        }
      ]
    }
  },
  {
    field: 'field7',
    component: 'RadioGroup',
    label: '字段7',
    colProps: {
      span: 8
    },
    componentProps: {
      options: [
        {
          label: '选项1',
          value: '1'
        },
        {
          label: '选项2',
          value: '2'
        }
      ]
    }
  }
]

export default defineComponent({
  components: { BasicForm },
  setup() {
    const formElRef = ref<Nullable<FormActionType>>(null)
    const bprops = reactive({
      submitButtonOptions: {
        // disabled: true,
        loading: true,
        innerTxt: 'queshisubmit'
      }
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
          message: 'click search,values:' + JSON.stringify(values)
        })
      },
      setProps(props: FormProps) {
        const formEl = formElRef.value
        console.log(formEl, '//////')
        if (!formEl) return
        formEl.setProps(props)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.mb-4 {
  margin-bottom: 0.8rem;
}
</style>
