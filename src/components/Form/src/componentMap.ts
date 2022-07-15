import type { Component } from 'vue'
import type { ComponentType } from './types/index'

/**
 * 组件列表
 */
import {
  ElInput,
  ElSelect,
  ElRadio,
  ElCheckbox,
  ElAutocomplete,
  ElCascader,
  ElDatePicker,
  ElInputNumber,
  ElSwitch,
  ElTimePicker,
  ElTreeSelect,
  ElSlider,
  ElRate,
  ElDivider
} from 'element-plus'

import ApiRadioGroup from './components/ApiRadioGroup.vue'
import RadioButtonGroup from './components/RadioButtonGroup.vue'
import ApiSelect from './components/ApiSelect.vue'
import ApiTree from './components/ApiTree.vue'
import ApiTreeSelect from './components/ApiTreeSelect.vue'
import ApiCascader from './components/ApiCascader.vue'
// import { BasicUpload } from '/@/components/Upload'
// import { StrengthMeter } from '/@/components/StrengthMeter'
// import { IconPicker } from '/@/components/Icon'
// import { CountdownInput } from '/@/components/CountDown'

const componentMap = new Map<ComponentType, Component>()

componentMap.set('Input', ElInput)
componentMap.set('InputNumber', ElInputNumber)
componentMap.set('AutoComplete', ElAutocomplete)

componentMap.set('Select', ElSelect)
componentMap.set('ApiSelect', ApiSelect)
componentMap.set('ApiTree', ApiTree)
componentMap.set('TreeSelect', ElTreeSelect)
componentMap.set('ApiTreeSelect', ApiTreeSelect)
componentMap.set('ApiRadioGroup', ApiRadioGroup)
componentMap.set('Switch', ElSwitch)
componentMap.set('RadioButtonGroup', RadioButtonGroup)
componentMap.set('RadioGroup', ElRadio.Group)
componentMap.set('Checkbox', ElCheckbox)
componentMap.set('CheckboxGroup', ElCheckbox.Group)
componentMap.set('ApiCascader', ApiCascader)
componentMap.set('Cascader', ElCascader)
componentMap.set('Slider', ElSlider)
componentMap.set('Rate', ElRate)

componentMap.set('DatePicker', ElDatePicker)
componentMap.set('MonthPicker', ElDatePicker.MonthPicker)
componentMap.set('RangePicker', ElDatePicker.RangePicker)
componentMap.set('WeekPicker', ElDatePicker.WeekPicker)
componentMap.set('TimePicker', ElTimePicker)
// componentMap.set('StrengthMeter', StrengthMeter)
// componentMap.set('IconPicker', IconPicker)
// componentMap.set('InputCountDown', CountdownInput)

// componentMap.set('Upload', BasicUpload)
componentMap.set('Divider', ElDivider)

export function add(compName: ComponentType, component: Component) {
  componentMap.set(compName, component)
}

export function del(compName: ComponentType) {
  componentMap.delete(compName)
}

export { componentMap }
