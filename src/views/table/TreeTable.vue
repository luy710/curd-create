<template>
  <div class="p-4">
    <BasicTable @register="register">
      <template #toolbar>
        <el-button size="small" type="primary" @click="() => toggleRowExpand(true)">展开第一行</el-button>
        <el-button size="small" type="primary" @click="() => toggleRowExpand(false)">收起第一行</el-button>
        <el-button size="small" type="primary" @click="expandAll">展开全部</el-button>
        <el-button size="small" type="primary" @click="collapseAll">折叠全部</el-button>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { BasicTable, useTable } from '@hobby/curd-create'
import { getBasicColumns, getTreeTableData } from './tableData'

export default defineComponent({
  components: { BasicTable },
  setup() {
    const [register, { expandAll, collapseAll, toggleRowExpansion, getDataSource }] = useTable({
      title: '树形表格',
      isTreeTable: true,
      defaultExpandAll: true,
      titleHelpMessage: '树形组件不能和序列号列同时存在',
      columns: getBasicColumns(),
      data: getTreeTableData(),
      indent: 10,
      border: true,
      stripe: true,
      rowKey: 'id'
    })
    const toggleRowExpand = (expanded: boolean) => {
      toggleRowExpansion(getDataSource()[0], expanded)
    }
    return { register, expandAll, collapseAll, toggleRowExpand }
  }
})
</script>
