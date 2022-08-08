<template>
  <EditTableHeaderCell v-if="getIsEdit">
    {{ getTitle }}
  </EditTableHeaderCell>
  <span v-else>{{ getTitle }}</span>
  <BasicHelp v-if="getHelpMessage" :text="getHelpMessage" :class="`${prefixCls}__help`" />
</template>
<script lang="ts">
import type { PropType } from 'vue'
import type { BasicColumn } from '../types/table'
import { defineComponent, computed } from 'vue'
import BasicHelp from '@/components/Basic/src/BasicHelp.vue'
import EditTableHeaderCell from './EditTableHeaderIcon.vue'

export default defineComponent({
  name: 'TableHeaderCell',
  components: {
    EditTableHeaderCell,
    BasicHelp
  },
  props: {
    column: {
      type: Object as PropType<BasicColumn>,
      default: () => ({})
    }
  },
  setup(props) {
    const prefixCls = 'basic-table-header-cell'

    const getIsEdit = computed(() => !!props.column?.edit)
    const getTitle = computed(() => props.column?.customTitle /* || props.column?.title */)
    const getHelpMessage = computed(() => props.column?.helpMessage)

    return { prefixCls, getIsEdit, getTitle, getHelpMessage }
  }
})
</script>
<style lang="less">
.basic-table-header-cell {
  &__help {
    margin-left: 8px;
    color: rgb(0 0 0 / 65%) !important;
  }
}
</style>
