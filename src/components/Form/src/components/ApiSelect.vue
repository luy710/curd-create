<template>
  <el-select v-model="state"> </el-select>
</template>

<script lang="ts" setup>
const props = defineProps({
  modelValue: [Array, String, Number, Object],
  api: {
    type: Function as PropType<(args?: Recordable) => Promise<any>>,
    default: null
  },
  // 请求参数
  params: {
    type: Object as PropType<Recordable>,
    default: () => ({})
  },
  // support xxx.xxx.xx
  resultField: {
    type: String,
    default: ''
  },
  labelField: {
    type: String,
    default: 'label'
  },
  valueField: {
    type: String,
    default: 'value'
  },
  immediate: {
    type: Boolean,
    default: true
  },
  alwaysLoad: {
    type: Boolean,
    default: true
  },
  options: {
    type: Array as PropType<Recordable[]>,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const state = computed({
  set: (val) => {
    emit('update:modelValue', val)
  },
  get: () => props.modelValue
})

const attrs = useAttrs()
const loading = ref(false)
const isFirstLoad = ref(true)
const optionsList = ref<Recordable[]>([])
</script>

<style lang="scss" scoped></style>
