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
    <el-button class="mr-2" size="small" type="primary" @click="setSelectedRowKeyList"> 设置选中行 </el-button>
    <el-button class="mr-2" size="small" type="primary" @click="clearSelect"> 清空选中行 </el-button>
    <el-button class="mr-2" size="small" type="primary" @click="getPagination"> 获取分页信息 </el-button>

    <BasicTable @register="registerTable" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { BasicTable, ColumnChangeParam, useTable } from '@hobby/curd-create'
import { getBasicColumns, getBasicShortColumns } from './tableData'
import { ElMessage } from 'element-plus'
import { demoListApi } from '@/api/demo/table'
export default defineComponent({
  components: { BasicTable },
  setup() {
    const [
      registerTable,
      {
        setLoading,
        setColumns,
        getColumns,
        getDataSource,
        getRawDataSource,
        reload,
        getPaginationRef,
        setPagination,
        getSelectionRows,
        getSelectRowKeys,
        setSelectedRowKeys,
        clearSelection
      }
    ] = useTable({
      pagination: true,
      canResize: true,
      showSelectionColumn: true,
      showIndexColumn: true,
      title: 'useTable示例',
      titleHelpMessage: '使用useTable调用表格内方法',
      api: demoListApi,
      columns: getBasicColumns(),
      defaultSort: {
        prop: 'no',
        order: 'ascending'
      },
      rowKey: 'id',
      showTableSetting: true,
      onChange: (pagination, filter, sort) => {
        console.log('onChange', pagination, filter, sort)
      },
      onColumnsChange: (data: ColumnChangeParam[]) => {
        console.log('ColumnsChanged', data)
      }
    })

    function changeLoading() {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
    function changeColumns() {
      setColumns(getBasicShortColumns())
    }
    function reloadTable() {
      setColumns(getBasicColumns())

      reload({
        page: 1
      })
    }
    function getColumn() {
      ElMessage.info('请在控制台查看！')
      console.log(getColumns())
    }

    function getTableData() {
      ElMessage.info('请在控制台查看！')
      console.log(getDataSource())
    }

    function getTableRawData() {
      ElMessage.info('请在控制台查看！')
      console.log(getRawDataSource())
    }

    function getPagination() {
      ElMessage.info('请在控制台查看！')
      console.log(getPaginationRef())
    }

    function setPaginationInfo() {
      setPagination({
        currentPage: 2
      })
      reload()
    }
    function getSelectRowList() {
      ElMessage.info('请在控制台查看！')
      console.log(getSelectionRows())
    }
    function getSelectRowKeyList() {
      ElMessage.info('请在控制台查看！')
      console.log(getSelectRowKeys())
    }
    function setSelectedRowKeyList() {
      setSelectedRowKeys(['0', '1', '2'])
    }
    function clearSelect() {
      clearSelection()
    }

    return {
      registerTable,
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
      setSelectedRowKeyList,
      clearSelect
    }
  }
})
</script>
