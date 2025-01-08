<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item, index) in statistics" :key="index">
        <el-card class="data-card">
          <div class="card-title">{{ item.title }}</div>
          <div class="card-value">{{ item.value }}</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const statistics = ref([
  { title: '总用户数', value: '45,632' },
  { title: '月活用户', value: '32,854' },
  { title: '日活用户', value: '12,365' },
  { title: '业务覆盖', value: '96%' }
])
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}
.data-card {
  margin-bottom: 20px;
}
.card-title {
  font-size: 14px;
  color: #666;
}
.card-value {
  font-size: 24px;
  font-weight: bold;
  margin-top: 10px;
}
</style>
