<template>
  <div class="p-4">
    <BasicTable @register="registerTable" @edit-change="onEditChange">
      <template #action="scope">
        <TableAction :actions="createActions(scope.row, scope.column)" />
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { ActionItem, EditRecordRow } from '@/components/index'
import { cloneDeep } from 'lodash-es'
import { optionsListApi } from '@/api/demo/select'
import { BasicColumn } from '@/components/Table/types/table'
import { BasicTable, ColumnChangeParam, TableAction, useTable } from '@/components/index'
import { demoListApi } from '@/api/demo/table'
import { treeOptionsListApi } from '@/api/demo/tree'

const columns: BasicColumn[] = [
  {
    label: '输入框',
    editDynamicChange: true,
    prop: 'name',
    editRow: true,
    editComponentProps: {},
    width: 150
  },
  {
    label: '默认输入状态',
    prop: 'name7',
    editRow: true,
    width: 150
  },
  {
    label: '输入框校验',
    prop: 'name1',
    editRow: true,
    align: 'left',
    // 默认必填校验
    editRule: true,
    width: 150
  },
  {
    label: '输入框函数校验',
    prop: 'name2',
    editRow: true,
    align: 'right',
    editRule: async (text) => {
      if (text === '2') {
        return '不能输入该值'
      }
      return ''
    }
  },
  {
    label: '数字输入框',
    prop: 'id',
    editRow: true,
    editRule: true,
    editComponent: 'InputNumber',
    width: 150
  },
  {
    label: '下拉框',
    prop: 'name3',
    editRow: true,
    editComponent: 'Select',
    editComponentProps: {
      options: [
        {
          label: 'Option1',
          value: '1'
        },
        {
          label: 'Option2',
          value: '2'
        },
        {
          label: 'Option3',
          value: '3'
        }
      ]
    },
    width: 200
  },
  {
    label: '远程下拉',
    prop: 'name4',
    editRow: true,
    editComponent: 'Select',
    editComponentProps: {
      api: optionsListApi,
      resultField: 'list',
      labelField: 'name',
      valueField: 'id'
    },
    width: 200
  },
  {
    label: '远程下拉树',
    prop: 'name8',
    editRow: true,
    editComponent: 'Select',
    editRule: false,
    editComponentProps: {
      api: treeOptionsListApi,
      resultField: 'list'
    },
    width: 200
  },
  {
    label: '日期选择',
    prop: 'date',
    editRow: true,
    editComponent: 'DatePicker',
    editComponentProps: {
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD'
    },
    width: 150
  },
  {
    label: '时间选择',
    prop: 'time',
    editRow: true,
    editComponent: 'TimePicker',
    editComponentProps: {
      valueFormat: 'HH:mm',
      format: 'HH:mm'
    },
    width: 100
  },
  {
    label: '勾选框',
    prop: 'name5',
    editRow: true,

    editComponent: 'Checkbox',
    editValueMap: (value) => {
      return value ? '是' : '否'
    },
    width: 100
  },
  {
    label: '开关',
    prop: 'name6',
    editRow: true,
    editComponent: 'Switch',
    editValueMap: (value) => {
      return value ? '开' : '关'
    },
    width: 100
  }
]

export default defineComponent({
  components: { BasicTable, TableAction },
  setup() {
    // const { createMessage: msg } = useMessage();
    const currentEditKeyRef = ref('')
    const [registerTable] = useTable({
      title: '可编辑行示例',
      titleHelpMessage: ['本例中修改[数字输入框]这一列时，同一行的[远程下拉]列的当前编辑数据也会同步发生改变'],
      api: demoListApi,
      columns: columns,
      showIndexColumn: false,
      showTableSetting: true,
      tableSetting: { fullScreen: true },
      actionColumn: {
        width: 160,
        label: 'Action',
        prop: 'action',
        slots: { cellSlot: 'action' }
      }
    })

    function handleEdit(record: EditRecordRow) {
      currentEditKeyRef.value = record.key
      record.onEdit?.(true)
    }

    function handleCancel(record: EditRecordRow) {
      currentEditKeyRef.value = ''
      record.onEdit?.(false, false)
    }

    async function handleSave(record: EditRecordRow) {
      // 校验
      // msg.loading({ content: '正在保存...', duration: 0, key: 'saving' });
      const valid = await record.onValid?.()
      if (valid) {
        try {
          const data = cloneDeep(record.editValueRefs)
          console.log(data)
          // ...
          // 保存之后提交编辑状态
          const pass = await record.onEdit?.(false, false)
          if (pass) {
            currentEditKeyRef.value = ''
          }
          // msg.success({ content: '数据已保存', key: 'saving' });
        } catch (error) {
          // msg.error({ content: '保存失败', key: 'saving' });
        }
      } else {
        // msg.error({ content: '请填写正确的数据', key: 'saving' });
      }
    }

    function createActions(record: EditRecordRow, column: BasicColumn): ActionItem[] {
      if (!record.editable) {
        return [
          {
            label: '编辑',
            disabled: currentEditKeyRef.value ? currentEditKeyRef.value !== record.key : false,
            onClick: handleEdit.bind(null, record)
          }
        ]
      }
      return [
        {
          label: '保存',
          onClick: handleSave.bind(null, record, column)
        },
        {
          label: '取消',
          popConfirm: {
            title: '是否取消编辑',
            confirm: handleCancel.bind(null, record, column)
          }
        }
      ]
    }

    function onEditChange({ column, value, record }: any) {
      // 本例
      if (column.prop === 'id') {
        record.editValueRefs.name4.value = `${value}`
      }
      console.log(column, value, record)
    }

    return {
      registerTable,
      handleEdit,
      createActions,
      onEditChange
    }
  }
})
</script>
