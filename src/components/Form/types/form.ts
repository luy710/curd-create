import type { CSSProperties, VNode } from 'vue'
import type { ColEx, ComponentType } from './index'
import type { ButtonProps, RowProps, FormItemRule, FormItemProp } from 'element-plus'
import { TableActionType } from '@/components/Table/types/table'

export type ButtonOptions = Partial<ButtonProps> & { innerTxt?: string }
export type FieldMapToTime = [string, [string, string], string?][]
export type Rule = FormItemRule & {
  trigger?: 'blur' | 'change' | ['change', 'blur']
}

export interface RenderCallbackParams {
  schema: FormSchema
  values: Recordable
  model: Recordable
  field: string
}
export type RegisterFn = (formInstance: FormActionType) => void
export type UseFormReturnType = [RegisterFn, FormActionType]
export type NamePath = string | number | string | number[]

export interface FormActionType {
  submit: () => Promise<void>
  setFieldsValue: <T>(values: T) => Promise<void>
  resetFields: () => Promise<void>
  getFieldsValue: () => Recordable
  clearValidate: (name?: string | string[]) => Promise<void>
  updateSchema: (data: Partial<FormSchema> | Partial<FormSchema>[]) => Promise<void>
  resetSchema: (data: Partial<FormSchema> | Partial<FormSchema>[]) => Promise<void>
  setProps: (formProps: Partial<FormProps>) => Promise<void>
  removeSchemaByFiled: (field: string | string[]) => Promise<void>
  appendSchemaByField: (
    schema: FormSchema,
    prefixField: string | undefined,
    first?: boolean | undefined
  ) => Promise<void>
  validateField: (props?: FormItemProp, callback?: (isValid: boolean, invalidFields?: any) => void) => Promise<any>
  validate: () => Promise<Recordable>
  scrollToField: (prop: FormItemProp) => void
}

// 表单参数类型
export interface FormProps {
  // 表单数据
  model?: Recordable
  // label宽度
  labelWidth?: number | string
  // 表单域标签的位置， 当设置为 left 或 right 时，则也需要设置 label-width 属性
  labelPosition?: 'left' | 'right' | 'top'
  // 表单域标签的后缀
  labelSuffix?: string
  // 行内表单模式
  inline?: boolean
  // 是否显示校验错误信息
  showMessage?: boolean
  // 是否以行内形式展示校验信息
  inlineMessage?: boolean
  // 是否显示必填字段的标签旁边的红色星号
  hideRequiredAsterisk?: boolean
  // 是否在输入框中显示校验结果反馈图标
  statusIcon?: boolean
  // 当校验失败时，滚动到第一个错误表单项
  scrollToError?: boolean
  // row配置参数
  rowProps?: Partial<RowProps>
  // 点击重置表单时 触发一次查询
  submitOnReset?: boolean
  // 表单变化时自动触发查询
  submitOnChange?: boolean
  // 基础单行样式
  baseRowStyle?: CSSProperties
  // 基础col配置
  baseColProps?: Partial<ColEx>
  // 表单参数
  schemas?: FormSchema[]
  // 额外传递到子组件的参数 values
  mergeDynamicData?: Recordable
  // 紧凑类型表单，减少 margin-bottom
  compact?: boolean
  // 空白行格,可以是数值或者 col 对象 数
  emptySpan?: number | Partial<ColEx>
  // 向表单内所有组件传递 size 参数,自定义组件需自行实现 size 接收
  size?: 'default' | 'small' | 'large'
  // 向表单内所有组件传递 disabled 属性，自定义组件需自行实现 disabled 接收
  disabled?: boolean
  // 用于将表单内时间区域的应设成 2 个字段, 见下方说明
  fieldMapToTime?: FieldMapToTime
  // 自动设置表单内组件的 placeholder，自定义组件需自行实现
  autoSetPlaceHolder?: boolean
  // 在input中输入时按回车自动提交
  autoSubmitOnEnter?: boolean
  // 如果表单项有校验，会自动生成校验信息，该参数控制是否将字段中文名字拼接到自动生成的信息后方
  rulesMessageJoinLabel?: boolean
  // 是否显示收起展开按钮
  showAdvancedButton?: boolean
  // 是否聚焦第一个输入框，只在第一个表单项为 input 的时候作用
  autoFocusFirstItem?: boolean
  // 	如果 showAdvancedButton 为 true，超过指定行数行默认折叠
  autoAdvancedLine?: number
  // 折叠时始终保持显示的行数
  alwaysShowLines?: number
  // 是否显示操作按钮(重置/提交)
  showActionButtonGroup?: boolean
  // R重置按钮配置见
  resetButtonOptions?: Partial<ButtonOptions>
  // 确认按钮配置
  submitButtonOptions?: Partial<ButtonOptions>
  // 操作按钮外层 Col 组件配置，如果开启 showAdvancedButton，则不用设置，
  actionColOptions?: Partial<ColEx>
  // 显示重置按钮
  showResetButton?: boolean
  // 显示提交按钮
  showSubmitButton?: boolean
  // 重置回调函数
  resetFunc?: () => Promise<void>
  // 提交回调函数
  submitFunc?: () => Promise<void>
  // 时间格式转换函数
  transformDateFunc?: (date: any) => string
  // table的内部方法
  tableAction?: Partial<TableActionType>
}

export interface FormSchema {
  // 字段名称
  field: string
  // 表单更新事件名称 默认change
  changeEvent?: string
  // 双向绑定的key，默认value
  valueField?: string
  // 标签名称
  label: string
  // 二级标签
  subLabel?: string
  // 提示信息
  helpMessage?: string | string[] | ((renderCallbackParams: RenderCallbackParams) => string | string[])
  // 提示信息组件的props
  helpComponentProps?: Partial<HelpComponentProps>
  // 标签宽度
  labelWidth?: string | number
  // 使用的组件
  component: ComponentType
  // 组件的配置参数
  componentProps?:
    | ((opt: {
        schema: FormSchema
        tableAction: TableActionType
        formActionType: FormActionType
        formModel: Recordable
      }) => Recordable)
    | object
  // Required
  required?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean)
  suffix?: string | number | ((values: RenderCallbackParams) => string | number)
  // Validation rules
  rules?: Rule[]
  // 校验信息是否加入 label
  rulesMessageJoinLabel?: boolean
  // 参数的col 配置
  colProps?: Partial<ColEx>
  // 默认值
  defaultValue?: any
  // error
  error?: string
  // 是否显示校验错误信息
  showMessage?: boolean
  // 是否在行内显示校验信息
  inlineMessage?: boolean
  // 用于控制该表单域下组件的默认尺寸	 'default'
  size?: 'large' | 'default' | 'small'
  isAdvanced?: boolean
  // 是否加载
  ifShow?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean)
  // 加载后是否显示
  show?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean)
  // 自定义渲染
  render?: (renderCallbackParams: RenderCallbackParams) => VNode | VNode[] | string
  // 自定义渲染 col
  renderColContent?: (renderCallbackParams: RenderCallbackParams) => VNode | VNode[] | string
  // 自定义渲染组件内容
  renderComponentContent?: ((renderCallbackParams: RenderCallbackParams) => any) | VNode | VNode[] | string
  // Custom slot, in from-item
  slot?: string
  // Custom slot, similar to renderColContent
  colSlot?: string
  // 动态禁用
  dynamicDisabled?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean)
  // 动态规则验证
  dynamicRules?: (renderCallbackParams: RenderCallbackParams) => Rule[]
}

export interface HelpComponentProps {
  maxWidth: string
  // Whether to display the serial number
  showIndex: boolean
  // Text list
  text: any
  // colour
  color: string
  // font size
  fontSize: string
  icon: string
  absolute: boolean
  // Positioning
  position: any
  
  placement: string
}
