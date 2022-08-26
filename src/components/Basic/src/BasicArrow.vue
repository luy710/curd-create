<template>
  <span :class="getClass">
    <Icon icon="ion:chevron-forward" :style="$attrs.iconStyle" />
  </span>
</template>
<script lang="ts" setup>
// import { computed, defineProps } from 'vue'
// import { Icon } from '/@/components/Icon'
const props = defineProps({
  /**
   * Arrow expand state
   */
  expand: { type: Boolean },
  /**
   * Arrow up by default
   */
  up: { type: Boolean },
  /**
   * Arrow down by default
   */
  down: { type: Boolean },
  /**
   * Cancel padding/margin for inline
   */
  inset: { type: Boolean }
})

const prefixCls = 'm-basic-arrow'

// get component class
const getClass = computed(() => {
  const { expand, up, down, inset } = props
  return [
    prefixCls,
    {
      [`${prefixCls}--active`]: expand,
      up,
      inset,
      down
    }
  ]
})
</script>
<style lang="scss" scoped>
.m-basic-arrow {
  display: inline-block;
  cursor: pointer;
  transform: rotate(0deg);
  transition: all 0.3s ease 0.1s;
  transform-origin: center center;

  &--active {
    transform: rotate(90deg);
  }

  &.inset {
    line-height: 0px;
  }

  &.up {
    transform: rotate(-90deg);
  }

  &.down {
    transform: rotate(90deg);
  }

  &.up.m-basic-arrow--active {
    transform: rotate(90deg);
  }

  &.down.m-basic-arrow--active {
    transform: rotate(-90deg);
  }
}
</style>
