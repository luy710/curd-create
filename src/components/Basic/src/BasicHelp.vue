<script lang="tsx" setup>
import type { CSSProperties, PropType } from 'vue'
import { ElTooltip } from 'element-plus'
import { WarningFilled } from '@element-plus/icons-vue'
import { isString, isArray } from '@/components/utils/is'

const props = defineProps({
  maxWidth: {
    type: String,
    default: '600px'
  },
  showIndex: { type: Boolean },
  color: {
    type: String,
    default: '#fff'
  },
  fontSize: {
    type: String,
    default: '14px'
  },
  placement: {
    type: String,
    default: 'right'
  },
  effect: {
    type: String,
    default: 'dark'
  },
  text: {
    type: [String, Array] as PropType<string | string[]>,
    default: ''
  }
})

const attrs = useAttrs()
const slots = useSlots()
const prefixCls = 'm-basic-help'
const getTooltipStyle = computed(
  (): CSSProperties => ({ color: props.color, fontSize: props.fontSize, maxWidth: props.maxWidth })
)
const renderContent = () => {
  const textList = props.text
  if (isString(textList)) {
    return <p>{textList}</p>
  }

  if (isArray(textList)) {
    return textList.map((text, index) => {
      return (
        <p key={`${text}_${index}`}>
          {props.showIndex ? `${index + 1}.` : ''}
          {text}
        </p>
      )
    })
  }

  return null
}

return () => (
  <ElTooltip
    popper-class={`${prefixCls}__wrap`}
    v-bind={attrs}
    effect={props.effect}
    // @ts-ignore
    placement={props.placement}
    v-slots={{
      content: () => <div style={unref(getTooltipStyle)}>{renderContent()}</div>
    }}
  >
    <span class={prefixCls}>
      {slots?.default ? (
        slots?.default()
      ) : (
        <el-icon>
          <WarningFilled />
        </el-icon>
      )}
    </span>
  </ElTooltip>
)
</script>

<style lang="scss" scoped>
.m-basic-help__wrap {
  p {
    margin: 0;
  }
}
</style>
