<template>
  <div class="analysis-container">
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item, index) in statistics" :key="index">
        <el-card class="box-card">
          <div class="card-header">
            <span>{{ item.title }}</span>
          </div>
          <div class="card-value">{{ item.value }}</div>
          <div class="card-growth" :style="{ color: item.growth.startsWith('+') ? '#67C23A' : '#F56C6C' }">
            同比增长 {{ item.growth }}
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div class="chart-container">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>5G业务分布</span>
              </div>
            </template>
            <div ref="businessChart" style="height: 400px"></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>月度用户趋势</span>
              </div>
            </template>
            <div ref="trendChart" style="height: 400px"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

// 模拟统计数据
const statistics = ref([
  {
    title: '总用户数',
    value: '49,540',
    growth: '+12.5%'
  },
  {
    title: '月增用户',
    value: '648',
    growth: '+8.2%'
  },
  {
    title: '总收入',
    value: '¥3.25亿',
    growth: '+15.3%'
  },
  {
    title: '客户满意度',
    value: '96%',
    growth: '+2.1%'
  }
])

const businessChart = ref(null)
const trendChart = ref(null)
let chartInstance = null
let trendInstance = null

onMounted(() => {
  initBusinessChart()
  initTrendChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
  trendInstance?.dispose()
})

const handleResize = () => {
  chartInstance?.resize()
  trendInstance?.resize()
}

const initBusinessChart = () => {
  if (!businessChart.value) return

  chartInstance = echarts.init(businessChart.value)
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderColor: '#eee',
      borderWidth: 1,
      padding: [10, 15],
      textStyle: {
        color: '#333'
      }
    },
    legend: {
      orient: 'horizontal', // 改为水平放置
      bottom: '5%', // 放在底部
      left: 'center',
      itemWidth: 25,
      itemHeight: 14,
      itemGap: 30, // 图例间距
      textStyle: {
        fontSize: 12,
        color: '#666'
      }
    },
    series: [{
      name: '业务分布',
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['50%', '45%'], // 略微上移
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 6,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        position: 'outside',
        formatter: params => {
          return `${params.name}\n${params.value}`
        },
        padding: [4, 8],
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderColor: '#eee',
        borderWidth: 1,
        borderRadius: 4,
        alignTo: 'labelLine', // 对齐到引导线
        distanceToLabelLine: 5, // 与引导线距离
        rich: {
          value: {
            fontSize: 14,
            fontWeight: 'bold',
            padding: [4, 0, 0, 0]
          }
        }
      },
      labelLine: {
        show: true,
        length: 20, // 第一段线长度
        length2: 30, // 第二段线长度
        maxSurfaceAngle: 80, // 最大弧度
        lineStyle: {
          width: 1,
          type: 'solid'
        }
      },
      labelLayout: {
        hideOverlap: true, // 隐藏重叠标签
        moveOverlap: 'shiftY' // Y轴方向移动重叠标签
      },
      data: [
        {
          name: '5G专线',
          value: 3200,
          itemStyle: { color: '#67C23A' }
        },
        {
          name: '5G专网',
          value: 2800,
          itemStyle: { color: '#409EFF' }
        },
        {
          name: '边缘计算',
          value: 2300,
          itemStyle: { color: '#E6A23C' }
        },
        {
          name: '网络切片',
          value: 1800,
          itemStyle: { color: '#F56C6C' }
        }
      ],
      emphasis: {
        label: {
          show: true,
          fontSize: 14,
          fontWeight: 'bold'
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.2)'
        }
      }
    }]
  }

  chartInstance.setOption(option)
}


const initTrendChart = () => {
  if (!trendChart.value) return

  trendInstance = echarts.init(trendChart.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}<br />用户数: {c}'
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
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      axisLine: {
        lineStyle: {
          color: '#666'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#666'
        }
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#ddd'
        }
      }
    },
    series: [{
      name: '用户数',
      type: 'line',
      smooth: true,
      data: [0, 0, 0, 0, 0, 0, 0, 0, 6800, 7200, 7500, 7800],
      symbolSize: 6,
      symbol: 'circle',
      itemStyle: {
        color: '#409EFF',
        borderWidth: 2,
        borderColor: '#fff'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(64,158,255,0.3)'
          },
          {
            offset: 1,
            color: 'rgba(64,158,255,0.1)'
          }
        ])
      }
    }]
  }

  trendInstance.setOption(option)
}
</script>

<style scoped>
.analysis-container {
  padding: 20px;
}

.box-card {
  margin-bottom: 20px;
  background: #fff;
  border-radius: 8px;
}

.card-header {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  line-height: 1.5;
}

.card-growth {
  font-size: 12px;
  margin-top: 8px;
  display: flex;
  align-items: center;
}

.chart-container {
  margin-top: 20px;
}

.chart-container .el-card {
  margin-bottom: 20px;
}

.chart-container .card-header {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

:deep(.el-card__header) {
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-card__body) {
  padding: 20px;
}

/* 暗色主题适配 */
:deep(.dark) {
  .box-card,
  .el-card {
    background: #1d1e1f;
  }

  .card-header {
    color: #e5eaf3;
  }

  .card-value {
    color: #fff;
  }

  :deep(.el-card__header) {
    border-bottom: 1px solid #363637;
  }
}
</style>