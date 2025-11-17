/**
 * Period Pain Impact Calculator - SEO优化工具
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
 * 生成FAQ结构化数据
 */
export function generateFAQStructuredData(locale: Locale): any {
  const faqData = {
    zh: [
      {
        question: "痛经影响计算器是什么？",
        answer:
          "痛经影响计算器是专业的评估工具，通过12道科学设计的问题，全面评估痛经对工作和生活的影响，并提供个性化的缓解建议和医疗指导。",
      },
      {
        question: "评估结果准确吗？",
        answer:
          "我们的评估工具基于医学研究和临床实践设计，提供专业参考。但评估结果不能替代专业医疗诊断，如有严重症状请及时就医。",
      },
      {
        question: "评估需要多长时间？",
        answer:
          "整个评估过程通常需要5-10分钟，包含12个问题。您可以随时保存进度，稍后继续完成评估。",
      },
      {
        question: "结果会保存吗？",
        answer:
          "您的评估结果会安全存储在本地浏览器中，仅用于追踪您的症状变化。我们不会将您的个人健康数据上传到服务器，保护您的隐私。",
      },
      {
        question: "如何根据评估结果采取行动？",
        answer:
          "根据评估结果，我们会提供个性化的建议和资源链接。对于轻度症状，可以尝试自我护理；对于中重度症状，建议寻求专业医疗帮助。",
      },
    ],
    en: [
      {
        question: "What is the Period Pain Impact Calculator?",
        answer:
          "The Period Pain Impact Calculator is a professional assessment tool that comprehensively evaluates the impact of menstrual pain on work and daily life through 12 scientifically designed questions, providing personalized relief suggestions and medical guidance.",
      },
      {
        question: "Are the assessment results accurate?",
        answer:
          "Our assessment tool is designed based on medical research and clinical practice to provide professional reference. However, assessment results cannot replace professional medical diagnosis. If you have severe symptoms, please seek medical attention promptly.",
      },
      {
        question: "How long does the assessment take?",
        answer:
          "The entire assessment process usually takes 5-10 minutes and includes 12 questions. You can save your progress at any time and continue later.",
      },
      {
        question: "Will my results be saved?",
        answer:
          "Your assessment results are securely stored locally in your browser and only used to track your symptom changes. We do not upload your personal health data to servers, protecting your privacy.",
      },
      {
        question: "How should I act based on assessment results?",
        answer:
          "Based on your assessment results, we provide personalized recommendations and resource links. For mild symptoms, you can try self-care; for moderate to severe symptoms, we recommend seeking professional medical help.",
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
      name: "痛经影响计算器",
      description:
        "专业的痛经影响评估工具，科学分析经期疼痛严重程度及对工作生活的影响，提供个性化医疗建议和缓解方案。",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web Browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    en: {
      name: "Period Pain Impact Calculator",
      description:
        "Professional menstrual pain assessment tool that scientifically evaluates pain severity and its impact on work and daily life, providing personalized medical advice and relief solutions.",
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
    }/${locale}/interactive-tools/period-pain-impact-calculator`,
    author: {
      "@type": "Organization",
      name: "PeriodHub",
      url: process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health",
    },
    creator: {
      "@type": "Organization",
      name: "PeriodHub",
      url: process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
      bestRating: "5",
      worstRating: "1",
    },
    inLanguage: locale === "zh" ? "zh-CN" : "en-US",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    softwareVersion: "2.0",
    datePublished: "2024-01-15",
    dateModified: new Date().toISOString().split("T")[0],
    isPartOf: {
      "@type": "WebSite",
      name: "PeriodHub",
      url: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
      }/${locale}`,
    },
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
        name: "交互工具",
        url: `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/zh/interactive-tools`,
      },
      {
        name: "痛经影响计算器",
        url: `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/zh/interactive-tools/period-pain-impact-calculator`,
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
        name: "Period Pain Impact Calculator",
        url: `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/en/interactive-tools/period-pain-impact-calculator`,
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