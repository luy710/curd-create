import { FormProps, FormSchema } from '@/components/index'
import { BasicColumn } from '@/components/Table/types/table'

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      label: 'ID',
      prop: 'id',
      fixed: 'left',
      width: 200
    },
    {
      label: '姓名',
      prop: 'name',
      width: 150,
      helpMessage: ['这是id'],
      filters: [
        { text: 'Male', value: 'male' },
        { text: 'Female', value: 'female' }
      ]
    },
    {
      label: '地址',
      prop: 'address'
    },
    {
      label: '编号',
      prop: 'no',
      width: 150,
      sortable: true,
      defaultHidden: true
    },
    {
      label: '开始时间',
      width: 150,
      sortable: true,
      prop: 'beginTime'
    },
    {
      label: '结束时间',
      width: 150,
      sortable: true,
      prop: 'endTime'
    },
    {
      label: '操作',
      width: 100,
      prop: 'action',
      slots: {
        cellSlot: 'action'
      }
    }
  ]
}

export function getBasicShortColumns(): BasicColumn[] {
  return [
    {
      label: 'ID',
      width: 150,
      prop: 'id',
      sortable: true
    },
    {
      label: '姓名',
      prop: 'name',
      width: 120
    },
    {
      label: '地址',
      prop: 'address'
    },
    {
      label: '编号',
      prop: 'no',
      width: 80
    }
  ]
}

export function getMultipleHeaderColumns(): BasicColumn[] {
  return [
    {
      label: 'ID',
      prop: 'id',
      width: 200
    },
    {
      label: '姓名',
      prop: 'name',
      width: 120
    },
    {
      label: '地址',
      prop: 'address',
      sortable: true,
      children: [
        {
          label: '编号',
          prop: 'no',
          width: 120,
          filters: [
            { text: 'Male', value: 'male' },
            { text: 'Female', value: 'female' }
          ]
        },
        {
          label: '开始时间',
          prop: 'beginTime',
          width: 120
        },
        {
          label: '结束时间',
          prop: 'endTime',
          width: 120
        }
      ] as BasicColumn[]
    }
  ]
}

export function getCustomHeaderColumns(): BasicColumn[] {
  return [
    {
      label: 'ID',
      prop: 'id',
      helpMessage: 'headerHelpMessage方式1',
      width: 200
    },
    {
      // label: '姓名',
      prop: 'name',
      width: 120
      // slots: { label: 'customTitle' },
    },
    {
      // label: '地址',
      prop: 'address',
      width: 120,
      // slots: { label: 'customAddress' },
      sortable: true
    },

    {
      label: '编号',
      prop: 'no',
      width: 120,
      filters: [
        { text: 'Male', value: 'male' },
        { text: 'Female', value: 'female' }
      ]
    },
    {
      label: '开始时间',
      prop: 'beginTime',
      width: 120
    },
    {
      label: '结束时间',
      prop: 'endTime',
      width: 120
    }
  ]
}
const renderContent = ({ text, index }: { text: any; index: number }) => {
  const obj: any = {
    children: text,
    attrs: {}
  }
  if (index === 9) {
    obj.attrs.colSpan = 0
  }
  return obj
}
export function getMergeHeaderColumns(): BasicColumn[] {
  return [
    {
      label: 'ID',
      prop: 'id',
      width: 300
    },
    {
      label: '姓名',
      prop: 'name',
      width: 300
    },
    {
      label: '地址',
      prop: 'address',
      colSpan: 2,
      width: 120,
      sortable: true
    },
    {
      label: '编号',
      prop: 'no',
      colSpan: 0,
      filters: [
        { text: 'Male', value: 'male' },
        { text: 'Female', value: 'female' }
      ]
    },
    {
      label: '开始时间',
      prop: 'beginTime',
      width: 200
    },
    {
      label: '结束时间',
      prop: 'endTime',
      width: 200
    }
  ]
}
export const getAdvanceSchema = (itemNumber = 6): FormSchema[] => {
  const arr: any = []
  for (let index = 0; index < itemNumber; index++) {
    arr.push({
      field: `field${index}`,
      label: `字段${index}`,
      component: 'Input',
      colProps: {
        xl: 12,
        xxl: 8
      }
    })
  }
  return arr
}
export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      ...getAdvanceSchema(5),
      {
        field: `field11`,
        label: `Slot示例`,
        component: 'Select',
        slot: 'custom',
        colProps: {
          xl: 12,
          xxl: 8
        }
      }
    ]
  }
}
export function getBasicData() {
  return (() => {
    const arr: any = []
    for (let index = 0; index < 40; index++) {
      arr.push({
        id: `${index}`,
        name: 'John Brown',
        age: `1${index}`,
        no: `${index + 10}`,
        address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
        beginTime: new Date().toLocaleString(),
        endTime: new Date().toLocaleString()
      })
    }
    return arr
  })()
}

export function getTreeTableData() {
  return (() => {
    const arr: any = []
    for (let index = 0; index < 40; index++) {
      arr.push({
        id: `${index}`,
        name: 'John Brown',
        age: `1${index}`,
        no: `${index + 10}`,
        address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
        beginTime: new Date().toLocaleString(),
        endTime: new Date().toLocaleString(),
        children: [
          {
            id: `l2-${index}`,
            name: 'John Brown',
            age: `1${index}`,
            no: `${index + 10}`,
            address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
            beginTime: new Date().toLocaleString(),
            endTime: new Date().toLocaleString()
          }
        ]
      })
    }
    return arr
  })()
}
