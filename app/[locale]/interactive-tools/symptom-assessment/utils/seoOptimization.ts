/**
 * Symptom Assessment Tool - SEO优化工具
 * 实现FAQ和HowTo结构化数据生成
 */

import { Locale } from "@/i18n";
import { getTranslations } from "next-intl/server";

type TFunction = Awaited<ReturnType<typeof getTranslations>>;

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
 * 生成HowTo结构化数据
 */
export function generateHowToStructuredData(
  locale: Locale,
  t: TFunction,
): any {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";

  const steps = [
    { key: "step1" },
    { key: "step2" },
    { key: "step3" },
    { key: "step4" },
    { key: "step5" },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: t("howTo.name"),
    description: t("howTo.description"),
    image: [
      `${baseUrl}/images/symptom-assessment-tool-1.jpg`,
      `${baseUrl}/images/symptom-assessment-tool-2.jpg`,
    ],
    totalTime: t("howTo.totalTime"),
    supply: [],
    tool: [],
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: t(`howTo.steps.${step.key}.name`),
      text: t(`howTo.steps.${step.key}.text`),
      image: `${baseUrl}/images/symptom-assessment-step-${index + 1}.jpg`,
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
    generateHowToStructuredData(locale, t),
  ];
}



