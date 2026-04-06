// 极速响应版本 - 不调用任何外部API
export default async function handler(request) {
  console.log('函数被调用，URL:', request.url);
  
  // 立即返回固定数据，不进行任何网络请求
  const data = {
    pending_payment: 5,
    pending_shipment: 3,
    shipped: 8,
    completed: 12,
    total: 28,
    timestamp: new Date().toISOString(),
    note: "这是模拟数据，用于确认API通道正常"
  };
  
  // 立即响应，不等待
  return new Response(
    JSON.stringify(data, null, 2),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
      }
    }
  );
}
