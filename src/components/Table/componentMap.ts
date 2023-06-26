import type { Component } from 'vue'
import { ElAutocomplete, ElCheckbox, ElCheckboxGroup, ElDatePicker, ElInput, ElInputNumber, ElRadioGroup, ElSwitch, ElTimePicker, ElTreeSelect } from 'element-plus'
import type { ComponentType } from './types/componentType'
import ApiSelect from '@/components/Form/components/ApiSelect.vue'

const componentMap = new Map<ComponentType, Component>()

componentMap.set('Input', ElInput)
componentMap.set('InputNumber', ElInputNumber)
componentMap.set('Select', ApiSelect)
componentMap.set('AutoComplete', ElAutocomplete)
componentMap.set('TreeSelect', ElTreeSelect)
componentMap.set('Switch', ElSwitch)
componentMap.set('Checkbox', ElCheckbox)
componentMap.set('DatePicker', ElDatePicker)
componentMap.set('TimePicker', ElTimePicker)
componentMap.set('CheckboxGroup', ElCheckboxGroup)
componentMap.set('RadioGroup', ElRadioGroup)

export function add(compName: ComponentType, component: Component) {
  componentMap.set(compName, component)
}

export function del(compName: ComponentType) {
  componentMap.delete(compName)
}

export { componentMap }
