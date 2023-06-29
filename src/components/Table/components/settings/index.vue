<script lang="ts" setup>
import type { ColumnChangeParam, TableSetting } from '../../types/table'
import ColumnSetting from './ColumnSetting.vue'
import SizeSetting from './SizeSetting.vue'
import RedoSetting from './RedoSetting.vue'
import FullScreenSetting from './FullScreenSetting.vue'

const props = withDefaults(defineProps<{
  setting: TableSetting
}>(), {
  setting: () => ({}),
})

const emit = defineEmits(['columnsChange'])

const getSetting = computed(() => {
  return {
    redo: true,
    size: true,
    setting: true,
    fullScreen: true,
    settingConfig: {
      showColumn: true,
      indexColumn: true,
      checkColumn: true,
      dragColumn: true,
    },
    ...props.setting,
  }
})

function handleColumnChange(data: ColumnChangeParam[]) {
  emit('columnsChange', data)
}
</script>

<template>
  <div class="table-settings">
    <RedoSetting v-if="getSetting.redo" />
    <SizeSetting v-if="getSetting.size" />
    <ColumnSetting v-if="getSetting.setting" :config="getSetting.settingConfig" @columns-change="handleColumnChange" />
    <FullScreenSetting v-if="getSetting.fullScreen" />
  </div>
</template>

<style lang="scss">
.table-settings {
  display: flex;
  & > * {
    margin-right: 12px;
  }
  svg {
    width: 1.3em;
    height: 1.3em;
  }
}
</style>
