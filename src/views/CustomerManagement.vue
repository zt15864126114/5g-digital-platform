<template>
  <div class="customer-container">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="客户名称">
          <el-input v-model="searchForm.name" placeholder="请输入客户名称/公司名称" clearable />
        </el-form-item>
        <el-form-item label="客户等级">
          <el-select v-model="searchForm.level" placeholder="请选择客户等级" clearable>
            <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属行业">
          <el-select v-model="searchForm.industry" placeholder="请选择行业" clearable>
            <el-option v-for="item in industryOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="加入日期">
          <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>搜索
          </el-button>
          <el-button @click="resetSearch">
            <el-icon><Refresh /></el-icon>重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 客户列表 -->
    <el-card class="list-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span class="title">客户列表</span>
            <el-tag type="info" class="count-tag">共 {{ total }} 条</el-tag>
          </div>
          <div class="header-right">
            <el-button type="success" @click="exportData">
              <el-icon><Download /></el-icon>导出数据
            </el-button>
            <el-button type="primary" @click="handleAdd">
              <el-icon><Plus /></el-icon>添加客户
            </el-button>
          </div>
        </div>
      </template>

      <el-table
          v-loading="loading"
          :data="pagedCustomers"
          style="width: 100%"
          border
          stripe
          @sort-change="handleSortChange"
      >
        <el-table-column prop="id" label="ID" width="80" sortable="custom" />
        <el-table-column prop="name" label="客户名称" min-width="100" />
        <el-table-column prop="company" label="公司名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="industry" label="所属行业" min-width="120" />
        <el-table-column prop="level" label="客户等级" width="100">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="consumption" label="消费金额" width="150" sortable="custom">
          <template #default="{ row }">
            <span class="amount">¥{{ row.consumption.toLocaleString() }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联系电话" width="120" />
        <el-table-column prop="email" label="电子邮箱" min-width="180" show-overflow-tooltip />
        <el-table-column prop="address" label="公司地址" min-width="200" show-overflow-tooltip />
        <el-table-column prop="joinDate" label="加入日期" width="120" sortable="custom" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="filteredCustomers.length"
            :page-sizes="[10, 20, 30, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑客户对话框 -->
    <el-dialog
        :title="dialogType === 'add' ? '添加客户' : '编辑客户'"
        v-model="dialogVisible"
        width="650px"
    >
      <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户名称" prop="name">
              <el-input v-model="formData.name" placeholder="请输入客户名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="formData.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户等级" prop="level">
              <el-select v-model="formData.level" placeholder="请选择客户等级" style="width: 100%">
                <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属行业" prop="industry">
              <el-select v-model="formData.industry" placeholder="请选择行业" style="width: 100%">
                <el-option v-for="item in industryOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="公司名称" prop="company">
          <el-input v-model="formData.company" placeholder="请输入公司名称" />
        </el-form-item>

        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入电子邮箱" />
        </el-form-item>

        <el-form-item label="公司地址" prop="address">
          <el-input v-model="formData.address" placeholder="请输入公司地址" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="加入日期" prop="joinDate">
              <el-date-picker
                  v-model="formData.joinDate"
                  type="date"
                  placeholder="请选择加入日期"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="消费金额" prop="consumption">
              <el-input-number
                  v-model="formData.consumption"
                  :min="0"
                  :step="10000"
                  :precision="0"
                  style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
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
import { ref, computed, reactive, onMounted } from 'vue'
import { Plus, Search, Refresh, Download } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'



// 客户等级选项
const levelOptions = [
  { value: '战略合作', label: '战略合作' },
  { value: '钻石', label: '钻石' },
  { value: 'VIP', label: 'VIP' },
  { value: '普通', label: '普通' }
]

// 行业选项
const industryOptions = [
  { value: '通信设备', label: '通信设备' },
  { value: 'IT服务', label: 'IT服务' },
  { value: '软件开发', label: '软件开发' },
  { value: '云服务', label: '云服务' },
  { value: '数字科技', label: '数字科技' },
  { value: '智能制造', label: '智能制造' },
  { value: '医疗科技', label: '医疗科技' },
  { value: '物流运输', label: '物流运输' },
  { value: '教育科技', label: '教育科技' },
  { value: '新能源', label: '新能源' },
  { value: '半导体', label: '半导体' },
  { value: '工业自动化', label: '工业自动化' },
  { value: '海洋科技', label: '海洋科技' },
  { value: '智能家居', label: '智能家居' },
  { value: '工程机械', label: '工程机械' }
]

// 模拟客户数据
// 模拟客户数据
const customersData = ref([
  {
    id: 1,
    name: '张志远',
    company: '深圳市未来通信技术有限公司',
    phone: '13812345678',
    level: '战略合作',
    joinDate: '2023-01-15',
    consumption: 2580000,
    industry: '通信设备',
    address: '深圳市南山区科技园南区T3栋12层',
    email: 'zhangzy@future-tech.com'
  },
  {
    id: 2,
    name: '李明',
    company: '上海智慧网络科技股份有限公司',
    phone: '13987654321',
    level: '钻石',
    joinDate: '2023-02-22',
    consumption: 1680000,
    industry: 'IT服务',
    address: '上海市浦东新区张江高科技园区科苑路88号',
    email: 'liming@smart-net.com'
  },
  {
    id: 3,
    name: '王海峰',
    company: '北京创新数字科技有限公司',
    phone: '13567891234',
    level: 'VIP',
    joinDate: '2023-03-10',
    consumption: 980000,
    industry: '软件开发',
    address: '北京市海淀区中关村软件园二期西扩工程A座',
    email: 'wanghf@innov-tech.cn'
  },
  {
    id: 4,
    name: '赵婷',
    company: '广州市云计算服务有限公司',
    phone: '13789012345',
    level: '钻石',
    joinDate: '2023-04-05',
    consumption: 1450000,
    industry: '云服务',
    address: '广州市天河区珠江新城华夏路10号',
    email: 'zhaoting@cloud-service.com'
  },
  {
    id: 5,
    name: '陈建国',
    company: '杭州数字科技集团',
    phone: '13678901234',
    level: '战略合作',
    joinDate: '2023-05-18',
    consumption: 3200000,
    industry: '数字科技',
    address: '杭州市滨江区网商路699号',
    email: 'chenjg@digital-group.com'
  },
  {
    id: 6,
    name: '周鑫',
    company: '武汉智能制造技术有限公司',
    phone: '13901234567',
    level: 'VIP',
    joinDate: '2023-06-20',
    consumption: 860000,
    industry: '智能制造',
    address: '武汉市东湖新技术开发区光谷大道77号',
    email: 'zhouxin@smart-mfg.com'
  },
  {
    id: 7,
    name: '吴芳',
    company: '成都医疗科技股份有限公司',
    phone: '13512345678',
    level: '普通',
    joinDate: '2023-07-08',
    consumption: 420000,
    industry: '医疗科技',
    address: '成都市高新区天府大道中段666号',
    email: 'wufang@med-tech.com'
  },
  {
    id: 8,
    name: '刘德华',
    company: '天津港口物流有限公司',
    phone: '13698765432',
    level: 'VIP',
    joinDate: '2023-08-12',
    consumption: 920000,
    industry: '物流运输',
    address: '天津市滨海新区港口大道168号',
    email: 'liudh@port-logistics.com'
  },
  {
    id: 9,
    name: '郑晓明',
    company: '南京智慧教育科技有限公司',
    phone: '13812349876',
    level: '普通',
    joinDate: '2023-09-25',
    consumption: 380000,
    industry: '教育科技',
    address: '南京市江宁区文教路123号',
    email: 'zhengxm@edu-tech.com'
  },
  {
    id: 10,
    name: '黄志伟',
    company: '重庆新能源技术有限公司',
    phone: '13923456789',
    level: 'VIP',
    joinDate: '2023-10-15',
    consumption: 780000,
    industry: '新能源',
    address: '重庆市渝北区创新路58号',
    email: 'huangzw@new-energy.com'
  },
  {
    id: 11,
    name: '杨光',
    company: '西安半导体科技有限公司',
    phone: '13845678901',
    level: '战略合作',
    joinDate: '2023-11-08',
    consumption: 2800000,
    industry: '半导体',
    address: '西安市高新区科技路366号',
    email: 'yangguang@semi-tech.com'
  },
  {
    id: 12,
    name: '马云飞',
    company: '苏州工业自动化设备有限公司',
    phone: '13756789012',
    level: '钻石',
    joinDate: '2023-12-01',
    consumption: 1680000,
    industry: '工业自动化',
    address: '苏州市工业园区自动化大道88号',
    email: 'mayf@auto-equip.com'
  },
  {
    id: 13,
    name: '林晓婷',
    company: '厦门海洋科技研究院',
    phone: '13634567890',
    level: '普通',
    joinDate: '2024-01-05',
    consumption: 320000,
    industry: '海洋科技',
    address: '厦门市海沧区海洋大道199号',
    email: 'linxt@ocean-tech.org'
  },
  {
    id: 14,
    name: '朱建平',
    company: '青岛智能家居科技有限公司',
    phone: '13723456789',
    level: 'VIP',
    joinDate: '2024-01-18',
    consumption: 890000,
    industry: '智能家居',
    address: '青岛市崂山区科技园路789号',
    email: 'zhujp@smart-home.com'
  },
  {
    id: 15,
    name: '沈丽',
    company: '长沙工程机械股份有限公司',
    phone: '13889012345',
    level: '战略合作',
    joinDate: '2024-02-01',
    consumption: 4200000,
    industry: '工程机械',
    address: '长沙市星沙工业园机械大道1号',
    email: 'shenli@engineering.com'
  },
  {
    id: 16,
    name: '韩雪',
    company: '大连海洋渔业集团',
    phone: '13567890123',
    level: 'VIP',
    joinDate: '2024-02-15',
    consumption: 960000,
    industry: '海洋科技',
    address: '大连市沙河口区星海广场A座',
    email: 'hanxue@ocean-group.com'
  },
  {
    id: 17,
    name: '方明',
    company: '济南智能装备制造有限公司',
    phone: '13789012345',
    level: '钻石',
    joinDate: '2024-02-28',
    consumption: 1890000,
    industry: '智能制造',
    address: '济南市高新区装备制造园区23号',
    email: 'fangming@smart-equip.com'
  },
  {
    id: 18,
    name: '张玉',
    company: '合肥新型显示技术有限公司',
    phone: '13678901234',
    level: '战略合作',
    joinDate: '2024-03-05',
    consumption: 2560000,
    industry: '半导体',
    address: '合肥市新站区显示产业园B区',
    email: 'zhangyu@display-tech.com'
  },
  {
    id: 19,
    name: '李强',
    company: '福州智慧城市科技有限公司',
    phone: '13890123456',
    level: 'VIP',
    joinDate: '2024-03-12',
    consumption: 720000,
    industry: '数字科技',
    address: '福州市鼓楼区软件大道89号',
    email: 'liqiang@smart-city.com'
  },
  {
    id: 20,
    name: '王萍',
    company: '郑州绿色能源科技有限公司',
    phone: '13901234567',
    level: '普通',
    joinDate: '2024-03-20',
    consumption: 450000,
    industry: '新能源',
    address: '郑州市金水区科技园路100号',
    email: 'wangping@green-energy.com'
  }
])

// 搜索表单
const searchForm = reactive({
  name: '',
  level: '',
  industry: '',
  dateRange: []
})

// 表单数据和规则
const formData = reactive({
  id: '',
  name: '',
  company: '',
  phone: '',
  level: '',
  industry: '',
  joinDate: '',
  consumption: 0,
  email: '',
  address: ''
})

const formRules = {
  name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
  company: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  level: [{ required: true, message: '请选择客户等级', trigger: 'change' }],
  industry: [{ required: true, message: '请选择所属行业', trigger: 'change' }],
  joinDate: [{ required: true, message: '请选择加入日期', trigger: 'change' }],
  consumption: [{ required: true, message: '请输入消费金额', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入电子邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  address: [{ required: true, message: '请输入公司地址', trigger: 'blur' }]
}

// 状态变量
const loading = ref(false)
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)
const sortBy = ref({ prop: '', order: '' })

// 过滤后的客户数据
const filteredCustomers = computed(() => {
  let result = [...customersData.value]

  // 按名称或公司名搜索
  if (searchForm.name) {
    const keyword = searchForm.name.toLowerCase()
    result = result.filter(item =>
        item.name.toLowerCase().includes(keyword) ||
        item.company.toLowerCase().includes(keyword)
    )
  }

  // 按等级筛选
  if (searchForm.level) {
    result = result.filter(item => item.level === searchForm.level)
  }

  // 按行业筛选
  if (searchForm.industry) {
    result = result.filter(item => item.industry === searchForm.industry)
  }

  // 按日期范围筛选
  if (searchForm.dateRange && searchForm.dateRange.length === 2) {
    const [start, end] = searchForm.dateRange
    result = result.filter(item =>
        item.joinDate >= start && item.joinDate <= end
    )
  }

  // 排序
  if (sortBy.value.prop && sortBy.value.order) {
    const { prop, order } = sortBy.value
    result.sort((a, b) => {
      if (order === 'ascending') {
        return a[prop] > b[prop] ? 1 : -1
      } else {
        return a[prop] < b[prop] ? 1 : -1
      }
    })
  }

  return result
})

// 分页后的数据
const pagedCustomers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredCustomers.value.slice(start, end)
})

// 总数
const total = computed(() => filteredCustomers.value.length)

// 获取客户等级对应的标签类型
const getLevelType = (level) => {
  const types = {
    '战略合作': 'success',
    '钻石': 'danger',
    'VIP': 'warning',
    '普通': 'info'
  }
  return types[level] || 'info'
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
}

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  searchForm.level = ''
  searchForm.industry = ''
  searchForm.dateRange = []
  currentPage.value = 1
  sortBy.value = { prop: '', order: '' }
}

// 处理排序
const handleSortChange = ({ prop, order }) => {
  sortBy.value = { prop, order }
}

// 处理添加客户
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  formRef.value?.resetFields()
  Object.assign(formData, {
    id: '',
    name: '',
    company: '',
    phone: '',
    level: '',
    industry: '',
    joinDate: '',
    consumption: 0,
    email: '',
    address: ''
  })
}

// 处理编辑客户
const handleEdit = (row) => {
  dialogType.value = 'edit'
  dialogVisible.value = true
  Object.assign(formData, row)
}

// 处理删除客户
const handleDelete = (row) => {
  ElMessageBox.confirm(
      `确定要删除客户 ${row.name} 吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        const index = customersData.value.findIndex(item => item.id === row.id)
        if (index > -1) {
          customersData.value.splice(index, 1)
          ElMessage.success('删除成功')
        }
      })
      .catch(() => {
        ElMessage.info('已取消删除')
      })
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      if (dialogType.value === 'add') {
        // 添加新客户
        const newCustomer = {
          ...formData,
          id: Math.max(...customersData.value.map(item => item.id)) + 1
        }
        customersData.value.push(newCustomer)
        ElMessage.success('添加成功')
      } else {
        // 更新客户信息
        const index = customersData.value.findIndex(item => item.id === formData.id)
        if (index > -1) {
          customersData.value[index] = { ...formData }
          ElMessage.success('更新成功')
        }
      }
      dialogVisible.value = false
    }
  })
}

// 导出数据
const exportData = () => {
  const data = filteredCustomers.value.map(item => ({
    ID: item.id,
    客户名称: item.name,
    公司名称: item.company,
    所属行业: item.industry,
    客户等级: item.level,
    消费金额: item.consumption,
    联系电话: item.phone,
    电子邮箱: item.email,
    公司地址: item.address,
    加入日期: item.joinDate
  }))

  // 创建CSV内容
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
  ].join('\n')

  // 创建下载链接
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `客户数据_${new Date().toLocaleDateString()}.csv`
  link.click()
}

// 处理分页
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

onMounted(() => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.customer-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
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

.count-tag {
  font-size: 12px;
}

.header-right {
  display: flex;
  gap: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.amount {
  font-family: Monaco, monospace;
  color: #67C23A;
}

:deep(.el-table) {
  margin-top: 20px;
}

:deep(.el-tag) {
  border-radius: 4px;
}

.el-button + .el-button {
  margin-left: 10px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input-number .el-input__inner) {
  text-align: left;
}

/* 暗色主题适配 */
:deep(.dark) {
  .el-card {
    background: #1d1e1f;
    border: 1px solid #363637;
  }

  .el-table {
    background-color: #1d1e1f;
    color: #e5eaf3;
  }

  .el-table th,
  .el-table tr {
    background-color: #1d1e1f;
  }

  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background-color: #2c2c2c;
  }

  .amount {
    color: #85ce61;
  }
}
</style>