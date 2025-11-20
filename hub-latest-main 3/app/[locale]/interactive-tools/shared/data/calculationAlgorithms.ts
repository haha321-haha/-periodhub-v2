// 基于参考代码lIDgMx5的计算算法
// 症状评估算法
export function calculateSymptomImpact(answers: Record<string, any>, locale: string = 'zh') {
  const { painLevel, painDuration, reliefPreference } = answers;
  const isSevere = painLevel === 'severe' || painLevel === 'verySevere';
  const summary: string[] = [];
  const recommendations = { immediate: [], longTerm: [] };

  // 生成摘要
  const painLevelLabels = {
    zh: {
      mild: '轻度 (1-3/10): 能感觉到，但不影响我的日常活动。',
      moderate: '中度 (4-6/10): 疼痛会干扰我，影响我的注意力和工作效率。可能需要非处方止痛药。',
      severe: '重度 (7-8/10): 疼痛很强烈，我需要躺下或停止正在做的事情，难以正常活动。',
      verySevere: '极重度 (9-10/10): 疼痛使人衰弱，难以忍受。我经常卧床不起，并可能伴有恶心或昏厥等其他症状。'
    },
    en: {
      mild: 'Mild (1-3/10): It\'s noticeable but doesn\'t stop me from my daily activities.',
      moderate: 'Moderate (4-6/10): It\'s disruptive and affects my focus and productivity. I might need over-the-counter pain relief.',
      severe: 'Severe (7-8/10): The pain is strong enough that I need to lie down or stop what I\'m doing. It\'s difficult to function.',
      verySevere: 'Very Severe (9-10/10): The pain is debilitating and overwhelming. I\'m often bedridden and may experience other symptoms like nausea or fainting.'
    }
  };

  const durationLabels = {
    zh: {
      short: '在第一天持续几个小时。',
      medium: '在经期的前1-2天内疼痛比较严重。',
      long: '持续3天或更长时间。',
      variable: '疼痛不可预测，每个周期的差异很大。'
    },
    en: {
      short: 'A few hours on the first day.',
      medium: 'It\'s significant for the first 1-2 days of my period.',
      long: 'It persists for 3 or more days.',
      variable: 'It\'s unpredictable and varies greatly from cycle to cycle.'
    }
  };

  summary.push(`${locale === 'zh' ? '疼痛程度' : 'Pain Level'}: ${painLevelLabels[locale as keyof typeof painLevelLabels][painLevel as keyof typeof painLevelLabels.zh]}`);
  summary.push(`${locale === 'zh' ? '持续时间' : 'Duration'}: ${durationLabels[locale as keyof typeof durationLabels][painDuration as keyof typeof durationLabels.zh]}`);

  // 基于疼痛程度生成建议
  const recommendationTexts = {
    zh: {
      mild: {
        immediate: ['温和的伸展运动或短途散步'],
        longTerm: ['定期进行瑜伽或普拉提等轻度运动']
      },
      moderate: {
        immediate: ['在腹部或下背部加热敷垫', '考虑使用非处方止痛药（请先咨询医生）'],
        longTerm: ['追踪您的周期以预测疼痛', '探索饮食调整（如减少咖啡因和盐分）']
      },
      severe: {
        immediate: ['使用热敷垫并在舒适的位置休息', '使用深呼吸或冥想技巧应对急性疼痛'],
        longTerm: ['咨询医疗保健专业人员进行诊断', '与医生讨论长期疼痛管理策略']
      },
      verySevere: {
        immediate: ['使用热敷垫并在舒适的位置休息', '使用深呼吸或冥想技巧应对急性疼痛'],
        longTerm: ['咨询医疗保健专业人员进行诊断', '与医生讨论长期疼痛管理策略']
      },
      natural: {
        immediate: ['饮用姜茶或甘菊茶'],
        longTerm: ['将抗炎食物（如姜黄、绿叶蔬菜）纳入饮食']
      },
      medical: {
        longTerm: ['预约妇科医生，以排除子宫内膜异位症或肌瘤等潜在疾病']
      }
    },
    en: {
      mild: {
        immediate: ['Gentle stretching or short walks'],
        longTerm: ['Regular yoga or Pilates for light exercise']
      },
      moderate: {
        immediate: ['Apply heating pad to abdomen or lower back', 'Consider over-the-counter pain relievers (consult doctor first)'],
        longTerm: ['Track your cycle to anticipate pain', 'Explore dietary changes (like reducing caffeine and salt)']
      },
      severe: {
        immediate: ['Use heating pad and rest in comfortable position', 'Use deep breathing or meditation techniques for acute pain'],
        longTerm: ['Consult healthcare professional for diagnosis', 'Discuss long-term pain management strategies with doctor']
      },
      verySevere: {
        immediate: ['Use heating pad and rest in comfortable position', 'Use deep breathing or meditation techniques for acute pain'],
        longTerm: ['Consult healthcare professional for diagnosis', 'Discuss long-term pain management strategies with doctor']
      },
      natural: {
        immediate: ['Drink ginger or chamomile tea'],
        longTerm: ['Incorporate anti-inflammatory foods (like turmeric, leafy greens) into diet']
      },
      medical: {
        longTerm: ['Schedule visit with gynecologist to rule out underlying conditions like endometriosis or fibroids']
      }
    }
  };

  if (painLevel === 'mild') {
    (recommendations.immediate as any[]).push(...(recommendationTexts[locale as keyof typeof recommendationTexts].mild.immediate as any));
    (recommendations.longTerm as any[]).push(...(recommendationTexts[locale as keyof typeof recommendationTexts].mild.longTerm as any));
  } else if (painLevel === 'moderate') {
    (recommendations.immediate as any[]).push(...(recommendationTexts[locale as keyof typeof recommendationTexts].moderate.immediate as any));
    (recommendations.longTerm as any[]).push(...(recommendationTexts[locale as keyof typeof recommendationTexts].moderate.longTerm as any));
  } else { // severe or verySevere
    (recommendations.immediate as any[]).push(...(recommendationTexts[locale as keyof typeof recommendationTexts].severe.immediate as any));
    (recommendations.longTerm as any[]).push(...(recommendationTexts[locale as keyof typeof recommendationTexts].severe.longTerm as any));
  }

  // 基于偏好调整建议
  if (reliefPreference === 'natural') {
    (recommendations.immediate as any[]).unshift(...(recommendationTexts[locale as keyof typeof recommendationTexts].natural.immediate as any));
    (recommendations.longTerm as any[]).push(...(recommendationTexts[locale as keyof typeof recommendationTexts].natural.longTerm as any));
  }
  if (reliefPreference === 'medical') {
    (recommendations.longTerm as any[]).unshift(...(recommendationTexts[locale as keyof typeof recommendationTexts].medical.longTerm as any));
  }

  return {
    isSevere,
    summary,
    recommendations
  };
}

// 职场评分算法
export function calculateWorkplaceImpact(answers: Record<string, any>, locale: string = 'zh') {
  let score = 0;
  const suggestions: string[] = [];
  let profile = '';

  // 注意力影响评分
  if (answers.concentration) {
    switch (answers.concentration) {
      case 'none': score += 33; break;
      case 'slight': score += 20; break;
      case 'difficult': score += 10; break;
      case 'impossible': score += 0; break;
    }
  }

  // 缺勤情况评分
  if (answers.absenteeism) {
    switch (answers.absenteeism) {
      case 'never': score += 33; break;
      case 'rarely': score += 20; break;
      case 'sometimes': score += 10; break;
      case 'frequently': score += 0; break;
    }
  }

  // 沟通舒适度评分
  if (answers.communication) {
    switch (answers.communication) {
      case 'comfortable': score += 34; break;
      case 'hesitant': score += 15; break;
      case 'uncomfortable': score += 5; break;
      case 'na': score += 15; break;
    }
  }

  score = Math.round(score);

  // 职场档案分类和建议
  const suggestionTexts = {
    zh: {
      supportive: {
        profile: '支持性环境',
        suggestions: [
          '您的工作能力似乎基本未受影响，并且您能自在地沟通需求。这是一个很好的基础。'
        ]
      },
      adaptive: {
        profile: '中度适应性环境',
        suggestions: [
          '您的工作受到中等程度的影响。确定关键的支持措施可以显著改善您的体验。',
          '考虑与信任的经理或人力资源代表进行非正式的交谈，讨论所面临的挑战。'
        ]
      },
      challenging: {
        profile: '挑战性环境',
        suggestions: [
          '您的症状严重影响了您的工作。寻求支持非常重要。',
          '首先记录症状对工作的影响。将我们的完整报告作为个人工具。',
          '研究您公司现有的病假和弹性工作政策。'
        ]
      }
    },
    en: {
      supportive: {
        profile: 'Supportive Environment',
        suggestions: [
          'Your ability to work seems largely unaffected, and you feel comfortable communicating your needs. This is a great foundation.'
        ]
      },
      adaptive: {
        profile: 'Moderately Adaptive Environment',
        suggestions: [
          'Your work is moderately impacted. Identifying key support measures could significantly improve your experience.',
          'Consider having an informal chat with a trusted manager or HR representative about the challenges faced.'
        ]
      },
      challenging: {
        profile: 'Challenging Environment',
        suggestions: [
          'Your symptoms significantly impact your work. It is important to find support.',
          'Start by documenting the impact on your work. Use our full report as a personal tool.',
          'Research your company\'s existing sick leave and flexible work policies.'
        ]
      }
    }
  };

  if (score > 75) {
    profile = (suggestionTexts[locale as keyof typeof suggestionTexts].supportive as any).profile;
    suggestions.push(...(suggestionTexts[locale as keyof typeof suggestionTexts].supportive as any).suggestions);
  } else if (score > 40) {
    profile = (suggestionTexts[locale as keyof typeof suggestionTexts].adaptive as any).profile;
    suggestions.push(...(suggestionTexts[locale as keyof typeof suggestionTexts].adaptive as any).suggestions);
  } else {
    profile = (suggestionTexts[locale as keyof typeof suggestionTexts].challenging as any).profile;
    suggestions.push(...(suggestionTexts[locale as keyof typeof suggestionTexts].challenging as any).suggestions);
  }

  return {
    score,
    profile,
    suggestions
  };
}

