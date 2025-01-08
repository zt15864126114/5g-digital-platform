<template>
  <div class="header-container">
    <div class="left">
      <el-button text @click="toggleCollapse">
        <el-icon :size="20">
          <Fold v-if="!isCollapse" />
          <Expand v-else />
        </el-icon>
      </el-button>
      <div class="breadcrumb">
        <el-breadcrumb>
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-if="currentRoute.name !== 'home'">
            {{ getRouteName(currentRoute.name) }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="right">
      <el-switch
          v-model="isDark"
          class="theme-switch"
          inline-prompt
          :active-icon="Moon"
          :inactive-icon="Sunny"
          @change="toggleTheme"
      />
      <el-dropdown>
        <span class="user-dropdown">
          <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          <span class="username">管理员</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人信息</el-dropdown-item>
            <el-dropdown-item>修改密码</el-dropdown-item>
            <el-dropdown-item divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Fold, Expand, Moon, Sunny } from '@element-plus/icons-vue'

const currentRoute = useRoute()
const isCollapse = ref(false)
const isDark = ref(false)

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const toggleTheme = (value) => {
  if (value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const getRouteName = (name) => {
  const routeNames = {
    customer: '客户管理',
    data: '数据分析',
    collection: '信息收集',
    maintenance: '信息维护',
    innovation: '业务创新'
  }
  return routeNames[name] || name
}
</script>

<style scoped>
.header-container {
  height: 60px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
}

.left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.username {
  font-size: 14px;
}

/* 暗色主题适配 */
:deep(.dark) {
  .header-container {
    background-color: #1d1e1f;
  }

  .username {
    color: #E5EAF3;
  }
}
</style>