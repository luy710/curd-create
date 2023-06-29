<script lang="ts">
import type { CheckboxValueType } from 'element-plus'
import {
  ElButton,
  ElCheckbox,
  ElCheckboxGroup,
  ElDivider,
  ElIcon,
  ElPopover,
  ElScrollbar,
  ElTooltip,

} from 'element-plus'

import { ArrowLeftBold, ArrowRightBold, Rank, Setting } from '@element-plus/icons-vue'
import { cloneDeep, omit } from 'lodash-es'
import Sortablejs from 'sortablejs'
import type Sortable from 'sortablejs'
import { useTableContext } from '../../hooks/useTableContext'
import type { BasicColumn, ColumnChangeParam } from '../../types/table'
import { isNullAndUnDef } from '@/components/utils/is'

interface State {
  checkAll: boolean
  isInit?: boolean
  checkedList: string[]
  defaultCheckList: string[]
}

interface Options {
  label: string
  value: string
  fixed?: boolean | 'left' | 'right'
}

export default defineComponent({
  name: 'ColumnSetting',
  components: {
    Rank,
    ElPopover,
    ElTooltip,
    ElCheckbox,
    ElCheckboxGroup,
    ElDivider,
    Setting,
    ElIcon,
    ArrowLeftBold,
    ArrowRightBold,
    ElScrollbar,
    ElButton,
  },
  props: {
    config: {
      type: Object,
      default: () => ({
        showColumn: true,
        indexColumn: true,
        checkColumn: true,
        dragColumn: true,
      }),
    },
  },
  emits: ['columnsChange'],

  setup(props, { emit }) {
    const table = useTableContext()
    const configProps = computed(() => props.config)
    const defaultRowSelection = omit({}, 'selectedRowKeys')
    let inited = false

    const cachePlainOptions = ref<Options[] | any>([])
    const plainOptions = ref<Options[] | any>([])

    const plainSortOptions = ref<Options[] | any>([])

    const columnListRef = ref<ComponentRef>(null)

    const state = reactive<State>({
      checkAll: true,
      checkedList: [],
      defaultCheckList: [],
    })

    const checkIndex = ref(false)
    const checkSelect = ref(false)

    const prefixCls = 'basic-column-setting'

    const getValues = computed(() => {
      return unref(table?.getBindValues) || {}
    })

    watchEffect(() => {
      setTimeout(() => {
        const columns = table.getColumns()
        if (columns.length && !state.isInit)
          init()
      }, 0)
    })

    watchEffect(() => {
      const values = unref(getValues)
      checkIndex.value = !!values.showIndexColumn
      checkSelect.value = !!values.showSelectionColumn
    })

    function getColumns() {
      const ret: Array<Recordable> = []
      table.getColumns({ ignoreAction: true, ignoreIndex: true, ignoreExpand: true }).forEach((item) => {
        ret.push({
          label: (item.label as string) || (item.customLabel as unknown as string),
          value: (item.prop || item.label) as string,
          ...item,
        })
      })
      return ret
    }

    function init() {
      const columns = getColumns()

      const checkList = table
        .getColumns({ ignoreAction: true, ignoreIndex: true, ignoreExpand: true })
        .map((item) => {
          if (item.defaultHidden)
            return ''

          return item.prop || item.label
        })
        .filter(Boolean) as string[]

      if (!plainOptions.value.length) {
        plainOptions.value = columns
        plainSortOptions.value = columns
        cachePlainOptions.value = columns
        state.defaultCheckList = checkList
      }
      else {
        unref(plainOptions).forEach((item: BasicColumn) => {
          const findItem = columns.find((col: BasicColumn) => col.prop === item.prop)
          if (findItem)
            item.fixed = findItem.fixed
        })
      }
      state.isInit = true
      state.checkedList = checkList
    }

    // checkAll change
    function onCheckAllChange(val: CheckboxValueType) {
      const checkList = plainOptions.value.map((item: any) => item.value)
      if (val) {
        state.checkedList = checkList
        setColumns(checkList)
      }
      else {
        state.checkedList = []
        setColumns([])
      }
    }

    const indeterminate = computed(() => {
      const len = plainOptions.value.length
      const checkedLen = state.checkedList.length
      // unref(checkIndex) && checkedLen--
      return checkedLen > 0 && checkedLen < len
    })

    // Trigger when check/uncheck a column
    function onChange(checkedList: any[]) {
      const len = plainSortOptions.value.length
      state.checkAll = checkedList.length === len
      const sortList = unref(plainSortOptions).map((item: any) => item.value)
      checkedList.sort((prev, next) => {
        return sortList.indexOf(prev) - sortList.indexOf(next)
      })
      setColumns(checkedList)
    }

    let sortable: Sortable
    let sortableOrder: string[] = []
    // reset columns
    function reset() {
      state.checkedList = [...state.defaultCheckList]
      state.checkAll = true
      plainOptions.value = unref(cachePlainOptions)
      plainSortOptions.value = unref(cachePlainOptions)
      setColumns(table.getCacheColumns())
      sortable.sort(sortableOrder)
    }

    // Open the pop-up window for drag and drop initialization
    function handleVisibleChange() {
      if (inited)
        return
      nextTick(() => {
        const columnListEl = unref(columnListRef)
        if (!columnListEl)
          return
        const el = columnListEl.$el as any
        if (!el)
          return
        // Drag and drop sort
        sortable = Sortablejs.create(unref(el), {
          animation: 500,
          delay: 400,
          delayOnTouchOnly: true,
          handle: '.table-column-drag-icon',
          onEnd: (evt) => {
            const { oldIndex, newIndex } = evt
            if (isNullAndUnDef(oldIndex) || isNullAndUnDef(newIndex) || oldIndex === newIndex)
              return

            // Sort column
            const columns = cloneDeep(plainSortOptions.value)

            if (oldIndex > newIndex) {
              columns.splice(newIndex, 0, columns[oldIndex])
              columns.splice(oldIndex + 1, 1)
            }
            else {
              columns.splice(newIndex + 1, 0, columns[oldIndex])
              columns.splice(oldIndex, 1)
            }

            plainSortOptions.value = columns

            setColumns(
              columns.map((col: Options) => col.value).filter((value: string) => state.checkedList.includes(value)),
            )
          },
        })
        // 记录原始order 序列
        sortableOrder = sortable.toArray()
        inited = true
      })
    }

    // Control whether the serial number column is displayed
    function handleIndexCheckChange(val: CheckboxValueType) {
      table.setProps({
        showIndexColumn: val as boolean,
      })
    }

    // Control whether the check box is displayed
    function handleSelectCheckChange(val: CheckboxValueType) {
      table.setProps({
        showSelectionColumn: val as boolean,
      })
    }

    function handleColumnFixed(item: BasicColumn, fixed?: 'left' | 'right') {
      if (!state.checkedList.includes(item.prop as string))
        return

      const columns = getColumns() as BasicColumn[]
      const isFixed = item.fixed === fixed ? false : fixed
      const index = columns.findIndex(col => col.prop === item.prop)
      if (index !== -1)
        columns[index].fixed = isFixed

      item.fixed = isFixed

      if (isFixed && !item.width)
        item.width = 100

      table.setCacheColumnsByField?.(item.prop as string, { fixed: isFixed })
      setColumns(columns)
    }

    function setColumns(columns: BasicColumn[] | string[]) {
      table.setColumns(columns)
      const data: ColumnChangeParam[] = unref(plainSortOptions).map((col: any) => {
        const visible
          = columns.findIndex(
            (c: BasicColumn | string) => c === col.value || (typeof c !== 'string' && c.prop === col.value),
          ) !== -1
        return { prop: col.value, fixed: col.fixed, visible }
      })

      emit('columnsChange', data)
    }

    return {
      ...toRefs(state),
      indeterminate,
      configProps,
      onCheckAllChange,
      onChange,
      plainOptions,
      reset,
      prefixCls,
      columnListRef,
      handleVisibleChange,
      checkIndex,
      checkSelect,
      handleIndexCheckChange,
      handleSelectCheckChange,
      defaultRowSelection,
      handleColumnFixed,
    }
  },
})
</script>

<template>
  <ElTooltip content="列设置">
    <span style="display: inline-flex">
      <ElPopover
        placement="bottom-start"
        trigger="click"
        :width="300"
        :teleported="false"
        :popper-class="`${prefixCls}__cloumn-list`"
        @show="handleVisibleChange"
      >
        <template #default>
          <div :class="`${prefixCls}__popover-title`">
            <ElCheckbox v-model="checkAll" :disabled="!configProps.showColumn" :indeterminate="indeterminate" @change="onCheckAllChange">
              列展示
            </ElCheckbox>
            <ElCheckbox v-if="configProps.indexColumn" v-model="checkIndex" @change="handleIndexCheckChange"> 序号列 </ElCheckbox>
            <ElCheckbox
              v-if="configProps.checkColumn"
              v-model="checkSelect"
              :validate-event="false"
              :disabled="!defaultRowSelection"
              @change="handleSelectCheckChange"
            >
              勾选列
            </ElCheckbox>

            <ElButton type="primary" link @click="reset"> 重置 </ElButton>
          </div>
          <ElScrollbar :max-height="540">
            <ElCheckboxGroup ref="columnListRef" v-model="checkedList" @change="onChange">
              <template v-for="item in plainOptions" :key="item.value">
                <div v-if="!('ifShow' in item && !item.ifShow)" :class="`${prefixCls}__check-item`">
                  <ElIcon v-if="configProps.dragColumn" class="table-column-drag-icon"><Rank /></ElIcon>
                  <ElCheckbox :disabled="!configProps.showColumn" :label="item.value">
                    {{ item.label }}
                  </ElCheckbox>
                  <ElTooltip placement="bottom-start" :mouse-leave-delay="0.4" content="固定到左侧">
                    <ElIcon
                      :class="[
                        `${prefixCls}__fixed-left`,
                        {
                          active: item.fixed === 'left',
                          disabled: !checkedList.includes(item.value),
                        },
                      ]"
                      @click="handleColumnFixed(item, 'left')"
                    >
                      <ArrowLeftBold />
                    </ElIcon>
                  </ElTooltip>
                  <ElDivider direction="vertical" />
                  <ElTooltip placement="bottom-start" :mouse-leave-delay="0.4" content="固定到右侧">
                    <ElIcon
                      :class="[
                        `${prefixCls}__fixed-right`,
                        {
                          active: item.fixed === 'right',
                          disabled: !checkedList.includes(item.value),
                        },
                      ]"
                      @click="handleColumnFixed(item, 'right')"
                    >
                      <ArrowRightBold />
                    </ElIcon>
                  </ElTooltip>
                </div>
              </template>
            </ElCheckboxGroup>
          </ElScrollbar>
        </template>
        <template #reference>
          <ElIcon :size="16" style="cursor: pointer"><Setting /></ElIcon>
        </template>
      </ElPopover>
    </span>
  </ElTooltip>
</template>

<style lang="scss">
.table-column-drag-icon {
  margin: 0 5px;
  cursor: move;
  font-size: 14px;
}

.basic-column-setting {
  &__popover-title {
    // position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-checkbox {
      margin-right: 10px;
    }
  }

  &__check-item {
    display: flex;
    align-items: center;
    font-size: 14px;
    padding: 4px 8px 8px 0;

    .el-checkbox {
      width: 100%;
      margin-right: 10px;

      &:hover {
        color: var(--el-color-primary);
      }
    }
  }

  &__fixed-left,
  &__fixed-right {
    color: rgb(0 0 0 / 45%);
    cursor: pointer;
    font-size: 15px;
    justify-self: end;
    &.active,
    &:hover {
      color: var(--el-color-primary);
    }

    &.disabled {
      color: var(--el-color-info-rgb);
      cursor: not-allowed;
    }
  }

  &__cloumn-list {
    svg {
      width: 1em !important;
      height: 1em !important;
    }

    .ant-popover-inner-content {
      // max-height: 360px;
      padding-right: 0;
      padding-left: 0;
      // overflow: auto;
    }

    .ant-checkbox-group {
      width: 100%;
      min-width: 260px;
      // flex-wrap: wrap;
    }

    .scrollbar {
      height: 220px;
    }
  }
}
</style>
