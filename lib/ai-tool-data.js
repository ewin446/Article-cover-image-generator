export const GENERATIONS_KEY = 'auto-psi-generations-v1'

export const money = (n) => `¥${Number(n).toFixed(2)}`

export const models = [
  { id: 'flux-pro', name: 'Flux Pro', quality: '写实', speed: '18s', accent: 'violet' },
  { id: 'midnight-v6', name: 'Midnight V6', quality: '电影感', speed: '22s', accent: 'pink' },
  { id: 'dreamline-xl', name: 'DreamLine XL', quality: '插画', speed: '14s', accent: 'sky' },
  { id: 'anime-spark', name: 'Anime Spark', quality: '二次元', speed: '12s', accent: 'mint' },
]

export const stylePresets = [
  { id: 'photoreal', name: '写实摄影', hint: '自然光、真实细节', accent: 'violet' },
  { id: 'cinematic', name: '电影海报', hint: '高反差、戏剧光影', accent: 'pink' },
  { id: 'anime', name: '动漫立绘', hint: '清透皮肤、线条干净', accent: 'sky' },
  { id: 'product', name: '电商产品图', hint: '纯净背景、打光完整', accent: 'amber' },
  { id: 'logo', name: 'Logo 概念', hint: '极简图形、品牌感', accent: 'indigo' },
  { id: 'fantasy', name: '奇幻概念', hint: '宏大场景、氛围强', accent: 'rose' },
]

export const aspectRatios = ['1:1', '4:5', '3:4', '16:9', '9:16']

const gradients = [
  'linear-gradient(135deg, #f8d5ff 0%, #d9e6ff 45%, #fff0d2 100%)',
  'linear-gradient(135deg, #ffd6e7 0%, #ffe8c7 50%, #e4d7ff 100%)',
  'linear-gradient(135deg, #cde9ff 0%, #f5d8ff 45%, #fff4c9 100%)',
  'linear-gradient(135deg, #d8fff0 0%, #e4e0ff 55%, #ffe0d6 100%)',
]

export const plans = [
  { id: 'starter', name: '体验版', price: 29, credits: 80, desc: '适合轻度做图与试用', badge: '新手首选' },
  { id: 'pro', name: '专业版', price: 99, credits: 400, desc: '适合日常高频生成', badge: '最受欢迎' },
  { id: 'studio', name: '工作室', price: 299, credits: 1600, desc: '适合团队与批量出图', badge: '团队协作' },
]

const seedGenerations = [
  {
    id: 'JOB_202604190001',
    title: '少女海报写真',
    prompt: '一位站在霓虹街头的短发女生，电影级灯光，浅景深，海报构图，超高细节',
    style: '电影海报',
    model: 'Midnight V6',
    ratio: '4:5',
    status: '已完成',
    createdAt: '2026-04-19 19:08',
    credits: 12,
    gradient: gradients[0],
  },
  {
    id: 'JOB_202604190002',
    title: '护肤品电商主图',
    prompt: '白色背景上的玻璃精华瓶，柔和棚拍光，水珠质感，电商广告风，高清',
    style: '电商产品图',
    model: 'Flux Pro',
    ratio: '1:1',
    status: '已完成',
    createdAt: '2026-04-19 19:15',
    credits: 8,
    gradient: gradients[1],
  },
  {
    id: 'JOB_202604190003',
    title: '二次元人物立绘',
    prompt: '银发少女，蓝色眼睛，白色风衣，站在风雪中，日系动画风，角色立绘',
    style: '动漫立绘',
    model: 'Anime Spark',
    ratio: '3:4',
    status: '处理中',
    createdAt: '2026-04-19 19:22',
    credits: 10,
    gradient: gradients[2],
  },
  {
    id: 'JOB_202604190004',
    title: '品牌 Logo 草案',
    prompt: '科技感 S 字母图标，极简几何，蓝紫渐变，适合 AI 产品品牌',
    style: 'Logo 概念',
    model: 'DreamLine XL',
    ratio: '1:1',
    status: '已完成',
    createdAt: '2026-04-19 19:40',
    credits: 6,
    gradient: gradients[3],
  },
]

export const getInitialGenerations = () => seedGenerations

export const findGeneration = (items, term) => {
  const q = String(term ?? '').trim().toLowerCase()
  if (!q) return null
  return items.find((item) =>
    item.id.toLowerCase().includes(q) ||
    item.title.toLowerCase().includes(q) ||
    item.prompt.toLowerCase().includes(q) ||
    item.model.toLowerCase().includes(q) ||
    item.style.toLowerCase().includes(q)
  ) || null
}

export const summarizeUsage = (items) => ({
  total: items.length,
  finished: items.filter((item) => item.status === '已完成').length,
  credits: items.reduce((sum, item) => sum + Number(item.credits || 0), 0),
  favoriteStyle: items.reduce((acc, item) => {
    acc[item.style] = (acc[item.style] || 0) + 1
    return acc
  }, {}),
})

export const createMockGeneration = ({ prompt, style, model, ratio }) => {
  const stamp = new Date()
  const pad = (v) => String(v).padStart(2, '0')
  const id = `JOB_${stamp.getFullYear()}${pad(stamp.getMonth() + 1)}${pad(stamp.getDate())}${pad(stamp.getHours())}${pad(stamp.getMinutes())}${pad(stamp.getSeconds())}`
  return {
    id,
    title: prompt.slice(0, 18) || '未命名创作',
    prompt,
    style,
    model,
    ratio,
    status: '处理中',
    createdAt: stamp.toLocaleString('zh-CN', { hour12: false }),
    credits: ratio === '9:16' || ratio === '16:9' ? 12 : 8,
    gradient: gradients[Math.floor(Math.random() * gradients.length)],
  }
}
