export const COVER_DRAFT_KEY = 'x-cover-draft-v1'
export const COVER_EXPORTS_KEY = 'x-cover-exports-v1'

export const palettePresets = [
  { id: 'mint-glacier', name: '薄荷冰川', bg: '#e8fff8', panel: '#f4fffb', text: '#10211f', muted: '#516963', accent: '#14b89a', accentSoft: '#b8f0e3', watermark: '#ccefe7' },
  { id: 'polar-blue', name: '极地霜蓝', bg: '#edf6ff', panel: '#f6fbff', text: '#12243b', muted: '#617089', accent: '#4b82ff', accentSoft: '#d9e6ff', watermark: '#d9e8fb' },
  { id: 'plum-rose', name: '梅子玫瑰', bg: '#fff1f6', panel: '#fff7fa', text: '#351926', muted: '#7a5564', accent: '#d94b8a', accentSoft: '#ffd3e4', watermark: '#f4dbe7' },
  { id: 'midnight-navy', name: '极夜藏青', bg: '#0f1830', panel: '#15203d', text: '#eef3ff', muted: '#a9b8d8', accent: '#7ea6ff', accentSoft: '#22345f', watermark: '#1d2a50' },
  { id: 'burgundy', name: '勃艮第酒红', bg: '#241116', panel: '#31181f', text: '#fff2f5', muted: '#d8afb8', accent: '#ff6e8a', accentSoft: '#4a2028', watermark: '#4a1f28' },
  { id: 'ink-green', name: '墨绿经典', bg: '#10201d', panel: '#152d29', text: '#effcf8', muted: '#afcdc5', accent: '#46d6a9', accentSoft: '#20403a', watermark: '#1f4038' },
  { id: 'ceramic-clay', name: '陶土赤陶', bg: '#fff4ef', panel: '#fffaf7', text: '#34231d', muted: '#81685f', accent: '#d56f45', accentSoft: '#ffd8c9', watermark: '#efd7cd' },
  { id: 'copper-gray', name: '紫铜暖灰', bg: '#f4efee', panel: '#faf7f6', text: '#302727', muted: '#7d7270', accent: '#a86c62', accentSoft: '#ead5d0', watermark: '#e4d8d5' },
  { id: 'aurora-violet', name: '极光紫雾', bg: '#f3edff', panel: '#faf7ff', text: '#261d42', muted: '#786d97', accent: '#8f62ff', accentSoft: '#e1d4ff', watermark: '#e7defa' },
  { id: 'sunrise-amber', name: '日出琥珀', bg: '#fff6e8', panel: '#fffaf1', text: '#34250b', muted: '#8f7b56', accent: '#f0a11f', accentSoft: '#ffe5b6', watermark: '#f3e3c2' },
  { id: 'graphite', name: '石墨深灰', bg: '#16181d', panel: '#20242b', text: '#f5f7fb', muted: '#afb6c5', accent: '#9aa7ff', accentSoft: '#2b3240', watermark: '#2a2f38' },
  { id: 'teal-wave', name: '深海靛蓝', bg: '#0f2430', panel: '#143342', text: '#f0fbff', muted: '#a7cad9', accent: '#43c7e7', accentSoft: '#20495b', watermark: '#1e4453' },
  { id: 'sand-beige', name: '沙丘米杏', bg: '#f8f2e9', panel: '#fcf8f2', text: '#2d2417', muted: '#86785c', accent: '#c59a45', accentSoft: '#efdfc0', watermark: '#ebe0cf' },
  { id: 'forest-lime', name: '雨林青柠', bg: '#eff9ed', panel: '#f8fdf6', text: '#17301c', muted: '#648167', accent: '#62c455', accentSoft: '#d7f0d2', watermark: '#dfeedd' },
  { id: 'peach-fuzz', name: '蜜桃晨雾', bg: '#fff0ea', panel: '#fff8f5', text: '#351f18', muted: '#89665c', accent: '#ff916f', accentSoft: '#ffdaca', watermark: '#f4ddd5' },
  { id: 'royal-indigo', name: '皇家靛紫', bg: '#181634', panel: '#242047', text: '#f4f2ff', muted: '#bab3df', accent: '#8b79ff', accentSoft: '#312d59', watermark: '#312c61' },
  { id: 'silver-frost', name: '银霜浅灰', bg: '#f1f4f7', panel: '#f8fafc', text: '#1e2732', muted: '#707d8c', accent: '#5e88b8', accentSoft: '#d6e1eb', watermark: '#dfe5ec' },
  { id: 'tangerine-pop', name: '柑橘跳色', bg: '#fff5ee', panel: '#fffaf7', text: '#341e10', muted: '#8a6b5d', accent: '#ff7a2f', accentSoft: '#ffd5bf', watermark: '#f3dfd0' },
]

export const fontOptions = [
  { id: 'noto', name: 'Noto Sans SC' },
  { id: 'alibaba', name: 'Alibaba PuHuiTi' },
  { id: 'system', name: '系统黑体' },
  { id: 'serif', name: '思源宋体风' },
]

export const patternOptions = [
  { id: 'dots', name: '圆点矩阵' },
  { id: 'grid', name: '细网格' },
  { id: 'diagonal', name: '斜向线条' },
  { id: 'rings', name: '同心圆' },
  { id: 'noise', name: '噪点颗粒' },
  { id: 'none', name: '无花纹' },
]

export const sizeOptions = [
  { id: 'x-cover', name: 'X / Twitter 封面', width: 2500, height: 1000, ratio: '5:2' },
  { id: 'wechat-cover', name: '公众号首图', width: 900, height: 383, ratio: '2.35:1' },
  { id: 'wechat-vertical', name: '公众号竖版封面', width: 1080, height: 1440, ratio: '3:4' },
  { id: 'xiaohongshu', name: '小红书封面', width: 1242, height: 1660, ratio: '3:4' },
  { id: 'zhihu', name: '知乎封面', width: 1920, height: 1080, ratio: '16:9' },
  { id: 'video-cover', name: '视频封面', width: 1280, height: 720, ratio: '16:9' },
  { id: 'square-post', name: '方形图卡', width: 1080, height: 1080, ratio: '1:1' },
  { id: 'story-vertical', name: '竖版海报', width: 1080, height: 1920, ratio: '9:16' },
]

export const platformTemplates = [
  {
    id: 'wechat',
    name: '公众号风',
    description: '适合深度长文、观点评论和方法教程。',
    variants: [
      {
        id: 'longform',
        name: '深度长文',
        patch: {
          englishTag: 'ARTICLE',
          kicker: '把复杂问题讲清楚，先从一张愿意被点开的封面开始。',
          title: '写给普通人的 AI 入门指南',
          highlight: 'AI',
          paletteId: 'mint-glacier',
          pattern: 'grid',
          fontFamily: 'Noto Sans SC',
          watermark: 'AI',
          sizeId: 'wechat-cover',
          titleScale: 1,
        },
      },
      {
        id: 'opinion',
        name: '观点评论',
        patch: {
          englishTag: 'INSIGHT',
          kicker: '不是复述热点，而是给出判断。',
          title: 'AI 写作越方便，为什么越需要人的观点？',
          highlight: '观点',
          paletteId: 'silver-frost',
          pattern: 'none',
          fontFamily: '思源宋体风',
          watermark: '观点',
          sizeId: 'wechat-cover',
          titleScale: 0.98,
        },
      },
      {
        id: 'tutorial',
        name: '方法教程',
        patch: {
          englishTag: 'GUIDE',
          kicker: '从 0 到 1 搭起一套能复用的方法。',
          title: '3 步搭建你的 AI 写作工作流',
          highlight: '3 步',
          paletteId: 'sand-beige',
          pattern: 'grid',
          fontFamily: 'Noto Sans SC',
          watermark: '方法',
          sizeId: 'wechat-cover',
          titleScale: 1.03,
        },
      },
      {
        id: 'case-study',
        name: '案例拆解',
        patch: {
          englishTag: 'CASE',
          kicker: '用真实案例拆解思路和动作。',
          title: '拆解一篇 10w+ AI 文章是怎么写出来的',
          highlight: '10w+',
          paletteId: 'teal-wave',
          pattern: 'diagonal',
          fontFamily: '系统黑体',
          watermark: '案例',
          sizeId: 'wechat-cover',
          titleScale: 1,
        },
      },
    ],
  },
  {
    id: 'xiaohongshu',
    name: '小红书风',
    description: '适合干货清单、避坑经验、工具推荐。',
    variants: [
      {
        id: 'cheatsheet',
        name: '干货清单',
        patch: {
          englishTag: 'NOTES',
          kicker: '看完就能直接套用的方法，适合收藏。',
          title: '不会写 AI 提示词的人，先看这篇',
          highlight: 'AI',
          paletteId: 'plum-rose',
          pattern: 'dots',
          fontFamily: 'Alibaba PuHuiTi',
          watermark: '攻略',
          sizeId: 'xiaohongshu',
          titleScale: 1.02,
        },
      },
      {
        id: 'avoid-pitfalls',
        name: '新手避坑',
        patch: {
          englishTag: 'TIPS',
          kicker: '少走弯路，比盲目堆工具更重要。',
          title: '新手学 AI 最容易踩的 6 个坑',
          highlight: '6 个坑',
          paletteId: 'peach-fuzz',
          pattern: 'rings',
          fontFamily: 'Alibaba PuHuiTi',
          watermark: '避坑',
          sizeId: 'xiaohongshu',
          titleScale: 1.04,
        },
      },
      {
        id: 'tool-recommendation',
        name: '工具推荐',
        patch: {
          englishTag: 'TOOLS',
          kicker: '不是越多越好，而是越顺手越好。',
          title: '我最常用的 5 个 AI 写作工具',
          highlight: '5 个',
          paletteId: 'sunrise-amber',
          pattern: 'dots',
          fontFamily: 'Alibaba PuHuiTi',
          watermark: '工具',
          sizeId: 'xiaohongshu',
          titleScale: 1.03,
        },
      },
      {
        id: 'experience',
        name: '经验复盘',
        patch: {
          englishTag: 'RECAP',
          kicker: '把能复用的经验留给下一个自己。',
          title: '我用 AI 写了 100 篇文章后，学到的事',
          highlight: '100 篇',
          paletteId: 'aurora-violet',
          pattern: 'noise',
          fontFamily: 'Alibaba PuHuiTi',
          watermark: '复盘',
          sizeId: 'xiaohongshu',
          titleScale: 1,
        },
      },
    ],
  },
  {
    id: 'zhihu',
    name: '知乎风',
    description: '适合问答、争议观点、方法论。',
    variants: [
      {
        id: 'question',
        name: '问题回答',
        patch: {
          englishTag: 'QUESTION',
          kicker: '把观点说透，而不是只给结论。',
          title: '为什么越来越多人开始系统学 AI？',
          highlight: 'AI',
          paletteId: 'silver-frost',
          pattern: 'none',
          fontFamily: '思源宋体风',
          watermark: '问答',
          sizeId: 'zhihu',
          titleScale: 0.98,
        },
      },
      {
        id: 'debate',
        name: '争议观点',
        patch: {
          englishTag: 'DEBATE',
          kicker: '先看清问题，再表达立场。',
          title: 'AI 会让写作者更强，还是更容易同质化？',
          highlight: '同质化',
          paletteId: 'graphite',
          pattern: 'none',
          fontFamily: '思源宋体风',
          watermark: '争议',
          sizeId: 'zhihu',
          titleScale: 0.96,
        },
      },
      {
        id: 'methodology',
        name: '方法论',
        patch: {
          englishTag: 'METHOD',
          kicker: '比结论更重要的是可复制的方法。',
          title: '真正高效的 AI 学习方法，通常都很反直觉',
          highlight: '反直觉',
          paletteId: 'polar-blue',
          pattern: 'grid',
          fontFamily: '思源宋体风',
          watermark: '方法论',
          sizeId: 'zhihu',
          titleScale: 0.98,
        },
      },
      {
        id: 'trend',
        name: '趋势判断',
        patch: {
          englishTag: 'TREND',
          kicker: '看清变化，比追逐热词更重要。',
          title: '未来 2 年，普通人学 AI 最值得押注什么？',
          highlight: '2 年',
          paletteId: 'teal-wave',
          pattern: 'diagonal',
          fontFamily: '思源宋体风',
          watermark: '趋势',
          sizeId: 'zhihu',
          titleScale: 0.97,
        },
      },
    ],
  },
  {
    id: 'video',
    name: '视频封面风',
    description: '适合知识口播、爆款观点、教程实操。',
    variants: [
      {
        id: 'talking-head',
        name: '知识口播',
        patch: {
          englishTag: 'VIDEO',
          kicker: '3 分钟看懂一个关键概念。',
          title: '看完这期，你就知道 AI 怎么真正提效',
          highlight: 'AI',
          paletteId: 'graphite',
          pattern: 'diagonal',
          fontFamily: '系统黑体',
          watermark: 'UP',
          sizeId: 'video-cover',
          titleScale: 1.08,
        },
      },
      {
        id: 'hot-take',
        name: '爆款观点',
        patch: {
          englishTag: 'HOT TAKE',
          kicker: '不是标题党，是把重点提前说出来。',
          title: '多数人学 AI 效率低，不是因为不努力',
          highlight: '效率低',
          paletteId: 'burgundy',
          pattern: 'diagonal',
          fontFamily: '系统黑体',
          watermark: '观点',
          sizeId: 'video-cover',
          titleScale: 1.1,
        },
      },
      {
        id: 'tutorial',
        name: '教程实操',
        patch: {
          englishTag: 'TUTORIAL',
          kicker: '照着做，就能把流程跑起来。',
          title: '手把手教你搭建 AI 选题到成稿流程',
          highlight: '手把手',
          paletteId: 'teal-wave',
          pattern: 'grid',
          fontFamily: '系统黑体',
          watermark: '教程',
          sizeId: 'video-cover',
          titleScale: 1.04,
        },
      },
      {
        id: 'interview',
        name: '访谈剪辑',
        patch: {
          englishTag: 'INTERVIEW',
          kicker: '一句话切中关键问题。',
          title: '做内容的人，为什么都在重新学习 AI？',
          highlight: '重新学习',
          paletteId: 'midnight-navy',
          pattern: 'rings',
          fontFamily: '系统黑体',
          watermark: '访谈',
          sizeId: 'video-cover',
          titleScale: 1.02,
        },
      },
    ],
  },
]

export const highlightStyleOptions = [
  { id: 'fill', name: '纯色高亮' },
  { id: 'underline', name: '下划线高亮' },
  { id: 'marker', name: '荧光笔底色' },
  { id: 'outline', name: '描边高亮' },
]

export const watermarkPositionOptions = [
  { id: 'bottom-right', name: '右下' },
  { id: 'center-right', name: '右侧居中' },
  { id: 'center', name: '中间' },
  { id: 'left-bottom', name: '左下' },
]

export const defaultDraft = {
  englishTag: 'ARTICLE',
  kicker: '把复杂话题讲清楚的第一步，是先做一张愿意被点开的封面。',
  title: '写出一篇让人愿意读完的 AI 文章',
  highlight: 'AI',
  highlightStyle: 'fill',
  fontFamily: 'Noto Sans SC',
  pattern: 'grid',
  paletteId: 'mint-glacier',
  watermark: 'AI',
  watermarkOpacity: 0.95,
  watermarkPosition: 'center-right',
  signature: '@ewin · 2026',
  titleScale: 1,
  previewScale: 29,
  sizeId: 'x-cover',
  platformTemplateId: 'wechat',
  templateVariantId: 'longform',
  showEnglishTag: true,
  showKicker: true,
  showHighlight: true,
  showWatermark: true,
  showSignature: true,
  showPattern: true,
  showInnerPanel: true,
}

export const elementToggleOptions = [
  { key: 'showEnglishTag', name: '顶部英文标签' },
  { key: 'showKicker', name: '引导句' },
  { key: 'showHighlight', name: '高亮效果' },
  { key: 'showWatermark', name: '背景水印字' },
  { key: 'showSignature', name: '底部署名' },
  { key: 'showPattern', name: '背景花纹' },
  { key: 'showInnerPanel', name: '内层面板/边框' },
]

export const randomWatermarkFromTitle = (title = '') => {
  const chars = Array.from(title.replace(/\s+/g, '')).filter((ch) => /[\u4e00-\u9fa5A-Za-z0-9]/.test(ch))
  if (!chars.length) return 'AI'
  return chars[Math.floor(Math.random() * chars.length)]
}

export const randomHighlightFromTitle = (title = '') => {
  const cleaned = title.replace(/[？?！!，,。.:：、\s]/g, '')
  if (!cleaned) return ''
  const start = Math.floor(Math.random() * Math.max(1, cleaned.length - 1))
  return cleaned.slice(start, Math.min(cleaned.length, start + (cleaned.length > 5 ? 2 : 1)))
}

export const getPaletteById = (id) => palettePresets.find((item) => item.id === id) || palettePresets[0]
export const getSizeById = (id) => sizeOptions.find((item) => item.id === id) || sizeOptions[0]
export const getPlatformTemplateById = (id) => platformTemplates.find((item) => item.id === id) || platformTemplates[0]
export const getVariantById = (platformId, variantId) => {
  const platform = getPlatformTemplateById(platformId)
  return platform.variants.find((item) => item.id === variantId) || platform.variants[0]
}

export const createExportRecord = (draft) => ({
  id: `cover_${Date.now()}`,
  title: draft.title,
  paletteId: draft.paletteId,
  watermark: draft.watermark,
  exportedAt: new Date().toLocaleString('zh-CN', { hour12: false }),
  snapshot: { ...draft },
})
