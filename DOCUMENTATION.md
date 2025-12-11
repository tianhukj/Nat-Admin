# 核酸检测管理系统 - 完整文档

## 📋 项目概述

核酸检测管理系统是一个专业的医疗数据管理平台，用于记录和管理核酸检测结果。系统提供了直观的用户界面和完整的数据管理功能，支持增删改查操作，帮助医疗机构高效管理检测数据。

### 核心特性
- 🔐 简洁的登录认证（用户名：admin，密码：123456）
- 📊 专业的表格界面，实时显示所有检测结果
- 🔍 强大的搜索功能，支持按姓名或身份证号快速查询
- ✏️ 完整的数据操作：新增、编辑、删除检测记录
- 📱 响应式设计，完美适配各种设备
- 🎨 现代化的UI设计，蓝色专业主题

---

## 🏗️ 系统架构

### 技术栈
- **前端框架**: Next.js 16 + React 19
- **样式方案**: Tailwind CSS v4
- **数据库**: Supabase (PostgreSQL)
- **认证方式**: Session 基础认证（sessionStorage）
- **UI 组件**: shadcn/ui

### 项目结构
\`\`\`
├── app/
│   ├── login/              # 登录页面
│   ├── dashboard/          # 仪表板（需要认证）
│   ├── api/
│   │   └── nucleic-acid/   # 核酸检测 API 接口
│   ├── globals.css         # 全局样式
│   ├── layout.tsx          # 根布局
│   └── page.tsx            # 首页重定向
├── components/
│   ├── login-form.tsx      # 登录表单组件
│   ├── auth-guard.tsx      # 认证守卫组件
│   ├── nucleic-acid-page.tsx   # 核酸检测主页面
│   ├── nucleic-acid-form.tsx   # 新增/编辑表单
│   └── nucleic-acid-table.tsx  # 数据表格
├── lib/
│   ├── supabase-client.ts  # 客户端 Supabase 配置
│   ├── supabase-server.ts  # 服务端 Supabase 配置
│   └── utils-date.ts       # 日期工具函数
├── types/
│   └── nucleic-acid.ts     # TypeScript 类型定义
└── scripts/
    └── create-nucleic-acid-table.sql  # 数据库初始化脚本
\`\`\`

---

## 🗄️ 数据库设计

### 表结构：nucleic_acid_results

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | 主键，自动递增 |
| name | VARCHAR(255) | 被检测人的姓名 |
| id_number | VARCHAR(18) | 身份证号（用于快速查询） |
| phone | VARCHAR(20) | 联系电话 |
| test_date | DATE | 检测日期 |
| test_time | TIME | 检测时间 |
| result | VARCHAR(20) | 检测结果（阴性/阳性/待检） |
| test_location | VARCHAR(255) | 检测地点 |
| sample_type | VARCHAR(50) | 样本类型（咽拭子/鼻拭子等） |
| remarks | TEXT | 备注信息 |
| created_at | TIMESTAMP | 创建时间（自动设置） |
| updated_at | TIMESTAMP | 更新时间（自动设置） |

### 索引优化
- `idx_id_number`: 身份证号索引，加速身份证号查询
- `idx_test_date`: 检测日期索引，加速按日期筛选
- `idx_result`: 检测结果索引，加速按结果类型筛选

### 行级安全 (RLS)
由于本系统不需要登录认证，已启用宽松的 RLS 策略允许所有操作。

---

## 🔌 后端 API 接口

### 基础信息
- **基础 URL**: `/api/nucleic-acid`
- **请求格式**: JSON
- **响应格式**: JSON

### 1. 获取所有检测记录

**端点**: `GET /api/nucleic-acid`

**请求参数**: 无

**响应示例**:
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "张三",
      "id_number": "110101199003011234",
      "phone": "13800138000",
      "test_date": "2024-12-10",
      "test_time": "09:30:00",
      "result": "阴性",
      "test_location": "社区卫生中心",
      "sample_type": "咽拭子",
      "remarks": "正常",
      "created_at": "2024-12-10T10:00:00.000Z",
      "updated_at": "2024-12-10T10:00:00.000Z"
    }
  ]
}
\`\`\`

**状态码**:
- `200`: 成功
- `500`: 服务器错误

---

### 2. 新增检测记录

**端点**: `POST /api/nucleic-acid`

**请求体**:
\`\`\`json
{
  "name": "李四",
  "id_number": "110101199103021234",
  "phone": "13800138001",
  "test_date": "2024-12-10",
  "test_time": "10:00:00",
  "result": "阴性",
  "test_location": "医院检验科",
  "sample_type": "鼻拭子",
  "remarks": "备注信息"
}
\`\`\`

**字段说明**:
- `name` (必填): 姓名，字符串，最长 255 字符
- `id_number` (必填): 身份证号，字符串，最长 18 字符
- `phone` (可选): 电话号码，字符串，最长 20 字符
- `test_date` (必填): 检测日期，格式 YYYY-MM-DD
- `test_time` (可选): 检测时间，格式 HH:MM:SS
- `result` (必填): 检测结果，枚举值：'阴性', '阳性', '待检'
- `test_location` (可选): 检测地点，字符串，最长 255 字符
- `sample_type` (可选): 样本类型，字符串，最长 50 字符
- `remarks` (可选): 备注，文本类型

**响应示例**:
\`\`\`json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "李四",
    "id_number": "110101199103021234",
    "created_at": "2024-12-10T11:00:00.000Z"
  }
}
\`\`\`

**状态码**:
- `201`: 创建成功
- `400`: 请求参数错误
- `500`: 服务器错误

---

### 3. 编辑检测记录

**端点**: `PUT /api/nucleic-acid/[id]`

**请求参数**:
- `id` (URL 参数): 记录 ID，必填

**请求体**:
\`\`\`json
{
  "name": "李四修改",
  "result": "阳性",
  "remarks": "更新的备注"
}
\`\`\`

**说明**: 只需传入要更新的字段，无需传入所有字段。

**响应示例**:
\`\`\`json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "李四修改",
    "result": "阳性",
    "updated_at": "2024-12-10T12:00:00.000Z"
  }
}
\`\`\`

**状态码**:
- `200`: 更新成功
- `404`: 记录不存在
- `400`: 请求参数错误
- `500`: 服务器错误

---

### 4. 删除检测记录

**端点**: `DELETE /api/nucleic-acid/[id]`

**请求参数**:
- `id` (URL 参数): 记录 ID，必填

**响应示例**:
\`\`\`json
{
  "success": true,
  "message": "记录已成功删除"
}
\`\`\`

**状态码**:
- `200`: 删除成功
- `404`: 记录不存在
- `500`: 服务器错误

---

## 🔐 认证机制

### 登录流程
1. 用户访问系统，自动重定向到 `/login` 页面
2. 输入用户名和密码
3. 系统验证凭证（用户名: admin，密码: 123456）
4. 验证成功后，将登录状态存储到 `sessionStorage`
5. 用户被重定向到 `/dashboard` 仪表板页面

### 会话管理
- 使用浏览器 `sessionStorage` 存储登录状态
- 会话在浏览器标签页关闭时自动清除
- 前端路由守卫确保未登录用户无法访问受保护页面

### 退出登录
- 点击导航栏"退出登录"按钮
- 清除 `sessionStorage` 中的认证信息
- 用户被重定向回登录页面

---

## 🎯 使用指南

### 登录
1. 打开应用，您将自动被重定向到登录页面
2. 输入用户名：**admin**
3. 输入密码：**123456**
4. 点击"登录"按钮

### 查看检测记录
- 登录成功后进入仪表板
- 顶部显示统计信息：总记录数、阴性数、阳性数、待检数
- 表格列出所有核酸检测记录

### 搜索记录
- 使用搜索框快速查询
- 支持按姓名或身份证号搜索
- 实时过滤搜索结果

### 新增记录
1. 点击"新增记录"按钮
2. 填写检测信息（必填字段用 * 标记）
3. 点击"保存"按钮
4. 表格自动刷新显示新记录

### 编辑记录
1. 在表格中点击需要编辑的记录的"编辑"按钮
2. 在弹出的表单中修改信息
3. 点击"保存"按钮
4. 表格自动更新显示修改后的数据

### 删除记录
1. 在表格中点击需要删除的记录的"删除"按钮
2. 确认删除操作
3. 记录将被从数据库中删除

---

## 🛠️ 开发指南

### 环境变量配置

在 `.env.local` 文件中配置以下环境变量：

\`\`\`env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

### 初始化数据库

1. 复制 `scripts/create-nucleic-acid-table.sql` 中的 SQL 语句
2. 在 Supabase SQL 编辑器中执行
3. 创建必要的表和索引

### 本地开发

\`\`\`bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 访问应用
# 打开浏览器访问 http://localhost:3000
\`\`\`

### 构建生产版本

\`\`\`bash
# 构建项目
pnpm build

# 启动生产服务器
pnpm start
\`\`\`

---

## 📊 API 调用示例

### JavaScript/TypeScript 客户端示例

#### 获取所有记录
\`\`\`javascript
const response = await fetch('/api/nucleic-acid');
const result = await response.json();
console.log(result.data);
\`\`\`

#### 新增记录
\`\`\`javascript
const newRecord = {
  name: '王五',
  id_number: '110101199205031234',
  phone: '13800138002',
  test_date: '2024-12-10',
  test_time: '14:00:00',
  result: '阴性',
  test_location: '医院检验科',
  sample_type: '咽拭子',
  remarks: '体检'
};

const response = await fetch('/api/nucleic-acid', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newRecord)
});
const result = await response.json();
console.log('新记录 ID:', result.data.id);
\`\`\`

#### 编辑记录
\`\`\`javascript
const updates = {
  result: '阳性',
  remarks: '复核阳性'
};

const response = await fetch('/api/nucleic-acid/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(updates)
});
const result = await response.json();
console.log('更新成功', result.data);
\`\`\`

#### 删除记录
\`\`\`javascript
const response = await fetch('/api/nucleic-acid/1', {
  method: 'DELETE'
});
const result = await response.json();
console.log(result.message);
\`\`\`

---

## 🚀 部署指南

### Vercel 部署

1. 将项目推送到 GitHub
2. 访问 [Vercel](https://vercel.com)
3. 导入 GitHub 仓库
4. 配置环境变量
5. 点击"Deploy"部署

### 自托管部署

1. 使用 `pnpm build` 构建项目
2. 配置服务器环境变量
3. 使用 `pnpm start` 启动应用
4. 配置反向代理（如 Nginx）
5. 配置 HTTPS 证书

---

## ❓ 常见问题

### Q: 忘记密码怎么办？
**A**: 由于这是一个演示系统，当前使用硬编码凭证。生产环境应集成真实的认证系统。

### Q: 如何备份数据？
**A**: 使用 Supabase 提供的备份功能，在 Supabase 仪表板中配置自动备份。

### Q: 表格加载缓慢？
**A**: 确保数据库索引正确建立，可以在大量数据时使用分页功能。

### Q: 如何添加更多用户？
**A**: 目前系统设计为单用户演示。如需多用户支持，需要集成 Supabase Auth 或其他认证服务。

---

## 📝 更新日志

### v1.0.0 (2024-12-10)
- ✅ 实现核酸检测记录的增删改查功能
- ✅ 添加登录认证功能
- ✅ 完成美观的表格界面设计
- ✅ 实现搜索和筛选功能
- ✅ 完整的 API 接口

---

## 📞 技术支持

如遇到问题，请：
1. 检查浏览器控制台错误信息
2. 确认环境变量配置正确
3. 验证数据库连接状态
4. 查看服务器日志

---

## 📄 许可证

本项目仅供学习和演示使用。

---

**最后更新**: 2024-12-10  
**维护者**: 项目开发团队
`
