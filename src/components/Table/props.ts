import type { CSSProperties, PropType } from 'vue'
import type { TreeNode } from 'element-plus/es/components/table/src/table/defaults'
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
import type { PaginationProps } from 'element-plus'
import { DEFAULT_FILTER_FN, DEFAULT_SORT_FN, FETCH_SETTING } from './constant'
import type { BasicColumn, FetchSetting, SizeType, SorterResult, TableSetting } from './types/table'
import type { FormProps } from '@/components/Form/types/form'

export const baseProps = {
  // 显示的数据
  data: Array as PropType<Recordable[]>,
  // Table 的高度， 默认为自动高度。 如果 height 为 number 类型，单位 px；如果 height 为 string 类型，则这个高度会设置为 Table 的 style.height 的值，Table 的高度会受控于外部样式。
  height: [String, Number] as PropType<string | number>,
  // Table 的最大高度。 合法的值为数字或者单位为 px 的高度。
  maxHeight: [String, Number] as PropType<string | number>,
  // 是否为斑马纹 table
  stripe: {
    type: Boolean,
    default: false,
  },
  // 是否带有纵向边框
  border: {
    type: Boolean,
    default: false,
  },
  // Table 的尺寸
  size: {
    type: String as PropType<SizeType>,
    default: 'default',
  },
  // 列的宽度是否自撑开
  fit: {
    type: Boolean,
    default: true,
  },
  // 是否显示表头
  showHeader: {
    type: Boolean,
    default: true,
  },
  // 是否要高亮当前行
  highlightCurrentRow: {
    type: Boolean,
    default: false,
  },
  // 当前行的 key，只写属性
  currentRowKey: [String, Number] as PropType<string | number>,
  // 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。
  rowClassName: {
    type: [Function, String] as PropType<({ row, rowIndex }: { row: Recordable; rowIndex: number }) => void | string>,
  },
  // 行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。
  rowStyle: [Function, Object] as PropType<
    ({ row, rowIndex }: { row: Recordable; rowIndex: number }) => void | CSSProperties
  >,
  // 	单元格的 className 的回调方法，也可以使用字符串为所有单元格设置一个固定的 className。
  cellClassName: [Function, String] as PropType<
    ({
      row,
      column,
      rowIndex,
      columnIndex,
    }: {
      row: Recordable
      rowIndex: number
      column: TableColumnCtx<Recordable>
      columnIndex: number
    }) => void | string
  >,
  // 单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有单元格设置一样的 Style。
  cellStyle: [Function, Object] as PropType<
    ({
      row,
      column,
      rowIndex,
      columnIndex,
    }: {
      row: Recordable
      rowIndex: number
      column: TableColumnCtx<Recordable>
      columnIndex: number
    }) => void | CSSProperties
  >,
  // 	表头行的 className 的回调方法，也可以使用字符串为所有表头行设置一个固定的 className。
  headerRowClassName: [Function, String] as PropType<
    ({ row, rowIndex }: { row: Recordable; rowIndex: number }) => void | string
  >,
  // 	表头行的 style 的回调方法，也可以使用一个固定的 Object 为所有表头行设置一样的 Style。
  headerRowStyle: [Function, Object] as PropType<
    ({ row, rowIndex }: { row: Recordable; rowIndex: number }) => void | CSSProperties
  >,
  // 	表头单元格的 className 的回调方法，也可以使用字符串为所有表头单元格设置一个固定的 className。
  headerCellClassName: [Function, String] as PropType<
    ({
      row,
      column,
      rowIndex,
      columnIndex,
    }: {
      row: Recordable
      rowIndex: number
      column: TableColumnCtx<Recordable>
      columnIndex: number
    }) => void | string
  >,
  // 表头单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有表头单元格设置一样的 Style。
  headerCellStyle: [Function, Object] as PropType<
    ({
      row,
      column,
      rowIndex,
      columnIndex,
    }: {
      row: Recordable
      rowIndex: number
      column: TableColumnCtx<Recordable>
      columnIndex: number
    }) => void | CSSProperties
  >,
  // 	行数据的 Key，用来优化 Table 的渲染； 在使用reserve-selection功能与显示树形数据时，该属性是必填的。 类型为 String 时，支持多层访问：user.info.id，但不支持 user.info[0].id，此种情况请使用 Function。
  rowKey: [Function, String] as PropType<((row: Recordable) => any) | string>,
  // 	空数据时显示的文本内容， 也可以通过 #empty 设置
  emptyText: {
    type: String,
    default: 'No Data',
  },
  // 	是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效
  defaultExpandAll: {
    type: Boolean,
    default: false,
  },
  // 	可以通过该属性设置 Table 目前的展开行，需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组。
  expandRowKeys: Array as PropType<Recordable[]>,
  // 	默认的排序列的 prop 和顺序。 它的 prop 属性指定默认的排序的列，order 指定默认排序的顺序 如果只指定了 prop, 没有指定 order, 则默认顺序是 ascending
  defaultSort: {
    type: Object as PropType<Recordable>,
  },
  // 	tooltip effect 属性
  tooltipEffect: {
    type: String as PropType<'dark' | 'light'>,
    default: 'dark',
  },
  // 	是否在表尾显示合计行
  showSummary: {
    type: Boolean,
    default: false,
  },
  // 自定义的合计计算方法
  summaryMethod: Function as PropType<
    ({ columns, data }: { columns: TableColumnCtx<Recordable>[]; data: Recordable[] }) => void
  >,
  // 自定义合计数据。如果有则显示该数据
  summaryData: {
    type: Array as PropType<Recordable[]>,
    default: null,
  },
  // 	合并行或列的计算方法
  spanMethod: Function as PropType<
    ({
      row,
      column,
      rowIndex,
      columnIndex,
    }: {
      row: Recordable
      rowIndex: number
      column: TableColumnCtx<Recordable>
      columnIndex: number
    }) => void
  >,
  // 	在多选表格中，当仅有部分行被选中时，点击表头的多选框时的行为。 若为 true，则选中所有行；若为 false，则取消选择所有行
  selectOnIndeterminate: {
    type: Boolean,
    default: true,
  },
  // 	展示树形数据时，树节点的缩进
  indent: {
    type: Number,
    default: 16,
  },
  // 是否懒加载子节点数据
  lazy: Boolean,
  // 加载子节点数据的函数，lazy 为 true 时生效，函数第二个参数包含了节点的层级信息
  load: Function as PropType<(row: Recordable, treeNode: TreeNode, resolve: (data: Recordable[]) => void) => void>,
  // 	渲染嵌套数据的配置选项
  treeProps: {
    type: Object as PropType<Recordable>,
    default: () => ({ hasChildren: 'hasChildren', children: 'children' }),
  },
  // 	设置表格单元、行和列的布局方式
  tableLayout: {
    type: String as PropType<'fixed' | 'auto'>,
    default: 'fixed',
  },
  // 总是显示滚动条
  scrollbarAlwaysOn: {
    type: Boolean,
    default: false,
  },
  // 2.2.1	确保主轴的最小尺寸
  flexible: {
    type: Boolean,
    default: false,
  },
  sortFetchImmediate: {
    type: Boolean,
    default: true,
  },
  // 排序参数处理方法
  sortFn: {
    type: Function as PropType<(sortInfo: SorterResult) => any>,
    default: DEFAULT_SORT_FN,
  },
  filterFetchImmediate: {
    type: Boolean,
    default: true,
  },
  // 过滤参数处理方法
  filterFn: {
    type: Function as PropType<(data: Partial<Recordable<string[]>>) => any>,
    default: DEFAULT_FILTER_FN,
  },
  // 是否是树形表格
  isTreeTable: {
    type: Boolean,
    default: false,
  },
  // 表格设置
  tableSetting: {
    type: Object as PropType<TableSetting>,
    default: () => ({}),
  },
  // 是否显示表格设置
  showTableSetting: {
    type: Boolean,
    default: true,
  },
  // 是否取消表格内的padding
  inset: {
    type: Boolean,
    default: false,
  },
  // 是否自动生成key，针对v-for遍历
  autoCreateKey: {
    type: Boolean,
    default: true,
  },
  // 接口
  api: {
    type: Function as PropType<(...arg: any[]) => Promise<any>>,
    default: null,
  },
  // 请求前参数处理
  beforeFetch: {
    type: Function as PropType<Fn>,
    default: null,
  },
  // 请求结束后返回数据处理
  afterFetch: {
    type: Function as PropType<Fn>,
    default: null,
  },
  // 开启表单后，在请求之前处理搜索条件参数
  handleSearchInfoFn: {
    type: Function as PropType<Fn>,
    default: null,
  },
  // 接口请求配置，可以配置请求的字段和响应的字段名，
  fetchSetting: {
    type: Object as PropType<FetchSetting>,
    default: () => {
      return FETCH_SETTING
    },
  },
  // 立即请求接口
  immediate: { type: Boolean, default: true },
  // 数据为空的时候是否显示table
  emptyDataIsShowTable: { type: Boolean, default: true },
  // 额外的请求参数
  searchInfo: {
    type: Object as PropType<Recordable>,
    default: null,
  },
  // 表格的标题
  title: {
    type: [String, Function] as PropType<string | ((data: Recordable) => string)>,
    default: null,
  },
  // 标题的解释说明
  titleHelpMessage: {
    type: [String, Array] as PropType<string | string[]>,
  },
  // 使用搜索表单
  useSearchForm: {
    type: Boolean,
    default: false,
  },
  // 表单配置
  formConfig: {
    type: Object as PropType<FormProps>,
    default: null,
  },
  // 表单列信息 BasicColumn[]
  columns: {
    type: [Array] as PropType<BasicColumn[]>,
    default: () => [],
  },
  // 是否显示序号列
  showIndexColumn: { type: Boolean, default: true },
  // 序号列配置 BasicColumn
  indexColumnProps: {
    type: Object as PropType<BasicColumn>,
    default: null,
  },
  // 显示多选框列
  showSelectionColumn: { type: Boolean, default: false },
  // 多选列配置
  selectionColumnProps: {
    type: Object as PropType<BasicColumn>,
    default: null,
  },
  // 显示展开收起
  showExpandColumn: { type: Boolean, default: false },
  // 展开收起列配置
  expandColumnProps: {
    type: Object as PropType<BasicColumn>,
    default: null,
  },
  // 表格右侧操作列配置 BasicColumn
  actionColumn: {
    type: Object as PropType<BasicColumn>,
    default: null,
  },
  // 文本过长是否显示ellipsis
  ellipsis: { type: Boolean, default: true },
  // 是否自动计算高度，铺满整屏
  canResize: { type: Boolean, default: true },
  // 是否继承父级高度
  isCanResizeParent: { type: Boolean, default: false },
  // 分页配置
  pagination: {
    type: [Object, Boolean] as PropType<Partial<PaginationProps> | boolean>,
    default: false,
  },
  // 分页的时候自动清除已选的table column
  clearSelectOnPageChange: {
    type: Boolean,
    default: true,
  },
  // 表格 loading 状态
  loading: {
    type: Boolean,
    default: false,
  },
  // 单元格编辑状态提交回调，返回false将阻止单元格提交数据到table。该回调在行编辑模式下无效。
  beforeEditSubmit: {
    type: Function as PropType<
      (data: { record: Recordable; index: number; key: string | number; value: any }) => Promise<any>
    >,
  },
}
