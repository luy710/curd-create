<script lang="ts">
// import { defineComponent } from 'vue'
import { ElTooltip } from 'element-plus'
import { RefreshRight } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'
import { useTableContext } from '../../hooks/useTableContext'

export default defineComponent({
  name: 'RedoSetting',
  components: {
    RefreshRight,
    ElTooltip,
    ElIcon,
  },
  setup() {
    const table = useTableContext()

    function redo() {
      table.reload()
    }

    return { redo }
  },
})
</script>

<template>
  <ElTooltip content="刷新">
    <ElIcon :size="16" style="cursor: pointer" @click="redo">
      <RefreshRight />
    </ElIcon>
  </ElTooltip>
</template>
