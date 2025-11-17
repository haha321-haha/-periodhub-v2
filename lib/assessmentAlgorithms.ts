// 评估算法系统 - 基于原始 hub-latest-main 3/data.js
// 提供症状影响计算和职场影响计算算法

/**
 * 评估答案接口
 */
export interface AssessmentAnswers {
  // 症状评估答案
  painLevel?: 'mild' | 'moderate' | 'severe' | 'verySevere';
  painDuration?: 'short' | 'medium' | 'long' | 'variable';
  painLocation?: string[];
  accompanyingSymptoms?: string[];
  reliefPreference?: 'instant' | 'natural' | 'longTerm' | 'medical';
  
  // 职场评估答案
  concentration?: 'none' | 'slight' | 'difficult' | 'impossible';
  absenteeism?: 'never' | 'rarely' | 'sometimes' | 'frequently';
  communication?: 'comfortable' | 'hesitant' | 'uncomfortable' | 'na';
  support?: string[];
}

/**
 * 症状影响评估结果
 */
export interface SymptomImpactResult {
  isSevere: boolean;
  summary: string[];
  recommendations: {
    immediate: string[];
    longTerm: string[];
  };
}

/**
 * 职场影响评估结果
 */
export interface WorkplaceImpactResult {
  score: number;
  profile: string;
  suggestions: string[];
}

/**
 * 翻译函数类型
 */
type TranslateFunction = (key: string) => string;

/**
 * 计算症状影响
 * 
 * 基于用户的症状评估答案，计算影响程度并生成个性化建议
 * 
 * @param answers - 用户的评估答案
 * @param t - 翻译函数
 * @returns 症状影响评估结果
 */
export function calculateSymptomImpact(
  answers: AssessmentAnswers,
  t: TranslateFunction
): SymptomImpactResult {
  const { painLevel, painDuration, reliefPreference } = answers;
  
  // 判断是否为严重痛经
  const isSevere = painLevel === 'severe' || painLevel === 'verySevere';
  
  // 生成摘要
  const summary: string[] = [];
  if (painLevel) {
    summary.push(
      `${t('calculation.symptom.painLevel')}: ${t(`symptomAssessor.questions.painLevel.options.${painLevel}`)}`
    );
  }
  if (painDuration) {
    summary.push(
      `${t('calculation.symptom.duration')}: ${t(`symptomAssessor.questions.painDuration.options.${painDuration}`)}`
    );
  }
  
  // 生成建议
  const recommendations = {
    immediate: [] as string[],
    longTerm: [] as string[]
  };
  
  // 根据疼痛程度生成不同的建议
  if (painLevel === 'mild') {
    // 轻微疼痛
    recommendations.immediate.push(t('calculation.symptom.recs.mild.immediate1'));
    recommendations.longTerm.push(t('calculation.symptom.recs.mild.longTerm1'));
  } else if (painLevel === 'moderate') {
    // 中度疼痛
    recommendations.immediate.push(t('calculation.symptom.recs.moderate.immediate1'));
    recommendations.immediate.push(t('calculation.symptom.recs.moderate.immediate2'));
    recommendations.longTerm.push(t('calculation.symptom.recs.moderate.longTerm1'));
    recommendations.longTerm.push(t('calculation.symptom.recs.moderate.longTerm2'));
  } else if (painLevel === 'severe' || painLevel === 'verySevere') {
    // 严重或非常严重疼痛
    recommendations.immediate.push(t('calculation.symptom.recs.severe.immediate1'));
    recommendations.immediate.push(t('calculation.symptom.recs.severe.immediate2'));
    recommendations.longTerm.push(t('calculation.symptom.recs.severe.longTerm1'));
    recommendations.longTerm.push(t('calculation.symptom.recs.severe.longTerm2'));
  }
  
  // 根据缓解偏好调整建议
  if (reliefPreference === 'natural') {
    recommendations.immediate.unshift(t('calculation.symptom.recs.prefs.natural.immediate1'));
    recommendations.longTerm.push(t('calculation.symptom.recs.prefs.natural.longTerm1'));
  }
  if (reliefPreference === 'medical') {
    recommendations.longTerm.unshift(t('calculation.symptom.recs.prefs.medical.longTerm1'));
  }
  
  return {
    isSevere,
    summary,
    recommendations
  };
}

/**
 * 计算职场影响
 * 
 * 基于用户的职场评估答案，计算职场影响评分并生成针对性建议
 * 
 * @param answers - 用户的评估答案
 * @param t - 翻译函数
 * @returns 职场影响评估结果
 */
export function calculateWorkplaceImpact(
  answers: AssessmentAnswers,
  t: TranslateFunction
): WorkplaceImpactResult {
  let score = 0;
  const suggestions: string[] = [];
  let profile = '';
  
  // 根据注意力影响计算分数
  if (answers.concentration) {
    switch (answers.concentration) {
      case 'none':
        score += 33;
        break;
      case 'slight':
        score += 20;
        break;
      case 'difficult':
        score += 10;
        break;
      case 'impossible':
        score += 0;
        break;
    }
  }
  
  // 根据缺勤情况计算分数
  if (answers.absenteeism) {
    switch (answers.absenteeism) {
      case 'never':
        score += 33;
        break;
      case 'rarely':
        score += 20;
        break;
      case 'sometimes':
        score += 10;
        break;
      case 'frequently':
        score += 0;
        break;
    }
  }
  
  // 根据沟通舒适度计算分数
  if (answers.communication) {
    switch (answers.communication) {
      case 'comfortable':
        score += 34;
        break;
      case 'hesitant':
        score += 15;
        break;
      case 'uncomfortable':
        score += 5;
        break;
      case 'na':
        score += 15;
        break;
    }
  }
  
  // 四舍五入评分
  score = Math.round(score);
  
  // 根据评分确定职场环境类型和建议
  if (score > 75) {
    // 支持性环境
    profile = t('calculation.workplace.profiles.supportive');
    suggestions.push(t('calculation.workplace.suggestions.supportive1'));
  } else if (score > 40) {
    // 适应性环境
    profile = t('calculation.workplace.profiles.adaptive');
    suggestions.push(t('calculation.workplace.suggestions.adaptive1'));
    suggestions.push(t('calculation.workplace.suggestions.adaptive2'));
  } else {
    // 挑战性环境
    profile = t('calculation.workplace.profiles.challenging');
    suggestions.push(t('calculation.workplace.suggestions.challenging1'));
    suggestions.push(t('calculation.workplace.suggestions.challenging2'));
    suggestions.push(t('calculation.workplace.suggestions.challenging3'));
  }
  
  // 根据沟通舒适度添加额外建议
  if (answers.communication === 'uncomfortable' || answers.communication === 'hesitant') {
    suggestions.push(t('calculation.workplace.suggestions.communicationHelp'));
  }
  
  // 根据支持措施添加建议
  if (answers.support && answers.support.length > 0 && !answers.support.includes('none')) {
    const supportText = t('calculation.workplace.suggestions.supportHeader');
    const supportItems: string[] = [];
    
    if (answers.support.includes('flexHours')) {
      supportItems.push(t('workplaceAssessment.questions.support.options.flexHours'));
    }
    if (answers.support.includes('remoteWork')) {
      supportItems.push(t('workplaceAssessment.questions.support.options.remoteWork'));
    }
    if (answers.support.includes('restArea')) {
      supportItems.push(t('workplaceAssessment.questions.support.options.restArea'));
    }
    if (answers.support.includes('understanding')) {
      supportItems.push(t('workplaceAssessment.questions.support.options.understanding'));
    }
    if (answers.support.includes('leave')) {
      supportItems.push(t('workplaceAssessment.questions.support.options.leave'));
    }
    
    if (supportItems.length > 0) {
      suggestions.push(supportText + supportItems.join(', ') + '.');
    }
  }
  
  return {
    score,
    profile,
    suggestions
  };
}

/**
 * 计算综合评估结果
 * 
 * 结合症状影响和职场影响，生成综合评估结果
 * 
 * @param answers - 用户的评估答案
 * @param t - 翻译函数
 * @returns 综合评估结果
 */
export function calculateComprehensiveAssessment(
  answers: AssessmentAnswers,
  t: TranslateFunction
) {
  const symptomImpact = calculateSymptomImpact(answers, t);
  const workplaceImpact = calculateWorkplaceImpact(answers, t);
  
  return {
    symptom: symptomImpact,
    workplace: workplaceImpact,
    overallSeverity: symptomImpact.isSevere ? 'high' : workplaceImpact.score < 40 ? 'medium' : 'low'
  };
}
