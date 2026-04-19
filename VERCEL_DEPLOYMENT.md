# Vercel 部署方案

这份说明对应你发的那个网站的同类做法。

## 1. 参考站点的方式

我分析后判断，参考站点大概率是：
- Next.js 前端
- Vercel 托管
- `/account`、商品数据、订单查询等通过后端 API / Serverless 获取
- 页面首屏先加载壳，再请求数据

也就是说，它不是单纯静态页，而是“Next.js + Vercel + 数据接口”的结构。

## 2. 你有两种部署路径

### 路径 A：最像参考站点

技术栈：
- Next.js
- Vercel
- 数据库：Supabase / Neon / Postgres
- 队列：Upstash Redis / QStash
- 文件存储：Cloudflare R2 / Vercel Blob / Supabase Storage

适合：
- 想复刻同款结构
- 需要真实支付 / 订单 / 自动发货
- 想要 `/account` 这种会员中心路由

### 路径 B：先用当前这个前端版本

技术栈：
- Vite + React
- Vercel 静态部署

适合：
- 先把页面上线
- 先验证视觉和文案
- 后端以后再接

## 3. 如果你要“跟参考站点一样”，推荐按下面做

### 项目结构

- `/` 首页
- `/account` 会员中心
- `/orders/[id]` 订单详情
- `/api/site` 获取站点配置
- `/api/products` 商品列表
- `/api/orders` 创建订单
- `/api/pay/alipay/notify` 支付宝回调
- `/api/deliver` 自动发货处理

### 页面行为

- 首页先渲染壳
- 客户端请求商品和站点信息
- 商品卡片展示库存、销量、价格
- 订单号和联系方式可查询订单
- 支付成功后进入回调流程
- 发货后更新订单状态

## 4. Vercel 上的部署步骤

1. 把代码放到 GitHub
2. 在 Vercel 导入仓库
3. 选择 Framework Preset：Next.js
4. 设置环境变量
5. 配置数据库连接
6. 部署
7. 配置自定义域名
8. 配支付宝回调地址

## 5. 环境变量建议

### 基础
- `NEXT_PUBLIC_SITE_NAME`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPPORT_GROUP`

### 数据库
- `DATABASE_URL`

### 支付
- `ALIPAY_APP_ID`
- `ALIPAY_PRIVATE_KEY_PEM`
- `ALIPAY_PUBLIC_KEY_PEM`
- `ALIPAY_NOTIFY_URL`
- `ALIPAY_RETURN_URL`

### 队列 / 缓存
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

### 文件存储
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET`

## 6. 你的当前前端如何直接上 Vercel

如果你先不做后端，可以直接把当前这个 Vite 项目部署到 Vercel：

- Build Command: `npm run build`
- Output Directory: `dist`
- Node Version: 18 或 20

这条路最快，但它只是前台，没有真实支付和自动发货能力。

## 7. 推荐路线

如果你要正式卖卡密/会员：
- 前台用 Next.js + Vercel
- 后端用 Serverless / 小 VPS
- 支付和自动发货不要只靠纯静态页

如果你只要先做展示页：
- 当前这个 Vite 版就能直接上 Vercel

## 8. 下一步

如果你要，我可以继续把当前这个页面：
- 改成 Next.js 版
- 加 `/account` 路由
- 加 Vercel 目录结构
- 让它能直接导入 Vercel 部署
