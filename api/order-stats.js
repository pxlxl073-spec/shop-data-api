export default async function handler(request) {
  // 1. 不进行任何URL解析，直接打印传入的原始请求对象信息
  console.log('=== 终极简版调试开始 ===');
  console.log('1. 原始请求对象类型:', typeof request);
  console.log('2. 原始 request.url 值:', request.url);
  console.log('3. 请求方法:', request.method);
  
  // 尝试用最安全的方式获取查询参数（不依赖 new URL）
  let customerId = '未找到';
  try {
    // 如果 request.url 是完整URL，可以这样解析
    const queryString = request.url.split('?')[1] || '';
    const params = new URLSearchParams(queryString);
    customerId = params.get('customer_id') || '参数未提供';
  } catch (e) {
    console.log('4. 解析查询参数时出错:', e.message);
  }
  console.log('4. 客户ID (尝试解析):', customerId);
  
  // 2. 硬编码一个绝对正确的店匠API测试地址（不拼接，直接写死）
  const shopToken = 'VTnevNcTWaQ7If30uEQNv9raikAlOvOTNBVixQSqNH4';
  // 尝试两种最可能的店匠API根地址格式
  const testApiUrl = 'https://www.factorydolls.com/openapi/2024-01/shop'; // 格式1
  // 如果上面失败，下次可尝试：'https://api.shoplazza.com/2024-01/shop' 或 'https://www.factorydolls.com/api/2024-01/shop'
  
  console.log('5. 将使用此固定URL测试店匠API连通性:', testApiUrl);
  console.log('6. Token前10位:', shopToken.substring(0, 10) + '...');
  
  // 3. 进行最简单的fetch请求测试
  try {
    console.log('7. 开始发起fetch请求...');
    const response = await fetch(testApiUrl, {
      headers: {
        'Authorization': `Bearer ${shopToken}`,
        'Accept': 'application/json',
      },
    });
    console.log('8. fetch请求完成，状态码:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => '无法读取响应体');
      console.log('9. 请求失败，错误信息:', errorText.substring(0, 300));
    } else {
      const data = await response.json().catch(() => ({}));
      console.log('9. 请求成功! 响应数据键名:', Object.keys(data));
    }
  } catch (fetchError) {
    console.error('10. fetch请求过程发生异常:');
    console.error('   - 错误名称:', fetchError.name);
    console.error('   - 错误信息:', fetchError.message);
    if (fetchError.message.includes('Invalid URL')) {
      console.error('   - 🔥 确认是URL格式错误！问题出在 testApiUrl 变量');
    }
  }
  
  console.log('=== 终极简版调试结束 ===');
  
  // 无论如何都返回一个成功的响应，确保函数不崩溃
  return new Response(
    JSON.stringify({ 
      message: '调试函数执行完毕，请查看Vercel控制台日志。',
      status: 'success',
      debug: { customerId, testApiUrl }
    }),
    { 
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      } 
    }
  );
}
