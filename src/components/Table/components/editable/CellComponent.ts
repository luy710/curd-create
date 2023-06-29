import type { FunctionalComponent, defineComponent } from 'vue'
import { ElPopover } from 'element-plus'
import type { ComponentType } from '../../types/componentType'
import { componentMap } from '@/components/Table/componentMap'

export interface ComponentProps {
  component: ComponentType
  rule: boolean
  popoverVisible: boolean
  ruleMessage: string
}

/* @ts-expect-error */
export const CellComponent: FunctionalComponent = (
  { component = 'Input', rule = true, ruleMessage, popoverVisible }: ComponentProps,
  { attrs },
) => {
  const Comp = componentMap.get(component) as typeof defineComponent

  /* @ts-expect-error */
  const DefaultComp = h('div', [h(Comp, attrs)])
  if (!rule)
    return DefaultComp

  return h(
    // @ts-expect-error
    ElPopover,
    {
      popperClass: 'edit-cell-rule-popover',
      visible: !!popoverVisible,
      placement: 'top',
    },
    {
      reference: () => DefaultComp,
      default: () => ruleMessage,
    },
  )
}
