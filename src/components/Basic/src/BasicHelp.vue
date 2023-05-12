<script lang="tsx">
import type { CSSProperties, PropType } from 'vue'
import { Warning } from '@element-plus/icons-vue'
import { ElIcon, ElTooltip } from 'element-plus'
import { isArray, isString } from '@/components/utils/is'

// import { defineComponent, computed, unref } from 'vue'
export default defineComponent({
  name: 'BasicHelp',
  components: { ElTooltip, ElIcon },
  props: {
    maxWidth: {
      type: String,
      default: '600px',
    },
    showIndex: { type: Boolean },
    color: {
      type: String,
      default: '#fff',
    },
    fontSize: {
      type: String,
      default: '14px',
    },
    placement: {
      type: String,
      default: 'right',
    },
    effect: {
      type: String,
      default: 'dark',
    },
    text: {
      type: [String, Array] as PropType<string | string[]>,
      default: '',
    },
  },
  setup(props, { slots }) {
    const prefixCls = 'm-basic-help'
    const getTooltipStyle = computed(
      (): CSSProperties => ({ color: props.color, fontSize: props.fontSize, maxWidth: props.maxWidth }),
    )
    const renderContent = () => {
      const textList = props.text
      if (isString(textList))
        return <p>{textList}</p>

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
        // @ts-expect-error
        placement={props.placement}
        v-slots={{
          content: () => <div style={unref(getTooltipStyle)}>{renderContent()}</div>,
        }}
      >
        <span class={prefixCls}>
          {slots?.default
            ? (
                slots?.default()
              )
            : (
            <el-icon color="#2c3e50">
              <Warning />
            </el-icon>
              )}
        </span>
      </el-tooltip>
    )
  },
})
</script>

<style lang="scss" scoped>
.m-basic-help {
  margin: 0 3px;
  line-height: 1;
  &__wrap {
    p {
      margin: 0;
    }
  }
  .el-icon {
    vertical-align: middle;
  }
}
</style>
