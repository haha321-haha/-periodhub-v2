// PDF资源配置
import type { PDFCategory } from "@/types/pdf";

export interface PDFResource {
  id: string;
  title: string;
  titleKey: string;
  description: string;
  descriptionKey: string;
  filename: string;
  category: PDFCategory;
  size: string;
  downloadUrl: string;
  icon: string;
  featured?: boolean;
  fileSize?: number;
  createdAt?: string;
  updatedAt?: string;
  // 多语言版本支持
  versions?: {
    zh: {
      title: string;
      description: string;
    };
    en: {
      title: string;
      description: string;
    };
    zhEn: {
      title: string;
      description: string;
    };
  };
}

export const pdfResources: PDFResource[] = [
  {
    id: "pain-tracking-form",
    title: "疼痛追踪表",
    titleKey: "painTrackingForm.title",
    description: "详细的疼痛追踪方法和记录技巧",
    descriptionKey: "painTrackingForm.description",
    filename: "pain-tracking-form.pdf",
    category: "management-tools",
    size: "2.5MB",
    downloadUrl: "/downloads/pain-tracking-form.pdf",
    icon: "📊",
    fileSize: 2500,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    // 多语言版本支持
    versions: {
      zh: {
        title: "疼痛追踪表",
        description: "详细的疼痛追踪方法和记录技巧",
      },
      en: {
        title: "Pain Tracking Form",
        description: "Detailed pain tracking methods and recording techniques",
      },
      zhEn: {
        title: "Pain Tracking Form / 疼痛追踪表",
        description:
          "Detailed pain tracking methods and recording techniques / 详细的疼痛追踪方法和记录技巧",
      },
    },
  },
  {
    id: "constitution-guide",
    title: "中医体质养生指南",
    titleKey: "constitutionGuide.title",
    description: "基于中医体质理论的个性化养生建议",
    descriptionKey: "constitutionGuide.description",
    filename: "constitution-guide.pdf",
    category: "management-tools",
    size: "3.2MB",
    downloadUrl: "/downloads/constitution-guide.pdf",
    icon: "🌿",
    fileSize: 3200,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    // 多语言版本支持
    versions: {
      zh: {
        title: "中医体质养生指南",
        description: "基于中医体质理论的个性化养生建议",
      },
      en: {
        title: "TCM Constitution Health Guide",
        description:
          "Personalized health recommendations based on TCM constitution theory",
      },
      zhEn: {
        title: "TCM Constitution Health Guide / 中医体质养生指南",
        description:
          "Personalized health recommendations based on TCM constitution theory / 基于中医体质理论的个性化养生建议",
      },
    },
  },
  {
    id: "campus-emergency-checklist",
    title: "校园应急清单",
    titleKey: "campusEmergencyChecklist.title",
    description: "学生专用的经期应急处理指南和必备物品清单",
    descriptionKey: "campusEmergencyChecklist.description",
    filename: "campus-emergency-checklist.pdf",
    category: "management-tools",
    size: "1.8MB",
    downloadUrl: "/downloads/campus-emergency-checklist.pdf",
    icon: "🏫",
    fileSize: 1800,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    versions: {
      zh: {
        title: "校园应急清单",
        description: "学生专用的经期应急处理指南和必备物品清单",
      },
      en: {
        title: "Campus Emergency Checklist",
        description:
          "Student-specific menstrual emergency handling guide and essential items checklist",
      },
      zhEn: {
        title: "Campus Emergency Checklist / 校园应急清单",
        description:
          "Student-specific menstrual emergency handling guide and essential items checklist / 学生专用的经期应急处理指南和必备物品清单",
      },
    },
  },
  // 注释：menstrual-health-handbook.pdf 文件不存在，暂时移除配置
  // {
  //   id: 'menstrual-health-handbook',
  //   title: '月经健康手册',
  //   titleKey: 'menstrualHealthHandbook.title',
  //   description: '全面的月经健康知识和护理指南',
  //   descriptionKey: 'menstrualHealthHandbook.description',
  //   filename: 'menstrual-health-handbook.pdf',
  //   category: 'health-management',
  //   size: '4.1MB',
  //   downloadUrl: '/downloads/menstrual-health-handbook.pdf',
  //   icon: '📚',
  //   fileSize: 4100,
  //   createdAt: '2024-01-15',
  //   updatedAt: '2024-01-15'
  // },
  {
    id: "menstrual-cycle-nutrition-plan",
    title: "经期营养计划",
    titleKey: "menstrualCycleNutritionPlan.title",
    description: "科学的经期营养指导方案",
    descriptionKey: "menstrualCycleNutritionPlan.description",
    filename: "menstrual-cycle-nutrition-plan.pdf",
    category: "health-management",
    size: "3.5MB",
    downloadUrl: "/downloads/menstrual-cycle-nutrition-plan.pdf",
    icon: "🥗",
    fileSize: 3500,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    // 多语言版本支持
    versions: {
      zh: {
        title: "经期营养计划",
        description: "科学的经期营养指导方案",
      },
      en: {
        title: "Menstrual Cycle Nutrition Plan",
        description: "Scientific menstrual nutrition guidance program",
      },
      zhEn: {
        title: "Menstrual Cycle Nutrition Plan / 经期营养计划",
        description:
          "Scientific menstrual nutrition guidance program / 科学的经期营养指导方案",
      },
    },
  },
  {
    id: "healthy-habits-checklist",
    title: "健康习惯清单",
    titleKey: "healthyHabitsChecklist.title",
    description: "建立有益于经期健康的日常习惯",
    descriptionKey: "healthyHabitsChecklist.description",
    filename: "healthy-habits-checklist.pdf",
    category: "management-tools",
    size: "2.2MB",
    downloadUrl: "/downloads/healthy-habits-checklist.pdf",
    icon: "✅",
    fileSize: 2200,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    // 多语言版本支持
    versions: {
      zh: {
        title: "健康习惯清单",
        description: "建立有益于经期健康的日常习惯",
      },
      en: {
        title: "Healthy Habits Checklist",
        description: "Establish daily habits beneficial for menstrual health",
      },
      zhEn: {
        title: "Healthy Habits Checklist / 健康习惯清单",
        description:
          "Establish daily habits beneficial for menstrual health / 建立有益于经期健康的日常习惯",
      },
    },
  },
  {
    id: "natural-therapy-assessment",
    title: "自然疗法效果评估表",
    titleKey: "naturalTherapyAssessment.title",
    description: "系统评估不同自然疗法的个人效果",
    descriptionKey: "naturalTherapyAssessment.description",
    filename: "natural-therapy-assessment.pdf",
    category: "educational-resources",
    size: "3.8MB",
    downloadUrl: "/downloads/natural-therapy-assessment.pdf",
    icon: "🌿",
    fileSize: 3800,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    // 多语言版本支持
    versions: {
      zh: {
        title: "自然疗法效果评估表",
        description: "系统评估不同自然疗法的个人效果",
      },
      en: {
        title: "Natural Therapy Assessment",
        description:
          "Systematically evaluate the personal effectiveness of different natural therapies",
      },
      zhEn: {
        title: "Natural Therapy Assessment / 自然疗法效果评估表",
        description:
          "Systematically evaluate the personal effectiveness of different natural therapies / 系统评估不同自然疗法的个人效果",
      },
    },
  },
  {
    id: "parent-communication-guide",
    title: "家长沟通指导手册",
    titleKey: "parentCommunicationGuide.title",
    description: "帮助家长理解青春期女儿的生理变化",
    descriptionKey: "parentCommunicationGuide.description",
    filename: "parent-communication-guide.pdf",
    category: "communication-guidance",
    size: "4.2MB",
    downloadUrl: "/downloads/parent-communication-guide.pdf",
    icon: "👨‍👩‍👧",
    fileSize: 4200,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    versions: {
      zh: {
        title: "家长沟通指导手册",
        description: "帮助家长理解青春期女儿的生理变化",
      },
      en: {
        title: "Parent Communication Guide",
        description:
          "Helping parents understand their adolescent daughter's physiological changes",
      },
      zhEn: {
        title: "Parent Communication Guide / 家长沟通指导手册",
        description:
          "Helping parents understand their adolescent daughter's physiological changes / 帮助家长理解青春期女儿的生理变化",
      },
    },
  },
  {
    id: "teacher-health-manual",
    title: "教师健康管理手册",
    titleKey: "teacherHealthManual.title",
    description: "学校环境下的经期健康管理",
    descriptionKey: "teacherHealthManual.description",
    filename: "teacher-health-manual.pdf",
    category: "educational-resources",
    size: "3.9MB",
    downloadUrl: "/downloads/teacher-health-manual.pdf",
    icon: "👩‍🏫",
    fileSize: 3900,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    versions: {
      zh: {
        title: "教师健康管理手册",
        description: "学校环境下的经期健康管理",
      },
      en: {
        title: "Teacher Health Management Manual",
        description: "Menstrual health management in school environment",
      },
      zhEn: {
        title: "Teacher Health Management Manual / 教师健康管理手册",
        description:
          "Menstrual health management in school environment / 学校环境下的经期健康管理",
      },
    },
  },
  {
    id: "teacher-collaboration-handbook",
    title: "教师协作手册",
    titleKey: "teacherCollaborationHandbook.title",
    description: "多学科教师间的协作机制",
    descriptionKey: "teacherCollaborationHandbook.description",
    filename: "teacher-collaboration-handbook.pdf",
    category: "educational-resources",
    size: "3.6MB",
    downloadUrl: "/downloads/teacher-collaboration-handbook.pdf",
    icon: "🤝",
    fileSize: 3600,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    // 多语言版本支持
    versions: {
      zh: {
        title: "教师协作手册",
        description: "多学科教师间的协作机制",
      },
      en: {
        title: "Teacher Collaboration Handbook",
        description:
          "Collaborative mechanisms between multidisciplinary teachers",
      },
      zhEn: {
        title: "Teacher Collaboration Handbook / 教师协作手册",
        description:
          "Collaborative mechanisms between multidisciplinary teachers / 多学科教师间的协作机制",
      },
    },
  },
  {
    id: "specific-menstrual-pain-management-guide",
    title: "特定痛经管理指南",
    titleKey: "specificMenstrualPainManagementGuide.title",
    description: "针对不同类型痛经的个性化方案",
    descriptionKey: "specificMenstrualPainManagementGuide.description",
    filename: "specific-menstrual-pain-management-guide.pdf",
    category: "health-management",
    size: "4.5MB",
    downloadUrl: "/downloads/specific-menstrual-pain-management-guide.pdf",
    icon: "🎯",
    fileSize: 4500,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    versions: {
      zh: {
        title: "特定痛经管理指南",
        description: "针对不同类型痛经的个性化方案",
      },
      en: {
        title: "Specific Menstrual Pain Management Guide",
        description:
          "Personalized solutions for different types of menstrual pain",
      },
      zhEn: {
        title: "Specific Menstrual Pain Management Guide / 特定痛经管理指南",
        description:
          "Personalized solutions for different types of menstrual pain / 针对不同类型痛经的个性化方案",
      },
    },
  },
  {
    id: "menstrual-pain-complications-management",
    title: "并发症管理指南",
    titleKey: "menstrualPainComplicationsManagement.title",
    description: "识别经期并发症的早期征象",
    descriptionKey: "menstrualPainComplicationsManagement.description",
    filename: "menstrual-pain-complications-management.pdf",
    category: "health-management",
    size: "3.7MB",
    downloadUrl: "/downloads/menstrual-pain-complications-management.pdf",
    icon: "⚠️",
    fileSize: 3700,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    // 多语言版本支持
    versions: {
      zh: {
        title: "并发症管理指南",
        description: "识别经期并发症的早期征象",
      },
      en: {
        title: "Complications Management Guide",
        description: "Identify early signs of menstrual complications",
      },
      zhEn: {
        title: "Complications Management Guide / 并发症管理指南",
        description:
          "Identify early signs of menstrual complications / 识别经期并发症的早期征象",
      },
    },
  },
  {
    id: "magnesium-gut-health-menstrual-pain-guide",
    title: "镁与肠道健康指南",
    titleKey: "magnesiumGutHealthGuide.title",
    description: "镁元素对经期健康的重要作用",
    descriptionKey: "magnesiumGutHealthGuide.description",
    filename: "magnesium-gut-health-menstrual-pain-guide.pdf",
    category: "health-management",
    size: "3.3MB",
    downloadUrl: "/downloads/magnesium-gut-health-menstrual-pain-guide.pdf",
    icon: "💊",
    fileSize: 3300,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    // 多语言版本支持
    versions: {
      zh: {
        title: "镁与肠道健康指南",
        description: "镁元素对经期健康的重要作用",
      },
      en: {
        title: "Magnesium & Gut Health Guide",
        description: "The important role of magnesium in menstrual health",
      },
      zhEn: {
        title: "Magnesium & Gut Health Guide / 镁与肠道健康指南",
        description:
          "The important role of magnesium in menstrual health / 镁元素对经期健康的重要作用",
      },
    },
  },
  {
    id: "zhan-zhuang-baduanjin-illustrated-guide",
    title: "站桩八段锦图解指南",
    titleKey: "zhanZhuangBaduanjinIllustratedGuide.title",
    description: "传统中医养生功法的现代应用",
    descriptionKey: "zhanZhuangBaduanjinIllustratedGuide.description",
    filename: "zhan-zhuang-baduanjin-illustrated-guide.pdf",
    category: "health-management",
    size: "4.8MB",
    downloadUrl: "/downloads/zhan-zhuang-baduanjin-illustrated-guide.pdf",
    icon: "🧘‍♀️",
    fileSize: 4800,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    // 多语言版本支持
    versions: {
      zh: {
        title: "站桩八段锦图解指南",
        description: "传统中医养生功法的现代应用",
      },
      en: {
        title: "Zhan Zhuang Baduanjin Illustrated Guide",
        description: "Modern application of traditional TCM health practices",
      },
      zhEn: {
        title: "Zhan Zhuang Baduanjin Illustrated Guide / 站桩八段锦图解指南",
        description:
          "Modern application of traditional TCM health practices / 传统中医养生功法的现代应用",
      },
    },
  },
  {
    id: "us-insurance-quick-reference-card",
    title: "美国医疗保险快速参考卡",
    titleKey: "usInsuranceQuickReferenceCard.title",
    description: "2025年Medicare Part D覆盖缺口期完全取消",
    descriptionKey: "usInsuranceQuickReferenceCard.description",
    filename: "us-insurance-quick-reference-card.pdf",
    category: "educational-resources",
    size: "2.9MB",
    downloadUrl: "/downloads/us-insurance-quick-reference-card.pdf",
    icon: "🏥",
    fileSize: 2900,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    // 多语言版本支持
    versions: {
      zh: {
        title: "美国医疗保险快速参考卡",
        description: "2025年Medicare Part D覆盖缺口期完全取消",
      },
      en: {
        title: "US Insurance Quick Reference Card",
        description:
          "Complete elimination of Medicare Part D coverage gap in 2025",
      },
      zhEn: {
        title: "US Insurance Quick Reference Card / 美国医疗保险快速参考卡",
        description:
          "Complete elimination of Medicare Part D coverage gap in 2025 / 2025年Medicare Part D覆盖缺口期完全取消",
      },
    },
  },
  // === P2阶段新增：精油/芳香疗法相关PDF ===
  {
    id: "essential-oils-aromatherapy-menstrual-pain-guide",
    title: "精油芳香疗法缓解痛经：全面指南",
    titleKey: "essentialOilsAromatherapyGuide.title",
    description: "深入了解精油芳香疗法的科学原理、使用方法和安全注意事项",
    descriptionKey: "essentialOilsAromatherapyGuide.description",
    filename: "essential-oils-aromatherapy-menstrual-pain-guide.pdf",
    category: "health-management",
    size: "2.4MB",
    downloadUrl:
      "/downloads/essential-oils-aromatherapy-menstrual-pain-guide.pdf",
    icon: "🌸",
    featured: true,
    fileSize: 2400,
    createdAt: "2024-02-15",
    updatedAt: "2024-02-15",
    versions: {
      zh: {
        title: "精油芳香疗法缓解痛经：全面指南",
        description:
          "深入了解精油芳香疗法的科学原理、使用方法和安全注意事项，包括薰衣草、生姜、玫瑰等精油的应用",
      },
      en: {
        title:
          "Essential Oils Aromatherapy for Menstrual Pain Relief: Complete Guide",
        description:
          "In-depth understanding of the scientific principles, usage methods, and safety precautions of essential oils aromatherapy",
      },
      zhEn: {
        title:
          "Essential Oils Aromatherapy for Menstrual Pain Relief / 精油芳香疗法缓解痛经",
        description:
          "In-depth understanding of essential oils aromatherapy / 深入了解精油芳香疗法的科学原理和使用方法",
      },
    },
  },
  // === P2阶段新增：IUD/避孕相关PDF ===
  {
    id: "comprehensive-iud-guide",
    title: "宫内节育器(IUD)：全面指南与用户须知",
    titleKey: "comprehensiveIudGuide.title",
    description:
      "详细了解宫内节育器的类型、工作原理、优缺点、副作用和使用注意事项",
    descriptionKey: "comprehensiveIudGuide.description",
    filename: "comprehensive-iud-guide.pdf",
    category: "health-management",
    size: "3.1MB",
    downloadUrl: "/downloads/comprehensive-iud-guide.pdf",
    icon: "🔬",
    featured: true,
    fileSize: 3100,
    createdAt: "2024-02-20",
    updatedAt: "2024-02-20",
    versions: {
      zh: {
        title: "宫内节育器(IUD)：全面指南与用户须知",
        description:
          "详细了解宫内节育器的类型、工作原理、优缺点、副作用和使用注意事项，帮助您做出明智的避孕选择",
      },
      en: {
        title: "Intrauterine Device (IUD): Comprehensive Guide and User Manual",
        description:
          "Detailed understanding of IUD types, working principles, pros and cons, side effects, and usage precautions",
      },
      zhEn: {
        title: "Intrauterine Device (IUD) / 宫内节育器：全面指南",
        description:
          "Comprehensive guide to IUD types and usage / 宫内节育器类型和使用的全面指南",
      },
    },
  },
  // === P2阶段新增：NSAIDs/药物治疗相关PDF ===
  {
    id: "nsaid-menstrual-pain-professional-guide",
    title: "NSAID药物治疗痛经：专业指南与安全用药",
    titleKey: "nsaidProfessionalGuide.title",
    description: "使用NSAID缓解痛经的专业指南，包含安全注意事项和剂量建议",
    descriptionKey: "nsaidProfessionalGuide.description",
    filename: "nsaid-menstrual-pain-professional-guide.pdf",
    category: "health-management",
    size: "2.8MB",
    downloadUrl: "/downloads/nsaid-menstrual-pain-professional-guide.pdf",
    icon: "💊",
    featured: true,
    fileSize: 2800,
    createdAt: "2024-02-25",
    updatedAt: "2024-02-25",
    versions: {
      zh: {
        title: "NSAID药物治疗痛经：专业指南与安全用药",
        description:
          "使用NSAID缓解痛经的专业指南，包含布洛芬、萘普生等药物的安全注意事项和剂量建议",
      },
      en: {
        title:
          "NSAID Medication for Menstrual Pain: Professional Guide and Safe Use",
        description:
          "Professional guide to using NSAIDs for menstrual pain relief, with safety considerations and dosage recommendations",
      },
      zhEn: {
        title: "NSAID Medication for Menstrual Pain / NSAID药物治疗痛经",
        description:
          "Professional guide to NSAIDs for pain relief / NSAID缓解痛经的专业指南",
      },
    },
  },
  // === P2阶段新增：营养补充剂相关PDF（待创建内容后启用）===
  // TODO: 创建dietary-supplements-menstrual-pain-guide.md内容后启用
  // {
  //   id: "dietary-supplements-menstrual-pain-guide",
  //   title: "膳食补充剂与痛经：镁、欧米茄3等营养素指南",
  //   titleKey: "dietarySupplementsGuide.title",
  //   description: "科学了解膳食补充剂对痛经的作用，包括镁、欧米茄3、维生素等营养素的使用指南",
  //   descriptionKey: "dietarySupplementsGuide.description",
  //   filename: "dietary-supplements-menstrual-pain-guide.pdf",
  //   category: "health-management",
  //   size: "2.6MB",
  //   downloadUrl: "/downloads/dietary-supplements-menstrual-pain-guide.pdf",
  //   icon: "🥗",
  //   fileSize: 2600,
  //   createdAt: "2024-03-01",
  //   updatedAt: "2024-03-01",
  //   versions: {
  //     zh: {
  //       title: "膳食补充剂与痛经：镁、欧米茄3等营养素指南",
  //       description: "科学了解膳食补充剂对痛经的作用，包括镁、欧米茄3、维生素等营养素的使用指南",
  //     },
  //     en: {
  //       title: "Dietary Supplements and Menstrual Pain: Guide to Magnesium, Omega 3 and Other Nutrients",
  //       description: "Scientific understanding of dietary supplements for menstrual pain, including usage guide for magnesium, omega 3, vitamins",
  //     },
  //     zhEn: {
  //       title: "Dietary Supplements and Menstrual Pain / 膳食补充剂与痛经",
  //       description: "Guide to supplements for menstrual pain / 膳食补充剂对痛经的作用指南",
  //     },
  //   },
  // },
  // === P2阶段新增：草药疗法相关PDF（待创建内容后启用）===
  // TODO: 创建herbal-remedies-menstrual-pain-guide.md内容后启用
  // {
  //   id: "herbal-remedies-menstrual-pain-guide",
  //   title: "草药疗法缓解痛经：传统智慧与现代验证",
  //   titleKey: "herbalRemedies.title",
  //   description: "探索传统草药疗法在缓解痛经中的应用，包括姜茶、姜黄、甘菊茶等草药的科学验证",
  //   descriptionKey: "herbalRemedies.description",
  //   filename: "herbal-remedies-menstrual-pain-guide.pdf",
  //   category: "health-management",
  //   size: "2.5MB",
  //   downloadUrl: "/downloads/herbal-remedies-menstrual-pain-guide.pdf",
  //   icon: "🌿",
  //   fileSize: 2500,
  //   createdAt: "2024-03-05",
  //   updatedAt: "2024-03-05",
  //   versions: {
  //     zh: {
  //       title: "草药疗法缓解痛经：传统智慧与现代验证",
  //       description: "探索传统草药疗法在缓解痛经中的应用，包括姜茶、姜黄、甘菊茶等草药的科学验证",
  //     },
  //     en: {
  //       title: "Herbal Remedies for Menstrual Pain: Traditional Wisdom and Modern Validation",
  //       description: "Explore traditional herbal remedies for menstrual pain, including scientific validation of ginger tea, turmeric, chamomile tea",
  //     },
  //     zhEn: {
  //       title: "Herbal Remedies for Menstrual Pain / 草药疗法缓解痛经",
  //       description: "Traditional herbal remedies with modern validation / 传统草药疗法的现代验证",
  //     },
  //   },
  // },
];

// 导出兼容名称
export const PDF_RESOURCES = pdfResources;

export const getPDFResource = (id: string): PDFResource | undefined => {
  return pdfResources.find((resource) => resource.id === id);
};

export const getPDFResourcesByCategory = (category: string): PDFResource[] => {
  return pdfResources.filter((resource) => resource.category === category);
};

export const getPDFResourceById = getPDFResource;

// 新增导出函数以满足构建需求
export const getAllPDFResources = (): PDFResource[] => {
  return pdfResources;
};

export const getAllCategories = (): PDFCategory[] => {
  return Array.from(
    new Set(pdfResources.map((r) => r.category)),
  ) as PDFCategory[];
};

export const getCategoryInfo = (categoryId: PDFCategory) => {
  const categoryMap: Record<
    PDFCategory,
    {
      id: PDFCategory;
      titleKey: string;
      descriptionKey: string;
      icon: string;
      order: number;
    }
  > = {
    "management-tools": {
      id: "management-tools",
      titleKey: "categories.managementTools",
      descriptionKey: "categories.managementToolsDescription",
      icon: "📊",
      order: 1,
    },
    "health-management": {
      id: "health-management",
      titleKey: "categories.healthManagement",
      descriptionKey: "categories.healthManagementDescription",
      icon: "💊",
      order: 2,
    },
    "communication-guidance": {
      id: "communication-guidance",
      titleKey: "categories.communication",
      descriptionKey: "categories.communicationDescription",
      icon: "💬",
      order: 3,
    },
    "educational-resources": {
      id: "educational-resources",
      titleKey: "categories.education",
      descriptionKey: "categories.educationDescription",
      icon: "📚",
      order: 4,
    },
  };
  return categoryMap[categoryId];
};

export const getResourceStats = () => {
  return {
    totalPDFs: pdfResources.length,
    totalCategories: Array.from(new Set(pdfResources.map((r) => r.category)))
      .length,
    categoryStats: pdfResources.reduce(
      (acc, r) => {
        acc[r.category] = (acc[r.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
    featuredCount: pdfResources.filter((r) => r.featured).length,
  };
};

export default pdfResources;
