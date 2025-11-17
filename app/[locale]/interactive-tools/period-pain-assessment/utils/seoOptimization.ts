/**
 * Period Pain Assessment Hub - SEO优化工具
 * 实现FAQ和CollectionPage结构化数据生成
 */

import { Locale } from "@/i18n";

/**
 * 生成FAQ结构化数据
 */
export function generateFAQStructuredData(locale: Locale): any {
  const faqData = {
    zh: [
      {
        question: "痛经评估中心是什么？",
        answer:
          "痛经评估中心是一个导航和资源整合页面，帮助您快速找到最适合的痛经评估工具和资源。我们提供工作影响计算器、症状评估工具以及相关的健康文章和场景解决方案。",
      },
      {
        question: "我应该使用哪个评估工具？",
        answer:
          "如果您不确定自己的症状类型，建议先使用症状评估工具进行全面筛查；如果您已经明确是痛经问题，想了解对工作生活的影响，可以使用痛经影响计算器进行量化分析。",
      },
      {
        question: "评估工具是免费的吗？",
        answer:
          "是的，所有评估工具都是完全免费的。您可以随时使用这些工具来了解自己的健康状况并获得个性化建议。",
      },
      {
        question: "评估结果会保密吗？",
        answer:
          "是的，您的评估结果仅存储在本地浏览器中，我们不会将您的个人健康数据上传到服务器，完全保护您的隐私。",
      },
      {
        question: "评估结果可以替代医疗诊断吗？",
        answer:
          "不可以。我们的评估工具提供专业参考和建议，但不能替代专业医疗诊断。如有严重症状或健康疑虑，请及时咨询专业医生。",
      },
    ],
    en: [
      {
        question: "What is the Period Pain Assessment Hub?",
        answer:
          "The Period Pain Assessment Hub is a navigation and resource integration page that helps you quickly find the most suitable period pain assessment tools and resources. We provide work impact calculator, symptom assessment tool, and related health articles and scenario solutions.",
      },
      {
        question: "Which assessment tool should I use?",
        answer:
          "If you're not sure about your symptom type, we recommend starting with the Symptom Assessment Tool for comprehensive screening; if you've already identified period pain and want to understand its impact on work and life, you can use the Period Pain Impact Calculator for quantitative analysis.",
      },
      {
        question: "Are the assessment tools free?",
        answer:
          "Yes, all assessment tools are completely free. You can use these tools anytime to understand your health status and receive personalized recommendations.",
      },
      {
        question: "Will my assessment results be kept confidential?",
        answer:
          "Yes, your assessment results are only stored locally in your browser. We do not upload your personal health data to servers, completely protecting your privacy.",
      },
      {
        question: "Can assessment results replace medical diagnosis?",
        answer:
          "No. Our assessment tools provide professional reference and recommendations, but cannot replace professional medical diagnosis. If you have severe symptoms or health concerns, please consult a professional doctor promptly.",
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
 * 生成CollectionPage结构化数据
 */
export function generateCollectionPageSchema(locale: Locale): any {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";

  const collectionData = {
    zh: {
      name: "痛经评估中心",
      description:
        "专业的痛经评估工具和资源导航中心，提供工作影响计算器、症状评估工具以及相关的健康文章和场景解决方案。",
    },
    en: {
      name: "Period Pain Assessment Hub",
      description:
        "Professional period pain assessment tools and resource navigation hub, providing work impact calculator, symptom assessment tool, and related health articles and scenario solutions.",
    },
  };

  const config = collectionData[locale];

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: config.name,
    description: config.description,
    url: `${baseUrl}/${locale}/interactive-tools/period-pain-assessment`,
    inLanguage: locale === "zh" ? "zh-CN" : "en-US",
    isPartOf: {
      "@type": "WebSite",
      name: "PeriodHub",
      url: `${baseUrl}/${locale}`,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: locale === "zh" ? "痛经影响计算器" : "Period Pain Impact Calculator",
          url: `${baseUrl}/${locale}/interactive-tools/period-pain-impact-calculator`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: locale === "zh" ? "症状评估工具" : "Symptom Assessment Tool",
          url: `${baseUrl}/${locale}/interactive-tools/symptom-assessment`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name:
            locale === "zh"
              ? "自然缓解方法"
              : "Natural Relief Methods",
          url: `${baseUrl}/${locale}/articles/home-natural-menstrual-pain-relief`,
        },
      ],
    },
  };
}

/**
 * 生成完整的结构化数据
 */
export function generateAllStructuredData(locale: Locale): any[] {
  return [
    generateFAQStructuredData(locale),
    generateCollectionPageSchema(locale),
  ];
}





