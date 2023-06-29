import type { PaginationProps } from 'element-plus'
import type { ComputedRef, Ref } from 'vue'
import { cloneDeep, get, merge, omit } from 'lodash-es'
import type { BasicTableProps, FetchParams, SorterResult } from '../types/table'
import { FETCH_SETTING, PAGE_SIZE, ROW_KEY } from '../constant'
import { useTimeoutFn } from '@/components/utils/useTimeout'
import { buildUUID } from '@/components/utils/uuid'
import { isBoolean, isFunction } from '@/components/utils/is'

interface ActionType {
  getPaginationInfo: ComputedRef<boolean | Partial<PaginationProps>>
  setPagination: (info: Partial<PaginationProps>) => void
  setLoading: (loading: boolean) => void
  getFieldsValue: () => Recordable
  clearSelectedRowKeys: () => void
  tableData: Ref<Recordable[]>
}

interface SearchState {
  sortInfo: Recordable
  filterInfo: Record<string, string[]>
}

export function useDataSource(
  propsRef: ComputedRef<BasicTableProps>,
  { getPaginationInfo, setPagination, setLoading, getFieldsValue, clearSelectedRowKeys, tableData }: ActionType,
  emit: EmitType,
) {
  // 排序 过滤信息
  const searchState = reactive<SearchState>({
    sortInfo: {},
    filterInfo: {},
  })
  const dataSourceRef = ref<Recordable[]>([])
  const rawDataSourceRef = ref<Recordable>({})

  watchEffect(() => {
    tableData.value = unref(dataSourceRef)
  })

  // 手动进行分页
  const pickPageData = () => {
    if (!isBoolean(getPaginationInfo)) {
      const { currentPage, pageSize } = unref(getPaginationInfo) as unknown as PaginationProps
      const data = unref(propsRef).data
      const p = (currentPage as number) || 1
      const s = (pageSize as number) || 10
      dataSourceRef.value = data?.slice(s * (p - 1), s * p - 1) || []
    }
  }

  // 如果外部data变化且没有api 则DataSource需要重新赋值
  watch(
    () => unref(propsRef).data,
    () => {
      const { data, api } = unref(propsRef)

      if (!api && data) {
        if (!isBoolean(getPaginationInfo)) {
          pickPageData()
          setPagination({
            total: data?.length,
          })
        }
        else {
          dataSourceRef.value = data
        }
      }
    },
    {
      immediate: true,
    },
  )

  const resetPage = () => {
    const { data, api } = unref(propsRef)
    if (!api && data)
      pickPageData()
    else fetch()
  }

  const handleChange = () => {
    const { onChange } = unref(propsRef)
    const { filterInfo, sortInfo } = searchState
    emit('change', unref(getPaginationInfo), filterInfo, sortInfo)
    onChange && isFunction(onChange) && onChange(unref(getPaginationInfo), filterInfo, sortInfo)
  }

  // 过滤
  const handleFilterChange = (filter: Recordable) => {
    const { filterFn, filterFetchImmediate } = unref(propsRef)
    if (isFunction(filterFn)) {
      const filterInfo = filterFn(filter)
      searchState.filterInfo = Object.assign(searchState.filterInfo, filterInfo)
    }
    else {
      searchState.filterInfo = Object.assign(searchState.filterInfo, filter)
    }
    emit('filterChange', searchState.filterInfo)
    handleChange()
    if (!filterFetchImmediate)
      return
    fetch()
  }

  const handleClearFilters = (columnKeys?: string[]) => {
    const { filterFetchImmediate } = unref(propsRef)
    if (!columnKeys)
      searchState.filterInfo = {}
    else
      searchState.filterInfo = omit(searchState.filterInfo, columnKeys)

    emit('filterChange', searchState.filterInfo)
    handleChange()
    if (!filterFetchImmediate)
      return
    fetch()
  }

  const handleSortChange = (sort: SorterResult) => {
    const { sortFn, sortFetchImmediate } = unref(propsRef)
    if (isFunction(sortFn)) {
      const sortInfo = sortFn(sort)
      searchState.sortInfo = sortInfo
    }
    else {
      searchState.sortInfo = sort
    }
    emit('sortChange', searchState.sortInfo)
    handleChange()
    if (!sortFetchImmediate)
      return
    fetch()
  }

  const handleClearSort = () => {
    const { sortFetchImmediate } = unref(propsRef)
    searchState.sortInfo = {}
    emit('sortChange', {})
    handleChange()
    if (!sortFetchImmediate)
      return
    fetch()
  }

  // 分页数据变化设置
  const handlePaginationChange = (pagination: PaginationProps) => {
    const { clearSelectOnPageChange } = unref(propsRef)
    if (clearSelectOnPageChange)
      clearSelectedRowKeys()

    setPagination(pagination)
    resetPage()
    handleChange()
  }

  // 设置每一条数据的唯一值，默认是column-key
  function setTableKey(items: any[]) {
    if (!items || !Array.isArray(items))
      return
    items.forEach((item) => {
      if (!item[ROW_KEY])
        item[ROW_KEY] = buildUUID()

      if (item.children && item.children.length)
        setTableKey(item.children)
    })
  }

  // 是否需要自动创建row-key
  const getAutoCreateKey = computed(() => {
    return unref(propsRef).autoCreateKey && !unref(propsRef).rowKey
  })

  // 获取column的key
  const getRowKey = computed(() => {
    const { rowKey } = unref(propsRef)
    return unref(getAutoCreateKey) ? ROW_KEY : rowKey
  })
  // 获取数据源
  const getDataSourceRef = computed(() => {
    const dataSource = unref(dataSourceRef)
    if (!dataSource || dataSource.length === 0)
      return unref(dataSourceRef)

    if (unref(getAutoCreateKey)) {
      const firstItem = dataSource[0]
      const lastItem = dataSource[dataSource.length - 1]

      if (firstItem && lastItem) {
        if (!firstItem[ROW_KEY] || !lastItem[ROW_KEY]) {
          const data = cloneDeep(unref(dataSourceRef))
          data.forEach((item) => {
            if (!item[ROW_KEY])
              item[ROW_KEY] = buildUUID()

            if (item.children && item.children.length)
              setTableKey(item.children)
          })
          dataSourceRef.value = data
        }
      }
    }
    return unref(dataSourceRef)
  })
  // 更新某一条数据，完整替换
  async function updateTableData(index: number, key: string, value: any) {
    const record = dataSourceRef.value[index]
    if (record)
      dataSourceRef.value[index][key] = value

    return dataSourceRef.value[index]
  }
  // 更新数据某个值
  function updateTableDataRecord(rowKey: string | number, record: Recordable): Recordable | undefined {
    const row = findTableDataRecord(rowKey)

    if (row) {
      for (const field in row) {
        if (Reflect.has(record, field))
          row[field] = record[field]
      }

      return row
    }
  }

  function deleteTableDataRecord(rowKey: string | number | string[] | number[]) {
    if (!dataSourceRef.value || dataSourceRef.value.length === 0)
      return
    const rowKeyName = unref(getRowKey)
    if (!rowKeyName)
      return
    const rowKeys = !Array.isArray(rowKey) ? [rowKey] : rowKey
    // 根据rowkey 找到要删除的数据
    for (const key of rowKeys) {
      // 删除本地数据
      let index: number | undefined = dataSourceRef.value.findIndex((row) => {
        let targetKeyName: string
        if (typeof rowKeyName === 'function')
          targetKeyName = rowKeyName(row) as string
        else
          targetKeyName = rowKeyName as string

        return row[targetKeyName] === key
      })
      if (index >= 0) {
        dataSourceRef.value.splice(index, 1)
        resetPage()
      }
      // 删除源数据
      index = unref(propsRef).data?.findIndex((row) => {
        let targetKeyName: string
        if (typeof rowKeyName === 'function')
          targetKeyName = rowKeyName(row) as string
        else
          targetKeyName = rowKeyName as string

        return row[targetKeyName] === key
      })
      if (typeof index !== 'undefined' && index !== -1)
        unref(propsRef).data?.splice(index, 1)
    }

    // 数据变化后重新更正分页器长度， 需要整改
    setPagination({
      total: unref(propsRef).data?.length,
    })
  }

  // 根据索引添加数据
  function insertTableDataRecord(record: Recordable, index?: number): Recordable[] {
    index = index ?? dataSourceRef.value?.length
    unref(dataSourceRef).splice(index, 0, record)
    resetPage()
    return unref(dataSourceRef)
  }

  // 查找数据
  function findTableDataRecord(rowKey: string | number) {
    if (!dataSourceRef.value || dataSourceRef.value.length === 0)
      return

    const rowKeyName = unref(getRowKey)
    if (!rowKeyName)
      return

    const children = unref(propsRef).treeProps?.children || 'children'

    const findRow = (array: any[]): Recordable => {
      let ret
      array.some(function iter(r) {
        if (typeof rowKeyName === 'function') {
          if ((rowKeyName(r) as string) === rowKey) {
            ret = r
            return true
          }
        }
        else {
          if (Reflect.has(r, rowKeyName) && r[rowKeyName] === rowKey) {
            ret = r
            return true
          }
        }
        return r[children] && r[children].some(iter)
      })
      return ret as any
    }
    return findRow(dataSourceRef.value)
  }

  async function fetch(opt?: FetchParams): Promise<any> {
    const { api, searchInfo, defaultSort, fetchSetting, beforeFetch, afterFetch, useSearchForm, pagination }
      = unref(propsRef)
    if (!api || !isFunction(api))
      return
    try {
      setLoading(true)
      // 整合配置参数
      const { pageField, sizeField, listField, totalField } = Object.assign({}, FETCH_SETTING, fetchSetting)
      let pageParams: Recordable = {}

      const { currentPage = 1, pageSize = PAGE_SIZE } = unref(getPaginationInfo) as PaginationProps
      // 如果配置了pagination
      if ((isBoolean(pagination) && !pagination) || isBoolean(getPaginationInfo)) {
        pageParams = {}
      }
      else {
        pageParams[pageField] = (opt && opt.page) || currentPage
        pageParams[sizeField] = pageSize
      }

      const { sortInfo = {}, filterInfo } = searchState

      let params: Recordable = merge(
        pageParams,
        useSearchForm ? getFieldsValue() : {},
        searchInfo,
        opt?.searchInfo ?? {},
        defaultSort,
        sortInfo,
        filterInfo,
        opt?.sortInfo ?? {},
        opt?.filterInfo ?? {},
      )
      // 请求前处理数据
      if (beforeFetch && isFunction(beforeFetch))
        params = (await beforeFetch(params)) || params

      const res = await api(params)
      rawDataSourceRef.value = res

      const isArrayResult = Array.isArray(res)

      let resultItems: Recordable[] = isArrayResult ? res : get(res, listField)
      const resultTotal: number = isArrayResult ? res.length : get(res, totalField)

      // 假如数据变少，导致总页数变少并小于当前选中页码，通过getPaginationRef获取到的页码是不正确的，需获取正确的页码再次执行
      if (resultTotal) {
        const currentTotalPage = Math.ceil(resultTotal / Number(pageSize))
        if (Number(currentPage) > currentTotalPage) {
          setPagination({
            currentPage: currentTotalPage,
          })
          return await fetch(opt)
        }
      }

      if (afterFetch && isFunction(afterFetch))
        resultItems = (await afterFetch(resultItems)) || resultItems

      dataSourceRef.value = resultItems
      setPagination({
        total: resultTotal || 0,
      })
      if (opt && opt.page) {
        setPagination({
          currentPage: opt.page || 1,
        })
      }
      emit('fetchSuccess', {
        items: unref(resultItems),
        total: resultTotal,
      })
      return resultItems
    }
    catch (error) {
      emit('fetchError', error)
      dataSourceRef.value = []
      setPagination({
        total: 0,
      })
    }
    finally {
      setLoading(false)
    }
  }

  function setTableData(values: Recordable[]) {
    dataSourceRef.value = values
    resetPage()
  }

  function getDataSource<T = Recordable>() {
    return getDataSourceRef.value as T[]
  }

  function getRawDataSource<T = Recordable>() {
    return rawDataSourceRef.value as T
  }

  async function reload(opt?: FetchParams) {
    return await fetch(opt)
  }

  onMounted(() => {
    if (propsRef.value.defaultSort)
      searchState.sortInfo = propsRef.value.defaultSort

    useTimeoutFn(() => {
      unref(propsRef).immediate && fetch()
    }, 16)
  })

  return {
    getDataSourceRef,
    getDataSource,
    getRawDataSource,
    getRowKey,
    setTableData,
    getAutoCreateKey,
    fetch,
    reload,
    updateTableData,
    updateTableDataRecord,
    deleteTableDataRecord,
    insertTableDataRecord,
    findTableDataRecord,
    handleFilterChange,
    handleSortChange,
    handlePaginationChange,
    handleClearFilters,
    handleClearSort,
  }
}
