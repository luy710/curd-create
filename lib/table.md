# BasicTable 表格

> 对 element-plus 的 table 组件进行封装，扩展一些常用的功能, 同时融合了BasicForm 如果文档内没有，可以尝试在在线示例内寻找


## 使用示例

### template示例

**基础使用**
```vue
<template>
  <div class="p-4">
    <BasicTable
      title="基础示例"
      titleHelpMessage="温馨提醒"
      :columns="columns"
      :data="data"
      :canResize="canResize"
      :loading="loading"
      :stripe="striped"
      :border="border"
      :pagination="{ pageSize: 20 }"
    >
      <template #toolbar>
        <a-button type="primary"> 操作按钮 </a-button>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicTable } from '@/components/index';
  import { getBasicColumns, getBasicData } from './tableData';

  export default defineComponent({
    components: { BasicTable },
    setup() {
      return {
        columns: getBasicColumns(),
        data: getBasicData(),
      };
    },
  });
</script>
```
**使用API调用接口**
  
`Methods`使用，所有methods见下方：

```vue
<template>
  <div class="p-4">
    <BasicTable
      :canResize="false"
      title="RefTable示例"
      titleHelpMessage="使用Ref调用表格内方法"
      ref="tableRef"
      :api="api"
      :columns="columns"
      :beforeFetch="beforeFetch"
      :afterFetch="afterFetch"
      rowKey="id"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { BasicTable, TableActionType } from '@/components/index';
  import { getBasicColumns, getBasicShortColumns } from './tableData';
  import { demoListApi } from '@/api/demo/table';
  export default defineComponent({
    components: { BasicTable },
    setup() {
      const tableRef = ref<Nullable<TableActionType>>(null);

      function getTableAction() {
        const tableAction = unref(tableRef);
        if (!tableAction) {
          throw new Error('tableAction is null');
        }
        return tableAction;
      }
      function changeLoading() {
        getTableAction().setLoading(true);
        setTimeout(() => {
          getTableAction().setLoading(false);
        }, 1000);
      }
      return {
        tableRef,
        api: demoListApi,
        columns: getBasicColumns(),
        beforeFetch: (params: Recordable) => params,
        afterFetch: (params: Recordable) => params,
        changeLoading,
      };
    },
  });
</script>
```


### BasicColumn 和 tableAction 通过权限和业务控制显示隐藏的示例

```vue
<template>
  <div class="p-4">
    <BasicTable
      title="基础示例"
      titleHelpMessage="温馨提醒"
      :columns="columns"
      :data="data"
      :canResize="canResize"
      :loading="loading"
      :stripe="striped"
      :border="border"
      showTableSetting
      :pagination="pagination"
      @columns-change="handleColumnChange"
    >
      <template #toolbar>
        <el-button size="small" type="primary" @click="toggleCanResize">
          {{ !canResize ? '自适应高度' : '取消自适应' }}
        </el-button>
        <el-button size="small" type="primary" @click="toggleBorder">
          {{ !border ? '显示边框' : '隐藏边框' }}
        </el-button>
        <el-button size="small" type="primary" @click="toggleLoading"> 开启loading </el-button>
        <el-button size="small" type="primary" @click="toggleStriped">
          {{ !striped ? '显示斑马纹' : '隐藏斑马纹' }}
        </el-button>
        <el-button size="small" type="primary" @click="togglePagination">
          {{ pagination ? '关闭分页' : '开启分页' }}
        </el-button>
      </template>
      <template #action="scope">
        <TableAction
          :actions="[
            {
              label: '编辑',
              onClick: () => {},
              icon: inconFun,
              popConfirm: {
                title: '是否启用？',
                confirm: configTest
              }
            },
            {
              label: '删除',
              color: 'error',
              popConfirm: {
                title: '是否确认删除',
                placement: 'left',
                confirm: () => {}
              }
            }
          ]"
          :dropDownActions="[
            {
              label: '启用',
              popConfirm: {
                title: '是否启用？',
                confirm: () => {}
              },
              ifShow: () => {
                return scope.row.status !== 'enable'
              }
            },
            {
              label: '禁用',
              popConfirm: {
                title: '是否禁用？',
                confirm: () => {}
              },
              ifShow: () => {
                return scope.row.status === 'enable'
              }
            },
            {
              label: '同时控制',
              popConfirm: {
                title: '是否动态显示？',
                confirm: () => {}
              },
              ifShow: () => {
                return true
              }
            }
          ]"
        />
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h } from 'vue'
import { BasicTable, ColumnChangeParam, TableAction } from '@/components/index'
import { getBasicColumns, getBasicData } from './tableData'
import { Edit } from '@element-plus/icons-vue'
export default defineComponent({
  components: { BasicTable, TableAction, Edit },
  setup() {
    const canResize = ref(false)
    const loading = ref(false)
    const striped = ref(true)
    const border = ref(true)
    const pagination = ref<any>(false)
    function toggleCanResize() {
      canResize.value = !canResize.value
    }
    function toggleStriped() {
      striped.value = !striped.value
    }
    function toggleLoading() {
      loading.value = true
      setTimeout(() => {
        loading.value = false
        pagination.value = { pageSize: 20 }
      }, 3000)
    }
    function toggleBorder() {
      border.value = !border.value
    }

    function handleColumnChange(data: ColumnChangeParam[]) {
      console.log('ColumnChanged', data)
    }

    const togglePagination = () => {
      pagination.value = !pagination.value
    }

    const inconFun = () => {
      return h(Edit)
    }

    const configTest = () => {
      console.log('ConfigTest', getBasicColumns())
    }
    return {
      columns: getBasicColumns(),
      data: getBasicData(),
      configTest,
      canResize,
      loading,
      striped,
      border,
      toggleStriped,
      toggleCanResize,
      toggleLoading,
      toggleBorder,
      pagination,
      handleColumnChange,
      togglePagination,
      inconFun
    }
  }
})
</script>

```

## useTable

使用组件自带的 **useTable** 可以方便使用表单

下面是一个使用简单表格的示例，

```vue
<template>
  <BasicTable @register="registerTable" />
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable } from '@/components/index';
  import { getBasicColumns, getBasicShortColumns } from './tableData';
  import { demoListApi } from '@/api/demo/table';
  export default defineComponent({
    components: { BasicTable },
    setup() {
      const [
        registerTable,
        {
          setLoading,
        },
      ] = useTable({
        api: demoListApi,
        columns: getBasicColumns(),
      });

      function changeLoading() {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
      
      return {
        registerTable,
        changeLoading,
      };
    },
  });
</script>
```

### Usage

用于调用 Table 内部方法及 table 参数配置

```ts
// 表格的props也可以直接注册到useTable内部
const [register, methods] = useTable(props);
```

**register**

register 用于注册 useTable，如果需要使用`useTable`提供的 api，必须将 register 传入组件的 onRegister

```vue
<template>
  <BasicTable @register="register" />
</template>
<script>
  export default defineComponent({
    components: { BasicForm },
    setup() {
      const [register] = useTable();
      return { register };
    },
  });
</script>
```

## BasicTable 方法

| 方法名称 | 说明 | 类型 |
| -- | -- | -- |
| reload | 刷新列表, `FetchParams`见下方 | `(opt?: FetchParams) => Promise<void>` |
| setPagination | 设置分页信息 | `(info: Partial<PaginationProps>) => void` | 
| setTableData | 设置表格源数据 | `<T = Recordable>(values: T[]) => void` |
| updateTableDataRecord | 根据rowkey找到该条数据，并替换内部某个参数 | `(rowKey: string \| number, record: Recordable) => Recordable \| void` |
| deleteTableDataRecord | 删除表格源数据 | `(rowKey: string \| number \| string[] \| number[]) => void` |
| updateTableData| 更新表格源数据，完整替换 | `(index: number, key: string, value: any) => Recordable` |
| insertTableDataRecord | 插入数据，如果有index，则在指定索引后添加，如果没有则添加到数据的尾端 | `(record: Recordable, index?: number) => Recordable[]` |
| findTableDataRecord| 根据rowkey查找源数据中的某一条 | `(rowKey: string \| number) => Recordable \| undefined` |
| getDataSource | 获取表格数据列表 | `<T = Recordable>() => T[]` |
| getRawDataSource |  获取接口获取的源数据列表 | `<T = Recordable>() => T` |
| getColumns | 获取表格列配置数据,仅tableProps的columns | `(opt?: GetColumnsParams) => BasicColumn[]` |
| setColumns | 设置表格列配置，如果是数组对象，则会替换columns，如果是prop[\],则column内prop不存在prop[]内的column自动隐藏 | `(columns: BasicColumn[] \| string[]) => void` |
| setLoading | 设置表格loading | `(loading: boolean) => void` |
| setProps | 动态设置表格属性 | `(props: Partial<BasicTableProps>) => void` |
| redoHeight | 重计算表格高度，如果设置了height 或者 canResize=false，则无效 | `() => void` |
| getPaginationRef | 获取分页信息 | `() => Partial<PaginationProps>` |
| getSize | 获取表格大小 | `() => SizeType` |
| emit | BasicTable内部事件 | `EmitType` |
| setShowPagination | 设置显示隐藏分页器 | `(show: boolean) => Promise<void>` |
| getShowPagination | 获取分页器的显示状态 | `() => boolean` |
| clearSelection | 用于多选表格，清空用户的选择 | `() => void` |
| getSelectionRows | 返回当前选中的行 | `() => Recordable[]` |
| toggleRowSelection | 用于多选表格，切换某一行的选中状态， 如果使用了第二个参数，则可直接设置这一行选中与否 | `(row: Recordable, selected: boolean) => void` |
| toggleAllSelection | 用于多选表格，切换全选和全不选 | `() => void` |
| toggleRowExpansion | 用于可扩展的表格或树表格，如果某行被扩展，则切换。 使用第二个参数，您可以直接设置该行应该被扩展或折叠。 | `(row: Recordable, expanded: boolean) => void` |
| setCurrentRow | 用于单选表格，设定某一行为选中行， 如果调用时不加参数，则会取消目前高亮行的选中状态。 | `(row: Recordable) => void` |
| clearSort | 用于清空排序条件，数据会恢复成未排序的状态 | `() => void` |
| clearFilter | 传入由columnKey 组成的数组以清除指定列的过滤条件。 如果没有参数，清除所有过滤器 | `(columnKeys: string[]) => void` |
| doLayout | 对 Table 进行重新布局。 当表格可见性变化时，您可能需要调用此方法以获得正确的布局 | `() => void` |
| sort | 手动排序表格。 参数 prop 属性指定排序列，order 指定排序顺序。 | `(prop: string, order: string) => void` |
| scrollTo | 滚动到一组特定坐标 | `(options: ScrollToOptions \| number, yCoord?: number) => void` |
| setScrollTop | 设置垂直滚动位置 | `(top: number) => void` |
| setScrollLeft | 设置水平滚动位置 | `(left: number) => void` |
| handleClearSort | 清除所有的sort信息并重新请求 | `() => void` |
| handleClearFilters | 清除所有的过滤信息 | `(columnKeys?: string[]) => void` |
| expandAll | 展开所有 | `() => void` |
| collapseAll | 收起所有 | `() => void` |
| getSelectRowKeys | 获取所有选中行的row-key | `() => (string \| number)[]` |
| setSelectedRowKeys | 根据rowkey设置选中 | `(keys: (string \| number)[]) => void` |

## BasicTable属性

> 部分属性如若没有请参考 element-plus 文档， 以下为 TableProps 扩展参数

| 属性 | 说明 | 类型 | 默认值 |
| -- | -- | -- | -- |
| data | 列表数据 | `Array as PropType<Recordable[]>` | [] |, 
| height | Table 的高度， 默认为自动高度。 如果 height 为 number 类型，单位 px；如果 height 为 string 类型，则这个高度会设置为 Table 的 style.height 的值，Table 的高度会受控于外部样式。 | `string \| number` | `'auto'` |,
| maxHeight | Table 的最大高度。 合法的值为数字或者单位为 px 的高度。自动计算的高度仍不会超过该高度 | `string \| number` | - |,
| stripe | 是否为斑马纹 table | `Boolean` | `false` |
| border | 是否带有纵向边框 | `Boolean` | `false` |
| size | Table 的尺寸 | `SizeType` | `default` |
| fit | 列的宽度是否自撑开 | `Boolean` | `true` |
| showHeader | 是否显示表头 | `Boolean` | `true` |
| highlightCurrentRow | 是否要高亮当前行 | `Boolean` | `false` |
| selectOnIndeterminate | 在多选表格中，当仅有部分行被选中时，点击表头的多选框时的行为。 若为 true，则选中所有行；若为 false，则取消选择所有行 | `Boolean` | `true` |
| indent | 展示树形数据时，树节点的缩进 | `Number` | `16` |
| treeProps | 渲染嵌套数据的配置选项 | `Object` | `{ hasChildren: 'hasChildren', children: 'children' }` |
| tableLayout | 设置表格单元、行和列的布局方式 | `'fixed' \| 'auto'` | `'fixed'` |
| sortFetchImmediate | 排序变化立即请求 | `Boolean` | `true` |
| sortFn | 排序参数处理方法 | `(sortInfo: SorterResult) => any` | `DEFAULT_SORT_FN` |
| filterFetchImmediate | 过滤条件变化后立即请求 | `Boolean` | `true` |
| filterFn | 过滤参数处理方法 | `(data: Recordable) => any` | `(data: Recordable) => data` |
| isTreeTable | 是否是树形表格 | `Boolean` | `false` |
| tableSetting | 表格设置 | `TableSetting` | - |
| showTableSetting | 是否显示表格设置 | `Boolean` | `true` |
| inset | 是否取消表格内的padding | `Boolean` | `true` |
| autoCreateKey | 是否自动生成key，针对v-for遍历 | `Boolean` | `true` |
| api | 请求接口，亦可使用element-plus table的load方法，区别在于数据处理完全放在外部处理 | `(...arg: any) => Promise<any>` | - |
| beforeFetch| 请求前参数处理 |  `(data: Recordable) => Recordable` | - |
| afterFetch| 请求结束后返回数据处理 |  `(data: Recordable) => Recordable` | - |
| handleSearchInfoFn | 开启表单后，在请求之前处理搜索条件参数 |`(data: Recordable) => Recordable` | - |
| fetchSetting | 接口请求配置，可以配置请求的字段和响应的字段名， | `FetchSetting` | `{ pageField: 'page', sizeField: 'pageSize', listField: 'items', totalField: 'total' }` |
| immediate| 组件加载后是否立即请求接口，在 api 有传的情况下，如果为 false，需要自行使用 reload 加 | `Boolean`|  `true` |
| emptyDataIsShowTable | 数据为空的时候是否显示table | `Boolean`|  `true` |
| searchInfo | 额外的请求参数 | `Recordable` | - |
| title | 表格的标题 | `srting` | - |
| titleHelpMessage | 标题的解释说明 | `string \| string[]` | - |
| useSearchForm | 使用搜索表单 | `Boolean`|  `false` |
| formConfig| 表单配置，参考表单组件的  | `FormProps` | - | 
| columns | 表单列信息 BasicColumn[] | `BasicColumn[]` | `[]` |
| showIndexColumn | 是否显示序号列 | `Boolean`|  `true` |
| indexColumnProps | 序号列配置 BasicColumn | `BasicColumn` | `{ width: 60,label: '#',align: 'center',fixed: 'left' }` |
| showSelectionColumn | 显示多选框列 | `Boolean`|  `false` |
| selectionColumnProps | 多选列配置 | `BasicColumn` | `{width: 60, align: 'center', fixed: 'left',}` |
| showExpandColumn | 显示展开收起 |`Boolean`|  `false` |
expandColumnProps | 展开收起列配置 | `BasicColumn` | `{width: 40, align: 'center', fixed: 'left', label: ''}` |
| actionColumn | 表格右侧操作列配置 BasicColumn | `BasicColumn` | - |
| ellipsis| 文本过长是否显示ellipsis | `Boolean`|  `true` |
| canResize | 是否自动计算高度，铺满整屏 | `Boolean`|  `true` |
| isCanResizeParent | 是否继承父级高度 | `Boolean`|  `false` |
| pagination | 分页信息配置，为 `false` 不显示分 | `Partial<PaginationProps> \| boolean` | `false` |
| loading | 表格 loading 状态 | `Boolean`|  `false` |
| beforeEditSubmit | 单元格编辑状态提交回调，返回false将阻止单元格提交数据到table。该回调在行编辑模式下无效。 | `(data: { record: Recordable; index: number; key: string \| number; value: any }) => Promise<any>` | - | 


**DEFAULT_SORT_FN**
```ts
(sortInfo: SorterResult) => {
    const { prop, order } = sortInfo
    if (prop && order) {
      return {
        // The sort prop passed to the backend you
        prop,
        // Sorting method passed to the background asc/desc
        order
      }
    } else {
      return {}
    }
  }
```

**SizeType**
```ts
export type SizeType = 'default' | 'small' | 'large'
```

**TableSetting**

```ts
export interface TableSetting {
  redo?: boolean
  size?: boolean
  setting?: boolean
  fullScreen?: boolean
}
```

**FetchSetting**
```ts
export interface FetchSetting {
  // 请求接口当前页数
  pageField: string
  // 每页显示多少条
  sizeField: string
  // 请求结果列表字段  支持 a.b.c
  listField: string
  // 请求结果总数字段  支持 a.b.c
  totalField: string
}
```

## TableColumn 属性

**BasicColumn**

> 除了 element-plus table-column配置[ TableColumnCtx ]外，以下为扩展参数

| 属性 | 说明 | 类型 | 默认值 |
| -- | -- | -- | -- |
| children | 多级表头子集与 columns属性作用一致，如果有数据则认为是多级表头 | `BasicColumn[]` | - |
| columns | 多级表头子集与 children属性作用一致，如果有数据则认为是多级表头 |  `BasicColumn[]` | - |
| customLabel | tableColumn的自定义label | `VNode \| string` | - |
| flag | tableColumn的类型标记 | `'DEFAULT' \| 'ACTION'` | - |
| slots | 自定义插槽 | `Recordable<{cellSlot?: string; headerSlot?: string}>` | - | 
| defaultHidden | 是否默认隐藏 | `boolean` | `false` |
| helpMessage | 该列的解释信息 | `string \| string[]` | - |
| helpComponentProps | 提示信息组件的props | `Partial<HelpComponentProps>` | - |
| format | 单元格内的数据格式化，主要是针对时间戳 | `CellFormat` | - |
| edit | 是否开启单元格编辑 | `boolean` | `false` |
| editRow | 是否开启整行编辑 | `boolean` | `false` |
| editable | 是否处于编辑状态 | `boolean` | `false` |
| editComponent | 行内编辑组件的类型 | `ComponentType` | `Input` |
| editComponentProps | 对应编辑组件的 props | `((opt: {text: string \| number \| boolean \| Recordable; record: Recordable; column: BasicColumn; index: number; }) => Recordable) \| Recordable` | - |
| editRule  | 对应编辑组件的表单校验 | `((text: string, record: Recordable) => Promise<string>)` | - |
| editValueMap | 对应单元格值枚举 | `(value: any) => string` | - |
| onEditRow | 触发行编辑 | `（）=>void`| - |
| ifShow | 业务控制是否显示 | `boolean \| ((column: BasicColumn) => boolean)` | - | 
| editRender | 自定义修改后显示的内容 | `((opt: {text: string \| number \| boolean \| Recordable; record: Recordable; column: BasicColumn; index: number; }) => VNodeChild \| JSX.Element` | - |
| editDynamicDisabled | 动态 Disabled | `boolean \| ((record: Recordable) => boolean)` | - |

**ComponentType**

```ts
export type ComponentType =
  | 'Input'
  | 'InputNumber'
  | 'Select'
  | 'ApiSelect'
  | 'Checkbox'
  | 'Switch'
  | 'DatePicker'  
  | 'TimePicker'; 
```


**HelpComponentProps**
```ts
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
}
```

**CellFormat**
```ts
export type CellFormat =
  | string
  | ((text: string, record: Recordable, index: number) => string | number)
  | Map<string | number, any>
```

## BasicTable 事件

> 除以下事件外，官方文档内的 event 也都支持，具体可以参考 element-plus table 事件

| 事件             | 回调参数                                | 说明                                |
| ---------------- | --------------------------------------- | ----------------------------------- |
| fetch-success    | `Function({items,total})`               | 接口请求成功后触发                  |
| fetch-error      | `Function(error)`                       | 错误信息                            |
| register         | `Function(tableAction, formActions)`    | 表单注册事件                        |
| columns-change   | `Function(record[])`                    | 列表columns变化时触发               |
| change           | `Function(PaginationProps, filterInfo, sortInfo)`| 分页、排序、过滤条件变化时触发|
| sort-change      | `Function(sortInfo)`                    | 排序参数变化时触发                 |
| filter-change    | `Function(filterInfo)`                  | 过滤条件变化时触发                 |
| edit-end         | `Function({record, index, key, value})` | 单元格编辑完成触发                  |
| edit-cancel      | `Function({record, index, key, value})` | 单元格取消编辑触发                  |
| edit-row-end     | `Function()`                            | 行编辑结束触发                      |
| edit-change      | `Function({column,value,record})`       | 单元格编辑组件的 value 发生变化时触发 |

::: tip edit-change 说明

:::

```javascript
      function onEditChange({ column, record }) {
        // 当同一行的单价或者数量发生变化时，更新合计金额（三个数据均为当前行编辑组件的值）
        if (column.dataIndex === 'qty' || column.dataIndex === 'price') {
          const { editValueRefs: { total, qty, price } } = record;
          total.value = unref(qty) * unref(price);
        }
      }
```

## 插槽

::: tip 温馨提醒

除以下参数外，支持官方文档内的 'append', 'empty' 两个 slot 

:::

| 名称              | 说明             | 
| ----------------- | ---------------- | 
| tableTitle        | 表格顶部左侧区域 | 
| toolbar           | 表格顶部右侧区域 | 
| expandedRowRender | 展开行区域，如若expandColumnProps设置了slots，则优先使用expandColumnProps的配置 | 
| headerTop | 表格顶部区域（标题上方）       |


## BasicForm-Slots

当开启 form 表单后。以`form-xxxx`为前缀的 slot 会被视为 form 的 slot

xxxx 为 form 组件的 slot。具体参考[form 组件文档](./form.md#BasicForm插槽)

例如

```
form-submitBefore
```


## 内置组件（只能用于表格内部）

### TableAction

用于表格右侧操作列渲染

#### Props

| 属性                  | 类型           | 默认值  | 可选值       | 说明                            |
| --------------------- | -------------- | ------- | ------------ | ------------------------------- |
| actions               | `ActionItem[]` | -       | -            | 右侧操作列按钮列表              |
| dropDownActions       | `ActionItem[]` | -       | -            | 右侧操作列更多下拉按钮列表      |
| stopButtonPropagation | `boolean`      | `false` | `true/false` | 是否阻止操作按钮的click事件冒泡 |

**ActionItem**

```ts
export interface ActionItem {
  // 按钮文本
  label: string;
  // 是否禁用
  disabled?: boolean;
  // 按钮颜色
  color?: 'success' | 'error' | 'warning';
  // 按钮类型
  type?: string;
  // button组件props
  props?: any;
  // 按钮图标
  icon?: VNode;
  // 气泡确认框
  popConfirm?: PopConfirm;
  // 是否显示分隔线，v2.0.0+
  divider?: boolean;
  // 根据业务状态来控制当前列是否显示，v2.4.0+
  ifShow?: boolean | ((action: ActionItem) => boolean);
  // 点击回调
  onClick?: Fn;
  // Tooltip配置，2.5.3以上版本支持，可以配置为string，或者完整的tooltip属性
  tooltip?: string | TooltipProps
}
```
有关TooltipProps的说明，请参考[tooltip](https://element-plus.gitee.io/zh-CN/component/tooltip.html#属性)

**PopConfirm**
```ts
export interface PopConfirm {
  title: string;
  okText?: string;
  cancelText?: string;
  confirm: Fn;
  cancel?: Fn;
  icon?: string;
}
```

### TableImg

用于渲染单元格图片,支持图片预览

#### Props

| 属性       | 类型       | 默认值  | 可选值       | 说明                             | 
| ---------- | ---------- | ------- | ------------ | -------------------------------- | 
| imgList    | `string[]` | -       | -            | 图片地址列表                     | 
| size       | `number`   | -       | -            | 图片大小                         | 
| simpleShow | `boolean`  | `false` | `true/false` | 简单显示模式（只显示第一张图片） | 
| showBadge  | `boolean`  | `true`  | `true/false` | 简单模式下是否显示计数Badge      | 
| margin     | `number`   | 4       | -            | 常规模式下的图片间距             | 
| srcPrefix  | `string`   | -       | -            | 在每一个图片src前插入的内容      | 
