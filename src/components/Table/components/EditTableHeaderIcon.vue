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
  name: 'EditIconComponent',
  components: { Edit, ElIcon },
  props: { title: { type: String, default: '' } }
})
</script>
<style lang="scss" scoped>
.el-icon {
  vertical-align: middle;
}
</style>
