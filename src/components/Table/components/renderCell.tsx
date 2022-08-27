import type { Slots } from 'vue'
import { BasicColumn } from '../types/table'
import TableHeaderCell from './HeaderCell.vue'
import { renderEditCell } from './editable/index'
import { isFunction } from '../../utils/is'

import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'

export interface CI {
  column: BasicColumn
  $index: number
}
export interface CellRenderParams extends CI {
  row: Recordable
}

export const renderHeader = ({ column, $index }: CI, propsSlots: Slots) => {
  const { slots } = column
  if (slots && slots.headerSlot) {
    if (propsSlots[slots.headerSlot]) {
      return (propsSlots[slots.headerSlot] as Function)({ column, $index })
    }
  }
  return <TableHeaderCell column={column} />
}

export const renderCell = ({ row, column, $index }: CellRenderParams, propsSlots: Slots) => {
  const { prop, slots, edit, editRow } = column
  if (slots && slots?.cellSlot) {
    if (propsSlots[slots.cellSlot]) {
      return (propsSlots[slots.cellSlot] as Function)({ row, column, $index })
    }
  }

  if (edit || editRow) {
    return renderEditCell({ text: row[column.prop as string], row, $index }, column)
  }
  
  if (column.formatter && isFunction(column.formatter)) {
    return <span>{column.formatter(row, column as TableColumnCtx<Recordable>, row[prop as string], $index)}</span>
  }

  return <span>{row[prop as string]}</span>
}
