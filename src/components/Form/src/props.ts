import { FieldMapToTime, FormSchema } from './types/form'
import { ColEx } from './types'
import type { ButtonProps, RowProps } from 'element-plus'
import { TableActionType } from '@/components/Table/src/types/table'
import type { CSSProperties } from 'vue'

export const basicProps = {
  model: {
    type: Object as PropType<Recordable>,
    default: {}
  },
  // 标签宽度  固定宽度
  labelWidth: {
    type: [Number, String] as PropType<number | string>,
    default: 0
  },
  labelPosition: {
    type: String,
    validator: (val: string) => ['left', 'right', 'top'].includes(val),
    default: 'left'
  },
  labelSuffix: {
    type: String,
    default: ''
  },
  inline: {
    type: Boolean,
    default: false
  },
  showMessage: {
    type: Boolean,
    default: true
  },
  inlineMessage: {
    type: Boolean,
    default: false
  },
  hideRequiredAsterisk: {
    type: Boolean,
    default: false
  },
  statusIcon: {
    type: Boolean,
    default: false
  },
  scrollToError: {
    type: Boolean,
    default: false
  },
  // 日期格式
  fieldMapToTime: {
    type: Array as PropType<FieldMapToTime>,
    default: () => []
  },
  rowProps: {
    type: Object as PropType<RowProps>,
    default: () => ({})
  },
  // 是否开启紧凑型表单
  compact: {},
  // 表单配置规则
  schemas: {
    type: [Array] as PropType<FormSchema[]>,
    default: () => []
  },
  mergeDynamicData: {
    type: Object as PropType<Recordable>,
    default: () => ({})
  },
  baseRowStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => ({})
  },
  baseColProps: {
    type: Object as PropType<Partial<ColEx>>,
    default: () => ({})
  },
  autoSetPlaceHolder: {
    type: Boolean,
    default: true
  },
  // 在INPUT组件上单击回车时，是否自动提交
  autoSubmitOnEnter: {
    type: Boolean,
    default: false
  },
  submitOnReset: {
    type: Boolean,
    default: false
  },
  submitOnChange: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    validator: (val: string) => ['default', 'small', 'large'].includes(val),
    default: 'default'
  },
  // 禁用表单
  disabled: {
    type: Boolean,
    default: false
  },
  emptySpan: {
    type: [Number, Object] as PropType<number>,
    default: 0
  },
  // 是否显示收起展开按钮
  showAdvancedButton: {
    type: Boolean,
    default: false
  },
  // 转化时间
  transformDateFunc: {
    type: Function as PropType<Fn>,
    default: (date: any) => {
      return date?.format?.('YYYY-MM-DD HH:mm:ss') ?? date
    }
  },
  rulesMessageJoinLabel: {
    type: Boolean,
    default: true
  },
  // 超过3行自动折叠
  autoAdvancedLine: {
    type: Number,
    default: 3
  },
  // 不受折叠影响的行数
  alwaysShowLines: {
    type: Number,
    default: 1
  },

  // 是否显示操作按钮
  showActionButtonGroup: {
    type: Boolean,
    default: true
  },
  // 操作列Col配置
  actionColOptions: Object as PropType<Partial<ColEx>>,
  // 显示重置按钮
  showResetButton: {
    type: Boolean,
    default: true
  },
  // 是否聚焦第一个输入框，只在第一个表单项为input的时候作用
  autoFocusFirstItem: {
    type: Boolean,
    default: false
  },
  // 重置按钮配置
  resetButtonOptions: Object as PropType<Partial<ButtonProps>>,

  // 显示确认按钮
  showSubmitButton: {
    type: Boolean,
    default: true
  },
  // 确认按钮配置
  submitButtonOptions: Object as PropType<Partial<ButtonProps>>,

  // 自定义重置函数
  resetFunc: Function as PropType<() => Promise<void>>,
  submitFunc: Function as PropType<() => Promise<void>>,

  labelCol: Object as PropType<Partial<ColEx>>,

  tableAction: {
    type: Object as PropType<TableActionType>,
    default: () => ({})
  },

  wrapperCol: Object as PropType<Partial<ColEx>>
}
