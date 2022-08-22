<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #id="{ row: record }"> ID: {{ record.id }} </template>
      <template #no="{ row: record }">
        <el-tag>
          {{ record.no }}
        </el-tag>
      </template>
      <template #avatar="{ row: record }">
        <el-avatar :size="60" :src="record.avatar" />
      </template>
      <template #imgArr="{ row: record }">
        <TableImg :size="60" :simpleShow="true" :imgList="record.imgArr" preview-teleported />
      </template>
      <template #imgs="{ row: record }">
        <TableImg :size="60" :imgList="record.imgs" preview-teleported />
      </template>
      <template #category="{ row: record }">
        <el-tag>
          {{ record.no }}
        </el-tag>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { BasicTable, useTable, BasicColumn, TableImg } from '@hobby/curd-create'
import { demoListApi } from '@/api/demo/table'
const columns: BasicColumn[] = [
  {
    label: 'ID',
    prop: 'id',
    slots: { cellSlot: 'id' }
  },
  {
    label: '头像',
    prop: 'avatar',
    width: 100,
    slots: { cellSlot: 'avatar' }
  },
  {
    label: '分类',
    prop: 'category',
    width: 80,
    align: 'center',
    defaultHidden: true,
    slots: { cellSlot: 'category' }
  },
  {
    label: '姓名',
    prop: 'name',
    width: 120
  },
  {
    label: '图片列表1',
    prop: 'imgArr',
    helpMessage: ['这是简单模式的图片列表', '只会显示一张在表格中', '但点击可预览多张图片'],
    width: 140,
    slots: { cellSlot: 'imgArr' }
  },
  {
    label: '照片列表2',
    prop: 'imgs',
    width: 160,
    slots: { cellSlot: 'imgs' }
  },
  {
    label: '地址',
    prop: 'address'
  },
  {
    label: '编号',
    prop: 'no',
    slots: { cellSlot: 'no' }
  },
  {
    label: '开始时间',
    prop: 'beginTime'
  },
  {
    label: '结束时间',
    prop: 'endTime'
  }
]
export default defineComponent({
  components: { BasicTable, TableImg },
  setup() {
    const [registerTable] = useTable({
      title: '自定义列内容',
      titleHelpMessage: '表格中所有头像、图片均为mock生成，仅用于演示图片占位',
      api: demoListApi,
      columns: columns,
      border: true,
      showTableSetting: true
    })

    return {
      registerTable
    }
  }
})
</script>
