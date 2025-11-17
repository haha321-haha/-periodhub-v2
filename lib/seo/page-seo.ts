import { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/canonical-config";
import { generateAdvancedMeta } from "@/lib/seo-meta";

// 结构化数据类型
export type StructuredDataType = 
  | "WebPage"
  | "Article"
  | "SoftwareApplication"
  | "MedicalWebPage"
  | "HealthAndBeautyBusiness"
  | "CollectionPage"
  | "Organization";

interface GeneratePageSEOParams {
  locale: "en" | "zh";
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  structuredDataType?: StructuredDataType;
  additionalStructuredData?: Record<string, any>;
  noindex?: boolean;
  ogImage?: string;
}

interface GeneratePageSEOResult {
  metadata: Metadata;
  structuredData: string;
}

// 生成页面SEO元数据和结构化数据
export function generatePageSEO({
  locale,
  path,
  title,
  description,
  keywords = [],
  structuredDataType = "WebPage",
  additionalStructuredData = {},
  noindex = false,
  ogImage = "/og-default.jpg",
}: GeneratePageSEOParams): GeneratePageSEOResult {
  const canonicalUrl = getCanonicalUrl(locale, path);
  
  // 基础结构化数据
  const baseStructuredData: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": structuredDataType,
    name: title,
    description: description,
    url: canonicalUrl,
    inLanguage: locale === "zh" ? "zh-CN" : "en-US",
    isPartOf: {
      "@type": "WebSite",
      name: "PeriodHub",
      url: getCanonicalUrl(locale, ""),
    },
  };

  // 合并额外的结构化数据
  const structuredData = {
    ...baseStructuredData,
    ...additionalStructuredData,
  };

  // 生成元数据
  const metadata = generateAdvancedMeta({
    title,
    description,
    keywords,
    canonical: canonicalUrl,
    ogImage,
    noindex,
    structuredData: JSON.stringify(structuredData),
  });

  return {
    metadata,
    structuredData: JSON.stringify(structuredData),
  };
}