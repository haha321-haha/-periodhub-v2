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
      title: "职场健康日历",
      subtitle: "Workplace Wellness Tool",
      settings: "Settings"
    },
    nav: {
      calendar: "Period Calendar",
      nutrition: "Nutrition Advice",
      workImpact: "Work Impact",
      analysis: "Data Analysis",
      export: "Data Management",
      settings: "Settings"
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
      addRecord: "Add Record",
      date: "Date",
      type: "Type",
      typePeriod: "Period",
      typePredicted: "Predicted",
      typeOvulation: "Ovulation",
      painLevel: "Pain Level",
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
      generateButton: "Generate Shopping List",
      selectedFoods: "Selected Foods",
      planGenerated: "Meal plan generated successfully!"
    },
    export: {
      title: "Data Export & Management",
      subtitle: "Export your health data for medical reports",
      contentLabel: "Export Content",
      types: { 
        period: "Period Data", 
        period_desc: "Includes period dates, symptoms, work impact, etc.",
        nutrition: "Nutrition Data", 
        nutrition_desc: "Includes meal plans, food logs, etc.",
        all: "All Data", 
        all_desc: "Includes all health records and settings."
      },
      formatLabel: "Export Format",
      formats: { 
        json: "JSON", 
        json_desc: "For data backup",
        csv: "CSV", 
        csv_desc: "For spreadsheet analysis",
        pdf: "PDF", 
        pdf_desc: "For medical reports"
      },
      exportButton: "Export Data",
      exportingButton: "Exporting...",
      downloadButton: "Download File",
      successMessage: "Data exported successfully!",
      errorMessage: "Export failed. Please try again.",
      permissionDenied: "Permission denied. Please check your password.",
      privacyTitle: "Privacy Protection",
      privacyContent: "All data is stored locally on your device. Please keep exported files secure to avoid leaking personal health information.",
      showSettings: "Show Settings",
      hideSettings: "Hide Settings",
      enablePassword: "Enable Password Protection",
      passwordLabel: "Export Password",
      passwordPlaceholder: "Enter password for export",
      enableMasking: "Enable Data Masking",
      securityWarnings: "Security Warnings",
      periodTypes: {
        period: "Period",
        predicted: "Predicted",
        ovulation: "Ovulation"
      },
      flowTypes: {
        light: "Light",
        medium: "Medium",
        heavy: "Heavy"
      }
    },
    charts: {
      title: "Cycle Statistics & Analysis",
      totalCycles: "Total Cycles",
      averageCycleLength: "Average Cycle Length",
      averagePainLevel: "Average Pain Level",
      cycleRegularity: "Cycle Regularity",
      days: "days",
      regularity: {
        regular: "Regular",
        irregular: "Irregular", 
        "very-irregular": "Very Irregular"
      },
      predictions: "Predictions",
      nextPeriod: "Next Period",
      nextOvulation: "Next Ovulation",
      currentPhase: "Current Phase",
      confidence: "Confidence",
      tabs: {
        overview: "Overview",
        cycleLength: "Cycle Length",
        painLevel: "Pain Level",
        flowType: "Flow Type"
      },
      cycleLength: "Cycle Length",
      painLevel: "Pain Level",
      flowType: "Flow Type",
      flowTypes: {
        light: "Light",
        medium: "Medium",
        heavy: "Heavy"
      },
      cycleLengthDistribution: "Cycle Length Distribution",
      painLevelDistribution: "Pain Level Distribution",
      flowTypeDistribution: "Flow Type Distribution",
      selectChart: "Select a chart type to view detailed statistics"
    },
    history: {
      title: "Historical Data Viewer",
      addRecord: "Add Record",
      export: "Export",
      searchPlaceholder: "Search by date, type, or notes...",
      filters: "Filters",
      dateRange: "Date Range",
      startDate: "Start Date",
      endDate: "End Date",
      type: "Type",
      allTypes: "All Types",
      painLevel: "Pain Level",
      allLevels: "All Levels",
      lowPain: "Low (1-3)",
      mediumPain: "Medium (4-7)",
      highPain: "High (8-10)",
      flow: "Flow",
      allFlows: "All Flows",
      clearFilters: "Clear Filters",
      resultsCount: "Found {count} records",
      date: "Date",
      notes: "Notes",
      actions: "Actions",
      noData: "No records found matching your criteria",
      view: "View",
      edit: "Edit",
      delete: "Delete",
      recordDetails: "Record Details",
      close: "Close"
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
    },
    // Day 9: 数据分析功能翻译
    analysis: {
      advancedTitle: "Advanced Cycle Analysis",
      tabs: {
        overview: "Overview",
        trends: "Trends",
        comparison: "Comparison",
        insights: "Insights"
      },
      avgCycleLength: "Avg Cycle Length",
      avgPeriodLength: "Avg Period Length",
      avgPainLevel: "Avg Pain Level",
      confidence: "Confidence",
      cycleLength: "Cycle Length",
      avgPain: "Avg Pain",
      commonFlow: "Common Flow",
      noTrendData: "No trend data available",
      noComparisonData: "No comparison data available",
      comparisonTitle: "Period Comparison",
      currentPeriod: "Current Period",
      previousPeriod: "Previous Period",
      averageCycle: "Average Cycle",
      trendUp: "Trending Up",
      trendDown: "Trending Down",
      trendStable: "Stable"
    },
    symptoms: {
      title: "Symptom Statistics",
      tabs: {
        overview: "Overview",
        patterns: "Patterns",
        trends: "Trends",
        recommendations: "Recommendations"
      },
      noData: "No symptom data available",
      frequency: "Frequency",
      lastOccurrence: "Last Occurrence",
      severity: "Severity",
      cramps: "Cramps",
      bloating: "Bloating",
      headache: "Headache",
      fatigue: "Fatigue",
      mood_swings: "Mood Swings",
      breast_tenderness: "Breast Tenderness",
      back_pain: "Back Pain",
      nausea: "Nausea",
      insomnia: "Insomnia",
      anxiety: "Anxiety",
      trendsComingSoon: "Trend analysis coming soon"
    },
    patterns: {
      crampsBloating: "Cramps + Bloating Pattern",
      headacheFatigue: "Headache + Fatigue Pattern",
      moodAnxiety: "Mood Swings + Anxiety Pattern",
      occurrences: "occurrences",
      frequency: "Frequency",
      severity: "Severity"
    },
    recommendations: {
      warmCompress: "Apply warm compress to lower abdomen",
      gentleExercise: "Engage in gentle exercise like walking",
      hydration: "Stay well hydrated",
      rest: "Get adequate rest and sleep",
      caffeineReduction: "Reduce caffeine intake",
      stressManagement: "Practice stress management techniques",
      mindfulness: "Practice mindfulness and meditation",
      socialSupport: "Seek social support from friends/family",
      sleepHygiene: "Maintain good sleep hygiene",
      generalCare: "Follow general self-care practices"
    },
    workAnalysis: {
      title: "Work Impact Analysis",
      tabs: {
        overview: "Overview",
        patterns: "Patterns",
        productivity: "Productivity",
        insights: "Insights"
      },
      noData: "No work impact data available",
      avgEfficiency: "Avg Efficiency",
      avgPain: "Avg Pain",
      avgProductivity: "Avg Productivity",
      adjustmentRate: "Adjustment Rate",
      recentTrends: "Recent Trends",
      efficiency: "Efficiency",
      painLevel: "Pain Level",
      commonAdjustments: "Common Adjustments",
      productivityTitle: "Productivity Analysis",
      efficiencyVsPain: "Efficiency vs Pain Level",
      productivityTrend: "Productivity Trend",
      recommendation: "Recommendation"
    },
    workInsights: {
      highEfficiency: "High Work Efficiency",
      highEfficiencyDesc: "Your work efficiency is consistently high",
      maintainRoutine: "Maintain your current work routine",
      lowEfficiency: "Low Work Efficiency",
      lowEfficiencyDesc: "Work efficiency could be improved",
      improveWorkflow: "Consider optimizing your workflow",
      highPainImpact: "High Pain Impact on Work",
      highPainImpactDesc: "Pain levels significantly affect work performance",
      painManagement: "Focus on pain management strategies",
      frequentAdjustments: "Frequent Work Adjustments",
      frequentAdjustmentsDesc: "You frequently need to adjust work arrangements",
      planAhead: "Plan ahead for challenging days"
    },
    insights: {
      regularCycle: "Regular Cycle Pattern",
      regularCycleDesc: "Your menstrual cycle shows good regularity",
      irregularCycle: "Irregular Cycle Pattern",
      irregularCycleDesc: "Your cycle shows some irregularity",
      highPain: "High Pain Levels",
      highPainDesc: "Pain levels are consistently high",
      lowPain: "Low Pain Levels",
      lowPainDesc: "Pain levels are well managed",
      highAccuracy: "High Prediction Accuracy",
      highAccuracyDesc: "Cycle predictions are highly accurate"
    }
  },
  zh: {
    lang_name: "English",
    lang_id: "en",
    header: {
      title: "职场健康日历",
      subtitle: "职场健康助手",
      settings: "设置"
    },
    nav: {
      calendar: "经期日历",
      nutrition: "营养建议",
      workImpact: "工作影响",
      analysis: "数据分析",
      export: "数据管理",
      settings: "设置"
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
      addRecord: "添加记录",
      date: "日期",
      type: "类型",
      typePeriod: "经期",
      typePredicted: "预测",
      typeOvulation: "排卵",
      painLevel: "疼痛等级",
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
      generateButton: "生成购物清单",
      selectedFoods: "已选食物",
      planGenerated: "膳食计划生成成功！"
    },
    export: {
      title: "数据导出与管理",
      subtitle: "导出健康数据用于医疗报告",
      contentLabel: "导出内容",
      types: { 
        period: "经期数据", 
        period_desc: "包含经期日期、症状、工作影响等",
        nutrition: "营养数据", 
        nutrition_desc: "包含膳食计划、食物记录等",
        all: "全部数据", 
        all_desc: "包含所有健康记录和设置"
      },
      formatLabel: "导出格式",
      formats: { 
        json: "JSON", 
        json_desc: "数据备份",
        csv: "CSV", 
        csv_desc: "表格分析",
        pdf: "PDF", 
        pdf_desc: "医疗报告"
      },
      exportButton: "导出数据",
      exportingButton: "导出中...",
      downloadButton: "下载文件",
      successMessage: "数据导出成功！",
      errorMessage: "导出失败，请重试。",
      permissionDenied: "权限被拒绝，请检查您的密码。",
      privacyTitle: "隐私保护",
      privacyContent: "所有数据均存储在您的本地设备中，导出的文件请妥善保管，避免泄露个人健康信息。",
      showSettings: "显示设置",
      hideSettings: "隐藏设置",
      enablePassword: "启用密码保护",
      passwordLabel: "导出密码",
      passwordPlaceholder: "请输入导出密码",
      enableMasking: "启用数据脱敏",
      securityWarnings: "安全警告",
      periodTypes: {
        period: "经期",
        predicted: "预测",
        ovulation: "排卵"
      },
      flowTypes: {
        light: "少量",
        medium: "中等",
        heavy: "大量"
      }
    },
    charts: {
      title: "周期统计与分析",
      totalCycles: "总周期数",
      averageCycleLength: "平均周期长度",
      averagePainLevel: "平均疼痛等级",
      cycleRegularity: "周期规律性",
      days: "天",
      regularity: {
        regular: "规律",
        irregular: "不规律",
        "very-irregular": "非常不规律"
      },
      predictions: "预测信息",
      nextPeriod: "下次经期",
      nextOvulation: "下次排卵",
      currentPhase: "当前阶段",
      confidence: "置信度",
      tabs: {
        overview: "概览",
        cycleLength: "周期长度",
        painLevel: "疼痛等级",
        flowType: "流量类型"
      },
      cycleLength: "周期长度",
      painLevel: "疼痛等级",
      flowType: "流量类型",
      flowTypes: {
        light: "少量",
        medium: "中等",
        heavy: "大量"
      },
      cycleLengthDistribution: "周期长度分布",
      painLevelDistribution: "疼痛等级分布",
      flowTypeDistribution: "流量类型分布",
      selectChart: "选择图表类型查看详细统计"
    },
    history: {
      title: "历史数据查看器",
      addRecord: "添加记录",
      export: "导出",
      searchPlaceholder: "按日期、类型或备注搜索...",
      filters: "过滤器",
      dateRange: "日期范围",
      startDate: "开始日期",
      endDate: "结束日期",
      type: "类型",
      allTypes: "所有类型",
      painLevel: "疼痛等级",
      allLevels: "所有等级",
      lowPain: "轻度 (1-3)",
      mediumPain: "中度 (4-7)",
      highPain: "重度 (8-10)",
      flow: "流量",
      allFlows: "所有流量",
      clearFilters: "清除过滤器",
      resultsCount: "找到 {count} 条记录",
      date: "日期",
      notes: "备注",
      actions: "操作",
      noData: "未找到符合条件的记录",
      view: "查看",
      edit: "编辑",
      delete: "删除",
      recordDetails: "记录详情",
      close: "关闭"
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
    },
    // Day 9: 数据分析功能翻译
    analysis: {
      advancedTitle: "高级周期分析",
      tabs: {
        overview: "概览",
        trends: "趋势",
        comparison: "对比",
        insights: "洞察"
      },
      avgCycleLength: "平均周期长度",
      avgPeriodLength: "平均经期长度",
      avgPainLevel: "平均疼痛等级",
      confidence: "置信度",
      cycleLength: "周期长度",
      avgPain: "平均疼痛",
      commonFlow: "常见流量",
      noTrendData: "暂无趋势数据",
      noComparisonData: "暂无对比数据",
      comparisonTitle: "经期对比",
      currentPeriod: "当前周期",
      previousPeriod: "上一周期",
      averageCycle: "平均周期",
      trendUp: "上升趋势",
      trendDown: "下降趋势",
      trendStable: "稳定"
    },
    symptoms: {
      title: "症状统计",
      tabs: {
        overview: "概览",
        patterns: "模式",
        trends: "趋势",
        recommendations: "建议"
      },
      noData: "暂无症状数据",
      frequency: "频率",
      lastOccurrence: "最后出现",
      severity: "严重程度",
      cramps: "痉挛",
      bloating: "腹胀",
      headache: "头痛",
      fatigue: "疲劳",
      mood_swings: "情绪波动",
      breast_tenderness: "乳房胀痛",
      back_pain: "背痛",
      nausea: "恶心",
      insomnia: "失眠",
      anxiety: "焦虑",
      trendsComingSoon: "趋势分析即将推出"
    },
    patterns: {
      crampsBloating: "痉挛+腹胀模式",
      headacheFatigue: "头痛+疲劳模式",
      moodAnxiety: "情绪波动+焦虑模式",
      occurrences: "次出现",
      frequency: "频率",
      severity: "严重程度"
    },
    recommendations: {
      warmCompress: "在下腹部敷热敷",
      gentleExercise: "进行温和运动如散步",
      hydration: "保持充足水分",
      rest: "获得充足的休息和睡眠",
      caffeineReduction: "减少咖啡因摄入",
      stressManagement: "练习压力管理技巧",
      mindfulness: "练习正念和冥想",
      socialSupport: "寻求朋友/家人的社会支持",
      sleepHygiene: "保持良好的睡眠卫生",
      generalCare: "遵循一般自我护理实践"
    },
    workAnalysis: {
      title: "工作影响分析",
      tabs: {
        overview: "概览",
        patterns: "模式",
        productivity: "生产力",
        insights: "洞察"
      },
      noData: "暂无工作影响数据",
      avgEfficiency: "平均效率",
      avgPain: "平均疼痛",
      avgProductivity: "平均生产力",
      adjustmentRate: "调整率",
      recentTrends: "近期趋势",
      efficiency: "效率",
      painLevel: "疼痛等级",
      commonAdjustments: "常见调整",
      productivityTitle: "生产力分析",
      efficiencyVsPain: "效率 vs 疼痛等级",
      productivityTrend: "生产力趋势",
      recommendation: "建议"
    },
    workInsights: {
      highEfficiency: "高工作效率",
      highEfficiencyDesc: "您的工作效率持续保持高水平",
      maintainRoutine: "保持当前的工作常规",
      lowEfficiency: "低工作效率",
      lowEfficiencyDesc: "工作效率有待提高",
      improveWorkflow: "考虑优化工作流程",
      highPainImpact: "疼痛对工作影响大",
      highPainImpactDesc: "疼痛水平显著影响工作表现",
      painManagement: "专注于疼痛管理策略",
      frequentAdjustments: "频繁的工作调整",
      frequentAdjustmentsDesc: "您经常需要调整工作安排",
      planAhead: "为挑战性日子提前规划"
    },
    insights: {
      regularCycle: "规律周期模式",
      regularCycleDesc: "您的月经周期显示出良好的规律性",
      irregularCycle: "不规律周期模式",
      irregularCycleDesc: "您的周期显示出一些不规律性",
      highPain: "高疼痛水平",
      highPainDesc: "疼痛水平持续较高",
      lowPain: "低疼痛水平",
      lowPainDesc: "疼痛水平得到良好控制",
      highAccuracy: "高预测准确性",
      highAccuracyDesc: "周期预测高度准确"
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

// ================================
// Day 11: 高级功能翻译键
// ================================

// 导出翻译键扩展
export const day11Translations = {
  zh: {
    // 高级导出功能
    advancedExport: {
      title: "高级导出功能",
      customFormat: "自定义导出格式",
      batchExport: "批量导出",
      exportTemplates: "导出模板",
      customFields: "自定义字段",
      dateRange: "日期范围",
      filters: "数据过滤",
      includeCharts: "包含图表",
      includeMetadata: "包含元数据",
      compression: "压缩文件",
      password: "密码保护",
      templateName: "模板名称",
      templateDescription: "模板描述",
      saveTemplate: "保存模板",
      loadTemplate: "加载模板",
      deleteTemplate: "删除模板",
      batchProgress: "批量导出进度",
      totalItems: "总项目数",
      completedItems: "已完成",
      failedItems: "失败项目",
      cancelBatch: "取消批量导出",
      retryFailed: "重试失败项目"
    },
    
    // 用户偏好设置
    userPreferences: {
      title: "用户偏好设置",
      uiPreferences: "界面偏好",
      notificationSettings: "通知设置",
      privacySettings: "隐私设置",
      accessibilitySettings: "无障碍设置",
      exportPreferences: "导出偏好",
      theme: "主题",
      fontSize: "字体大小",
      animations: "动画效果",
      compactMode: "紧凑模式",
      dateFormat: "日期格式",
      timeFormat: "时间格式",
      chartType: "图表类型",
      showTooltips: "显示提示",
      showProgressBars: "显示进度条",
      notifications: "通知",
      reminderTime: "提醒时间",
      reminderDays: "提醒日期",
      quietHours: "免打扰时间",
      notificationChannels: "通知渠道",
      browser: "浏览器",
      email: "邮件",
      sms: "短信",
      push: "推送",
      dataCollection: "数据收集",
      analytics: "分析统计",
      personalization: "个性化",
      shareProgress: "分享进度",
      anonymousMode: "匿名模式",
      exportPassword: "导出密码",
      dataRetention: "数据保留",
      autoDelete: "自动删除",
      highContrast: "高对比度",
      reducedMotion: "减少动画",
      screenReader: "屏幕阅读器",
      keyboardNavigation: "键盘导航",
      focusIndicators: "焦点指示器",
      textScaling: "文本缩放",
      defaultFormat: "默认格式",
      autoSave: "自动保存",
      includeCharts: "包含图表",
      compression: "压缩"
    },
    
    // 主题设置
    themeSettings: {
      title: "主题设置",
      light: "浅色主题",
      dark: "深色主题",
      auto: "自动主题",
      system: "系统主题",
      lightDescription: "适合日间使用的明亮主题",
      darkDescription: "适合夜间使用的深色主题",
      autoDescription: "根据系统设置自动切换",
      systemDescription: "跟随系统主题设置"
    },
    
    // 通知类型
    notificationTypes: {
      reminder: "提醒通知",
      insight: "洞察通知",
      update: "更新通知",
      alert: "警告通知",
      reminderDescription: "经期提醒和健康建议",
      insightDescription: "数据分析和健康洞察",
      updateDescription: "应用更新和功能通知",
      alertDescription: "重要警告和异常情况"
    },
    
    // 设置验证
    settingsValidation: {
      invalidTimeFormat: "时间格式无效，请使用HH:MM格式",
      invalidDays: "提醒天数无效，请选择0-6之间的数字",
      invalidScaling: "文本缩放比例无效，请选择0.8-2.0之间的数值",
      invalidRetention: "数据保留天数无效，请选择30-3650天",
      invalidCacheSize: "缓存大小无效，请选择10-1000MB",
      invalidStorageSize: "存储大小无效，请选择5-500MB",
      templateNotFound: "导出模板不存在",
      exportFailed: "导出失败，请重试",
      invalidPreferences: "偏好设置无效"
    },
    
    // 系统设置
    systemSettings: {
      title: "系统设置",
      performance: "性能设置",
      storage: "存储设置",
      sync: "同步设置",
      enableLazyLoading: "启用懒加载",
      enableCodeSplitting: "启用代码分割",
      enableCaching: "启用缓存",
      maxCacheSize: "最大缓存大小",
      enableLocalStorage: "启用本地存储",
      enableSessionStorage: "启用会话存储",
      maxStorageSize: "最大存储大小",
      autoCleanup: "自动清理",
      cleanupInterval: "清理间隔",
      enableAutoSync: "启用自动同步",
      syncInterval: "同步间隔",
      enableOfflineMode: "启用离线模式",
      conflictResolution: "冲突解决"
    }
  },
  
  en: {
    // Advanced Export Features
    advancedExport: {
      title: "Advanced Export Features",
      customFormat: "Custom Export Format",
      batchExport: "Batch Export",
      exportTemplates: "Export Templates",
      customFields: "Custom Fields",
      dateRange: "Date Range",
      filters: "Data Filters",
      includeCharts: "Include Charts",
      includeMetadata: "Include Metadata",
      compression: "File Compression",
      password: "Password Protection",
      templateName: "Template Name",
      templateDescription: "Template Description",
      saveTemplate: "Save Template",
      loadTemplate: "Load Template",
      deleteTemplate: "Delete Template",
      batchProgress: "Batch Export Progress",
      totalItems: "Total Items",
      completedItems: "Completed",
      failedItems: "Failed Items",
      cancelBatch: "Cancel Batch Export",
      retryFailed: "Retry Failed Items"
    },
    
    // User Preferences
    userPreferences: {
      title: "User Preferences",
      uiPreferences: "UI Preferences",
      notificationSettings: "Notification Settings",
      privacySettings: "Privacy Settings",
      accessibilitySettings: "Accessibility Settings",
      exportPreferences: "Export Preferences",
      theme: "Theme",
      fontSize: "Font Size",
      animations: "Animations",
      compactMode: "Compact Mode",
      dateFormat: "Date Format",
      timeFormat: "Time Format",
      chartType: "Chart Type",
      showTooltips: "Show Tooltips",
      showProgressBars: "Show Progress Bars",
      notifications: "Notifications",
      reminderTime: "Reminder Time",
      reminderDays: "Reminder Days",
      quietHours: "Quiet Hours",
      notificationChannels: "Notification Channels",
      browser: "Browser",
      email: "Email",
      sms: "SMS",
      push: "Push",
      dataCollection: "Data Collection",
      analytics: "Analytics",
      personalization: "Personalization",
      shareProgress: "Share Progress",
      anonymousMode: "Anonymous Mode",
      exportPassword: "Export Password",
      dataRetention: "Data Retention",
      autoDelete: "Auto Delete",
      highContrast: "High Contrast",
      reducedMotion: "Reduced Motion",
      screenReader: "Screen Reader",
      keyboardNavigation: "Keyboard Navigation",
      focusIndicators: "Focus Indicators",
      textScaling: "Text Scaling",
      defaultFormat: "Default Format",
      autoSave: "Auto Save",
      includeCharts: "Include Charts",
      compression: "Compression"
    },
    
    // Theme Settings
    themeSettings: {
      title: "Theme Settings",
      light: "Light Theme",
      dark: "Dark Theme",
      auto: "Auto Theme",
      system: "System Theme",
      lightDescription: "Bright theme suitable for daytime use",
      darkDescription: "Dark theme suitable for nighttime use",
      autoDescription: "Automatically switch based on system settings",
      systemDescription: "Follow system theme settings"
    },
    
    // Notification Types
    notificationTypes: {
      reminder: "Reminder Notifications",
      insight: "Insight Notifications",
      update: "Update Notifications",
      alert: "Alert Notifications",
      reminderDescription: "Period reminders and health advice",
      insightDescription: "Data analysis and health insights",
      updateDescription: "App updates and feature notifications",
      alertDescription: "Important warnings and exceptions"
    },
    
    // Settings Validation
    settingsValidation: {
      invalidTimeFormat: "Invalid time format, please use HH:MM format",
      invalidDays: "Invalid reminder days, please select numbers between 0-6",
      invalidScaling: "Invalid text scaling, please select values between 0.8-2.0",
      invalidRetention: "Invalid data retention, please select 30-3650 days",
      invalidCacheSize: "Invalid cache size, please select 10-1000MB",
      invalidStorageSize: "Invalid storage size, please select 5-500MB",
      templateNotFound: "Export template not found",
      exportFailed: "Export failed, please try again",
      invalidPreferences: "Invalid preferences"
    },
    
    // System Settings
    systemSettings: {
      title: "System Settings",
      performance: "Performance Settings",
      storage: "Storage Settings",
      sync: "Sync Settings",
      enableLazyLoading: "Enable Lazy Loading",
      enableCodeSplitting: "Enable Code Splitting",
      enableCaching: "Enable Caching",
      maxCacheSize: "Max Cache Size",
      enableLocalStorage: "Enable Local Storage",
      enableSessionStorage: "Enable Session Storage",
      maxStorageSize: "Max Storage Size",
      autoCleanup: "Auto Cleanup",
      cleanupInterval: "Cleanup Interval",
      enableAutoSync: "Enable Auto Sync",
      syncInterval: "Sync Interval",
      enableOfflineMode: "Enable Offline Mode",
      conflictResolution: "Conflict Resolution"
    }
  }
};
