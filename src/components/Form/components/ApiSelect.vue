<script lang="ts" setup>
import { ElSelectV2 } from 'element-plus'
import { get, omit } from 'lodash-es'
import { isArray, isFunction } from '@/components/utils/is'

interface PropsState {
  modelValue: any[] | string | number | boolean | Record<string, any> | any
  numberToString?: boolean
  api?: (args?: Recordable) => Promise<OptionsItem>
  params?: Recordable
  resultField?: string
  labelField?: string
  valueField?: string
  groupField?: string
  immediate?: boolean
  alwaysLoad?: boolean
  options?: Recordable[]
  afterFetch?: Fn
  beforeFetch?: Fn
}
interface OptionsItem { label: string; value: string; disabled?: boolean }
const props = withDefaults(defineProps<PropsState>(), {
  numberToString: false,
  modelValue: '',
  params: () => ({}),
  resultField: '',
  labelField: 'label',
  valueField: 'value',
  groupField: 'options',
  immediate: false,
  alwaysLoad: false,
  options: () => [],
})

const emit = defineEmits(['update:modelValue', 'optionsChange', 'change'])

const state = computed({
  set: (val) => {
    emit('change', val)
    emit('update:modelValue', val)
  },
  get: () => props.modelValue,
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
      let children = []
      if (isArray(next[groupField]) && next[groupField].length) {
        children = next[groupField].map((el: Recordable) => ({
          ...omit(el, [labelField, valueField]),
          label: el[labelField],
          value: numberToString ? `${el[valueField]}` : el[valueField],
        }))
      }
      prev.push({
        ...omit(next, [labelField, valueField, groupField]),
        label: next[labelField],
        options: children,
        value: numberToString ? `${value}` : value,
      })
    }
    return prev
  }, [] as OptionsItem[])

  return props.options.concat(maps)
})

// 调用初次查询接口数据，搜索查询使用remoteMethod
async function fetch(params?: Recordable) {
  const api = props.api
  if (!api || !isFunction(api))
    return
  let result = null
  try {
    loading.value = true

    optionsList.value = []
    // 初次请求不使用beforeFetch，二外参数仅在远程查询搜索的时候导入
    result = await api(params || props.params)

    // 处理参数
    if (props.afterFetch && isFunction(props.afterFetch))
      result = props.afterFetch(result)

    if (!result)
      return
    // 如果是数组则说明需要通过指定的resultField拿
    if (!isArray(result))
      result = get(result, props.resultField)

    optionsList.value = (result as Recordable[]) || []
    isFirstLoad.value = false

    emit('optionsChange', getOptions.value)
  }
  catch (error) {
    console.error(error)
  }
  finally {
    loading.value = false
  }
}

// 远程搜索
function remoteMethod(query: string) {
  let params = Object.assign(props.params, { query })
  if (props.beforeFetch && isFunction(props.beforeFetch))
    params = props.beforeFetch(params)

  fetch(params)
}

const getProps = computed(() => {
  const obj: Recordable = {}
  if (attrs.filterable && attrs.remote && (!attrs.remoteMethod || !isFunction(attrs.remoteMethod)))
    obj.remoteMethod = remoteMethod
  return Object.assign(obj, attrs)
})

// 每次显示popover自动重新查询一下数据
async function handleFetch(visible: boolean) {
  if (visible) {
    if (props.alwaysLoad) {
      await fetch()
    }
    else if (!props.immediate && unref(isFirstLoad)) {
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
  { deep: true },
)
</script>

<template>
  <ElSelectV2 v-model="state" :size="$attrs.size || 'default'" :loading="loading" v-bind="getProps" :options="getOptions" @visible-change="handleFetch" />
</template>

<style lang="scss" scoped>
  .el-select-v2 {
    width: 100%;
  }
</style>
