import type { Component } from 'vue'
import {
  ElAutocomplete,
  ElCascader,
  ElCheckbox,
  ElColorPicker,
  ElDatePicker,
  ElDivider,
  ElInput,
  ElInputNumber,
  ElRadio,
  ElRate,
  ElSlider,
  ElSwitch,
  ElTimePicker,
  ElTimeSelect,
  ElTransfer,
  ElTreeSelect,
  ElTreeV2,
} from 'element-plus'
import type { ComponentType } from './types/index'

/**
 * 组件列表
 */

import RadioGroup from './components/RadioGroup.vue'
import ApiSelect from './components/ApiSelect.vue'
import CheckboxGroup from './components/CheckboxGroup.vue'

const componentMap = new Map<ComponentType, Component>()

componentMap.set('Input', ElInput)
componentMap.set('ColorPicker', ElColorPicker)
componentMap.set('InputNumber', ElInputNumber)
componentMap.set('AutoComplete', ElAutocomplete)
componentMap.set('Select', ApiSelect)
componentMap.set('Checkbox', ElCheckbox)
componentMap.set('CheckboxGroup', CheckboxGroup)
componentMap.set('Radio', ElRadio)
componentMap.set('RadioGroup', RadioGroup)
componentMap.set('Tree', ElTreeV2)
componentMap.set('TreeSelect', ElTreeSelect)
componentMap.set('Switch', ElSwitch)
componentMap.set('Cascader', ElCascader)
componentMap.set('Slider', ElSlider)
componentMap.set('Rate', ElRate)
componentMap.set('DatePicker', ElDatePicker)
componentMap.set('TimePicker', ElTimePicker)
componentMap.set('TimeSelect', ElTimeSelect)
componentMap.set('Transfer', ElTransfer)
componentMap.set('Divider', ElDivider)

export function add(compName: ComponentType, component: Component) {
  componentMap.set(compName, component)
}

export function del(compName: ComponentType) {
  componentMap.delete(compName)
}

export { componentMap }
