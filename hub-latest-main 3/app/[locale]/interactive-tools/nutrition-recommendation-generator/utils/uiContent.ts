/**
 * UI内容系统 - 完全基于ziV1d3d的ui_content.js
 * 保持原始翻译结构和内容
 */

// 基于ziV1d3d的uiContent结构
export const uiContent = {
  mainTitle: {
    en: "Nutrition Suggestion Generator",
    zh: "营养建议生成器"
  },
  langToggle: {
    en: "中文",
    zh: "English"
  },
  generateBtn: {
    en: "Generate My Plan",
    zh: "生成我的建议"
  },
  categoryTitles: {
    menstrualPhase: {
      en: "Menstrual Phase",
      zh: "月经阶段"
    },
    healthGoals: {
      en: "Health Goals",
      zh: "健康目标"
    },
    tcmConstitution: {
      en: "TCM Constitution",
      zh: "中医体质"
    }
  },
  results: {
    recommendedFoods: {
      en: "Recommended Foods",
      zh: "推荐食物"
    },
    foodsToAvoid: {
      en: "Foods to Avoid",
      zh: "慎食/忌食"
    },
    lifestyleTips: {
      en: "Lifestyle & Dietary Tips",
      zh: "生活与饮食贴士"
    }
  },
  noSelection: {
    en: "Please make a selection to generate recommendations.",
    zh: "请选择您的状况以生成建议。"
  },
  footerText: {
    en: "Personalized wellness at your fingertips.",
    zh: "个性化健康，触手可及。"
  }
};

// 基于ziV1d3d的翻译获取函数
export function getUIContent(key: string, language: 'en' | 'zh'): string {
  const keys = key.split('.');
  let content: any = uiContent;

  for (const k of keys) {
    content = content[k];
    if (!content) {
      console.warn(`UI content key not found: ${key}`);
      return key;
    }
  }

  return content[language] || content.en || key;
}

// 基于ziV1d3d的翻译对象获取函数
export function getUIContentObject(key: string): { en: string; zh: string } {
  const keys = key.split('.');
  let content: any = uiContent;

  for (const k of keys) {
    content = content[k];
    if (!content) {
      console.warn(`UI content key not found: ${key}`);
      return { en: key, zh: key };
    }
  }

  return content;
}
