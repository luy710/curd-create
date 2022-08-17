import type { FunctionalComponent, defineComponent } from 'vue'
import type { ComponentType } from '../../types/componentType'
import { componentMap } from '@/components/Table/componentMap'

import { ElPopover } from 'element-plus'
import { h } from 'vue'

export interface ComponentProps {
  component: ComponentType
  rule: boolean
  popoverVisible: boolean
  ruleMessage: string
}

/* @ts-ignore */
export const CellComponent: FunctionalComponent = (
  { component = 'Input', rule = true, ruleMessage, popoverVisible }: ComponentProps,
  { attrs }
) => {
  const Comp = componentMap.get(component) as typeof defineComponent
  console.log('attrs: ', attrs)

  /* @ts-ignore */
  const DefaultComp = h(Comp, attrs)
  if (!rule) {
    return DefaultComp
  }
  return h(
    ElPopover,
    {
      overlayClassName: 'edit-cell-rule-popover',
      visible: !!popoverVisible
    },
    {
      reference: () => DefaultComp,
      content: () => ruleMessage
    }
  )
}
