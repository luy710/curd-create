<script lang='ts' setup>
import MenuItem from './menuItem.vue'
import BasicRoutes from '@/routes/basic'

</script>

<template>
  <el-aside class="h-full" width="240px">
    <el-scrollbar view-class="h-full">
      <el-menu router size="mini" class="min-h-full" :default-openeds="['form', 'table']">
        <MenuItem v-for="item in BasicRoutes[1].children" :key="item.path" :item="item" />
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<style lang='scss' scoped>
  .h-full {
    height: 100%;
  }
  .min-h-full {
    min-height: 100%;
  }
</style>
