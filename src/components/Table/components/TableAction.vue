<template>
  <div :class="[prefixCls, getAlign]" @click="onCellClick">
    <template v-for="(action, index) in getActions" :key="`${index}-${action.label}`">
      <ElTooltip v-bind="getTooltip(action.tooltip)" :disabled="action.tooltip">
        <ElPopconfirm v-bind="action">
          <template #reference>
            <!-- <Icon :icon="action.icon" :class="{ 'mr-1': !!action.label }" v-if="action.icon" /> -->
            <el-button v-if="action.label">{{ action.label }}</el-button>
          </template>
        </ElPopconfirm>
      </ElTooltip>
      <ElDivider direction="vertical" class="action-divider" v-if="divider && index < getActions.length - 1" />
    </template>
    <ElDropdown trigger="hover" v-if="dropDownActions && getDropdownList.length > 0">
      <template #dropdown>
        <ElDropdownMenu>
          <ElPopconfirm
            :title="item.title"
            v-for="item in getDropdownList"
            v-bind="item"
            @confirm="item.onConfirm"
            @cancel="item.onCancel"
          >
            <template #reference>
              <ElDropdownItem> {{ item.text }}</ElDropdownItem>
            </template>
          </ElPopconfirm>
        </ElDropdownMenu>
      </template>

      <slot name="more"></slot>
      <a-button type="link" size="small" v-if="!$slots.more">
        <el-icon class="icon-more"><MoreFilled /></el-icon>
      </a-button>
    </ElDropdown>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, computed, toRaw, unref } from 'vue'
import { MoreFilled } from '@element-plus/icons-vue'
import { ElDivider, ElTooltip, ElPopconfirm, ElDropdown } from 'element-plus'

import { ActionItem, TableActionType } from '@/components/Table'
import { useTableContext } from '../hooks/useTableContext'
import { isBoolean, isFunction, isString } from '@/components/utils/is'
import { ACTION_COLUMN_FLAG } from '../constant'

export default defineComponent({
  name: 'TableAction',
  components: {
    ElDivider,
    ElDropdown,
    MoreFilled,
    ElTooltip,
    ElPopconfirm,
    ElDropdownItem: ElDropdown.DropdownItem,
    ElDropdownMenu: ElDropdown.DropdownMenu
  },
  props: {
    actions: {
      type: Array as PropType<ActionItem[]>,
      default: null
    },
    dropDownActions: {
      type: Array as PropType<ActionItem[]>,
      default: null
    },
    divider: {
      type: Boolean,
      default: true
    },
    outside: {
      type: Boolean,
      default: false
    },
    stopButtonPropagation: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const prefixCls = 'basic-table-action'

    let table: Partial<TableActionType> = {}
    if (!props.outside) {
      table = useTableContext()
    }

    function isIfShow(action: ActionItem): boolean {
      const ifShow = action.ifShow

      let isIfShow = true

      if (isBoolean(ifShow)) {
        isIfShow = ifShow
      }
      if (isFunction(ifShow)) {
        isIfShow = ifShow(action)
      }
      return isIfShow
    }

    const getActions = computed(() => {
      return (toRaw(props.actions) || [])
        .filter((action) => {
          return isIfShow(action)
        })
        .map((action) => {
          const { popConfirm } = action
          return {
            getPopupContainer: () => unref((table as any)?.wrapRef.value) ?? document.body,
            type: 'link',
            size: 'small',
            ...action,
            ...(popConfirm || {}),
            onConfirm: popConfirm?.confirm,
            onCancel: popConfirm?.cancel,
            enable: !!popConfirm
          }
        })
    })

    const getDropdownList = computed((): any[] => {
      const list = (toRaw(props.dropDownActions) || []).filter((action) => {
        return isIfShow(action)
      })
      return list.map((action, index) => {
        const { label, popConfirm } = action
        return {
          ...action,
          ...popConfirm,
          onConfirm: popConfirm?.confirm,
          onCancel: popConfirm?.cancel,
          text: label,
          divider: index < list.length - 1 ? props.divider : false
        }
      })
    })

    const getAlign = computed(() => {
      const columns = (table as TableActionType)?.getColumns?.() || []
      const actionColumn = columns.find((item) => item.flag === ACTION_COLUMN_FLAG)
      return actionColumn?.align ?? 'left'
    })

    function getTooltip(data: any): any {
      return {
        getPopupContainer: () => unref((table as any)?.wrapRef.value) ?? document.body,
        placement: 'bottom',
        ...(isString(data) ? { title: data } : data)
      }
    }

    function onCellClick(e: MouseEvent) {
      if (!props.stopButtonPropagation) return
      const path = e.composedPath() as HTMLElement[]
      const isInButton = path.find((ele) => {
        return ele.tagName?.toUpperCase() === 'BUTTON'
      })
      isInButton && e.stopPropagation()
    }

    return { prefixCls, getActions, getDropdownList, getAlign, onCellClick, getTooltip }
  }
})
</script>
<style lang="less">
@prefix-cls: ~'@{namespace}-basic-table-action';

.@{prefix-cls} {
  display: flex;
  align-items: center;

  .action-divider {
    display: table;
  }

  &.left {
    justify-content: flex-start;
  }

  &.center {
    justify-content: center;
  }

  &.right {
    justify-content: flex-end;
  }

  button {
    display: flex;
    align-items: center;

    span {
      margin-left: 0 !important;
    }
  }

  button.ant-btn-circle {
    span {
      margin: auto !important;
    }
  }

  .ant-divider,
  .ant-divider-vertical {
    margin: 0 2px;
  }

  .icon-more {
    transform: rotate(90deg);

    svg {
      font-size: 1.1em;
      font-weight: 700;
    }
  }
}
</style>
