<script lang="ts" setup>
import type { BasicColumn } from '../types/table'
import EditTableHeaderCell from './EditTableHeaderIcon.vue'
import BasicHelp from '@/components/Basic/src/BasicHelp.vue'

const props = withDefaults(defineProps<{
  column: BasicColumn
}>(), {
  column: () => ({}),
})

const prefixCls = 'basic-table-header-cell'

const getIsEdit = computed(() => !!props.column?.edit)
const getTitle = computed(() => props.column?.label || props.column?.prop)
const getHelpMessage = computed(() => props.column?.helpMessage)
const getHelpComponentProps = computed(() => props.column?.helpComponentProps)
</script>

<template>
  <EditTableHeaderCell v-if="getIsEdit">
    {{ getTitle }}
  </EditTableHeaderCell>
  <span v-else>{{ getTitle }}</span>
  <BasicHelp
    v-if="getHelpMessage"
    :text="getHelpMessage"
    v-bind="getHelpComponentProps"
    :class="`${prefixCls}__help`"
  />
</template>

<style lang="scss">
.basic-table-header-cell {
  &__help {
    margin-left: 8px;
    color: rgb(0 0 0 / 65%) !important;
  }
}
</style>
