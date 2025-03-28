
## edit .env file

```env
API_URL = "https://spark-api-open.xf-yun.com/v1/chat/completions"
API_KEY = ""

MODEL = "pro-128k" 


# Note:
# 支持列表:
# https://www.xfyun.cn/doc/spark/HTTP%E8%B0%83%E7%94%A8%E6%96%87%E6%A1%A3.html#_1-%E6%8E%A5%E5%8F%A3%E8%AF%B4%E6%98%8E
# https://api-docs.deepseek.com/zh-cn/
```



## Next.js App Router Example
This is a simple example of a Next.js application using the App Router feature. It demonstrates how to create a basic app with routing capabilities.
>  run the development server:
```bash
# Install dependencies
# Make sure you have Node.js installed on your machine.
# You can use npm, yarn, pnpm or bun to install dependencies.

npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

```

## docker 
```bash
docker run -itd \
           --name jd_comment \
           -p 8086:3000 \
           -e API_URL="https://spark-api-open.xf-yun.com/v1/chat/completions" \
           -e API_KEY=" " \
           -e MODEL="pro-128k" \
           --restart=always \
        gindex/jd_comment:latest
```




## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
