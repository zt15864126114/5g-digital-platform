<template>
  <div class="app-container">
    <el-container>
      <el-aside width="auto">
        <nav-menu />
      </el-aside>
      <el-container>
        <el-header>
          <header-bar />
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import NavMenu from '@/components/NavMenu.vue'
import HeaderBar from '@/components/HeaderBar.vue'
</script>

<style scoped>
.app-container {
  height: 100vh;
}

.el-container {
  height: 100%;
}

.el-header {
  padding: 0;
  border-bottom: 1px solid #e6e6e6;
}

.el-main {
  padding: 20px;
  background-color: #f5f7fa;
}

/* 暗色主题适配 */
:deep(.dark) {
  .el-header {
    border-bottom-color: #363637;
  }

  .el-main {
    background-color: #141414;
  }
}
</style>