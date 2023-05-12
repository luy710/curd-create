<script lang="ts">
import { defineComponent, ref } from 'vue'
import { getBasicColumns, getFormConfig } from './tableData'
import { BasicTable, useTable } from '@/components'

import { demoListApi } from '@/api/demo/table'

export default defineComponent({
  components: { BasicTable },
  setup() {
    const checkedKeys = ref<Array<Recordable>>([])
    const [registerTable, { getForm, clearSelection }] = useTable({
      title: '开启搜索区域',
      api: demoListApi,
      columns: [{ type: 'selection', fixed: 'left', slots: { headerSlot: 'selectSlot' } }, ...getBasicColumns()],
      useSearchForm: true,
      formConfig: getFormConfig(),
      clearSelectOnPageChange: false,
      showTableSetting: true,
      pagination: { currentPage: 1, pageSize: 20 },
      tableSetting: { fullScreen: true },
      showIndexColumn: false,
      rowKey: 'id',
      defaultSort: {
        prop: 'no',
        order: 'ascending',
      },
    })

    function getFormValues() {
      console.log(getForm().getFieldsValue())
    }
    const clearAllSelection = () => {
      clearSelection()
    }
    function onSelectChange(selectedRowKeys: Recordable[]) {
      console.log(selectedRowKeys)
      checkedKeys.value = selectedRowKeys
    }

    return {
      registerTable,
      getFormValues,
      checkedKeys,
      onSelectChange,
      clearAllSelection,
    }
  },
})
</script>

<template>
  <BasicTable @register="registerTable" @selectionChange="onSelectChange">
    <template #form-custom>
      custom-slot
    </template>
    <template #headerTop>
      <el-alert type="info" show-icon :closable="false">
        <template #title>
          <template v-if="checkedKeys.length > 0">
            <span>已选中{{ checkedKeys.length }}条记录(可跨页)</span>
            <el-button link type="primary" size="small" @click="clearAllSelection">
              清空
            </el-button>
          </template>
          <template v-else>
            <span>未选中任何项目</span>
          </template>
        </template>
      </el-alert>
    </template>
    <template #selectSlot>
      <span>asdads</span>
    </template>
    <template #toolbar>
      <el-button type="primary" size="small" @click="getFormValues">
        获取表单数据
      </el-button>
    </template>
  </BasicTable>
</template>
