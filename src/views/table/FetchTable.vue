<template>
  <el-card>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleReloadCurrent"> 刷新当前页 </a-button>
        <a-button type="primary" @click="handleReload"> 刷新并返回第一页 </a-button>
      </template>
    </BasicTable>
  </el-card>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { BasicTable, useTable } from '@hobby/curd-create'
import { getBasicColumns } from './tableData'
import { omit } from 'lodash-es'
import { demoListApi } from '@/api/demo/table'
export default defineComponent({
  components: { BasicTable },
  setup() {
    const [registerTable, { reload }] = useTable({
      title: '远程加载示例',
      api: demoListApi,
      columns: getBasicColumns(),
      pagination: { pageSize: 10 },
      sortFetchImmediate: false,
      sortFn: (sort) => ({ pageSort: omit(sort, ['column']) }),
      filterFn: (filter) => ({ pageFilter: filter })
    })
    function handleReloadCurrent() {
      reload()
    }

    function handleReload() {
      reload({
        page: 1
      })
    }
    return {
      registerTable,
      handleReloadCurrent,
      handleReload
    }
  }
})
</script>
