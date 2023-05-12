<script setup lang="ts">
import Menus from './menu/index.vue'
</script>

<template>
  <el-container class="out-wrapper">
    <Menus />
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped>
.el-container,
.el-main {
  height: 100vh;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
}
.out-wrapper {
  padding: 0;
}
</style>
