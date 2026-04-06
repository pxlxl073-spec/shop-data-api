export default async function handler(request) {
  // 🔐 安全凭证（请确认以下两行信息是你的）
  const SHOP_TOKEN = 'VTnevNcTWaQ7If30uEQNv9raikAlOvOTNBVixQSqNH4'; // 你的店匠Token
  const SHOP_DOMAIN = 'www.factorydolls.com'; // 你的店铺域名
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
    const response = await fetch(
      `https://${SHOP_DOMAIN}/openapi/${API_VERSION}/orders?customer_id=${customerId}&limit=250&status=any`,
      {
        headers: {
          'Authorization': `Bearer ${SHOP_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`店匠API请求失败: ${response.status}`);
    }

    const ordersData = await response.json();
    const orders = ordersData.orders || [];

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
