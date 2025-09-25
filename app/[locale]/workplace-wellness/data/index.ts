/**
 * HVsLYEp职场健康助手 - 数据文件
 * 基于HVsLYEp的data.js结构迁移
 */

import { 
  PeriodRecord, 
  NutritionRecommendation, 
  LeaveTemplate, 
  Language,
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
export const mockNutritionData: Record<Language, NutritionRecommendation[]> = {
  en: [
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
  ],
  zh: [
    { 
      name: '红枣', 
      benefits: ['补气血', '调经止痛', '改善贫血'], 
      phase: 'menstrual', 
      tcmNature: 'warm', 
      nutrients: ['铁', '维生素C', '叶酸'] 
    },
    { 
      name: '桂圆', 
      benefits: ['补血安神', '缓解疲劳', '改善睡眠'], 
      phase: 'menstrual', 
      tcmNature: 'warm', 
      nutrients: ['铁', '蛋白质', '葡萄糖'] 
    },
    { 
      name: '黑豆', 
      benefits: ['补肾益阴', '调节激素', '抗氧化'], 
      phase: 'follicular', 
      tcmNature: 'neutral', 
      nutrients: ['蛋白质', '异黄酮', '维生素E'] 
    },
    { 
      name: '枸杞', 
      benefits: ['滋补肝肾', '明目', '抗衰老'], 
      phase: 'ovulation', 
      tcmNature: 'neutral', 
      nutrients: ['β-胡萝卜素', '玉米黄质', '多糖'] 
    },
    { 
      name: '当归', 
      benefits: ['补血活血', '调经止痛', '润燥滑肠'], 
      phase: 'luteal', 
      tcmNature: 'warm', 
      nutrients: ['铁', '维生素B12', '叶酸'] 
    }
  ]
};

// 请假模板 - 基于HVsLYEp的leaveTemplates结构
export const leaveTemplates: Record<Language, LeaveTemplate[]> = {
  en: [
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
  ],
  zh: [
    { 
      id: 1, 
      title: '轻度不适请假模板', 
      severity: 'mild', 
      subject: '身体不适请假申请', 
      content: '您好，我因身体不适需要请假休息，预计请假时间为半天。我会确保工作安排妥当，如有紧急事务请联系我。谢谢理解。' 
    },
    { 
      id: 2, 
      title: '中度疼痛请假模板', 
      severity: 'moderate', 
      subject: '健康原因请假申请', 
      content: '您好，我因健康原因需要请假1天进行休息和调理。已安排好手头工作的交接，紧急事务可通过邮件联系。感谢您的理解和支持。' 
    },
    { 
      id: 3, 
      title: '居家办公申请模板', 
      severity: 'moderate', 
      subject: '居家办公申请', 
      content: '您好，由于健康原因，我希望今天能够居家办公。我会保持正常的工作时间和沟通，确保工作效率不受影响。谢谢您的考虑。' 
    },
    { 
      id: 4, 
      title: '严重疼痛紧急请假', 
      severity: 'severe', 
      subject: '紧急请假申请', 
      content: '您好，我因身体严重不适需要紧急请假。我会立即安排工作交接，紧急事务可通过电话联系。感谢您在这个困难时期的理解。' 
    }
  ]
};

// 翻译数据 - 基于HVsLYEp的translations结构
export const translations: Record<Language, any> = {
  en: {
    lang_name: "中文",
    lang_id: "zh",
    header: {
      title: "Period Hub",
      subtitle: "Workplace Wellness Tool",
      settings: "Settings"
    },
    nav: {
      calendar: "Period Calendar",
      nutrition: "Nutrition Advice",
      export: "Data Management"
    },
    calendar: {
      title: "Period Work Calendar",
      subtitle: "Track your period and plan your work schedule",
      recordButton: "Record Period",
      days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      legendPeriod: "Period Day",
      legendPredicted: "Predicted Day",
      statCycle: "Avg. Cycle",
      statLength: "Avg. Length",
      statNext: "Next Prediction",
      dateFormats: {
        yearMonth: { month: 'long', year: 'numeric' },
        monthDay: { month: 'short', day: 'numeric' }
      }
    },
    workImpact: {
      title: "Symptom & Work Impact Log",
      painLevel: "Pain Level (1-10)",
      efficiency: "Work Efficiency (%)",
      adjustment: "Today's Work Adjustment",
      adjustOptions: ["Take Leave", "Work From Home", "Postpone Meeting", "Reduce Tasks"],
      saveButton: "Save Record",
      templatesTitle: "Leave Request Templates",
      severity: { mild: "Mild", moderate: "Moderate", severe: "Severe" },
      preview: "Email Preview",
      subject: "Subject:",
      content: "Content:",
      copyButton: "Copy Template"
    },
    nutrition: {
      title: "Personalized Nutrition Advice",
      phaseLabel: "Current Menstrual Phase",
      phases: { menstrual: "Menstrual", follicular: "Follicular", ovulation: "Ovulation", luteal: "Luteal" },
      phaseIcons: { menstrual: '🩸', follicular: '🌱', ovulation: '⭐', luteal: '🌙' },
      constitutionLabel: "TCM Constitution Type",
      constitutions: { qi_deficiency: "Qi Deficiency", yang_deficiency: "Yang Deficiency", yin_deficiency: "Yin Deficiency", blood_deficiency: "Blood Deficiency", balanced: "Balanced" },
      foodTitle: "Recommended Foods",
      searchPlaceholder: "Search foods...",
      tcmNature: { warm: "Warm", cool: "Cool", neutral: "Neutral" },
      benefitsLabel: "Main Benefits",
      nutrientsLabel: "Key Nutrients",
      addButton: "Add to Meal Plan",
      noResults: "No food recommendations found. Please try another search.",
      planTitle: "Today's Meal Plan",
      meals: { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snack" },
      mealSuggestions: {
        breakfast: "Suggestion: Jujube and millet porridge + warm water to warm and replenish Qi.",
        lunch: "Suggestion: Lean meat soup + steamed egg + green vegetables to supplement protein and iron.",
        dinner: "Suggestion: Longan and lotus seed soup + light congee to nourish blood and calm the mind.",
        snack: "Suggestion: Brown sugar ginger tea or nuts to relieve pain."
      },
      generateButton: "Generate Shopping List"
    },
    export: {
      title: "Data Export & Management",
      subtitle: "Export your health data for medical reports",
      typeLabel: "Export Type",
      types: { period: "Period Data", nutrition: "Nutrition Data", all: "All Data" },
      formatLabel: "Export Format",
      formats: { json: "JSON", csv: "CSV", pdf: "PDF" },
      exportButton: "Export Data",
      downloadButton: "Download File",
      successMessage: "Data exported successfully!",
      errorMessage: "Export failed. Please try again."
    },
    common: {
      save: "Save",
      cancel: "Cancel",
      confirm: "Confirm",
      delete: "Delete",
      edit: "Edit",
      add: "Add",
      search: "Search",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      warning: "Warning",
      info: "Information"
    }
  },
  zh: {
    lang_name: "English",
    lang_id: "en",
    header: {
      title: "Period Hub",
      subtitle: "职场健康助手",
      settings: "设置"
    },
    nav: {
      calendar: "经期日历",
      nutrition: "营养建议",
      export: "数据管理"
    },
    calendar: {
      title: "经期工作日历",
      subtitle: "追踪经期并规划工作安排",
      recordButton: "记录经期",
      days: ["日", "一", "二", "三", "四", "五", "六"],
      legendPeriod: "经期",
      legendPredicted: "预测",
      statCycle: "平均周期",
      statLength: "平均长度",
      statNext: "下次预测",
      dateFormats: {
        yearMonth: { month: 'long', year: 'numeric' },
        monthDay: { month: 'short', day: 'numeric' }
      }
    },
    workImpact: {
      title: "症状与工作影响记录",
      painLevel: "疼痛程度 (1-10)",
      efficiency: "工作效率 (%)",
      adjustment: "今日工作调整",
      adjustOptions: ["请假", "居家办公", "推迟会议", "减少任务"],
      saveButton: "保存记录",
      templatesTitle: "请假申请模板",
      severity: { mild: "轻度", moderate: "中度", severe: "重度" },
      preview: "邮件预览",
      subject: "主题：",
      content: "内容：",
      copyButton: "复制模板"
    },
    nutrition: {
      title: "个性化营养建议",
      phaseLabel: "当前月经阶段",
      phases: { menstrual: "经期", follicular: "卵泡期", ovulation: "排卵期", luteal: "黄体期" },
      phaseIcons: { menstrual: '🩸', follicular: '🌱', ovulation: '⭐', luteal: '🌙' },
      constitutionLabel: "中医体质类型",
      constitutions: { qi_deficiency: "气虚", yang_deficiency: "阳虚", yin_deficiency: "阴虚", blood_deficiency: "血虚", balanced: "平和" },
      foodTitle: "推荐食物",
      searchPlaceholder: "搜索食物...",
      tcmNature: { warm: "温性", cool: "凉性", neutral: "平性" },
      benefitsLabel: "主要功效",
      nutrientsLabel: "关键营养素",
      addButton: "添加到餐单",
      noResults: "未找到相关食物推荐，请尝试其他搜索。",
      planTitle: "今日餐单",
      meals: { breakfast: "早餐", lunch: "午餐", dinner: "晚餐", snack: "加餐" },
      mealSuggestions: {
        breakfast: "建议：红枣小米粥 + 温开水，温补气血。",
        lunch: "建议：瘦肉汤 + 蒸蛋 + 青菜，补充蛋白质和铁质。",
        dinner: "建议：桂圆莲子汤 + 清淡粥品，养血安神。",
        snack: "建议：红糖姜茶或坚果，缓解疼痛。"
      },
      generateButton: "生成购物清单"
    },
    export: {
      title: "数据导出与管理",
      subtitle: "导出健康数据用于医疗报告",
      typeLabel: "导出类型",
      types: { period: "经期数据", nutrition: "营养数据", all: "全部数据" },
      formatLabel: "导出格式",
      formats: { json: "JSON", csv: "CSV", pdf: "PDF" },
      exportButton: "导出数据",
      downloadButton: "下载文件",
      successMessage: "数据导出成功！",
      errorMessage: "导出失败，请重试。"
    },
    common: {
      save: "保存",
      cancel: "取消",
      confirm: "确认",
      delete: "删除",
      edit: "编辑",
      add: "添加",
      search: "搜索",
      loading: "加载中...",
      error: "错误",
      success: "成功",
      warning: "警告",
      info: "信息"
    }
  }
};

// 工具函数 - 基于HVsLYEp的t函数
export function createTranslationFunction(lang: Language) {
  return (key: string): string => {
    const keys = key.split('.');
    let result: any = translations[lang];
    
    for (const k of keys) {
      result = result[k];
      if (result === undefined) {
        console.warn(`Translation not found for key: ${key} in lang: ${lang}`);
        return key;
      }
    }
    
    return result;
  };
}

// 数据获取函数
export function getPeriodData(): PeriodRecord[] {
  return mockPeriodData;
}

export function getNutritionData(lang: Language): NutritionRecommendation[] {
  return mockNutritionData[lang] || [];
}

export function getLeaveTemplates(lang: Language): LeaveTemplate[] {
  return leaveTemplates[lang] || [];
}

export function getTranslations(lang: Language) {
  return translations[lang] || translations.en;
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
  if (!mockNutritionData.en || mockNutritionData.en.length === 0) {
    issues.push('No English nutrition data available');
  }
  if (!mockNutritionData.zh || mockNutritionData.zh.length === 0) {
    issues.push('No Chinese nutrition data available');
  }
  
  // 检查请假模板
  if (!leaveTemplates.en || leaveTemplates.en.length === 0) {
    issues.push('No English leave templates available');
  }
  if (!leaveTemplates.zh || leaveTemplates.zh.length === 0) {
    issues.push('No Chinese leave templates available');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}
