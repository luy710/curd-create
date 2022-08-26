<template>
  <ElTooltip content="刷新">
    <el-icon @click="redo" :size="16" style="cursor: pointer"><RefreshRight /></el-icon>
  </ElTooltip>
</template>
<script lang="ts">
// import { defineComponent } from 'vue'
import { ElTooltip } from 'element-plus'
import { RefreshRight } from '@element-plus/icons-vue'
import { useTableContext } from '../../hooks/useTableContext'
import { ElIcon } from 'element-plus'

export default defineComponent({
  name: 'RedoSetting',
  components: {
    RefreshRight,
    ElTooltip,
    ElIcon
  },
  setup() {
    const table = useTableContext()

    function redo() {
      table.reload()
    }

    return { redo }
  }
})
</script>
