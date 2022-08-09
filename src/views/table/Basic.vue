<template>
  <BasicTable :columns="columns" :data="data" border>
    <template #column_1_header="data">
      <span>{{ data.column.prop }} {{ data.$index }} </span>
    </template>
    <template #column_1_cell="data">
      <el-tag>{{ data.row.id }} {{ data.$index }} </el-tag>
    </template>
    <template #empty>没数据</template>
  </BasicTable>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { BasicTable } from '@/components/index'
import { getBasicColumns, getBasicData } from './tableData'

export default defineComponent({
  components: { BasicTable },
  setup() {
    const canResize = ref(true)
    const loading = ref(false)
    const striped = ref(true)
    const border = ref(true)
    const pagination = ref<any>({ pageSize: 20, currentPage: 1 })
    function toggleCanResize() {
      canResize.value = !canResize.value
    }
    function toggleStriped() {
      striped.value = !striped.value
    }
    function toggleLoading() {
      loading.value = true
      setTimeout(() => {
        loading.value = false
        pagination.value = { pageSize: 20 }
      }, 1000)
    }
    function toggleBorder() {
      border.value = !border.value
    }
    const filterchange = (params: any) => {
      console.log(params, 'filter')
    }
    const sortchange = (params: any) => {
      console.log(params, 'sort')
    }

    function handleColumnChange(data: Recordable[]) {
      console.log('ColumnChanged', data)
    }
    return {
      columns: getBasicColumns(),
      data: getBasicData(),
      canResize,
      loading,
      striped,
      border,
      toggleStriped,
      toggleCanResize,
      toggleLoading,
      toggleBorder,
      pagination,
      handleColumnChange,
      filterchange,
      sortchange
    }
  }
})
</script>
