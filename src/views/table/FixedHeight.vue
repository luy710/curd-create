<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #customTitle>
        <span>
          姓名
          <BasicHelp class="ml-2" text="headerHelpMessage方式2" />
        </span>
      </template>
      <template #customAddress>
        地址<el-icon><AlarmClock /></el-icon>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { BasicTable, useTable, BasicHelp } from '@/components/index'
import { getCustomHeaderColumns } from './tableData'
import { demoListApi } from '@/api/demo/table'
// import HeaderCell from '@/components/Table/components/HeaderCell.vue'
import { AlarmClock } from '@element-plus/icons-vue'

export default defineComponent({
  components: { BasicTable, BasicHelp, AlarmClock },
  setup() {
    const [registerTable] = useTable({
      title: '定高/头部自定义',
      api: demoListApi,
      columns: getCustomHeaderColumns(),
      canResize: true,
      maxHeight: 500
    })

    return {
      registerTable
    }
  }
})
</script>
