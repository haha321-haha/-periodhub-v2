// 评估数据系统 - 基于原始 hub-latest-main 3/data.js
// 提供症状评估和职场评估的问题数据

/**
 * 问题类型定义
 */
export type QuestionType = 'single-select' | 'multi-select';

/**
 * 选项接口
 */
export interface QuestionOption {
  value: string;
  labelKey: string;
}

/**
 * 问题接口
 */
export interface AssessmentQuestion {
  id: string;
  labelKey: string;
  options: QuestionOption[];
  type?: QuestionType;
}

/**
 * 症状评估问题数据（5个问题）
 * 
 * 这些问题用于评估痛经的症状严重程度和特征
 */
export const SYMPTOM_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'painLevel',
    labelKey: 'symptomAssessor.questions.painLevel.title',
    options: [
      { value: 'mild', labelKey: 'symptomAssessor.questions.painLevel.options.mild' },
      { value: 'moderate', labelKey: 'symptomAssessor.questions.painLevel.options.moderate' },
      { value: 'severe', labelKey: 'symptomAssessor.questions.painLevel.options.severe' },
      { value: 'verySevere', labelKey: 'symptomAssessor.questions.painLevel.options.verySevere' }
    ],
    type: 'single-select'
  },
  {
    id: 'painDuration',
    labelKey: 'symptomAssessor.questions.painDuration.title',
    options: [
      { value: 'short', labelKey: 'symptomAssessor.questions.painDuration.options.short' },
      { value: 'medium', labelKey: 'symptomAssessor.questions.painDuration.options.medium' },
      { value: 'long', labelKey: 'symptomAssessor.questions.painDuration.options.long' },
      { value: 'variable', labelKey: 'symptomAssessor.questions.painDuration.options.variable' }
    ],
    type: 'single-select'
  },
  {
    id: 'painLocation',
    labelKey: 'symptomAssessor.questions.painLocation.title',
    options: [
      { value: 'lowerAbdomen', labelKey: 'symptomAssessor.questions.painLocation.options.lowerAbdomen' },
      { value: 'lowerBack', labelKey: 'symptomAssessor.questions.painLocation.options.lowerBack' },
      { value: 'upperThighs', labelKey: 'symptomAssessor.questions.painLocation.options.upperThighs' },
      { value: 'fullPelvis', labelKey: 'symptomAssessor.questions.painLocation.options.fullPelvis' },
      { value: 'sideFlank', labelKey: 'symptomAssessor.questions.painLocation.options.sideFlank' }
    ],
    type: 'multi-select'
  },
  {
    id: 'accompanyingSymptoms',
    labelKey: 'symptomAssessor.questions.accompanyingSymptoms.title',
    options: [
      { value: 'fatigue', labelKey: 'symptomAssessor.questions.accompanyingSymptoms.options.fatigue' },
      { value: 'headache', labelKey: 'symptomAssessor.questions.accompanyingSymptoms.options.headache' },
      { value: 'nausea', labelKey: 'symptomAssessor.questions.accompanyingSymptoms.options.nausea' },
      { value: 'digestive', labelKey: 'symptomAssessor.questions.accompanyingSymptoms.options.digestive' },
      { value: 'mood', labelKey: 'symptomAssessor.questions.accompanyingSymptoms.options.mood' },
      { value: 'bloating', labelKey: 'symptomAssessor.questions.accompanyingSymptoms.options.bloating' },
      { value: 'breastTenderness', labelKey: 'symptomAssessor.questions.accompanyingSymptoms.options.breastTenderness' },
      { value: 'dizziness', labelKey: 'symptomAssessor.questions.accompanyingSymptoms.options.dizziness' }
    ],
    type: 'multi-select'
  },
  {
    id: 'reliefPreference',
    labelKey: 'impactAssessment.preference.title',
    options: [
      { value: 'instant', labelKey: 'impactAssessment.preference.options.instant' },
      { value: 'natural', labelKey: 'impactAssessment.preference.options.natural' },
      { value: 'longTerm', labelKey: 'impactAssessment.preference.options.longTerm' },
      { value: 'medical', labelKey: 'impactAssessment.preference.options.medical' }
    ],
    type: 'single-select'
  }
];

/**
 * 职场评估问题数据（4个问题）
 * 
 * 这些问题用于评估痛经对职场工作的影响
 */
export const WORKPLACE_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'concentration',
    labelKey: 'workplaceAssessment.questions.concentration.title',
    options: [
      { value: 'none', labelKey: 'workplaceAssessment.questions.concentration.options.none' },
      { value: 'slight', labelKey: 'workplaceAssessment.questions.concentration.options.slight' },
      { value: 'difficult', labelKey: 'workplaceAssessment.questions.concentration.options.difficult' },
      { value: 'impossible', labelKey: 'workplaceAssessment.questions.concentration.options.impossible' }
    ],
    type: 'single-select'
  },
  {
    id: 'absenteeism',
    labelKey: 'workplaceAssessment.questions.absenteeism.title',
    options: [
      { value: 'never', labelKey: 'workplaceAssessment.questions.absenteeism.options.never' },
      { value: 'rarely', labelKey: 'workplaceAssessment.questions.absenteeism.options.rarely' },
      { value: 'sometimes', labelKey: 'workplaceAssessment.questions.absenteeism.options.sometimes' },
      { value: 'frequently', labelKey: 'workplaceAssessment.questions.absenteeism.options.frequently' }
    ],
    type: 'single-select'
  },
  {
    id: 'communication',
    labelKey: 'workplaceAssessment.questions.communication.title',
    options: [
      { value: 'comfortable', labelKey: 'workplaceAssessment.questions.communication.options.comfortable' },
      { value: 'hesitant', labelKey: 'workplaceAssessment.questions.communication.options.hesitant' },
      { value: 'uncomfortable', labelKey: 'workplaceAssessment.questions.communication.options.uncomfortable' },
      { value: 'na', labelKey: 'workplaceAssessment.questions.communication.options.na' }
    ],
    type: 'single-select'
  },
  {
    id: 'support',
    labelKey: 'workplaceAssessment.questions.support.title',
    options: [
      { value: 'flexHours', labelKey: 'workplaceAssessment.questions.support.options.flexHours' },
      { value: 'remoteWork', labelKey: 'workplaceAssessment.questions.support.options.remoteWork' },
      { value: 'restArea', labelKey: 'workplaceAssessment.questions.support.options.restArea' },
      { value: 'understanding', labelKey: 'workplaceAssessment.questions.support.options.understanding' },
      { value: 'leave', labelKey: 'workplaceAssessment.questions.support.options.leave' },
      { value: 'none', labelKey: 'workplaceAssessment.questions.support.options.none' }
    ],
    type: 'multi-select'
  }
];

/**
 * 根据评估模式获取问题
 * 
 * @param mode - 评估模式 ('simplified' | 'detailed' | 'medical')
 * @returns 对应模式的问题数组
 */
export function getQuestionsByMode(mode: 'simplified' | 'detailed' | 'medical'): AssessmentQuestion[] {
  switch (mode) {
    case 'simplified':
      // 简化版：只返回前3个症状问题
      return SYMPTOM_QUESTIONS.slice(0, 3);
    
    case 'detailed':
      // 详细版：返回所有症状问题 + 所有职场问题
      return [...SYMPTOM_QUESTIONS, ...WORKPLACE_QUESTIONS];
    
    case 'medical':
      // 医疗专业版：返回所有问题（未来可以添加更多专业问题）
      return [...SYMPTOM_QUESTIONS, ...WORKPLACE_QUESTIONS];
    
    default:
      return SYMPTOM_QUESTIONS.slice(0, 3);
  }
}

/**
 * 获取症状评估问题
 */
export function getSymptomQuestions(): AssessmentQuestion[] {
  return SYMPTOM_QUESTIONS;
}

/**
 * 获取职场评估问题
 */
export function getWorkplaceQuestions(): AssessmentQuestion[] {
  return WORKPLACE_QUESTIONS;
}
