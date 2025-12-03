/**
 * 推荐系统集成到WorkplaceWellnessStore
 * Phase 3: 个性化推荐系统
 */

import { AssessmentRecord, AssessmentHistory } from "@/types/recommendations";
import {
  useRecommendationStore,
  useRecommendationActions,
} from "@/lib/recommendations/store";
import { useRecommendationTriggers } from "@/lib/recommendations/triggers";
import { logError, logInfo } from "@/lib/debug-logger";

// 扩展现有store的接口定义
export interface RecommendationIntegrationState {
  // 评估历史（从现有的评估系统收集）
  assessmentHistory: AssessmentHistory;

  // 推荐系统状态（映射到推荐store）
  hasActiveRecommendations: boolean;
  unreadRecommendationsCount: number;
  urgentRecommendationsCount: number;

  // 集成设置
  integrationEnabled: boolean;
  autoGenerateOnAssessment: boolean;
  autoTriggerPatterns: boolean;
}

// 扩展Actions接口
export interface RecommendationIntegrationActions {
  // 评估数据收集
  recordAssessment: (assessment: AssessmentRecord) => void;
  getAssessmentHistory: () => AssessmentHistory;
  migrateAssessmentsFromStore: () => void;
  clearAssessmentHistory: () => void;

  // 推荐集成触发
  generateRecommendationsFromAssessment: (
    assessment: AssessmentRecord,
  ) => Promise<void>;
  triggerRecommendationRefresh: () => Promise<void>;

  // 统计和报告
  getIntegrationStatistics: () => {
    totalAssessments: number;
    totalRecommendations: number;
    completionRate: number;
    averageRating: number;
    lastAssessmentDate: string | null;
  };

  // 设置管理
  updateIntegrationSettings: (
    settings: Partial<RecommendationIntegrationState>,
  ) => void;

  // 状态同步
  syncWithRecommendationStore: () => void;
}

/**
 * 推荐系统集成Hook
 * 将推荐系统功能集成到现有的WorkplaceWellnessStore
 */
export const useRecommendationIntegration = (): RecommendationIntegrationState &
  RecommendationIntegrationActions => {
  const recommendationStore = useRecommendationStore();
  const recommendationActions = useRecommendationActions();
  const triggerEngine = useRecommendationTriggers();

  // 本地状态（在实际实现中应该通过store persist）
  const [integrationState, setIntegrationState] =
    useState<RecommendationIntegrationState>({
      assessmentHistory: {
        records: [],
        lastAssessmentDate: null,
        totalAssessments: 0,
        premiumAssessments: 0,
      },
      hasActiveRecommendations: false,
      unreadRecommendationsCount: 0,
      urgentRecommendationsCount: 0,
      integrationEnabled: true,
      autoGenerateOnAssessment: true,
      autoTriggerPatterns: true,
    });

  // 记录评估
  const recordAssessment = useCallback(
    (assessment: AssessmentRecord) => {
      setIntegrationState((prev) => {
        const updatedHistory: AssessmentHistory = {
          records: [...prev.assessmentHistory.records, assessment],
          lastAssessmentDate: assessment.date,
          totalAssessments: prev.assessmentHistory.totalAssessments + 1,
          premiumAssessments:
            prev.assessmentHistory.premiumAssessments +
            (assessment.isPremium ? 1 : 0),
        };

        // 如果启用了自动生成，触发推荐生成
        if (prev.autoGenerateOnAssessment) {
          generateRecommendationsFromAssessment(assessment);
        }

        // 触发评估完成触发器
        triggerEngine.handleAssessmentComplete(assessment);

        return {
          ...prev,
          assessmentHistory: updatedHistory,
        };
      });
    },
    [generateRecommendationsFromAssessment, triggerEngine],
  );

  // 获取评估历史
  const getAssessmentHistory = useCallback((): AssessmentHistory => {
    return integrationState.assessmentHistory;
  }, [integrationState.assessmentHistory]);

  // 从现有store迁移评估数据
  const migrateAssessmentsFromStore = useCallback(() => {
    // 这里应该从现有的评估组件中收集数据
    // 例如从压力评估、症状评估等组件的状态中获取

    try {
      // 示例：从localStorage迁移现有的评估数据
      const existingStressData = localStorage.getItem("stress-assessment-data");
      const existingPainData = localStorage.getItem("pain-assessment-data");

      const migratedRecords: AssessmentRecord[] = [];

      // 迁移压力评估数据
      if (existingStressData) {
        try {
          const stressData = JSON.parse(existingStressData);
          if (
            stressData.recentScores &&
            Array.isArray(stressData.recentScores)
          ) {
            stressData.recentScores.forEach((score: number, index: number) => {
              if (typeof score === "number" && score > 0) {
                const record: AssessmentRecord = {
                  id: `stress_migrated_${index}_${Date.now()}`,
                  date: new Date(Date.now() - index * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0],
                  type: "stress",
                  answers: [score],
                  score,
                  severity:
                    score >= 8 ? "severe" : score >= 6 ? "moderate" : "mild",
                  primaryPainPoint: "default",
                  isPremium: false,
                  timestamp: Date.now() - index * 24 * 60 * 60 * 1000,
                  completedAt: new Date(
                    Date.now() - index * 24 * 60 * 60 * 1000,
                  ).toISOString(),
                };
                migratedRecords.push(record);
              }
            });
          }
        } catch (error) {
          // 使用logger而不是console.error（开发环境自动启用，生产环境自动禁用）
          logError(
            "Failed to migrate stress assessment data",
            error,
            "RecommendationIntegration",
          );
        }
      }

      // 迁移疼痛评估数据
      if (existingPainData) {
        try {
          const painData = JSON.parse(existingPainData);
          if (painData.entries && Array.isArray(painData.entries)) {
            painData.entries.forEach(
              (entry: { painLevel?: number; date?: string }, index: number) => {
                if (entry.painLevel && typeof entry.painLevel === "number") {
                  const record: AssessmentRecord = {
                    id: `pain_migrated_${index}_${Date.now()}`,
                    date:
                      entry.date ||
                      new Date(Date.now() - index * 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split("T")[0],
                    type: "pain",
                    answers: [entry.painLevel],
                    score: entry.painLevel,
                    severity:
                      entry.painLevel >= 8
                        ? "severe"
                        : entry.painLevel >= 6
                          ? "moderate"
                          : "mild",
                    primaryPainPoint: "pain",
                    isPremium: false,
                    timestamp: new Date(entry.date || Date.now()).getTime(),
                    completedAt:
                      entry.date ||
                      new Date(
                        Date.now() - index * 24 * 60 * 60 * 1000,
                      ).toISOString(),
                  };
                  migratedRecords.push(record);
                }
              },
            );
          }
        } catch (error) {
          // 使用logger而不是console.error（开发环境自动启用，生产环境自动禁用）
          logError(
            "Failed to migrate pain assessment data",
            error,
            "RecommendationIntegration",
          );
        }
      }

      // 更新评估历史
      if (migratedRecords.length > 0) {
        setIntegrationState((prev) => {
          const updatedHistory: AssessmentHistory = {
            records: [...prev.assessmentHistory.records, ...migratedRecords],
            lastAssessmentDate:
              migratedRecords[migratedRecords.length - 1]?.date || null,
            totalAssessments:
              prev.assessmentHistory.totalAssessments + migratedRecords.length,
            premiumAssessments: prev.assessmentHistory.premiumAssessments,
          };

          // 使用logger而不是console.log（开发环境自动启用，生产环境自动禁用）
          logInfo(
            `Migrated ${migratedRecords.length} assessment records`,
            undefined,
            "RecommendationIntegration",
          );

          return {
            ...prev,
            assessmentHistory: updatedHistory,
          };
        });
      }
    } catch (error) {
      // 使用logger而不是console.error（开发环境自动启用，生产环境自动禁用）
      logError(
        "Failed to migrate assessment data",
        error,
        "RecommendationIntegration",
      );
    }
  }, []);

  // 清空评估历史
  const clearAssessmentHistory = useCallback(() => {
    setIntegrationState((prev) => ({
      ...prev,
      assessmentHistory: {
        records: [],
        lastAssessmentDate: null,
        totalAssessments: 0,
        premiumAssessments: 0,
      },
    }));
  }, []);

  // 从评估生成推荐
  const generateRecommendationsFromAssessment = useCallback(async () => {
    if (!integrationState.integrationEnabled) return;

    try {
      await recommendationActions.generateRecommendations(
        integrationState.assessmentHistory,
      );
      syncWithRecommendationStore();
    } catch (error) {
      // 使用logger而不是console.error（开发环境自动启用，生产环境自动禁用）
      logError(
        "Failed to generate recommendations from assessment",
        error,
        "RecommendationIntegration",
      );
    }
  }, [
    integrationState.integrationEnabled,
    integrationState.assessmentHistory,
    syncWithRecommendationStore,
    recommendationActions,
  ]);

  // 手动刷新推荐
  const triggerRecommendationRefresh = useCallback(async () => {
    try {
      await recommendationActions.refreshRecommendations();
      syncWithRecommendationStore();
    } catch (error) {
      // 使用logger而不是console.error（开发环境自动启用，生产环境自动禁用）
      logError(
        "Failed to refresh recommendations",
        error,
        "RecommendationIntegration",
      );
    }
  }, [syncWithRecommendationStore, recommendationActions]);

  // 获取集成统计
  const getIntegrationStatistics = useCallback(() => {
    const history = integrationState.assessmentHistory;
    const stats = recommendationStore.statistics;

    return {
      totalAssessments: history.totalAssessments,
      totalRecommendations: stats.totalGenerated,
      completionRate:
        stats.totalGenerated > 0
          ? (stats.totalCompleted / stats.totalGenerated) * 100
          : 0,
      averageRating: stats.averageRating,
      lastAssessmentDate: history.lastAssessmentDate,
    };
  }, [integrationState, recommendationStore]);

  // 更新集成设置
  const updateIntegrationSettings = useCallback(
    (settings: Partial<RecommendationIntegrationState>) => {
      setIntegrationState((prev) => ({ ...prev, ...settings }));
    },
    [],
  );

  // 与推荐store同步状态
  const syncWithRecommendationStore = useCallback(() => {
    const activeRecs = recommendationStore.activeRecommendations;
    const urgentRecs = activeRecs.filter((r) => r.priority === "urgent");
    const unreadRecs = activeRecs.filter((r) => r.status === "active");

    setIntegrationState((prev) => ({
      ...prev,
      hasActiveRecommendations: activeRecs.length > 0,
      unreadRecommendationsCount: unreadRecs.length,
      urgentRecommendationsCount: urgentRecs.length,
    }));
  }, [recommendationStore]);

  // 初始化时同步状态
  useEffect(() => {
    syncWithRecommendationStore();

    // 迁移现有数据
    if (integrationState.assessmentHistory.records.length === 0) {
      migrateAssessmentsFromStore();
    }
  }, [
    integrationState.assessmentHistory.records.length,
    migrateAssessmentsFromStore,
    syncWithRecommendationStore,
  ]);

  // 监听推荐store变化
  useEffect(() => {
    const interval = setInterval(() => {
      syncWithRecommendationStore();
    }, 5000); // 每5秒同步一次

    return () => clearInterval(interval);
  }, [syncWithRecommendationStore]);

  return {
    ...integrationState,
    recordAssessment,
    getAssessmentHistory,
    migrateAssessmentsFromStore,
    clearAssessmentHistory,
    generateRecommendationsFromAssessment,
    triggerRecommendationRefresh,
    getIntegrationStatistics,
    updateIntegrationSettings,
    syncWithRecommendationStore,
  };
};

/**
 * 为现有组件提供推荐集成的Hook
 * 可以轻松集成到现有的评估组件中
 */
export const useAssessmentRecommendationIntegration = () => {
  const integration = useRecommendationIntegration();

  return {
    // 简化的接口，供现有评估组件使用
    onAssessmentComplete: (assessment: AssessmentRecord) => {
      integration.recordAssessment(assessment);
    },
    onAssessmentStart: () => {
      // 可以在这里添加一些预处理逻辑
    },
    getRecommendationCount: () => integration.unreadRecommendationsCount,
    hasUrgentRecommendations: () => integration.urgentRecommendationsCount > 0,
    refreshRecommendations: () => integration.triggerRecommendationRefresh(),
  };
};

// 由于使用了useState和useEffect，需要导入React
import { useState, useEffect, useCallback } from "react";
