import type { PaginationProps } from 'element-plus'
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
import type { TreeNode } from 'element-plus/es/components/table/src/table/defaults'
import type { CSSProperties, VNode, VNodeChild } from 'vue'
import type { FormProps, HelpComponentProps } from '@/components/Form/types/form'
export declare type SortOrder = 'ascending' | 'descending'
import { ComponentType } from './componentType'
export interface FetchParams {
  searchInfo?: Recordable
  page?: number
  sortInfo?: Recordable
  filterInfo?: Recordable
}

export interface GetColumnsParams {
  ignoreIndex?: boolean
  ignoreAction?: boolean
  ignoreSelection?: boolean
  ignoreExpand?: boolean
  sort?: boolean
}

export interface TableRowSelection<T> {}
export interface BasicTableProps {}
export interface SorterResult {
  column: BasicColumn
  order: SortOrder
  prop: string
}
export type SizeType = 'default' | 'small' | 'large'

export interface TableSetting {
  redo?: boolean
  size?: boolean
  setting?: boolean
  fullScreen?: boolean
}

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

export interface TableActionType {
  // 刷新列表
  reload: (opt?: FetchParams) => Promise<void>
  // 设置分页器配置
  setPagination: (info: Partial<PaginationProps>) => void
  // 重置原数据
  setTableData: <T = Recordable>(values: T[]) => void
  updateTableDataRecord: (rowKey: string | number, record: Recordable) => Recordable | void
  deleteTableDataRecord: (rowKey: string | number | string[] | number[]) => void
  insertTableDataRecord: (record: Recordable, index?: number) => Recordable | void
  findTableDataRecord: (rowKey: string | number) => Recordable | void
  getColumns: (opt?: GetColumnsParams) => BasicColumn[]
  setColumns: (columns: BasicColumn[] | string[]) => void
  getDataSource: <T = Recordable>() => T[]
  getRawDataSource: <T = Recordable>() => T
  setLoading: (loading: boolean) => void
  setProps: (props: Partial<BasicTableProps>) => void
  redoHeight: () => void
  getPaginationRef: () => Partial<PaginationProps> | boolean
  getSize: () => SizeType
  getCacheColumns: () => BasicColumn[]
  emit?: EmitType
  updateTableData: (index: number, key: string, value: any) => Recordable
  setShowPagination: (show: boolean) => Promise<void>
  getShowPagination: () => boolean
  setCacheColumnsByField?: (dataIndex: string | undefined, value: BasicColumn) => void
  // 组件内暴露事件
  // 用于多选表格，清空用户的选择
  clearSelection: () => void
  // 返回当前选中的行
  getSelectionRows: () => Recordable[]
  // 用于多选表格，切换某一行的选中状态， 如果使用了第二个参数，则可直接设置这一行选中与否
  toggleRowSelection: (row: Recordable, selected: boolean) => void
  // 用于多选表格，切换全选和全不选
  toggleAllSelection: () => void
  // 用于可扩展的表格或树表格，如果某行被扩展，则切换。 使用第二个参数，您可以直接设置该行应该被扩展或折叠。
  toggleRowExpansion: (row: Recordable, expanded: boolean) => void
  // 用于单选表格，设定某一行为选中行， 如果调用时不加参数，则会取消目前高亮行的选中状态。
  setCurrentRow: (row: Recordable) => void
  // 用于清空排序条件，数据会恢复成未排序的状态
  clearSort: () => void
  // 传入由columnKey 组成的数组以清除指定列的过滤条件。 如果没有参数，清除所有过滤器
  clearFilter: (columnKeys: string[]) => void
  // 对 Table 进行重新布局。 当表格可见性变化时，您可能需要调用此方法以获得正确的布局
  doLayout: () => void
  // 手动排序表格。 参数 prop 属性指定排序列，order 指定排序顺序。
  sort: (prop: string, order: string) => void
  // 滚动到一组特定坐标
  scrollTo: (options: ScrollToOptions | number, yCoord?: number) => void
  // 设置垂直滚动位置
  setScrollTop: (top: number) => void
  // 设置水平滚动位置
  setScrollLeft: (left: number) => void
  // 清除所有的sort信息并重新请求
  handleClearSort: () => void
  // 清除所有的过滤信息
  handleClearFilters: (columnKeys?: string[]) => void
  // 展开所有
  expandAll: () => void
  // 收起所有
  collapseAll: () => void
  // 获取所有选中行的row-key
  getSelectRowKeys: () => (string | number)[]
  // 根据rowkey设置选中
  setSelectedRowKeys: (keys: (string | number)[]) => void
}

export type CellFormat =
  | string
  | ((text: string, record: Recordable, index: number) => string | number)
  | Map<string | number, any>

export interface BasicColumn extends Partial<Omit<TableColumnCtx<Recordable>, 'children' | 'columns'>> {
  children?: BasicColumn[]
  columns?: BasicColumn[]
  customTitle?: VNode
  flag?: 'DEFAULT' | 'ACTION'
  // 是否是多级表头
  isMulti?: boolean
  slots?: {
    cellSlot?: string
    headerSlot?: string
  }
  defaultHidden?: boolean
  // 提示信息
  helpMessage?: string | string[]
  // 提示信息组件的props
  helpComponentProps?: Partial<HelpComponentProps>
  format?: CellFormat
  // Editable
  edit?: boolean
  editRow?: boolean
  editable?: boolean
  editComponent?: ComponentType
  editComponentProps?:
    | ((opt: {
        text: string | number | boolean | Recordable
        record: Recordable
        column: BasicColumn
        index: number
      }) => Recordable)
    | Recordable
  editRule?: boolean | ((text: string, record: Recordable) => Promise<string>)
  editValueMap?: (value: any) => string
  onEditRow?: () => void
  // 业务控制是否显示
  ifShow?: boolean | ((column: BasicColumn) => boolean)
  // 自定义修改后显示的内容
  editRender?: (opt: {
    text: string | number | boolean | Recordable
    record: Recordable
    column: BasicColumn
    index: number
  }) => VNodeChild | JSX.Element
  // 动态 Disabled
  editDynamicDisabled?: boolean | ((record: Recordable) => boolean)
}

export interface BasicTableProps {
  // 显示的数据
  data?: Recordable[]
  // Table 的高度， 默认为自动高度。 如果 height 为 number 类型，单位 px；如果 height 为 string 类型，则这个高度会设置为 Table 的 style.height 的值，Table 的高度会受控于外部样式。
  height?: string | number
  // Table 的最大高度。 合法的值为数字或者单位为 px 的高度。
  maxHeight?: string | number
  // 是否为斑马纹 table
  stripe?: boolean
  // 是否带有纵向边框
  border?: boolean
  // Table 的尺寸
  size?: string
  // 列的宽度是否自撑开
  fit?: boolean
  // 是否显示表头
  showHeader?: boolean
  // 是否要高亮当前行
  highlightCurrentRow?: boolean
  // 当前行的 key，只写属性
  currentRowKey?: string | number
  // 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。
  rowClassName?: ({ row, rowIndex }: { row: Recordable; rowIndex: number }) => void | string
  // 行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。
  rowStyle?: ({ row, rowIndex }: { row: Recordable; rowIndex: number }) => void | CSSProperties
  // 	单元格的 className 的回调方法，也可以使用字符串为所有单元格设置一个固定的 className。
  cellClassName?: ({
    row,
    column,
    rowIndex,
    columnIndex
  }: {
    row: Recordable
    rowIndex: number
    column: TableColumnCtx<Recordable>
    columnIndex: number
  }) => void | string
  // 单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有单元格设置一样的 Style。
  cellStyle?: ({
    row,
    column,
    rowIndex,
    columnIndex
  }: {
    row: Recordable
    rowIndex: number
    column: TableColumnCtx<Recordable>
    columnIndex: number
  }) => void | CSSProperties
  // 	表头行的 className 的回调方法，也可以使用字符串为所有表头行设置一个固定的 className。
  headerRowClassName?: ({ row, rowIndex }: { row: Recordable; rowIndex: number }) => void | string
  // 	表头行的 style 的回调方法，也可以使用一个固定的 Object 为所有表头行设置一样的 Style。
  headerRowStyle?: ({ row, rowIndex }: { row: Recordable; rowIndex: number }) => void | CSSProperties
  // 	表头单元格的 className 的回调方法，也可以使用字符串为所有表头单元格设置一个固定的 className。
  headerCellClassName?: ({
    row,
    column,
    rowIndex,
    columnIndex
  }: {
    row: Recordable
    rowIndex: number
    column: TableColumnCtx<Recordable>
    columnIndex: number
  }) => void | string
  // 表头单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有表头单元格设置一样的 Style。
  headerCellStyle?: ({
    row,
    column,
    rowIndex,
    columnIndex
  }: {
    row: Recordable
    rowIndex: number
    column: TableColumnCtx<Recordable>
    columnIndex: number
  }) => void | CSSProperties
  // 	行数据的 Key，用来优化 Table 的渲染； 在使用reserve-selection功能与显示树形数据时，该属性是必填的。 类型为 String 时，支持多层访问：user.info.id，但不支持 user.info[0].id，此种情况请使用 Function。
  rowKey?: ((row: Recordable) => any) | string
  // 	空数据时显示的文本内容， 也可以通过 #empty 设置
  emptyText?: string
  // 	是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效
  defaultExpandAll?: boolean
  // 	可以通过该属性设置 Table 目前的展开行，需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组。
  expandRowKeys?: Recordable[]
  // 	默认的排序列的 prop 和顺序。 它的 prop 属性指定默认的排序的列，order 指定默认排序的顺序 如果只指定了 prop, 没有指定 order, 则默认顺序是 ascending
  defaultSort?: Recordable
  // 	tooltip effect 属性
  tooltipEffect?: string
  // 	是否在表尾显示合计行
  showSummary?: boolean
  // 自定义的合计计算方法
  summaryMethod?: ({ columns, data }: { columns: TableColumnCtx<Recordable>[]; data: Recordable[] }) => void
  // 自定义合计数据。如果有则显示该数据
  summaryData?: Recordable[]
  // 	合并行或列的计算方法
  spanMethod?: ({
    row,
    column,
    rowIndex,
    columnIndex
  }: {
    row: Recordable
    rowIndex: number
    column: TableColumnCtx<Recordable>
    columnIndex: number
  }) => void
  // 	在多选表格中，当仅有部分行被选中时，点击表头的多选框时的行为。 若为 true，则选中所有行；若为 false，则取消选择所有行
  selectOnIndeterminate?: boolean
  // 	展示树形数据时，树节点的缩进
  indent?: number
  // 是否懒加载子节点数据
  lazy?: boolean
  // 加载子节点数据的函数，lazy 为 true 时生效，函数第二个参数包含了节点的层级信息
  load?: (row: Recordable, treeNode: TreeNode, resolve: (data: Recordable[]) => void) => void
  // 	渲染嵌套数据的配置选项
  treeProps?: { hasChildren: string; children: string }
  // 	设置表格单元、行和列的布局方式
  tableLayout?: string
  // 总是显示滚动条
  scrollbarAlwaysOn?: boolean
  // 2.2.1	确保主轴的最小尺寸
  flexible?: boolean
  // 排序发生变化是否需要立即触发接口
  sortFetchImmediate?: Boolean
  // 排序参数处理方法
  sortFn?: (sortInfo: SorterResult) => any
  // 过滤条件发生变化是否需要立即触发接口
  filterFetchImmediate?: Boolean
  // 过滤参数处理方法
  filterFn?: (data: Recordable) => any
  // 点击行选中
  clickToRowSelect?: boolean
  // 是否是树形表格
  isTreeTable?: boolean
  // 表格设置
  tableSetting?: TableSetting
  // 是否显示表格设置
  showTableSetting?: boolean
  // 是否取消表格内的padding
  inset?: boolean
  // 是否自动生成key，针对v-for遍历
  autoCreateKey?: boolean
  // 接口
  api?: (...arg: any[]) => Promise<any>
  // 请求前参数处理
  beforeFetch?: Fn
  // 请求结束后返回数据处理
  afterFetch?: Fn
  // 开启表单后，在请求之前处理搜索条件参数
  handleSearchInfoFn?: Fn
  // 接口请求配置，可以配置请求的字段和响应的字段名，
  fetchSetting?: FetchSetting
  // 立即请求接口
  immediate?: boolean
  // 数据为空的时候是否显示table
  emptyDataIsShowTable?: boolean
  // 额外的请求参数
  searchInfo?: Recordable
  // 表格的标题
  title?: string | ((data: Recordable) => string)
  // 标题的解释说明
  titleHelpMessage?: string | string[]
  // 使用搜索表单
  useSearchForm?: boolean
  // 表单配置
  formConfig?: FormProps
  // 表单列信息 BasicColumn[]
  columns: BasicColumn[]
  // 是否显示序号列
  showIndexColumn?: boolean
  // 序号列配置 BasicColumn
  indexColumnProps?: BasicColumn
  // 显示多选框列
  showSelectionColumn?: boolean
  // 多选列配置
  selectionColumnProps?: BasicColumn
  // 显示展开收起
  showExpandColumn?: boolean
  // 展开收起列配置
  expandColumnProps?: BasicColumn
  // 表格右侧操作列配置 BasicColumn
  actionColumn?: BasicColumn
  // 文本过长是否显示ellipsis
  ellipsis?: boolean
  // 是否自动计算高度，铺满整屏
  canResize?: boolean
  // 是否继承父级高度
  isCanResizeParent?: boolean
  // 分页配置
  pagination?: Partial<PaginationProps> | boolean
  clearSelectOnPageChange?: boolean
  // 表格 loading 状态
  loading?: boolean
  // 单元格编辑状态提交回调，返回false将阻止单元格提交数据到table。该回调在行编辑模式下无效。
  beforeEditSubmit?: (data: { record: Recordable; index: number; key: string | number; value: any }) => Promise<any>
  // // 当用户手动勾选数据行的 Checkbox 时触发的事件
  // onSelect?: (selection: Recordable[], row: Recordable) => void
  // // 当用户手动勾选全选 Checkbox 时触发的事件
  // onSelectAll?: (selection: Recordable[]) => void
  // // 当选择项发生变化时会触发该事件
  // onSelectionChange?: (selection: Recordable[]) => void
  // // 当单元格 hover 进入时会触发该事件
  // onCellMouseEnter?: (row: Recordable, column: Recordable, cell: HTMLElement, event: MouseEvent) => void
  // // 当单元格 hover 退出时会触发该事件
  // onCellMouseLeave?: (row: Recordable, column: Recordable, cell: HTMLElement, event: MouseEvent) => void
  // // 当某个单元格被点击时会触发该事件
  // onCellClick?: (row: Recordable, column: Recordable, cell: HTMLElement, event: MouseEvent) => void
  // // 当某个单元格被双击击时会触发该事件
  // onCellDblclick?: (row: Recordable, column: Recordable, cell: HTMLElement, event: MouseEvent) => void
  // // 当某个单元格被鼠标右键点击时会触发该事件
  // onCellContextmenu?: (row: Recordable, column: Recordable, cell: HTMLElement, event: PointerEvent) => void
  // // 当某一行被点击时会触发该事件
  // onRowClick?: (row: Recordable, column: Recordable, event: MouseEvent) => void
  // // 当某一行被鼠标右键点击时会触发该事件
  // onRowContextmenu?: (row: Recordable, column: Recordable, event: PointerEvent) => void
  // // 当某一行被双击时会触发该事件
  // onRowDblclick?: (row: Recordable, column: Recordable, event: MouseEvent) => void
  // // 当某一列的表头被点击时会触发该事件
  // onHeaderClick?: (column: Recordable, event: PointerEvent) => void
  // // 当某一列的表头被鼠标右键点击时触发该事件
  // onHeaderContextmenu?: (column: Recordable, event: PointerEvent) => void
  // 当表格的排序条件发生变化的时候会触发该事件
  onSortChange?: ({
    column,
    prop,
    order
  }: {
    column: Recordable
    prop: string
    order: 'ascending' | 'descending' | null
  }) => void
  // column 的 key， 如果需要使用 filter-change 事件，则需要此属性标识是哪个 column 的筛选条件
  onFilterChange?: (filters: { [k: string]: string[] }) => void
  // // 当表格的当前行发生变化的时候会触发该事件，如果要高亮当前行，请打开表格的 highlight-current-row 属性
  // onCurrentChange?: (currentRow: Recordable, oldCurrentRow: Recordable) => void
  // // 当拖动表头改变了列的宽度的时候会触发该事件
  // onHeaderDragend?: (newWidth: number, oldWidth: number, column: Recordable, event: MouseEvent) => void
  // // 当用户对某一行展开或者关闭的时候会触发该事件（展开行时，回调的第二个参数为 expandedRows；树形表格时第二参数为 expanded）
  // onExpandChange?: (row: Recordable, expanded: Recordable[] | boolean) => void
  // 分页 过滤 排序变化的callback
  onChange?: (pagination: any, filters: any, sorter: any) => void
  // 表格列表变化回调
  onColumnsChange?: (data: ColumnChangeParam[]) => void
}

export type ColumnChangeParam = {
  dataIndex: string
  fixed: boolean | 'left' | 'right' | undefined
  visible: boolean
}

export interface ActionItem {
  onClick?: Fn
  label?: string
  color?: 'success' | 'error' | 'warning'
  icon?: any
  // popConfirm?: PopConfirm;
  popConfirm?: any
  disabled?: boolean
  divider?: boolean
  // 权限编码控制是否显示
  // auth?: RoleEnum | RoleEnum[] | string | string[];
  // 业务控制是否显示
  ifShow?: boolean | ((action: ActionItem) => boolean)
  // tooltip?: string | TooltipProps;
}

export interface InnerHandlers {
  onColumnsChange: (data: ColumnChangeParam[]) => void
}
