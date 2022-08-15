<template>
  <el-container>
    <el-aside width="200px">
      <Menus />
    </el-aside>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import Menus from './menus.vue'
</script>
<style lang="scss" scoped>
.el-container,
.el-main {
  height: 100vh;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
}
</style>
