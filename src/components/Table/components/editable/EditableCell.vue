<script lang="tsx">
import type { CSSProperties, PropType } from 'vue'
import { Check, Close, Edit } from '@element-plus/icons-vue'
import { ElIcon, ElLoadingDirective } from 'element-plus'
import { pick, set } from 'lodash-es'
import type { BasicColumn } from '../../types/table'
import { useTableContext } from '../../hooks/useTableContext'
import { CellComponent } from './CellComponent'
import { createPlaceholderMessage } from './helper'
import type { EditRecordRow } from './index'
import clickOutside from '@/directives/clickOutside'
import { isArray, isBoolean, isFunction, isNumber, isString } from '@/components/utils/is'
import { treeToList } from '@/components/utils/treeHelper'

interface PropsState {
  value: string | number | boolean | Recordable
  record: EditRecordRow
  column: BasicColumn
  index: number
}
export default defineComponent({
  name: 'EditableCell',
  components: { Edit, Close, Check, CellComponent, ElIcon },
  directives: {
    clickOutside,
    loading: ElLoadingDirective,
  },
  props: {
    value: {
      type: [String, Number, Boolean, Object] as PropType<string | number | boolean | Recordable>,
      default: '',
    },
    record: {
      type: Object as PropType<EditRecordRow>,
    },
    column: {
      type: Object as PropType<BasicColumn>,
      default: () => ({}),
    },
    index: {
      type: Number,
      default: -1,
    },
  },
  setup(_props) {
    const props = _props as PropsState
    const table = useTableContext()
    const isEdit = ref(false)
    const elRef = ref()
    const ruleVisible = ref(false)
    const ruleMessage = ref('')
    const optionsRef = ref<LabelValueOptions>([])
    const currentValueRef = ref<any>(props.value)
    const defaultValueRef = ref<any>(props.value)
    const spinning = ref<boolean>(false)

    const prefixCls = 'editable-cell'

    const getComponent = computed(() => props.column?.editComponent || 'Input')
    const getRule = computed(() => props.column?.editRule)

    const getRuleVisible = computed(() => {
      return unref(ruleMessage) && unref(ruleVisible)
    })

    const getIsCheckComp = computed(() => {
      const component = unref(getComponent)
      return ['Checkbox', 'Switch'].includes(component)
    })

    const getDisable = computed(() => {
      const { editDynamicDisabled } = props.column
      let disabled = false
      if (isBoolean(editDynamicDisabled))
        disabled = editDynamicDisabled

      if (isFunction(editDynamicDisabled)) {
        const { record } = props
        disabled = editDynamicDisabled({ record })
      }
      return disabled
    })

    const getComponentProps = computed(() => {
      const isCheckValue = unref(getIsCheckComp)

      const valueField = 'modelValue'
      const val = unref(currentValueRef)

      const value = isCheckValue ? ((isNumber(val) && isBoolean(val)) ? val : !!val) : val

      let compProps = props.column?.editComponentProps ?? {}

      const { record, column, index } = props

      if (isFunction(compProps))
        compProps = compProps({ text: val, record, column, index }) ?? {}

      const component = unref(getComponent)
      const apiSelectProps: Recordable = {}
      if (component === 'Select')
        apiSelectProps.cache = true

      upEditDynamicDisabled(record, column, value)

      return {
        size: 'small',
        placeholder: createPlaceholderMessage(unref(getComponent)),
        ...apiSelectProps,
        ...compProps,
        [valueField]: value,
        disabled: unref(getDisable),
      } as any
    })

    const getComponentEvent = computed(() => {
      let eventProp = 'onChange'
      if (['Input', 'InputNumber'].includes(getComponent.value))
        eventProp = 'onInput'

      if (['DatePicker', 'TimePicker'].includes(getComponent.value))
        eventProp = 'onUpdate:modelValue'

      return {
        [eventProp]: handleChange,
      }
    })
    function upEditDynamicDisabled(record: any, column: any, value: any) {
      const { editDynamicChange } = props.column
      let dynamicChange = false
      if (isBoolean(editDynamicChange))
        dynamicChange = editDynamicChange

      if (isFunction(editDynamicChange)) {
        const { record } = props
        dynamicChange = editDynamicChange({ record })
      }
      if (!dynamicChange)
        return

      if (!record)
        return false
      const { columnKey, prop } = column
      if (!columnKey && !prop)
        return
      const dataKey = (prop || columnKey) as string
      set(record, dataKey, value)
    }
    const getValues = computed(() => {
      const { editValueMap } = props.column

      const value = unref(currentValueRef)

      if (editValueMap && isFunction(editValueMap))
        return editValueMap(value)

      const component = unref(getComponent)
      if (!component.includes('Select'))
        return value

      const options: LabelValueOptions = unref(getComponentProps)?.options ?? (unref(optionsRef) || [])
      const option = options.find(item => `${item.value}` === `${value}`)

      return option?.label ?? value
    })

    const getRowEditable = computed(() => {
      const { editable } = props.record || {}
      return !!editable
    })

    const getWrapperStyle = computed((): CSSProperties => {
      if (unref(getIsCheckComp) || unref(getRowEditable))
        return {}

      return {
        // width: 'calc(100% - 48px)',
        width: '100%',
      }
    })

    const getWrapperClass = computed(() => {
      const { align = 'center' } = props.column
      return `edit-cell-align-${align}`
    })

    watchEffect(() => {
      defaultValueRef.value = props.value
      currentValueRef.value = props.value
    })

    watchEffect(() => {
      const { editable } = props.column
      if (isBoolean(editable) || unref(getRowEditable))
        isEdit.value = !!editable || unref(getRowEditable)
    })

    function handleEdit() {
      if (unref(getRowEditable) || unref(props.column?.editRow))
        return
      ruleMessage.value = ''
      isEdit.value = true
      nextTick(() => {
        const el = unref(elRef)
        el?.focus?.()
      })
    }

    async function handleChange(e: any) {
      const component = unref(getComponent)
      if (!e)
        currentValueRef.value = e
      else if (component === 'Checkbox')
        currentValueRef.value = e
      else if (component === 'Switch')
        currentValueRef.value = e
      else if (e?.target && Reflect.has(e.target, 'value'))
        currentValueRef.value = (e as ChangeEvent).target.value
      else if (isString(e) || isBoolean(e) || isNumber(e) || isArray(e))
        currentValueRef.value = e

      const onChange = unref(getComponentProps)?.onChange
      if (onChange && isFunction(onChange))
        onChange(e)

      table.emit?.('editChange', {
        column: props.column,
        value: unref(currentValueRef),
        record: toRaw(props.record),
      })
      handleSubmitRule()
    }

    async function handleSubmitRule() {
      const { column, record } = props
      const { editRule } = column
      const currentValue = unref(currentValueRef)

      if (editRule) {
        if (isBoolean(editRule) && !currentValue && !isNumber(currentValue)) {
          ruleVisible.value = true
          const component = unref(getComponent)
          ruleMessage.value = createPlaceholderMessage(component)
          return false
        }
        if (isFunction(editRule)) {
          const res = await editRule(currentValue, record as Recordable)
          if (res) {
            ruleMessage.value = res
            ruleVisible.value = true
            return false
          }
          else {
            ruleMessage.value = ''
            return true
          }
        }
      }
      ruleMessage.value = ''
      return true
    }

    async function handleSubmit(needEmit = true, valid = true) {
      if (valid) {
        const isPass = await handleSubmitRule()
        if (!isPass)
          return false
      }

      const { column, index, record } = props
      if (!record)
        return false
      const { columnKey, prop } = column
      const value = unref(currentValueRef)
      if (!columnKey && !prop)
        return

      const dataKey = (prop || columnKey) as string

      if (!record.editable) {
        const { getBindValues } = table

        const { beforeEditSubmit, columns } = unref(getBindValues)

        if (beforeEditSubmit && isFunction(beforeEditSubmit)) {
          spinning.value = true
          const keys: string[] = columns.map(_column => _column.prop).filter(field => !!field) as string[]
          let result: any = true
          try {
            result = await beforeEditSubmit({
              record: pick(record, keys),
              index,
              key: dataKey as string,
              value,
            })
          }
          catch (e) {
            result = false
          }
          finally {
            spinning.value = false
          }
          if (result === false)
            return
        }
      }

      set(record, dataKey, value)
      // const record = await table.updateTableData(index, dataKey, value);
      needEmit && table.emit?.('editEnd', { record, index, key: dataKey, value })
      isEdit.value = false
    }

    async function handleEnter() {
      if (props.column?.editRow)
        return

      handleSubmit()
    }

    function handleSubmitClick() {
      handleSubmit()
    }

    function handleCancel() {
      isEdit.value = false
      currentValueRef.value = defaultValueRef.value
      const { column, index, record } = props
      const { columnKey, prop } = column
      table.emit?.('editCancel', {
        record,
        index,
        key: prop || columnKey,
        value: unref(currentValueRef),
      })
    }

    function onClickOutside() {
      if (props.column?.editable || unref(getRowEditable))
        return

      const component = unref(getComponent)

      if (component.includes('Input'))
        handleCancel()
    }

    // only ApiSelect or TreeSelect
    function handleOptionsChange(options: LabelValueOptions) {
      const { replaceFields } = unref(getComponentProps)
      const component = unref(getComponent)
      if (component === 'TreeSelect') {
        const { title = 'title', value = 'value', children = 'children' } = replaceFields || {}
        let listOptions: Recordable[] = treeToList(options, { children })
        listOptions = listOptions.map((item) => {
          return {
            label: item[title],
            value: item[value],
          }
        })
        optionsRef.value = listOptions as LabelValueOptions
      }
      else {
        optionsRef.value = options
      }
    }

    function initCbs(cbs: 'submitCbs' | 'validCbs' | 'cancelCbs', handle: Fn) {
      if (props.record)
        isArray(props.record[cbs]) ? props.record[cbs]?.push(handle) : (props.record[cbs] = [handle])
    }

    if (props.record) {
      initCbs('submitCbs', handleSubmit)
      initCbs('validCbs', handleSubmitRule)
      initCbs('cancelCbs', handleCancel)

      if (props.column.prop) {
        if (!props.record.editValueRefs)
          props.record.editValueRefs = {}
        props.record.editValueRefs[props.column.prop as any] = currentValueRef
      }
      props.record.onCancelEdit = () => {
        isArray(props.record?.cancelCbs) && props.record?.cancelCbs.forEach(fn => fn())
      }
      props.record.onSubmitEdit = async () => {
        if (isArray(props.record?.submitCbs)) {
          if (!props.record?.onValid?.())
            return
          const submitFns = props.record?.submitCbs || []
          submitFns.forEach(fn => fn(false, false))
          table.emit?.('editRowEnd')
          return true
        }
      }
    }

    return {
      isEdit,
      prefixCls,
      handleEdit,
      currentValueRef,
      handleSubmit,
      handleChange,
      handleCancel,
      elRef,
      getComponent,
      getRule,
      onClickOutside,
      ruleMessage,
      getRuleVisible,
      getComponentProps,
      getComponentEvent,
      handleOptionsChange,
      getWrapperStyle,
      getWrapperClass,
      getRowEditable,
      getValues,
      handleEnter,
      handleSubmitClick,
      spinning,
    }
  },
  render() {
    const column = this.column as BasicColumn
    const value = this.value as string | number | boolean | Recordable
    const index = this.index as number
    return (
      <div class={this.prefixCls}>
        <div
          v-show={!this.isEdit}
          class={{ [`${this.prefixCls}__normal`]: true, 'ellipsis-cell': column.showOverflowTooltip }}
          onClick={this.handleEdit}
        >
          <div class="cell-content" title={column.showOverflowTooltip ? this.getValues ?? '' : ''}>
            {column.editRender
              ? column.editRender({
                text: value,
                record: this.record as Recordable,
                column,
                index,
              })
              : this.getValues}
          </div>
          {!column.editRow && (
            <el-icon class={`${this.prefixCls}__normal-icon`}>
              <Edit />
            </el-icon>
          )}
        </div>
        {this.isEdit && (
          <div v-loading={this.spinning} class={`${this.prefixCls}__wrapper`} v-click-outside={this.onClickOutside}>
            <CellComponent
              {...this.getComponentProps}
              component={this.getComponent}
              style={this.getWrapperStyle}
              popoverVisible={this.getRuleVisible}
              rule={this.getRule}
              ruleMessage={this.ruleMessage}
              class={this.getWrapperClass}
              ref="elRef"
              {...this.getComponentEvent}
              onOptionsChange={this.handleOptionsChange}
              onPressEnter={this.handleEnter}
            />
            {!this.getRowEditable && (
              <div class={`${this.prefixCls}__action`}>
                <el-icon class={[`${this.prefixCls}__icon`]} onClick={this.handleSubmitClick}>
                  <Check />
                </el-icon>
                <el-icon class={`${this.prefixCls}__icon `} onClick={this.handleCancel}>
                  <Close />
                </el-icon>
              </div>
            )}
          </div>
        )}
      </div>
    )
  },
})
</script>

<style lang="scss">
.edit-cell-align-left {
  text-align: left;
}

.edit-cell-align-center {
  text-align: center;
}

.edit-cell-align-right {
  text-align: right;
}

.el-popover.el-popper.edit-cell-rule-popover {
  padding: 4px 8px;
  color: var(--el-color-error);
  // border: 1px solid @error-color;
  border-radius: 2px;
  font-size: 13px;
}
.editable-cell {
  position: relative;
  min-height: 23px;
  .el-date-editor.el-input,
  .el-date-editor.el-input__wrapper {
    width: unset;
  }

  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: center;

    > .el-select,
    .el-input-number {
      min-width: calc(100% - 48px);
    }
    > .el-tooltip__trigger {
      flex: 1;
    }

    .el-loading-spinner {
      .circular {
        width: 20px;
      }
    }
  }
  &__action {
    display: flex;
  }
  &__icon {
    cursor: pointer;
    margin-left: 3px;
    &:hover {
      transform: scale(1.2);

      svg {
        color: var(--el-color-primary);
      }
    }
  }

  .ellipsis-cell {
    .cell-content {
      overflow-wrap: break-word;
      word-break: break-word;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  &__normal {
    &-icon {
      position: absolute;
      top: 4px;
      right: 0;
      display: none;
      width: 20px;
      cursor: pointer;
    }
  }

  &:hover {
    .editable-cell__normal-icon {
      display: inline-block;
    }
  }
}
</style>
