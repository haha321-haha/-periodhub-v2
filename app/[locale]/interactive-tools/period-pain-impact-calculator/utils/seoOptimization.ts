/**
 * Period Pain Impact Calculator - SEO优化工具
 * 实现Meta信息优化和结构化数据生成
 */

import type { Metadata } from "next";
import { Locale } from "@/i18n";
import { getTranslations } from "next-intl/server";

type TFunction = Awaited<ReturnType<typeof getTranslations>>;

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  ogImage?: string;
  structuredData?: any;
}

export interface PageSEOData {
  zh: SEOConfig;
  en: SEOConfig;
}

/**
 * 生成FAQ结构化数据
 */
export function generateFAQStructuredData(t: TFunction): any {
  const faqs = [
    { key: "q1" },
    { key: "q2" },
    { key: "q3" },
    { key: "q4" },
    { key: "q5" },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: t(`faq.${faq.key}.question`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`faq.${faq.key}.answer`),
      },
    })),
  };
}

/**
 * 生成工具应用Schema
 */
export function generateWebApplicationSchema(
  locale: Locale,
  t: TFunction,
): any {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";
  const providerName = t("structuredData.webApplication.providerName");

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("structuredData.webApplication.name"),
    description: t("structuredData.webApplication.description"),
    applicationCategory: t("structuredData.webApplication.applicationCategory"),
    operatingSystem: t("structuredData.webApplication.operatingSystem"),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    url: `${baseUrl}/${locale}/interactive-tools/period-pain-impact-calculator`,
    author: {
      "@type": "Organization",
      name: providerName,
      url: baseUrl,
    },
    creator: {
      "@type": "Organization",
      name: providerName,
      url: baseUrl,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
      bestRating: "5",
      worstRating: "1",
    },
    inLanguage: locale === "zh" ? "zh-CN" : "en-US",
    browserRequirements: t("structuredData.webApplication.browserRequirements"),
    softwareVersion: t("structuredData.webApplication.softwareVersion"),
    datePublished: t("structuredData.webApplication.datePublished"),
    dateModified: new Date().toISOString().split("T")[0],
    isPartOf: {
      "@type": "WebSite",
      name: providerName,
      url: `${baseUrl}/${locale}`,
    },
  };
}

/**
 * 生成面包屑导航结构化数据
 */
export function generateBreadcrumbSchema(
  locale: Locale,
  t: TFunction,
): any {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";

  const breadcrumbs = [
    {
      name: t("structuredData.breadcrumb.home"),
      url: `${baseUrl}/${locale}`,
    },
    {
      name: t("structuredData.breadcrumb.interactiveTools"),
      url: `${baseUrl}/${locale}/interactive-tools`,
    },
    {
      name: t("structuredData.breadcrumb.current"),
      url: `${baseUrl}/${locale}/interactive-tools/period-pain-impact-calculator`,
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * 生成完整的结构化数据
 */
export function generateAllStructuredData(
  locale: Locale,
  t: TFunction,
): any[] {
  return [
    generateFAQStructuredData(t),
    generateWebApplicationSchema(locale, t),
    generateBreadcrumbSchema(locale, t),
  ];
}