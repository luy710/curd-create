import type { VNodeChild } from 'vue'

export interface FormItem {
  /**
   * Label test
   * 文本标签
   */
  label?: string | VNodeChild | JSX.Element

  /**
   * 标签宽度，例如 '50px'。 可以使用 auto。
   */
  labelWidth?: string | number

  /**
   * 是否为必填项，如不设置，则会根据校验规则确认
   */
  required?: boolean

  /**
   * 表单域验证错误时的提示信息。设置该值会导致表单验证状态变为 error，并显示该错误信息。
   */
  error?: string

  /**
   * 是否显示错误信息
   */
  showMessage?: boolean
  /**
   * 是否在行内显示校验信息
   */
  inlineMessage?: boolean
  /**
   * 用于控制该表单域下组件的默认尺寸
   */
  size?: 'large' | 'default' | 'small'
  /**
   * model 的键名。 它可以是一个路径数组(例如 ['a', 'b', 0])。 在定义了 validate、resetFields 的方法时，该属性是必填的
   */
  prop?: string | string[]
  /**
   * validation rules of form
   */
  rules?: object | object[]
}
