<template>
  <el-select v-model="state" :loading="loading" v-bind="getProps" :options="getOptions" @visible-change="handleFetch">
    <template v-if="!isGroup">
      <el-option v-for="item in getOptions" :key="item.value" :label="item.label" :value="item.value" />
    </template>
    <template v-else>
      <el-option-group v-for="group in getOptions" :key="group.label" :label="group.label">
        <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value" />
      </el-option-group>
    </template>
  </el-select>
</template>

<script lang="ts" setup>
import { isFunction, isArray } from '@/components/utils/is'
import { get, omit } from 'lodash-es'
type OptionsItem = { label: string; value: string; disabled?: boolean }
const props = defineProps({
  modelValue: [Array, String, Number, Boolean, Object] as PropType<
    any[] | string | number | boolean | Record<string, any> | any
  >,
  // value数字转换为字符串
  numberToString: {
    type: Boolean,
    default: false
  },
  api: {
    type: Function as PropType<(args?: Recordable) => Promise<OptionsItem>>,
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
  groupField: {
    type: String,
    default: 'options'
  },
  immediate: {
    type: Boolean,
    default: false
  },
  alwaysLoad: {
    type: Boolean,
    default: false
  },
  isGroup: {
    type: Boolean,
    default: false
  },
  options: {
    type: Array as PropType<Recordable[]>,
    default: () => []
  },
  // 调用接口返回数据处理
  afterFetch: { type: Function as PropType<Fn> },
  // 请求前的参数处理
  beforeFetch: { type: Function as PropType<Fn> }
})

const emit = defineEmits(['update:modelValue', 'options-change', 'change'])

const state = computed({
  set: (val) => {
    emit('change', val)
    emit('update:modelValue', val)
  },
  get: () => props.modelValue
})

const attrs = useAttrs()
const loading = ref(false)
const isFirstLoad = ref(true)
const optionsList = ref<Recordable[]>([])
const getOptions = computed(() => {
  const { labelField, valueField, numberToString, groupField } = props

  const maps = unref(optionsList).reduce((prev, next: Recordable) => {
    if (next) {
      const value = next[valueField]
      prev.push({
        ...omit(next, [labelField, valueField, groupField]),
        label: next[labelField],
        options: next[groupField] || null,
        value: numberToString ? `${value}` : value
      })
    }
    return prev
  }, [] as OptionsItem[])

  return props.options.concat(maps)
})

// 调用初次查询接口数据，搜索查询使用remoteMethod
const fetch = async (params?: Recordable) => {
  const api = props.api
  if (!api || !isFunction(api)) return
  let result = null
  try {
    loading.value = true

    optionsList.value = []
    // 初次请求不使用beforeFetch，二外参数仅在远程查询搜索的时候导入
    result = await api(params || props.params)

    // 处理参数
    if (props.afterFetch && isFunction(props.afterFetch)) {
      result = props.afterFetch(result)
    }
    if (!result) return
    // 如果是数组则说明需要通过指定的resultField拿
    if (!isArray(result)) {
      result = get(result, props.resultField)
    }
    optionsList.value = (result as Recordable[]) || []
    isFirstLoad.value = false

    emit('options-change', getOptions.value)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 远程搜索
const remoteMethod = (query: string) => {
  let params = Object.assign(props.params, { query })
  if (props.beforeFetch && isFunction(props.beforeFetch)) {
    params = props.beforeFetch(params)
  }
  fetch(params)
}

const getProps = computed(() => {
  let obj: Recordable = {}
  if (attrs.filterable && attrs.remote && (!attrs.remoteMethod || !isFunction(attrs.remoteMethod))) {
    obj['remoteMethod'] = remoteMethod
  }

  return Object.assign(obj, attrs)
})

// 每次显示popover自动重新查询一下数据
const handleFetch = async (visible: boolean) => {
  if (visible) {
    if (props.alwaysLoad) {
      await fetch()
    } else if (!props.immediate && unref(isFirstLoad)) {
      await fetch()
      isFirstLoad.value = false
    }
  }
}

watchEffect(() => {
  props.immediate && !props.alwaysLoad && fetch()
})

watch(
  () => props.params,
  () => {
    !unref(isFirstLoad) && fetch()
  },
  { deep: true }
)
</script>

<style lang="scss" scoped></style>
