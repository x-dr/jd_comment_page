export const runtime = 'edge';

/**
 * 
 * @param {*} params - {url, method, headers, body}
 * @returns {Promise<Response>}
 */
const requestPromise = async (params) => {
  try {
    const response = await fetch(params.url, {
      method: params.method,
      headers: params.headers || {},
      body: params.body ? new URLSearchParams(params.body) : null
    });

    if (response.ok) {
      return response.json(); // 解析 JSON 数据
    } else {
      console.error(`请求失败: ${response.status} ${response.statusText}`);
      return null;
    }
  } catch (error) {
    console.error(`请求错误: ${params.url}`, error);
    return null;
  }
};


export async function POST(request) {
  let { id } = await request.json()
  const res1 = await requestPromise({
    url: `https://apapia-history.manmanbuy.com/ChromeWidgetServices/WidgetServices.ashx`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 - mmbWebBrowse - ios'
    },
    method: 'POST',
    body: {
      'methodName': 'getHistoryTrend',
      'p_url': id
    }
  });

  // console.log('API Response:', res1);
  

  return new Response(
    JSON.stringify({
        status: 0,
        data: res1
    }),
    {
        status: 200,
        headers: { 'content-type': 'application/json' },
    }
);

}