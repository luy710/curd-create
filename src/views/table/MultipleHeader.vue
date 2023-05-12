<script lang="ts">
import { defineComponent } from 'vue'
import { getMultipleHeaderColumns } from './tableData'
import { BasicTable, useTable } from '@/components'

import { demoListApi } from '@/api/demo/table'

export default defineComponent({
  components: { BasicTable },
  setup() {
    const [registerTable] = useTable({
      title: '多级表头示例',
      api: demoListApi,
      columns: getMultipleHeaderColumns(),
    })

    return {
      registerTable,
    }
  },
})
</script>

<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #beginTime="{ column, $index }">
        <el-button>{{ column.label }}</el-button>
      </template>
    </BasicTable>
  </div>
</template>
