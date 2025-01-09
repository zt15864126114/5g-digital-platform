<template>
  <div class="info-collection-container">
    <!-- 统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item, index) in statistics" :key="index">
        <el-card class="stat-card">
          <div class="stat-value">{{ item.value }}</div>
          <div class="stat-title">{{ item.title }}</div>
          <div class="stat-growth" :class="{ 'positive': item.growth > 0 }">
            {{ item.growth > 0 ? '+' : '' }}{{ item.growth }}%
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 信息收集表格 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>信息收集记录</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增记录
          </el-button>
        </div>
      </template>

      <el-table :data="paginatedData" style="width: 100%" border stripe>
        <el-table-column prop="date" label="收集日期" width="120" />
        <el-table-column prop="collector" label="收集人" width="120" />
        <el-table-column prop="source" label="信息来源" width="120" />
        <el-table-column prop="type" label="信息类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getTypeTag(row.type)">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="信息内容" show-overflow-tooltip />
        <el-table-column prop="status" label="处理状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
                size="small"
                type="success"
                @click="handleProcess(scope.row)"
                v-if="scope.row.status === '待处理'"
            >处理</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="tableData.length"
            :page-sizes="[10, 20, 30, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
        :title="dialogType === 'add' ? '新增记录' : '编辑记录'"
        v-model="dialogVisible"
        width="500px"
    >
      <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="100px"
      >
        <el-form-item label="信息来源" prop="source">
          <el-select v-model="formData.source" placeholder="请选择信息来源" style="width: 100%">
            <el-option
                v-for="item in sourceOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="信息类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择信息类型" style="width: 100%">
            <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="信息内容" prop="content">
          <el-input
              v-model="formData.content"
              type="textarea"
              :rows="4"
              placeholder="请输入信息内容"
          />
        </el-form-item>
        <el-form-item label="收集人" prop="collector">
          <el-input v-model="formData.collector" placeholder="请输入收集人姓名" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 统计数据
const statistics = ref([
  { title: '本月收集总量', value: '328', growth: 12.5 },
  { title: '待处理信息', value: '90', growth: -8.3 },
  { title: '已处理信息', value: '238', growth: 15.7 },
  { title: '信息采纳率', value: '86%', growth: 5.2 }
])
// 生成测试数据的函数
const generateTestData = (count) => {
  const names = [
    '张明', '李华', '王芳', '赵伟', '陈明', '刘洋', '周静', '吴超', '郑华', '孙明',
    '黄海', '朱琳', '钱伟', '赵云', '孙策', '周瑜', '林俊', '王凯', '张鹏', '李想',
    '陈佳', '刘星', '吴京', '郑智', '黄晓', '朱强', '钱多', '赵阳', '孙红', '周杰',
    '林峰', '王浩', '张杰', '李梅', '陈华', '刘芳', '吴磊', '郑钧', '黄河', '朱迪'
  ]
  const sources = ['客户反馈', '市场调研', '行业会议', '合作伙伴', '内部员工', '社交媒体']
  const types = ['产品建议', '竞品信息', '行业动态', '市场机会', '客户投诉', '其他']
  const contents = [
    '建议优化5G网络覆盖范围，部分区域信号不稳定。',
    '竞争对手推出新的企业专网方案，价格更具竞争力。',
    '工业互联网领域新政策出台，有利于5G应用推广。',
    '某大型制造企业计划部署5G专网，需要详细方案。',
    '现有管理平台响应速度较慢，建议技术优化。',
    '用户反映计费系统occasionally出现延迟，需要排查。',
    '新一代5G技术研发取得突破，可以考虑应用。',
    '智慧园区项目需要更多5G应用场景支持。',
    '边缘计算平台需要提升稳定性和可靠性。',
    '客户希望增加更多数据分析功能。',
    '5G专网切片资源调度需要优化，提高资源利用率。',
    '建议增加网络性能实时监控大屏展示功能。',
    '医疗行业客户需要更高的网络可靠性保障。',
    '智能制造基地希望部署更多5G+AR远程指导应用。',
    '车联网项目需要低时延网络支持，建议优化。',
    '港口自动化项目需要5G专网覆盖方案。',
    '新建5G基站选址需要考虑周边居民意见。',
    '企业园区WiFi6与5G融合组网方案需求。',
    '智慧城市项目需要大规模物联网接入支持。',
    '5G消息业务推广需要更多创新营销方案。',
    '工业互联网安全防护需要加强。',
    '边缘计算节点扩容方案需要评估。',
    '高铁5G覆盖优化需求增加。',
    '新能源电厂智能运维需要5G支持。',
    '矿山智能化改造项目启动。',
    '钢铁企业数字化转型需求明确。',
    '5G+智慧农业示范项目计划启动。',
    '跨境电商物流需要5G物联网支持。',
    '智慧校园项目需要升级改造。',
    '5G云游戏业务体验需要优化。'
  ]
  const statuses = ['已处理', '待处理']

  return Array.from({ length: count }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))

    return {
      id: index + 6,
      date: date.toISOString().split('T')[0],
      collector: names[Math.floor(Math.random() * names.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      type: types[Math.floor(Math.random() * types.length)],
      content: contents[Math.floor(Math.random() * contents.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)]
    }
  })
}


// 表格数据
const tableData = ref([
  {
    id: 1,
    date: '2024-10-20',
    collector: '张明',
    source: '客户反馈',
    type: '产品建议',
    content: '建议在5G专线产品中添加实时流量监控功能，方便企业管理网络使用情况。',
    status: '已处理'
  },
  {
    id: 2,
    date: '2024-10-20',
    collector: '李华',
    source: '市场调研',
    type: '竞品信息',
    content: '竞争对手A公司推出了新的边缘计算解决方案，主打低延迟特性。',
    status: '待处理'
  },
  {
    id: 3,
    date: '2024-10-19',
    collector: '王芳',
    source: '行业会议',
    type: '行业动态',
    content: '2024年第四季度将有新的5G行业政策出台，可能影响专网建设。',
    status: '待处理'
  },
  {
    id: 4,
    date: '2024-10-19',
    collector: '赵伟',
    source: '合作伙伴',
    type: '市场机会',
    content: 'B集团计划在全国范围内建设智慧工厂，需要5G专网支持。',
    status: '已处理'
  },
  {
    id: 5,
    date: '2024-10-18',
    collector: '陈明',
    source: '内部员工',
    type: '产品建议',
    content: '现有的网络切片管理界面操作复杂，建议优化用户体验。',
    status: '已处理'
  },
  ...generateTestData(323) // 生成45条新数据，总共50条
])

// 选项数据
const sourceOptions = [
  { value: '客户反馈', label: '客户反馈' },
  { value: '市场调研', label: '市场调研' },
  { value: '行业会议', label: '行业会议' },
  { value: '合作伙伴', label: '合作伙伴' },
  { value: '内部员工', label: '内部员工' },
  { value: '社交媒体', label: '社交媒体' }
]

const typeOptions = [
  { value: '产品建议', label: '产品建议' },
  { value: '竞品信息', label: '竞品信息' },
  { value: '行业动态', label: '行业动态' },
  { value: '市场机会', label: '市场机会' },
  { value: '客户投诉', label: '客户投诉' },
  { value: '其他', label: '其他' }
]

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)

// 计算分页后的数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return tableData.value.slice(start, end)
})

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)
const formData = reactive({
  source: '',
  type: '',
  content: '',
  collector: ''
})

const formRules = {
  source: [{ required: true, message: '请选择信息来源', trigger: 'change' }],
  type: [{ required: true, message: '请选择信息类型', trigger: 'change' }],
  content: [{ required: true, message: '请输入信息内容', trigger: 'blur' }],
  collector: [{ required: true, message: '请输入收集人姓名', trigger: 'blur' }]
}

// 标签类型
const getTypeTag = (type) => {
  const types = {
    '产品建议': 'success',
    '竞品信息': 'warning',
    '行业动态': 'info',
    '市场机会': 'primary',
    '客户投诉': 'danger'
  }
  return types[type] || ''
}

const getStatusTag = (status) => {
  return status === '已处理' ? 'success' : 'warning'
}

// 处理函数
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  formData.source = ''
  formData.type = ''
  formData.content = ''
  formData.collector = ''
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  dialogVisible.value = true
  Object.assign(formData, row)
}

const handleProcess = (row) => {
  ElMessageBox.confirm(
      '确认将该条信息标记为已处理？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
  )
      .then(() => {
        row.status = '已处理'
        ElMessage.success('处理成功')
      })
      .catch(() => {})
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
      '确认删除该条信息？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
  )
      .then(() => {
        const index = tableData.value.findIndex(item => item.id === row.id)
        if (index > -1) {
          tableData.value.splice(index, 1)
          ElMessage.success('删除成功')
        }
      })
      .catch(() => {})
}

const submitForm = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      const newRecord = {
        id: tableData.value.length + 1,
        date: new Date().toISOString().split('T')[0],
        status: '待处理',
        ...formData
      }

      if (dialogType.value === 'add') {
        tableData.value.unshift(newRecord)
        currentPage.value = 1  // 添加新记录后跳转到第一页
        ElMessage.success('添加成功')
      } else {
        const index = tableData.value.findIndex(item => item.id === newRecord.id)
        if (index > -1) {
          tableData.value[index] = newRecord
          ElMessage.success('更新成功')
        }
      }
      dialogVisible.value = false
    }
  })
}

// 处理分页
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1  // 重置到第一页
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}
</script>

<style scoped>
.info-collection-container {
  padding: 20px;
}

.stat-card {
  margin-bottom: 20px;
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-growth {
  font-size: 12px;
  color: #F56C6C;
}

.stat-growth.positive {
  color: #67C23A;
}

.table-card {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 暗色主题适配 */
:deep(.dark) {
  .el-card {
    background: #1d1e1f;
    border: 1px solid #363637;
  }

  .stat-value {
    color: #E5EAF3;
  }

  .stat-title {
    color: #A3A6AD;
  }
}
</style>