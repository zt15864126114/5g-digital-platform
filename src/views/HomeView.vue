<template>
  <div class="home-container">
    <!-- 欢迎卡片 -->
    <el-card class="welcome-card">
      <div class="welcome-content">
        <h2>欢迎使用5G数字化平台</h2>
        <p>快速访问您的常用功能</p>
      </div>
    </el-card>

    <!-- 快速访问卡片 -->
    <el-row :gutter="20" class="quick-access">
      <el-col :span="6" v-for="(item, index) in quickAccessItems" :key="index">
        <el-card
            class="quick-card"
            shadow="hover"
            @click="navigateTo(item.path)"
        >
          <div class="quick-icon">
            <el-icon :size="32" :color="item.color">
              <component :is="item.icon" />
            </el-icon>
          </div>
          <div class="quick-info">
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 系统概览 -->
    <el-row :gutter="20" class="system-overview">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>系统访问趋势</span>
              <el-radio-group v-model="timeRange" size="small">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="visitChart" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="notice-card">
          <template #header>
            <div class="card-header">
              <span>系统公告</span>
              <el-button text>更多</el-button>
            </div>
          </template>
          <div class="notice-list">
            <div v-for="(notice, index) in notices" :key="index" class="notice-item">
              <div class="notice-title">{{ notice.title }}</div>
              <div class="notice-time">{{ notice.time }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import {
  User,
  DataLine,
  Collection,
  Lightning,
  HomeFilled,
  Document,
  Refresh,
  Timer,
  CircleClose,
  Search,
  Plus,
  Edit,
  Delete,
  View
} from '@element-plus/icons-vue'

const router = useRouter()
const visitChart = ref(null)
let chartInstance = null
const timeRange = ref('week')

// 快速访问项
const quickAccessItems = [
  {
    title: '客户管理',
    desc: '管理客户信息和关系',
    icon: 'User',
    color: '#409EFF',
    path: '/customer'
  },
  {
    title: '数据分析',
    desc: '查看数据分析报告',
    icon: 'DataLine',
    color: '#67C23A',
    path: '/data'
  },
  {
    title: '信息收集',
    desc: '收集和整理信息',
    icon: 'Collection',
    color: '#E6A23C',
    path: '/collection'
  },
  {
    title: '业务创新',
    desc: '管理创新项目',
    icon: 'Lightning',
    color: '#F56C6C',
    path: '/innovation'
  }
]

// 系统公告
const notices = [
  {
    title: '系统将于本周日进行例行维护',
    time: '2024-03-20'
  },
  {
    title: '新版本功能更新说明',
    time: '2024-03-18'
  },
  {
    title: '关于加强数据安全管理的通知',
    time: '2024-03-15'
  },
  {
    title: '新增业务创新模块使用指南',
    time: '2024-03-12'
  },
  {
    title: '系统性能优化完成公告',
    time: '2024-03-10'
  }
]

// 导航方法
const navigateTo = (path) => {
  router.push(path)
}

// 初始化图表
const initChart = () => {
  if (!visitChart.value) return

  chartInstance = echarts.init(visitChart.value)

  const option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: timeRange.value === 'week'
          ? ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          : Array.from({length: 30}, (_, i) => `${i + 1}日`)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '访问量',
        type: 'line',
        smooth: true,
        data: timeRange.value === 'week'
            ? [120, 132, 101, 134, 90, 230, 210]
            : Array.from({length: 30}, () => Math.floor(Math.random() * 200 + 100)),
        areaStyle: {
          opacity: 0.1
        },
        lineStyle: {
          width: 3
        }
      }
    ]
  }

  chartInstance.setOption(option)
}

// 监听时间范围变化
const handleTimeRangeChange = () => {
  initChart()
}

// 监听窗口大小变化
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.home-container {
  padding: 20px;
}

.welcome-card {
  margin-bottom: 20px;
}

.welcome-content {
  text-align: center;
  padding: 20px;
}

.welcome-content h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.welcome-content p {
  margin: 10px 0 0;
  color: #909399;
}

.quick-access {
  margin-bottom: 20px;
}

.quick-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.quick-card:hover {
  transform: translateY(-5px);
}

.quick-icon {
  text-align: center;
  margin-bottom: 15px;
}

.quick-info {
  text-align: center;
}

.quick-info h3 {
  margin: 0 0 10px;
  font-size: 16px;
  color: #303133;
}

.quick-info p {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.system-overview {
  margin-bottom: 20px;
}

.chart-card,
.notice-card {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notice-list {
  .notice-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #EBEEF5;

    &:last-child {
      border-bottom: none;
    }
  }

  .notice-title {
    flex: 1;
    margin-right: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .notice-time {
    color: #909399;
    font-size: 12px;
  }
}

/* 暗色主题适配 */
:deep(.dark) {
  .welcome-content h2 {
    color: #E5EAF3;
  }

  .quick-info h3 {
    color: #E5EAF3;
  }

  .notice-list .notice-item {
    border-bottom-color: #363637;
  }

  .el-card {
    background: #1d1e1f;
    border: 1px solid #363637;
  }
}
</style>