/**
 * 营养推荐生成器 - 数据导出
 * 统一导出所有数据模块
 */

export {
  menstrualPhaseData,
  healthGoalData,
  tcmConstitutionData
} from './nutritionRecommendations';

// 重新导出类型定义
export type {
  MenstrualPhaseData,
  HealthGoalData,
  TCMConstitutionData,
  NutritionRecommendation,
  LifestyleTip
} from '../types';
