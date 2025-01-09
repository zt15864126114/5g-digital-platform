<template>
  <div class="maintenance-container">
    <!-- 统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item, index) in statistics" :key="index">
        <el-card class="stat-card" :body-style="{ padding: '20px' }">
          <div class="stat-icon">
            <el-icon :size="24" :color="item.color">
              <component :is="item.icon" />
            </el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value" :style="{ color: item.color }">{{ item.value }}</div>
            <div class="stat-title">{{ item.title }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 信息维护表格 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span class="title">信息维护记录</span>
            <el-tag type="info">{{ total }} 条记录</el-tag>
          </div>
          <div class="header-right">
            <el-input
                v-model="searchKeyword"
                placeholder="搜索关键词"
                style="width: 200px; margin-right: 10px"
                clearable
                @clear="handleSearch"
                @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="handleAdd">
              <el-icon><Plus /></el-icon>新增记录
            </el-button>
          </div>
        </div>
      </template>

      <el-table
          v-loading="loading"
          :data="filteredTableData"
          style="width: 100%"
          border
          stripe
      >
        <el-table-column prop="date" label="更新日期" width="120" sortable />
        <el-table-column prop="type" label="信息类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getTypeTag(row.type)">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="operator" label="操作人" width="120" />
        <el-table-column prop="category" label="分类" width="120">
          <template #default="{ row }">
            <el-tag :type="getCategoryTag(row.category)" effect="plain">
              {{ row.category }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
                size="small"
                type="success"
                @click="handleView(scope.row)"
            >查看</el-button>
            <el-button
                size="small"
                type="warning"
                v-if="scope.row.status === '待审核'"
                @click="handleApprove(scope.row)"
            >审核</el-button>
            <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="total"
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
        width="650px"
    >
      <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="100px"
      >
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
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="formData.category" placeholder="请选择分类" style="width: 100%">
            <el-option
                v-for="item in categoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
              v-model="formData.content"
              type="textarea"
              :rows="6"
              placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="附件">
          <el-upload
              action="#"
              :auto-upload="false"
              :on-change="handleFileChange"
              :file-list="formData.attachments"
          >
            <el-button type="primary">选择文件</el-button>
            <template #tip>
              <div class="el-upload__tip">
                支持任意格式文件，单个文件不超过10MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog
        title="信息详情"
        v-model="detailVisible"
        width="800px"
    >
      <div v-if="currentRecord" class="detail-content">
        <h3>{{ currentRecord.title }}</h3>
        <div class="meta-info">
          <span>更新时间：{{ currentRecord.date }}</span>
          <span>操作人：{{ currentRecord.operator }}</span>
          <span>状态：
            <el-tag :type="getStatusTag(currentRecord.status)">
              {{ currentRecord.status }}
            </el-tag>
          </span>
        </div>
        <div class="content-box">
          {{ currentRecord.content }}
        </div>

        <!-- 附件列表 -->
        <div v-if="currentRecord.attachments?.length" class="attachments-section">
          <h3>附件列表</h3>
          <div class="attachment-list">
            <div
                v-for="(file, index) in currentRecord.attachments"
                :key="index"
                class="attachment-item"
            >
              <span>{{ file.name }}</span>
              <el-button
                  type="primary"
                  link
                  @click="downloadFile(file)"
              >下载</el-button>
            </div>
          </div>
        </div>

        <!-- 审核历史 -->
        <div v-if="currentRecord.approvalHistory?.length" class="approval-section">
          <h3>审核历史</h3>
          <el-timeline>
            <el-timeline-item
                v-for="(history, index) in currentRecord.approvalHistory"
                :key="index"
                :type="history.result === '通过' ? 'success' : 'danger'"
                :timestamp="history.date"
            >
              <h4>{{ history.operator }}</h4>
              <p>审核结果：{{ history.result }}</p>
              <p>审核意见：{{ history.comment }}</p>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-dialog>

    <!-- 审核对话框 -->
    <el-dialog
        title="信息审核"
        v-model="approvalVisible"
        width="500px"
    >
      <el-form
          ref="approvalFormRef"
          :model="approvalForm"
          :rules="approvalRules"
          label-width="100px"
      >
        <el-form-item label="审核结果" prop="result">
          <el-radio-group v-model="approvalForm.result">
            <el-radio label="通过">通过</el-radio>
            <el-radio label="驳回">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核意见" prop="comment">
          <el-input
              v-model="approvalForm.comment"
              type="textarea"
              :rows="4"
              placeholder="请输入审核意见"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="approvalVisible = false">取消</el-button>
          <el-button type="primary" @click="submitApproval">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'

// 统计数据
const statistics = [
  {
    title: '总记录数',
    value: 256,
    icon: 'Document',
    color: '#409EFF'
  },
  {
    title: '本月更新',
    value: 45,
    icon: 'Refresh',
    color: '#67C23A'
  },
  {
    title: '待审核',
    value: 8,
    icon: 'Timer',
    color: '#E6A23C'
  },
  {
    title: '已驳回',
    value: 3,
    icon: 'CircleClose',
    color: '#F56C6C'
  }
]

// 表格数据
const tableData = ref([
  {
    id: 1,
    date: '2024-10-20',
    type: '产品信息',
    title: '5G网络切片产品更新说明',
    operator: '张工',
    category: '产品文档',
    status: '已审核',
    content: '本次更新包含以下内容：\n1. 优化网络切片配置流程\n2. 新增自动化部署功能\n3. 提升性能监控准确度',
    attachments: [
      { name: '产品说明书v2.1.pdf', size: '2.5MB' }
    ]
  },
  {
    id: 2,
    date: '2024-10-19',
    type: '技术文档',
    title: 'API接口文档更新',
    operator: '李工',
    category: '开发文档',
    status: '待审核',
    content: '更新了以下API接口文档：\n1. 用户认证接口\n2. 数据统计接口\n3. 配置管理接口',
    attachments: [
      { name: 'API文档v1.2.md', size: '856KB' },
      { name: '接口示例.json', size: '128KB' }
    ]
  }
])

// 表单数据
const formData = ref({
  type: '',
  title: '',
  category: '',
  content: '',
  attachments: []
})

// 表单规则
const formRules = {
  type: [{ required: true, message: '请选择信息类型', trigger: 'change' }],
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
}

// 审核表单数据
const approvalForm = ref({
  result: '通过',
  comment: ''
})

// 审核表单规则
const approvalRules = {
  result: [{ required: true, message: '请选择审核结果', trigger: 'change' }],
  comment: [{ required: true, message: '请输入审核意见', trigger: 'blur' }]
}

// 状态变量
const loading = ref(false)
const dialogVisible = ref(false)
const dialogType = ref('add')
const detailVisible = ref(false)
const approvalVisible = ref(false)
const currentRecord = ref(null)
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const formRef = ref(null)
const approvalFormRef = ref(null)

// 计算属性
const total = computed(() => tableData.value.length)
const filteredTableData = computed(() => {
  let data = tableData.value
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    data = data.filter(item =>
        item.title.toLowerCase().includes(keyword) ||
        item.operator.toLowerCase().includes(keyword) ||
        item.content.toLowerCase().includes(keyword)
    )
  }
  return data
})

// 选项数据
const typeOptions = [
  { label: '产品信息', value: '产品信息' },
  { label: '技术文档', value: '技术文档' },
  { label: '运维信息', value: '运维信息' },
  { label: '市场动态', value: '市场动态' }
]

const categoryOptions = [
  { label: '产品文档', value: '产品文档' },
  { label: '开发文档', value: '开发文档' },
  { label: '系统公告', value: '系统公告' },
  { label: '操作手册', value: '操作手册' }
]

// 方法
const getTypeTag = (type) => {
  const tagMap = {
    '产品信息': 'success',
    '技术文档': 'primary',
    '运维信息': 'warning',
    '市场动态': 'info'
  }
  return tagMap[type] || ''
}

const getCategoryTag = (category) => {
  const tagMap = {
    '产品文档': 'success',
    '开发文档': 'primary',
    '系统公告': 'warning',
    '操作手册': 'info'
  }
  return tagMap[category] || ''
}

const getStatusTag = (status) => {
  const tagMap = {
    '已审核': 'success',
    '待审核': 'warning',
    '已驳回': 'danger'
  }
  return tagMap[status] || ''
}

const handleAdd = () => {
  dialogType.value = 'add'
  formData.value = {
    type: '',
    title: '',
    category: '',
    content: '',
    attachments: []
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  formData.value = { ...row }
  dialogVisible.value = true
}

const handleView = (row) => {
  currentRecord.value = row
  detailVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
      '确认删除该记录吗？',
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

const handleApprove = (row) => {
  currentRecord.value = row
  approvalForm.value = {
    result: '通过',
    comment: ''
  }
  approvalVisible.value = true
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

const handleFileChange = (file, fileList) => {
  console.log(file, fileList)
}

const downloadFile = (file) => {
  ElMessage.success(`开始下载文件：${file.name}`)
}

const submitForm = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      const newRecord = {
        id: tableData.value.length + 1,
        date: new Date().toISOString().split('T')[0],
        operator: '当前用户',
        status: '待审核',
        ...formData.value
      }

      if (dialogType.value === 'add') {
        tableData.value.unshift(newRecord)
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

const submitApproval = async () => {
  if (!approvalFormRef.value) return

  await approvalFormRef.value.validate((valid) => {
    if (valid) {
      const targetRecord = tableData.value.find(item => item.id === currentRecord.value.id)
      if (targetRecord) {
        targetRecord.status = approvalForm.value.result === '通过' ? '已审核' : '已驳回'
        targetRecord.approvalHistory = targetRecord.approvalHistory || []
        targetRecord.approvalHistory.unshift({
          date: new Date().toLocaleString(),
          operator: '当前用户',
          result: approvalForm.value.result,
          comment: approvalForm.value.comment
        })
        ElMessage.success('审核提交成功')
        approvalVisible.value = false
      }
    }
  })
}
</script>

<style scoped>
.maintenance-container {
  padding: 20px;
}

.stat-card {
  margin-bottom: 20px;
}

.stat-icon {
  margin-bottom: 10px;
}

.stat-info {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-title {
  font-size: 14px;
  color: #909399;
}

.table-card {
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

.content-box {
  white-space: pre-wrap;
  line-height: 1.5;
}

.attachments-section,
.approval-section {
  margin-top: 30px;
}

.attachments-section h3,
.approval-section h3 {
  margin-bottom: 20px;
  font-weight: 500;
  color: #303133;
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

  .stat-title {
    color: #A3A6AD;
  }

  .attachments-section h3,
  .approval-section h3 {
    color: #E5EAF3;
  }

  .content-box {
    color: #E5EAF3;
  }
}
</style>