import type { PaginationProps } from 'element-plus'

export interface FetchParams {
  searchInfo?: Recordable
  page?: number
  sortInfo?: Recordable
  filterInfo?: Recordable
}

export interface GetColumnsParams {
  ignoreIndex?: boolean
  ignoreAction?: boolean
  sort?: boolean
}

export interface TableRowSelection<T> {}
export interface BasicTableProps {}

export type SizeType = 'default' | 'small' | 'large'

export interface TableActionType {
  reload: (opt?: FetchParams) => Promise<void>
  getSelectRows: <T = Recordable>() => T[]
  clearSelectedRowKeys: () => void
  expandAll: () => void
  expandRows: (keys: string[]) => void
  collapseAll: () => void
  scrollTo: (pos: string) => void // pos: id | "top" | "bottom"
  getSelectRowKeys: () => string[]
  deleteSelectRowByKey: (key: string) => void
  setPagination: (info: Partial<PaginationProps>) => void
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
  setSelectedRowKeys: (rowKeys: string[] | number[]) => void
  getPaginationRef: () => PaginationProps | boolean
  getSize: () => SizeType
  getRowSelection: () => TableRowSelection<Recordable>
  getCacheColumns: () => BasicColumn[]
  emit?: EmitType
  updateTableData: (index: number, key: string, value: any) => Recordable
  setShowPagination: (show: boolean) => Promise<void>
  getShowPagination: () => boolean
  setCacheColumnsByField?: (dataIndex: string | undefined, value: BasicColumn) => void
}

export interface BasicColumn {}
