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

  // 添加调试信息（仅在开发环境）
  if (process.env.NODE_ENV === "development") {
    console.log(`[Middleware] Processing: ${pathname}`);
  }

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
      pathname.endsWith(".webp") ||
      pathname.endsWith(".txt") // 排除.txt文件（包括IndexNow密钥文件）
    ) {
      return NextResponse.next();
    }

    

    // 🎯 处理中文工具路径重定向
    const chineseToolPaths: { [key: string]: string } = {
      '疼痛追踪器': 'pain-tracker',
      '症状评估': 'symptom-assessment', 
      '周期追踪器': 'cycle-tracker',
      '体质测试': 'constitution-test',
      '痛经评估': 'period-pain-assessment',
      '症状追踪器': 'symptom-tracker',
      '营养推荐生成器': 'nutrition-recommendation-generator',
      '职场健康': 'workplace-wellness',
      '职场影响评估': 'workplace-impact-assessment',
      '压力管理': 'stress-management'
    };

    // 处理 /zh/工具名称 的路径（支持 URL 编码）
    const decodedPathname = decodeURIComponent(pathname);
    for (const [chineseName, englishSlug] of Object.entries(chineseToolPaths)) {
      if (pathname === `/zh/${chineseName}` || decodedPathname === `/zh/${chineseName}`) {
        const redirectUrl = new URL(`/zh/interactive-tools/${englishSlug}`, request.url);
        if (process.env.NODE_ENV === "development") {
          console.log(`[Middleware] Redirecting ${pathname} (decoded: ${decodedPathname}) to /zh/interactive-tools/${englishSlug}`);
        }
        return NextResponse.redirect(redirectUrl, 301);
      }
    }
    
    

    // 🎯 处理重复的downloads页面重定向 - 支持多语言检测
    if (pathname === '/download-center' || pathname === '/downloads-new' || pathname === '/articles-pdf-center') {
      // 检查Accept-Language头部
      const acceptLanguage = request.headers.get('accept-language') || '';
      const isChinese = acceptLanguage.includes('zh');
      const redirectPath = isChinese ? '/zh/downloads' : '/en/downloads';
      if (process.env.NODE_ENV === "development") {
        console.log(`[Middleware] Redirecting ${pathname} to ${redirectPath} (Accept-Language: ${acceptLanguage})`);
      }
      const redirectUrl = new URL(redirectPath, request.url);
      return NextResponse.redirect(redirectUrl, 301);
    }

    // 🎯 修复错误的 /downloads/immediate-relief 路径
    if (pathname === '/zh/downloads/immediate-relief' || pathname === '/en/downloads/immediate-relief') {
      // 带语言前缀的情况: /zh/downloads/immediate-relief → /zh/immediate-relief
      const correctPath = pathname.replace('/downloads/immediate-relief', '/immediate-relief');
      if (process.env.NODE_ENV === "development") {
        console.log(`[Middleware] Redirecting ${pathname} to ${correctPath}`);
      }
      const redirectUrl = new URL(correctPath, request.url);
      return NextResponse.redirect(redirectUrl, 301);
    }
    if (pathname === '/downloads/immediate-relief') {
      // 不带语言前缀的情况: /downloads/immediate-relief → 根据语言检测
      const acceptLanguage = request.headers.get('accept-language') || '';
      const isChinese = acceptLanguage.includes('zh');
      const redirectPath = isChinese ? '/zh/immediate-relief' : '/en/immediate-relief';
      if (process.env.NODE_ENV === "development") {
        console.log(`[Middleware] Redirecting ${pathname} to ${redirectPath} (Accept-Language: ${acceptLanguage})`);
      }
      const redirectUrl = new URL(redirectPath, request.url);
      return NextResponse.redirect(redirectUrl, 301);
    }

    // 🎯 修复错误的 /downloads/articles/ 路径 - 重定向到 /articles/
    if (pathname.match(/^\/(zh|en)\/downloads\/articles\/.+/)) {
      // 带语言前缀的情况: /zh/downloads/articles/* → /zh/articles/*
      const correctPath = pathname.replace('/downloads/articles/', '/articles/');
      if (process.env.NODE_ENV === "development") {
        console.log(`[Middleware] Redirecting ${pathname} to ${correctPath}`);
      }
      const redirectUrl = new URL(correctPath, request.url);
      return NextResponse.redirect(redirectUrl, 301);
    }
    if (pathname.match(/^\/downloads\/articles\/.+/)) {
      // 不带语言前缀的情况: /downloads/articles/* → 根据语言检测
      const acceptLanguage = request.headers.get('accept-language') || '';
      const isChinese = acceptLanguage.includes('zh');
      const articleSlug = pathname.replace('/downloads/articles/', '');
      const redirectPath = isChinese ? `/zh/articles/${articleSlug}` : `/en/articles/${articleSlug}`;
      if (process.env.NODE_ENV === "development") {
        console.log(`[Middleware] Redirecting ${pathname} to ${redirectPath} (Accept-Language: ${acceptLanguage})`);
      }
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
      if (sectionMatch) {
        const [, locale, section] = sectionMatch;
        // 检查是否是中文路径，如果是则映射到英文路径
        const englishSection = chineseToEnglishMap[section] || section;
        const correctPath = `/${locale}/${englishSection}`;
        if (process.env.NODE_ENV === "development") {
          console.log(`[Middleware] Chinese path redirect: ${pathname} to ${correctPath}`);
        }
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
      if (process.env.NODE_ENV === "development") {
        console.log(`[Middleware] Generic redirect: ${pathname} to ${redirectPath} (Accept-Language: ${acceptLanguage})`);
      }
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
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json|icon.svg|apple-touch-icon.png|images|styles|scripts|fonts|icons|atom.xml|feed.xml|.*\\.txt).*)",
    // 特别包含我们要处理的路径
    "/download-center",
    "/downloads-new",
    "/articles-pdf-center",
    // 中文工具路径
    "/zh/疼痛追踪器",
    "/zh/症状评估",
    "/zh/周期追踪器",
    "/zh/体质测试",
    "/zh/痛经评估",
    "/zh/症状追踪器",
    "/zh/营养推荐生成器",
    "/zh/职场健康",
    "/zh/职场影响评估",
    "/zh/压力管理"
  ],
};
