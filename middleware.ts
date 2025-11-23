import { NextRequest, NextResponse } from "next/server";

/**
 * 增强的 Vercel 预览请求检测
 * 在 Middleware 层面检测，确保在最早阶段处理
 *
 * 修复策略：
 * 1. 在 Vercel 预览环境中，对所有根路径请求返回预览内容（最可靠）
 * 2. 检测所有可能的 Vercel 标识（User-Agent、请求头、域名等）
 * 3. 使用更宽松的检测策略，确保预览功能正常工作
 */
function detectVercelPreviewRequest(request: NextRequest): boolean {
  try {
    // 策略 1: 最可靠的检测 - Vercel 预览环境变量
    // 在 Vercel 预览环境中，对所有根路径请求返回预览内容
    const isVercelEnvironment = process.env.VERCEL === "1";
    const isVercelPreviewEnv = process.env.VERCEL_ENV === "preview";

    // 如果是 Vercel 预览环境，直接返回 true（最可靠的方法）
    if (isVercelEnvironment && isVercelPreviewEnv) {
      return true;
    }

    // 策略 2: 检测请求头和 User-Agent
    const userAgent = request.headers.get("user-agent") || "";
    const referer = request.headers.get("referer") || "";
    const host = request.headers.get("host") || "";
    const xForwardedFor = request.headers.get("x-forwarded-for") || "";

    // 检查所有可能的 Vercel 预览标识
    const xVercelId = request.headers.get("x-vercel-id");
    const xVercelDeployment = request.headers.get("x-vercel-deployment");
    const xVercelSignature = request.headers.get("x-vercel-signature");

    // 检测常见的预览服务User-Agent（更精确的匹配）
    const previewAgents = [
      "vercel",
      "screenshot",
      "headless",
      "puppeteer",
      "playwright",
      "chromium",
      "bot",
      "crawler",
      "firefox/92.0", // Vercel截图使用的Firefox版本
      "firefox/", // 更通用的Firefox检测
      "chrome/", // Chromium 检测
    ];

    const isPreviewAgent = previewAgents.some((agent) =>
      userAgent.toLowerCase().includes(agent),
    );

    // 检测是否是Vercel的预览请求
    const isVercelReferer =
      referer.includes("vercel.app") ||
      referer.includes("vercel.com") ||
      xForwardedFor.includes("vercel");

    // 检测 Vercel 特定的请求头
    const hasVercelHeaders =
      !!xVercelId || !!xVercelDeployment || !!xVercelSignature;

    // 策略 3: 检测预览部署的特定域名模式
    // 预览部署通常使用特定的域名模式：*-git-*-*.vercel.app
    // 生产部署通常使用：*-*.vercel.app 或自定义域名
    // 更宽松的策略：在 Vercel 环境中，所有 .vercel.app 域名的根路径都可能是预览请求
    const isPreviewDomain =
      host.includes("-git-") || // 预览部署的典型模式
      (isVercelEnvironment &&
        host.includes(".vercel.app") &&
        !host.includes("www.") &&
        !host.includes("periodhub.health")); // 排除生产域名

    // 综合判断：如果检测到任何预览特征，返回 true
    if (
      isPreviewAgent ||
      isVercelReferer ||
      hasVercelHeaders ||
      isPreviewDomain
    ) {
      return true;
    }

    // 默认返回false，确保正常用户请求不会被误判
    return false;
  } catch {
    // 如果检测过程中出错，在 Vercel 环境中返回 true（安全策略）
    // 这样可以确保预览功能不会因为检测错误而失败
    return process.env.VERCEL === "1" && process.env.VERCEL_ENV === "preview";
  }
}

/**
 * 生成完全静态的预览 HTML
 * 不包含任何 JavaScript，确保 Vercel 截图生成器可以立即截取
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
 * 中间件 - 在最早阶段检测并处理 Vercel 预览请求
 * 如果检测到预览请求，直接返回静态 HTML，避免任何重定向或动态内容
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 处理根路径请求和预览路径
  if (pathname === "/" || pathname === "/preview") {
    // 策略 1: 如果是 /preview 路径，直接返回预览内容（最可靠）
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

    // 策略 2: 检测是否是 Vercel 预览请求
    const isPreview = detectVercelPreviewRequest(request);

    if (isPreview) {
      // 直接返回完全静态的 HTML 响应
      // 不包含任何 JavaScript，确保 Vercel 截图生成器可以立即截取
      return new NextResponse(generateStaticPreviewHTML(), {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          // 设置缓存头，避免缓存问题
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
          // 添加调试头（可选）
          "X-Preview-Detected": "true",
          "X-Preview-Path": pathname,
        },
      });
    }
  }

  // 对于非预览请求，继续正常处理
  // 让 app/page.tsx 处理语言检测和重定向
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/preview"],
};
