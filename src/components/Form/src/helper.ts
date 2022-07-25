import { ComponentType } from './types/index'
import { Rule } from './types/form'
export function createPlaceholderMessage(component: ComponentType) {
  if (component.includes('Input') || component.includes('Complete')) {
    return '请输入'
  }
  if (component.includes('Picker')) {
    return '请选择'
  }
  if (
    component.includes('Select') ||
    component.includes('Cascader') ||
    component.includes('Checkbox') ||
    component.includes('Radio') ||
    component.includes('Switch')
  ) {
    // return `请选择${label}`;
    return '请选择'
  }
  return ''
}

const DATE_TYPE = ['DatePicker', 'TimePicker']

function genType() {
  return [...DATE_TYPE]
}

// 时间段类型的组件
export const dateItemType = genType()

export function setComponentRuleType(rule: Rule, component: ComponentType, valueFormat: string, type?: '') {
  if (['DatePicker', 'TimePicker'].includes(component)) {
    if (!type?.includes('range')) {
      rule.type = valueFormat ? 'string' : 'object'
    } else {
      rule.type = 'array'
    }
  } else if (['Upload', 'CheckboxGroup'].includes(component)) {
    rule.type = 'array'
  } else if (['InputNumber'].includes(component)) {
    rule.type = 'number'
  }
}
