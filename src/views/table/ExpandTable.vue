<template>
  <div>
    <el-page-header
      title="可展开表格"
      content="TableAction组件可配置stopButtonPropagation来阻止操作按钮的点击事件冒泡，以便配合Table组件的expandRowByClick"
    />
    <BasicTable @register="registerTable" @rowClick="rowClickHandle" @currentChange="currentChange">
      <template #toolbar>
        <el-button size="small" type="primary" @click="() => toggleRowExpand(true)">展开第一行</el-button>
        <el-button size="small" type="primary" @click="() => toggleRowExpand(false)">收起第一行</el-button>
        <el-button size="small" type="primary" @click="expandAll">展开全部</el-button>
        <el-button size="small" type="primary" @click="collapseAll">折叠全部</el-button>
      </template>
      <template #expand="{ row }">
        <el-button size="small" type="primary">{{ row.no }}</el-button>
      </template>
      <template #action="{ row: record }">
        <el-button @click="() => handleDelete(record)">点击了删除</el-button>
        <!-- <TableAction
          stopButtonPropagation
          :actions="[
            {
              label: '删除',
              icon: 'ic:outline-delete-outline',
              onClick: handleDelete.bind(null, record)
            }
          ]"
          :dropDownActions="[
            {
              label: '启用',
              popConfirm: {
                title: '是否启用？',
                confirm: handleOpen.bind(null, record)
              }
            }
          ]"
        /> -->
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { BasicTable, useTable, TableAction } from '@/components/index'
import { getBasicColumns } from './tableData'
import { demoListApi } from '@/api/demo/table'

export default defineComponent({
  components: { BasicTable, TableAction },
  setup() {
    const [registerTable, { getColumns, setCurrentRow, expandAll, collapseAll, toggleRowExpansion, getDataSource }] =
      useTable({
        api: demoListApi,
        title: '可展开表格演示 + 单选',
        titleHelpMessage: ['已启用expandRowByClick', '已启用stopButtonPropagation'],
        columns: [
          {
            label: '展开收起',
            type: 'expand',
            width: 50,
            fixed: 'left',
            slots: {
              cellSlot: 'expand'
            }
          },
          ...getBasicColumns()
        ],
        highlightCurrentRow: true,
        rowKey: 'id',
        canResize: true,
        showExpandColumn: true,
        actionColumn: {
          width: 160,
          label: 'Action',
          prop: 'action',
          fixed: 'right',
          slots: { cellSlot: 'action' }
        }
      })
    function handleDelete(record: Recordable) {
      console.log('点击了删除', record, getColumns())
    }
    function handleOpen(record: Recordable) {
      console.log('点击了启用', record)
    }

    const toggleExpand = (row: any, column: any) => {
      console.log(row, column, '--------')
      toggleRowExpansion(row, true)
    }

    const rowClickHandle = (row: Recordable) => {
      setCurrentRow(row)
    }

    const currentChange = (row: Recordable) => {
      console.log(row)
    }

    const toggleRowExpand = (expanded: boolean) => {
      toggleRowExpansion(getDataSource()[0], expanded)
    }
    return {
      registerTable,
      handleDelete,
      handleOpen,
      toggleExpand,
      rowClickHandle,
      currentChange,
      expandAll,
      collapseAll,
      toggleRowExpand
    }
  }
})
</script>
