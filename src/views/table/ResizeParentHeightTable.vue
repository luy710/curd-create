<template>
  <div class="h-full flex">
    <div class="flex flex-col pr-4 w-1/2">
      <div class="flex-1">
        <BasicTable @register="registerTable" />
      </div>
      <div class="h-4"></div>
      <div class="flex-1">
        <BasicTable @register="registerTable" />
      </div>
    </div>
    <div class="flex-1 flex flex-col w-1/2 h-full">
      <div class="h-1/3 mb-4">
        <BasicTable @register="registerTable" />
      </div>
      <div class="h-1/3 mb-4">
        <BasicTable @register="registerTable2" />
      </div>
      <div class="h-1/3">
        <BasicTable @register="registerTable1" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { BasicTable, useTable } from '@/components/index'
import { getBasicColumns, getFormConfig } from './tableData'

import { demoListApi } from '@/api/demo/table'

export default defineComponent({
  components: { BasicTable },
  setup(_) {
    const [registerTable] = useTable({
      api: demoListApi,
      columns: getBasicColumns(),
      useSearchForm: true,
      pagination: false,
      formConfig: getFormConfig(),
      showTableSetting: true,
      tableSetting: { fullScreen: true },
      showIndexColumn: false,
      isCanResizeParent: true,
      border: true,
      rowKey: 'id'
    })

    const [registerTable1] = useTable({
      api: demoListApi,
      columns: getBasicColumns(),
      formConfig: getFormConfig(),
      showTableSetting: true,
      tableSetting: { fullScreen: true },
      showIndexColumn: false,
      isCanResizeParent: true,
      useSearchForm: true,
      pagination: false,
      border: true,
      rowKey: 'id'
    })

    const [registerTable2] = useTable({
      api: demoListApi,
      columns: getBasicColumns(),
      formConfig: getFormConfig(),
      showTableSetting: true,
      tableSetting: { fullScreen: true },
      showIndexColumn: false,
      isCanResizeParent: true,
      useSearchForm: true,
      pagination: false,
      border: true,
      rowKey: 'id'
    })

    return {
      registerTable,
      registerTable1,
      registerTable2
    }
  }
})
</script>
<style lang="scss" scoped>
.h-full {
  height: 100%;
}
.flex {
  display: flex;
}
.p-4 {
  padding: 1rem;
}

.flex-col {
  flex-direction: column;
}
.pr-4 {
  padding-right: 1rem;
}
.w-1\/2 {
  width: 50%;
}
.flex-1 {
  flex: 1 1 0%;
}
.h-4 {
  height: 1rem;
}
.mb-4 {
  margin-bottom: 1rem;
}
.h-1\/3 {
  height: 33%;
}
</style>
