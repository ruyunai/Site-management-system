# 工地管理系统

基于 Next.js 14 + Supabase + 七牛云的工地管理 SaaS 平台。

## 功能模块

- **工资结算管理** - 工人工资录入、查询、结算、导出
- **物料管理** - 水泥、砂石料等物料记录
- **车辆管理** - 车队车辆信息管理
- **数据导出** - Excel 格式数据导出

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **数据库**: Supabase (PostgreSQL)
- **文件存储**: 七牛云（可选）
- **样式框架**: Tailwind CSS + Radix UI
- **部署平台**: Vercel

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/ruyunai/Site-management-system.git
cd Site-management-system
```

### 2. 配置环境变量

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，填入你的 Supabase 和七牛云凭证。详见 [环境变量配置清单](./环境变量配置清单.txt)

### 3. 安装依赖

```bash
npm install
```

### 4. 启动开发服务器

```bash
npm run dev
```

打开 http://localhost:3000 查看效果。

## 部署

### Supabase 数据库配置

1. 登录 [Supabase](https://supabase.com)
2. 创建新项目
3. 在 SQL Editor 中执行 `supabase/schema.sql` 文件

### Vercel 部署

1. 登录 [Vercel](https://vercel.com)
2. Import GitHub 仓库
3. 配置环境变量（参考 `.env.example`）
4. 点击 Deploy

## 项目结构

```
├── src/
│   ├── app/              # Next.js App Router 页面
│   ├── components/       # React 组件
│   ├── hooks/           # 自定义 Hooks
│   ├── lib/             # 工具函数
│   └── types/           # TypeScript 类型定义
├── supabase/
│   └── schema.sql       # 数据库 Schema
├── .env.example         # 环境变量模板
└── 环境变量配置清单.txt  # 环境变量配置说明
```

## 许可证

MIT License
