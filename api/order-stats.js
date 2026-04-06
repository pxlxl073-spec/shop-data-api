export default async function handler(request) {
  // 🔐 安全凭证（请再次确认以下两行信息！）
  const SHOP_TOKEN = 'VTnevNcTWaQ7If30uEQNv9raikAlOvOTNBVixQSqNH4'; // 注意：是 `30uEQNv`，不是 `30euEQNv`
  const SHOP_DOMAIN = 'www.factorydolls.com'; // 注意：是 `factorydolls.com`，不是 `factorydollis.com`
  const API_VERSION = '2025-06';

  const url = new URL(request.url);
  const customerId = url.searchParams.get('customer_id');

  if (!customerId) {
    return new Response(
      JSON.stringify({ error: '缺少客户ID参数 (customer_id)' }),
      { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }

  try {
    // 调用店匠官方API
    const apiUrl = `https://${SHOP_DOMAIN}/openapi/${API_VERSION}/orders?customer_id=${customerId}&limit=250&status=any`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${SHOP_TOKEN}`, // 注意：这里使用的是反引号 `，不是单引号 '
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`店匠API请求失败: ${response.status}`);
    }

    const ordersData = await response.json();
    const orders = ordersData.orders || [];

    // 统计各状态订单数量
    const stats = {
      pending_payment: 0,   // 待付款
      pending_shipment: 0,  // 待发货
      shipped: 0,           // 已发货/待收货
      completed: 0,         // 已完成
      total: orders.length  // 全部订单
    };

    orders.forEach(order => {
      if (order.financial_status === 'pending' || order.financial_status === 'partially_paid') {
        stats.pending_payment++;
      }
      if (order.fulfillment_status === 'pending') {
        stats.pending_shipment++;
      } else if (order.fulfillment_status === 'fulfilled' || order.fulfillment_status === 'partial') {
        stats.shipped++;
      }
      if (order.order_status === 'closed') {
        stats.completed++;
      }
    });

    return new Response(
      JSON.stringify(stats),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );

  } catch (error) {
    console.error('Function Error:', error);
    return new Response(
      JSON.stringify({ error: '获取订单数据时发生内部错误' }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }
}
