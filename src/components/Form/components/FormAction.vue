<script lang="ts" setup>
import { ElButton, ElCol, ElFormItem } from 'element-plus'
import type { ColEx } from '../types/index'
import type { ButtonOptions } from '../types/form'

const props = withDefaults(defineProps<{
  showActionButtonGroup?: boolean
  showResetButton?: boolean
  showSubmitButton?: boolean
  showAdvancedButton?: boolean
  resetButtonOptions?: ButtonOptions
  submitButtonOptions?: ButtonOptions
  actionColOptions?: Partial<ColEx>
  actionSpan?: number
  isAdvanced?: boolean
  hideAdvanceBtn?: boolean
}>(), {
  showActionButtonGroup: false,
  showResetButton: false,
  showSubmitButton: false,
  showAdvancedButton: false,
  resetButtonOptions: () => ({}),
  submitButtonOptions: () => ({}),
  actionColOptions: () => ({}),
  actionSpan: 24,
  isAdvanced: false,
  hideAdvanceBtn: false,
})

const emit = defineEmits(['toggleAdvanced', 'reset', 'submit'])

const actionColOpt = computed<any>(() => {
  const { showAdvancedButton, actionSpan: span, actionColOptions } = props

  const actionSpan = 24 - span

  const advancedSpanObj = showAdvancedButton ? { span: actionSpan < 6 ? 24 : actionSpan } : {}

  const actionColOpt: Partial<ColEx> = {
    span: showAdvancedButton ? 6 : 4,
    ...advancedSpanObj,
    ...actionColOptions,
  }

  return actionColOpt
})

const getResetButtonOptions = computed((): ButtonOptions => {
  return Object.assign({ innerTxt: '重置' }, props.resetButtonOptions)
})

const getSubmitButtonOptions = computed((): ButtonOptions => {
  return Object.assign({ innerTxt: '确认' }, props.submitButtonOptions)
})

function toggleAdvanced() {
  emit('toggleAdvanced')
}

function reset() {
  emit('reset')
}

function submit() {
  emit('submit')
}
</script>

<template>
  <ElCol v-if="showActionButtonGroup" v-bind="actionColOpt">
    <ElFormItem style="width: 100%">
      <slot name="resetBefore" />
      <ElButton v-if="showResetButton" class="mr-2" v-bind="getResetButtonOptions" @click="reset">
        {{ getResetButtonOptions.innerTxt }}
      </ElButton>
      <slot name="submitBefore" />
      <ElButton v-if="showSubmitButton" class="mr-2" type="primary" v-bind="getSubmitButtonOptions" @click="submit">
        {{ getSubmitButtonOptions.innerTxt }}
      </ElButton>

      <slot name="advanceBefore" />
      <ElButton v-if="showAdvancedButton && !hideAdvanceBtn" type="primary" link size="small" @click="toggleAdvanced">
        {{ isAdvanced ? '收起' : '展开' }}
      </ElButton>
      <slot name="advanceAfter" />
    </ElFormItem>
  </ElCol>
</template>

<style lang="scss" scoped>
::v-deep(.el-form-item__content) {
  justify-content: flex-end;
}
</style>
