<template>
  <el-menu :default-openeds="['/comp', 'form']" router class="el-menu-vertical-demo">
    <template v-for="item in BasicRoutes">
      <el-menu-item v-if="!hasChidlren(item)" :index="item.path">
        <template #title>
          <span>{{ item.name }}</span>
        </template>
      </el-menu-item>
      <el-sub-menu v-else :index="item.path">
        <template #title>
          <span>{{ item.name }}</span>
        </template>
        <template v-for="sub in item.children">
          <el-menu-item v-if="!hasChidlren(sub)" :index="sub.path">
            <template #title>
              <span>{{ sub.name }}</span>
            </template>
          </el-menu-item>
          <el-sub-menu v-else :index="sub.path">
            <template #title>
              <span>{{ sub.name }}</span>
            </template>
            <el-menu-item v-for="child in sub.children" :index="child.path">
              <template #title>
                <span>{{ child.name }}</span>
              </template>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-sub-menu>
    </template>
  </el-menu>
</template>

<script lang="ts" setup>
import BasicRoutes from '@/routes/basic'
const hasChidlren = (item: Recordable) => {
  if (item.children) {
    return item.children.filter((el: Recordable) => !el.meta.hide).length > 0
  }
  return false
}
</script>

<style lang="scss" scoped></style>
