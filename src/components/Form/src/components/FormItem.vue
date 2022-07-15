<script lang="tsx" setup>
import { FormSchema, FormProps, FormActionType } from '../types/form'
import { TableActionType } from '@/components/Table/src/types/table'

const props = defineProps({
  schema: {
    type: Object as PropType<FormSchema>,
    default: () => ({})
  },
  formProps: {
    type: Object as PropType<FormProps>,
    default: () => ({})
  },
  allDefaultValues: {
    type: Object as PropType<Recordable>,
    default: () => ({})
  },
  formModel: {
    type: Object as PropType<Recordable>,
    default: () => ({})
  },
  setFormModel: {
    type: Function as PropType<(key: string, value: any) => void>,
    default: null
  },
  tableAction: {
    type: Object as PropType<TableActionType>
  },
  formActionType: {
    type: Object as PropType<FormActionType>
  }
})
</script>

<style lang="less" scoped></style>
