/**
 * HVsLYEp职场健康助手 - SEO优化工具
 * 实现Meta信息优化和结构化数据生成
 */

import type { Metadata } from "next";
import { Locale } from "@/i18n";

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
 * 生成页面级Meta信息
 */
export function generatePageMetadata(
  locale: Locale,
  pageData: PageSEOData,
  additionalMeta?: Partial<Metadata>,
): Metadata {
  const config = pageData[locale];

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    alternates: {
      canonical: config.canonical,
      languages: {
        "zh-CN": pageData.zh.canonical,
        "en-US": pageData.en.canonical,
        "x-default": pageData.zh.canonical,
      },
    },
    openGraph: {
      title: config.title,
      description: config.description,
      images: config.ogImage ? [config.ogImage] : undefined,
      type: "website" as const,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: config.title,
      description: config.description,
      images: config.ogImage ? [config.ogImage] : undefined,
    },
    ...additionalMeta,
  };
}

/**
 * 生成HVsLYEp职场健康助手的SEO数据
 */
export function getWorkplaceWellnessSEOData(): PageSEOData {
  return {
    zh: {
      title: "职场健康助手 - 经期管理与工作优化 | Period Hub",
      description:
        "专业的职场健康管理工具，提供经期跟踪、疼痛管理、营养建议和工作调整方案。支持中英双语，保护隐私，提升工作效率。",
      keywords: [
        "职场健康",
        "经期管理",
        "疼痛跟踪",
        "营养建议",
        "工作优化",
        "请假模板",
        "数据导出",
        "隐私保护",
        "女性健康",
        "职场女性",
      ],
      canonical: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
      }/zh/workplace-wellness`,
      ogImage: "/images/workplace-wellness-og-zh.jpg",
    },
    en: {
      title:
        "Workplace Wellness Assistant - Period Management & Work Optimization | Period Hub",
      description:
        "Professional workplace wellness management tool providing period tracking, pain management, nutrition advice, and work adjustment solutions. Bilingual support, privacy protection, enhanced work efficiency.",
      keywords: [
        "workplace wellness",
        "period management",
        "pain tracking",
        "nutrition advice",
        "work optimization",
        "leave templates",
        "data export",
        "privacy protection",
        "women health",
        "workplace women",
      ],
      canonical: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
      }/en/workplace-wellness`,
      ogImage: "/images/workplace-wellness-og-en.jpg",
    },
  };
}

/**
 * 生成FAQ结构化数据
 */
export function generateFAQStructuredData(locale: Locale): any {
  const faqData = {
    zh: [
      {
        question: "职场健康助手是什么？",
        answer:
          "职场健康助手是专为职场女性设计的健康管理工具，提供经期跟踪、疼痛管理、营养建议和工作调整方案，帮助女性在职场中更好地管理健康。",
      },
      {
        question: "如何使用经期日历功能？",
        answer:
          "在经期日历中，您可以记录经期开始和结束日期、疼痛等级、流量情况等信息。系统会自动计算周期长度，并提供预测功能。",
      },
      {
        question: "营养建议如何个性化？",
        answer:
          "营养建议基于您当前的经期阶段和中医体质类型，提供个性化的食物推荐和膳食计划，帮助缓解经期不适。",
      },
      {
        question: "数据导出是否安全？",
        answer:
          "我们提供完整的数据脱敏和隐私保护机制，包括密码保护、数据脱敏、审计日志等功能，确保您的健康数据安全。",
      },
      {
        question: "支持哪些导出格式？",
        answer:
          "支持JSON、CSV、PDF三种格式导出，满足不同需求。PDF格式特别适合医疗报告，CSV适合数据分析，JSON适合数据备份。",
      },
    ],
    en: [
      {
        question: "What is the Workplace Wellness Assistant?",
        answer:
          "The Workplace Wellness Assistant is a health management tool designed specifically for working women, providing period tracking, pain management, nutrition advice, and work adjustment solutions to help women better manage their health in the workplace.",
      },
      {
        question: "How to use the period calendar feature?",
        answer:
          "In the period calendar, you can record period start and end dates, pain levels, flow conditions, and other information. The system automatically calculates cycle length and provides prediction functionality.",
      },
      {
        question: "How is nutrition advice personalized?",
        answer:
          "Nutrition advice is based on your current menstrual phase and TCM constitution type, providing personalized food recommendations and meal plans to help alleviate menstrual discomfort.",
      },
      {
        question: "Is data export secure?",
        answer:
          "We provide complete data masking and privacy protection mechanisms, including password protection, data masking, audit logs, and other features to ensure your health data security.",
      },
      {
        question: "What export formats are supported?",
        answer:
          "Supports JSON, CSV, and PDF export formats to meet different needs. PDF format is particularly suitable for medical reports, CSV for data analysis, and JSON for data backup.",
      },
    ],
  };

  const faqs = faqData[locale];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * 生成工具应用Schema
 */
export function generateWebApplicationSchema(locale: Locale): any {
  const appData = {
    zh: {
      name: "职场健康助手",
      description:
        "专业的职场女性健康管理工具，提供经期跟踪、疼痛管理、营养建议和工作优化方案。",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web Browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    en: {
      name: "Workplace Wellness Assistant",
      description:
        "Professional health management tool for working women, providing period tracking, pain management, nutrition advice, and work optimization solutions.",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web Browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  };

  const config = appData[locale];

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: config.name,
    description: config.description,
    applicationCategory: config.applicationCategory,
    operatingSystem: config.operatingSystem,
    offers: config.offers,
    url: `${
      process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
    }/${locale}/workplace-wellness`,
    author: {
      "@type": "Organization",
      name: "Period Hub",
      url: process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health",
    },
    inLanguage: locale,
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    softwareVersion: "1.0.0",
    datePublished: "2024-01-01",
    dateModified: new Date().toISOString().split("T")[0],
  };
}

/**
 * 生成面包屑导航结构化数据
 */
export function generateBreadcrumbSchema(locale: Locale): any {
  const breadcrumbData = {
    zh: [
      {
        name: "首页",
        url: `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/zh`,
      },
      {
        name: "互动工具",
        url: `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/zh/interactive-tools`,
      },
      {
        name: "职场健康助手",
        url: `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/zh/interactive-tools/workplace-wellness`,
      },
    ],
    en: [
      {
        name: "Home",
        url: `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/en`,
      },
      {
        name: "Interactive Tools",
        url: `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/en/interactive-tools`,
      },
      {
        name: "Workplace Wellness Assistant",
        url: `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/en/interactive-tools/workplace-wellness`,
      },
    ],
  };

  const breadcrumbs = breadcrumbData[locale];

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
export function generateAllStructuredData(locale: Locale): any[] {
  return [
    generateFAQStructuredData(locale),
    generateWebApplicationSchema(locale),
    generateBreadcrumbSchema(locale),
  ];
}

/**
 * 验证Meta信息长度
 */
export function validateMetaLength(
  title: string,
  description: string,
  locale: Locale,
): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // 标题长度验证
  if (locale === "zh") {
    if (title.length < 20) issues.push("中文标题过短，建议20-30字符");
    if (title.length > 60) issues.push("中文标题过长，建议不超过60字符");
  } else {
    if (title.length < 30) issues.push("英文标题过短，建议30-60字符");
    if (title.length > 60) issues.push("英文标题过长，建议不超过60字符");
  }

  // 描述长度验证
  if (locale === "zh") {
    if (description.length < 80) issues.push("中文描述过短，建议80-120字符");
    if (description.length > 160)
      issues.push("中文描述过长，建议不超过160字符");
  } else {
    if (description.length < 120) issues.push("英文描述过短，建议120-160字符");
    if (description.length > 160)
      issues.push("英文描述过长，建议不超过160字符");
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * 生成SEO报告
 */
export function generateSEOReport(
  locale: Locale,
  pageData: PageSEOData,
): string {
  const config = pageData[locale];
  const validation = validateMetaLength(
    config.title,
    config.description,
    locale,
  );

  const report = {
    page: "workplace-wellness",
    locale,
    title: config.title,
    titleLength: config.title.length,
    description: config.description,
    descriptionLength: config.description.length,
    keywords: config.keywords,
    keywordsCount: config.keywords.length,
    canonical: config.canonical,
    validation,
    structuredData: {
      faq: true,
      webApplication: true,
      breadcrumb: true,
    },
    generatedAt: new Date().toISOString(),
  };

  return JSON.stringify(report, null, 2);
}
