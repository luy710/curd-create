import type { FormProps, FormSchema } from '@/components'
import type { BasicColumn } from '@/components/Table/types/table'

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      label: 'ID',
      prop: 'id',
      fixed: 'left',
      width: 200,
      slots: { cellSlot: 'id' },
    },
    {
      label: '姓名',
      prop: 'name',
      width: 150,
      helpMessage: ['这是id'],
      filters: [
        { text: 'Male', value: 'male' },
        { text: 'Female', value: 'female' },
      ],
    },
    {
      label: '年级',
      prop: 'age',
      width: 150,
      helpMessage: ['这是id'],
    },
    {
      label: '地址',
      prop: 'address',
      minWidth: 240,
    },
    {
      label: '编号',
      prop: 'no',
      width: 150,
      sortable: true,
      defaultHidden: false,
    },
    {
      label: '开始时间',
      width: 150,
      sortable: true,
      prop: 'beginTime',
    },
    {
      label: '结束时间',
      width: 150,
      sortable: true,
      prop: 'endTime',
    },
    {
      label: '操作',
      width: 200,
      prop: 'action',
      slots: {
        cellSlot: 'action',
      },
    },
  ]
}

export function getBasicShortColumns(): BasicColumn[] {
  return [
    {
      label: 'ID',
      width: 150,
      prop: 'id',
      sortable: true,
    },
    {
      label: '姓名',
      prop: 'name',
      width: 120,
    },
    {
      label: '地址',
      prop: 'address',
    },
    {
      label: '编号',
      prop: 'no',
      width: 80,
    },
  ]
}

export function getMultipleHeaderColumns(): BasicColumn[] {
  return [
    {
      label: 'ID',
      prop: 'id',
      width: 200,
    },
    {
      label: '姓名',
      prop: 'name',
      width: 120,
    },
    {
      label: '地址',
      prop: 'address',
      sortable: true,
      // isMulti: true,
      helpMessage: ['地址信息', '多级表头'],
      slots: {
        headerSlot: 'addressSlot',
      },
      columns: [
        {
          label: '编号',
          prop: 'no',
          minWidth: 120,
          filters: [
            { text: 'Male', value: 'male' },
            { text: 'Female', value: 'female' },
          ],
        },
        {
          label: '开始时间',
          prop: 'beginTime',
          minWidth: 120,
          helpMessage: ['开始时间', 'beginTime'],
          slots: {
            headerSlot: 'beginTime',
          },
        },
        {
          label: '结束时间',
          prop: 'endTime',
          minWidth: 120,
        },
      ] as BasicColumn[],
    },
  ]
}

export function getCustomHeaderColumns(): BasicColumn[] {
  return [
    {
      label: 'ID',
      prop: 'id',
      helpMessage: 'headerHelpMessage方式1',
      width: 200,
    },
    {
      // label: '姓名',
      prop: 'name',
      width: 120,
      slots: { headerSlot: 'customTitle' },
    },
    {
      // label: '地址',
      prop: 'address',
      width: 120,
      slots: { headerSlot: 'customAddress' },
      sortable: true,
    },

    {
      label: '编号',
      prop: 'no',
      width: 120,
      filters: [
        { text: 'Male', value: 'male' },
        { text: 'Female', value: 'female' },
      ],
    },
    {
      label: '开始时间',
      prop: 'beginTime',
      // width: 120,
    },
    {
      label: '结束时间',
      prop: 'endTime',
      // width: 120,
    },
  ]
}
function renderContent({ text, index }: { text: any; index: number }) {
  const obj: any = {
    children: text,
    attrs: {},
  }
  if (index === 9)
    obj.attrs.colSpan = 0

  return obj
}
export function getMergeHeaderColumns(): BasicColumn[] {
  return [
    {
      label: 'ID',
      prop: 'id',
      width: 300,

    },
    {
      label: '姓名',
      prop: 'name',
      width: 300,

    },
    {
      label: '地址',
      prop: 'address',
      width: 120,
      sortable: true,
    },
    {
      label: '编号',
      prop: 'no',
      filters: [
        { text: 'Male', value: 'male' },
        { text: 'Female', value: 'female' },
      ],

    },
    {
      label: '开始时间',
      prop: 'beginTime',
      width: 200,

    },
    {
      label: '结束时间',
      prop: 'endTime',
      width: 200,

    },
  ]
}
export function getAdvanceSchema(itemNumber = 6): FormSchema[] {
  const arr: any = []
  for (let index = 0; index < itemNumber; index++) {
    arr.push({
      field: `field${index}`,
      label: `字段${index}`,
      component: 'Input',
      colProps: {
        xl: 12,
        xxl: 8,
      },
    })
  }
  return arr
}
export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 120,
    labelPosition: 'right',
    showAdvancedButton: true,
    alwaysShowLines: 2,
    actionColOptions: {
      span: 24,
    },
    baseColProps: {
      lg: 8,
      xl: 6,
    },
    schemas: [{
      field: 'payApplyNo',
      label: '支付申请号',
      component: 'Input',
      componentProps: {

      },
    }, {
      field: 'contractNo',
      label: '合同编号',
      component: 'Input',
    }, {
      field: 'orderId',
      label: '订单编号',
      component: 'Input',
    }, {
      field: 'payApplyTime',
      label: '申请日期',
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        rangeSeparator: '至',
        startPlaceholder: '开始',
        endPlaceholder: '结束',
        style: {
          width: '100%',
        },
      },
    }, {
      field: 'passDate',
      label: '审批完成日期',
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        rangeSeparator: '至',
        startPlaceholder: '开始',
        endPlaceholder: '结束',
        style: {
          width: '100%',
        },
      },
    }, {
      field: 'requireDate',
      label: '付款日期要求',
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        rangeSeparator: '至',
        startPlaceholder: '开始',
        endPlaceholder: '结束',
        style: {
          width: '100%',
        },
      },
    }, {
      field: 'payDate',
      label: '支付日期',
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        rangeSeparator: '至',
        startPlaceholder: '开始',
        endPlaceholder: '结束',
        style: {
          width: '100%',
        },
      },
    }, {
      field: 'householder',
      label: '收款人姓名',
      component: 'Input',
    }, {
      field: 'costScope',
      label: '费用范围',
      component: 'Select',
      componentProps: {
        options: [{
          label: '生产经营类',
          value: '01-01-000013-01',
        }, {
          label: '产业升级项目',
          value: '01-01-000013-10',
        }, {
          label: '乙烯项目',
          value: '01-01-000441-01',
        }],
      },
    }, {
      field: 'payApplyerName',
      label: '申请人',
      component: 'Input',
    }, {
      label: '状态',
      field: 'state',
      component: 'Select',
      componentProps: {
        options: [],
        style: {
          width: '100%',
        },
      },
    }],
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
        endTime: new Date().toLocaleString(),
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
            endTime: new Date().toLocaleString(),
          },
          {
            id: `l3-${index}`,
            name: 'John Brown222',
            age: `2${index}`,
            no: `${index + 10 + 1}`,
            address: 'New York No. 1 Lake ParkNew York No. 1ssssssss Lake Park',
            beginTime: new Date().toLocaleString(),
            endTime: new Date().toLocaleString(),
            children: [
              {
                id: `l2-${index}-3`,
                name: 'John Brown',
                age: `1${index}3`,
                no: `${index + 10}-3`,
                address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
                beginTime: new Date().toLocaleString(),
                endTime: new Date().toLocaleString(),
                children: [
                  {
                    id: `l2-${index}-4`,
                    name: 'John Brown',
                    age: `1${index}3`,
                    no: `${index + 10}-4`,
                    address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
                    beginTime: new Date().toLocaleString(),
                    endTime: new Date().toLocaleString(),
                    children: [
                      {
                        id: `l2-${index}-5`,
                        name: 'John Brown',
                        age: `1${index}3`,
                        no: `${index + 10}-5`,
                        address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
                        beginTime: new Date().toLocaleString(),
                        endTime: new Date().toLocaleString(),
                        children: [
                          {
                            id: `l2-${index}-6`,
                            name: 'John Brown',
                            age: `1${index}3`,
                            no: `${index + 10}-6`,
                            address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
                            beginTime: new Date().toLocaleString(),
                            endTime: new Date().toLocaleString(),
                            children: [
                              {
                                id: `l2-${index}-7`,
                                name: 'John Brown',
                                age: `1${index}3`,
                                no: `${index + 10}-7`,
                                address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
                                beginTime: new Date().toLocaleString(),
                                endTime: new Date().toLocaleString(),
                              }],
                          }],
                      }],
                  }],
              }],
          },
        ],
      })
    }
    return arr
  })()
}
