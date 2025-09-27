/**
 * HVsLYEp职场健康助手 - 数据文件
 * 基于HVsLYEp的data.js结构迁移
 */

import { 
  PeriodRecord, 
  NutritionRecommendation, 
  LeaveTemplate, 
  MenstrualPhase,
  TCMConstitution,
  SeverityLevel,
  TCMNature
} from '../types';

// 模拟经期数据 - 基于HVsLYEp的mockPeriodData
export const mockPeriodData: PeriodRecord[] = [
  { date: '2025-09-15', type: 'period', painLevel: 7, flow: 'heavy' },
  { date: '2025-09-16', type: 'period', painLevel: 6, flow: 'heavy' },
  { date: '2025-09-17', type: 'period', painLevel: 4, flow: 'medium' },
  { date: '2025-10-12', type: 'predicted', painLevel: null, flow: null },
];

// 营养数据 - 基于HVsLYEp的mockNutritionData结构
export const mockNutritionData: NutritionRecommendation[] = [
    { 
      name: 'Jujube', 
      benefits: ['Replenish Qi & Blood', 'Relieve Pain', 'Improve Anemia'], 
      phase: 'menstrual', 
      tcmNature: 'warm', 
      nutrients: ['Iron', 'Vitamin C', 'Folic Acid'] 
    },
    { 
      name: 'Longan', 
      benefits: ['Nourish Blood', 'Calm Nerves', 'Relieve Fatigue'], 
      phase: 'menstrual', 
      tcmNature: 'warm', 
      nutrients: ['Iron', 'Protein', 'Glucose'] 
    },
    { 
      name: 'Black Beans', 
      benefits: ['Tonify Kidneys', 'Regulate Hormones', 'Antioxidant'], 
      phase: 'follicular', 
      tcmNature: 'neutral', 
      nutrients: ['Protein', 'Isoflavones', 'Vitamin E'] 
    },
    { 
      name: 'Red Dates', 
      benefits: ['Boost Energy', 'Improve Circulation', 'Support Immunity'], 
      phase: 'luteal', 
      tcmNature: 'warm', 
      nutrients: ['Iron', 'Vitamin C', 'Potassium'] 
    },
    { 
      name: 'Goji Berries', 
      benefits: ['Nourish Liver', 'Improve Vision', 'Anti-aging'], 
      phase: 'ovulation', 
      tcmNature: 'neutral', 
      nutrients: ['Beta-carotene', 'Zeaxanthin', 'Polysaccharides'] 
    }
];

// 请假模板 - 基于HVsLYEp的leaveTemplates结构
export const leaveTemplates: LeaveTemplate[] = [
    { 
      id: 1, 
      title: 'Template for Mild Discomfort', 
      severity: 'mild', 
      subject: 'Leave Request for Physical Discomfort', 
      content: 'Hello, I need to take a half-day leave due to physical discomfort. I will ensure my work is handled properly. Please contact me for urgent matters. Thank you for your understanding.' 
    },
    { 
      id: 2, 
      title: 'Template for Moderate Pain', 
      severity: 'moderate', 
      subject: 'Leave Request for Health Reasons', 
      content: 'Hello, I need to take a 1-day leave for rest and recovery due to health reasons. I have arranged for the handover of my work. Urgent matters can be addressed via email. Thank you for your understanding and support.' 
    },
    { 
      id: 3, 
      title: 'Work From Home Request Template', 
      severity: 'moderate', 
      subject: 'Request to Work From Home', 
      content: 'Hello, due to health reasons, I would like to request to work from home today. I will maintain my normal working hours and communication to ensure my work is not affected. Thank you for your consideration.' 
    },
    { 
      id: 4, 
      title: 'Severe Pain Emergency Leave', 
      severity: 'severe', 
      subject: 'Emergency Leave Request', 
      content: 'Hello, I need to take an emergency leave due to severe health issues. I will arrange for immediate work handover and will be available for critical matters via phone. Thank you for your understanding during this difficult time.' 
    }
];


// 数据获取函数
export function getPeriodData(): PeriodRecord[] {
  return mockPeriodData;
}

export function getNutritionData(): NutritionRecommendation[] {
  return mockNutritionData;
}

export function getLeaveTemplates(): LeaveTemplate[] {
  return leaveTemplates;
}

// 数据验证函数 - 基于HVsLYEp的数据结构
export function validateAllData() {
  const { validatePeriodData, validateNutritionData, validateLeaveTemplates } = require('../utils/validation');
  
  const results = {
    periodData: validatePeriodData(mockPeriodData),
    nutritionData: validateNutritionData(mockNutritionData),
    leaveTemplates: validateLeaveTemplates(leaveTemplates)
  };
  
  return results;
}

// 数据完整性检查
export function checkDataIntegrity() {
  const issues: string[] = [];
  
  // 检查经期数据
  if (mockPeriodData.length === 0) {
    issues.push('No period data available');
  }
  
  // 检查营养数据
  if (!mockNutritionData || mockNutritionData.length === 0) {
    issues.push('No nutrition data available');
  }
  
  // 检查请假模板
  if (!leaveTemplates || leaveTemplates.length === 0) {
    issues.push('No leave templates available');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

