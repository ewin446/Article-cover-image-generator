export const CATALOG_KEY = 'auto-psi-catalog-v1'
export const ORDERS_KEY = 'auto-psi-orders-v1'

export const money = (n) => `¥${Number(n).toFixed(2)}`

const seedProducts = [
  { id: 'p1', name: 'ChatGPT Plus 年卡', subtitle: '购买后自动发送开通方式与订单详情', price: 188, compareAt: 228, stock: 18, sales: 192, tag: '热门', badge: '即时发货', accent: 'violet', description: '适合日常写作、资料整理、编程辅助。付款完成后自动发货。', features: ['支持支付宝', '自动发货', '订单可查'] },
  { id: 'p2', name: 'Gemini Ultra 家庭号', subtitle: '稳定套餐，适合长期使用', price: 98, compareAt: 128, stock: 24, sales: 87, tag: '家庭', badge: '稳定供货', accent: 'pink', description: '支持多设备登录，购买后可直接查看说明与使用步骤。', features: ['家庭可用', '多端支持', '自动发货'] },
  { id: 'p3', name: 'GPT Pro 月卡会员', subtitle: '轻量升级，低成本体验高级能力', price: 38, compareAt: 58, stock: 33, sales: 266, tag: '热销', badge: '秒发', accent: 'sky', description: '适合先体验再决定是否升级更长期套餐。', features: ['下单即发', '可查询', '售后支持'] },
  { id: 'p4', name: 'Gemini Pro 一年订阅卡密', subtitle: '一次购买，长期使用', price: 216, compareAt: 268, stock: 12, sales: 71, tag: '推荐', badge: '卡密发货', accent: 'mint', description: '适合需要稳定长期订阅的用户，支付后自动发出卡密。', features: ['卡密发货', '库存可见', '支持补发'] },
  { id: 'p5', name: '会员积分礼包', subtitle: '注册即送，购买越多奖励越多', price: 9.9, compareAt: 19.9, stock: 58, sales: 705, tag: '福利', badge: '新用户礼', accent: 'amber', description: '适合做拉新与复购，积分与优惠券可叠加使用。', features: ['积分累计', '邀请奖励', '自动到账'] },
  { id: 'p6', name: '美国 Gmail 成品邮箱', subtitle: '适合外贸/社媒工具场景', price: 24, compareAt: 39, stock: 30, sales: 112, tag: '现货', badge: '库存充足', accent: 'rose', description: '付款后自动发货，支持订单号、联系方式查询。', features: ['自动发货', '售后补发', '订单查询'] },
  { id: 'p7', name: '三个月链接兑换包', subtitle: '短期试用/活动促销首选', price: 66, compareAt: 88, stock: 41, sales: 159, tag: '限时', badge: '快速交付', accent: 'indigo', description: '适合短期活动、试用、体验版和新手上手。', features: ['低门槛', '快速交付', '可续费'] },
  { id: 'p8', name: '企业批量开通包', subtitle: '大客户批量下单，自动生成订单', price: 499, compareAt: 599, stock: 9, sales: 28, tag: '企业', badge: '大单优惠', accent: 'slate', description: '适合代理、工作室、团队批量采购场景。', features: ['批量下单', '专属客服', '发票支持'] },
]

export const getSeedProducts = () => seedProducts

export const getInitialOrders = () => [
  { id: 'ORDER_20260001', name: '王先生', contact: '138****2222', productId: 'p1', productName: 'ChatGPT Plus 年卡', amount: 188, paymentMethod: '支付宝', status: '已完成', createdAt: '2026-04-16 10:20', note: '已自动发货，订单状态已同步。' },
  { id: 'ORDER_20260002', name: '李女士', contact: 'li@example.com', productId: 'p4', productName: 'Gemini Pro 一年订阅卡密', amount: 216, paymentMethod: '支付宝', status: '已支付', createdAt: '2026-04-16 11:02', note: '等待发货中，稍后自动完成。' },
]

export const findOrder = (orders, term) => {
  const q = String(term ?? '').trim().toLowerCase()
  if (!q) return null
  return orders.find((o) => o.id.toLowerCase().includes(q) || String(o.contact).toLowerCase().includes(q) || o.productName.toLowerCase().includes(q)) || null
}
