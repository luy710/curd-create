<script setup lang="ts">
import { createBreakpointListen } from '@/components/utils/useBreakpoint'

createBreakpointListen()
</script>

<template>
  <RouterView />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}
.mr-2 {
  margin-right: 0.5rem;
}
.mb-5 {
  margin-bottom: 0.5rem;
}
</style>
