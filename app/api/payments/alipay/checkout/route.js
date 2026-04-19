import { NextResponse } from 'next/server'
import { buildCheckoutFormHtml, buildCheckoutParams } from '../../../../../lib/alipay'

export async function GET(request) {
  const url = new URL(request.url)
  const orderId = url.searchParams.get('orderId') || 'ORDER_DEMO'
  const subject = url.searchParams.get('subject') || '数字商品订单'
  const totalAmount = url.searchParams.get('amount') || '1.00'
  const body = url.searchParams.get('body') || ''

  try {
    const { config, params } = buildCheckoutParams({ orderId, subject, totalAmount, body })
    const html = buildCheckoutFormHtml({ actionUrl: config.gatewayUrl, params, title: '支付宝收银台' })
    return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message,
        hint: '请先配置 ALIPAY_APP_ID / ALIPAY_PRIVATE_KEY_PEM / ALIPAY_PUBLIC_KEY_PEM',
      },
      { status: 503 },
    )
  }
}
