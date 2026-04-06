export default async function handler(request) {
  // 🔴 关键检查点1：请确认以下两行信息完全正确！
  const SHOP_TOKEN = 'VTnevNcTWaQ7If30uEQNv9raikAlOvOTNBVixQSqNH4'; // 您的店匠Token
  const SHOP_DOMAIN = 'www.factorydolls.com'; // 您的店铺域名，确保没有拼写错误
  const API_VERSION = '2025-06'; // 如出错，可尝试改为 '2024-01'

  const url = new URL(request.url);
  const customerId = url.searchParams.get('customer_id');

  if (!customerId) {
    return new Response(
      JSON.stringify({ error: '缺少客户ID参数 (customer_id)' }),
      { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }

  try {
    // 🔴 关键检查点2：这是最可能出错的URL拼接行
    // 格式必须为：https://您的店铺域名.myshoplaza.com/openapi/版本/orders?...
    const apiUrl = `https://${SHOP_DOMAIN}/openapi/${API_VERSION}/orders?customer_id=${customerId}&limit=250&status=any`;
    console.log('正在请求店匠API，URL:', apiUrl); // 这行日志会帮助调试

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${SHOP_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('店匠API返回错误:', response.status, errorText);
      throw new Error(`店匠API请求失败: ${response.status}`);
    }

    const ordersData = await response.json();
    const orders = ordersData.orders || [];

    const stats = {
      pending_payment: 0,
      pending_shipment: 0,
      shipped: 0,
      completed: 0,
      total: orders.length
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
    // 详细的错误日志将出现在Vercel Logs中
    console.error('API函数执行失败，错误详情:', error.message, error.stack);
    return new Response(
      JSON.stringify({ 
        error: '获取订单数据失败',
        detail: error.message // 此信息会出现在返回的JSON中，便于调试
      }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }
}
