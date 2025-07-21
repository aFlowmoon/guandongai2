# 社区智能体平台

## 项目概述
基于Coze风格设计的社区智能体集成平台，包含智能体管理、知识库和提示词模板功能。

## 功能特性
- 智能体管理（社区海报、财务审核等）
- 知识库系统
- 提示词模板库
- 用户账号系统

## 本地开发
```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 部署指南

### 1. 准备工作
- 注册Vercel/Netlify账号
- 确保拥有域名guandongai.com的管理权限

### 2. 部署步骤
1. 下载项目代码
```bash
git clone <项目仓库地址>
```

2. 选择托管服务：
- [Vercel部署指南](https://vercel.com/docs/deployments)
- [Netlify部署指南](https://docs.netlify.com/)

3. 上传项目到托管平台

4. 配置自定义域名：
- 在托管平台添加guandongai.com域名
- 按提示配置DNS解析

### 3. 环境变量
如需配置环境变量，在托管平台添加：
```
NODE_ENV=production
```

### 4. 构建与部署
平台会自动检测项目类型并完成构建部署

## 项目结构
├── src
│   ├── components # 公共组件
│   ├── pages      # 页面组件
│   ├── data       # 模拟数据
│   └── hooks      # 自定义Hook

## 技术支持
如有部署问题，请联系平台技术支持
