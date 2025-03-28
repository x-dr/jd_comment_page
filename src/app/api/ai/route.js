export const runtime = 'edge';

export async function POST(request) {
  // 设置 API URL 和密钥
  const API_URL =  process.env.API_URL || "https://api.deepseek.com/v1/chat/completions"; // 使用环境变量指定 API URL，默认为 DeepSeek API
  const API_KEY = process.env.API_KEY; // 确保你已经设置了环境变量 DEEPL_API_KEY
  const MODEL = process.env.MODEL || "deepseek-chat"; // 使用环境变量指定模型，默认为 "deepseek-chat" 
  if (!API_KEY ) {
    return new Response(
      JSON.stringify({
        status: 0,
        data: "API 密钥未设置"
      }),
      {
        status: 500,
        headers: { 'content-type': 'application/json' },
      }
    );
  }
  // 检查请求体是否存在

  try {
    let { title } = await request.json()

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        // model: "pro-128k",
        model: MODEL,
        messages: [
          { role: "system", content: "你是一个京东评价工具" },
          { role: "user", content: `写一段关于“${title}”商品的评价，含有emoji表情，简短、口语化,要200个字。` }
        ],
        stream: false
      })
    });


    const res = await response.json()

    // console.log("AI Response:", res); // 日志输出 AI 的响应内容
    


    const comment = res?.choices?.[0]?.message?.content || "生成失败";

    return Response.json({ status: 1, comment: comment });

  } catch (error) {

    return new Response(
      JSON.stringify({
        status: 0,
        data: `Webhook error: ${error.message}`
      }),
      {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }
    );
  }


}




