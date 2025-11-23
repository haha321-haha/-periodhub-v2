import { NextRequest, NextResponse } from "next/server";

/**
 * 自定义中间件处理根路径重定向
 * 解决 next-intl 和 Vercel 自动重定向导致的冲突
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 只处理根路径
  if (pathname === "/") {
    const userAgent = request.headers.get("user-agent") || "";
    const acceptLanguage = request.headers.get("accept-language") || "";

    // 检测是否是预览请求
    const isPreviewRequest =
      userAgent.toLowerCase().includes("vercel") ||
      userAgent.toLowerCase().includes("screenshot") ||
      userAgent.toLowerCase().includes("headless") ||
      userAgent.toLowerCase().includes("puppeteer") ||
      userAgent.toLowerCase().includes("playwright");

    // 检测用户语言偏好
    let targetLocale = "zh"; // 默认中文
    if (acceptLanguage.toLowerCase().startsWith("en")) {
      targetLocale = "en";
    }

    if (isPreviewRequest) {
      // 预览请求：返回静态预览页面，不重定向
      return NextResponse.rewrite(new URL("/preview", request.url));
    } else {
      // 普通请求：返回带有立即重定向的页面
      return NextResponse.rewrite(
        new URL(`/redirect?target=${targetLocale}`, request.url),
      );
    }
  }

  // 其他路径正常处理
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
