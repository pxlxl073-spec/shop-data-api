export default async function handler(request) {
  // 1. 极简参数解析，避免任何复杂操作
  const urlStr = request.url || '';
  const customerId = (urlStr.match(/customer_id=([^&]+)/) || [])[1] || '未提供ID';

  // 2. 立即返回固定数据，不进行任何外部网络请求、循环或复杂计算
  const responseData = {
    pending_payment: 3,
    pending_shipment: 1,
    shipped: 2,
    completed: 8,
    total: 14,
    debug_note: '数据来自Vercel模拟接口。请确认店匠API Token与端点是否正确。',
    timestamp: new Date().toISOString().split('T')[0] // 仅返回日期
  };

  // 3. 立即返回响应
  return new Response(
    JSON.stringify(responseData, null, 2), // 美化输出，方便阅读
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // 允许您的网站调用
      },
    }
  );
}
