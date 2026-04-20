'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  COVER_DRAFT_KEY,
  COVER_EXPORTS_KEY,
  createExportRecord,
  defaultDraft,
  elementToggleOptions,
  fontOptions,
  getPaletteById,
  getPlatformTemplateById,
  getSizeById,
  getVariantById,
  highlightStyleOptions,
  palettePresets,
  patternOptions,
  platformTemplates,
  randomHighlightFromTitle,
  randomWatermarkFromTitle,
  sizeOptions,
  watermarkPositionOptions,
} from '../lib/cover-tool-data'

const escapeXml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;')

const splitTitle = (title, maxCharsPerLine = 10) => {
  const clean = String(title || '').trim().replace(/\s+/g, '')
  if (!clean) return ['文科生学', 'AI 的社群？']
  if (clean.length <= maxCharsPerLine) return [clean]

  const softSeparators = ['：', ':', '，', ',', '？', '?', '！', '!', '、']
  for (const sep of softSeparators) {
    const idx = clean.indexOf(sep)
    if (idx > 1 && idx < clean.length - 1 && idx <= maxCharsPerLine + 1) {
      const first = clean.slice(0, idx + 1)
      const rest = clean.slice(idx + 1).trim()
      if (rest) return [first, rest]
    }
  }

  const chars = Array.from(clean)
  const lines = []
  let current = ''
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i]
    const next = chars[i + 1] || ''
    current += ch
    const shouldBreakByLen = current.length >= maxCharsPerLine
    const shouldBreakByPunc = softSeparators.includes(ch) && current.length >= Math.max(4, maxCharsPerLine - 2)
    if ((shouldBreakByLen || shouldBreakByPunc) && next) {
      if (/^[，。！？：、,.:!?]$/.test(next) && i + 1 < chars.length) {
        continue
      }
      lines.push(current)
      current = ''
    }
  }
  if (current) lines.push(current)

  const merged = []
  for (const line of lines) {
    if (merged.length && line.length === 1) {
      merged[merged.length - 1] += line
    } else {
      merged.push(line)
    }
  }
  return merged.slice(0, 4)
}

const getFontStack = (fontFamily) => {
  if (fontFamily === 'Alibaba PuHuiTi') return 'Alibaba PuHuiTi, Inter, Noto Sans SC, sans-serif'
  if (fontFamily === '思源宋体风') return 'STSong, Songti SC, Noto Serif SC, serif'
  if (fontFamily === '系统黑体') return 'PingFang SC, Microsoft YaHei, Inter, sans-serif'
  return 'Noto Sans SC, Inter, sans-serif'
}

const buildPattern = (pattern, palette, width, height) => {
  const stroke = palette.accentSoft
  const fill = palette.accentSoft
  switch (pattern) {
    case 'dots':
      return `<g opacity="0.62">${Array.from({ length: 24 }).map((_, i) => `<circle cx="${width * 0.08 + (i % 6) * (width * 0.1)}" cy="${height * 0.12 + Math.floor(i / 6) * (height * 0.12)}" r="${Math.max(5, width * 0.0032)}" fill="${fill}" />`).join('')}</g>`
    case 'diagonal':
      return `<g opacity="0.34" stroke="${stroke}" stroke-width="${Math.max(3, width * 0.0022)}">${Array.from({ length: 14 }).map((_, i) => `<line x1="${-width * 0.08 + i * (width * 0.085)}" y1="0" x2="${width * 0.08 + i * (width * 0.085)}" y2="${height}" />`).join('')}</g>`
    case 'rings':
      return `<g opacity="0.3" fill="none" stroke="${stroke}" stroke-width="${Math.max(3, width * 0.0022)}"><circle cx="${width * 0.76}" cy="${height * 0.35}" r="${width * 0.048}" /><circle cx="${width * 0.76}" cy="${height * 0.35}" r="${width * 0.084}" /><circle cx="${width * 0.76}" cy="${height * 0.35}" r="${width * 0.12}" /></g>`
    case 'noise':
      return `<g opacity="0.24">${Array.from({ length: 180 }).map((_, i) => `<rect x="${(i * 97) % width}" y="${(i * 53) % height}" width="${2 + (i % 4)}" height="${2 + ((i + 1) % 4)}" fill="${fill}" />`).join('')}</g>`
    case 'none':
      return ''
    case 'grid':
    default:
      return `<g opacity="0.3" stroke="${stroke}" stroke-width="${Math.max(1.8, width * 0.0012)}">${Array.from({ length: 9 }).map((_, i) => `<line x1="${width * 0.072 + i * (width * 0.084)}" y1="0" x2="${width * 0.072 + i * (width * 0.084)}" y2="${height}" />`).join('')}${Array.from({ length: 5 }).map((_, i) => `<line x1="0" y1="${height * 0.15 + i * (height * 0.16)}" x2="${width}" y2="${height * 0.15 + i * (height * 0.16)}" />`).join('')}</g>`
  }
}

const highlightTitle = (title, highlight, accent, enabled, style = 'fill') => {
  const clean = String(title || '')
  const mark = String(highlight || '').trim()
  if (!enabled || !mark || !clean.includes(mark)) return escapeXml(clean)
  const idx = clean.indexOf(mark)
  const before = escapeXml(clean.slice(0, idx))
  const mid = escapeXml(mark)
  const after = escapeXml(clean.slice(idx + mark.length))
  const styles = {
    fill: `<tspan fill="${accent}">${mid}</tspan>`,
    underline: `<tspan text-decoration="underline" text-decoration-color="${accent}" text-decoration-thickness="10" text-underline-offset="18">${mid}</tspan>`,
    marker: `<tspan fill="${accent}" style="paint-order:stroke;stroke:${accent}55;stroke-width:20;stroke-linejoin:round">${mid}</tspan>`,
    outline: `<tspan fill="transparent" stroke="${accent}" stroke-width="6" paint-order="stroke">${mid}</tspan>`,
  }
  return `${before}${styles[style] || styles.fill}${after}`
}

const getLayoutProfile = (size) => {
  const ratio = size.width / size.height
  if (ratio >= 1.55) {
    return { kind: 'horizontal', maxCharsPerLine: 12, titleScaleBase: 0.082, kickerY: 0.28, baseY: 0.52, titleGap: 0.92, innerPad: 0.05, watermarkX: 0.62, watermarkY: 0.72, watermarkSize: 0.13, tagWidth: 0.12, tagFont: 0.0104, footerY: 0.9 }
  }
  if (ratio <= 0.8) {
    return { kind: 'vertical', maxCharsPerLine: 8, titleScaleBase: 0.1, kickerY: 0.24, baseY: 0.42, titleGap: 0.96, innerPad: 0.07, watermarkX: 0.52, watermarkY: 0.82, watermarkSize: 0.18, tagWidth: 0.2, tagFont: 0.016, footerY: 0.94 }
  }
  return { kind: 'square', maxCharsPerLine: 9, titleScaleBase: 0.09, kickerY: 0.26, baseY: 0.47, titleGap: 0.94, innerPad: 0.065, watermarkX: 0.56, watermarkY: 0.78, watermarkSize: 0.16, tagWidth: 0.18, tagFont: 0.014, footerY: 0.92 }
}

const getWatermarkCoords = (position, width, height, size) => {
  const map = {
    'bottom-right': { x: Math.round(width * 0.68), y: Math.round(height * 0.88), anchor: 'start' },
    'center-right': { x: Math.round(width * 0.62), y: Math.round(height * 0.72), anchor: 'start' },
    center: { x: Math.round(width * 0.5), y: Math.round(height * 0.62), anchor: 'middle' },
    'left-bottom': { x: Math.round(width * 0.14), y: Math.round(height * 0.86), anchor: 'start' },
  }
  return map[position] || map['center-right']
}

const buildCoverSvg = (draft) => {
  const palette = getPaletteById(draft.paletteId)
  const size = getSizeById(draft.sizeId)
  const width = size.width
  const height = size.height
  const layout = getLayoutProfile(size)
  const lines = splitTitle(draft.title, layout.maxCharsPerLine)
  const font = getFontStack(draft.fontFamily)
  const kicker = escapeXml(draft.kicker)
  const englishTag = escapeXml(draft.englishTag)
  const signature = escapeXml(draft.signature)
  const watermark = escapeXml((draft.watermark || '').slice(0, 12) || 'AI')
  const titleSize = Math.round(width * layout.titleScaleBase * Number(draft.titleScale || 1))
  const subtitleSize = Math.max(18, Math.round(titleSize * 0.18))
  const outerPad = Math.round(width * 0.015)
  const innerPad = Math.round(width * layout.innerPad)
  const tagBoxWidth = Math.round(width * layout.tagWidth)
  const tagBoxHeight = Math.round(height * (layout.kind === 'vertical' ? 0.042 : 0.048))
  const tagFontSize = Math.max(18, Math.round(width * layout.tagFont))
  const kickerY = Math.round(height * layout.kickerY)
  const baseY = Math.round(height * layout.baseY)
  const watermarkSize = Math.round(width * layout.watermarkSize)
  const footerY = Math.round(height * layout.footerY)
  const watermarkCoords = getWatermarkCoords(draft.watermarkPosition, width, height, watermarkSize)

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="${width}" height="${height}" rx="${Math.round(Math.min(width, height) * 0.05)}" fill="${palette.bg}" />
      ${draft.showInnerPanel ? `<rect x="${outerPad}" y="${outerPad}" width="${width - outerPad * 2}" height="${height - outerPad * 2}" rx="${Math.round(Math.min(width, height) * 0.042)}" fill="${palette.panel}" stroke="${palette.accentSoft}" />` : ''}
      ${draft.showEnglishTag ? `<rect x="${Math.round(width * 0.034)}" y="${Math.round(height * 0.078)}" width="${tagBoxWidth}" height="${tagBoxHeight}" rx="${Math.round(tagBoxHeight / 2)}" fill="${palette.accentSoft}" /><text x="${Math.round(width * 0.047)}" y="${Math.round(height * 0.111)}" font-family="Inter, sans-serif" font-size="${tagFontSize}" font-weight="800" letter-spacing="3" fill="${palette.text}">${englishTag}</text>` : ''}
      ${draft.showKicker ? `<text x="${innerPad}" y="${kickerY}" font-family="${font}" font-size="${subtitleSize}" font-style="italic" fill="${palette.muted}">${kicker}</text>` : ''}
      ${lines.map((line, index) => `<text x="${innerPad}" y="${baseY + index * Math.round(titleSize * layout.titleGap)}" font-family="${font}" font-size="${titleSize}" font-weight="800" letter-spacing="-4" fill="${palette.text}">${highlightTitle(line, draft.highlight, palette.accent, draft.showHighlight, draft.highlightStyle)}</text>`).join('')}
      ${draft.showWatermark ? `<text x="${watermarkCoords.x}" y="${watermarkCoords.y}" text-anchor="${watermarkCoords.anchor}" font-family="Inter, sans-serif" font-size="${watermarkSize}" font-weight="800" fill="${palette.watermark}" opacity="${draft.watermarkOpacity}">${watermark}</text>` : ''}
      ${draft.showSignature ? `<text x="${innerPad}" y="${footerY}" font-family="Inter, sans-serif" font-size="${Math.max(16, Math.round(width * 0.0168))}" fill="${palette.muted}">18% · ${signature}</text>` : ''}
      ${draft.showPattern ? buildPattern(draft.pattern, palette, width, height) : ''}
    </svg>
  `
}

const svgToDataUrl = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`

const normalizeDraft = (saved = {}) => {
  const merged = { ...defaultDraft, ...saved }
  if (merged.englishTag === 'X ARTICLE 160') merged.englishTag = defaultDraft.englishTag
  if (merged.kicker === '我为什么要创建一个') merged.kicker = defaultDraft.kicker
  if (merged.title === '文科生学 AI 的社群？') merged.title = defaultDraft.title
  if (merged.signature === '@wangdefou · 2026') merged.signature = defaultDraft.signature
  if (!merged.sizeId) merged.sizeId = defaultDraft.sizeId
  if (!merged.platformTemplateId) merged.platformTemplateId = defaultDraft.platformTemplateId
  if (!merged.templateVariantId) merged.templateVariantId = defaultDraft.templateVariantId
  if (!merged.highlightStyle) merged.highlightStyle = defaultDraft.highlightStyle
  if (typeof merged.watermarkOpacity !== 'number') merged.watermarkOpacity = defaultDraft.watermarkOpacity
  if (!merged.watermarkPosition) merged.watermarkPosition = defaultDraft.watermarkPosition
  return merged
}

const createBatchVariants = (mode, draft) => {
  const make = (patch, label) => ({ ...draft, ...patch, batchLabel: label })
  if (mode === 'palette') {
    const paletteIds = [draft.paletteId, 'plum-rose', 'graphite', 'sunrise-amber']
    return paletteIds.map((id, i) => make({ paletteId: id }, `配色方案 ${i + 1}`))
  }
  if (mode === 'highlight') {
    const words = [draft.highlight || randomHighlightFromTitle(draft.title), randomHighlightFromTitle(draft.title), randomHighlightFromTitle(draft.title), '']
    return words.map((word, i) => make({ highlight: word, showHighlight: Boolean(word) }, i === 3 ? '无高亮版' : `高亮方案 ${i + 1}`))
  }
  const templatePairs = [
    ['wechat', 'tutorial'],
    ['xiaohongshu', 'tool-recommendation'],
    ['zhihu', 'question'],
    ['video', 'hot-take'],
  ]
  return templatePairs.map(([platformId, variantId]) => {
    const variant = getVariantById(platformId, variantId)
    return make({ ...variant.patch, platformTemplateId: platformId, templateVariantId: variant.id }, `${getPlatformTemplateById(platformId).name} · ${variant.name}`)
  })
}

export default function Page() {
  const [draft, setDraft] = useState(defaultDraft)
  const [activeTab, setActiveTab] = useState('copy')
  const [exportHistory, setExportHistory] = useState([])
  const [message, setMessage] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [batchVariants, setBatchVariants] = useState([])

  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(COVER_DRAFT_KEY)
      const savedExports = localStorage.getItem(COVER_EXPORTS_KEY)
      if (savedDraft) setDraft(normalizeDraft(JSON.parse(savedDraft)))
      if (savedExports) setExportHistory(JSON.parse(savedExports))
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem(COVER_DRAFT_KEY, JSON.stringify(draft))
  }, [draft])

  useEffect(() => {
    localStorage.setItem(COVER_EXPORTS_KEY, JSON.stringify(exportHistory))
  }, [exportHistory])

  const palette = useMemo(() => getPaletteById(draft.paletteId), [draft.paletteId])
  const size = useMemo(() => getSizeById(draft.sizeId), [draft.sizeId])
  const currentPlatform = useMemo(() => getPlatformTemplateById(draft.platformTemplateId), [draft.platformTemplateId])
  const currentVariant = useMemo(() => getVariantById(draft.platformTemplateId, draft.templateVariantId), [draft.platformTemplateId, draft.templateVariantId])
  const svgMarkup = useMemo(() => buildCoverSvg(draft), [draft])
  const previewUrl = useMemo(() => svgToDataUrl(svgMarkup), [svgMarkup])

  const updateDraft = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }))

  const applyVariant = (platformId, variantId) => {
    const variant = getVariantById(platformId, variantId)
    setDraft((prev) => ({
      ...prev,
      ...variant.patch,
      platformTemplateId: platformId,
      templateVariantId: variant.id,
      signature: prev.signature || defaultDraft.signature,
      previewScale: prev.previewScale,
    }))
    setMessage(`已切换到「${getPlatformTemplateById(platformId).name} · ${variant.name}」。`)
  }

  const applyPlatformTemplate = (platformId) => {
    const platform = getPlatformTemplateById(platformId)
    applyVariant(platform.id, platform.variants[0].id)
  }

  const toggleElement = (key) => setDraft((prev) => ({ ...prev, [key]: !prev[key] }))

  const generateBatch = (mode) => {
    const generated = createBatchVariants(mode, draft)
    setBatchVariants(generated)
    setActiveTab('preview')
    setMessage(mode === 'palette' ? '已生成 4 张不同配色方案。' : mode === 'highlight' ? '已生成 4 张不同高亮方案。' : '已生成 4 张不同模板方案。')
  }

  const applyBatchVariant = (variant) => {
    setDraft((prev) => ({ ...prev, ...variant, batchLabel: undefined }))
    setMessage(`已应用方案：${variant.batchLabel}`)
  }

  const exportVariantPng = async (variant, { saveRecord = true } = {}) => {
    const variantSize = getSizeById(variant.sizeId)
    const svgUrl = svgToDataUrl(buildCoverSvg(variant))
    const img = new Image()
    img.crossOrigin = 'anonymous'
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = svgUrl
    })
    const canvas = document.createElement('canvas')
    canvas.width = variantSize.width
    canvas.height = variantSize.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.href = url
    link.download = `${variant.batchLabel || variant.title || 'cover'}.png`
    link.click()
    URL.revokeObjectURL(url)
    if (saveRecord) {
      const record = createExportRecord(variant)
      setExportHistory((prev) => [record, ...prev].slice(0, 8))
    }
    return variantSize
  }

  const exportPng = async () => {
    setIsExporting(true)
    try {
      const exportedSize = await exportVariantPng(draft)
      setMessage(`PNG 已导出：${exportedSize.width}×${exportedSize.height}，比例 ${exportedSize.ratio}`)
      setActiveTab('preview')
    } catch {
      setMessage('导出失败，请重试。')
    } finally {
      setIsExporting(false)
    }
  }

  const exportAllBatchVariants = async () => {
    if (!batchVariants.length) {
      setMessage('请先生成一组批量方案，再执行全部导出。')
      return
    }
    setIsExporting(true)
    try {
      for (const variant of batchVariants) {
        await exportVariantPng(variant)
      }
      setMessage(`已批量导出 ${batchVariants.length} 张方案图片。`)
      setActiveTab('preview')
    } catch {
      setMessage('批量导出失败，请重试。')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="cover-page">
      <main className="cover-shell">
        <section className="cover-header">
          <div>
            <h1>文章封面图生成器</h1>
            <p>输入标题 &gt; 选配色 &gt; 选尺寸 &gt; 导出 PNG</p>
          </div>
          <div className="header-actions">
            <a className="ghost-link" href="/account">模板中心</a>
            <button className="primary-btn" onClick={exportPng}>{isExporting ? '导出中…' : '导出 PNG'}</button>
          </div>
        </section>

        <section className="template-strip">
          {platformTemplates.map((template) => (
            <button key={template.id} className={draft.platformTemplateId === template.id ? 'template-chip active' : 'template-chip'} onClick={() => applyPlatformTemplate(template.id)}>
              <strong>{template.name}</strong>
              <span>{template.description}</span>
            </button>
          ))}
        </section>

        <section className="cover-workbench">
          <div className="control-panel">
            <div className="tab-row">
              <button className={activeTab === 'copy' ? 'tab active' : 'tab'} onClick={() => setActiveTab('copy')}>文案设置</button>
              <button className={activeTab === 'style' ? 'tab active' : 'tab'} onClick={() => setActiveTab('style')}>样式设置</button>
              <button className={activeTab === 'preview' ? 'tab active' : 'tab'} onClick={() => setActiveTab('preview')}>效果预览</button>
            </div>

            {activeTab === 'copy' ? (
              <div className="control-groups">
                <label className="field">
                  <span>平台模板</span>
                  <select value={draft.platformTemplateId} onChange={(e) => applyPlatformTemplate(e.target.value)}>
                    {platformTemplates.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </select>
                </label>
                <label className="field">
                  <span>子模板</span>
                  <select value={draft.templateVariantId} onChange={(e) => applyVariant(draft.platformTemplateId, e.target.value)}>
                    {currentPlatform.variants.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </select>
                  <div className="variant-grid">
                    {currentPlatform.variants.map((item) => (
                      <button key={item.id} type="button" className={draft.templateVariantId === item.id ? 'variant-chip active' : 'variant-chip'} onClick={() => applyVariant(draft.platformTemplateId, item.id)}>
                        <strong>{item.name}</strong>
                        <span>{currentPlatform.name}</span>
                      </button>
                    ))}
                  </div>
                </label>
                <label className="field">
                  <span>顶部英文标签</span>
                  <input value={draft.englishTag} onChange={(e) => updateDraft('englishTag', e.target.value)} />
                </label>
                <label className="field">
                  <span>引导句（小字细体）</span>
                  <input value={draft.kicker} onChange={(e) => updateDraft('kicker', e.target.value)} placeholder="把复杂观点讲清楚，先从封面开始。" />
                </label>
                <label className="field">
                  <span>核心标题（主标题）</span>
                  <textarea value={draft.title} onChange={(e) => updateDraft('title', e.target.value)} rows={4} />
                </label>
                <label className="field">
                  <span>高亮文字</span>
                  <div className="inline-actions">
                    <input value={draft.highlight} onChange={(e) => updateDraft('highlight', e.target.value)} placeholder="跟随主标题" />
                    <button className="small-btn" type="button" onClick={() => updateDraft('highlight', draft.title.includes(draft.highlight) ? draft.highlight : randomHighlightFromTitle(draft.title))}>自动匹配</button>
                  </div>
                  <div className="mini-actions">
                    <button className="mini-btn" type="button" onClick={() => updateDraft('highlight', randomHighlightFromTitle(draft.title))}>随机高亮</button>
                    <button className="mini-btn" type="button" onClick={() => updateDraft('highlight', '')}>清除高亮</button>
                  </div>
                </label>
                <label className="field">
                  <span>署名</span>
                  <input value={draft.signature} onChange={(e) => updateDraft('signature', e.target.value)} placeholder="@ewin · 2026" />
                </label>
              </div>
            ) : null}

            {activeTab === 'style' ? (
              <div className="control-groups">
                <label className="field">
                  <span>主字号</span>
                  <div className="range-row">
                    <input type="range" min="0.8" max="1.25" step="0.01" value={draft.titleScale} onChange={(e) => updateDraft('titleScale', Number(e.target.value))} />
                    <strong>{Math.round(draft.titleScale * 160)}</strong>
                  </div>
                </label>
                <label className="field">
                  <span>高亮样式</span>
                  <div className="variant-grid compact-grid">
                    {highlightStyleOptions.map((item) => (
                      <button key={item.id} type="button" className={draft.highlightStyle === item.id ? 'variant-chip active' : 'variant-chip'} onClick={() => updateDraft('highlightStyle', item.id)}>
                        <strong>{item.name}</strong>
                        <span>{item.id}</span>
                      </button>
                    ))}
                  </div>
                </label>
                <label className="field">
                  <span>字体</span>
                  <select value={draft.fontFamily} onChange={(e) => updateDraft('fontFamily', e.target.value)}>
                    {fontOptions.map((item) => <option key={item.id}>{item.name}</option>)}
                  </select>
                </label>
                <label className="field">
                  <span>尺寸</span>
                  <select value={draft.sizeId} onChange={(e) => updateDraft('sizeId', e.target.value)}>
                    {sizeOptions.map((item) => <option key={item.id} value={item.id}>{item.name}（{item.width}×{item.height}）</option>)}
                  </select>
                </label>
                <label className="field">
                  <span>背景花纹</span>
                  <select value={draft.pattern} onChange={(e) => updateDraft('pattern', e.target.value)}>
                    {patternOptions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </select>
                  <div className="pattern-grid">
                    {patternOptions.map((item) => (
                      <button key={item.id} type="button" className={draft.pattern === item.id ? 'pattern-chip active' : 'pattern-chip'} onClick={() => updateDraft('pattern', item.id)}>
                        <strong>{item.name}</strong>
                        <span>{item.id}</span>
                      </button>
                    ))}
                  </div>
                </label>
                <label className="field">
                  <span>配色方案（18 套）</span>
                  <div className="palette-grid">
                    {palettePresets.map((item) => (
                      <button key={item.id} type="button" className={item.id === draft.paletteId ? 'palette-card active' : 'palette-card'} onClick={() => updateDraft('paletteId', item.id)}>
                        <span className="swatch" style={{ background: `linear-gradient(135deg, ${item.bg}, ${item.accent})` }} />
                        <strong>{item.name}</strong>
                      </button>
                    ))}
                  </div>
                </label>
                <label className="field">
                  <span>背景水印字</span>
                  <div className="inline-actions">
                    <input value={draft.watermark} onChange={(e) => updateDraft('watermark', e.target.value)} placeholder="跟随标题" />
                    <button className="small-btn" type="button" onClick={() => updateDraft('watermark', randomWatermarkFromTitle(draft.title))}>随机水印</button>
                  </div>
                </label>
                <label className="field">
                  <span>水印透明度</span>
                  <div className="range-row">
                    <input type="range" min="0.1" max="1" step="0.05" value={draft.watermarkOpacity} onChange={(e) => updateDraft('watermarkOpacity', Number(e.target.value))} />
                    <strong>{Math.round(draft.watermarkOpacity * 100)}%</strong>
                  </div>
                </label>
                <label className="field">
                  <span>水印位置</span>
                  <div className="variant-grid compact-grid">
                    {watermarkPositionOptions.map((item) => (
                      <button key={item.id} type="button" className={draft.watermarkPosition === item.id ? 'variant-chip active' : 'variant-chip'} onClick={() => updateDraft('watermarkPosition', item.id)}>
                        <strong>{item.name}</strong>
                        <span>{item.id}</span>
                      </button>
                    ))}
                  </div>
                </label>
                <label className="field">
                  <span>元素开关</span>
                  <div className="toggle-grid">
                    {elementToggleOptions.map((item) => (
                      <button key={item.key} type="button" className={draft[item.key] ? 'toggle-chip active' : 'toggle-chip'} onClick={() => toggleElement(item.key)}>
                        {item.name}
                      </button>
                    ))}
                  </div>
                </label>
                <button className="secondary-btn" type="button" onClick={() => updateDraft('paletteId', palettePresets[Math.floor(Math.random() * palettePresets.length)].id)}>随机配色</button>
              </div>
            ) : null}

            {activeTab === 'preview' ? (
              <div className="control-groups">
                <label className="field">
                  <span>预览缩放</span>
                  <div className="range-row">
                    <input type="range" min="20" max="40" step="1" value={draft.previewScale} onChange={(e) => updateDraft('previewScale', Number(e.target.value))} />
                    <strong>{draft.previewScale}%</strong>
                  </div>
                </label>
                <div className="preview-tips">
                  <p>当前模板：{currentPlatform.name} · {currentVariant.name}</p>
                  <p>支持一键批量生成多个方案，对比后可直接应用为当前稿。</p>
                </div>
                <div className="batch-actions">
                  <button className="secondary-btn" type="button" onClick={() => generateBatch('palette')}>生成 4 张配色方案</button>
                  <button className="secondary-btn" type="button" onClick={() => generateBatch('template')}>生成 4 张模板方案</button>
                  <button className="secondary-btn" type="button" onClick={() => generateBatch('highlight')}>生成 4 张高亮方案</button>
                </div>
                <button className="primary-btn full" onClick={exportPng}>{isExporting ? '导出中…' : '导出 PNG'}</button>
                {batchVariants.length ? <button className="secondary-btn full-soft" type="button" onClick={exportAllBatchVariants}>{isExporting ? '导出中…' : `一键全部导出（${batchVariants.length} 张）`}</button> : null}
                <div className="export-list">
                  {exportHistory.length ? exportHistory.map((item) => (
                    <a key={item.id} className="export-item" href={`/orders/${item.id}`}>
                      <strong>{item.title}</strong>
                      <span>{getPaletteById(item.paletteId).name}</span>
                      <small>{item.exportedAt}</small>
                    </a>
                  )) : <div className="empty-box">还没有导出记录</div>}
                </div>
              </div>
            ) : null}
          </div>

          <div className="preview-panel">
            <div className="preview-toolbar">
              <strong>预览 · {draft.previewScale}%</strong>
              <span>{palette.name} · {size.width}×{size.height} · {size.ratio}</span>
            </div>
            <div className="preview-stage">
              <div className="preview-canvas" style={{ width: `${draft.previewScale}%` }}>
                <img src={previewUrl} alt="封面图预览" />
              </div>
            </div>
            {message ? <div className="notice-box">{message}</div> : null}
            {batchVariants.length ? (
              <div className="batch-grid">
                {batchVariants.map((item, index) => (
                  <button key={`${item.batchLabel}-${index}`} type="button" className="batch-card" onClick={() => applyBatchVariant(item)}>
                    <img src={svgToDataUrl(buildCoverSvg(item))} alt={item.batchLabel} />
                    <strong>{item.batchLabel}</strong>
                    <span>{getSizeById(item.sizeId).name}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  )
}
