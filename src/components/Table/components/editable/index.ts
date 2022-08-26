import type { BasicColumn } from '@/components/Table/types/table'
import type { Ref } from 'vue'
// import { h, unref } from 'vue'

import EditableCell from './EditableCell.vue'
import { isArray } from '@/components/utils/is'

interface Params {
  text: string
  row: Recordable
  $index: number
}

export function renderEditCell(params: Params, column: BasicColumn) {
  const { row: record, $index } = params

  if (typeof record.onValid !== 'function') {
    record.onValid = async () => {
      if (isArray(record?.validCbs)) {
        const validFns = (record?.validCbs || []).map((fn) => fn())
        const res = await Promise.all(validFns)
        return res.every((item) => !!item)
      } else {
        return false
      }
    }
  }
  if (typeof record.onEdit !== 'function') {
    record.onEdit = async (edit: boolean, submit = false) => {
      if (!submit) {
        record.editable = edit
      }

      if (!edit && submit) {
        if (!(await record.onValid())) return false
        const res = await record.onSubmitEdit?.()
        if (res) {
          record.editable = false
          return true
        }
        return false
      }
      // cancel
      if (!edit && !submit) {
        record.onCancelEdit?.()
      }
      return true
    }
  }

  return h(EditableCell, {
    value: record[column.prop as string],
    record: unref(record),
    column,
    index: $index
  })
}

export type EditRecordRow<T = Recordable> = Partial<
  {
    onEdit: (editable: boolean, submit?: boolean) => Promise<boolean>
    onValid: () => Promise<boolean>
    editable: boolean
    onCancel: Fn
    onSubmit: Fn
    submitCbs: Fn[]
    cancelCbs: Fn[]
    validCbs: Fn[]
    editValueRefs: Recordable<Ref>
  } & T
>
