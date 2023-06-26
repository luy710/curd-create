<script lang="ts" setup>
import type { CheckboxProps } from 'element-plus'
import { ElRadio, ElRadioButton } from 'element-plus'

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
  <el-radio-group v-model="state" v-bind="attrs">
    <template v-for="item in options" :key="item.label">
      <component :is="isBtn ? ElRadioButton : ElRadio" v-bind="item">
        {{ item.label }}
      </component>
    </template>
  </el-radio-group>
</template>

<style lang="scss" scoped></style>
