<script lang="ts">
import type { PropType } from 'vue'
import BasicTitle from '@/components/Basic/src/BasicTitle.vue'
import { isFunction } from '@/components/utils/is'

export default defineComponent({
  name: 'BasicTableTitle',
  components: { BasicTitle },
  props: {
    title: {
      type: [Function, String] as PropType<string | ((data: Recordable) => string)>,
    },
    getSelectRows: {
      type: Function as PropType<() => Recordable[]>,
    },
    helpMessage: {
      type: [String, Array] as PropType<string | string[]>,
    },
  },
  setup(props) {
    const prefixCls = 'basic-table-title'

    const getTitle = computed(() => {
      const { title, getSelectRows = () => ([]) } = props
      let tit = title

      if (isFunction(title)) {
        tit = title({
          selectRows: (getSelectRows as () => Recordable[])(),
        })
      }
      return tit
    })

    return { getTitle, prefixCls }
  },
})
</script>

<template>
  <BasicTitle v-if="getTitle" :class="prefixCls" :help-message="helpMessage">
    {{ getTitle }}
  </BasicTitle>
</template>

<style lang="scss">
.basic-table-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
