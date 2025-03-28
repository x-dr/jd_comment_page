export const runtime = 'edge';

export async function POST(request) {
    try {
        let { id, n } = await request.json()
        n = n ? parseInt(n) : 1;
        console.log(id, n);

        const req_ip = request.headers.get('x-forwarded-for') || ""
        const req_ua = request.headers.get('User-Agent') || "mv-api"
        const res = await fetch(`https://club.jd.com/discussion/getProductPageImageCommentList.action?productId=${id}&page=${n}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Referer": request.headers.get('Referer') || "mv-api",
                "x-forwarded-for": req_ip,
                "User-Agent": req_ua,
            }
        })
        // const results = await res.json();
        // const data = {
        //     "status": 1,
        //     "data": results
        //   }

        //   return new Response(JSON.stringify(data), {
        //     status: 200,
        //     headers: {
        //       'content-type': 'application/json',
        //     },
        //   })

        // 读取二进制数据
        const buffer = await res.arrayBuffer();

        // 使用 TextDecoder 处理 GBK 编码
        const text = new TextDecoder("gbk").decode(buffer);

        // 尝试解析 JSON
        const results = JSON.parse(text);

        // 处理数据
        const imageUrls = results?.imgComments?.imgList?.map(item => `https:${item.imageUrl}`) || [];
        const contents = results?.imgComments?.imgList?.map(item => item.commentVo?.content || "") || [];

        // 合并数据并返回
        return new Response(
            JSON.stringify({
                status: 1,
                data: {
                    // ...results,
                    imageUrls,
                    contents
                }
            }),
            {
                status: 200,
                headers: { 'content-type': 'application/json' },
            }
        );

    } catch (error) {
        // return new Response(`Webhook error: ${error.message}`, {
        //     status: 400,
        // })

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




