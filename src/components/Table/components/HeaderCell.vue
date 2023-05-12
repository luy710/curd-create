<script lang="ts">
import type { PropType } from 'vue'
import type { BasicColumn } from '../types/table'

// import { defineComponent, computed } from 'vue'
import EditTableHeaderCell from './EditTableHeaderIcon.vue'
import BasicHelp from '@/components/Basic/src/BasicHelp.vue'

export default defineComponent({
  name: 'TableHeaderCell',
  components: {
    EditTableHeaderCell,
    BasicHelp,
  },
  props: {
    column: {
      type: Object as PropType<BasicColumn>,
      default: () => ({}),
    },
  },
  setup(props) {
    const prefixCls = 'basic-table-header-cell'

    const getIsEdit = computed(() => !!props.column?.edit)
    const getTitle = computed(() => props.column?.label || props.column?.prop)
    const getHelpMessage = computed(() => props.column?.helpMessage)
    const getHelpComponentProps = computed(() => props.column?.helpComponentProps)
    return { prefixCls, getIsEdit, getTitle, getHelpMessage, getHelpComponentProps }
  },
})
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
