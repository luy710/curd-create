<template>
  <el-radio-group v-model="state" v-bind="attrs">
    <template v-for="item in options" :key="item.label">
      <component :is="isBtn ? ElRadioButton : ElRadio" v-bind="item">
        {{ item.label }}
      </component>
    </template>
  </el-radio-group>
</template>

<script lang="ts" setup>
import type { CheckboxProps } from 'element-plus'
import { ElRadio, ElRadioButton, ElRadioGroup } from 'element-plus'
import { useAttrs, computed, defineEmits, defineProps } from 'vue'
const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean] as PropType<string | number | boolean>
  },
  options: {
    type: Array as PropType<CheckboxProps[]>,
    default: () => []
  },
  isBtn: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue'])
const attrs = useAttrs()
const state = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
</script>

<style lang="scss" scoped></style>
