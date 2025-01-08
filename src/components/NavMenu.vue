<template>
  <el-menu
      :default-active="route.path"
      class="nav-menu"
      :collapse="isCollapse"
      router
  >
    <el-menu-item index="/">
      <el-icon><HomeFilled /></el-icon>
      <template #title>首页</template>
    </el-menu-item>

    <el-menu-item index="/customer">
      <el-icon><User /></el-icon>
      <template #title>客户管理</template>
    </el-menu-item>

    <el-menu-item index="/data">
      <el-icon><DataLine /></el-icon>
      <template #title>数据分析</template>
    </el-menu-item>

    <el-sub-menu index="info">
      <template #title>
        <el-icon><Management /></el-icon>
        <span>信息管理</span>
      </template>

      <el-menu-item index="/collection">
        <el-icon><Collection /></el-icon>
        <template #title>信息收集</template>
      </el-menu-item>

      <el-menu-item index="/maintenance">
        <el-icon><Files /></el-icon>
        <template #title>信息维护</template>
      </el-menu-item>
    </el-sub-menu>

    <el-menu-item index="/innovation">
      <el-icon><Lightning /></el-icon>
      <template #title>业务创新</template>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  HomeFilled,
  User,
  DataLine,
  Management,
  Collection,
  Files,
  Lightning
} from '@element-plus/icons-vue'

const route = useRoute()
const isCollapse = ref(false)
</script>

<style scoped>
.nav-menu {
  height: 100%;
  border-right: none;
}

.nav-menu:not(.el-menu--collapse) {
  width: 200px;
}
</style>