export default async function handler(request) {
  // 🔍 侦察目标1：确认我们的凭证和基础信息
  const SHOP_TOKEN = 'VTnevNcTWaQ7If30uEQNv9raikAlOvOTNBVixQSqNH4';
  const SHOP_DOMAIN = 'www.factorydolls.com';
  const API_VERSION = '2024-01'; // 改为更稳定的旧版本
  const url = new URL(request.url);
  const customerId = url.searchParams.get('customer_id') || '未提供ID';

  // 立即在日志中打印我们拥有的所有信息
  console.log('=== 侦察开始 ===');
  console.log('客户ID:', customerId);
  console.log('店铺域名:', SHOP_DOMAIN);
  console.log('API版本:', API_VERSION);
  console.log('Token前10位:', SHOP_TOKEN.substring(0, 10) + '...');

  // 🔍 侦察目标2：测试几种可能的店匠API根地址格式
  const possibleBaseUrls = [
    `https://${SHOP_DOMAIN}/openapi/${API_VERSION}`,
    `https://${SHOP_DOMAIN}/api/${API_VERSION}`,
    `https://api.shoplazza.com/${API_VERSION}`,
    `https://${SHOP_DOMAIN}.myshoplaza.com/api/${API_VERSION}`,
  ];

  console.log('--- 测试以下可能的API基地址 ---');
  possibleBaseUrls.forEach((baseUrl, index) => {
    console.log(`选项 ${index + 1}: ${baseUrl}`);
  });

  // 构建一个测试URL（不带customer_id，用于测试连接和权限）
  const testUrl = `https://${SHOP_DOMAIN}/openapi/${API_VERSION}/shop`;
  console.log('--- 即将尝试请求的测试URL ---');
  console.log('URL:', testUrl);

  try {
    const response = await fetch(testUrl, {
      headers: {
        'Authorization': `Bearer ${SHOP_TOKEN}`,
        'Accept': 'application/json',
      },
    });

    console.log('--- 请求结果 ---');
    console.log('状态码:', response.status);
    console.log('状态文本:', response.statusText);

    if (!response.ok) {
      // 即使失败，也尝试读取错误信息
      const errorText = await response.text().catch(() => '无法读取响应体');
      console.log('错误响应体:', errorText.substring(0, 200)); // 只截取前200字符
    } else {
      const data = await response.json();
      console.log('成功! 响应数据结构:', Object.keys(data));
    }

  } catch (fetchError) {
    console.error('--- 请求过程中抛出异常 ---');
    console.error('错误名称:', fetchError.name);
    console.error('错误信息:', fetchError.message);
    // 如果是URL错误，这里会捕获到
    if (fetchError.message.includes('Invalid URL') || fetchError.name === 'TypeError') {
      console.error('🔥 确认是URL格式错误！问题出在地址拼接。');
    }
  }

  console.log('=== 侦察结束 ===');

  // 返回一个清晰的错误信息，以便在浏览器中查看
  return new Response(
    JSON.stringify({ 
      message: '侦察完成，请查看Vercel控制台的“Logs”获取详细信息。',
      instruction: '关键信息已打印在日志中，请将最新的日志截图发给助手。'
    }),
    { 
      status: 500, // 故意返回500，以便在日志中记录这次侦察
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      } 
    }
  );
}
