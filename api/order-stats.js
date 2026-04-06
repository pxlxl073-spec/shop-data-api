export default async function (request) {
  // 1. 安全解析参数，避免任何可能的URL解析错误
  let customerId = '未提供';
  try {
    const url = new URL(request.url);
    customerId = url.searchParams.get('customer_id') || customerId;
  } catch (e) {
    // 如果URL解析失败，尝试从原始字符串中解析
    const match = request.url.match(/customer_id=([^&]+)/);
    if (match) customerId = match[1];
  }

  // 2. 立即返回模拟的成功数据，不进行任何外部网络调用
  const mockData = {
    pending_payment: 2,
    pending_shipment: 1,
    shipped: 3,
    completed: 5,
    total: 11,
    debug: {
      received_customer_id: customerId,
      message: "此数据为模拟数据，用于确认API通道畅通。",
      timestamp: new Date().toISOString()
    }
  };

  // 3. 返回成功响应
  return new Response(
    JSON.stringify(mockData, null, 2),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}
