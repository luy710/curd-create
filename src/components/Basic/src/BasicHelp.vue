<script lang="tsx">
import type { CSSProperties, PropType } from 'vue'
import { Warning } from '@element-plus/icons-vue'
import { isString, isArray } from '@/components/utils/is'

export default defineComponent({
  name: 'BasicHelp',
  props: {
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
  },
  setup(props, { slots }) {
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

      return ''
    }

    return () => (
      <el-tooltip
        popper-class={`${prefixCls}__wrap`}
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
            <el-icon color="#2c3e50">
              <Warning />
            </el-icon>
          )}
        </span>
      </el-tooltip>
    )
  }
})
</script>

<style lang="scss" scoped>
.m-basic-help {
  margin-left: 3px;
  line-height: 1;
  &__wrap {
    p {
      margin: 0;
    }
  }
}
</style>
