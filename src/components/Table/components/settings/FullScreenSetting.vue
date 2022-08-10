<template>
  <ElTooltip content="全屏">
    <el-icon :size="16" style="cursor: pointer" @click="toggle">
      <FullScreen />
    </el-icon>
  </ElTooltip>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { ElTooltip, ElIcon } from 'element-plus'
import { FullScreen } from '@element-plus/icons-vue'
import { useFullscreen } from '@vueuse/core'
import { useTableContext } from '../../hooks/useTableContext'

export default defineComponent({
  name: 'FullScreenSetting',
  components: {
    FullScreen,
    ElTooltip,
    ElIcon
  },

  setup() {
    const table = useTableContext()
    console.log('table: ', table)

    const { toggle, isFullscreen } = useFullscreen(table.wrapRef)

    return {
      toggle,
      isFullscreen
    }
  }
})
</script>
