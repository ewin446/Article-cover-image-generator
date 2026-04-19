# GitHub → Vercel 部署说明（当前项目）

当前项目是 Next.js 15 项目，适合直接通过 GitHub 导入到 Vercel。

项目目录：
- `/home/ewine/workspace/auto-psi-clone`

GitHub 仓库：
- `https://github.com/ewin446/Article-cover-image-generator`

## 1. 先把代码推到 GitHub

当前本地已经完成：
- git init
- main 分支
- 初始 commit
- origin 已指向 GitHub 仓库

还差 GitHub 认证后执行：

```bash
cd /home/ewine/workspace/auto-psi-clone
git push -u origin main
```

如果还没认证，推荐两种方式：

### 方式 A：gh 登录
```bash
gh auth login
cd /home/ewine/workspace/auto-psi-clone
git push -u origin main
```

### 方式 B：PAT
```bash
git config --global credential.helper store
cd /home/ewine/workspace/auto-psi-clone
git push -u origin main
```

输入：
- Username: GitHub 用户名
- Password: GitHub Personal Access Token

## 2. 在 Vercel 导入 GitHub 仓库

打开：
- https://vercel.com/new

步骤：
1. 登录 Vercel
2. 连接 GitHub 账号
3. 选择仓库：`Article-cover-image-generator`
4. 点击 Import

## 3. Vercel 配置

当前项目建议：
- Framework Preset: Next.js
- Root Directory: `auto-psi-clone`（如果你上传的是整个 workspace 仓库才需要改；如果 GitHub 仓库内容就是项目本身，则留空）
- Build Command: `npm run build`
- Install Command: `npm install`
- Output Directory: 不填

Node 版本：
- 推荐 20+

## 4. 环境变量

当前这个文章封面图生成器前端版本不依赖必须的服务端密钥，通常可以直接部署。

如果后面你接第三方 API，再到 Vercel 的 Project Settings → Environment Variables 里添加。

## 5. 部署后验证

部署成功后检查：
- 首页是否正常打开
- 模板切换是否正常
- 批量方案是否正常生成
- PNG 导出是否正常

## 6. 自定义域名（可选）

在 Vercel 项目里：
- Settings → Domains
- 添加你的域名
- 按提示去 DNS 服务商配置解析

## 7. 如果你现在不想配置命令行认证

最简单做法：
1. 你自己把 `/home/ewine/workspace/auto-psi-clone` 上传到 GitHub 仓库
2. 再去 Vercel 导入这个仓库

## 8. 当前状态总结

- 项目已可构建
- 项目已可本地运行
- Git 远程仓库地址已配置
- 只差把代码 push 到 GitHub
