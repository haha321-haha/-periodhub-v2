import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n/request";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
  localePrefix: "always", // 🎯 修复重定向循环：始终使用语言前缀
});

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    // 排除静态文件路径，避免国际化中间件干扰
    if (
      (pathname.startsWith("/downloads/") &&
        (pathname.endsWith(".html") || pathname.endsWith(".pdf"))) ||
      pathname.startsWith("/styles/") ||
      pathname.startsWith("/scripts/") ||
      pathname.startsWith("/images/") ||
      pathname.startsWith("/icons/") ||
      pathname.startsWith("/fonts/") ||
      pathname.includes("/icon") ||
      pathname.includes("/favicon") ||
      pathname.endsWith(".png") ||
      pathname.endsWith(".ico") ||
      pathname.endsWith(".svg") ||
      pathname.endsWith(".jpg") ||
      pathname.endsWith(".jpeg") ||
      pathname.endsWith(".gif") ||
      pathname.endsWith(".webp")
    ) {
      return NextResponse.next();
    }

    // 🎯 手动处理重定向，确保返回301状态码
    if (pathname === '/teen-health') {
      const redirectUrl = new URL('/zh/teen-health', request.url);
      return NextResponse.redirect(redirectUrl, 301);
    }
    
    if (pathname === '/articles') {
      // 检查Accept-Language头部
      const acceptLanguage = request.headers.get('accept-language') || '';
      const isChinese = acceptLanguage.includes('zh');
      const redirectPath = isChinese ? '/zh/downloads' : '/en/downloads';
      const redirectUrl = new URL(redirectPath, request.url);
      return NextResponse.redirect(redirectUrl, 301);
    }
    
    if (pathname === '/zh/assessment') {
      const redirectUrl = new URL('/zh/interactive-tools/symptom-assessment', request.url);
      return NextResponse.redirect(redirectUrl, 301);
    }
    
    if (pathname === '/assessment') {
      const redirectUrl = new URL('/en/interactive-tools/symptom-assessment', request.url);
      return NextResponse.redirect(redirectUrl, 301);
    }

    // 记录请求信息用于调试
    if (process.env.NODE_ENV === "development") {
      console.log(`[Middleware] Processing: ${pathname}`);
    }

    // 添加pathname到headers供layout使用
    const response = intlMiddleware(request);
    if (response) {
      response.headers.set("x-pathname", pathname);
    }
    
    return response;
  } catch (error) {
    console.error("[Middleware] Error processing request:", error);
    console.error("[Middleware] Request pathname:", pathname);
    console.error("[Middleware] Request URL:", request.url);

    // 返回默认响应而不是崩溃
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json|icon.svg|apple-touch-icon.png|images|styles|scripts|fonts|icons).*)",
  ],
};
