<template>
  <el-col v-bind="actionColOpt" v-if="showActionButtonGroup">
    <el-form-item style="width: 100%">
      <slot name="resetBefore"></slot>
      <el-button class="mr-2" v-if="showResetButton" v-bind="getResetButtonOptions" @click="reset">
        {{ getResetButtonOptions.innerTxt }}
      </el-button>
      <slot name="submitBefore"></slot>
      <el-button class="mr-2" v-if="showSubmitButton" type="primary" v-bind="getSubmitButtonOptions" @click="submit">
        {{ getSubmitButtonOptions.innerTxt }}
      </el-button>

      <slot name="advanceBefore"></slot>
      <el-button v-if="showAdvancedButton && !hideAdvanceBtn" type="primary" link size="small" @click="toggleAdvanced">
        {{ isAdvanced ? '收起' : '展开' }}
      </el-button>
      <slot name="advanceAfter"></slot>
    </el-form-item>
  </el-col>
</template>

<script lang="ts" setup>
import type { ColEx } from '../types/index'
import type { ButtonOptions } from '../types/form'
// import { defineProps, computed, defineEmits } from 'vue'
// type xxx=x&{sex:string}
// 可以实现接口和接口的交叉,但是只能赋值给type类型
// type x=接口&接口
// 当接口和type都&时,如果其中一个是基本类型,则&结果为基本类型,都是基本类型&结果为never,都是对象进行属性的添加

const props = defineProps({
  showActionButtonGroup: {
    type: Boolean,
    default: true
  },
  showResetButton: {
    type: Boolean,
    default: true
  },
  showSubmitButton: {
    type: Boolean,
    default: true
  },
  showAdvancedButton: {
    type: Boolean,
    default: true
  },
  resetButtonOptions: {
    type: Object as PropType<ButtonOptions>,
    default: () => ({})
  },
  submitButtonOptions: {
    type: Object as PropType<ButtonOptions>,
    default: () => ({})
  },
  actionColOptions: {
    type: Object as PropType<Partial<ColEx>>,
    default: () => ({})
  },
  actionSpan: {
    type: Number,
    default: 6
  },
  isAdvanced: {
    type: Boolean,
    default: false
  },
  hideAdvanceBtn: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-advanced', 'reset', 'submit'])

const actionColOpt = computed<any>(() => {
  const { showAdvancedButton, actionSpan: span, actionColOptions } = props

  const actionSpan = 24 - span

  const advancedSpanObj = showAdvancedButton ? { span: actionSpan < 6 ? 24 : actionSpan } : {}

  const actionColOpt: Partial<ColEx> = {
    span: showAdvancedButton ? 6 : 4,
    ...advancedSpanObj,
    ...actionColOptions
  }

  return actionColOpt
})

const getResetButtonOptions = computed((): ButtonOptions => {
  return Object.assign({ innerTxt: '重置' }, props.resetButtonOptions)
})

const getSubmitButtonOptions = computed((): ButtonOptions => {
  return Object.assign({ innerTxt: '确认' }, props.submitButtonOptions)
})

const toggleAdvanced = () => {
  emit('toggle-advanced')
}

const reset = () => {
  emit('reset')
}

const submit = () => {
  emit('submit')
}
</script>

<style lang="scss" scoped>
::v-deep(.el-form-item__content) {
  justify-content: flex-end;
}
</style>
