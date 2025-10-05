import { getTranslations } from "next-intl/server";

interface HreflangConfigProps {
  locale: string;
  path: string;
  includeXDefault?: boolean;
}

export async function generateHreflangConfig({
  locale,
  path,
  includeXDefault = true,
}: HreflangConfigProps) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  const hreflangUrls = {
    "zh-CN": `${baseUrl}/zh${cleanPath}`,
    "en-US": `${baseUrl}/en${cleanPath}`,
  };

  if (includeXDefault) {
    hreflangUrls["x-default"] = `${baseUrl}/zh${cleanPath}`; // 默认中文版本
  }

  return hreflangUrls;
}

export function HreflangScript({
  hreflangUrls,
}: {
  hreflangUrls: Record<string, string>;
}) {
  return (
    <>
      {Object.entries(hreflangUrls).map(([lang, url]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
    </>
  );
}

// 增强的语言检测配置
export interface LanguageDetectionConfig {
  geoBasedDetection: boolean;
  browserLanguageDetection: boolean;
  userHistoryDetection: boolean;
  fallbackLanguage: string;
}

export const defaultLanguageDetectionConfig: LanguageDetectionConfig = {
  geoBasedDetection: true,
  browserLanguageDetection: true,
  userHistoryDetection: true,
  fallbackLanguage: "zh",
};

// 多语言内容优化配置
export interface MultilingualContentConfig {
  zh: {
    focus: string;
    keywords: string[];
    culturalContext: string[];
  };
  en: {
    focus: string;
    keywords: string[];
    culturalContext: string[];
  };
}

export const multilingualContentConfig: MultilingualContentConfig = {
  zh: {
    focus: "中医理论、体质调理、传统文化",
    keywords: ["痛经", "月经不调", "中医调理", "体质", "女性健康"],
    culturalContext: ["中医理论", "体质学说", "传统文化", "家庭关怀"],
  },
  en: {
    focus: "Modern medicine, scientific research, evidence-based",
    keywords: [
      "dysmenorrhea",
      "menstrual pain",
      "medical treatment",
      "women's health",
    ],
    culturalContext: [
      "Evidence-based medicine",
      "Scientific research",
      "Clinical studies",
      "Professional care",
    ],
  },
};

// 生成多语言SEO元数据
export async function generateMultilingualSEOMeta({
  locale,
  path,
  title,
  description,
  keywords = [],
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  keywords?: string[];
}) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = `${baseUrl}/${locale}${cleanPath}`;

  // 获取hreflang配置
  const hreflangUrls = await generateHreflangConfig({ locale, path });

  // 根据语言添加文化相关的关键词
  const culturalKeywords =
    multilingualContentConfig[locale as "zh" | "en"].keywords;
  const allKeywords = [...keywords, ...culturalKeywords];

  return {
    canonical: canonicalUrl,
    hreflangUrls,
    keywords: allKeywords,
    language: locale === "zh" ? "zh-CN" : "en-US",
    culturalContext:
      multilingualContentConfig[locale as "zh" | "en"].culturalContext,
  };
}
