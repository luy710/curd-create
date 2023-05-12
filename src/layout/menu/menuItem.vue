<script lang='tsx'>
import type { PropType } from 'vue'

export default defineComponent({
  name: 'SidebarItem',
  props: {
    item: {
      type: Object as PropType<Recordable>,
      default: () => ({}),
      required: true,
    },
  },
  setup(props) {
    const isShow = ref(false)
    const slotIcon = (item: Recordable) => {
      const { title } = item.meta
      return {
        title: () => (
          <>
            {isShow.value && (
              <el-icon>
                <span class='i-twemoji-grinning-face-with-smiling-eyes'></span>
              </el-icon>
            )}
            <span class="flex items-center">
              {title}
            </span>
          </>
        ),
      }
    }
    nextTick(() => {
      isShow.value = true
    })
    const targetMenu = computed(() => props.item as Recordable)
    const hasOnlyOneChild = computed(() => !targetMenu.value.children || !targetMenu.value.children.length)

    const render = () => {
      if (hasOnlyOneChild.value) {
        return <el-menu-item index={targetMenu.value.path} route={targetMenu.value.path} v-slots={slotIcon(targetMenu.value)} />
      }
      else {
        return <el-sub-menu index={targetMenu.value.path} v-slots={{ ...slotIcon(targetMenu.value) }}>
              { targetMenu.value.children.map((el: Recordable) => <sidebar-item item={el} />) }
            </el-sub-menu>
      }
    }
    return () => render()
  },

})
</script>

<style lang='scss' scoped>

</style>
