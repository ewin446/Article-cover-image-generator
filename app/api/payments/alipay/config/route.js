import { NextResponse } from 'next/server'
import { getAlipaySummary } from '../../../../../lib/alipay'

export function GET() {
  return NextResponse.json(getAlipaySummary())
}
