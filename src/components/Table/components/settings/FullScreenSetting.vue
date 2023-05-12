<script lang="ts">
// import { defineComponent } from 'vue'
import { ElIcon, ElTooltip } from 'element-plus'
import { FullScreen } from '@element-plus/icons-vue'
import { useFullscreen } from '@vueuse/core'
import { useTableContext } from '../../hooks/useTableContext'

export default defineComponent({
  name: 'FullScreenSetting',
  components: {
    FullScreen,
    ElTooltip,
    ElIcon,
  },

  setup() {
    const table = useTableContext()

    const { toggle, isFullscreen } = useFullscreen(table.wrapRef)

    return {
      toggle,
      isFullscreen,
    }
  },
})
</script>

<template>
  <ElTooltip content="全屏">
    <ElIcon :size="16" style="cursor: pointer" @click="toggle">
      <FullScreen />
    </ElIcon>
  </ElTooltip>
</template>
