'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { COVER_DRAFT_KEY, COVER_EXPORTS_KEY, defaultDraft, getPaletteById } from '../../lib/cover-tool-data'

export default function AccountPage() {
  const [draft, setDraft] = useState(defaultDraft)
  const [exportsList, setExportsList] = useState([])

  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(COVER_DRAFT_KEY)
      const savedExports = localStorage.getItem(COVER_EXPORTS_KEY)
      if (savedDraft) {
        const parsed = { ...defaultDraft, ...JSON.parse(savedDraft) }
        if (parsed.englishTag === 'X ARTICLE 160') parsed.englishTag = defaultDraft.englishTag
        if (parsed.kicker === '我为什么要创建一个') parsed.kicker = defaultDraft.kicker
        if (parsed.title === '文科生学 AI 的社群？') parsed.title = defaultDraft.title
        if (parsed.signature === '@wangdefou · 2026') parsed.signature = defaultDraft.signature
        if (!parsed.sizeId) parsed.sizeId = defaultDraft.sizeId
        setDraft(parsed)
      }
      if (savedExports) setExportsList(JSON.parse(savedExports))
    } catch {}
  }, [])

  const summary = useMemo(() => ({
    total: exportsList.length,
    palette: getPaletteById(draft.paletteId).name,
    watermark: draft.watermark || 'AI',
  }), [draft, exportsList])

  return (
    <div className="cover-page">
      <main className="cover-shell simple-shell">
        <section className="cover-header">
          <div>
            <h1>模板中心</h1>
            <p>查看当前草稿、最近导出记录和默认配色。</p>
          </div>
          <div className="header-actions">
            <Link className="ghost-link" href="/">返回生成器</Link>
          </div>
        </section>

        <section className="simple-grid">
          <article className="simple-card">
            <span>当前标题</span>
            <strong>{draft.title}</strong>
          </article>
          <article className="simple-card">
            <span>默认配色</span>
            <strong>{summary.palette}</strong>
          </article>
          <article className="simple-card">
            <span>背景水印</span>
            <strong>{summary.watermark}</strong>
          </article>
          <article className="simple-card">
            <span>导出次数</span>
            <strong>{summary.total}</strong>
          </article>
        </section>

        <section className="history-card">
          <div className="section-mini-head">
            <h2>最近导出</h2>
            <Link className="ghost-link" href="/">继续编辑</Link>
          </div>
          <div className="export-list large">
            {exportsList.length ? exportsList.map((item) => (
              <Link key={item.id} className="export-item" href={`/orders/${item.id}`}>
                <strong>{item.title}</strong>
                <span>{getPaletteById(item.paletteId).name}</span>
                <small>{item.exportedAt}</small>
              </Link>
            )) : <div className="empty-box">暂无导出记录，先回首页导出一张 PNG 吧。</div>}
          </div>
        </section>
      </main>
    </div>
  )
}
