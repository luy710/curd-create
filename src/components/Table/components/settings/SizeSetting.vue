<template>
  <ElTooltip content="密度">
    <ElDropdown placement="bottom" trigger="click" :getPopupContainer="getPopupContainer" @command="handleTitleClick">
      <el-icon :size="16" style="cursor: pointer"><Box /></el-icon>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="large">偏大</el-dropdown-item>
          <el-dropdown-item command="default">默认</el-dropdown-item>
          <el-dropdown-item command="small">紧凑</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </ElDropdown>
  </ElTooltip>
</template>
<script lang="ts">
import type { SizeType } from '../../types/table'
import { defineComponent, ref } from 'vue'
import { ElTooltip, ElDropdown, ElIcon } from 'element-plus'
import { Box } from '@element-plus/icons-vue'
import { useTableContext } from '../../hooks/useTableContext'
import { getPopupContainer } from '@/components/utils'

export default defineComponent({
  name: 'SizeSetting',
  components: {
    Box,
    ElIcon,
    ElTooltip,
    ElDropdown,
    ElDropdownMenu: ElDropdown.DropdownMenu,
    ElDropdownItem: ElDropdown.DropdownItem
  },
  setup() {
    const table = useTableContext()

    const selectedKeysRef = ref<SizeType[]>([table.getSize()])

    function handleTitleClick(key: SizeType) {
      selectedKeysRef.value = [key]
      table.setProps({
        size: key
      })
    }

    return {
      handleTitleClick,
      selectedKeysRef,
      getPopupContainer
    }
  }
})
</script>
