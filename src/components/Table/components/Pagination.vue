<script lang="tsx">
import { ElPagination } from 'element-plus'
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'TablePagination',
  props: {
    // 是否使用小型分页样式
    small: {
      type: Boolean,
      default: false
    },
    // 是否为分页按钮添加背景色
    background: {
      type: Boolean,
      default: false
    },
    // 	每页显示条目个数，支持 v-model 双向绑定
    pageSize: {
      type: Number,
      default: 20
    },
    // 每页显示条目数的初始值
    defaultPageSize: Number,
    // 总条目数
    total: Number,
    // 总页数 total 和 page-count 设置任意一个就可以达到显示页码的功能；如果要支持 page-sizes 的更改，则需要使用 total 属性
    pageCount: Number,
    // 设置最大页码按钮数。 页码按钮的数量，当总页数超过该值时会折叠, number	5 ≤ x ≤ 21 的奇数	7
    pagerCount: {
      type: Number,
      default: 7
    },
    // 当前页数，支持 v-model 双向绑定	number
    currentPage: {
      type: Number,
      default: 1
    },
    // 当前页数的初始值
    defaultCurrentPage: Number,
    // 组件布局，子组件名用逗号分隔	string	sizes / prev / pager / next / jumper / -> / total / slot
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper, ->'
    },
    // 每页显示个数选择器的选项设置
    pageSizes: {
      type: Array as PropType<number[]>,
      default: () => [10, 20, 30, 40, 50, 100]
    },
    // 每页显示个数选择器的下拉框类名
    popperClass: String,
    // 替代图标显示的上一页文字
    prevText: String,
    // 替代图标显示的下一页文字
    nextText: String,
    // 是否禁用分页	boolean	—	false
    disabled: {
      type: Boolean,
      default: false
    },
    // 只有一页时是否隐藏
    hideOnSinglePage: Boolean
  },
  emits: ['change', 'update:currentPage', 'update:pageSize'],
  setup(props, { emit, attrs }) {
    const currentPage = computed({
      get() {
        return props.currentPage
      },
      set(val) {
        emit('update:currentPage', val)
      }
    })

    const pageSize = computed({
      get() {
        return props.pageSize
      },
      set(val) {
        emit('update:pageSize', val)
      }
    })

    const handleSizeChange = (val: number) => {
      emit('change', {
        currentPage: currentPage.value,
        pageSize: val
      })
    }

    const handleCurrentChange = (val: number) => {
      emit('change', {
        currentPage: val,
        pageSize: pageSize.value
      })
    }

    return () => (
      <ElPagination
        v-model:pageSize={pageSize.value}
        v-model:currentPage={currentPage.value}
        small={props.small}
        background={props.background}
        default-page-size={props.defaultPageSize}
        total={props.total}
        page-count={props.pageCount}
        pager-count={props.pagerCount}
        default-current-page={props.defaultCurrentPage}
        layout={props.layout}
        page-sizes={props.pageSizes}
        popper-class={props.popperClass}
        prev-text={props.prevText}
        next-text={props.nextText}
        disabled={props.disabled}
        hide-on-single-page={props.hideOnSinglePage}
        {...attrs}
        onSizeChange={handleSizeChange}
        onCurrentChange={handleCurrentChange}
      />
    )
  }
})
</script>

<style lang="scss" scoped></style>
