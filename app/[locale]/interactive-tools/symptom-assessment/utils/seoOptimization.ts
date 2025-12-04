/**
 * Symptom Assessment Tool - SEO优化工具
 * 实现FAQ和HowTo结构化数据生成
 */

import { Locale } from "@/i18n";
import { getTranslations } from "next-intl/server";
import { medicalEntities } from "@/lib/seo/medical-entities";

type TFunction = Awaited<ReturnType<typeof getTranslations>>;

type FAQStructuredData = {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
      mention: Array<{
        "@type": string;
        name: string;
        mechanismOfAction?: string;
      }>;
      citation: {
        "@type": string;
        name: string;
        url: string;
      };
    };
    about: {
      "@type": string;
      name: string;
      code: {
        "@type": string;
        code: string;
        codingSystem: string;
      };
      sameAs?: string;
    };
    medicalAudience: {
      "@type": string;
      audienceType: string;
    };
  }>;
};

type HowToStructuredData = {
  "@context": "https://schema.org";
  "@type": "HowTo";
  name: string;
  description: string;
  image: string[];
  totalTime: string;
  supply: unknown[];
  tool: unknown[];
  step: Array<{
    "@type": "HowToStep";
    position: number;
    name: string;
    text: string;
    image: string;
  }>;
};

type StructuredDataEntry = FAQStructuredData | HowToStructuredData;

/**
 * 生成FAQ结构化数据
 */
export function generateFAQStructuredData(t: TFunction): FAQStructuredData {
  const faqs = [
    { key: "q1" },
    { key: "q2" },
    { key: "q3" },
    { key: "q4" },
    { key: "q5" },
  ];

  const condition = medicalEntities.dysmenorrhea;
  const citation = {
    "@type": "MedicalGuideline",
    name: "ACOG Practice Bulletin No. 76",
    url: "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2019/03/premenstrual-syndrome-and-premenstrual-dysphoric-disorder",
  };

  const drugMention = {
    "@type": "Drug",
    name: "Ibuprofen (布洛芬)",
    mechanismOfAction: "Inhibits prostaglandin synthesis",
  };

  // 过滤空的 FAQ 项
  const validFAQs = faqs
    .map((faq) => ({
      key: faq.key,
      question: t(`faq.${faq.key}.question`),
      answer: t(`faq.${faq.key}.answer`),
    }))
    .filter(
      (faq) =>
        faq.question && faq.answer && faq.question.trim() && faq.answer.trim(),
    );

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(validFAQs.length > 0 && {
      mainEntity: validFAQs.map((faq) => ({
        "@type": "Question",
        name: faq.question.trim(),
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer.trim(),
          mention: [drugMention],
          citation,
        },
        about: {
          "@type": "MedicalCondition",
          name: condition.name,
          code: {
            "@type": "MedicalCode",
            code: condition.icd10,
            codingSystem: "ICD-10",
          },
          ...(condition.snomed && {
            sameAs: `http://snomed.info/id/${condition.snomed}`,
          }),
        },
        medicalAudience: {
          "@type": "MedicalAudience",
          audienceType: "Patient",
        },
      })),
    }),
  };
}

/**
 * 生成HowTo结构化数据
 */
export function generateHowToStructuredData(
  locale: Locale,
  t: TFunction,
): HowToStructuredData {
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
    step: steps
      .map((step, index) => ({
        key: step.key,
        index,
        name: t(`howTo.steps.${step.key}.name`),
        text: t(`howTo.steps.${step.key}.text`),
      }))
      .filter(
        (step) =>
          step.name && step.text && step.name.trim() && step.text.trim(),
      )
      .map((step, newIndex) => ({
        "@type": "HowToStep",
        position: newIndex + 1,
        name: step.name.trim(),
        text: step.text.trim(),
        image: `${baseUrl}/images/symptom-assessment-step-${
          step.index + 1
        }.jpg`,
      })),
  };
}

/**
 * 生成完整的结构化数据
 */
export function generateAllStructuredData(
  locale: Locale,
  t: TFunction,
): Array<StructuredDataEntry> {
  return [generateFAQStructuredData(t), generateHowToStructuredData(locale, t)];
}
