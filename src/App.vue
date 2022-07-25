<script setup lang="ts">
import ElDatePicker from 'element-plus/lib/components/date-picker/src/date-picker'
console.log(ElDatePicker)
const value1 = ref()
const change = (value) => {
  value1.value = value
}
</script>

<template>
  <!-- <ElDatePicker :modelValue="value1" @update:model-value="change" /> -->
  <RouterView />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
