import { NextResponse } from 'next/server'
import { getAlipayConfig, verifyAlipayParams } from '../../../../../lib/alipay'

export async function POST(request) {
  const formData = await request.formData()
  const payload = Object.fromEntries(formData.entries())
  const config = getAlipayConfig()

  if (!config.ready) {
    return NextResponse.json({ success: false, error: `Missing Alipay config: ${config.missing.join(', ')}` }, { status: 503 })
  }

  if (!verifyAlipayParams(payload, config.publicKeyPem)) {
    return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 })
  }

  const tradeStatus = payload.trade_status || payload.tradeStatus || ''
  if (!['TRADE_SUCCESS', 'TRADE_FINISHED'].includes(tradeStatus)) {
    console.log('[alipay] notify ignored', payload.out_trade_no, tradeStatus)
    return new NextResponse('success')
  }

  console.log('[alipay] notify applied', {
    out_trade_no: payload.out_trade_no,
    trade_no: payload.trade_no,
    total_amount: payload.total_amount,
  })

  return new NextResponse('success')
}
