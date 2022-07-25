<script lang="tsx">
import { FormSchema, FormProps, FormActionType, Rule } from '../types/form'
import { TableActionType } from '@/components/Table/src/types/table'
import { BasicHelp } from '@/components/Basic'
import { isFunction, isBoolean, isNull } from '@/components/utils/is'
import { cloneDeep, upperFirst } from 'lodash-es'
import { createPlaceholderMessage, setComponentRuleType } from '../helper'
import { getSlot } from '@/components/utils/tsxHelper'
import { componentMap } from '../componentMap'
export default defineComponent({
  name: 'BasicFormItem',
  inheritAttrs: false,
  props: {
    schema: {
      type: Object as PropType<FormSchema>,
      default: () => ({})
    },
    formProps: {
      type: Object as PropType<FormProps>,
      default: () => ({})
    },
    allDefaultValues: {
      type: Object as PropType<Recordable>,
      default: () => ({})
    },
    formModel: {
      type: Object as PropType<Recordable>,
      default: () => ({})
    },
    setFormModel: {
      type: Function as PropType<(key: string, value: any) => void>,
      default: null
    },
    tableAction: {
      type: Object as PropType<TableActionType>
    },
    formActionType: {
      type: Object as PropType<FormActionType>
    }
  },
  setup(props, { slots }) {
    const Slots = slots
    const getValues = computed(() => {
      const { allDefaultValues, formModel, schema } = props
      const { mergeDynamicData } = props.formProps

      return {
        field: schema.field,
        model: formModel,
        values: {
          ...mergeDynamicData,
          ...allDefaultValues,
          ...formModel
        },
        schema
      }
    })

    const getComponentsProps = computed(() => {
      const { schema, tableAction, formModel, formActionType } = props
      let { componentProps = {} } = schema

      if (isFunction(componentProps)) {
        componentProps = componentProps({ schema, tableAction, formModel, formActionType })
      }
      if (schema.component === 'Divider') {
        componentProps = Object.assign({ direction: 'horizontal' }, componentProps)
      }

      return componentProps as Recordable
    })

    // 判断是否需要禁用，如果是formprops设置了禁用优先级比较高，其次是formitem是否设置禁用，如果是动态的则需要传入formvalue
    const getDisable = computed(() => {
      const { disabled: globDisabled } = props.formProps
      const { dynamicDisabled } = props.schema
      const { disabled: itemDisabled = false } = unref(getComponentsProps)

      let disabled = !!globDisabled || !!itemDisabled

      if (isBoolean(dynamicDisabled)) {
        disabled = dynamicDisabled
      }

      if (isFunction(dynamicDisabled)) {
        disabled = dynamicDisabled(unref(getValues))
      }

      return disabled
    })

    // formitem 判断是否显示，如果是动态显示 需要传入form参数
    const getShow = (): { isShow: Boolean; isIfShow: boolean } => {
      const { show, ifShow, isAdvanced } = props.schema
      const { showAdvancedButton } = props.formProps
      // 如果是form的操作按钮组, 需要优先判断是否显示, 默认显示底部操作按钮
      const itemIsAdvanceButton = showAdvancedButton ? (isBoolean(isAdvanced) ? isAdvanced : true) : true
      let isShow = true
      let isIfShow = true

      if (isBoolean(show)) {
        isShow = show
      }
      if (isBoolean(ifShow)) {
        isIfShow = ifShow
      }

      if (isFunction(show)) {
        isShow = show(unref(getValues))
      }
      if (isFunction(ifShow)) {
        isIfShow = ifShow(unref(getValues))
      }
      isShow = isShow && itemIsAdvanceButton
      return { isShow, isIfShow }
    }

    const handleRules = (): Rule[] => {
      const { rules: defRules = [], component, rulesMessageJoinLabel, label, dynamicRules, required } = props.schema

      // 判断是否是动态规则，如果是动态的则需要在执行的时候传入form 参数
      if (isFunction(dynamicRules)) {
        return dynamicRules(unref(getValues)) as Rule[]
      }

      let rules = cloneDeep(defRules) as Rule[]
      // 是否自动生成规则验证的错误信息， 优先判断formitem的内部配置
      const { rulesMessageJoinLabel: globRulesMessageJoinLabel } = props.formProps

      const joinLabel = Reflect.has(props.schema, 'rulesMessageJoinLabel')
        ? rulesMessageJoinLabel
        : globRulesMessageJoinLabel

      // 根据组件类型生成placeholder 文本 组合成rule errormessage
      const defaultMsg = createPlaceholderMessage(component) + `${joinLabel ? label : ''}`

      // 根据form表单的参数类型进行判断
      const validator = (rule: any, value: any) => {
        const msg = rule.message || defaultMsg
        if (value === undefined || isNull(value)) {
          // 空值
          return Promise.reject(msg)
        } else if (Array.isArray(value) && value.length === 0) {
          // 数组
          return Promise.reject(msg)
        } else if (typeof value === 'string' && value.trim() === '') {
          // 空字符串
          return Promise.reject(msg)
        }

        return Promise.resolve()
      }

      // 判断是否是动态required
      const getRequired = isFunction(required) ? required(unref(getValues)) : required

      // 如果是必须则需要强制加入 强校验
      if (getRequired) {
        if (!rules || rules.length === 0) {
          // @ts-ignore
          rules = [{ required: getRequired, validator }]
        } else {
          const requiredRuleIndex = rules.findIndex((rule) => Reflect.has(rule, 'required'))

          if (requiredRuleIndex === -1) {
            // @ts-ignore
            rules.push({ required: getRequired, validator })
          }
        }
      }

      const requiredRuleIndex = rules.findIndex(
        (rule) => Reflect.has(rule, 'required') && !Reflect.has(rule, 'validator')
      )

      if (requiredRuleIndex > -1) {
        const rule = rules[requiredRuleIndex]

        const { isShow } = getShow()

        if (!isShow) {
          rule.required = false
        }
        if (component) {
          if (!Reflect.has(rule, 'type')) {
            rule.type = component === 'InputNumber' ? 'number' : 'string'
          }

          rule.message = rule.message || defaultMsg

          if (component.includes('Input')) {
            rule.whitespace = true
          }
          // 日期格式处理
          const valueFormat = unref(getComponentsProps)?.valueFormat
          // 处理其他类型rule 参数 验证类型
          setComponentRuleType(rule, component, valueFormat, unref(getComponentsProps)?.type)
        }
      }
      return rules
    }

    const renderComponent = () => {
      const { renderComponentContent, component, field, changeEvent = 'change', valueField } = props.schema
      const { autoSetPlaceHolder, size } = props.formProps

      let schemaEvent = changeEvent
      if (component.includes('Input')) {
        schemaEvent = 'input'
      }
      if (['DatePicker', 'TimePicker'].includes(component)) {
        schemaEvent = 'update:modelValue'
      }
      // 预处理事件事件的首字母大写
      const eventKey = `on${upperFirst(schemaEvent)}`
      // 重新定义参数
      const propsData: Recordable = {
        clearable: true, // 默认能清除
        size,
        ...unref(getComponentsProps),
        disabled: unref(getDisable)
      }
      // 绑定默认修改值的事件
      const on = {
        [eventKey]: (...args: Nullable<Recordable>[]) => {
          const [e] = args
          if (propsData[eventKey] && isFunction(propsData[eventKey])) {
            propsData[eventKey](...args)
          }
          props.setFormModel(field, e)
        }
      }

      const Comp = componentMap.get(component) as ReturnType<typeof defineComponent>

      const isCreatePlaceholder = !propsData.disabled && autoSetPlaceHolder
      const { type, isRange } = unref(getComponentsProps)
      const rangePicker =
        ('DatePicker' === component && type.includes('range')) || ('TimePicker' === component && isRange)
      if (isCreatePlaceholder && !rangePicker && component) {
        propsData.placeholder = unref(getComponentsProps)?.placeholder || createPlaceholderMessage(component)
      }

      propsData.codeField = field
      propsData.formValues = unref(getValues)

      const bindValue = {
        [valueField || 'modelValue']: props.formModel[field]
      }

      const compAttr = {
        ...propsData,
        ...on,
        ...bindValue
      }
      // 若 没有自定义 component 组件内的插槽
      if (!renderComponentContent) {
        return <Comp {...compAttr} />
      }
      const compSlot = isFunction(renderComponentContent)
        ? { ...renderComponentContent(unref(getValues)) }
        : {
            default: () => renderComponentContent
          }

      return <Comp {...compAttr}>{compSlot}</Comp>
    }

    const renderLabelHelpMessage = () => {
      const { label, helpMessage, helpComponentProps = {}, subLabel } = props.schema

      const renderLabel = subLabel ? (
        <span>
          {label} <span class="text-secondary">{subLabel}</span>
        </span>
      ) : (
        label
      )

      const getHelpMessage = isFunction(helpMessage) ? helpMessage(unref(getValues)) : helpMessage

      if (!getHelpMessage || (Array.isArray(getHelpMessage) && getHelpMessage.length === 0)) {
        return renderLabel
      }
      return (
        <span>
          {renderLabel} <BasicHelp placement="top" text={getHelpMessage} {...helpComponentProps} />
        </span>
      )
    }

    const renderItem = () => {
      const { itemProps, slot, render, field, suffix, component } = props.schema
      if (component === 'Divider') {
        return (
          <el-col span={24}>
            <el-divider {...unref(getComponentsProps)}>{renderLabelHelpMessage()}</el-divider>
          </el-col>
        )
      }

      const getContent = () => {
        return slot ? getSlot(Slots, slot, unref(getValues)) : render ? render(unref(getValues)) : renderComponent()
      }

      const showSuffix = !!suffix
      const getSuffix = isFunction(suffix) ? suffix(unref(getValues)) : suffix

      return (
        <el-form-item
          prop={field}
          class={{ 'suffix-name': showSuffix }}
          {...(itemProps as Recordable)}
          rules={handleRules()}
          v-slots={{
            label: () => renderLabelHelpMessage()
          }}
        >
          <div class="el-form-item__wrap">
            <div style="flex: 1">{getContent()}</div>
            {showSuffix && <span class="suffix">{getSuffix}</span>}
          </div>
        </el-form-item>
      )
    }

    return () => {
      const { colProps = {}, colSlot, renderColContent, component } = props.schema

      if (!componentMap.has(component)) return

      const { baseColProps = {} } = props.formProps
      const realColProps = { ...baseColProps, ...colProps }

      const { isIfShow, isShow } = getShow()

      const values = unref(getValues)
      const getContent = () => {
        return colSlot ? getSlot(Slots, colSlot, values) : renderColContent ? renderColContent(values) : renderItem()
      }

      return (
        isIfShow && (
          <el-col {...realColProps} v-show={isShow}>
            {getContent()}
          </el-col>
        )
      )
    }
  }
})
</script>

<style lang="scss" scoped>
.el-form-item__wrap {
  width: 100%;
  display: flex;
}
</style>
