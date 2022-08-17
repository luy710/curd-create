import type { BasicColumn, BasicTableProps, CellFormat, GetColumnsParams } from '../types/table'
import type { ComputedRef } from 'vue'
import { computed, Ref, ref, reactive, toRaw, unref, watch } from 'vue'
import { renderEditCell } from '../components/editable'
import { isArray, isBoolean, isFunction, isMap, isString } from '@/components/utils/is'
import { cloneDeep, isEqual, omit } from 'lodash-es'
import { buildUUID } from '@/components/utils/uuid'
import { formatToDate } from '@/components/utils/dateUtil'
import { ACTION_COLUMN_FLAG, DEFAULT_ALIGN, INDEX_COLUMN_FLAG, PAGE_SIZE } from '../constant'

// 二次处理action 列
function handleActionColumn(propsRef: ComputedRef<BasicTableProps>, columns: BasicColumn[]) {
  const { actionColumn } = unref(propsRef)
  if (!actionColumn) return

  const hasIndex = columns.findIndex((column) => column.flag === ACTION_COLUMN_FLAG)
  if (hasIndex === -1) {
    columns.push({
      ...columns[hasIndex],
      ...{ fixed: 'right' },
      ...actionColumn,
      flag: ACTION_COLUMN_FLAG
    })
  }
}

export function useColumns(propsRef: ComputedRef<BasicTableProps>) {
  const columnsRef = ref(unref(propsRef).columns) as unknown as Ref<BasicColumn[]>
  let cacheColumns = unref(propsRef).columns

  const getColumnsRef = computed(() => {
    const columns = cloneDeep(unref(columnsRef))
    handleActionColumn(propsRef, columns)
    if (!columns) {
      return []
    }
    return columns
  })
  // 是否显示该列
  function isIfShow(column: BasicColumn): boolean {
    const ifShow = column.ifShow

    let isIfShow = true

    if (isBoolean(ifShow)) {
      isIfShow = ifShow
    }
    if (isFunction(ifShow)) {
      isIfShow = ifShow(column)
    }
    return isIfShow
  }
  // 获取可显示的列
  const getViewColumns = computed(() => {
    const viewColumns = sortFixedColumn(unref(getColumnsRef))

    const columns = cloneDeep(viewColumns)
    return columns
      .filter((column) => {
        return isIfShow(column) && !['expand', 'selection', 'index'].includes(column.type || '')
      })
      .map((column) => {
        if (!column['columnKey']) {
          column['columnKey'] = column.prop || buildUUID()
        }
        return reactive(column)
      })
  })

  // 获取展开收起配置
  const getExpandColumnProps = computed(() => {
    const { expandColumnProps, columns } = unref(propsRef)
    const expandCol = columns.find((col) => col.type === 'expand') ?? {}
    return omit(
      {
        width: 40,
        align: 'center',
        fixed: 'left',
        label: '',
        ...expandCol,
        ...expandColumnProps
      },
      ['type']
    )
  })
  // 获取索引列配置
  const getInndexColumnProps = computed(() => {
    const { indexColumnProps, columns } = unref(propsRef)
    const indexCol = columns.find((col) => col.type === 'index') ?? {}
    return omit(
      {
        width: 60,
        label: '#',
        align: 'center',
        fixed: 'left',
        ...indexCol,
        ...indexColumnProps
      },
      ['type']
    )
  })

  // 获取多选列配置
  const getSelectColumnProps = computed(() => {
    const { selectionColumnProps, columns } = unref(propsRef)
    const selectionCol = columns.find((col) => col.type === 'selection') ?? {}
    return omit(
      {
        width: 60,
        align: 'center',
        fixed: 'left',
        ...selectionCol,
        ...selectionColumnProps
      },
      ['type']
    )
  })
  watch(
    () => unref(propsRef).columns,
    (columns) => {
      columnsRef.value = columns
      cacheColumns = columns?.filter((item) => !item.type) ?? []
    }
  )

  function setCacheColumnsByField(prop: string | undefined, value: Partial<BasicColumn>) {
    if (!prop || !value) {
      return
    }
    cacheColumns.forEach((item) => {
      if (item.prop === prop) {
        Object.assign(item, value)
        return
      }
    })
  }

  /**
   * set columns
   * @param columnList key｜column
   */
  function setColumns(columnList: Partial<BasicColumn>[] | (string | string[])[]) {
    const columns = cloneDeep(columnList)
    if (!isArray(columns)) return

    if (columns.length <= 0) {
      columnsRef.value = []
      return
    }

    const firstColumn = columns[0]

    const cacheKeys = cacheColumns.map((item) => item.prop)

    if (!isString(firstColumn) && !isArray(firstColumn)) {
      columnsRef.value = columns as BasicColumn[]
    } else {
      const columnKeys = (columns as (string | string[])[]).map((m) => m.toString())
      const newColumns: BasicColumn[] = []
      cacheColumns.forEach((item) => {
        newColumns.push({
          ...item,
          defaultHidden: !columnKeys.includes(item.prop?.toString() || (item.columnKey as string))
        })
      })
      // Sort according to another array
      if (!isEqual(cacheKeys, columns)) {
        newColumns.sort((prev, next) => {
          return (
            columnKeys.indexOf(prev.prop?.toString() as string) - columnKeys.indexOf(next.prop?.toString() as string)
          )
        })
      }
      columnsRef.value = newColumns
    }
  }

  function getColumns(opt?: GetColumnsParams) {
    const { ignoreIndex, ignoreAction, ignoreSelection, sort, ignoreExpand } = opt || {}
    let columns = toRaw(unref(getColumnsRef))
    if (ignoreIndex) {
      columns = columns.filter((item) => item.type !== 'index')
    }
    if (ignoreAction) {
      columns = columns.filter((item) => item.flag !== ACTION_COLUMN_FLAG)
    }
    if (ignoreSelection) {
      columns = columns.filter((item) => item.type !== 'selection')
    }

    if (ignoreExpand) {
      columns = columns.filter((item) => item.type !== 'expand')
    }

    if (sort) {
      columns = sortFixedColumn(columns)
    }

    return columns
  }
  function getCacheColumns() {
    return cacheColumns
  }

  return {
    getColumnsRef,
    getExpandColumnProps,
    getInndexColumnProps,
    getSelectColumnProps,
    getCacheColumns,
    getColumns,
    setColumns,
    getViewColumns,
    setCacheColumnsByField
  }
}

function sortFixedColumn(columns: BasicColumn[]) {
  const fixedLeftColumns: BasicColumn[] = []
  const fixedRightColumns: BasicColumn[] = []
  const defColumns: BasicColumn[] = []
  for (const column of columns) {
    if (column.fixed === 'left') {
      fixedLeftColumns.push(column)
      continue
    }
    if (column.fixed === 'right') {
      fixedRightColumns.push(column)
      continue
    }
    defColumns.push(column)
  }
  return [...fixedLeftColumns, ...defColumns, ...fixedRightColumns].filter((item) => !item.defaultHidden)
}

// format cell
export function formatCell(text: string, format: CellFormat, record: Recordable, index: number) {
  if (!format) {
    return text
  }

  // custom function
  if (isFunction(format)) {
    return format(text, record, index)
  }

  try {
    // date type
    const DATE_FORMAT_PREFIX = 'date|'
    if (isString(format) && format.startsWith(DATE_FORMAT_PREFIX) && text) {
      const dateFormat = format.replace(DATE_FORMAT_PREFIX, '')

      if (!dateFormat) {
        return text
      }
      return formatToDate(text as any, dateFormat)
    }

    // Map
    if (isMap(format)) {
      return format.get(text)
    }
  } catch (error) {
    return text
  }
}
