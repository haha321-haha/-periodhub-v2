// PHQ-9 Data Type Definitions
// Used for managing PHQ-9 related data in the stress assessment system

// PHQ-9 Answer Type
export interface PHQ9Answer {
  questionId: string; // phq9_1 到 phq9_9
  value: number; // 0-3分
  timestamp: Date;
}

// PHQ-9 评估结果
export interface PHQ9Result {
  score: number; // 总分 0-27
  level: PHQ9ScoreLevel; // 严重程度等级
  levelLabel: string; // 等级标签
  answers: PHQ9Answer[]; // 详细答案
  hasThoughtsOfSelfHarm: boolean; // 第9题得分 > 0 时的警告标志
  riskLevel: 'low' | 'moderate' | 'high' | 'severe';
  requiresProfessionalHelp: boolean;
  recommendations: string[]; // 基于分数的建议
  createdAt: Date;
}

// PHQ-9 严重程度等级
export type PHQ9ScoreLevel = 
  | 'none'           // 0-4分：无抑郁症状
  | 'mild'           // 5-9分：轻度抑郁
  | 'moderate'       // 10-14分：中度抑郁
  | 'moderate-severe' // 15-19分：中重度抑郁
  | 'severe';        // 20-27分：重度抑郁

// PHQ-9 评分配置
export const PHQ9_SCORE_CONFIG = {
  SCORE_RANGES: {
    NONE: { min: 0, max: 4, label: '无抑郁症状', level: 'none' as const },
    MILD: { min: 5, max: 9, label: '轻度抑郁', level: 'mild' as const },
    MODERATE: { min: 10, max: 14, label: '中度抑郁', level: 'moderate' as const },
    MODERATELY_SEVERE: { min: 15, max: 19, label: '中重度抑郁', level: 'moderate-severe' as const },
    SEVERE: { min: 20, max: 27, label: '重度抑郁', level: 'severe' as const }
  },
  
  RISK_THRESHOLDS: {
    LOW: 0,           // 无风险
    MODERATE: 5,      // 需要关注
    HIGH: 10,         // 建议寻求帮助
    SEVERE: 15        // 需要专业干预
  },
  
  SELF_HARM_QUESTION: 'phq9_9', // 自伤想法的问题ID
  SELF_HARM_THRESHOLD: 1        // 第9题得分 >= 1 时触发警告
} as const;

// PHQ-9 建议模板
export const PHQ9_RECOMMENDATIONS = {
  [PHQ9_SCORE_CONFIG.SCORE_RANGES.NONE.level]: [
    '您的心理健康状态良好，请继续保持健康的生活习惯',
    '定期进行心理健康自查有助于预防问题',
    '保持良好的睡眠、运动和饮食习惯'
  ],
  
  [PHQ9_SCORE_CONFIG.SCORE_RANGES.MILD.level]: [
    '建议关注自己的情绪变化，必要时寻求专业帮助',
    '可以尝试一些放松技巧，如深呼吸、冥想或瑜伽',
    '保持规律的作息和适量的运动',
    '与信任的朋友或家人分享您的感受'
  ],
  
  [PHQ9_SCORE_CONFIG.SCORE_RANGES.MODERATE.level]: [
    '建议寻求心理健康专业人士的帮助',
    '考虑进行心理咨询或心理治疗',
    '如症状持续或加重，请及时就医',
    '保持与家人朋友的联系，获得支持'
  ],
  
  [PHQ9_SCORE_CONFIG.SCORE_RANGES.MODERATELY_SEVERE.level]: [
    '强烈建议尽快寻求专业心理健康帮助',
    '考虑药物治疗配合心理治疗',
    '如需紧急帮助，请拨打心理危机热线',
    '告诉信任的人您正在经历的困难'
  ],
  
  [PHQ9_SCORE_CONFIG.SCORE_RANGES.SEVERE.level]: [
    '立即寻求专业心理健康帮助',
    '如有自伤想法，请立即联系紧急服务或心理危机热线',
    '考虑住院治疗或密集心理治疗',
    '请家人朋友协助您获得专业帮助'
  ]
} as const;

// PHQ-9 工具函数
export class PHQ9Utils {
  
  /**
   * 计算PHQ-9总分
   */
  static calculateScore(answers: PHQ9Answer[]): number {
    return answers.reduce((sum, answer) => sum + answer.value, 0);
  }
  
  /**
   * 获取严重程度等级
   */
  static getScoreLevel(score: number): typeof PHQ9_SCORE_CONFIG.SCORE_RANGES[keyof typeof PHQ9_SCORE_CONFIG.SCORE_RANGES] {
    const ranges = PHQ9_SCORE_CONFIG.SCORE_RANGES;
    
    if (score >= ranges.NONE.min && score <= ranges.NONE.max) return ranges.NONE;
    if (score >= ranges.MILD.min && score <= ranges.MILD.max) return ranges.MILD;
    if (score >= ranges.MODERATE.min && score <= ranges.MODERATE.max) return ranges.MODERATE;
    if (score >= ranges.MODERATELY_SEVERE.min && score <= ranges.MODERATELY_SEVERE.max) return ranges.MODERATELY_SEVERE;
    if (score >= ranges.SEVERE.min && score <= ranges.SEVERE.max) return ranges.SEVERE;
    
    return ranges.NONE; // 默认值
  }
  
  /**
   * 评估风险等级
   */
  static getRiskLevel(score: number, selfHarmAnswer: number): {
    level: 'low' | 'moderate' | 'high' | 'severe';
    requiresHelp: boolean;
  } {
    // 自伤想法检查（最重要）
    if (selfHarmAnswer > 0) {
      return {
        level: 'severe',
        requiresHelp: true
      };
    }
    
    // 根据总分评估
    if (score >= PHQ9_SCORE_CONFIG.RISK_THRESHOLDS.SEVERE) {
      return {
        level: 'severe',
        requiresHelp: true
      };
    } else if (score >= PHQ9_SCORE_CONFIG.RISK_THRESHOLDS.HIGH) {
      return {
        level: 'high',
        requiresHelp: true
      };
    } else if (score >= PHQ9_SCORE_CONFIG.RISK_THRESHOLDS.MODERATE) {
      return {
        level: 'moderate',
        requiresHelp: true
      };
    } else {
      return {
        level: 'low',
        requiresHelp: false
      };
    }
  }
  
  /**
   * 生成建议列表
   */
  static getRecommendations(level: PHQ9ScoreLevel): string[] {
    return [...(PHQ9_RECOMMENDATIONS[level] || [])];
  }
  
  /**
   * 创建PHQ-9评估结果
   */
  static createResult(answers: PHQ9Answer[]): PHQ9Result {
    const score = this.calculateScore(answers);
    const levelInfo = this.getScoreLevel(score);
    
    // 检查自伤想法（第9题）
    const selfHarmAnswer = answers.find(a => a.questionId === PHQ9_SCORE_CONFIG.SELF_HARM_QUESTION)?.value || 0;
    const { level: riskLevel, requiresHelp } = this.getRiskLevel(score, selfHarmAnswer);
    
    return {
      score,
      level: levelInfo.level,
      levelLabel: levelInfo.label,
      answers,
      hasThoughtsOfSelfHarm: selfHarmAnswer > 0,
      riskLevel,
      requiresProfessionalHelp: requiresHelp,
      recommendations: this.getRecommendations(levelInfo.level),
      createdAt: new Date()
    };
  }
  
  /**
   * 验证PHQ-9答案的有效性
   */
  static validateAnswers(answers: PHQ9Answer[]): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    // 检查答案数量
    if (answers.length !== 9) {
      errors.push(`Expected 9 answers, got ${answers.length}`);
    }
    
    // 检查每个问题ID
    const expectedIds = Array.from({ length: 9 }, (_, i) => `phq9_${i + 1}`);
    const providedIds = answers.map(a => a.questionId);
    
    for (const expectedId of expectedIds) {
      if (!providedIds.includes(expectedId)) {
        errors.push(`Missing answer for ${expectedId}`);
      }
    }
    
    // 检查分数范围
    for (const answer of answers) {
      if (answer.value < 0 || answer.value > 3) {
        errors.push(`Invalid score ${answer.value} for ${answer.questionId}, must be 0-3`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}