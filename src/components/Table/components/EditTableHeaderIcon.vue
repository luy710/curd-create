<template>
  <span>
    <slot></slot>
    {{ title }}
    <el-icon><Edit /></el-icon>
  </span>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { Edit } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'
export default defineComponent({
  name: 'Edit',
  components: { Edit, ElIcon },
  props: { title: { type: String, default: '' } }
})
</script>
