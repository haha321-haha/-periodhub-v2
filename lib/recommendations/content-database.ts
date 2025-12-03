/**
 * 推荐内容数据库
 * Phase 3: 个性化推荐系统 - 推荐内容多样化
 */

import {
  RecommendationContent,
  RecommendationPriority,
  RecommendationType,
  // RecommendationTrigger, // 已注释：当前未使用
  // LocalizedText, // 已注释：当前未使用
} from "@/types/recommendations";

/**
 * 推荐内容数据库类
 */
export class RecommendationContentDatabase {
  private contents: Map<string, RecommendationContent> = new Map();

  constructor() {
    this.initializeContentDatabase();
  }

  /**
   * 初始化推荐内容数据库
   */
  private initializeContentDatabase(): void {
    // 运动推荐内容
    const exerciseContents: RecommendationContent[] = [
      {
        id: "exercise_yoga_menstrual",
        type: "exercise",
        title: { zh: "经期瑜伽练习", en: "Menstrual Yoga Practice" },
        description: {
          zh: "专为经期设计的温和瑜伽动作，帮助缓解痛经和腹部不适。",
          en: "Gentle yoga poses specifically designed for menstruation to help relieve dysmenorrhea and abdominal discomfort.",
        },
        actionSteps: [
          {
            zh: "猫牛式：跪姿，脊柱缓慢起伏，重复5-8次",
            en: "Cat-Cow: Kneeling position, slowly arch and round spine, repeat 5-8 times",
          },
          {
            zh: "婴儿式：跪姿，身体前倾，额头贴地，保持30秒",
            en: "Child's Pose: Kneeling, fold forward, forehead to ground, hold 30 seconds",
          },
          {
            zh: "蝴蝶式：坐姿，脚底相对，轻柔上下摆动膝盖",
            en: "Butterfly Pose: Sitting, soles together, gently flap knees up and down",
          },
          {
            zh: "躺姿扭转：仰卧，双膝弯曲，左右轻柔扭转",
            en: "Supine Twist: Lying on back, knees bent, gentle side-to-side twists",
          },
        ],
        priority: "medium",
        triggerConditions: ["cycle_phase", "assessment_complete"],
        targetAudience: {
          painLevel: [4, 5, 6, 7],
          phases: ["menstrual"],
        },
        evidence: "研究表明经期瑜伽能显著降低痛经程度，改善情绪状态。",
        resources: [
          {
            id: "menstrual_yoga_video",
            title: {
              zh: "经期瑜伽完整视频教程",
              en: "Complete Menstrual Yoga Video Tutorial",
            },
            description: {
              zh: "15分钟经期瑜伽跟练视频",
              en: "15-minute guided menstrual yoga video",
            },
            type: "video",
            url: "/resources/menstrual-yoga",
            duration: 900,
          },
        ],
        validityPeriod: {},
        category: "运动健康",
        tags: ["瑜伽", "经期", "运动", "温和", "拉伸"],
      },
      {
        id: "exercise_walking",
        type: "exercise",
        title: { zh: "日常步行计划", en: "Daily Walking Plan" },
        description: {
          zh: "适合各阶段的步行运动计划，提升体质，改善情绪。",
          en: "Walking exercise plan suitable for all phases to improve physical fitness and mood.",
        },
        actionSteps: [
          {
            zh: "经期：每日20-30分钟轻松步行",
            en: "Menstrual: 20-30 minutes easy walking daily",
          },
          {
            zh: "卵泡期：增加到30-45分钟中等强度步行",
            en: "Follicular: Increase to 30-45 minutes moderate walking",
          },
          {
            zh: "排卵期：保持45分钟，可加入轻度坡度",
            en: "Ovulation: Maintain 45 minutes, can add gentle inclines",
          },
          {
            zh: "黄体期：回到30分钟，注意休息",
            en: "Luteal: Return to 30 minutes, focus on rest",
          },
        ],
        priority: "low",
        triggerConditions: ["time_based", "assessment_complete"],
        targetAudience: {
          stressLevel: [3, 4, 5, 6, 7],
        },
        evidence: "规律步行能改善血液循环，释放内啡肽，缓解经期不适。",
        resources: [
          {
            id: "walking_tracker",
            title: { zh: "步行记录器", en: "Walking Tracker" },
            description: {
              zh: "追踪步行进度和成就",
              en: "Track walking progress and achievements",
            },
            type: "tool",
            url: "/tools/walking-tracker",
          },
        ],
        validityPeriod: {},
        category: "运动健康",
        tags: ["步行", "有氧运动", "日常", "体质提升"],
      },
    ];

    // 营养推荐内容
    const nutritionContents: RecommendationContent[] = [
      {
        id: "nutrition_magnesium",
        type: "nutrition",
        title: { zh: "镁元素补充方案", en: "Magnesium Supplementation Plan" },
        description: {
          zh: "通过饮食补充镁元素，有效缓解痛经和焦虑症状。",
          en: "Supplement magnesium through diet to effectively relieve menstrual pain and anxiety symptoms.",
        },
        actionSteps: [
          {
            zh: "增加深绿色蔬菜：菠菜、羽衣甘蓝每日150g",
            en: "Increase dark leafy greens: 150g spinach, kale daily",
          },
          {
            zh: "坚果和种子：杏仁、南瓜籽每日30g",
            en: "Nuts and seeds: 30g almonds, pumpkin seeds daily",
          },
          {
            zh: "全谷物：糙米、燕麦每日100g",
            en: "Whole grains: 100g brown rice, oats daily",
          },
          {
            zh: "黑巧克力：70%以上可可，每日20g",
            en: "Dark chocolate: 70%+ cocoa, 20g daily",
          },
        ],
        priority: "medium",
        triggerConditions: ["assessment_complete", "cycle_phase"],
        targetAudience: {
          painLevel: [5, 6, 7, 8],
          phases: ["menstrual", "luteal"],
        },
        evidence: "镁能放松肌肉，调节神经系统，经研究证实对痛经有效。",
        resources: [
          {
            id: "magnesium_foods",
            title: { zh: "高铁镁食物清单", en: "High Magnesium Foods List" },
            description: {
              zh: "含镁丰富的食物和食谱",
              en: "Magnesium-rich foods and recipes",
            },
            type: "recipe",
            url: "/resources/magnesium-foods",
          },
        ],
        validityPeriod: {},
        category: "营养管理",
        tags: ["镁", "矿物质", "痛经", "饮食", "补充"],
      },
      {
        id: "nutrition_omega3",
        type: "nutrition",
        title: {
          zh: "Omega-3脂肪酸抗炎方案",
          en: "Omega-3 Anti-inflammatory Plan",
        },
        description: {
          zh: "通过Omega-3脂肪酸减少炎症反应，缓解经期疼痛。",
          en: "Reduce inflammatory response through Omega-3 fatty acids to relieve menstrual pain.",
        },
        actionSteps: [
          {
            zh: "深海鱼：三文鱼、鲭鱼每周2-3次",
            en: "Deep-sea fish: Salmon, mackerel 2-3 times per week",
          },
          {
            zh: "亚麻籽：每日1汤匙研磨亚麻籽",
            en: "Flaxseeds: 1 tablespoon ground flaxseeds daily",
          },
          { zh: "核桃：每日5-8个核桃", en: "Walnuts: 5-8 walnuts daily" },
          {
            zh: "奇亚籽：可加入酸奶或沙拉，每日1汤匙",
            en: "Chia seeds: Add to yogurt or salad, 1 tablespoon daily",
          },
        ],
        priority: "medium",
        triggerConditions: ["assessment_complete"],
        targetAudience: {
          painLevel: [6, 7, 8, 9],
        },
        evidence: "Omega-3具有天然抗炎作用，可减少前列腺素产生，缓解痛经。",
        resources: [
          {
            id: "omega3_recipes",
            title: { zh: "Omega-3营养食谱", en: "Omega-3 Nutrition Recipes" },
            description: {
              zh: "富含Omega-3的美味食谱",
              en: "Delicious recipes rich in Omega-3",
            },
            type: "recipe",
            url: "/resources/omega3-recipes",
          },
        ],
        validityPeriod: {},
        category: "营养管理",
        tags: ["Omega-3", "抗炎", "脂肪酸", "营养", "痛经"],
      },
    ];

    // 自我护理推荐内容
    const selfcareContents: RecommendationContent[] = [
      {
        id: "selfcare_aromatherapy",
        type: "selfcare",
        title: { zh: "芳香疗法放松", en: "Aromatherapy Relaxation" },
        description: {
          zh: "使用精油芳香疗法，缓解压力和身体不适。",
          en: "Use essential oil aromatherapy to relieve stress and physical discomfort.",
        },
        actionSteps: [
          {
            zh: "薰衣草精油：3-5滴加入香薰机，帮助放松",
            en: "Lavender essential oil: 3-5 drops in diffuser for relaxation",
          },
          {
            zh: "洋甘菊精油：稀释后轻柔按摩腹部",
            en: "Chamomile essential oil: Diluted and gently massage abdomen",
          },
          {
            zh: "生姜精油：热敷时加入2-3滴，缓解痛经",
            en: "Ginger essential oil: Add 2-3 drops to heat pack for dysmenorrhea relief",
          },
          {
            zh: "玫瑰精油：泡澡时加入5-8滴，舒缓身心",
            en: "Rose essential oil: Add 5-8 drops to bath for body and mind soothing",
          },
        ],
        priority: "low",
        triggerConditions: ["assessment_complete", "time_based"],
        targetAudience: {
          stressLevel: [5, 6, 7, 8, 9],
        },
        evidence: "芳香疗法通过嗅觉系统影响大脑，能有效降低压力激素。",
        resources: [
          {
            id: "aromatherapy_guide",
            title: { zh: "芳香疗法安全指南", en: "Aromatherapy Safety Guide" },
            description: {
              zh: "精油使用安全和注意事项",
              en: "Essential oil safety and precautions",
            },
            type: "article",
            url: "/resources/aromatherapy-safety",
          },
        ],
        validityPeriod: {},
        category: "自我护理",
        tags: ["芳香疗法", "精油", "放松", "减压", "自然疗法"],
      },
      {
        id: "selfcare_bath_therapy",
        type: "selfcare",
        title: { zh: "草药浴疗方案", en: "Herbal Bath Therapy" },
        description: {
          zh: "使用草药浸泡，促进血液循环，缓解肌肉紧张。",
          en: "Use herbal soaks to promote blood circulation and relieve muscle tension.",
        },
        actionSteps: [
          {
            zh: "艾草浴包：热水浸泡15-20分钟",
            en: "Mugwort bath bag: Soak in hot water for 15-20 minutes",
          },
          {
            zh: "生姜浴：切片生姜煮水后加入浴缸",
            en: "Ginger bath: Boil sliced ginger and add to bathtub",
          },
          {
            zh: "薰衣草浴：加入薰衣草精油和浴盐",
            en: "Lavender bath: Add lavender essential oil and bath salts",
          },
          {
            zh: "玫瑰花瓣浴：新鲜或干玫瑰花瓣浸泡",
            en: "Rose petal bath: Soak with fresh or dried rose petals",
          },
        ],
        priority: "medium",
        triggerConditions: ["cycle_phase"],
        targetAudience: {
          painLevel: [4, 5, 6, 7],
          phases: ["menstrual"],
        },
        evidence: "温水浴配合草药能放松肌肉，改善局部血液循环。",
        resources: [
          {
            id: "herbal_bath_recipes",
            title: { zh: "草药浴配方大全", en: "Complete Herbal Bath Recipes" },
            description: {
              zh: "各种功效的草药浴配方",
              en: "Herbal bath recipes for various effects",
            },
            type: "recipe",
            url: "/resources/herbal-bath-recipes",
          },
        ],
        validityPeriod: {},
        category: "自我护理",
        tags: ["草药浴", "泡澡", "放松", "血液循环", "中医"],
      },
    ];

    // 职场健康推荐内容
    const workplaceContents: RecommendationContent[] = [
      {
        id: "workplace_ergonomics",
        type: "workplace",
        title: {
          zh: "办公环境人机工学调整",
          en: "Workplace Ergonomics Adjustment",
        },
        description: {
          zh: "优化工作环境，减少身体压力，提升工作舒适度。",
          en: "Optimize work environment to reduce physical stress and improve comfort.",
        },
        actionSteps: [
          {
            zh: "调整座椅高度：双脚平放，膝盖90度",
            en: "Adjust chair height: feet flat, knees at 90 degrees",
          },
          {
            zh: "显示器位置：屏幕顶部与视线齐平",
            en: "Monitor position: Screen top at eye level",
          },
          {
            zh: "腰部支撑：使用靠垫支撑下背部",
            en: "Lumbar support: Use cushion to support lower back",
          },
          {
            zh: "定时休息：每45分钟站立活动5分钟",
            en: "Regular breaks: Stand and move 5 minutes every 45 minutes",
          },
        ],
        priority: "medium",
        triggerConditions: ["assessment_complete"],
        targetAudience: {
          stressLevel: [4, 5, 6, 7],
        },
        evidence: "良好的人机工学能减少肌肉紧张，提高工作效率。",
        resources: [
          {
            id: "ergonomics_checklist",
            title: {
              zh: "办公室人机工学检查表",
              en: "Office Ergonomics Checklist",
            },
            description: {
              zh: "完整的工作环境优化清单",
              en: "Complete work environment optimization checklist",
            },
            type: "tool",
            url: "/resources/ergonomics-checklist",
          },
        ],
        validityPeriod: {},
        category: "职场健康",
        tags: ["人机工学", "办公", "姿势", "健康", "效率"],
      },
      {
        id: "workplace_stress_management",
        type: "workplace",
        title: {
          zh: "职场压力管理技巧",
          en: "Workplace Stress Management Techniques",
        },
        description: {
          zh: "在职场环境中有效管理压力，保持心理健康。",
          en: "Effectively manage stress in workplace environment to maintain mental health.",
        },
        actionSteps: [
          {
            zh: "4-7-8呼吸法：吸气4秒，屏气7秒，呼气8秒",
            en: "4-7-8 breathing: Inhale 4s, hold 7s, exhale 8s",
          },
          {
            zh: "正念冥想：工作间隙5分钟专注呼吸",
            en: "Mindfulness meditation: 5 minutes focused breathing during work breaks",
          },
          {
            zh: "时间管理：使用番茄工作法提高效率",
            en: "Time management: Use Pomodoro technique to improve efficiency",
          },
          {
            zh: '界限设定：学会说"不"，保护个人时间',
            en: 'Boundary setting: Learn to say "no" to protect personal time',
          },
        ],
        priority: "high",
        triggerConditions: ["assessment_complete", "abnormal_pattern"],
        targetAudience: {
          stressLevel: [7, 8, 9, 10],
        },
        evidence: "职场压力管理技巧能显著降低工作相关焦虑和疲劳。",
        resources: [
          {
            id: "stress_management_app",
            title: {
              zh: "压力管理应用推荐",
              en: "Stress Management App Recommendations",
            },
            description: {
              zh: "适合职场人的减压工具",
              en: "Stress relief tools suitable for professionals",
            },
            type: "external",
            url: "/resources/stress-apps",
          },
        ],
        validityPeriod: {},
        category: "职场健康",
        tags: ["压力管理", "职场", "心理健康", "效率", "技巧"],
      },
    ];

    // 情绪管理推荐内容
    const emotionalContents: RecommendationContent[] = [
      {
        id: "emotional_journaling",
        type: "emotional",
        title: { zh: "情绪日记疗法", en: "Emotional Journaling Therapy" },
        description: {
          zh: "通过记录和分析情绪，更好地理解和管理自己。",
          en: "Better understand and manage yourself through recording and analyzing emotions.",
        },
        actionSteps: [
          {
            zh: "每日情绪记录：记录3种主要情绪和触发因素",
            en: "Daily emotion recording: Record 3 main emotions and triggers",
          },
          {
            zh: "身体感受觉察：注意情绪在身体的反应",
            en: "Body awareness: Notice physical reactions to emotions",
          },
          {
            zh: "感恩练习：每天记录3件感恩的事情",
            en: "Gratitude practice: Record 3 things you're grateful for daily",
          },
          {
            zh: "情绪反思：每周回顾情绪模式和变化",
            en: "Emotional reflection: Weekly review of emotional patterns and changes",
          },
        ],
        priority: "medium",
        triggerConditions: ["assessment_complete"],
        targetAudience: {
          stressLevel: [5, 6, 7, 8, 9],
        },
        evidence: "情绪日记疗法经研究证实能改善情绪调节能力。",
        resources: [
          {
            id: "journaling_template",
            title: { zh: "情绪日记模板", en: "Emotional Journal Template" },
            description: {
              zh: "结构化的情绪记录模板",
              en: "Structured emotional recording template",
            },
            type: "tool",
            url: "/tools/emotion-journal",
          },
        ],
        validityPeriod: {},
        category: "心理健康",
        tags: ["情绪日记", "自我认知", "情绪管理", "心理", "反思"],
      },
      {
        id: "emotional_mindfulness",
        type: "emotional",
        title: { zh: "正念冥想练习", en: "Mindfulness Meditation Practice" },
        description: {
          zh: "通过正念冥想培养情绪觉察和平静心态。",
          en: "Cultivate emotional awareness and calm mind through mindfulness meditation.",
        },
        actionSteps: [
          {
            zh: "身体扫描冥想：10分钟全身觉察",
            en: "Body scan meditation: 10 minutes full body awareness",
          },
          {
            zh: "呼吸冥想：专注呼吸5-10分钟",
            en: "Breathing meditation: Focus on breathing 5-10 minutes",
          },
          {
            zh: "正念行走：缓慢步行，专注于每一步",
            en: "Mindful walking: Slow walking, focus on each step",
          },
          {
            zh: "慈心冥想：培养对自己的温柔关爱",
            en: "Loving-kindness meditation: Cultivate gentle self-care",
          },
        ],
        priority: "medium",
        triggerConditions: ["time_based", "assessment_complete"],
        targetAudience: {
          stressLevel: [6, 7, 8, 9],
        },
        evidence: "正念冥想能显著降低焦虑，提升情绪稳定性。",
        resources: [
          {
            id: "mindfulness_guides",
            title: {
              zh: "正念冥想指导",
              en: "Mindfulness Meditation Guidance",
            },
            description: {
              zh: "适合初学者的正念练习指南",
              en: "Mindfulness practice guide for beginners",
            },
            type: "video",
            url: "/resources/mindfulness-guidance",
          },
        ],
        validityPeriod: {},
        category: "心理健康",
        tags: ["正念", "冥想", "情绪觉察", "减压", "专注"],
      },
    ];

    // 医疗建议内容
    const medicalContents: RecommendationContent[] = [
      {
        id: "medical_pain_relief",
        type: "medical",
        title: { zh: "药物止痛指导", en: "Medication Pain Relief Guide" },
        description: {
          zh: "安全有效的药物使用指南，缓解严重经期疼痛。",
          en: "Safe and effective medication use guide for severe menstrual pain relief.",
        },
        actionSteps: [
          {
            zh: "NSAIDs药物：布洛芬或萘普生，按说明书使用",
            en: "NSAIDs: Ibuprofen or naproxen, use as directed",
          },
          {
            zh: "服药时机：疼痛开始前30分钟服用",
            en: "Timing: Take 30 minutes before pain starts",
          },
          {
            zh: "剂量控制：不要超过推荐剂量",
            en: "Dosage control: Do not exceed recommended dose",
          },
          {
            zh: "副作用监测：注意胃肠道不适和过敏反应",
            en: "Side effect monitoring: Watch for GI discomfort and allergic reactions",
          },
        ],
        priority: "high",
        triggerConditions: ["assessment_complete"],
        targetAudience: {
          painLevel: [7, 8, 9, 10],
        },
        evidence: "NSAIDs是经医学验证的痛经一线治疗药物。",
        resources: [
          {
            id: "pain_medication_guide",
            title: {
              zh: "止痛药物安全使用指南",
              en: "Pain Medication Safety Guide",
            },
            description: {
              zh: "详细的药物使用说明和注意事项",
              en: "Detailed medication instructions and precautions",
            },
            type: "article",
            url: "/resources/pain-medication-guide",
          },
        ],
        validityPeriod: {},
        category: "医疗建议",
        tags: ["药物", "止痛", "NSAIDs", "安全", "医嘱"],
      },
      {
        id: "medical_when_see_doctor",
        type: "medical",
        title: { zh: "就医时机指南", en: "When to See a Doctor Guide" },
        description: {
          zh: "识别需要医疗干预的危险信号，及时寻求专业帮助。",
          en: "Identify warning signs requiring medical intervention and seek professional help promptly.",
        },
        actionSteps: [
          {
            zh: "剧烈疼痛：影响日常生活和工作的疼痛",
            en: "Severe pain: Pain affecting daily life and work",
          },
          {
            zh: "异常出血：经量过大或经期不规律",
            en: "Abnormal bleeding: Excessive flow or irregular cycles",
          },
          {
            zh: "伴随症状：发热、头晕、严重恶心等",
            en: "Accompanying symptoms: Fever, dizziness, severe nausea",
          },
          {
            zh: "持续加重：症状逐月加重无缓解",
            en: "Progressive worsening: Symptoms worsening monthly without relief",
          },
        ],
        priority: "urgent",
        triggerConditions: ["emergency_alert", "assessment_complete"],
        targetAudience: {
          painLevel: [9, 10],
          stressLevel: [9, 10],
        },
        evidence: "及时就医能预防和诊断潜在的妇科疾病。",
        resources: [
          {
            id: "emergency_contacts",
            title: { zh: "紧急医疗联系信息", en: "Emergency Medical Contacts" },
            description: {
              zh: "重要医疗资源和联系方式",
              en: "Important medical resources and contact information",
            },
            type: "external",
            url: "/resources/emergency-contacts",
          },
        ],
        validityPeriod: {},
        category: "医疗建议",
        tags: ["就医", "紧急", "专业帮助", "症状", "安全"],
      },
    ];

    // 生活方式内容
    const lifestyleContents: RecommendationContent[] = [
      {
        id: "lifestyle_sleep_optimization",
        type: "lifestyle",
        title: { zh: "睡眠优化方案", en: "Sleep Optimization Plan" },
        description: {
          zh: "改善睡眠质量，提升身体恢复和情绪稳定。",
          en: "Improve sleep quality to enhance body recovery and emotional stability.",
        },
        actionSteps: [
          {
            zh: "规律作息：每天同一时间入睡和起床",
            en: "Regular schedule: Sleep and wake at same time daily",
          },
          {
            zh: "睡前放松：避免电子屏幕，进行轻柔活动",
            en: "Pre-sleep relaxation: Avoid screens, engage in gentle activities",
          },
          {
            zh: "环境优化：保持卧室黑暗、安静、凉爽",
            en: "Environment optimization: Keep bedroom dark, quiet, cool",
          },
          {
            zh: "饮食注意：睡前3小时避免咖啡因和重餐",
            en: "Dietary caution: Avoid caffeine and heavy meals 3 hours before bed",
          },
        ],
        priority: "medium",
        triggerConditions: ["assessment_complete", "time_based"],
        targetAudience: {
          stressLevel: [5, 6, 7, 8],
        },
        evidence: "优质睡眠对荷尔蒙平衡和情绪调节至关重要。",
        resources: [
          {
            id: "sleep_tracker",
            title: { zh: "睡眠质量追踪器", en: "Sleep Quality Tracker" },
            description: {
              zh: "监测和改善睡眠习惯",
              en: "Monitor and improve sleep habits",
            },
            type: "tool",
            url: "/tools/sleep-tracker",
          },
        ],
        validityPeriod: {},
        category: "生活方式",
        tags: ["睡眠", "作息", "恢复", "健康", "习惯"],
      },
    ];

    // 合并所有内容并添加到数据库
    const allContents = [
      ...exerciseContents,
      ...nutritionContents,
      ...selfcareContents,
      ...workplaceContents,
      ...emotionalContents,
      ...medicalContents,
      ...lifestyleContents,
    ];

    allContents.forEach((content) => {
      this.contents.set(content.id, content);
    });
  }

  /**
   * 获取推荐内容
   */
  public getContent(id: string): RecommendationContent | undefined {
    return this.contents.get(id);
  }

  /**
   * 获取所有推荐内容
   */
  public getAllContents(): RecommendationContent[] {
    return Array.from(this.contents.values());
  }

  /**
   * 按类型获取推荐内容
   */
  public getContentsByType(type: RecommendationType): RecommendationContent[] {
    return Array.from(this.contents.values()).filter(
      (content) => content.type === type,
    );
  }

  /**
   * 按优先级获取推荐内容
   */
  public getContentsByPriority(
    priority: RecommendationPriority,
  ): RecommendationContent[] {
    return Array.from(this.contents.values()).filter(
      (content) => content.priority === priority,
    );
  }

  /**
   * 按分类获取推荐内容
   */
  public getContentsByCategory(category: string): RecommendationContent[] {
    return Array.from(this.contents.values()).filter(
      (content) => content.category === category,
    );
  }

  /**
   * 搜索推荐内容
   */
  public searchContents(query: string): RecommendationContent[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.contents.values()).filter((content) => {
      const titleZh = content.title.zh.toLowerCase();
      const titleEn = content.title.en.toLowerCase();
      const descZh = content.description.zh.toLowerCase();
      const descEn = content.description.en.toLowerCase();
      const tags = content.tags.join(" ").toLowerCase();

      return (
        titleZh.includes(lowerQuery) ||
        titleEn.includes(lowerQuery) ||
        descZh.includes(lowerQuery) ||
        descEn.includes(lowerQuery) ||
        tags.includes(lowerQuery)
      );
    });
  }

  /**
   * 添加新的推荐内容
   */
  public addContent(content: RecommendationContent): void {
    this.contents.set(content.id, content);
  }

  /**
   * 更新推荐内容
   */
  public updateContent(
    id: string,
    updates: Partial<RecommendationContent>,
  ): boolean {
    const existing = this.contents.get(id);
    if (!existing) return false;

    const updated = { ...existing, ...updates };
    this.contents.set(id, updated);
    return true;
  }

  /**
   * 删除推荐内容
   */
  public removeContent(id: string): boolean {
    return this.contents.delete(id);
  }

  /**
   * 获取内容统计信息
   */
  public getStatistics(): {
    total: number;
    byType: Record<RecommendationType, number>;
    byPriority: Record<RecommendationPriority, number>;
    byCategory: Record<string, number>;
  } {
    const byType: Record<RecommendationType, number> = {
      nutrition: 0,
      exercise: 0,
      selfcare: 0,
      workplace: 0,
      emotional: 0,
      medical: 0,
      lifestyle: 0,
      emergency: 0,
    };

    const byPriority: Record<RecommendationPriority, number> = {
      urgent: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    const byCategory: Record<string, number> = {};

    for (const content of this.contents.values()) {
      byType[content.type]++;
      byPriority[content.priority]++;
      byCategory[content.category] = (byCategory[content.category] || 0) + 1;
    }

    return {
      total: this.contents.size,
      byType,
      byPriority,
      byCategory,
    };
  }
}

// 创建默认数据库实例
export const defaultContentDatabase = new RecommendationContentDatabase();
