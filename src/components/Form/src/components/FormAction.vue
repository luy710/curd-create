<template>
  <el-col v-bind="actionColOpt" v-if="showActionButtonGroup">
    <div class="" style="width: 100%" :style="{ textAlign: actionColOpt.style.textAlign }">
      <el-form-item>
        <slot name="resetBefore"></slot>
        <el-button class="mr-2" v-if="showResetButton" v-bind="getResetButtonOptions">
          {{ getResetButtonOptions.text }}
        </el-button>
        <slot name="submitBefore"></slot>
        <el-button class="mr-2" v-if="showSubmitButton" type="primary" v-bind="getSubmitButtonOptions">
          {{ getSubmitButtonOptions.text }}
        </el-button>

        <slot name="advanceBefore"></slot>
        <el-button type="link" v-if="showAdvancedButton && !hideAdvanceBtn" size="small" @click="toggleAdvanced">
          {{ isAdvanced ? '收起' : '展开' }}
        </el-button>
        <slot name="advanceAfter"></slot>
      </el-form-item>
    </div>
  </el-col>
</template>

<script lang="ts" setup>
import type { ColEx } from '../types/index'
import type { ButtonProps } from 'element-plus'

// type xxx=x&{sex:string}
// 可以实现接口和接口的交叉,但是只能赋值给type类型
// type x=接口&接口
// 当接口和type都&时,如果其中一个是基本类型,则&结果为基本类型,都是基本类型&结果为never,都是对象进行属性的添加

type ButtonOptions = Partial<ButtonProps> & { text?: string }

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

const emit = defineEmits(['toggle-advanced'])

const actionColOpt = computed(() => {
  const { showAdvancedButton, actionSpan: span, actionColOptions } = props

  const actionSpan = 24 - span

  const advancedSpanObj = showAdvancedButton ? { span: actionSpan < 6 ? 24 : actionSpan } : {}

  const actionColOpt: Partial<ColEx> = {
    style: { textAlign: 'right' },
    span: showAdvancedButton ? 6 : 4,
    ...advancedSpanObj,
    ...actionColOptions
  }

  return actionColOpt
})

const getResetButtonOptions = computed((): ButtonOptions => {
  return Object.assign({ text: '重置' }, props.resetButtonOptions)
})

const getSubmitButtonOptions = computed((): ButtonOptions => {
  return Object.assign({ text: '确认' }, props.submitButtonOptions)
})

const toggleAdvanced = () => {
  emit('toggle-advanced')
}
</script>

<style scss scoped></style>
