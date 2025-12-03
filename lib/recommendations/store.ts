/**
 * 推荐系统状态管理
 * Phase 3: 个性化推荐系统
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { StoreApi as ZustandStoreApi } from "zustand";

import {
  RecommendationItem,
  RecommendationHistory,
  RecommendationFeedback,
  RecommendationContext,
  RecommendationGenerationResult,
  RecommendationStatistics,
  RecommendationSettings,
  AssessmentRecord,
  AssessmentHistory,
} from "@/types/recommendations";
import { defaultRecommendationEngine } from "./algorithm";

// 推荐系统状态接口
export interface RecommendationStoreState {
  // 推荐数据
  activeRecommendations: RecommendationItem[];
  recommendationHistory: RecommendationHistory;
  feedbacks: RecommendationFeedback[];

  // 上下文数据
  currentContext: RecommendationContext | null;
  lastGenerationResult: RecommendationGenerationResult | null;

  // 设置和配置
  settings: RecommendationSettings;
  statistics: RecommendationStatistics;

  // 状态标记
  isGenerating: boolean;
  lastGenerationTime: string | null;
  error: string | null;
}

// 推荐系统Actions接口
export interface RecommendationStoreActions {
  // 推荐生成
  generateRecommendations: (
    assessmentHistory: AssessmentHistory,
  ) => Promise<void>;
  refreshRecommendations: () => Promise<void>;

  // 推荐管理
  dismissRecommendation: (recommendationId: string) => void;
  saveRecommendation: (recommendationId: string) => void;
  markAsViewed: (recommendationId: string) => void;
  markAsCompleted: (recommendationId: string) => void;

  // 反馈管理
  submitFeedback: (
    feedback: Omit<RecommendationFeedback, "id" | "timestamp">,
  ) => void;
  updateFeedback: (
    feedbackId: string,
    updates: Partial<RecommendationFeedback>,
  ) => void;

  // 上下文管理
  updateContext: (context: Partial<RecommendationContext>) => void;
  setContextFromAssessment: (assessment: AssessmentRecord) => void;

  // 设置管理
  updateSettings: (settings: Partial<RecommendationSettings>) => void;
  resetSettings: () => void;

  // 数据管理
  clearAllData: () => void;
  exportData: () => string;
  importData: (data: string) => void;

  // 统计和报告
  updateStatistics: () => void;
  generateReport: (dateRange?: { start: string; end: string }) => {
    summary: {
      totalRecommendations: number;
      totalViews: number;
      totalSaves: number;
      totalCompletions: number;
      totalFeedbacks: number;
    };
    breakdown: {
      byPriority: {
        urgent: number;
        high: number;
        medium: number;
        low: number;
      };
      byCategory: Record<string, number>;
      byType: Record<string, number>;
    };
    engagement: {
      viewRate: number;
      saveRate: number;
      completionRate: number;
    };
    feedback: {
      averageRating: number;
      satisfactionRate: number;
    };
    generatedAt: string;
    dateRange?: { start: string; end: string };
  };
}

// 推荐系统Store类型
export type RecommendationStore = RecommendationStoreState &
  RecommendationStoreActions;

/**
 * 创建推荐系统Store
 */
export const createRecommendationStore =
  (): ZustandStoreApi<RecommendationStore> => {
    return create<RecommendationStore>()(
      persist(
        (set, get) => ({
          // 初始状态
          activeRecommendations: [],
          recommendationHistory: {
            items: [],
            totalGenerated: 0,
            totalViewed: 0,
            totalSaved: 0,
            totalCompleted: 0,
            lastGeneratedAt: undefined,
          },
          feedbacks: [],
          currentContext: null,
          lastGenerationResult: null,
          settings: {
            algorithm: {
              weights: {
                stressLevel: 0.3,
                painLevel: 0.25,
                cyclePhase: 0.2,
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
            },
            notifications: {
              enabled: true,
              frequency: "daily",
              preferredTimes: ["09:00", "14:00", "18:00"],
              channels: ["in_app"],
            },
            privacy: {
              shareAnalytics: false,
              anonymizeData: true,
            },
            personalization: {
              learningEnabled: true,
              adaptationRate: "medium",
            },
          },
          statistics: {
            totalGenerated: 0,
            totalViewed: 0,
            totalSaved: 0,
            totalCompleted: 0,
            averageRating: 0,
            categoryEffectiveness: {},
            priorityEngagement: {
              urgent: 0,
              high: 0,
              medium: 0,
              low: 0,
            },
            recentTrends: {
              generationRate: [],
              engagementRate: [],
              satisfactionRate: [],
            },
          },
          isGenerating: false,
          lastGenerationTime: null,
          error: null,

          // 推荐生成
          generateRecommendations: async (
            assessmentHistory: AssessmentHistory,
          ) => {
            const store = get();

            try {
              set({ isGenerating: true, error: null });

              // 创建推荐上下文
              const context: RecommendationContext = {
                currentDate: new Date().toISOString().split("T")[0],
                lastAssessment: assessmentHistory.lastAssessmentDate
                  ? assessmentHistory.records.find(
                      (r) => r.date === assessmentHistory.lastAssessmentDate,
                    )
                  : assessmentHistory.records[
                      assessmentHistory.records.length - 1
                    ],
                recentAssessments: assessmentHistory.records.slice(-5),
                currentCyclePhase: store.currentContext?.currentCyclePhase,
                detectedPatterns: [],
                userPreferences: {
                  savedCategories: [],
                  dismissedTypes: [],
                  preferredTime: store.settings.notifications.preferredTimes,
                },
                environment: {
                  isWorkHours:
                    new Date().getHours() >= 9 && new Date().getHours() <= 18,
                  isWeekend:
                    new Date().getDay() === 0 || new Date().getDay() === 6,
                  season: getCurrentSeason(),
                },
              };

              // 使用算法引擎生成推荐
              const result =
                await defaultRecommendationEngine.generateRecommendations(
                  context,
                  store.settings.algorithm,
                );

              // 更新状态
              set({
                activeRecommendations: result.recommendations,
                lastGenerationResult: result,
                currentContext: context,
                lastGenerationTime: new Date().toISOString(),
                isGenerating: false,
              });

              // 更新历史记录
              const updatedHistory = {
                items: [
                  ...store.recommendationHistory.items,
                  ...result.recommendations,
                ],
                totalGenerated:
                  store.recommendationHistory.totalGenerated +
                  result.recommendations.length,
                totalViewed: store.recommendationHistory.totalViewed,
                totalSaved: store.recommendationHistory.totalSaved,
                totalCompleted: store.recommendationHistory.totalCompleted,
                lastGeneratedAt: new Date().toISOString(),
              };

              set({ recommendationHistory: updatedHistory });

              // 更新统计
              store.updateStatistics();
            } catch (error) {
              console.error("Failed to generate recommendations:", error);
              set({
                error:
                  error instanceof Error ? error.message : "生成推荐时发生错误",
                isGenerating: false,
              });
            }
          },

          refreshRecommendations: async () => {
            const store = get();

            // 模拟评估历史数据（实际应该从主store获取）
            const mockAssessmentHistory: AssessmentHistory = {
              records: [],
              lastAssessmentDate: null,
              totalAssessments: 0,
              premiumAssessments: 0,
            };

            await store.generateRecommendations(mockAssessmentHistory);
          },

          // 推荐管理
          dismissRecommendation: (recommendationId: string) => {
            const store = get();
            const updatedRecommendations = store.activeRecommendations.map(
              (rec) =>
                rec.id === recommendationId
                  ? {
                      ...rec,
                      status: "dismissed" as const,
                      dismissedAt: new Date().toISOString(),
                    }
                  : rec,
            );

            const filteredRecommendations = updatedRecommendations.filter(
              (rec) => rec.status !== "dismissed",
            );

            set({
              activeRecommendations: filteredRecommendations,
              recommendationHistory: {
                ...store.recommendationHistory,
                items: updatedRecommendations,
              },
            });
          },

          saveRecommendation: (recommendationId: string) => {
            const store = get();
            const updatedRecommendations = store.activeRecommendations.map(
              (rec) =>
                rec.id === recommendationId
                  ? {
                      ...rec,
                      status: "saved" as const,
                      savedAt: new Date().toISOString(),
                    }
                  : rec,
            );

            set({
              activeRecommendations: updatedRecommendations,
              recommendationHistory: {
                ...store.recommendationHistory,
                items: updatedRecommendations,
                totalSaved: store.recommendationHistory.totalSaved + 1,
              },
            });
          },

          markAsViewed: (recommendationId: string) => {
            const store = get();
            const updatedRecommendations = store.activeRecommendations.map(
              (rec) =>
                rec.id === recommendationId
                  ? {
                      ...rec,
                      status: "viewed" as const,
                      viewedAt: new Date().toISOString(),
                    }
                  : rec,
            );

            set({
              activeRecommendations: updatedRecommendations,
              recommendationHistory: {
                ...store.recommendationHistory,
                items: updatedRecommendations,
                totalViewed: store.recommendationHistory.totalViewed + 1,
              },
            });
          },

          markAsCompleted: (recommendationId: string) => {
            const store = get();
            const updatedRecommendations = store.activeRecommendations.map(
              (rec) =>
                rec.id === recommendationId
                  ? {
                      ...rec,
                      status: "completed" as const,
                      completedAt: new Date().toISOString(),
                    }
                  : rec,
            );

            set({
              activeRecommendations: updatedRecommendations,
              recommendationHistory: {
                ...store.recommendationHistory,
                items: updatedRecommendations,
                totalCompleted: store.recommendationHistory.totalCompleted + 1,
              },
            });
          },

          // 反馈管理
          submitFeedback: (
            feedback: Omit<RecommendationFeedback, "id" | "timestamp">,
          ) => {
            const store = get();
            const newFeedback: RecommendationFeedback = {
              ...feedback,
              id: `feedback_${Date.now()}_${Math.random()
                .toString(36)
                .substr(2, 9)}`,
              timestamp: new Date().toISOString(),
            };

            set({
              feedbacks: [...store.feedbacks, newFeedback],
            });

            // 更新统计
            store.updateStatistics();
          },

          updateFeedback: (
            feedbackId: string,
            updates: Partial<RecommendationFeedback>,
          ) => {
            const store = get();
            const updatedFeedbacks = store.feedbacks.map((fb) =>
              fb.id === feedbackId ? { ...fb, ...updates } : fb,
            );

            set({ feedbacks: updatedFeedbacks });
          },

          // 上下文管理
          updateContext: (context: Partial<RecommendationContext>) => {
            const store = get();
            set({
              currentContext: store.currentContext
                ? { ...store.currentContext, ...context }
                : context,
            });
          },

          setContextFromAssessment: (assessment: AssessmentRecord) => {
            const store = get();
            const context: Partial<RecommendationContext> = {
              lastAssessment: assessment,
              recentAssessments: [assessment],
            };

            store.updateContext(context);
          },

          // 设置管理
          updateSettings: (settings: Partial<RecommendationSettings>) => {
            const store = get();
            set({
              settings: { ...store.settings, ...settings },
            });
          },

          resetSettings: () => {
            set({
              settings: {
                algorithm: {
                  weights: {
                    stressLevel: 0.3,
                    painLevel: 0.25,
                    cyclePhase: 0.2,
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
                },
                notifications: {
                  enabled: true,
                  frequency: "daily",
                  preferredTimes: ["09:00", "14:00", "18:00"],
                  channels: ["in_app"],
                },
                privacy: {
                  shareAnalytics: false,
                  anonymizeData: true,
                },
                personalization: {
                  learningEnabled: true,
                  adaptationRate: "medium",
                },
              },
            });
          },

          // 数据管理
          clearAllData: () => {
            set({
              activeRecommendations: [],
              recommendationHistory: {
                items: [],
                totalGenerated: 0,
                totalViewed: 0,
                totalSaved: 0,
                totalCompleted: 0,
                lastGeneratedAt: undefined,
              },
              feedbacks: [],
              statistics: {
                totalGenerated: 0,
                totalViewed: 0,
                totalSaved: 0,
                totalCompleted: 0,
                averageRating: 0,
                categoryEffectiveness: {},
                priorityEngagement: {
                  urgent: 0,
                  high: 0,
                  medium: 0,
                  low: 0,
                },
                recentTrends: {
                  generationRate: [],
                  engagementRate: [],
                  satisfactionRate: [],
                },
              },
            });
          },

          exportData: () => {
            const store = get();
            const exportData = {
              activeRecommendations: store.activeRecommendations,
              recommendationHistory: store.recommendationHistory,
              feedbacks: store.feedbacks,
              settings: store.settings,
              statistics: store.statistics,
              exportedAt: new Date().toISOString(),
            };

            return JSON.stringify(exportData, null, 2);
          },

          importData: (data: string) => {
            try {
              const importedData = JSON.parse(data);

              // 验证数据结构
              if (
                importedData.activeRecommendations &&
                importedData.recommendationHistory
              ) {
                set({
                  activeRecommendations:
                    importedData.activeRecommendations || [],
                  recommendationHistory: importedData.recommendationHistory,
                  feedbacks: importedData.feedbacks || [],
                  settings: importedData.settings || get().settings,
                  statistics: importedData.statistics || get().statistics,
                });
              } else {
                throw new Error("Invalid data format");
              }
            } catch (error) {
              console.error("Failed to import data:", error);
              set({ error: "导入数据失败，请检查数据格式" });
            }
          },

          // 统计和报告
          updateStatistics: () => {
            const store = get();
            const history = store.recommendationHistory;
            const feedbacks = store.feedbacks;

            // 计算平均评分
            const ratingsWithValues = feedbacks.filter(
              (f) => f.rating !== undefined,
            );
            const averageRating =
              ratingsWithValues.length > 0
                ? ratingsWithValues.reduce((sum, f) => sum + f.rating!, 0) /
                  ratingsWithValues.length
                : 0;

            // 计算类别有效性
            const categoryEffectiveness: Record<string, number> = {};
            const categories = [
              ...new Set(history.items.map((item) => item.content.category)),
            ];

            for (const category of categories) {
              const categoryItems = history.items.filter(
                (item) => item.content.category === category,
              );
              const positiveFeedback = feedbacks.filter(
                (f) =>
                  categoryItems.some(
                    (item) => item.id === f.recommendationId,
                  ) &&
                  (f.type === "useful" ||
                    f.type === "helpful" ||
                    (f.rating && f.rating >= 4)),
              );

              categoryEffectiveness[category] =
                categoryItems.length > 0
                  ? positiveFeedback.length / categoryItems.length
                  : 0;
            }

            // 计算优先级参与度
            const priorityEngagement = {
              urgent: 0,
              high: 0,
              medium: 0,
              low: 0,
            };

            for (const priority of [
              "urgent",
              "high",
              "medium",
              "low",
            ] as const) {
              const priorityItems = history.items.filter(
                (item) => item.priority === priority,
              );
              const engagedItems = priorityItems.filter(
                (item) =>
                  item.status === "viewed" ||
                  item.status === "saved" ||
                  item.status === "completed",
              );

              priorityEngagement[priority] =
                priorityItems.length > 0
                  ? engagedItems.length / priorityItems.length
                  : 0;
            }

            set({
              statistics: {
                ...store.statistics,
                totalGenerated: history.totalGenerated,
                totalViewed: history.totalViewed,
                totalSaved: history.totalSaved,
                totalCompleted: history.totalCompleted,
                averageRating,
                categoryEffectiveness,
                priorityEngagement,
              },
            });
          },

          generateReport: (dateRange?: { start: string; end: string }) => {
            const store = get();

            // 筛选指定时间范围的数据
            const filterByDate = (date: string) => {
              if (!dateRange) return true;
              return date >= dateRange.start && date <= dateRange.end;
            };

            const filteredHistory = store.recommendationHistory.items.filter(
              (item) => filterByDate(item.generatedAt),
            );

            const filteredFeedbacks = store.feedbacks.filter((feedback) =>
              filterByDate(feedback.timestamp),
            );

            return {
              summary: {
                totalRecommendations: filteredHistory.length,
                totalViews: filteredHistory.filter(
                  (item) => item.status === "viewed",
                ).length,
                totalSaves: filteredHistory.filter(
                  (item) => item.status === "saved",
                ).length,
                totalCompletions: filteredHistory.filter(
                  (item) => item.status === "completed",
                ).length,
                totalFeedbacks: filteredFeedbacks.length,
              },
              breakdown: {
                byPriority: {
                  urgent: filteredHistory.filter(
                    (item) => item.priority === "urgent",
                  ).length,
                  high: filteredHistory.filter(
                    (item) => item.priority === "high",
                  ).length,
                  medium: filteredHistory.filter(
                    (item) => item.priority === "medium",
                  ).length,
                  low: filteredHistory.filter((item) => item.priority === "low")
                    .length,
                },
                byCategory: filteredHistory.reduce(
                  (acc, item) => {
                    acc[item.content.category] =
                      (acc[item.content.category] || 0) + 1;
                    return acc;
                  },
                  {} as Record<string, number>,
                ),
                byType: filteredHistory.reduce(
                  (acc, item) => {
                    acc[item.content.type] = (acc[item.content.type] || 0) + 1;
                    return acc;
                  },
                  {} as Record<string, number>,
                ),
              },
              engagement: {
                viewRate:
                  filteredHistory.length > 0
                    ? filteredHistory.filter((item) => item.status === "viewed")
                        .length / filteredHistory.length
                    : 0,
                saveRate:
                  filteredHistory.length > 0
                    ? filteredHistory.filter((item) => item.status === "saved")
                        .length / filteredHistory.length
                    : 0,
                completionRate:
                  filteredHistory.length > 0
                    ? filteredHistory.filter(
                        (item) => item.status === "completed",
                      ).length / filteredHistory.length
                    : 0,
              },
              feedback: {
                averageRating: store.statistics.averageRating,
                satisfactionRate:
                  filteredFeedbacks.filter(
                    (f) => f.type === "useful" || f.type === "helpful",
                  ).length / Math.max(1, filteredFeedbacks.length),
              },
              generatedAt: new Date().toISOString(),
              dateRange,
            };
          },
        }),
        {
          name: "recommendation-store",
          storage: createJSONStorage(() => localStorage),
          version: 1,
        },
      ),
    );
  };

// 辅助函数：获取当前季节
function getCurrentSeason(): string {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}

// 创建默认store实例
export const recommendationStore = createRecommendationStore();

// 导出hooks
export const useRecommendationStore = () => recommendationStore.getState();
export const useRecommendationActions = () => {
  const store = recommendationStore.getState();
  return {
    generateRecommendations: store.generateRecommendations,
    refreshRecommendations: store.refreshRecommendations,
    dismissRecommendation: store.dismissRecommendation,
    saveRecommendation: store.saveRecommendation,
    markAsViewed: store.markAsViewed,
    markAsCompleted: store.markAsCompleted,
    submitFeedback: store.submitFeedback,
    updateFeedback: store.updateFeedback,
    updateContext: store.updateContext,
    setContextFromAssessment: store.setContextFromAssessment,
    updateSettings: store.updateSettings,
    resetSettings: store.resetSettings,
    clearAllData: store.clearAllData,
    exportData: store.exportData,
    importData: store.importData,
    updateStatistics: store.updateStatistics,
    generateReport: store.generateReport,
  };
};
