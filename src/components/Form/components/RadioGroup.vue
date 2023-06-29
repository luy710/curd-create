<script lang="ts" setup>
import type { CheckboxProps } from 'element-plus'
import { ElRadio, ElRadioButton, ElRadioGroup } from 'element-plus'

const props = withDefaults(defineProps<{
  modelValue: string | number | boolean
  options?: CheckboxProps[]
  isBtn?: boolean
}>(), {
  modelValue: '',
  options: () => [],
  isBtn: false,
})

const emit = defineEmits(['update:modelValue'])
const attrs = useAttrs()
const state = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
</script>

<template>
  <ElRadioGroup v-model="state" v-bind="attrs" :size="attrs.size">
    <template v-for="item in options" :key="item.label">
      <component :is="isBtn ? ElRadioButton : ElRadio" v-bind="item">
        {{ item.label }}
      </component>
    </template>
  </ElRadioGroup>
</template>

<style lang="scss" scoped></style>
