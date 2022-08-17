<template>
  <div class="p-4">
    <BasicTable
      title="基础示例"
      titleHelpMessage="温馨提醒"
      :columns="columns"
      :data="data"
      :canResize="canResize"
      :loading="loading"
      :stripe="striped"
      :border="border"
      showTableSetting
      :pagination="pagination"
      @columns-change="handleColumnChange"
    >
      <template #toolbar>
        <el-button size="small" type="primary" @click="toggleCanResize">
          {{ !canResize ? '自适应高度' : '取消自适应' }}
        </el-button>
        <el-button size="small" type="primary" @click="toggleBorder">
          {{ !border ? '显示边框' : '隐藏边框' }}
        </el-button>
        <el-button size="small" type="primary" @click="toggleLoading"> 开启loading </el-button>
        <el-button size="small" type="primary" @click="toggleStriped">
          {{ !striped ? '显示斑马纹' : '隐藏斑马纹' }}
        </el-button>
        <el-button size="small" type="primary" @click="togglePagination">
          {{ pagination ? '关闭分页' : '开启分页' }}
        </el-button>
      </template>
      <template #action="scope">
        <TableAction
          :actions="[
            {
              label: '编辑',
              onClick: () => {},
              icon: inconFun,
              popConfirm: {
                title: '是否启用？',
                confirm: configTest
              }
            },
            {
              label: '删除',
              color: 'error',
              popConfirm: {
                title: '是否确认删除',
                placement: 'left',
                confirm: () => {}
              }
            }
          ]"
          :dropDownActions="[
            {
              label: '启用',
              popConfirm: {
                title: '是否启用？',
                confirm: () => {}
              },
              ifShow: () => {
                return scope.row.status !== 'enable'
              }
            },
            {
              label: '禁用',
              popConfirm: {
                title: '是否禁用？',
                confirm: () => {}
              },
              ifShow: () => {
                return scope.row.status === 'enable'
              }
            },
            {
              label: '同时控制',
              popConfirm: {
                title: '是否动态显示？',
                confirm: () => {}
              },
              ifShow: () => {
                return true
              }
            }
          ]"
        />
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h } from 'vue'
import { BasicTable, ColumnChangeParam, TableAction } from '@/components/index'
import { getBasicColumns, getBasicData } from './tableData'
import { Edit } from '@element-plus/icons-vue'
export default defineComponent({
  components: { BasicTable, TableAction, Edit },
  setup() {
    const canResize = ref(false)
    const loading = ref(false)
    const striped = ref(true)
    const border = ref(true)
    const pagination = ref<any>(false)
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
      }, 3000)
    }
    function toggleBorder() {
      border.value = !border.value
    }

    function handleColumnChange(data: ColumnChangeParam[]) {
      console.log('ColumnChanged', data)
    }

    const togglePagination = () => {
      pagination.value = !pagination.value
    }

    const inconFun = () => {
      return h(Edit)
    }

    const configTest = () => {
      console.log('ConfigTest')
    }
    return {
      columns: getBasicColumns(),
      data: getBasicData(),
      configTest,
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
      togglePagination,
      inconFun
    }
  }
})
</script>
