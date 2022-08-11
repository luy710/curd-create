<template>
  <div :class="prefixCls" class="flex items-center mx-auto" v-if="imgList && imgList.length" :style="getWrapStyle">
    <ElBadge :value="!showBadge || imgList.length == 1 ? 0 : imgList.length" v-if="simpleShow">
      <div class="img-div">
        <template v-for="(img, index) in imgList" :key="img">
          <ElImage
            :width="size"
            :style="{
              display: index === 0 ? '' : 'none !important'
            }"
            :src="srcPrefix + img"
            :preview-src-list="imgList"
          />
        </template>
      </div>
    </ElBadge>
    <template v-for="(img, index) in imgList" :key="img" v-else>
      <ElImage
        :width="size"
        :style="{ marginLeft: index === 0 ? 0 : margin }"
        :src="srcPrefix + img"
        :preview-src-list="imgList"
      />
    </template>
  </div>
</template>
<script lang="ts">
import type { CSSProperties } from 'vue'
import { defineComponent, computed } from 'vue'
import { ElImage, ElBadge } from 'element-plus'

export default defineComponent({
  name: 'TableImage',
  components: { ElImage, ElBadge },
  props: {
    imgList: {
      type: Array as PropType<Array<string>>,
      default: () => []
    },
    size: {
      type: Number,
      default: 40
    },
    // 是否简单显示（只显示第一张图片）
    simpleShow: {
      type: Boolean,
      default: false
    },
    // 简单模式下是否显示图片数量的badge
    showBadge: {
      type: Boolean,
      default: true
    },
    // 图片间距
    margin: {
      type: Number,
      default: 4
    },
    // src前缀，将会附加在imgList中每一项之前
    srcPrefix: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const getWrapStyle = computed((): CSSProperties => {
      const { size } = props
      const s = `${size}px`
      return { height: s, width: s }
    })

    const prefixCls = 'basic-table-img'
    return { prefixCls, getWrapStyle }
  }
})
</script>
<style lang="scss">
.basic-table-img {
  .ant-image {
    margin-right: 4px;
    cursor: zoom-in;

    img {
      border-radius: 2px;
    }
  }

  .img-div {
    display: inline-grid;
  }
}
</style>
