# 宝宝取名智能定制系统

一款智能的宝宝取名工具，支持24个常见姓氏，提供10,000+精选名字，包含古典文雅、简约现代、诗意文艺三种风格。

## ✨ 特性

- 🎯 支持24个常见姓氏（覆盖85%人口）
- 📚 10,000+精选名字库
- 🎨 三种名字风格：古典文雅、简约现代、诗意文艺
- 🎲 智能随机生成，每次生成都不同
- 📊 显示拼音、寓意、出处和五行属性
- 📱 响应式设计，支持手机和电脑

## 🚀 在线使用

本项目已部署到 Vercel，可以直接在线使用：
[宝宝取名智能定制系统](https://your-project.vercel.app)

## 📦 本地使用

### 方法一：直接打开

1. 下载项目文件
2. 双击 `宝宝取名智能定制系统.html` 即可使用

### 方法二：使用本地服务器

```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js
npx serve

# 访问 http://localhost:8000
```

## 🛠️ 技术栈

- 纯 HTML/CSS/JavaScript
- 无需后端服务
- 支持现代浏览器

## 📁 项目结构

```
baby-name-system/
├── 宝宝取名智能定制系统.html      # 主程序
├── name-database-manager.js      # 数据库管理器
├── data/                         # 名字数据
│   ├── boys/                     # 男孩名字（24个姓氏）
│   ├── girls/                    # 女孩名字（24个姓氏）
│   └── rotation_pools.json       # 轮询池配置
├── README.md                     # 项目说明
├── 使用说明.md                   # 使用指南
├── 部署到Vercel完整指南.md        # Vercel部署教程
└── Vercel部署指南.md             # 快速部署指南
```

## 📝 使用方法

1. 输入宝宝姓氏
2. 选择性别（男孩/女孩）
3. 选择名字风格
4. 选择生成数量（10/30/50个）
5. 点击"✨ 开始生成名字"

## 🎯 支持的姓氏

李、王、张、刘、陈、赵、杨、黄、吴、周、徐、孙、胡、朱、高、林、何、郭、马、罗、郑、梁、谢、宋

## 🌐 部署指南

### 部署到 Vercel（推荐）

#### 步骤1：推送到 GitHub

```bash
# 初始化 Git 仓库（如果还没有）
git init

# 添加所有必要文件
git add 宝宝取名智能定制系统.html
git add name-database-manager.js
git add data/
git add .gitignore
git add README.md

# 提交
git commit -m "feat: 初始化宝宝取名系统"

# 创建主分支
git branch -M main

# 添加远程仓库（请替换为你的仓库地址）
git remote add origin https://github.com/your-username/your-repo.git

# 推送到 GitHub
git push -u origin main
```

#### 步骤2：连接到 Vercel

1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 "New Project"
4. 选择你的 GitHub 仓库
5. 点击 "Deploy"

#### 步骤3：完成部署

- 等待部署完成（通常 1-2 分钟）
- 获得你的项目 URL（如：https://your-project.vercel.app）
- 点击 URL 访问你的网站

### 部署到其他平台

#### Netlify

1. 访问 [netlify.com](https://www.netlify.com)
2. 拖拽项目文件夹到上传区域
3. 等待部署完成

#### GitHub Pages

1. 进入你的 GitHub 仓库
2. 点击 "Settings" → "Pages"
3. 在 "Source" 下选择 "Deploy from a branch"
4. 选择 "main" 分支和 "/ (root)" 目录
5. 点击 "Save"
6. 等待部署完成

#### Cloudflare Pages

1. 访问 [pages.cloudflare.com](https://pages.cloudflare.com)
2. 点击 "Create a project"
3. 连接你的 GitHub 仓库
4. 点击 "Begin setup"
5. 等待部署完成

## 📊 数据文件说明

### data/boys/

包含24个男孩姓氏的 JSON 文件，每个文件约56KB：
- 李.json、王.json、张.json、刘.json、陈.json
- 杨.json、赵.json、黄.json、周.json、吴.json
- 徐.json、孙.json、胡.json、朱.json、高.json
- 林.json、何.json、郭.json、马.json、罗.json
- 梁.json、宋.json、郑.json、谢.json

### data/girls/

包含24个女孩姓氏的 JSON 文件，每个文件约39KB：
- 文件名与 boys/ 相同

### data/rotation_pools.json

轮询池配置文件，约2.2MB，用于确保每次生成都不相同。

## ⚙️ 配置说明

### .gitignore

已配置忽略以下文件：
- `*_backup*.html` - 备份文件
- `test_*.html` - 测试文件
- `debug_*.html` - 调试文件
- `simple_test.html` - 简单测试文件
- `*.py` - Python 脚本文件
- `photo-*.jpg` - 测试截图
- 快速部署到Vercel.sh - 部署脚本

## 🔧 故障排除

### 问题1：名字生成失败

**错误信息**：名字数据管理器未正确加载

**解决方法**：
1. 确认 `data/` 文件夹存在且包含所有 JSON 文件
2. 确认 `name-database-manager.js` 与 `data/` 文件夹在同一目录
3. 检查浏览器控制台是否有错误信息

### 问题2：生成的名字重复

**解决方法**：
- 系统已内置轮询机制，确保每次生成都不相同
- 如果仍有重复，请清除浏览器缓存后重试

### 问题3：部署后无法加载数据

**可能原因**：
- Vercel/Netlify 部署时未包含 `data/` 文件夹
- 路径配置错误

**解决方法**：
1. 确认 Git 仓库中包含完整的 `data/` 文件夹
2. 检查 `name-database-manager.js` 中的路径配置
3. 重新部署项目

## 📝 更新日志

### v1.0 (2026-03-22)

- ✅ 初始版本发布
- ✅ 支持24个常见姓氏
- ✅ 10,000+ 精选名字库
- ✅ 三种名字风格
- ✅ 智能随机生成
- ✅ 响应式设计

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📧 联系方式

如有问题，请提交 Issue 或：
- 提交 [GitHub Issue](https://github.com/your-username/your-repo/issues)

## 🌟 Star History

如果这个项目对你有帮助，请给一个 Star ⭐️

## 📚 相关文档

- [使用说明.md](./使用说明.md) - 详细使用指南
- [部署到Vercel完整指南.md](./部署到Vercel完整指南.md) - Vercel 部署详细教程
- [Vercel部署指南.md](./Vercel部署指南.md) - 快速部署指南
- [GitHub上传文件清单.md](./GitHub上传文件清单.md) - 文件上传清单

## 🎉 致谢

感谢所有为这个项目做出贡献的人！

---

**祝您找到满意的宝宝名字！** 🎉

---

## 📖 快速开始

```bash
# 克隆仓库
git clone https://github.com/your-username/your-repo.git

# 进入项目目录
cd your-repo

# 使用本地服务器
python -m http.server 8000

# 访问 http://localhost:8000
```

---

## 🔗 相关链接

- [Vercel 官网](https://vercel.com)
- [Netlify 官网](https://www.netlify.com)
- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages)
