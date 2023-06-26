<script lang="ts" setup>
const props = defineProps({

  expand: { type: Boolean },

  up: { type: Boolean },

  down: { type: Boolean },

  inset: { type: Boolean },
})

const prefixCls = 'm-basic-arrow'

const getClass = computed(() => {
  const { expand, up, down, inset } = props
  return [
    prefixCls,
    {
      [`${prefixCls}--active`]: expand,
      up,
      inset,
      down,
    },
  ]
})
</script>

<template>
  <span :class="getClass">
    <Icon icon="ion:chevron-forward" :style="$attrs.iconStyle" />
  </span>
</template>

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
