import type { ColEx } from '../types'
import type { AdvanceState } from '../types/hooks'
import type { ComputedRef, Ref } from 'vue'
import { FormProps, FormSchema } from '../types/form'
import { isBoolean, isFunction, isNumber, isObject } from '@/components/utils/is'
import { debounce } from 'lodash-es'
import { screenEnum, sizeEnum, screenMap } from '@/components/enums/breakpointEnum'
// import { getCurrentInstance, ref, onBeforeUnmount, computed, unref, watch } from 'vue'
const BASIC_COL_LEN = 24

interface UseAdvanceContext {
  advanceState: AdvanceState
  emit: (event: 'submit' | 'reset' | 'advanced-change' | 'register' | 'field-value-change', ...args: any[]) => void
  getProps: ComputedRef<FormProps>
  getSchema: ComputedRef<FormSchema[]>
  formModel: Recordable
  defaultValueRef: Ref<Recordable>
}

export default function ({ advanceState, emit, getProps, getSchema, formModel, defaultValueRef }: UseAdvanceContext) {
  const vm = getCurrentInstance()
  const realWidth = ref(window.innerWidth)
  const screenRef = ref('XS')

  window.addEventListener('resize', debounce(getWindowWidth, 40), false)

  function getWindowWidth() {
    const width = document.body.clientWidth
    const xs = screenMap.get(sizeEnum.XS)!
    const sm = screenMap.get(sizeEnum.SM)!
    const md = screenMap.get(sizeEnum.MD)!
    const lg = screenMap.get(sizeEnum.LG)!
    const xl = screenMap.get(sizeEnum.XL)!
    if (width < xs) {
      screenRef.value = sizeEnum.XS
    } else if (width < sm) {
      screenRef.value = sizeEnum.SM
    } else if (width < md) {
      screenRef.value = sizeEnum.MD
    } else if (width < lg) {
      screenRef.value = sizeEnum.LG
    } else if (width < xl) {
      screenRef.value = sizeEnum.XL
    }
    realWidth.value = width
  }

  onBeforeUnmount(() => {
    window.removeEventListener('resize', debounce(getWindowWidth, 40), false)
  })

  const getEmptySpan = computed(() => {
    if (!advanceState.isAdvanced) return 0

    const emptySpan = unref(getProps).emptySpan || 0

    if (isNumber(emptySpan)) {
      return emptySpan
    }

    if (isObject(emptySpan)) {
      const { span = 0 } = emptySpan
      const screen = unref(screenRef)

      const screenSpan = (emptySpan as any)[screen.toLocaleLowerCase()]
      return screenSpan || span || 0
    }

    return 0
  })

  const handleToggleAdvanced = () => {
    advanceState.isAdvanced = !advanceState.isAdvanced
  }

  const getAdvanced = (itemCol: Partial<ColEx>, itemColSum = 0, isLastAction = false) => {
    const width = unref(realWidth)
    // 中等可是宽度下的等分数
    const md =
      parseInt(itemCol.md as string) ||
      parseInt(itemCol.xs as string) ||
      parseInt(itemCol.sm as string) ||
      (itemCol.span as number) ||
      BASIC_COL_LEN

    // 较长宽度下的等分数
    const lg = parseInt(itemCol.lg as string) || md
    // 超宽下的等分
    const xl = parseInt(itemCol.xl as string) || lg

    if (width <= screenEnum.LG) {
      itemColSum += md
    } else if (width < screenEnum.XL) {
      itemColSum += lg
    }

    if (isLastAction) {
      advanceState.hideAdvanceBtn = false

      if (itemColSum <= BASIC_COL_LEN * 2) {
        // 不超过两行，不显示展开收起按钮
        advanceState.hideAdvanceBtn = true
        advanceState.isAdvanced = true
      } else if (
        itemColSum > BASIC_COL_LEN * 2 &&
        itemColSum <= BASIC_COL_LEN * (unref(getProps).autoAdvancedLine || 3)
      ) {
        advanceState.hideAdvanceBtn = false
      } else if (!advanceState.isLoad) {
        advanceState.isLoad = true
        advanceState.isAdvanced = !advanceState.isAdvanced
      }

      return { isAdvanced: advanceState.isAdvanced, itemColSum }
    }
    if (itemColSum > BASIC_COL_LEN * (unref(getProps).alwaysShowLines || 1)) {
      return { isAdvanced: advanceState.isAdvanced, itemColSum }
    } else {
      return { isAdvanced: true, itemColSum }
    }
  }

  const updateAdvanced = () => {
    let itemColSum = 0
    let realItemColSum = 0
    const { baseColProps = {} } = unref(getProps)

    for (const schema of unref(getSchema)) {
      const { show, colProps } = schema
      let isShow = true
      if (isBoolean(show)) {
        isShow = show
      }

      if (isFunction(show)) {
        isShow = show({
          schema,
          model: formModel,
          field: schema.field,
          values: {
            ...unref(defaultValueRef),
            ...formModel
          }
        })
      }

      if (isShow && (colProps || baseColProps)) {
        const { itemColSum: sum, isAdvanced } = getAdvanced({ ...baseColProps, ...colProps }, itemColSum)

        itemColSum = sum || 0
        // 如果是展开 &
        if (isAdvanced) {
          realItemColSum = itemColSum
        }

        schema.isAdvanced = isAdvanced
      }
    }

    vm?.proxy?.$forceUpdate()
    advanceState.actionSpan = (realItemColSum % BASIC_COL_LEN) + unref(getEmptySpan)

    getAdvanced(unref(getProps).actionColOptions || { span: BASIC_COL_LEN }, itemColSum, true)

    emit('advanced-change')
  }

  const debounceUpdateAdvanced = debounce(updateAdvanced, 30)

  watch(
    [() => unref(getSchema), () => advanceState.isAdvanced, () => unref(realWidth)],
    () => {
      const { showAdvancedButton } = unref(getProps)
      if (showAdvancedButton) {
        debounceUpdateAdvanced()
      }
    },
    { immediate: true }
  )

  return { handleToggleAdvanced }
}
