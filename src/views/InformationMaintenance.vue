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

// 生成文档测试数据的函数
const generateDocData = (count) => {
  const operators = [
    '张工', '李工', '王工', '赵工', '陈工', '刘工', '周工', '吴工', '郑工', '孙工',
    '黄工', '朱工', '钱工', '林工', '徐工', '胡工', '马工', '曾工', '梁工', '杨工'
  ]

  const types = [
    '产品信息', '技术文档', '操作手册', '培训资料', '方案设计',
    '测试报告', '运维手册', '故障处理', '版本说明', '集成指南'
  ]

  const categories = [
    '产品文档', '开发文档', '运维文档', '培训文档', '技术方案',
    '测试文档', '用户手册', '规范标准', '研发文档', '集成文档'
  ]

  const titles = [
    '5G网络切片产品更新说明',
    'API接口文档更新',
    '网络管理系统操作指南',
    '边缘计算平台部署手册',
    '5G专网解决方案设计',
    '网络性能测试报告',
    '故障诊断与处理手册',
    '安全防护白皮书',
    '系统架构设计说明',
    '运维流程规范',
    '智慧园区解决方案',
    '物联网平台使用指南',
    '网络优化分析报告',
    '业务开通流程手册',
    '系统升级指导书',
    '性能调优方案',
    '安全加固指南',
    '容器化部署文档',
    '监控平台使用手册',
    '数据迁移方案',
    '高可用性设计方案',
    '负载均衡配置指南',
    '网络拓扑设计',
    '测试用例集',
    'DevOps实施手册',
    '微服务架构说明',
    '数据备份方案',
    '应急响应预案',
    '版本发布说明',
    '集成测试报告'
  ]

  const contents = [
    '本次更新包含以下内容：\n1. 优化网络切片配置流程\n2. 新增自动化部署功能\n3. 提升性能监控准确度',
    '更新了以下API接口文档：\n1. 用户认证接口\n2. 数据统计接口\n3. 配置管理接口',
    '本文档主要包含：\n1. 系统架构说明\n2. 部署步骤详解\n3. 常见问题解答',
    '更新要点：\n1. 新增功能说明\n2. 优化操作流程\n3. 修复已知问题',
    '主要内容：\n1. 方案概述\n2. 技术架构\n3. 实施步骤\n4. 注意事项',
    '测试结果：\n1. 性能测试数据\n2. 压力测试报告\n3. 优化建议',
    '文档更新：\n1. 完善故障处理流程\n2. 新增常见问题解答\n3. 更新故障案例',
    '重要说明：\n1. 安全策略更新\n2. 访问控制规则\n3. 日志审计要求',
    '设计要点：\n1. 系统架构图\n2. 模块说明\n3. 接口定义\n4. 数据流程',
    '规范要求：\n1. 运维流程\n2. 质量标准\n3. 验收规范'
  ]

  const attachmentTypes = [
    { ext: 'pdf', size: ['2.1MB', '3.5MB', '4.2MB', '1.8MB', '5.3MB'] },
    { ext: 'md', size: ['856KB', '920KB', '750KB', '1.2MB', '680KB'] },
    { ext: 'docx', size: ['1.5MB', '2.2MB', '3.1MB', '1.9MB', '2.8MB'] },
    { ext: 'pptx', size: ['3.8MB', '4.5MB', '2.9MB', '5.1MB', '3.3MB'] },
    { ext: 'xlsx', size: ['1.1MB', '1.8MB', '2.3MB', '950KB', '1.6MB'] }
  ]

  return Array.from({ length: count }, (_, index) => {
    const type = types[Math.floor(Math.random() * types.length)]
    const title = titles[Math.floor(Math.random() * titles.length)]
    const attachmentCount = Math.floor(Math.random() * 3) + 1 // 1-3个附件
    const attachmentList = []

    // 生成附件
    for(let i = 0; i < attachmentCount; i++) {
      const attType = attachmentTypes[Math.floor(Math.random() * attachmentTypes.length)]
      attachmentList.push({
        name: `${title.substring(0, 10)}_v${Math.floor(Math.random() * 5) + 1}.${attType.ext}`,
        size: attType.size[Math.floor(Math.random() * attType.size.length)]
      })
    }

    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))

    return {
      id: index + 3,
      date: date.toISOString().split('T')[0],
      type: type,
      title: title,
      operator: operators[Math.floor(Math.random() * operators.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      status: Math.random() > 0.3 ? '已审核' : '待审核',
      content: contents[Math.floor(Math.random() * contents.length)],
      attachments: attachmentList
    }
  })
}

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
  },
  ...generateDocData(254) // 生成98条新数据，总共100条
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

// 计算属性
const filteredData = computed(() => {
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

// 计算分页后的数据
const filteredTableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredData.value.slice(start, end)
})

// 计算总条数
const total = computed(() => filteredData.value.length)

// 方法
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
          if (filteredTableData.value.length === 0 && currentPage.value > 1) {
            currentPage.value--
          }
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
        currentPage.value = 1
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

// 标签类型方法
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

.header-right {
  display: flex;
  align-items: center;
}

.content-box {
  white-space: pre-wrap;
  line-height: 1.5;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin: 15px 0;
}

.meta-info {
  display: flex;
  gap: 20px;
  color: #606266;
  margin: 10px 0;
}

.attachments-section,
.approval-section {
  margin-top: 30px;
  border-top: 1px solid #ebeef5;
  padding-top: 20px;
}

.attachments-section h3,
.approval-section h3 {
  margin-bottom: 20px;
  font-weight: 500;
  color: #303133;
  font-size: 16px;
}

.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.attachment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.attachment-item span {
  color: #606266;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.detail-content {
  padding: 0 20px;
}

.detail-content h3 {
  margin: 0 0 15px 0;
  font-size: 18px;
  font-weight: 500;
  color: #303133;
}

/* 表格内容样式优化 */
:deep(.el-table) {
  --el-table-header-bg-color: #f5f7fa;
}

:deep(.el-table th) {
  font-weight: 600;
}

:deep(.el-table td) {
  padding: 8px 0;
}

/* 表单样式优化 */
:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-upload__tip) {
  line-height: 1.5;
  margin-top: 5px;
  color: #909399;
}

/* 时间线样式优化 */
:deep(.el-timeline-item__content h4) {
  margin: 0;
  font-size: 14px;
  line-height: 1.8;
}

:deep(.el-timeline-item__content p) {
  margin: 5px 0;
  color: #606266;
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

  .content-box {
    background-color: #2b2b2b;
    color: #E5EAF3;
  }

  .attachment-item {
    background-color: #2b2b2b;
  }

  .attachment-item span {
    color: #E5EAF3;
  }

  .meta-info {
    color: #A3A6AD;
  }

  .attachments-section,
  .approval-section {
    border-top-color: #363637;
  }

  .attachments-section h3,
  .approval-section h3,
  .detail-content h3 {
    color: #E5EAF3;
  }

  :deep(.el-table) {
    --el-table-header-bg-color: #2b2b2b;
  }

  :deep(.el-timeline-item__content p) {
    color: #A3A6AD;
  }
}

/* 响应式布局适配 */
@media screen and (max-width: 768px) {
  .card-header {
    flex-direction: column;
    gap: 10px;
  }

  .header-right {
    width: 100%;
  }

  .el-input {
    width: 100% !important;
    margin-right: 0 !important;
    margin-bottom: 10px;
  }

  .el-button {
    width: 100%;
  }

  .meta-info {
    flex-direction: column;
    gap: 10px;
  }

  .attachment-item {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
}

/* 打印样式优化 */
@media print {
  .maintenance-container {
    padding: 0;
  }

  .el-card {
    box-shadow: none !important;
    border: none !important;
  }

  .header-right,
  .pagination-container,
  .el-button {
    display: none !important;
  }

  .content-box {
    background: none;
    padding: 0;
  }

  .attachment-item {
    background: none;
    border-bottom: 1px solid #ebeef5;
  }
}
</style>