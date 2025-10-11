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

  // 添加调试信息
  console.log(`[Middleware] Processing: ${pathname}`);

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
      console.log(`[Middleware] Redirecting /teen-health to /zh/teen-health`);
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

    // 🎯 处理重复的downloads页面重定向 - 支持多语言检测
    if (pathname === '/download-center' || pathname === '/downloads-new' || pathname === '/articles-pdf-center') {
      // 检查Accept-Language头部
      const acceptLanguage = request.headers.get('accept-language') || '';
      const isChinese = acceptLanguage.includes('zh');
      const redirectPath = isChinese ? '/zh/downloads' : '/en/downloads';
      console.log(`[Middleware] Redirecting ${pathname} to ${redirectPath} (Accept-Language: ${acceptLanguage})`);
      const redirectUrl = new URL(redirectPath, request.url);
      return NextResponse.redirect(redirectUrl, 301);
    }

    // 🎯 修复错误的 /downloads/immediate-relief 路径
    if (pathname === '/zh/downloads/immediate-relief' || pathname === '/en/downloads/immediate-relief') {
      // 带语言前缀的情况: /zh/downloads/immediate-relief → /zh/immediate-relief
      const correctPath = pathname.replace('/downloads/immediate-relief', '/immediate-relief');
      console.log(`[Middleware] Redirecting ${pathname} to ${correctPath}`);
      const redirectUrl = new URL(correctPath, request.url);
      return NextResponse.redirect(redirectUrl, 301);
    }
    if (pathname === '/downloads/immediate-relief') {
      // 不带语言前缀的情况: /downloads/immediate-relief → 根据语言检测
      const acceptLanguage = request.headers.get('accept-language') || '';
      const isChinese = acceptLanguage.includes('zh');
      const redirectPath = isChinese ? '/zh/immediate-relief' : '/en/immediate-relief';
      console.log(`[Middleware] Redirecting ${pathname} to ${redirectPath} (Accept-Language: ${acceptLanguage})`);
      const redirectUrl = new URL(redirectPath, request.url);
      return NextResponse.redirect(redirectUrl, 301);
    }

    // 🎯 修复错误的 /downloads/articles/ 路径 - 重定向到 /articles/
    if (pathname.match(/^\/(zh|en)\/downloads\/articles\/.+/)) {
      // 带语言前缀的情况: /zh/downloads/articles/* → /zh/articles/*
      const correctPath = pathname.replace('/downloads/articles/', '/articles/');
      console.log(`[Middleware] Redirecting ${pathname} to ${correctPath}`);
      const redirectUrl = new URL(correctPath, request.url);
      return NextResponse.redirect(redirectUrl, 301);
    }
    if (pathname.match(/^\/downloads\/articles\/.+/)) {
      // 不带语言前缀的情况: /downloads/articles/* → 根据语言检测
      const acceptLanguage = request.headers.get('accept-language') || '';
      const isChinese = acceptLanguage.includes('zh');
      const articleSlug = pathname.replace('/downloads/articles/', '');
      const redirectPath = isChinese ? `/zh/articles/${articleSlug}` : `/en/articles/${articleSlug}`;
      console.log(`[Middleware] Redirecting ${pathname} to ${redirectPath} (Accept-Language: ${acceptLanguage})`);
      const redirectUrl = new URL(redirectPath, request.url);
      return NextResponse.redirect(redirectUrl, 301);
    }

    // 🎯 通用修复: 处理所有错误的 /downloads/[section] 路径（除了已处理的特殊情况）
    // 排除: articles, immediate-relief, medication-guide, preview (这些有专门的处理)
    if (pathname.match(/^\/(zh|en)\/downloads\/(?!articles|immediate-relief|medication-guide|preview)[^\/\?]+/)) {
      // 中文路径到英文路径的映射
      const chineseToEnglishMap: { [key: string]: string } = {
        '青少年健康': 'teen-health',
        '健康指南': 'health-guide',
        '场景解决方案': 'scenario-solutions',
        '交互式工具': 'interactive-tools',
        '自然疗法': 'natural-therapies',
        '立即救济': 'immediate-relief',
        '文化魅力': 'cultural-charms',
        '隐私政策': 'privacy-policy',
        '服务条款': 'terms-of-service',
        '医疗免责声明': 'medical-disclaimer'
      };
      
      // 提取section部分
      const sectionMatch = pathname.match(/^\/(zh|en)\/downloads\/([^\/]+)/);
      console.log(`[Middleware] Generic redirect check: ${pathname}, sectionMatch:`, sectionMatch);
      if (sectionMatch) {
        const [, locale, section] = sectionMatch;
        console.log(`[Middleware] Extracted - locale: ${locale}, section: ${section}`);
        // 检查是否是中文路径，如果是则映射到英文路径
        const englishSection = chineseToEnglishMap[section] || section;
        const correctPath = `/${locale}/${englishSection}`;
        console.log(`[Middleware] Chinese path redirect: ${pathname} to ${correctPath}`);
        const redirectUrl = new URL(correctPath, request.url);
        return NextResponse.redirect(redirectUrl, 301);
      }
    }
    if (pathname.match(/^\/downloads\/(?!articles|immediate-relief|medication-guide|preview)[^\/]+/)) {
      // 不带语言前缀的情况: /downloads/[section]/* → 根据语言检测
      const acceptLanguage = request.headers.get('accept-language') || '';
      const isChinese = acceptLanguage.includes('zh');
      // 正确提取section路径：从 /downloads/interactive-tools 提取 interactive-tools
      const sectionPath = pathname.substring('/downloads/'.length);
      const redirectPath = isChinese ? `/zh/${sectionPath}` : `/en/${sectionPath}`;
      console.log(`[Middleware] Generic redirect: ${pathname} to ${redirectPath} (Accept-Language: ${acceptLanguage})`);
      const redirectUrl = new URL(redirectPath, request.url);
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
    // 包含所有路径，除了静态文件
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json|icon.svg|apple-touch-icon.png|images|styles|scripts|fonts|icons).*)",
    // 特别包含我们要处理的路径
    "/teen-health",
    "/articles", 
    "/zh/assessment",
    "/assessment",
    "/download-center",
    "/downloads-new",
    "/articles-pdf-center"
  ],
};
