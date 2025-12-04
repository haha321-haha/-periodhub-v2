/**
 * 智能推荐触发机制
 * Phase 3: 个性化推荐系统
 */

import {
  RecommendationContext,
  AssessmentRecord,
  RecommendationTrigger,
  PatternDetection,
  // RecommendationSettings // 已注释：当前未使用
} from "@/types/recommendations";
import { logInfo, logError } from "@/lib/debug-logger";
// useRecommendationActions是React Hook，不能在类方法中使用
// import { useRecommendationActions } from "./store";

/**
 * 触发器配置接口
 */
export interface TriggerConfig {
  enabled: boolean;
  cooldownPeriod: number; // 冷却期（分钟）
  maxTriggersPerDay: number;
  quietHours: {
    start: string; // HH:mm
    end: string; // HH:mm
  };
  triggers: {
    assessmentComplete: boolean;
    abnormalPattern: boolean;
    cyclePhaseChange: boolean;
    timeBased: boolean;
    emergencyAlert: boolean;
    userRequest: boolean;
  };
}

/**
 * 触发事件接口
 */
export interface TriggerEvent {
  id: string;
  type: RecommendationTrigger;
  timestamp: string;
  context: Partial<RecommendationContext>;
  metadata?: Record<string, unknown>;
  processed: boolean;
}

/**
 * 智能触发器类
 */
export class RecommendationTriggerEngine {
  private config: TriggerConfig;
  private eventHistory: TriggerEvent[] = [];
  private lastTriggerTimes: Map<RecommendationTrigger, string> = new Map();
  private dailyTriggerCount: Map<string, number> = new Map();

  constructor(config?: Partial<TriggerConfig>) {
    this.config = {
      enabled: true,
      cooldownPeriod: 30, // 30分钟冷却期
      maxTriggersPerDay: 10,
      quietHours: {
        start: "22:00",
        end: "07:00",
      },
      triggers: {
        assessmentComplete: true,
        abnormalPattern: true,
        cyclePhaseChange: true,
        timeBased: true,
        emergencyAlert: true,
        userRequest: true,
      },
      ...config,
    };

    // 清理过期的事件历史
    setInterval(() => {
      this.cleanupEventHistory();
    }, 60000); // 每分钟清理一次
  }

  /**
   * 处理评估完成触发器
   */
  public async handleAssessmentComplete(
    assessment: AssessmentRecord,
  ): Promise<boolean> {
    if (!this.config.triggers.assessmentComplete) return false;

    const trigger: TriggerEvent = {
      id: `trigger_${Date.now()}_assessment`,
      type: "assessment_complete",
      timestamp: new Date().toISOString(),
      context: {
        lastAssessment: assessment,
        recentAssessments: [assessment],
        currentDate: new Date().toISOString().split("T")[0],
      },
      processed: false,
    };

    return this.processTrigger(trigger);
  }

  /**
   * 处理异常模式触发器
   */
  public async handleAbnormalPattern(
    pattern: PatternDetection,
  ): Promise<boolean> {
    if (!this.config.triggers.abnormalPattern) return false;

    // 只对严重和中度的模式触发推荐
    if (pattern.severity !== "severe" && pattern.severity !== "moderate")
      return false;

    const trigger: TriggerEvent = {
      id: `trigger_${Date.now()}_pattern`,
      type: "abnormal_pattern",
      timestamp: new Date().toISOString(),
      context: {
        detectedPatterns: [pattern],
        currentDate: new Date().toISOString().split("T")[0],
      },
      metadata: {
        patternType: pattern.type,
        severity: pattern.severity,
        confidence: pattern.confidence,
      },
      processed: false,
    };

    return this.processTrigger(trigger);
  }

  /**
   * 处理周期阶段变化触发器
   */
  public async handleCyclePhaseChange(
    newPhase: string,
    previousPhase?: string,
  ): Promise<boolean> {
    if (!this.config.triggers.cyclePhaseChange) return false;

    // 避免相同阶段的重复触发
    if (previousPhase === newPhase) return false;

    const trigger: TriggerEvent = {
      id: `trigger_${Date.now()}_cycle`,
      type: "cycle_phase",
      timestamp: new Date().toISOString(),
      context: {
        currentCyclePhase: newPhase,
        currentDate: new Date().toISOString().split("T")[0],
      },
      metadata: {
        previousPhase,
        newPhase,
      },
      processed: false,
    };

    return this.processTrigger(trigger);
  }

  /**
   * 处理时间触发器
   */
  public async handleTimeBasedTrigger(
    timeType: "morning" | "afternoon" | "evening" | "weekly" | "monthly",
  ): Promise<boolean> {
    if (!this.config.triggers.timeBased) return false;

    const trigger: TriggerEvent = {
      id: `trigger_${Date.now()}_time`,
      type: "time_based",
      timestamp: new Date().toISOString(),
      context: {
        currentDate: new Date().toISOString().split("T")[0],
        environment: {
          isWorkHours:
            new Date().getHours() >= 9 && new Date().getHours() <= 18,
          isWeekend: new Date().getDay() === 0 || new Date().getDay() === 6,
          season: this.getCurrentSeason(),
        },
      },
      metadata: {
        timeType,
      },
      processed: false,
    };

    return this.processTrigger(trigger);
  }

  /**
   * 处理紧急警报触发器
   */
  public async handleEmergencyAlert(
    severity: "severe" | "emergency",
    details: Record<string, unknown>,
  ): Promise<boolean> {
    if (!this.config.triggers.emergencyAlert) return false;

    const trigger: TriggerEvent = {
      id: `trigger_${Date.now()}_emergency`,
      type: "emergency_alert",
      timestamp: new Date().toISOString(),
      context: {
        currentDate: new Date().toISOString().split("T")[0],
      },
      metadata: {
        severity,
        details,
      },
      processed: false,
    };

    // 紧急情况跳过冷却期和次数限制
    return this.processTrigger(trigger, true);
  }

  /**
   * 处理用户请求触发器
   */
  public async handleUserRequest(
    requestType: "manual_refresh" | "specific_category" | "emergency_help",
  ): Promise<boolean> {
    if (!this.config.triggers.userRequest) return false;

    const trigger: TriggerEvent = {
      id: `trigger_${Date.now()}_user`,
      type: "user_request",
      timestamp: new Date().toISOString(),
      context: {
        currentDate: new Date().toISOString().split("T")[0],
      },
      metadata: {
        requestType,
      },
      processed: false,
    };

    return this.processTrigger(trigger);
  }

  /**
   * 处理触发器
   */
  private async processTrigger(
    trigger: TriggerEvent,
    bypassLimits: boolean = false,
  ): Promise<boolean> {
    try {
      // 检查是否在静默时间
      if (!bypassLimits && this.isQuietHours()) {
        console.log("Trigger skipped: quiet hours");
        return false;
      }

      // 检查冷却期
      if (!bypassLimits && this.isInCooldown(trigger.type)) {
        console.log("Trigger skipped: cooldown period");
        return false;
      }

      // 检查每日触发次数限制
      if (!bypassLimits && this.exceedsDailyLimit()) {
        console.log("Trigger skipped: daily limit exceeded");
        return false;
      }

      // 添加到事件历史
      this.eventHistory.push(trigger);
      this.updateTriggerTime(trigger.type);
      this.updateDailyCount();

      // 标记为已处理
      trigger.processed = true;

      // 注意：不能在类方法中使用React Hooks
      // 推荐生成应该在组件层面调用，这里只负责触发事件
      // 组件可以通过useRecommendationTriggers Hook获取触发器实例
      // 然后调用useRecommendationActions来生成推荐

      // 构建完整的上下文（当前未使用，但保留以备将来需要）
      // const fullContext = this.buildFullContext(trigger.context);

      // 这里应该调用推荐生成，但需要AssessmentHistory参数
      // 暂时使用模拟数据
      // const mockAssessmentHistory = {
      //   records: trigger.context.recentAssessments || [],
      //   lastAssessmentDate: trigger.context.lastAssessment?.date || null,
      //   totalAssessments: (trigger.context.recentAssessments || []).length,
      //   premiumAssessments: 0,
      // };

      // 异步生成推荐（应该在组件层面调用）
      // actions.generateRecommendations(mockAssessmentHistory).catch(console.error);

      // 使用logger而不是console.log（开发环境自动启用，生产环境自动禁用）
      logInfo(
        `Trigger processed successfully: ${trigger.id}`,
        undefined,
        "RecommendationTriggerEngine",
      );
      return true;
    } catch (error) {
      // 使用logger而不是console.error（开发环境自动启用，生产环境自动禁用）
      logError(
        "Failed to process trigger",
        error,
        "RecommendationTriggerEngine",
      );
      return false;
    }
  }

  /**
   * 构建完整的推荐上下文
   */
  private buildFullContext(
    partialContext: Partial<RecommendationContext>,
  ): RecommendationContext {
    return {
      currentDate: new Date().toISOString().split("T")[0],
      lastAssessment: partialContext.lastAssessment,
      recentAssessments: partialContext.recentAssessments || [],
      currentCyclePhase: partialContext.currentCyclePhase,
      detectedPatterns: partialContext.detectedPatterns || [],
      userPreferences: {
        savedCategories: [],
        dismissedTypes: [],
        preferredTime: ["09:00", "14:00", "18:00"],
      },
      environment: {
        isWorkHours: new Date().getHours() >= 9 && new Date().getHours() <= 18,
        isWeekend: new Date().getDay() === 0 || new Date().getDay() === 6,
        season: this.getCurrentSeason(),
      },
      ...partialContext,
    };
  }

  /**
   * 检查是否在静默时间
   */
  private isQuietHours(): boolean {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [startHour, startMin] = this.config.quietHours.start
      .split(":")
      .map(Number);
    const [endHour, endMin] = this.config.quietHours.end.split(":").map(Number);

    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    // 处理跨天的情况
    if (startTime > endTime) {
      return currentTime >= startTime || currentTime <= endTime;
    }

    return currentTime >= startTime && currentTime <= endTime;
  }

  /**
   * 检查是否在冷却期
   */
  private isInCooldown(triggerType: RecommendationTrigger): boolean {
    const lastTime = this.lastTriggerTimes.get(triggerType);
    if (!lastTime) return false;

    const lastTriggerDate = new Date(lastTime);
    const now = new Date();
    const diffMinutes =
      (now.getTime() - lastTriggerDate.getTime()) / (1000 * 60);

    return diffMinutes < this.config.cooldownPeriod;
  }

  /**
   * 检查是否超过每日限制
   */
  private exceedsDailyLimit(): boolean {
    const today = new Date().toISOString().split("T")[0];
    const todayCount = this.dailyTriggerCount.get(today) || 0;
    return todayCount >= this.config.maxTriggersPerDay;
  }

  /**
   * 更新触发时间
   */
  private updateTriggerTime(triggerType: RecommendationTrigger): void {
    this.lastTriggerTimes.set(triggerType, new Date().toISOString());
  }

  /**
   * 更新每日计数
   */
  private updateDailyCount(): void {
    const today = new Date().toISOString().split("T")[0];
    const currentCount = this.dailyTriggerCount.get(today) || 0;
    this.dailyTriggerCount.set(today, currentCount + 1);
  }

  /**
   * 清理过期的事件历史
   */
  private cleanupEventHistory(): void {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // 清理24小时前的事件
    this.eventHistory = this.eventHistory.filter(
      (event) => new Date(event.timestamp) > oneDayAgo,
    );

    // 清理过期的每日计数
    const datesToDelete: string[] = [];
    for (const date of this.dailyTriggerCount.keys()) {
      if (new Date(date) < oneDayAgo) {
        datesToDelete.push(date);
      }
    }

    datesToDelete.forEach((date) => {
      this.dailyTriggerCount.delete(date);
    });

    // 清理过期的触发时间
    for (const [triggerType, timestamp] of this.lastTriggerTimes.entries()) {
      if (new Date(timestamp) < oneDayAgo) {
        this.lastTriggerTimes.delete(triggerType);
      }
    }
  }

  /**
   * 获取当前季节
   */
  private getCurrentSeason(): string {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return "spring";
    if (month >= 5 && month <= 7) return "summer";
    if (month >= 8 && month <= 10) return "autumn";
    return "winter";
  }

  /**
   * 获取触发器统计
   */
  public getStatistics(): {
    totalTriggers: number;
    triggersToday: number;
    triggersByType: Record<RecommendationTrigger, number>;
    averageTriggersPerDay: number;
  } {
    const today = new Date().toISOString().split("T")[0];
    const triggersToday = this.eventHistory.filter((event) =>
      event.timestamp.startsWith(today),
    ).length;

    const triggersByType: Record<RecommendationTrigger, number> = {
      assessment_complete: 0,
      abnormal_pattern: 0,
      cycle_phase: 0,
      time_based: 0,
      emergency_alert: 0,
      user_request: 0,
    };

    this.eventHistory.forEach((event) => {
      triggersByType[event.type]++;
    });

    // 计算平均每日触发次数（基于最近7天）
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentTriggers = this.eventHistory.filter(
      (event) => new Date(event.timestamp) > sevenDaysAgo,
    ).length;
    const averageTriggersPerDay = recentTriggers / 7;

    return {
      totalTriggers: this.eventHistory.length,
      triggersToday,
      triggersByType,
      averageTriggersPerDay,
    };
  }

  /**
   * 更新配置
   */
  public updateConfig(newConfig: Partial<TriggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * 获取配置
   */
  public getConfig(): TriggerConfig {
    return { ...this.config };
  }
}

/**
 * 创建默认触发器引擎实例
 */
export const defaultTriggerEngine = new RecommendationTriggerEngine();

/**
 * React Hook for trigger engine
 */
export const useRecommendationTriggers = () => {
  const engine = defaultTriggerEngine;

  return {
    handleAssessmentComplete: engine.handleAssessmentComplete.bind(engine),
    handleAbnormalPattern: engine.handleAbnormalPattern.bind(engine),
    handleCyclePhaseChange: engine.handleCyclePhaseChange.bind(engine),
    handleTimeBasedTrigger: engine.handleTimeBasedTrigger.bind(engine),
    handleEmergencyAlert: engine.handleEmergencyAlert.bind(engine),
    handleUserRequest: engine.handleUserRequest.bind(engine),
    getStatistics: engine.getStatistics.bind(engine),
    updateConfig: engine.updateConfig.bind(engine),
    getConfig: engine.getConfig.bind(engine),
  };
};
