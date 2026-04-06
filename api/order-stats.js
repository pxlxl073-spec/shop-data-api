export default async function handler(request) {
  // 1. 安全地解析查询参数
  const queryString = request.url.includes('?') ? request.url.split('?')[1] : '';
  const params = new URLSearchParams(queryString);
  const customerId = params.get('customer_id');
  
  console.log(`[INFO] 收到请求，客户ID: ${customerId || '未提供'}`);

  // 2. 根据客户ID，返回预设的模拟数据（您可以根据需要修改数字）
  // 如果customerId存在，模拟一个已登录用户的数据；否则为未登录状态（0）
  const isLoggedIn = customerId && customerId.length > 5;
  
  const mockStats = isLoggedIn ? {
    pending_payment: 2,   // 待付款
    pending_shipment: 1,  // 待发货
    shipped: 3,           // 待收货
    completed: 5,         // 已完成
    total: 11,            // 全部订单
    _note: '当前为模拟数据。正在配置真实店匠API，即将上线。'
  } : {
    pending_payment: 0,
    pending_shipment: 0,
    shipped: 0,
    completed: 0,
    total: 0,
    _note: '用户未登录或ID无效。'
  };

  // 3. 立即返回成功的响应
  return new Response(
    JSON.stringify(mockStats),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}
