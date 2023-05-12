<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ElDropdown, ElIcon, ElTooltip } from 'element-plus'
import { Box } from '@element-plus/icons-vue'
import type { SizeType } from '../../types/table'
import { useTableContext } from '../../hooks/useTableContext'

export default defineComponent({
  name: 'SizeSetting',
  components: {
    Box,
    ElIcon,
    ElTooltip,
    ElDropdown,
    ElDropdownMenu: ElDropdown.DropdownMenu,
    ElDropdownItem: ElDropdown.DropdownItem,
  },
  setup() {
    const table = useTableContext()

    const selectedKeysRef = ref<SizeType[]>([table.getSize()])

    function handleTitleClick(key: SizeType) {
      selectedKeysRef.value = [key]
      table.setProps({
        size: key,
      })
    }

    return {
      handleTitleClick,
      selectedKeysRef,
    }
  },
})
</script>

<template>
  <ElTooltip content="密度">
    <ElDropdown placement="bottom" trigger="click" @command="handleTitleClick">
      <ElIcon :size="16" style="cursor: pointer">
        <Box />
      </ElIcon>
      <template #dropdown>
        <ElDropdownMenu>
          <ElDropdownItem command="large">
            偏大
          </ElDropdownItem>
          <ElDropdownItem command="default">
            默认
          </ElDropdownItem>
          <ElDropdownItem command="small">
            紧凑
          </ElDropdownItem>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
  </ElTooltip>
</template>
