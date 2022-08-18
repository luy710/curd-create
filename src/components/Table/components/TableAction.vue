<template>
  <div :class="[prefixCls, getAlign]" @click="onCellClick">
    <template v-for="(action, index) in getActions" :key="`${index}-${action.label}`">
      <ElTooltip v-bind="getTooltip(action.tooltip)" :disabled="!action.tooltip">
        <div>
          <template v-if="action.enable">
            <ElPopconfirm v-bind="action.popConfirm" v-on="{ confirm: action.onConfirm, cancel: action.onCancel }">
              <template #reference>
                <span class="option-item">
                  <ElIcon v-if="action.icon" :class="{ 'mr-1': !!action.label }" @click="action.onClick">
                    <component :is="action.icon()"></component>
                  </ElIcon>
                  <ElButton
                    v-if="action.label"
                    style="padding: 5px 3px"
                    :size="getSize"
                    type="primary"
                    @click="action.onClick"
                    text
                  >
                    {{ action.label }}
                  </ElButton>
                </span>
              </template>
            </ElPopconfirm>
          </template>
          <template v-else>
            <span class="option-item">
              <ElIcon v-if="action.icon" :class="{ 'mr-1': !!action.label }" @click="action.onClick">
                <component :is="action.icon()"></component>
              </ElIcon>
              <ElButton
                v-if="action.label"
                style="padding: 5px 3px"
                :size="getSize"
                type="primary"
                @click="action.onClick"
                text
              >
                {{ action.label }}
              </ElButton>
            </span>
          </template>
        </div>
      </ElTooltip>
      <ElDivider direction="vertical" style="margin: 0 3px" v-if="divider && index < getActions.length - 1" />
    </template>
    <ElDropdown
      trigger="click"
      v-if="dropDownActions && getDropdownList.length > 0"
      popper-class="more-options"
      :size="getSize"
      :hide-on-click="false"
    >
      <ElButton link :size="getSize" v-if="!$slots.more">
        <el-icon class="icon-more"><MoreFilled /></el-icon>
      </ElButton>
      <slot name="more"></slot>

      <template #dropdown>
        <ElDropdownMenu>
          <ElPopconfirm
            :teleported="false"
            :title="item.title"
            v-for="item in getDropdownList"
            v-bind="item.popConfirm"
            v-on="{ confirm: item.onConfirm, cancel: item.onCancel }"
          >
            <template #reference>
              <div>
                <ElDropdownItem> {{ item.text }}</ElDropdownItem>
              </div>
            </template>
          </ElPopconfirm>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, computed, toRaw } from 'vue'
import { MoreFilled } from '@element-plus/icons-vue'
import { ElDivider, ElTooltip, ElPopconfirm, ElDropdown, ElButton, ElIcon } from 'element-plus'

import { ActionItem, TableActionType } from '@/components/Table/types/table'

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
    ElDropdownMenu: ElDropdown.DropdownMenu,
    ElButton,
    ElIcon
  },
  props: {
    size: {
      type: String,
      default: 'small'
    },
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
    const getSize = computed(() => props.size)

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
      const listAction = (toRaw(props.actions) || [])
        .filter((action) => {
          return isIfShow(action)
        })
        .map((action) => {
          const { popConfirm } = action
          return {
            type: 'link',
            size: getSize.value,
            ...action,
            ...(popConfirm || {}),
            onConfirm: popConfirm?.confirm,
            onCancel: popConfirm?.cancel,
            enable: !!popConfirm
          }
        })

      return listAction
    })

    const getDropdownList = computed((): any[] => {
      const list = (toRaw(props.dropDownActions) || []).filter((action) => {
        return isIfShow(action)
      })

      const listMap = list.map((action, index) => {
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
      return listMap
    })

    const getAlign = computed(() => {
      const columns = (table as TableActionType)?.getColumns?.() || []
      const actionColumn = columns.find((item) => item.flag === ACTION_COLUMN_FLAG)
      return actionColumn?.align ?? 'left'
    })

    function getTooltip(data: any): any {
      return {
        placement: 'bottom',
        ...(isString(data) ? { content: data } : data)
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

    return { prefixCls, getActions, getDropdownList, getAlign, getSize, onCellClick, getTooltip }
  }
})
</script>
<style lang="scss" scoped>
.option-item {
  display: flex;
  align-items: center;
  .el-icon {
    cursor: pointer;
  }
}
.basic-table-action {
  display: flex;
  align-items: center;

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
    svg {
      font-size: 1.1em;
      font-weight: 700;
    }
  }
}
</style>

<style lang="scss">
.more-options {
  .el-scrollbar {
    overflow: unset;
    .el-scrollbar__wrap {
      overflow: unset;
    }

    .el-scrollbar__bar {
      display: none !important;
    }
  }
}
</style>
