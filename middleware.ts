import { NextRequest, NextResponse } from "next/server";

/**
 * 🎯 最简单可靠的方案：只提供 /preview 端点
 *
 * 核心思路：
 * 1. 完全移除复杂的检测逻辑
 * 2. 只提供 /preview 端点返回静态 HTML
 * 3. 在 Vercel 项目设置中配置预览 URL 为 /preview
 * 4. 普通用户访问根路径时，正常显示主页
 *
 * 这样：
 * - Vercel 截图生成器访问 /preview → 返回静态 HTML ✅
 * - 普通用户访问 / → 正常显示主页 ✅
 * - 不需要复杂的检测逻辑 ✅
 */

/**
 * 生成完全静态的预览 HTML
 */
function generateStaticPreviewHTML(): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";

  return `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>PeriodHub - 专业痛经缓解和月经健康管理平台</title>
  <meta name="description" content="提供42篇专业文章、8个实用工具，帮助女性科学管理月经健康，快速缓解痛经。基于医学研究的个性化建议，中西医结合的健康方案。" />

  <!-- Open Graph 标签用于预览 -->
  <meta property="og:title" content="PeriodHub - 专业痛经缓解和月经健康管理平台" />
  <meta property="og:description" content="提供42篇专业文章、8个实用工具，帮助女性科学管理月经健康，快速缓解痛经。" />
  <meta property="og:image" content="${baseUrl}/images/hero-bg.jpg" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${baseUrl}" />

  <!-- Twitter Card 标签 -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="PeriodHub - 专业痛经缓解和月经健康管理平台" />
  <meta name="twitter:description" content="提供42篇专业文章、8个实用工具，帮助女性科学管理月经健康，快速缓解痛经。" />
  <meta name="twitter:image" content="${baseUrl}/images/hero-bg.jpg" />
</head>
<body style="margin: 0; padding: 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; color: white;">
  <div style="text-align: center; padding: 2rem; max-width: 600px;">
    <h1 style="font-size: 3rem; margin-bottom: 1rem; font-weight: bold;">PeriodHub</h1>
    <h2 style="font-size: 1.5rem; margin-bottom: 1rem; opacity: 0.9;">专业痛经缓解和月经健康管理平台</h2>
    <p style="font-size: 1.2rem; opacity: 0.8; line-height: 1.6; margin-bottom: 2rem;">提供42篇专业文章、8个实用工具，帮助女性科学管理月经健康，快速缓解痛经。</p>
    <div style="margin-top: 2rem; padding: 1rem; background-color: rgba(255,255,255,0.1); border-radius: 8px;">
      <p style="font-size: 1rem; opacity: 0.7;">Vercel Preview Mode - 截图生成中...</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * 中间件 - 最简单的方案
 * 只提供 /preview 端点，不进行任何检测
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 只处理 /preview 路径
  if (pathname === "/preview") {
    return new NextResponse(generateStaticPreviewHTML(), {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "X-Preview-Path": "/preview",
      },
    });
  }

  // 对于所有其他请求（包括根路径），继续正常处理
  // 让 app/page.tsx 处理语言检测和重定向
  return NextResponse.next();
}

export const config = {
  matcher: ["/preview"],
};
