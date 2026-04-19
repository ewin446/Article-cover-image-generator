import { createPrivateKey, createPublicKey, createSign, createVerify } from 'crypto'

const DEFAULT_GATEWAY_URL = 'https://openapi.alipay.com/gateway.do'

const trim = (v) => String(v ?? '').trim()

const requiredEnv = ['ALIPAY_APP_ID', 'ALIPAY_PRIVATE_KEY_PEM', 'ALIPAY_PUBLIC_KEY_PEM']

export function getAlipayConfig() {
  const config = {
    appId: trim(process.env.ALIPAY_APP_ID),
    privateKeyPem: trim(process.env.ALIPAY_PRIVATE_KEY_PEM),
    publicKeyPem: trim(process.env.ALIPAY_PUBLIC_KEY_PEM),
    gatewayUrl: trim(process.env.ALIPAY_GATEWAY_URL) || DEFAULT_GATEWAY_URL,
    notifyUrl: trim(process.env.ALIPAY_NOTIFY_URL),
    returnUrl: trim(process.env.ALIPAY_RETURN_URL),
    sellerId: trim(process.env.ALIPAY_SELLER_ID),
    appAuthToken: trim(process.env.ALIPAY_APP_AUTH_TOKEN),
    timeoutExpress: trim(process.env.ALIPAY_TIMEOUT_EXPRESS) || '30m',
    subjectPrefix: trim(process.env.ALIPAY_SUBJECT_PREFIX) || '自动发货商店',
  }

  const missing = requiredEnv.filter((key) => !trim(process.env[key]))
  return {
    ...config,
    missing,
    ready: missing.length === 0,
    hasNotifyUrl: Boolean(config.notifyUrl),
    hasReturnUrl: Boolean(config.returnUrl),
  }
}

export function getAlipaySummary() {
  const config = getAlipayConfig()
  return {
    ready: config.ready,
    missing: config.missing,
    gatewayUrl: config.gatewayUrl,
    notifyUrl: config.notifyUrl || null,
    returnUrl: config.returnUrl || null,
    subjectPrefix: config.subjectPrefix,
    hasSellerId: Boolean(config.sellerId),
    hasAppAuthToken: Boolean(config.appAuthToken),
  }
}

export function formatAmount(value) {
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Invalid amount')
  }
  return amount.toFixed(2)
}

export function buildBizContent({ outTradeNo, subject, totalAmount, body }) {
  return JSON.stringify({
    out_trade_no: outTradeNo,
    product_code: 'FAST_INSTANT_TRADE_PAY',
    subject,
    total_amount: formatAmount(totalAmount),
    body: body || '',
  })
}

export function buildSignContent(params) {
  return Object.keys(params)
    .filter((key) => key !== 'sign' && key !== 'sign_type' && params[key] !== undefined && params[key] !== null && params[key] !== '')
    .sort()
    .map((key) => `${key}=${String(params[key])}`)
    .join('&')
}

export function signAlipayParams(params, privateKeyPem) {
  const sign = createSign('RSA-SHA256')
  sign.update(buildSignContent(params), 'utf8')
  sign.end()
  return sign.sign(createPrivateKey(privateKeyPem), 'base64')
}

export function verifyAlipayParams(params, publicKeyPem) {
  const signature = params.sign
  if (!signature) return false
  const verify = createVerify('RSA-SHA256')
  verify.update(buildSignContent(params), 'utf8')
  verify.end()
  return verify.verify(createPublicKey(publicKeyPem), signature, 'base64')
}

export function buildCheckoutParams({ orderId, subject, totalAmount, body }) {
  const config = getAlipayConfig()
  if (!config.ready) {
    throw new Error(`Missing Alipay config: ${config.missing.join(', ')}`)
  }

  const params = {
    app_id: config.appId,
    method: 'alipay.trade.page.pay',
    format: 'JSON',
    charset: 'utf-8',
    sign_type: 'RSA2',
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    version: '1.0',
    notify_url: config.notifyUrl,
    return_url: config.returnUrl,
    biz_content: buildBizContent({ outTradeNo: orderId, subject: `${config.subjectPrefix} - ${subject}`, totalAmount, body }),
  }

  if (config.sellerId) params.seller_id = config.sellerId
  if (config.appAuthToken) params.app_auth_token = config.appAuthToken
  params.sign = signAlipayParams(params, config.privateKeyPem)
  return { config, params }
}

export function buildCheckoutFormHtml({ actionUrl, params, title = '支付宝收银台' }) {
  const inputs = Object.entries(params)
    .map(([key, value]) => `<input type="hidden" name="${escapeHtml(key)}" value="${escapeHtml(value)}" />`)
    .join('\n')

  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      body { font-family: Inter, 'Noto Sans SC', system-ui, sans-serif; margin: 0; min-height: 100vh; display: grid; place-items: center; background: #fbf5ee; color: #2b1e3f; }
      .card { width: min(720px, calc(100vw - 32px)); background: rgba(255,255,255,0.9); border: 1px solid #eadfd5; border-radius: 24px; padding: 28px; box-shadow: 0 20px 40px rgba(0,0,0,.08); }
      h1 { margin: 0 0 8px; font-size: 28px; }
      p { line-height: 1.8; color: rgba(54,39,70,.76); }
      .hint { padding: 14px 16px; border-radius: 16px; background: #f7f1ff; margin-top: 18px; }
      .btn { margin-top: 20px; border: 0; border-radius: 16px; padding: 14px 20px; color: #fff; background: linear-gradient(135deg, #8b63ff, #ff63b0); font-size: 16px; font-weight: 700; }
      .muted { font-size: 13px; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>正在跳转到支付宝收银台</h1>
      <p>如果浏览器没有自动提交，请点击下方按钮继续。</p>
      <div class="hint">
        <div><strong>订单号：</strong>${escapeHtml(params.biz_content ? JSON.parse(params.biz_content).out_trade_no : '')}</div>
        <div><strong>金额：</strong>${escapeHtml(params.biz_content ? JSON.parse(params.biz_content).total_amount : '')}</div>
        <div class="muted"><strong>网关：</strong>${escapeHtml(actionUrl)}</div>
      </div>
      <form id="alipay-form" action="${escapeHtml(actionUrl)}" method="post">
        ${inputs}
        <button class="btn" type="submit">立即支付</button>
      </form>
    </div>
    <script>document.getElementById('alipay-form').submit();</script>
  </body>
</html>`
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}
