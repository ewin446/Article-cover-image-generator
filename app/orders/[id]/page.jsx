'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { COVER_EXPORTS_KEY, defaultDraft, getPaletteById } from '../../../lib/cover-tool-data'

export default function ExportDetailPage() {
  const { id } = useParams()
  const safeId = Array.isArray(id) ? id[0] : id
  const [exportsList, setExportsList] = useState([])

  useEffect(() => {
    try {
      const savedExports = localStorage.getItem(COVER_EXPORTS_KEY)
      if (savedExports) setExportsList(JSON.parse(savedExports))
    } catch {}
  }, [])

  const record = useMemo(() => exportsList.find((item) => item.id === safeId) || null, [exportsList, safeId])
  const snapshot = record?.snapshot || defaultDraft
  const palette = getPaletteById(snapshot.paletteId)

  return (
    <div className="cover-page">
      <main className="cover-shell simple-shell">
        <section className="cover-header">
          <div>
            <h1>导出详情</h1>
            <p>查看该封面图导出时的标题、配色和水印设置。</p>
          </div>
          <div className="header-actions">
            <Link className="ghost-link" href="/account">返回模板中心</Link>
          </div>
        </section>

        <section className="detail-card">
          <div className="detail-meta">
            <strong>{record?.title || snapshot.title}</strong>
            <span>导出时间：{record?.exportedAt || '未导出'}</span>
            <span>配色：{palette.name}</span>
            <span>背景水印：{snapshot.watermark}</span>
            <span>顶部标签：{snapshot.englishTag}</span>
          </div>
          <div className="detail-grid">
            <div className="cover-thumb" style={{ background: `linear-gradient(135deg, ${palette.bg}, ${palette.accentSoft})` }}>
              <div className="thumb-kicker">{snapshot.kicker}</div>
              <div className="thumb-title">{snapshot.title}</div>
              <div className="thumb-watermark">{snapshot.watermark}</div>
            </div>
            <div className="detail-settings">
              <div><span>高亮文字</span><strong>{snapshot.highlight || '无'}</strong></div>
              <div><span>字体</span><strong>{snapshot.fontFamily}</strong></div>
              <div><span>背景花纹</span><strong>{snapshot.pattern}</strong></div>
              <div><span>主字号</span><strong>{Math.round(snapshot.titleScale * 160)}</strong></div>
              <div><span>署名</span><strong>{snapshot.signature}</strong></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
