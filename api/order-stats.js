// 终极安全版本 - 无网络请求，无复杂逻辑
export default async function handler(request) {
  // 立即返回，不做任何等待
  const data = {
    status: "online",
    message: "API is working from Vercel.",
    timestamp: Date.now()
  };
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
