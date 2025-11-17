/**
 * Symptom Assessment Tool - SEO优化工具
 * 实现FAQ和HowTo结构化数据生成
 */

import { Locale } from "@/i18n";

/**
 * 生成FAQ结构化数据
 */
export function generateFAQStructuredData(locale: Locale): any {
  const faqData = {
    zh: [
      {
        question: "症状评估工具是什么？",
        answer:
          "症状评估工具是专业的经期健康评估系统，通过3-21个问题（根据选择的模式），全面评估您的经期症状类型和严重程度，帮助您了解健康状况并获得个性化建议。",
      },
      {
        question: "评估结果准确吗？",
        answer:
          "我们的评估工具基于医学研究和临床实践设计，提供专业参考。但评估结果不能替代专业医疗诊断，如有严重症状请及时就医。",
      },
      {
        question: "三种评估模式有什么区别？",
        answer:
          "简化版包含3个核心问题，适合快速了解；详细版包含13个扩展问题，提供更全面的评估；医疗专业版包含21个问题，涵盖症状和职场影响，适合需要深度分析的用户。",
      },
      {
        question: "评估需要多长时间？",
        answer:
          "简化版约3-5分钟，详细版约8-10分钟，医疗专业版约12-15分钟。您可以随时保存进度，稍后继续完成评估。",
      },
      {
        question: "如何根据评估结果采取行动？",
        answer:
          "根据评估结果，我们会提供个性化的建议和资源链接。如果检测到工作影响较高，会推荐使用痛经影响计算器；如果症状严重，会建议就医并推荐相关医疗文章。",
      },
    ],
    en: [
      {
        question: "What is the Symptom Assessment Tool?",
        answer:
          "The Symptom Assessment Tool is a professional menstrual health assessment system that comprehensively evaluates your menstrual symptom types and severity through 3-21 questions (depending on the selected mode), helping you understand your health status and receive personalized recommendations.",
      },
      {
        question: "Are the assessment results accurate?",
        answer:
          "Our assessment tool is designed based on medical research and clinical practice to provide professional reference. However, assessment results cannot replace professional medical diagnosis. If you have severe symptoms, please seek medical attention promptly.",
      },
      {
        question: "What's the difference between the three assessment modes?",
        answer:
          "The simplified mode includes 3 core questions, suitable for quick understanding; the detailed mode includes 13 extended questions, providing more comprehensive assessment; the medical professional mode includes 21 questions covering symptoms and workplace impact, suitable for users who need in-depth analysis.",
      },
      {
        question: "How long does the assessment take?",
        answer:
          "Simplified mode takes about 3-5 minutes, detailed mode takes about 8-10 minutes, and medical professional mode takes about 12-15 minutes. You can save your progress at any time and continue later.",
      },
      {
        question: "How should I act based on assessment results?",
        answer:
          "Based on your assessment results, we provide personalized recommendations and resource links. If high work impact is detected, we recommend using the Period Pain Impact Calculator; if symptoms are severe, we recommend seeking medical attention and provide links to relevant medical articles.",
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
 * 生成HowTo结构化数据
 */
export function generateHowToStructuredData(locale: Locale): any {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";

  const howToData = {
    zh: {
      name: "如何使用经期症状评估工具",
      description:
        "通过我们的症状评估工具，了解您的经期健康状况并获得个性化建议。",
      totalTime: "PT10M",
      step: [
        {
          name: "选择评估模式",
          text: "根据您的需求选择简化版（3题）、详细版（13题）或医疗专业版（21题）。",
        },
        {
          name: "开始评估",
          text: "点击\"开始评估\"按钮，进入症状评估流程。",
        },
        {
          name: "回答问题",
          text: "根据您的实际情况，诚实回答关于症状的系列问题。您可以随时返回修改之前的答案。",
        },
        {
          name: "查看结果",
          text: "完成所有问题后，系统会生成个性化的评估结果，包括症状严重程度、风险等级和个性化建议。",
        },
        {
          name: "采取行动",
          text: "根据评估结果中的智能推荐，您可以前往痛经影响计算器进行深度分析，或阅读相关医疗文章了解就医建议。",
        },
      ],
    },
    en: {
      name: "How to Use the Menstrual Symptom Assessment Tool",
      description:
        "Understand your menstrual health and get personalized advice through our symptom assessment tool.",
      totalTime: "PT10M",
      step: [
        {
          name: "Choose Assessment Mode",
          text: "Select simplified mode (3 questions), detailed mode (13 questions), or medical professional mode (21 questions) based on your needs.",
        },
        {
          name: "Start Assessment",
          text: "Click the 'Start Assessment' button to begin the symptom evaluation process.",
        },
        {
          name: "Answer Questions",
          text: "Answer a series of questions about your symptoms honestly based on your actual situation. You can go back to modify previous answers at any time.",
        },
        {
          name: "View Results",
          text: "After completing all questions, the system will generate personalized assessment results, including symptom severity, risk level, and personalized recommendations.",
        },
        {
          name: "Take Action",
          text: "Based on the smart recommendations in the assessment results, you can go to the Period Pain Impact Calculator for in-depth analysis, or read relevant medical articles to learn about medical consultation advice.",
        },
      ],
    },
  };

  const config = howToData[locale];

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: config.name,
    description: config.description,
    image: [
      `${baseUrl}/images/symptom-assessment-tool-1.jpg`,
      `${baseUrl}/images/symptom-assessment-tool-2.jpg`,
    ],
    totalTime: config.totalTime,
    supply: [],
    tool: [],
    step: config.step.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      image: `${baseUrl}/images/symptom-assessment-step-${index + 1}.jpg`,
    })),
  };
}

/**
 * 生成完整的结构化数据
 */
export function generateAllStructuredData(locale: Locale): any[] {
  return [
    generateFAQStructuredData(locale),
    generateHowToStructuredData(locale),
  ];
}



