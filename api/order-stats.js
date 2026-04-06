export default async function handler(request) {
  console.log('🔔 函数被调用，路径：', request.url);
  
  // 1. 使用最安全的方式解析参数
  const queryString = request.url.split('?')[1] || '';
  const params = new URLSearchParams(queryString);
  const customerId = params.get('customer_id') || 'ID_NOT_PROVIDED';

  // 2. 根据ID返回不同的模拟数据（让前端有“动态”的感觉）
  const isLoggedIn = customerId && customerId.length > 10; // 简单判断是否为有效ID
  
  const responseData = isLoggedIn ? {
    pending_payment: 5,
    pending_shipment: 2,
    shipped: 7,
    completed: 15,
    total: 29,
    message: "用户已登录，此为模拟订单数据。真实API配置中。",
    customer_id: customerId.substring(0, 8) + '...' // 隐藏部分ID
  } : {
    pending_payment: 0,
    pending_shipment: 0,
    shipped: 0,
    completed: 0,
    total: 0,
    message: "用户未登录或ID无效。"
  };

  // 3. 立即返回！
  return new Response(
    JSON.stringify(responseData, null, 2),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // 允许您的网站调用
        'X-Response-Source': 'Vercel-Simulated-Data'
      },
    }
  );
}
