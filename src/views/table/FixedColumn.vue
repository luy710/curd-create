<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #action="{ row }">
        <TableAction
          :actions="[
            {
              label: '删除',
              icon: 'ic:outline-delete-outline',
              onClick: handleDelete.bind(null, row)
            }
          ]"
          :dropDownActions="[
            {
              label: '启用',
              popConfirm: {
                title: '是否启用？',
                confirm: handleOpen.bind(null, row)
              }
            }
          ]"
        />
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { BasicTable, useTable, BasicColumn, TableAction } from '@/components/index'

import { demoListApi } from '@/api/demo/table'
const columns: BasicColumn[] = [
  {
    label: 'ID',
    prop: 'id',
    fixed: 'left',
    width: 280
  },
  {
    label: '姓名',
    prop: 'name',
    width: 260
  },
  {
    label: '地址',
    prop: 'address'
  },
  {
    label: '编号',
    prop: 'no',
    width: 300
  },
  {
    label: '开始时间',
    width: 200,
    prop: 'beginTime'
  },
  {
    label: '结束时间',
    prop: 'endTime',
    width: 200
  }
]
export default defineComponent({
  components: { BasicTable, TableAction },
  setup() {
    const [registerTable] = useTable({
      title: 'TableAction组件及固定列示例',
      api: demoListApi,
      columns: columns,
      border: true,
      actionColumn: {
        width: 160,
        label: 'Action',
        prop: 'action',
        slots: { cellSlot: 'action' }
      }
    })
    function handleDelete(record: Recordable) {
      console.log('点击了删除', record)
    }
    function handleOpen(record: Recordable) {
      console.log('点击了启用', record)
    }
    return {
      registerTable,
      handleDelete,
      handleOpen
    }
  }
})
</script>
