# BasicForm表单 API

> 对 element-plus 的 form 组件进行封装，扩展一些常用的功能,如果文档内没有，可以尝试在在线示例内寻找

## 两种使用方式
### 1. useForm

> 通过useForm创建表单，并通过useForm hooks快速调用内部方法

```vue
<script lang="ts">
import { defineComponent } from 'vue'
import { ElMessage } from 'element-plus'
import { BasicForm, FormSchema, useForm } from '@/components/index'
import { areaRecord } from '@/api/demo/cascader'

const schemas: FormSchema[] = [
  {
    field: 'field1',
    component: 'Input',
    label: '字段1',
    colProps: {
      span: 8
    },
    componentProps: {
      placeholder: '自定义placeholder',
      onChange: (e: any) => {
        console.log(e)
      }
    }
  },
  {
    field: 'fieldTime',
    component: 'DatePicker',
    label: '时间字段',
    colProps: {
      span: 8
    },
    componentProps() {
      return {
        type: 'datetimerange',
        rangeSeparator: 'To',
        startPlaceholder: 'Start date',
        endPlaceholder: 'End date'
      }
    }
  },
]

export default defineComponent({
  components: { BasicForm },
  setup() {
    const [register, { setProps, setFieldsValue, updateSchema }] = useForm({
      labelWidth: 120,
      schemas,
      actionColOptions: {
        span: 24
      },
      fieldMapToTime: [['fieldTime', ['startTime', 'endTime'], 'YYYY-MM']]
    })

    async function handleLoad() {
      const promiseFn = function () {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              field9: ['430000', '430100', '430102'],
              province: '湖南省',
              city: '长沙市',
              district: '岳麓区'
            })
          }, 1000)
        })
      }

      const item = await promiseFn()

      const { field9, province, city, district } = item as any
      await updateSchema({
        field: 'field9',
        componentProps: {
          displayRenderArray: [province, city, district]
        }
      })
      await setFieldsValue({
        field9
      })
    }

    return {
      register,
      schemas,
      handleSubmit: (values: Recordable) => {
        ElMessage.success(`click search,values:${JSON.stringify(values)}`)
      },
      setProps,
      handleLoad
    }
  }
})
</script>

<template>
  <el-card title="UseForm操作示例">
    <div class="mb-4">
      <el-button class="mr-2" @click="setProps({ labelWidth: 150 })">
        更改labelWidth
      </el-button>
      <el-button class="mr-2" @click="setProps({ labelWidth: 120 })">
        还原labelWidth
      </el-button>
    </div>
    <el-card title="useForm示例">
      <BasicForm @register="register" @submit="handleSubmit" />
    </el-card>
  </el-card>
</template>
```
### 2. template
```vue
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { BasicForm, FormActionType, FormProps, FormSchema } from '@/components/index'

const schemas: FormSchema[] = [
]

export default defineComponent({
  components: { BasicForm },
  setup() {
    const formElRef = ref<Nullable<FormActionType>>(null)
    return {
      formElRef,
      schemas,
      setProps(props: FormProps) {
        const formEl = formElRef.value
        if (!formEl)
          return
        formEl.setProps(props)
      },
    }
  },
})
</script>

<template>
  <div class="m-4">
    <BasicForm
      ref="formElRef"
      :schemas="schemas"
      :label-width="100"
      :action-col-options="{ span: 24 }"
      @submit="handleSubmit"
    />
    <div />
  </div>
</template>
```

### 参数介绍

```ts
const [register, methods] = useForm(props)
```

**参数 props 内的值可以是 computed 或者 ref 类型**

**register**

register 用于注册 `useForm`，如果需要使用 `useForm` 提供的 api，必须将 register 传入组件的 `onRegister`

### BasicForm 内部方法

| 名称 | 说明 | 类型 |
| -- | -- | -- |
| submit| 表单提交，返回表单的所有提交数据 |`() => Promise<Recordable>` |
| setFieldsValue| 手动设置表单的值 |`<T>(values: T) => Promise<void>`|
| resetFields|重置表单| `() => Promise<void>` |
| getFieldsValue|获取表单的值 | `() => Recordable` |
| clearValidate| 清除所有的错误验证信息 | `(name?: string \| string[]) => Promise<void>`|
| updateSchema| 更新表单的一个&多个schema，仅需设置要更新的值，内部会做合并,新的field会做添加 | `(data: Partial<FormSchema> \| Partial<FormSchema>[]) => Promise<void>`|
| resetSchema|重置schema，该操作会替换原有的schema | `(data: Partial<FormSchema> \| Partial<FormSchema>[]) => Promise<void>`|
| setProps|设置Form的Props, 设置表单的 props 可以直接在标签上传递，也可以使用 setProps，或者初始化直接写 useForm(props) | `(formProps: Partial<FormProps>) => Promise<void>` |
| removeSchemaByFiled| 根据field删除schema | `(field: string \| string[]) => Promise<void>`|
| appendSchemaByField| 插入到指定 filed 后面，如果没传指定 field，则插入到最后,当 first = true 时插入到第一个位置 | `(schema: FormSchema, prefixField: string, first?: boolean) => Promise<void>`
| validateField | 验证一个或多个参数是否合规 | `(props?: FormItemProp) => Promise<any>`| 
| validate | 验证整个表单，并返回表单数据 | `() => Promise<Recordable>` |
| scrollToField| 滚动到指定的字段 | `(prop: FormItemProp) => void` |


使用示例
```ts
setProps({ labelWidth: 150 })

updateSchema([
  { field: 'filed', componentProps: { disabled: true } },
  { field: 'filed1', componentProps: { disabled: false } },
])
```

### BasicForm 属性
| 属性 | 说明 | 类型 | 默认值|
| -- | -- | -- | -- |
|model|表单数据对象| `Recordable<string, any>`|-|
|labelWidth|标签的长度，例如 '50px'。 作为 Form 直接子元素的 form-item 会继承该值。 可以使用 auto。| `number \| string`|-|
|labelPosition|表单域标签的位置， 当设置为 left 或 right 时，则也需要设置 label-width 属性| `'left' \| 'right' \| 'top'`|`'left'`|
|labelSuffix|表单域标签的后缀| `string`|-|
|inline|行内表单模式| `boolean`|`false`|
|showMessage|是否显示校验错误信息| `boolean`|`true`|
|inlineMessage|是否以行内形式展示校验信息| `boolean`|`false`|
|hideRequiredAsterisk|是否显示必填字段的标签旁边的红色星号| `boolean`|`false`|
|statusIcon|是否在输入框中显示校验结果反馈图标| `boolean`|`false`|
|scrollToError|当校验失败时，滚动到第一个错误表单项| `boolean`|`false`|
|rowProps|row配置参数| `Partial<RowProps>`|-|
|submitOnReset|点击重置表单时 触发一次查询| `boolean`|`false`|
|submitOnChange|表单变化时自动触发查询| `boolean`|`false`|
|baseRowStyle|配置所有 Row 的 style 样式| `CSSProperties`|-|
|baseColProps|配置所有选子项的 ColProps，不需要逐个配置，子项也可单独配置优先与全局 | - |`Partial<ColEx>`|-|
|schemas|表单配置，见下方 `FormSchema` 配置 | `FormSchema[]`|`[]`|
|mergeDynamicData|额外传递到子组件的参数 values| `Recordable`|`{}`|
|compact|紧凑类型表单，减少 margin-bottom| `boolean`|`false`|
|emptySpan|空白行格,可以是数值或者 col 对象 数| `number \| Partial<ColEx>`|`0`|
|size|向表单内所有组件传递 size 参数,自定义组件需自行实现 size 接收| `'default' \| 'small' \| 'large'`|`default`|
|disabled|向表单内所有组件传递 disabled 属性，自定义组件需自行实现 disabled 接收| `boolean`|`false`|
|fieldMapToTime|用于将表单内时间区域的应设成 2 个字段, 见下方说明| `FieldMapToTime`|-|
|autoSetPlaceHolder|自动设置表单内组件的 placeholder，自定义组件需自行实现| `boolean`|`true`|
|autoSubmitOnEnter|在input中输入时按回车自动提交| `boolean`|`false`|
|rulesMessageJoinLabel|如果表单项有校验，会自动生成校验信息，该参数控制是否将字段中文名字拼接到自动生成的信息后方| `boolean`|`true`|
|showAdvancedButton|是否显示收起展开按钮| `boolean`|`false`|
|autoFocusFirstItem|是否聚焦第一个输入框，只在第一个表单项为 input 的时候作用| `boolean`|`false`|
|autoAdvancedLine|如果 showAdvancedButton 为 true，超过指定行数行默认折叠| `number`|`3`|
|alwaysShowLines|折叠时始终保持显示的行数| `number`|`1`|
|showActionButtonGroup|是否显示操作按钮(重置/提交)| `boolean`|`true`|
|resetButtonOptions|重置按钮配置 见下方：ButtonOptions | `Partial<ButtonOptions>`|-|
|submitButtonOptions|确认按钮配置| `Partial<ButtonOptions>`|-|
|actionColOptions|操作按钮外层 Col 组件配置，如果开启 showAdvancedButton，则不用设置，| `Partial<ColEx>`|-|
|showResetButton|显示重置按钮| `boolean`|`true`|
|showSubmitButton|显示提交按钮| `boolean`|`true`|
|resetFunc|重置回调函数| `() => Promise<void>`|-|
|submitFunc|自定义提交按钮逻辑| `() => Promise<void>`|-|
|transformDateFunc|时间格式转换函数| `(date: any) => string`|`(date: any) => date?.format?.('YYYY-MM-DD HH:mm:ss') ?? date`|
|tableAction|table的内部方法| `Partial<TableActionType>`|-|

**ColEx**
```ts
type ColSpanType = number | string
export interface ColEx {
  style?: any
  span?: ColSpanType
  order?: ColSpanType
  flex?: ColSpanType
  offset?: ColSpanType
  push?: ColSpanType
  pull?: ColSpanType
  xs?: { span: ColSpanType; offset: ColSpanType } | ColSpanType
  sm?: { span: ColSpanType; offset: ColSpanType } | ColSpanType
  md?: { span: ColSpanType; offset: ColSpanType } | ColSpanType
  lg?: { span: ColSpanType; offset: ColSpanType } | ColSpanType
  xl?: { span: ColSpanType; offset: ColSpanType } | ColSpanType
  xxl?: { span: ColSpanType; offset: ColSpanType } | ColSpanType
}
```

**fieldMapToTime**

> 将表单内时间区域的值映射成 2 个字段
> 如果表单内有时间区间组件，获取到的值是一个数组，但是往往我们传递到后台需要是 2 个字段

类型： 
```ts
export type FieldMapToTime = [string, [string, string], string?][]
```
使用示例

```ts
useForm({
  fieldMapToTime: [
    // data为时间组件在表单内的字段，startTime，endTime为转化后的开始时间于结束时间
    // 'YYYY-MM-DD'为时间格式，参考moment
    ['datetime', ['startTime', 'endTime'], 'YYYY-MM-DD'],
    // 支持多个字段
    ['datetime1', ['startTime1', 'endTime1'], 'YYYY-MM-DD HH:mm:ss'],
  ],
});

// fieldMapToTime没写的时候表单获取到的值
{
  datetime: [Date(),Date()]
}
//  ['datetime', ['startTime', 'endTime'], 'YYYY-MM-DD'],之后
{
    datetime: [Date(),Date()],
    startTime: '2020-08-12',
    endTime: '2020-08-15',
}
```
**ButtonOptions**
```ts
import type { ButtonProps } from 'element-plus'

export type ButtonOptions = Partial<ButtonProps> & { innerTxt?: string }
```

### FormSchema

| 属性|说明 | 类型 | 默认值|
| -- | -- | -- | -- |
| field | 字段名称, 必填字段,支持x.x.x.x |  `string` | - |
| changeEvent | 表单更新事件名称 默认change | `string` | - |
| label | 标签名称, 必填字段 | string | - |
| subLabel | 二级标签 | string | - |
| helpMessage | 签名右侧的提示信息 | `string \| string[] \| (renderCallbackParams: RenderCallbackParams) => (string \| string[])` | - |
| helpComponentProps | 提示信息组件的props | `Partial<HelpComponentProps>` | - |
| labelWidth | 标签宽度, 会覆盖统一设置的 labelWidth | `string \| number` | - |
| component | 使用的组件, 必填字段 | `ComponentType` | - |
| componentProps | 组件的配置参数 |  `((opt: { schema: FormSchema, tableAction: TableActionType, formActionType: FormActionType, formModel: Recordable }) => Recordable) \| object` | - |
| required | 是否是必填 | `boolean \| ((renderCallbackParams: RenderCallbackParams) => boolean)` | `false` |
| suffix | 组件后缀文案 | `string \| number \| ((values: RenderCallbackParams) => (string \| number))` | - |
| rules | 验证规则 | `Rule[]` | - |
| rulesMessageJoinLabel | 校验信息是否加入 label | `boolean` | `false` |
| colProps | 参数的col 配置, 会覆盖统一设置的baseColProps | `Partial<ColEx>` | - |
| defaultValue | 默认值 | any | - |
| isAdvanced | 展开收起 | `boolean` | `false` |
| ifShow| 是否加载 | `boolean \| ((renderCallbackParams: RenderCallbackParams) => boolean)` | - |
| show | 加载后是否显示 | `boolean \| ((renderCallbackParams: RenderCallbackParams) => boolean)` | - |
| render | 自定义渲染form-item的标签内容 | `(renderCallbackParams: RenderCallbackParams) => VNode \| VNode[] \| string` | - | 
| renderColContent | 自定义渲染 col的内容包括form-item | `(renderCallbackParams: RenderCallbackParams) => VNode \| VNode[] \| string` | - | 
| renderComponentContent | 自定义渲染组内部的 slot | `((renderCallbackParams: RenderCallbackParams) => any) \| VNode \| VNode[] \| string` | - |
| slot | formItem内的自定义插槽 | `string` | - |
| colSlot | col下的自定义插槽与renderColContent类似 | string | - |
| dynamicDisabled | 动态禁用 | `boolean \| ((renderCallbackParams: RenderCallbackParams) => boolean)` | - |
| dynamicRules | 动态规则验证 | `(renderCallbackParams: RenderCallbackParams) => Rule[]` | - |


**RenderCallbackParams**
```ts
export interface RenderCallbackParams {
  schema: FormSchema
  values: Recordable
  model: Recordable
  field: string
}
```

**componentProps**

- 当值为对象类型时,该对象将作为`component`所对应组件的的 props 传入组件

- 当值为一个函数时候

参数有 4 个

`schema`: 表单的整个 schemas

`formActionType`: 操作表单的函数。与 useForm 返回的操作函数一致

`formModel`: 表单的双向绑定对象，这个值是响应式的。所以可以方便处理很多操作

`tableAction`: 操作表格的函数，与 useTable 返回的操作函数一致。注意该参数只在表格内开启搜索表单的时候有值，其余情况为`null`,

```tsx
{
  // 简单例子，值改变的时候操作表格或者修改表单内其他元素的值
  component:'Input',
  componentProps: ({ schema, tableAction, formActionType, formModel }) => {
    return {
      // xxxx props
      onChange:(e)=>{
        const {reload}=tableAction
        reload()
        // or
        formModel.xxx='123'
      }
    };
  };
}
```

**HelpComponentProps**

```ts
export interface HelpComponentProps {
  maxWidth: string
  // 是否显示序号
  showIndex: boolean
  // 文本列表
  text: any
  // 颜色
  color: string
  // 字体大小
  fontSize: string
  icon: string
  absolute: boolean
  // 定位
  position: any
}
```

**ComponentType**

schema 内组件的可选类型

```tsx
export type ComponentType =
  | 'Input'
  | 'ColorPicker'
  | 'Slider'
  | 'Rate'
  | 'Divider'
  | 'InputNumber'
  | 'Select'
  | 'Checkbox'
  | 'CheckboxGroup'
  | 'Cascader'
  | 'DatePicker'
  | 'TimeSelect'
  | 'TimePicker'
  | 'Switch'
  | 'Radio'
  | 'RadioGroup'
  | 'TreeSelect'
  | 'Tree'
  | 'Transfer'
  | 'AutoComplete'
```

### Divider schema说明
`Divider`类型用于在`schemas`中占位，将会渲染成一个分割线（始终占一整行的版面），可以用于较长表单的版面分隔。请只将Divider类型的schema当作一个分割线，而不是一个常规的表单字段。
- **`Divider`仅在`showAdvancedButton`为false时才会显示**（也就是说如果启用了表单收起和展开功能，`Divider`将不会显示）
- `Divider` 使用`schema`中的`label`以及`helpMessage`来渲染分割线中的提示内容
- `Divider` 可以使用`componentProps`来设置除`type`之外的props
- `Divider` 不会渲染`AFormItem`，因此`schema`中除`label`、`componentProps`、`helpMessage`、`helpComponentProps`以外的属性不会被用到


### 自定义内容渲染 （render & renderComponentContent & slot）

```vue
<script lang="ts">
import { defineComponent, h } from 'vue'
import { ElInput, ElMessage } from 'element-plus'
import { BasicForm, FormSchema, useForm } from '@/components/index'

const schemas: FormSchema[] = [
  {
    field: 'field1',
    component: 'Input',
    label: 'render方式',
    colProps: {
      span: 8
    },
    rules: [{ required: true }],
    render: ({ model, field }) => {
      return h(ElInput, {
        placeholder: '请输入',
        modelValue: model[field],
        onInput: (value: any) => {
          model[field] = value
        }
      })
    }
  },
  {
    field: 'field2',
    component: 'Input',
    label: 'render组件slot',
    colProps: {
      span: 8
    },
    rules: [{ required: true }],
    renderComponentContent: () => {
      return {
        suffix: () => 'suffix'
      }
    }
  },
  {
    field: 'field3',
    component: 'Input',
    label: '自定义Slot',
    slot: 'f3',
    colProps: {
      span: 8
    },
    rules: [{ required: true }]
  }
]
export default defineComponent({
  components: { BasicForm },
  setup() {
    const [register, { setProps }] = useForm({
      labelWidth: 120,
      schemas,
      actionColOptions: {
        span: 24
      }
    })
    return {
      register,
      schemas,
      handleSubmit: (values: any) => {
        ElMessage.success(`click search,values:${JSON.stringify(values)}`)
      },
      setProps
    }
  }
})
</script>

<template>
  <el-card title="自定义表单">
    <BasicForm @register="register" @submit="handleSubmit">
      <template #f3="{ model, field }">
        <el-input v-model="model[field]" placeholder="自定义slot" />
      </template>
    </BasicForm>
  </el-card>
</template>
```

### ifShow/show/dynamicDisabled

自定义显示/禁用

```vue
<script lang="ts">
import { defineComponent } from 'vue'
import { BasicForm, FormSchema, useForm } from '@/components/index'

const schemas: FormSchema[] = [
  {
    field: 'field1',
    component: 'Input',
    label: '字段1',
    colProps: {
      span: 8,
    },
    show: ({ values }) => {
      return !!values.field5
    },
  },
  {
    field: 'field2',
    component: 'Input',
    label: '字段2',
    colProps: {
      span: 8,
    },
    ifShow: ({ values }) => {
      return !!values.field6
    },
  },
  {
    field: 'field3',
    component: 'DatePicker',
    label: '字段3',
    colProps: {
      span: 8,
    },
    dynamicDisabled: ({ values }) => {
      return !!values.field7
    },
  },
]

export default defineComponent({
  components: { BasicForm },
  setup() {
    const [register, { setProps }] = useForm({
      labelWidth: 120,
      schemas,
      actionColOptions: {
        span: 24,
      },
    })
    return {
      register,
      schemas,
      setProps,
    }
  },
})
</script>

<template>
  <div class="m-4">
    <BasicForm @register="register" />
  </div>
</template>
```

### BasicForm插槽

| 名称          | 说明         |
| ------------- | ------------ |
| formFooter    | 表单底部区域 |
| formHeader    | 表单顶部区域 |
| resetBefore   | 重置按钮前   |
| submitBefore  | 提交按钮前   |
| advanceBefore | 展开按钮前   |
| advanceAfter  | 展开按钮后   |


## ApiSelect
> 远程下拉加载组件

### 使用示例

```html
  <template>
    <ApiSelect
      :api="api"
      :modelValue="value"
      :collapseTags="true"
      :collapseTagsTooltip="true"
      :multiple="true"
      :params="{name: 1}"
      :afterFetch="(params) => params"
      :beforeFetch="(params) => params"
      @change="(params) => (model[field] = params)"
    />
  </template>
  <script lang="ts" setup>
    import ApiSelect from '@/components/Form/components/ApiSelect.vue'
    const value = ref<Recordable[]>([])
    const api = (params) => new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([{
          value: '1',
          label: '1'
        }])
      }, 1000)
    })
  </script>
```

### props

|属性	|类型	|默认值	|说明|
|:-|:-|:-|:-|
| api |	`(args?: Recordable) => Promise<OptionsItem>`|	-	| 数据接口，接受一个 Promise 对象 |
| numberToString | `boolean` | `false` | 是否将value数字转换为字符串 |
| params |	`object`	| -	| 接口参数。此属性改变时会自动重新加载接口数据 |
| modelValue | `any`| - | 双向绑定的key |
| resultField| `string` |	-	|接口返回的字段，如果接口返回数组，可以不填。支持x.x.x格式 |
| labelField|	`string` | `label`| 下拉数组项内label显示文本的字段，支持x.x.x格式 |
| valueField| `string` | `value`| 下拉数组项内value实际值的字段，支持x.x.x格式 |
| groupField | `string` | `options` | 选项组，支持x.x.x格式 |
| immediate | `boolean` | `false` | 是否立即请求 |
| alwaysLoad | `boolean` | `false` | 是否每一次打开popover都重新请求 |
| isGroup | `boolean` | `false` | 是不是分组选项 |
| options | `Recordable[]` | `[]` | 下拉框的静态选项数据 |
| afterFetch | `(params: Recordable) => Recordable` | - | 请求之后返回参数处理|
| beforeFetch | `(params: Recordable) => Recordable` | - | 请求前参数处理|


### 事件
| 事件名称 |	说明 |	回调参数 |
| -- | -- | -- |
| options-change |	options变化后的回调 | 	`() => Recordable[]` |
| change |	value变化后的回调 | 	`() => any` |

## CheckboxGroup
> 自定义多选组

### 使用示例

```vue
<script lang="ts" setup>
import CheckboxGroup from '@/components/Form/components/CheckboxGroup.vue'

const value = ref([])
</script>

<template>
  <CheckboxGroup
    model-value="value"
    :is-btn="true"
    :options="[
      {
        label: "选项1',
    value: '1',
    key: '1'
    },
    {
    label: '选项2',
    value: '2',
    key: '2'
    }
    ]'
  />
</template>
```

### Props

|属性	|类型	|默认值	|说明|
|:-|:-|:-|:-|
| modelValue | `any`| - | 双向绑定的key |
| options | `Recordable[]` | `[]` | Checkbox列表 |
| isBtn |	`boolean`	| `false`	| 是否是button类型的多选CheckBox |


## RadioGroup
> 自定义单选组

### 使用示例

```vue
<script lang="ts" setup>
import RadioGroup from '@/components/Form/components/RadioGroup.vue'

const value = ref([])
</script>

<template>
  <RadioGroup
    model-value="value"
    :is-btn="true"
    :options="[
      {
        label: "选项1',
    value: '1',
    key: '1'
    },
    {
    label: '选项2',
    value: '2',
    key: '2'
    }
    ]'
  />
</template>
```

### Props

|属性	|类型	|默认值	|说明|
|:-|:-|:-|:-|
| modelValue | `any`| - | 双向绑定的key |
| options | `Recordable[]` | `[]` | 单选列表 |
| isBtn |	`boolean`	| `false`	| 是否是button类型的多选单选 |