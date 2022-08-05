import type { Slots } from 'vue'
import { BasicColumn } from '../types/table'
import { BasicHelp } from '@/components/Basic'
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
export interface CI {
  column: BasicColumn
  $index: number
}


export interface CellRenderParams extends CI {
  row: Recordable
}

export const renderHeader = ({ column, $index }: CI, propsSlots: Slots) => {
  const { label, helpMessage, helpComponentProps, slots } = column
  if (slots && slots.headerSlot) {
    if (propsSlots[slots.headerSlot]) {
      return (propsSlots[slots.headerSlot] as Function)({ column, $index })
    }
  }
  return (
    <span>
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