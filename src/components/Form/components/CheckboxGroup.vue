<template>
  <el-checkbox-group v-model="state" v-bind="attrs">
    <template v-for="item in options" :key="item.label">
      <component :is="isBtn ? ElCheckboxButton : ElCheckbox" v-bind="item">
        {{ item.label }}
      </component>
    </template>
  </el-checkbox-group>
</template>

<script lang="ts" setup>
import type { CheckboxProps } from 'element-plus'
import { ElCheckbox, ElCheckboxButton, ElCheckboxGroup } from 'element-plus'
import { defineProps, useAttrs, computed } from 'vue'
const props = defineProps({
  modelValue: {
    type: Array as PropType<(string | number | boolean)[]>
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
const state = computed<any>({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
</script>

<style lang="scss" scoped></style>
