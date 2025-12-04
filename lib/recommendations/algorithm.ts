/**
 * 个性化推荐算法核心引擎
 * Phase 3: 个性化推荐系统
 */

import {
  AssessmentRecord,
  RecommendationContent,
  RecommendationItem,
  RecommendationContext,
  RecommendationGenerationResult,
  RecommendationAlgorithmConfig,
  PatternDetection,
  RecommendationPriority,
  RecommendationType,
  RecommendationTrigger,
  LocalizedText,
} from "@/types/recommendations";
import { defaultContentDatabase } from "./content-database";

// 默认算法配置
const DEFAULT_ALGORITHM_CONFIG: RecommendationAlgorithmConfig = {
  weights: {
    stressLevel: 0.3, // 压力水平权重
    painLevel: 0.25, // 疼痛水平权重
    cyclePhase: 0.2, // 周期阶段权重
    constitution: 0.15, // 体质权重
    historyPattern: 0.05, // 历史模式权重
    userFeedback: 0.05, // 用户反馈权重
  },
  thresholds: {
    urgentScore: 0.8, // 紧急推荐阈值
    highScore: 0.6, // 高优先级阈值
    mediumScore: 0.4, // 中等优先级阈值
  },
  limits: {
    maxActiveRecommendations: 8, // 最大同时活跃推荐数
    maxDailyRecommendations: 5, // 每日最大推荐数
    recommendationCooldown: 2, // 推荐冷却时间（小时）
  },
};

// 周期阶段映射（保留用于未来扩展）
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CYCLE_PHASE_PATTERNS = {
  menstrual: { painfulSymptoms: 0.8, energyLevel: 0.3, workImpact: 0.6 },
  follicular: { painfulSymptoms: 0.2, energyLevel: 0.8, workImpact: 0.2 },
  ovulation: { painfulSymptoms: 0.3, energyLevel: 0.9, workImpact: 0.2 },
  luteal: { painfulSymptoms: 0.6, energyLevel: 0.5, workImpact: 0.5 },
};

/**
 * 推荐算法引擎类
 */
export class RecommendationAlgorithmEngine {
  private config: RecommendationAlgorithmConfig;
  private contentDatabase: Map<string, RecommendationContent> = new Map();

  constructor(
    config: RecommendationAlgorithmConfig = DEFAULT_ALGORITHM_CONFIG,
  ) {
    this.config = config;
    this.initializeContentDatabase();
  }

  /**
   * 初始化推荐内容数据库
   */
  private initializeContentDatabase(): void {
    // 使用外部内容数据库初始化
    const allContents = defaultContentDatabase.getAllContents();

    allContents.forEach((content) => {
      this.contentDatabase.set(content.id, content);
    });

    console.log(
      `Initialized recommendation engine with ${allContents.length} content items`,
    );
  }

  /**
   * 生成个性化推荐
   */
  public async generateRecommendations(
    context: RecommendationContext,
    customConfig?: Partial<RecommendationAlgorithmConfig>,
  ): Promise<RecommendationGenerationResult> {
    const config = { ...this.config, ...customConfig };
    const startTime = Date.now();

    // 检测模式
    const detectedPatterns = this.detectPatterns(context.recentAssessments);

    // 计算推荐分数并生成推荐
    const scoredRecommendations = await this.scoreAndGenerateRecommendations(
      context,
      detectedPatterns,
      config,
    );

    // 应用限制和优先级排序
    const finalRecommendations = this.applyLimitsAndPriorities(
      scoredRecommendations,
      config,
    );

    const processingTime = Date.now() - startTime;

    return {
      recommendations: finalRecommendations,
      algorithmInsights: {
        patternsDetected: detectedPatterns,
        scoreDistribution: this.calculateScoreDistribution(
          scoredRecommendations,
        ),
        priorityBreakdown:
          this.calculatePriorityBreakdown(finalRecommendations),
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        algorithmVersion: "1.0.0",
        processingTime,
        contextSnapshot: context,
      },
    };
  }

  /**
   * 检测健康模式
   */
  private detectPatterns(assessments: AssessmentRecord[]): PatternDetection[] {
    const patterns: PatternDetection[] = [];

    if (assessments.length < 2) {
      return patterns;
    }

    const recentAssessments = assessments.slice(-5); // 最近5次评估

    // 检测压力激增
    const stressPattern = this.detectStressSpike(recentAssessments);
    if (stressPattern) patterns.push(stressPattern);

    // 检测疼痛模式
    const painPattern = this.detectPainPattern(recentAssessments);
    if (painPattern) patterns.push(painPattern);

    // 检测下降趋势
    const declinePattern = this.detectDecliningTrend(recentAssessments);
    if (declinePattern) patterns.push(declinePattern);

    // 检测改善趋势
    const improvementPattern = this.detectImprovementTrend(recentAssessments);
    if (improvementPattern) patterns.push(improvementPattern);

    return patterns;
  }

  /**
   * 检测压力激增
   */
  private detectStressSpike(
    assessments: AssessmentRecord[],
  ): PatternDetection | null {
    const stressAssessments = assessments.filter((a) => a.type === "stress");
    if (stressAssessments.length < 2) return null;

    const latest = stressAssessments[stressAssessments.length - 1];
    const previous = stressAssessments[stressAssessments.length - 2];

    if (latest.score > previous.score + 2) {
      return {
        type: "stress_spike",
        severity:
          latest.score >= 8
            ? "severe"
            : latest.score >= 6
              ? "moderate"
              : "mild",
        description: `压力水平从${previous.score}上升到${latest.score}`,
        confidence: Math.min(0.9, (latest.score - previous.score) / 4),
        detectedAt: new Date().toISOString(),
        dataPoints: [previous, latest],
      };
    }

    return null;
  }

  /**
   * 检测疼痛模式
   */
  private detectPainPattern(
    assessments: AssessmentRecord[],
  ): PatternDetection | null {
    const painAssessments = assessments.filter(
      (a) => a.type === "pain" || a.type === "symptom",
    );
    if (painAssessments.length < 3) return null;

    const avgScore =
      painAssessments.reduce((sum, a) => sum + a.score, 0) /
      painAssessments.length;

    if (avgScore >= 7) {
      return {
        type: "pain_pattern",
        severity: avgScore >= 8.5 ? "severe" : "moderate",
        description: `近期平均疼痛水平为${avgScore.toFixed(1)}`,
        confidence: Math.min(0.8, avgScore / 10),
        detectedAt: new Date().toISOString(),
        dataPoints: painAssessments,
      };
    }

    return null;
  }

  /**
   * 检测下降趋势
   */
  private detectDecliningTrend(
    assessments: AssessmentRecord[],
  ): PatternDetection | null {
    if (assessments.length < 3) return null;

    const scores = assessments.slice(-3).map((a) => a.score);
    const trend = scores[2] - scores[0];

    if (trend > 1.5) {
      return {
        type: "declining_trend",
        severity: trend >= 3 ? "severe" : "moderate",
        description: `症状评分呈上升趋势`,
        confidence: Math.min(0.7, trend / 4),
        detectedAt: new Date().toISOString(),
        dataPoints: assessments.slice(-3),
      };
    }

    return null;
  }

  /**
   * 检测改善趋势
   */
  private detectImprovementTrend(
    assessments: AssessmentRecord[],
  ): PatternDetection | null {
    if (assessments.length < 3) return null;

    const scores = assessments.slice(-3).map((a) => a.score);
    const trend = scores[0] - scores[2];

    if (trend > 1.5) {
      return {
        type: "improvement",
        severity: "mild",
        description: `症状评分呈改善趋势`,
        confidence: Math.min(0.7, trend / 4),
        detectedAt: new Date().toISOString(),
        dataPoints: assessments.slice(-3),
      };
    }

    return null;
  }

  /**
   * 计算推荐分数并生成推荐项
   */
  private async scoreAndGenerateRecommendations(
    context: RecommendationContext,
    patterns: PatternDetection[],
    config: RecommendationAlgorithmConfig,
  ): Promise<RecommendationItem[]> {
    const scoredItems: RecommendationItem[] = [];

    for (const [contentId, content] of this.contentDatabase.entries()) {
      const score = this.calculateRecommendationScore(
        content,
        context,
        patterns,
        config,
      );

      if (score > 0) {
        const priority = this.determinePriority(score, config);
        const personalizedReason = this.generatePersonalizedReason(
          content,
          context,
          patterns,
        );

        const recommendationItem: RecommendationItem = {
          id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          contentId,
          content,
          generatedAt: new Date().toISOString(),
          status: "active",
          priority,
          triggerSource: this.determineTriggerSource(context, patterns),
          personalizedReason,
          score,
          context: {
            assessmentData: context.lastAssessment,
            cyclePhase: context.currentCyclePhase,
            painLevel: context.lastAssessment?.score,
            stressLevel: context.lastAssessment?.score,
            recentPattern: patterns[0]?.type,
          },
          expiresAt: this.calculateExpiration(content, context),
        };

        scoredItems.push(recommendationItem);
      }
    }

    return scoredItems.sort((a, b) => b.score - a.score);
  }

  /**
   * 计算推荐分数
   */
  private calculateRecommendationScore(
    content: RecommendationContent,
    context: RecommendationContext,
    patterns: PatternDetection[],
    config: RecommendationAlgorithmConfig,
  ): number {
    let totalScore = 0;
    const weights = config.weights;

    // 压力水平评分
    if (context.lastAssessment) {
      const stressScore = this.calculateStressScore(
        content,
        context.lastAssessment,
        weights.stressLevel,
      );
      totalScore += stressScore;
    }

    // 疼痛水平评分
    if (context.lastAssessment) {
      const painScore = this.calculatePainScore(
        content,
        context.lastAssessment,
        weights.painLevel,
      );
      totalScore += painScore;
    }

    // 周期阶段评分
    if (context.currentCyclePhase) {
      const cycleScore = this.calculateCycleScore(
        content,
        context.currentCyclePhase,
        weights.cyclePhase,
      );
      totalScore += cycleScore;
    }

    // 历史模式评分
    const patternScore = this.calculatePatternScore(
      content,
      patterns,
      weights.historyPattern,
    );
    totalScore += patternScore;

    // 用户偏好评分（简化版）
    const preferenceScore = this.calculatePreferenceScore(
      content,
      context,
      weights.userFeedback,
    );
    totalScore += preferenceScore;

    return Math.min(1, totalScore);
  }

  /**
   * 计算压力评分
   */
  private calculateStressScore(
    content: RecommendationContent,
    assessment: AssessmentRecord,
    weight: number,
  ): number {
    if (!content.targetAudience.stressLevel) return 0;

    const targetRange = content.targetAudience.stressLevel;
    const userScore = assessment.score;

    // 检查用户评分是否在目标范围内
    if (
      userScore >= Math.min(...targetRange) &&
      userScore <= Math.max(...targetRange)
    ) {
      // 计算匹配程度，分数越接近目标范围中间值，匹配度越高
      const midPoint =
        (Math.min(...targetRange) + Math.max(...targetRange)) / 2;
      const match = 1 - Math.abs(userScore - midPoint) / 10;
      return match * weight;
    }

    return 0;
  }

  /**
   * 计算疼痛评分
   */
  private calculatePainScore(
    content: RecommendationContent,
    assessment: AssessmentRecord,
    weight: number,
  ): number {
    if (!content.targetAudience.painLevel) return 0;

    const targetRange = content.targetAudience.painLevel;
    const userScore = assessment.score;

    if (
      userScore >= Math.min(...targetRange) &&
      userScore <= Math.max(...targetRange)
    ) {
      const midPoint =
        (Math.min(...targetRange) + Math.max(...targetRange)) / 2;
      const match = 1 - Math.abs(userScore - midPoint) / 10;
      return match * weight;
    }

    return 0;
  }

  /**
   * 计算周期评分
   */
  private calculateCycleScore(
    content: RecommendationContent,
    cyclePhase: string,
    weight: number,
  ): number {
    if (!content.targetAudience.phases) return 0;

    const isMatch = content.targetAudience.phases.includes(cyclePhase);
    return isMatch ? weight : 0;
  }

  /**
   * 计算模式评分
   */
  private calculatePatternScore(
    content: RecommendationContent,
    patterns: PatternDetection[],
    weight: number,
  ): number {
    if (patterns.length === 0) return 0;

    // 根据内容类型和检测到的模式计算匹配度
    let score = 0;
    for (const pattern of patterns) {
      switch (pattern.type) {
        case "stress_spike":
          if (content.type === "selfcare" || content.type === "emotional") {
            score += pattern.confidence;
          }
          break;
        case "pain_pattern":
          if (content.type === "selfcare" || content.type === "medical") {
            score += pattern.confidence;
          }
          break;
        case "declining_trend":
          if (content.type === "medical" || content.type === "nutrition") {
            score += pattern.confidence * 0.8;
          }
          break;
        case "improvement":
          if (content.type === "exercise" || content.type === "lifestyle") {
            score += pattern.confidence * 0.6;
          }
          break;
      }
    }

    return Math.min(weight, score * weight);
  }

  /**
   * 计算用户偏好评分
   */
  private calculatePreferenceScore(
    content: RecommendationContent,
    context: RecommendationContext,
    weight: number,
  ): number {
    let score = 0;

    // 检查用户偏好类别
    if (context.userPreferences.savedCategories.includes(content.category)) {
      score += 0.5;
    }

    // 检查用户忽略的类型
    if (context.userPreferences.dismissedTypes.includes(content.type)) {
      score -= 0.3;
    }

    return Math.max(0, score) * weight;
  }

  /**
   * 确定优先级
   */
  private determinePriority(
    score: number,
    config: RecommendationAlgorithmConfig,
  ): RecommendationPriority {
    const thresholds = config.thresholds;

    if (score >= thresholds.urgentScore) return "urgent";
    if (score >= thresholds.highScore) return "high";
    if (score >= thresholds.mediumScore) return "medium";
    return "low";
  }

  /**
   * 生成个性化理由
   */
  private generatePersonalizedReason(
    content: RecommendationContent,
    context: RecommendationContext,
    patterns: PatternDetection[],
  ): LocalizedText {
    const reasons: { zh: string; en: string }[] = [];

    // 基于评估结果的理由
    if (context.lastAssessment) {
      if (context.lastAssessment.score >= 8) {
        reasons.push({
          zh: "根据您的评估结果，这个建议对您的当前状况特别重要",
          en: "Based on your assessment results, this recommendation is particularly important for your current condition",
        });
      }
    }

    // 基于模式的理由
    for (const pattern of patterns) {
      switch (pattern.type) {
        case "stress_spike":
          reasons.push({
            zh: "我们检测到您的压力水平最近有所上升，这个建议可以帮助您缓解",
            en: "We detected a recent increase in your stress levels, this can help you manage it",
          });
          break;
        case "pain_pattern":
          reasons.push({
            zh: "基于您的疼痛模式分析，这个建议可能特别适合您",
            en: "Based on your pain pattern analysis, this recommendation may be particularly suitable for you",
          });
          break;
      }
    }

    // 基于周期阶段的理由
    if (context.currentCyclePhase) {
      const phaseMap: Record<string, { zh: string; en: string }> = {
        menstrual: {
          zh: "经期期间，这个建议可以帮助您更好地管理不适",
          en: "During menstruation, this can help you better manage discomfort",
        },
        follicular: {
          zh: "卵泡期是恢复和准备的好时机，这个建议很适合当前阶段",
          en: "The follicular phase is a good time for recovery and preparation, this suits your current phase",
        },
        ovulation: {
          zh: "排卵期精力充沛，这个建议可以帮助您充分利用这个优势",
          en: "You have abundant energy during ovulation, this can help you make the most of it",
        },
        luteal: {
          zh: "黄体期可能会有一些不适，这个建议可以帮助您更好地度过",
          en: "The luteal phase may bring some discomfort, this can help you get through it better",
        },
      };

      if (phaseMap[context.currentCyclePhase]) {
        reasons.push(phaseMap[context.currentCyclePhase]);
      }
    }

    // 如果没有特定理由，使用通用理由
    if (reasons.length === 0) {
      reasons.push({
        zh: "基于您的个人健康状况和偏好，我们为您推荐这个内容",
        en: "Based on your personal health status and preferences, we recommend this content for you",
      });
    }

    return {
      zh: reasons[0].zh,
      en: reasons[0].en,
    };
  }

  /**
   * 确定触发源
   */
  private determineTriggerSource(
    context: RecommendationContext,
    patterns: PatternDetection[],
  ): RecommendationTrigger {
    // 紧急情况优先
    if (context.lastAssessment && context.lastAssessment.score >= 9) {
      return "emergency_alert";
    }

    // 异常模式
    if (patterns.some((p) => p.severity === "severe")) {
      return "abnormal_pattern";
    }

    // 评估完成
    if (context.lastAssessment) {
      return "assessment_complete";
    }

    // 周期阶段
    if (context.currentCyclePhase) {
      return "cycle_phase";
    }

    return "time_based";
  }

  /**
   * 计算过期时间
   */
  private calculateExpiration(
    content: RecommendationContent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _context: RecommendationContext,
  ): string | undefined {
    const now = new Date();

    // 根据推荐类型设置不同的过期时间
    const expirationDays: Record<RecommendationType, number> = {
      emergency: 1, // 紧急推荐1天
      medical: 7, // 医疗推荐7天
      selfcare: 14, // 自我护理14天
      emotional: 21, // 情绪管理21天
      workplace: 30, // 工作调整30天
      nutrition: 28, // 营养建议28天
      exercise: 14, // 运动建议14天
      lifestyle: 60, // 生活方式60天
    };

    const days = expirationDays[content.type] || 30;
    now.setDate(now.getDate() + days);

    return now.toISOString();
  }

  /**
   * 应用限制和优先级排序
   */
  private applyLimitsAndPriorities(
    recommendations: RecommendationItem[],
    config: RecommendationAlgorithmConfig,
  ): RecommendationItem[] {
    // 按分数排序
    const sorted = recommendations.sort((a, b) => b.score - a.score);

    // 应用数量限制
    const limited = sorted.slice(0, config.limits.maxActiveRecommendations);

    // 确保优先级分布
    const urgent = limited.filter((r) => r.priority === "urgent").slice(0, 2);
    const high = limited.filter((r) => r.priority === "high").slice(0, 3);
    const medium = limited.filter((r) => r.priority === "medium").slice(0, 2);
    const low = limited.filter((r) => r.priority === "low").slice(0, 1);

    return [...urgent, ...high, ...medium, ...low];
  }

  /**
   * 计算分数分布
   */
  private calculateScoreDistribution(
    recommendations: RecommendationItem[],
  ): Record<string, number> {
    const distribution = {
      high: recommendations.filter((r) => r.score >= 0.7).length,
      medium: recommendations.filter((r) => r.score >= 0.4 && r.score < 0.7)
        .length,
      low: recommendations.filter((r) => r.score < 0.4).length,
    };

    return distribution;
  }

  /**
   * 计算优先级分布
   */
  private calculatePriorityBreakdown(
    recommendations: RecommendationItem[],
  ): Record<RecommendationPriority, number> {
    const breakdown: Record<RecommendationPriority, number> = {
      urgent: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    for (const rec of recommendations) {
      breakdown[rec.priority]++;
    }

    return breakdown;
  }
}

// 导出默认引擎实例
export const defaultRecommendationEngine = new RecommendationAlgorithmEngine();
