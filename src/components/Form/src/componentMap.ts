import type { Component } from 'vue'
import type { ComponentType } from './types/index'

/**
 * 组件列表
 */
import {
  ElInput,
  ElColorPicker,
  ElRadio,
  ElCheckbox,
  ElAutocomplete,
  ElCascader,
  ElDatePicker,
  ElTimePicker,
  ElTimeSelect,
  ElInputNumber,
  ElSwitch,
  ElTreeSelect,
  ElSlider,
  ElRate,
  ElDivider,
  ElTreeV2,
  ElTransfer
} from 'element-plus'

import RadioGroup from './components/RadioGroup.vue'
import ApiSelect from './components/ApiSelect.vue'
import CheckboxGroup from './components/CheckboxGroup.vue'
// import { BasicUpload } from '/@/components/Upload'
// import { StrengthMeter } from '/@/components/StrengthMeter'
// import { IconPicker } from '/@/components/Icon'

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
