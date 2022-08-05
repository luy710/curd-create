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

<script lang="tsx" setup>
import { BasicColumn } from '@/components/Table/types/table'
import BasicTable from '@/components/Table/BasicTable.vue'

const columns = [
  {
    label: '日期',
    prop: 'date',
    width: 150,
    columnKey: 'date',
    slots: {
      headerSlot: `date_header`,
      cellSlot: `date_cell`
    }
  },
  {
    label: 'Delivery Info',
    prop: 'aaa',
    isMulti: true,
    columns: [
      {
        prop: 'name',
        label: '名称',
        width: 120
      },
      {
        label: '地址信息',
        isMulti: true,
        columns: [
          {
            prop: 'state',
            label: '状态'
          },
          {
            prop: 'city',
            label: '城市'
          },
          {
            prop: 'address',
            label: '地址'
          }
        ]
      }
    ]
  }
] as BasicColumn[]

const data = [
  {
    date: '2016-05-03',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036'
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036'
  },
  {
    date: '2016-05-08',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036'
  },
  {
    date: '2016-05-06',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036'
  },
  {
    date: '2016-05-07',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036'
  }
]
console.log(data, '22222', columns)

// <el-table-column prop="date" label="Date" width="150" />
//     <el-table-column label="Delivery Info">
//       <el-table-column prop="name" label="Name" width="120" />
//       <el-table-column label="Address Info">
//         <el-table-column prop="state" label="State" width="120" />
//         <el-table-column prop="city" label="City" width="120" />
//         <el-table-column prop="address" label="Address" />
//         <el-table-column prop="zip" label="Zip" width="120" />
//       </el-table-column>
//     </el-table-column>
</script>
