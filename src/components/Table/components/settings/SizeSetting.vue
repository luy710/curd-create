<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ElDropdown, ElIcon, ElTooltip } from 'element-plus'
import type { SizeType } from '../../types/table'
import { useTableContext } from '../../hooks/useTableContext'

export default defineComponent({
  name: 'SizeSetting',
  components: {
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
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M7 11.5v-9M9.5 5L7 2.5L4.5 5m5 4L7 11.5L4.5 9m9-8.5H.5m13 13H.5" /></svg>
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
