import Mock from 'mockjs'

// 客户数据
Mock.mock('/api/customers', 'get', {
    'list|10-20': [{
        'id|+1': 1,
        'name': '@cname',
        'phone': /^1[3456789]\d{9}$/,
        'level|1': ['普通', 'VIP', '钻石'],
        'joinDate': '@date',
        'consumption|1000-100000': 1000
    }]
})

// 5G 业务数据
Mock.mock('/api/business-data', 'get', {
    'totalUsers|10000-50000': 10000,
    'monthlyIncrease|100-1000': 100,
    'serviceTypes|4': [{
        'name|+1': ['5G套餐', '5G专线', '5G专网', '边缘计算'],
        'value|100-1000': 100
    }]
})
