import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n/request";

// 🎯 根据 Accept-Language 头部获取首选语言
function getPreferredLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
  
  if (!acceptLanguage) {
    return defaultLocale;
  }
  
  // 解析 Accept-Language 头部
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [locale, qValue] = lang.trim().split(';q=');
      return {
        locale: locale.toLowerCase(),
        quality: qValue ? parseFloat(qValue) : 1.0
      };
    })
    .sort((a, b) => b.quality - a.quality);
  
  // 查找匹配的语言
  for (const { locale } of languages) {
    // 精确匹配
    if (locales.includes(locale as "en" | "zh")) {
      return locale as "en" | "zh";
    }
    
    // 语言代码匹配（如 en-US -> en）
    const languageCode = locale.split('-')[0];
    if (locales.includes(languageCode as "en" | "zh")) {
      return languageCode as "en" | "zh";
    }
  }
  
  // 默认返回中文
  return defaultLocale;
}

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

  // 🎯 立即排除IndexNow密钥文件 - 最高优先级
  if (pathname === '/a3f202e9872f45238294db525b233bf5.txt') {
    return NextResponse.next();
  }

  // 🎯 拦截恶意PHP文件请求 - 直接返回404
  if (pathname.endsWith('.php')) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[Middleware] Blocking malicious PHP request: ${pathname}`);
    }
    return new NextResponse(null, { status: 404 });
  }

  // 🎯 修复 privacy-policy 被误认为 locale 的问题
  if (pathname.startsWith('/privacy-policy/')) {
    // 提取实际路径
    const actualPath = pathname.replace('/privacy-policy/', '/');
    // 根据 Accept-Language 头部动态选择语言
    const preferredLocale = getPreferredLocale(request);
    const redirectUrl = new URL(`/${preferredLocale}${actualPath}`, request.url);
    if (process.env.NODE_ENV === "development") {
      console.log(`[Middleware] Redirecting ${pathname} to /${preferredLocale}${actualPath}`);
    }
    return NextResponse.redirect(redirectUrl, 301);
  }

  // 🎯 修复 terms-of-service 被误认为 locale 的问题
  if (pathname.startsWith('/terms-of-service/')) {
    const actualPath = pathname.replace('/terms-of-service/', '/');
    // 根据 Accept-Language 头部动态选择语言
    const preferredLocale = getPreferredLocale(request);
    const redirectUrl = new URL(`/${preferredLocale}${actualPath}`, request.url);
    if (process.env.NODE_ENV === "development") {
      console.log(`[Middleware] Redirecting ${pathname} to /${preferredLocale}${actualPath}`);
    }
    return NextResponse.redirect(redirectUrl, 301);
  }

  // 🎯 修复中文隐私政策被误认为 locale 的问题
  if (pathname.startsWith('/隐私政策/')) {
    const actualPath = pathname.replace('/隐私政策/', '/');
    const redirectUrl = new URL(`/zh${actualPath}`, request.url);
    if (process.env.NODE_ENV === "development") {
      console.log(`[Middleware] Redirecting ${pathname} to /zh${actualPath}`);
    }
    return NextResponse.redirect(redirectUrl, 301);
  }

  // 🎯 修复中文服务条款被误认为 locale 的问题
  if (pathname.startsWith('/服务条款/')) {
    const actualPath = pathname.replace('/服务条款/', '/');
    const redirectUrl = new URL(`/zh${actualPath}`, request.url);
    if (process.env.NODE_ENV === "development") {
      console.log(`[Middleware] Redirecting ${pathname} to /zh${actualPath}`);
    }
    return NextResponse.redirect(redirectUrl, 301);
  }

  // 🎯 修复中文路径被误认为 locale 的问题
  const chinesePathMappings: { [key: string]: string } = {
    '交互式工具': 'interactive-tools',
    '场景解决方案': 'scenario-solutions',
    '青少年健康': 'teen-health',
    '健康指南': 'health-guide',
    '自然疗法': 'natural-therapies',
    '立即救济': 'immediate-relief',
    '文化魅力': 'cultural-charms',
    '隐私政策': 'privacy-policy',
    '服务条款': 'terms-of-service',
    '医疗免责声明': 'medical-disclaimer'
  };

  // 🎯 递归翻译函数：处理路径中所有中文段
  function translateChinesePath(path: string): string {
    let translatedPath = path;
    let hasChanges = true;
    
    // 循环翻译直到没有更多中文路径段
    while (hasChanges) {
      hasChanges = false;
      for (const [chinesePath, englishPath] of Object.entries(chinesePathMappings)) {
        if (translatedPath.includes(`/${chinesePath}/`)) {
          translatedPath = translatedPath.replace(`/${chinesePath}/`, `/${englishPath}/`);
          hasChanges = true;
        } else if (translatedPath.endsWith(`/${chinesePath}`)) {
          translatedPath = translatedPath.replace(`/${chinesePath}`, `/${englishPath}`);
          hasChanges = true;
        }
      }
    }
    
    return translatedPath;
  }

  // 检查是否是中文路径（不带语言前缀）
  for (const [chinesePath, englishPath] of Object.entries(chinesePathMappings)) {
    if (pathname.startsWith(`/${chinesePath}/`)) {
      // 🎯 使用递归翻译函数处理所有中文段
      const translatedPath = translateChinesePath(pathname);
      const redirectUrl = new URL(`/zh${translatedPath}`, request.url);
      if (process.env.NODE_ENV === "development") {
        console.log(`[Middleware] Redirecting Chinese path ${pathname} to /zh${translatedPath}`);
      }
      return NextResponse.redirect(redirectUrl, 301);
    }
  }

  try {
    // 🎯 关键修复：在路由匹配之前拦截所有静态资源请求
    // 这样可以防止 /images/articles/xxx.jpg 被解析为 [locale]/articles/[slug]
    
    // 1. 检查是否是图片文件（任何位置的图片）
    if (/\.(jpg|jpeg|png|gif|webp|svg|ico|bmp|tiff)$/i.test(pathname)) {
      return NextResponse.next();
    }
    
    // 2. 检查是否以静态资源目录开头
    if (
      pathname.startsWith("/images/") ||
      pathname.startsWith("/static/") ||
      pathname.startsWith("/assets/") ||
      pathname.startsWith("/styles/") ||
      pathname.startsWith("/scripts/") ||
      pathname.startsWith("/icons/") ||
      pathname.startsWith("/fonts/") ||
      pathname.startsWith("/_next/") ||
      pathname.startsWith("/public/")
    ) {
      return NextResponse.next();
    }
    
    // 3. 检查是否是其他静态文件
    if (
      pathname.endsWith(".txt") ||
      pathname.endsWith(".pdf") ||
      pathname.endsWith(".html") ||
      pathname.endsWith(".css") ||
      pathname.endsWith(".js") ||
      pathname.endsWith(".json") ||
      pathname.endsWith(".xml") ||
      pathname.includes("/icon") ||
      pathname.includes("/favicon")
    ) {
      return NextResponse.next();
    }
    
    // 4. 特殊处理：检查路径中是否包含图片文件名模式
    // 例如：/zh/articles/xxx.jpg 或 /images/articles/xxx.jpg
    if (pathname.match(/\/[^\/]+\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
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
    // 🎯 简化matcher配置：只排除明确的系统路径，其他都交给middleware处理
    // 使用精确匹配（带/）避免误排除包含关键字的路径
    '/((?!api/|_next/|favicon\\.ico|sitemap\\.xml|robots\\.txt).*)',
  ],
};
