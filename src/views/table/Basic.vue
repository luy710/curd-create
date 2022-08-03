<template>
  <el-table-v2 :columns="columns" :data="data" :width="700" :height="400" fixed>
    <template #header="data">
      <slot name="bodyHeader" v-bind="data" />
    </template>

    <!-- <component :is="headerIndex % 2 ? cells : ElInput" /> -->
  </el-table-v2>
</template>

<script lang="tsx" setup>
import { ElInput } from 'element-plus'
const generateColumns = (length = 10, prefix = 'column-', props?: any) =>
  Array.from({ length }).map((_, columnIndex) => ({
    ...props,
    key: `${prefix}${columnIndex}`,
    dataKey: `${prefix}${columnIndex}`,
    title: `Column ${columnIndex}`,
    width: 150
  }))

const generateData = (columns: ReturnType<typeof generateColumns>, length = 200, prefix = 'row-') =>
  Array.from({ length }).map((_, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`
        return rowData
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null
      }
    )
  })

const columns = generateColumns(10)
const data = generateData(columns, 1000)

const CustomCell = (data: Recordable) => {
  return <span> {data.columnIndex} </span>
}
</script>
