<template>
  <div class="innovation-container">
    <!-- 创新项目概览 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item, index) in projectStats" :key="index">
        <el-card class="stat-card" :body-style="{ padding: '20px' }">
          <div class="stat-icon">
            <el-icon :size="24" :color="item.color">
              <component :is="item.icon" />
            </el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ item.value }}</div>
            <div class="stat-title">{{ item.title }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 创新项目列表 -->
    <el-card class="project-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span class="title">创新项目管理</span>
          </div>
          <div class="header-right">
            <el-button type="primary" @click="handleAddProject">
              <el-icon><Plus /></el-icon>新建项目
            </el-button>
          </div>
        </div>
      </template>

      <el-table :data="projectData" style="width: 100%" border stripe>
        <el-table-column prop="name" label="项目名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="type" label="项目类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getProjectTypeTag(row.type)">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="leader" label="负责人" width="100" />
        <el-table-column prop="startDate" label="开始日期" width="120" />
        <el-table-column prop="endDate" label="计划完成" width="120" />
        <el-table-column prop="progress" label="进度" width="180">
          <template #default="{ row }">
            <el-progress
                :percentage="row.progress"
                :status="getProgressStatus(row.progress)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
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
                @click="handleViewDetails(scope.row)"
            >详情</el-button>
            <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新建/编辑项目对话框 -->
    <el-dialog
        :title="dialogType === 'add' ? '新建项目' : '编辑项目'"
        v-model="dialogVisible"
        width="600px"
    >
      <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="100px"
      >
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="项目类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择项目类型" style="width: 100%">
            <el-option
                v-for="item in projectTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="项目负责人" prop="leader">
          <el-input v-model="formData.leader" placeholder="请输入负责人姓名" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始日期" prop="startDate">
              <el-date-picker
                  v-model="formData.startDate"
                  type="date"
                  placeholder="选择开始日期"
                  style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划完成" prop="endDate">
              <el-date-picker
                  v-model="formData.endDate"
                  type="date"
                  placeholder="选择完成日期"
                  style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="项目进度" prop="progress">
          <el-slider v-model="formData.progress" :step="5" show-input />
        </el-form-item>
        <el-form-item label="项目描述" prop="description">
          <el-input
              v-model="formData.description"
              type="textarea"
              :rows="4"
              placeholder="请输入项目描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 项目详情抽屉 -->
    <el-drawer
        v-model="drawerVisible"
        title="项目详情"
        size="50%"
    >
      <div v-if="currentProject" class="project-details">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="项目名称">{{ currentProject.name }}</el-descriptions-item>
          <el-descriptions-item label="项目类型">
            <el-tag :type="getProjectTypeTag(currentProject.type)">{{ currentProject.type }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="项目负责人">{{ currentProject.leader }}</el-descriptions-item>
          <el-descriptions-item label="开始日期">{{ currentProject.startDate }}</el-descriptions-item>
          <el-descriptions-item label="计划完成">{{ currentProject.endDate }}</el-descriptions-item>
          <el-descriptions-item label="项目进度">
            <el-progress
                :percentage="currentProject.progress"
                :status="getProgressStatus(currentProject.progress)"
            />
          </el-descriptions-item>
          <el-descriptions-item label="项目状态">
            <el-tag :type="getStatusTag(currentProject.status)">{{ currentProject.status }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="项目描述">{{ currentProject.description }}</el-descriptions-item>
        </el-descriptions>

        <!-- 项目里程碑 -->
        <div class="milestone-section">
          <h3>项目里程碑</h3>
          <el-timeline>
            <el-timeline-item
                v-for="(milestone, index) in currentProject.milestones"
                :key="index"
                :type="milestone.status === '完成' ? 'success' : 'primary'"
                :timestamp="milestone.date"
            >
              {{ milestone.content }}
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import {
  Plus,
  Connection,
  Cpu,
  Monitor,
  TrendCharts
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 项目统计数据
const projectStats = ref([
  {
    title: '进行中项目',
    value: '12',
    icon: 'Connection',
    color: '#409EFF'
  },
  {
    title: '已完成项目',
    value: '25',
    icon: 'TrendCharts',
    color: '#67C23A'
  },
  {
    title: '待审核项目',
    value: '5',
    icon: 'Monitor',
    color: '#E6A23C'
  },
  {
    title: '暂停项目',
    value: '2',
    icon: 'Cpu',
    color: '#F56C6C'
  }
])

// 项目数据
const projectData = ref([
  {
    id: 1,
    name: '5G+智慧工厂解决方案创新',
    type: '产品创新',
    leader: '张明',
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    progress: 45,
    status: '进行中',
    description: '针对制造业数字化转型需求，开发基于5G网络的智慧工厂整体解决方案。',
    milestones: [
      { date: '2024-01-15', content: '项目启动', status: '完成' },
      { date: '2024-03-01', content: '需求分析完成', status: '完成' },
      { date: '2024-04-15', content: '方案设计', status: '进行中' },
      { date: '2024-06-30', content: '项目验收', status: '待完成' }
    ]
  },
  {
    id: 2,
    name: '边缘计算平台优化项目',
    type: '技术创新',
    leader: '李华',
    startDate: '2024-02-01',
    endDate: '2024-05-31',
    progress: 65,
    status: '进行中',
    description: '优化现有边缘计算平台性能，提升数据处理效率和响应速度。',
    milestones: [
      { date: '2024-02-01', content: '项目启动', status: '完成' },
      { date: '2024-03-15', content: '性能分析', status: '完成' },
      { date: '2024-04-30', content: '优化实施', status: '进行中' },
      { date: '2024-05-31', content: '验收测试', status: '待完成' }
    ]
  },
  {
    id: 3,
    name: '网络切片管理系统革新',
    type: '平台创新',
    leader: '王芳',
    startDate: '2024-03-01',
    endDate: '2024-08-31',
    progress: 30,
    status: '进行中',
    description: '重构网络切片管理系统，提升用户体验和管理效率。',
    milestones: [
      { date: '2024-03-01', content: '项目启动', status: '完成' },
      { date: '2024-04-15', content: '架构设计', status: '进行中' },
      { date: '2024-06-30', content: '系统开发', status: '待完成' },
      { date: '2024-08-31', content: '系统上线', status: '待完成' }
    ]
  }
])

// 项目类型选项
const projectTypes = [
  { value: '产品创新', label: '产品创新' },
  { value: '技术创新', label: '技术创新' },
  { value: '平台创新', label: '平台创新' },
  { value: '服务创新', label: '服务创新' },
  { value: '模式创新', label: '模式创新' }
]

// 表单数据
const dialogVisible = ref(false)
const drawerVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)
const currentProject = ref(null)

const formData = reactive({
  name: '',
  type: '',
  leader: '',
  startDate: '',
  endDate: '',
  progress: 0,
  description: ''
})

const formRules = {
  name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择项目类型', trigger: 'change' }],
  leader: [{ required: true, message: '请输入负责人姓名', trigger: 'blur' }],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择完成日期', trigger: 'change' }],
  description: [{ required: true, message: '请输入项目描述', trigger: 'blur' }]
}

// 标签类型
const getProjectTypeTag = (type) => {
  const types = {
    '产品创新': 'success',
    '技术创新': 'primary',
    '平台创新': 'warning',
    '服务创新': 'info',
    '模式创新': ''
  }
  return types[type] || ''
}

const getStatusTag = (status) => {
  const types = {
    '进行中': 'primary',
    '已完成': 'success',
    '待审核': 'warning',
    '已暂停': 'info'
  }
  return types[status] || ''
}

const getProgressStatus = (progress) => {
  if (progress >= 100) return 'success'
  if (progress >= 80) return 'warning'
  return ''
}

// 处理函数
const handleAddProject = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  Object.keys(formData).forEach(key => {
    formData[key] = ''
  })
  formData.progress = 0
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  dialogVisible.value = true
  Object.assign(formData, row)
}

const handleViewDetails = (row) => {
  currentProject.value = row
  drawerVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
      '确认删除该项目？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
  )
      .then(() => {
        const index = projectData.value.findIndex(item => item.id === row.id)
        if (index > -1) {
          projectData.value.splice(index, 1)
          ElMessage.success('删除成功')
        }
      })
      .catch(() => {})
}

const submitForm = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      const newProject = {
        id: projectData.value.length + 1,
        status: '进行中',
        ...formData,
        milestones: [
          {
            date: formData.startDate,
            content: '项目启动',
            status: '完成'
          },
          {
            date: formData.endDate,
            content: '项目验收',
            status: '待完成'
          }
        ]
      }

      if (dialogType.value === 'add') {
        projectData.value.unshift(newProject)
        ElMessage.success('添加成功')
      } else {
        const index = projectData.value.findIndex(item => item.id === newProject.id)
        if (index > -1) {
          projectData.value[index] = newProject
          ElMessage.success('更新成功')
        }
      }
      dialogVisible.value = false
    }
  })
}
</script>

<style scoped>
.innovation-container {
  padding: 20px;
}

.stat-card {
  margin-bottom: 20px;
}

.stat-icon {
  margin-bottom: 10px;
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
}

.project-card {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-left .title {
  font-size: 16px;
  font-weight: 500;
}

.project-details {
  padding: 20px;
}

.milestone-section {
  margin-top: 30px;
}

.milestone-section h3 {
  margin-bottom: 20px;
  font-weight: 500;
  color: #303133;
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

  .milestone-section h3 {
    color: #E5EAF3;
  }
}
</style>