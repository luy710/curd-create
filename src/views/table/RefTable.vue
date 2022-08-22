<template>
  <div class="p-4">
    <el-button class="mr-2" size="small" type="primary" @click="reloadTable"> 还原 </el-button>
    <el-button class="mr-2" size="small" type="primary" @click="changeLoading"> 开启loading </el-button>
    <el-button class="mr-2" size="small" type="primary" @click="changeColumns"> 更改Columns </el-button>
    <el-button class="mr-2" size="small" type="primary" @click="getColumn"> 获取Columns </el-button>
    <el-button class="mr-2" size="small" type="primary" @click="getTableData"> 获取表格数据 </el-button>
    <el-button class="mr-2" size="small" type="primary" @click="getTableRawData"> 获取接口原始数据 </el-button>
    <el-button class="mr-2" size="small" type="primary" @click="setPaginationInfo"> 跳转到第2页 </el-button>

    <el-button class="mr-2" size="small" type="primary" @click="getSelectRowList"> 获取选中行 </el-button>
    <el-button class="mr-2" size="small" type="primary" @click="getSelectRowKeyList"> 获取选中行Key </el-button>
    <el-button class="mr-2" size="small" type="primary" @click="setSelectedRowList"> 设置选中行 </el-button>
    <el-button class="mr-2" size="small" type="primary" @click="clearSelect"> 清空选中行 </el-button>
    <el-button class="mr-2" size="small" type="primary" @click="getPagination"> 获取分页信息 </el-button>

    <BasicTable
      :canResize="false"
      title="RefTable示例"
      titleHelpMessage="使用Ref调用表格内方法"
      ref="tableRef"
      :api="api"
      :columns="columns"
      rowKey="id"
      :pagination="true"
      :showSelectionColumn="true"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, unref } from 'vue'
import { BasicTable, TableActionType } from '@hobby/curd-create'
import { getBasicColumns, getBasicShortColumns } from './tableData'
import { demoListApi } from '@/api/demo/table'
import { ElMessage } from 'element-plus'
export default defineComponent({
  components: { BasicTable },
  setup() {
    const tableRef = ref<Nullable<TableActionType>>(null)

    function getTableAction() {
      const tableAction = unref(tableRef)
      if (!tableAction) {
        throw new Error('tableAction is null')
      }
      return tableAction
    }
    function changeLoading() {
      getTableAction().setLoading(true)
      setTimeout(() => {
        getTableAction().setLoading(false)
      }, 1000)
    }
    function changeColumns() {
      getTableAction().setColumns(getBasicShortColumns())
    }
    function reloadTable() {
      getTableAction().setColumns(getBasicColumns())

      getTableAction().reload({
        page: 1
      })
    }
    function getColumn() {
      ElMessage.info('请在控制台查看！')
      console.log(getTableAction().getColumns())
    }

    function getTableData() {
      ElMessage.info('请在控制台查看！')
      console.log(getTableAction().getDataSource())
    }
    function getTableRawData() {
      ElMessage.info('请在控制台查看！')
      console.log(getTableAction().getRawDataSource())
    }

    function getPagination() {
      ElMessage.info('请在控制台查看！')
      console.log(getTableAction().getPaginationRef())
    }

    function setPaginationInfo() {
      getTableAction().setPagination({
        currentPage: 2
      })
      getTableAction().reload()
    }
    function getSelectRowList() {
      ElMessage.info('请在控制台查看！')
      console.log(getTableAction().getSelectionRows())
    }
    function getSelectRowKeyList() {
      ElMessage.info('请在控制台查看！')
      console.log(getTableAction().getSelectionRows())
    }
    function setSelectedRowList() {
      getTableAction().toggleRowSelection(getTableAction().getDataSource()[0], true)
      getTableAction().toggleRowSelection(getTableAction().getDataSource()[1], true)
      getTableAction().toggleRowSelection(getTableAction().getDataSource()[2], true)
    }
    function clearSelect() {
      getTableAction().clearSelection()
    }

    return {
      tableRef,
      api: demoListApi,
      columns: getBasicColumns(),
      changeLoading,
      changeColumns,
      reloadTable,
      getColumn,
      getTableData,
      getTableRawData,
      getPagination,
      setPaginationInfo,
      getSelectRowList,
      getSelectRowKeyList,
      setSelectedRowList,
      clearSelect
    }
  }
})
</script>
