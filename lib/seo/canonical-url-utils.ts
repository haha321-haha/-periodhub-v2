/**
 * Canonical URL 统一配置工具
 * 解决Google Search Console重复网页问题
 */

import { Metadata } from "next";

// 基础URL配置
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";

// 生成标准化的canonical URL
export function generateCanonicalUrl(locale: string, path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_URL}/${locale}${cleanPath}`;
}

// 生成标准化的hreflang配置
export function generateHreflangUrls(locale: string, path: string) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  return {
    "zh-CN": `${BASE_URL}/zh${cleanPath}`,
    "en-US": `${BASE_URL}/en${cleanPath}`,
    "x-default": `${BASE_URL}/en${cleanPath}`, // ✅ 修复：默认英文版本（北美市场优先）
  };
}

// 生成完整的alternates配置
export function generateAlternatesConfig(locale: string, path: string) {
  const canonical = generateCanonicalUrl(locale, path);
  const languages = generateHreflangUrls(locale, path);
  
  return {
    canonical,
    languages,
  };
}

// 生成标准化的页面元数据
export function generateStandardPageMetadata({
  locale,
  path,
  title,
  description,
  keywords = [],
  noindex = false,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  noindex?: boolean;
}): Metadata {
  const alternates = generateAlternatesConfig(locale, path);
  
  return {
    title,
    description,
    keywords: keywords.join(", "),
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName: "PeriodHub",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// 验证canonical URL是否正确
export function validateCanonicalUrl(url: string): boolean {
  return url.startsWith(BASE_URL) && url.includes("/zh/") || url.includes("/en/");
}

// 修复常见的canonical URL问题
export function fixCanonicalUrl(url: string): string {
  // 移除重复的路径
  let fixedUrl = url.replace(/\/+/g, "/");
  
  // 确保以正确的域名开始
  if (!fixedUrl.startsWith(BASE_URL)) {
    fixedUrl = BASE_URL + fixedUrl;
  }
  
  // 确保包含语言前缀
  if (!fixedUrl.includes("/zh/") && !fixedUrl.includes("/en/")) {
    // 如果没有语言前缀，默认添加中文前缀
    const path = fixedUrl.replace(BASE_URL, "");
    fixedUrl = `${BASE_URL}/zh${path}`;
  }
  
  return fixedUrl;
}
