import type { Slots } from 'vue'
import { BasicColumn } from '../types/table'
import { BasicHelp } from '@/components/Basic'
export interface CI {
  column: BasicColumn
  $index: number
}
export interface CellRenderParams extends CI {
  row: Recordable
}

export interface ExpandCellParams {
  $index: number
  row: Recordable
  store: Recordable
  expanded: boolean
}

export const renderHeader = ({ column, $index }: CI, propsSlots: Slots) => {
  const { label, helpMessage, helpComponentProps, slots } = column
  if (slots && slots.headerSlot) {
    if (propsSlots[slots.headerSlot]) {
      return (propsSlots[slots.headerSlot] as Function)({ column, $index })
    }
  }
  return (
    <span class="custom-cell-title">
      {label} {helpMessage && <BasicHelp text={helpMessage} {...helpComponentProps} />}
    </span>
  )
}

export const renderCell = ({ row, column, $index }: CellRenderParams, propsSlots: Slots) => {
  const { prop, slots } = column
  if (slots && slots?.cellSlot) {
    if (propsSlots[slots.cellSlot]) {
      return (propsSlots[slots.cellSlot] as Function)({ row, column, $index })
    }
  }
  return <span>{row[prop as string]}</span>
}


export const renderExpandCell = ({row, $index, store, expanded}: ExpandCellParams, propsSlots: Slots, column: BasicColumn) => {
  const { slots } = column
  return slots?.cellSlot && (propsSlots[slots?.cellSlot] as Function)({ row, $index, store, expanded })
}