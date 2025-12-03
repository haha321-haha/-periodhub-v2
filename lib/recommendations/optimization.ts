/**
 * 推荐效果追踪和优化机制
 * Phase 3: 个性化推荐系统
 */

import {
  RecommendationItem,
  RecommendationFeedback,
  RecommendationAlgorithmConfig,
  RecommendationType,
  RecommendationPriority,
} from "@/types/recommendations";
import { defaultContentDatabase } from "./content-database";

/**
 * 推荐效果分析接口
 */
export interface RecommendationEffectivenessAnalysis {
  contentId: string;
  totalRecommendations: number;
  engagementRate: number;
  completionRate: number;
  averageRating: number;
  userSatisfaction: number;
  effectiveness: number; // 综合效果评分 0-1
  recommendations: {
    keep: boolean;
    priorityAdjustment?: RecommendationPriority;
    contentImprovements: string[];
    algorithmWeightAdjustments: Record<string, number>;
  };
}

/**
 * 用户行为模式分析接口
 */
export interface UserBehaviorPattern {
  userId?: string;
  preferredTypes: RecommendationType[];
  avoidedTypes: RecommendationType[];
  bestTimeOfDay: string[];
  engagementByPriority: Record<RecommendationPriority, number>;
  completionPatterns: {
    quickCompletion: number; // 24小时内完成
    delayedCompletion: number; // 3-7天内完成
    abandonment: number; // 未完成
  };
  feedbackTrends: {
    positiveTrend: boolean;
    negativeTrend: boolean;
    improvementAreas: string[];
  };
}

/**
 * 推荐优化建议接口
 */
export interface RecommendationOptimizationSuggestion {
  type: "content" | "algorithm" | "delivery" | "personalization";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  expectedImpact: string;
  implementationEffort: "low" | "medium" | "high";
  actions: string[];
}

/**
 * 推荐效果追踪和优化引擎
 */
export class RecommendationOptimizationEngine {
  private feedbackHistory: RecommendationFeedback[] = [];
  private recommendationHistory: RecommendationItem[] = [];
  private algorithmConfig: RecommendationAlgorithmConfig;
  private userPatterns: UserBehaviorPattern | null = null;

  constructor(algorithmConfig: RecommendationAlgorithmConfig) {
    this.algorithmConfig = algorithmConfig;
  }

  /**
   * 添加反馈数据
   */
  public addFeedback(feedback: RecommendationFeedback): void {
    this.feedbackHistory.push(feedback);
    this.updateUserPatterns();
  }

  /**
   * 添加推荐历史
   */
  public addRecommendations(recommendations: RecommendationItem[]): void {
    this.recommendationHistory.push(...recommendations);
  }

  /**
   * 分析推荐内容效果
   */
  public analyzeContentEffectiveness(
    contentId: string
  ): RecommendationEffectivenessAnalysis {
    const relatedRecommendations = this.recommendationHistory.filter(
      rec => rec.contentId === contentId
    );

    const relatedFeedbacks = this.feedbackHistory.filter(
      feedback => feedback.recommendationId === contentId
    );

    const totalRecs = relatedRecommendations.length;
    const viewedRecs = relatedRecommendations.filter(rec => rec.status === "viewed").length;
    const completedRecs = relatedRecommendations.filter(rec => rec.status === "completed").length;
    const savedRecs = relatedRecommendations.filter(rec => rec.status === "saved").length;

    // 计算各项指标
    const engagementRate = totalRecs > 0 ? (viewedRecs + savedRecs) / totalRecs : 0;
    const completionRate = totalRecs > 0 ? completedRecs / totalRecs : 0;
    
    const ratingsWithValues = relatedFeedbacks.filter(f => f.rating !== undefined);
    const averageRating = ratingsWithValues.length > 0
      ? ratingsWithValues.reduce((sum, f) => sum + f.rating!, 0) / ratingsWithValues.length
      : 0;

    const positiveFeedbacks = relatedFeedbacks.filter(f => 
      f.type === "useful" || f.type === "helpful" || (f.rating && f.rating >= 4)
    ).length;
    const userSatisfaction = relatedFeedbacks.length > 0 ? positiveFeedbacks / relatedFeedbacks.length : 0;

    // 综合效果评分 (0-1)
    const effectiveness = (
      engagementRate * 0.3 +
      completionRate * 0.4 +
      (averageRating / 5) * 0.2 +
      userSatisfaction * 0.1
    );

    // 生成优化建议
    const recommendations = this.generateContentRecommendations(
      effectiveness,
      engagementRate,
      completionRate,
      averageRating,
      contentId
    );

    return {
      contentId,
      totalRecommendations: totalRecs,
      engagementRate,
      completionRate,
      averageRating,
      userSatisfaction,
      effectiveness,
      recommendations,
    };
  }

  /**
   * 生成内容优化建议
   */
  private generateContentRecommendations(
    effectiveness: number,
    engagementRate: number,
    completionRate: number,
    averageRating: number,
    contentId: string
  ): RecommendationEffectivenessAnalysis["recommendations"] {
    const improvements: string[] = [];
    const weightAdjustments: Record<string, number> = {};
    let keep = true;
    let priorityAdjustment: RecommendationPriority | undefined;

    // 效果评估和优化建议
    if (effectiveness < 0.3) {
      // 效果很差
      improvements.push("内容需要重大改进或考虑删除");
      improvements.push("检查内容与用户需求的匹配度");
      improvements.push("优化表述方式和可执行性");
      weightAdjustments["content_quality"] = -0.2;
      keep = false;
    } else if (effectiveness < 0.5) {
      // 效果一般
      improvements.push("优化行动步骤的可操作性");
      improvements.push("增加更多实用资源链接");
      improvements.push("改进个性化推荐理由");
      weightAdjustments["content_relevance"] = -0.1;
    } else if (effectiveness < 0.7) {
      // 效果中等
      improvements.push("微调内容表述");
      improvements.push("增加更多相关资源");
      weightAdjustments["content_relevance"] = 0.05;
    } else {
      // 效果良好
      improvements.push("继续保持内容质量");
      improvements.push("考虑扩展到相似场景");
      weightAdjustments["content_relevance"] = 0.1;
    }

    // 参与度分析
    if (engagementRate < 0.4) {
      improvements.push("改进标题和描述的吸引力");
      improvements.push("优化触发时机和频率");
    }

    // 完成率分析
    if (completionRate < 0.3) {
      improvements.push("简化行动步骤");
      improvements.push("减少执行时间复杂度");
      improvements.push("提供更多执行支持");
    }

    // 评分分析
    if (averageRating < 3.0) {
      improvements.push("根据用户反馈改进内容质量");
      improvements.push("验证内容的实用性和准确性");
    }

    // 优先级调整建议
    if (completionRate > 0.8 && averageRating > 4.0) {
      // 表现优秀，可以提升优先级
      const content = defaultContentDatabase.getContent(contentId);
      if (content && content.priority !== "urgent") {
        priorityAdjustment = this.getHigherPriority(content.priority);
      }
    } else if (effectiveness < 0.3) {
      // 表现较差，可以降低优先级
      const content = defaultContentDatabase.getContent(contentId);
      if (content && content.priority !== "low") {
        priorityAdjustment = this.getLowerPriority(content.priority);
      }
    }

    return {
      keep,
      priorityAdjustment,
      contentImprovements: improvements,
      algorithmWeightAdjustments: weightAdjustments,
    };
  }

  /**
   * 分析用户行为模式
   */
  public analyzeUserBehaviorPattern(): UserBehaviorPattern {
    if (this.userPatterns) {
      return this.userPatterns;
    }

    const pattern: UserBehaviorPattern = {
      preferredTypes: [],
      avoidedTypes: [],
      bestTimeOfDay: [],
      engagementByPriority: {
        urgent: 0,
        high: 0,
        medium: 0,
        low: 0,
      },
      completionPatterns: {
        quickCompletion: 0,
        delayedCompletion: 0,
        abandonment: 0,
      },
      feedbackTrends: {
        positiveTrend: false,
        negativeTrend: false,
        improvementAreas: [],
      },
    };

    // 分析偏好类型
    const typeEngagement: Partial<Record<RecommendationType, { total: number; positive: number }>> = {};

    for (const rec of this.recommendationHistory) {
      const type = rec.content.type;
      if (!typeEngagement[type]) {
        typeEngagement[type] = { total: 0, positive: 0 };
      }
      
      typeEngagement[type].total++;
      
      if (rec.status === "completed" || rec.status === "saved") {
        typeEngagement[type].positive++;
      }

      // 分析优先级参与度
      if (rec.status === "viewed" || rec.status === "completed" || rec.status === "saved") {
        pattern.engagementByPriority[rec.priority]++;
      }

      // 分析完成模式
      if (rec.status === "completed") {
        if (rec.completedAt) {
          const completedTime = new Date(rec.completedAt).getTime();
          const generatedTime = new Date(rec.generatedAt).getTime();
          const daysDiff = (completedTime - generatedTime) / (1000 * 60 * 60 * 24);

          if (daysDiff <= 1) {
            pattern.completionPatterns.quickCompletion++;
          } else if (daysDiff <= 7) {
            pattern.completionPatterns.delayedCompletion++;
          }
        }
      }
    }

    // 确定偏好和避免的类型
    for (const [type, stats] of Object.entries(typeEngagement)) {
      const engagementRate = stats.positive / stats.total;
      if (engagementRate > 0.7) {
        pattern.preferredTypes.push(type as RecommendationType);
      } else if (engagementRate < 0.3) {
        pattern.avoidedTypes.push(type as RecommendationType);
      }
    }

    // 分析反馈趋势
    if (this.feedbackHistory.length >= 5) {
      const recentFeedbacks = this.feedbackHistory.slice(-10);
      const positiveCount = recentFeedbacks.filter(f => 
        f.type === "useful" || f.type === "helpful" || (f.rating && f.rating >= 4)
      ).length;
      
      pattern.feedbackTrends.positiveTrend = positiveCount / recentFeedbacks.length > 0.6;
      pattern.feedbackTrends.negativeTrend = positiveCount / recentFeedbacks.length < 0.3;
    }

    this.userPatterns = pattern;
    return pattern;
  }

  /**
   * 生成优化建议
   */
  public generateOptimizationSuggestions(): RecommendationOptimizationSuggestion[] {
    const suggestions: RecommendationOptimizationSuggestion[] = [];
    const userPattern = this.analyzeUserBehaviorPattern();

    // 内容优化建议
    const contentSuggestions = this.generateContentOptimizationSuggestions();
    suggestions.push(...contentSuggestions);

    // 算法优化建议
    const algorithmSuggestions = this.generateAlgorithmOptimizationSuggestions(userPattern);
    suggestions.push(...algorithmSuggestions);

    // 个性化优化建议
    const personalizationSuggestions = this.generatePersonalizationSuggestions(userPattern);
    suggestions.push(...personalizationSuggestions);

    // 按优先级排序
    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * 生成内容优化建议
   */
  private generateContentOptimizationSuggestions(): RecommendationOptimizationSuggestion[] {
    const suggestions: RecommendationOptimizationSuggestion[] = [];
    const contents = defaultContentDatabase.getAllContents();

    for (const content of contents) {
      const analysis = this.analyzeContentEffectiveness(content.id);
      
      if (!analysis.recommendations.keep) {
        suggestions.push({
          type: "content",
          priority: "high",
          title: `删除或重做内容: ${content.title.zh}`,
          description: `该内容效果评分仅为${(analysis.effectiveness * 100).toFixed(1)}%，需要重大改进`,
          expectedImpact: "减少低质量推荐，提升用户满意度",
          implementationEffort: "medium",
          actions: analysis.recommendations.contentImprovements,
        });
      } else if (analysis.effectiveness < 0.5) {
        suggestions.push({
          type: "content",
          priority: "medium",
          title: `优化内容: ${content.title.zh}`,
          description: `该内容有改进空间，当前效果评分${(analysis.effectiveness * 100).toFixed(1)}%`,
          expectedImpact: "提升推荐质量和用户参与度",
          implementationEffort: "low",
          actions: analysis.recommendations.contentImprovements,
        });
      }
    }

    return suggestions;
  }

  /**
   * 生成算法优化建议
   */
  private generateAlgorithmOptimizationSuggestions(
    userPattern: UserBehaviorPattern
  ): RecommendationOptimizationSuggestion[] {
    const suggestions: RecommendationOptimizationSuggestion[] = [];

    // 基于用户偏好调整权重
    if (userPattern.preferredTypes.length > 0) {
      suggestions.push({
        type: "algorithm",
        priority: "high",
        title: "调整推荐算法权重",
        description: `根据用户偏好，增加${userPattern.preferredTypes.join(", ")}类型的推荐权重`,
        expectedImpact: "提升推荐相关性和用户满意度",
        implementationEffort: "low",
        actions: [
          `增加${userPattern.preferredTypes.join(", ")}类型的权重系数`,
          `降低${userPattern.avoidedTypes.join(", ")}类型的权重系数`,
          "重新训练推荐模型",
        ],
      });
    }

    // 优化触发机制
    if (userPattern.completionPatterns.quickCompletion > userPattern.completionPatterns.delayedCompletion) {
      suggestions.push({
        type: "delivery",
        priority: "medium",
        title: "优化推荐推送时机",
        description: "用户倾向于快速完成任务，建议在最佳时间推送推荐",
        expectedImpact: "提高推荐完成率",
        implementationEffort: "medium",
        actions: [
          "分析用户活跃时间段",
          "在用户活跃时段推送推荐",
          "设置推荐过期提醒",
        ],
      });
    }

    return suggestions;
  }

  /**
   * 生成个性化优化建议
   */
  private generatePersonalizationSuggestions(
    userPattern: UserBehaviorPattern
  ): RecommendationOptimizationSuggestion[] {
    const suggestions: RecommendationOptimizationSuggestion[] = [];

    // 基于完成模式的建议
    if (userPattern.completionPatterns.abandonment > 0.5) {
      suggestions.push({
        type: "personalization",
        priority: "high",
        title: "减少推荐数量和复杂度",
        description: "用户放弃率较高，建议简化推荐内容和减少同时推荐数量",
        expectedImpact: "提高完成率和用户满意度",
        implementationEffort: "low",
        actions: [
          "将同时推荐数量减少到3-5个",
          "简化行动步骤描述",
          "增加进度指示器",
        ],
      });
    }

    // 基于反馈趋势的建议
    if (userPattern.feedbackTrends.negativeTrend) {
      suggestions.push({
        type: "personalization",
        priority: "urgent",
        title: "改善推荐质量和相关性",
        description: "用户反馈呈负面趋势，需要立即改进推荐系统",
        expectedImpact: "防止用户流失，提升满意度",
        implementationEffort: "high",
        actions: [
          "审查所有推荐内容质量",
          "重新评估算法参数",
          "增加用户反馈收集渠道",
          "提供更多个性化选择",
        ],
      });
    }

    return suggestions;
  }

  /**
   * 应用优化建议
   */
  public applyOptimizations(
    suggestions: RecommendationOptimizationSuggestion[]
  ): RecommendationAlgorithmConfig {
    const updatedConfig = { ...this.algorithmConfig };

    for (const suggestion of suggestions) {
      if (suggestion.type === "algorithm") {
        // 应用算法相关优化
        for (const action of suggestion.actions) {
          if (action.includes("增加") && action.includes("权重")) {
            // 这里可以解析具体要调整的权重
            updatedConfig.weights.userFeedback += 0.05;
          }
        }
      }
    }

    // 确保权重总和为1
    const totalWeight = Object.values(updatedConfig.weights).reduce((sum, weight) => sum + weight, 0);
    if (totalWeight !== 1 && totalWeight > 0) {
      const normalizedWeights = { ...updatedConfig.weights };
      for (const key in normalizedWeights) {
        if (key in normalizedWeights) {
          (normalizedWeights as Record<string, number>)[key] /= totalWeight;
        }
      }
      updatedConfig.weights = normalizedWeights as typeof updatedConfig.weights;
    }

    this.algorithmConfig = updatedConfig;
    return updatedConfig;
  }

  /**
   * 获取更高优先级
   */
  private getHigherPriority(current: RecommendationPriority): RecommendationPriority {
    const hierarchy = ["low", "medium", "high", "urgent"];
    const currentIndex = hierarchy.indexOf(current);
    return currentIndex < hierarchy.length - 1 ? hierarchy[currentIndex + 1] : current;
  }

  /**
   * 获取更低优先级
   */
  private getLowerPriority(current: RecommendationPriority): RecommendationPriority {
    const hierarchy = ["low", "medium", "high", "urgent"];
    const currentIndex = hierarchy.indexOf(current);
    return currentIndex > 0 ? hierarchy[currentIndex - 1] : current;
  }

  /**
   * 更新用户模式
   */
  private updateUserPatterns(): void {
    // 重新分析用户行为模式
    this.userPatterns = null;
    this.analyzeUserBehaviorPattern();
  }

  /**
   * 生成优化报告
   */
  public generateOptimizationReport(): {
    summary: {
      totalRecommendations: number;
      averageEffectiveness: number;
      topPerformingContent: string[];
      underperformingContent: string[];
    };
    userPattern: UserBehaviorPattern;
    suggestions: RecommendationOptimizationSuggestion[];
    contentAnalysis: RecommendationEffectivenessAnalysis[];
  } {
    const contents = defaultContentDatabase.getAllContents();
    const contentAnalysis = contents.map(content => 
      this.analyzeContentEffectiveness(content.id)
    );

    const effectivenessScores = contentAnalysis.map(analysis => analysis.effectiveness);
    const averageEffectiveness = effectivenessScores.length > 0 
      ? effectivenessScores.reduce((sum, score) => sum + score, 0) / effectivenessScores.length
      : 0;

    const topPerformingContent = contentAnalysis
      .filter(analysis => analysis.effectiveness > 0.7)
      .map(analysis => analysis.contentId);

    const underperformingContent = contentAnalysis
      .filter(analysis => analysis.effectiveness < 0.3)
      .map(analysis => analysis.contentId);

    const suggestions = this.generateOptimizationSuggestions();
    const userPattern = this.analyzeUserBehaviorPattern();

    return {
      summary: {
        totalRecommendations: this.recommendationHistory.length,
        averageEffectiveness,
        topPerformingContent,
        underperformingContent,
      },
      userPattern,
      suggestions,
      contentAnalysis,
    };
  }
}

// 创建默认优化引擎实例
export const defaultOptimizationEngine = new RecommendationOptimizationEngine({
  weights: {
    stressLevel: 0.30,
    painLevel: 0.25,
    cyclePhase: 0.20,
    constitution: 0.15,
    historyPattern: 0.05,
    userFeedback: 0.05,
  },
  thresholds: {
    urgentScore: 0.8,
    highScore: 0.6,
    mediumScore: 0.4,
  },
  limits: {
    maxActiveRecommendations: 8,
    maxDailyRecommendations: 5,
    recommendationCooldown: 2,
  },
});