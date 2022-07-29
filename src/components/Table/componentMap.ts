import type { Component } from 'vue'
import { ElInput, ElAutocomplete, ElInputNumber, ElSwitch, ElCheckbox, ElDatePicker, ElTimePicker } from 'element-plus'
import { ComponentType } from './types/componentType'
import ApiSelect from '@/components/Form/components/ApiSelect.vue'
const componentMap = new Map<ComponentType, Component>()

componentMap.set('Input', ElInput)
componentMap.set('InputNumber', ElInputNumber)
componentMap.set('Select', ApiSelect)
componentMap.set('AutoComplete', ElAutocomplete)
// componentMap.set('ApiTreeSelect', ApiTreeSelect);
componentMap.set('Switch', ElSwitch)
componentMap.set('Checkbox', ElCheckbox)
componentMap.set('DatePicker', ElDatePicker)
componentMap.set('TimePicker', ElTimePicker)

export function add(compName: ComponentType, component: Component) {
  componentMap.set(compName, component)
}

export function del(compName: ComponentType) {
  componentMap.delete(compName)
}

export { componentMap }
