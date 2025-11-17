/**
 * HVsLYEp职场健康助手 - Zustand状态管理
 * 基于HVsLYEp的appState结构设计
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  WorkplaceWellnessState,
  CalendarState,
  WorkImpactData,
  NutritionData,
  ExportConfig,
  PainLevel,
  MenstrualPhase,
  TCMConstitution,
  ExportType,
  ExportFormat,
  // Day 11: 新增类型导入
  UserPreferences,
  ExportTemplate,
  BatchExportQueue,
  BatchExportItem,
  ExportHistory,
  SystemSettings,
  Theme,
  FontSize,
  SettingsValidationResult,
  PreferenceChange,
  PeriodRecord,
  RecommendationFeedback,
  RecommendationFeedbackHistory,
} from "../types";

// Day 11: 导入默认值
import {
  DEFAULT_USER_PREFERENCES,
  DEFAULT_EXPORT_TEMPLATES,
  DEFAULT_SYSTEM_SETTINGS,
} from "../types/defaults";
import { mockPeriodData } from "../data";

// 扩展状态接口，添加Actions
interface WorkplaceWellnessStore extends WorkplaceWellnessState {
  // 标签页相关Actions
  setActiveTab: (tab: "calendar" | "nutrition" | "export" | "settings" | "assessment" | "recommendations" | "tracking" | "analytics" | "work-impact" | "analysis") => void;

  // 日历相关Actions
  updateCalendar: (updates: Partial<CalendarState>) => void;
  setCurrentDate: (date: Date) => void;
  setSelectedDate: (date: Date | null) => void;
  toggleAddForm: () => void;
  addPeriodRecord: (record: PeriodRecord) => void;
  updatePeriodRecord: (date: string, record: Partial<PeriodRecord>) => void;
  deletePeriodRecord: (date: string) => void;

  // 工作影响相关Actions
  updateWorkImpact: (updates: Partial<WorkImpactData>) => void;
  setPainLevel: (level: number) => void;
  setEfficiency: (efficiency: number) => void;
  selectTemplate: (templateId: number | null) => void;

  // 营养相关Actions
  updateNutrition: (updates: Partial<NutritionData>) => void;
  setSelectedPhase: (phase: string) => void;
  setConstitutionType: (type: string) => void;
  setSearchTerm: (term: string) => void;

  // 导出相关Actions
  updateExport: (updates: Partial<ExportConfig>) => void;
  setExportType: (type: string) => void;
  setExportFormat: (format: string) => void;
  setExporting: (exporting: boolean) => void;

  // 工具方法
  resetState: () => void;
  getStateSnapshot: () => Partial<WorkplaceWellnessState>;

  // Day 11: 用户偏好设置相关Actions
  updateUserPreferences: (updates: Partial<UserPreferences>) => void;
  setTheme: (theme: Theme) => void;
  setFontSize: (fontSize: FontSize) => void;
  toggleAnimations: () => void;
  toggleCompactMode: () => void;
  updateNotificationSettings: (
    updates: Partial<UserPreferences["notifications"]>,
  ) => void;
  updatePrivacySettings: (updates: Partial<UserPreferences["privacy"]>) => void;
  updateAccessibilitySettings: (
    updates: Partial<UserPreferences["accessibility"]>,
  ) => void;
  validateSettings: () => SettingsValidationResult;
  resetPreferences: () => void;

  // Day 11: 导出模板相关Actions
  addExportTemplate: (
    template: Omit<ExportTemplate, "id" | "createdAt" | "updatedAt">,
  ) => void;
  updateExportTemplate: (id: string, updates: Partial<ExportTemplate>) => void;
  deleteExportTemplate: (id: string) => void;
  setActiveTemplate: (template: ExportTemplate | null) => void;
  loadTemplate: (id: string) => void;
  duplicateTemplate: (id: string) => void;

  // Day 11: 批量导出相关Actions
  createBatchExport: (
    items: Omit<BatchExportItem, "id" | "createdAt" | "status" | "progress">[],
  ) => void;
  updateBatchItemStatus: (
    itemId: string,
    status: BatchExportItem["status"],
    progress?: number,
    error?: string,
  ) => void;
  cancelBatchExport: () => void;
  retryFailedItems: () => void;
  clearBatchExport: () => void;

  // Day 11: 导出历史相关Actions
  addExportHistory: (history: Omit<ExportHistory, "id" | "createdAt">) => void;
  clearExportHistory: () => void;
  deleteExportHistory: (id: string) => void;

  // Day 11: 系统设置相关Actions
  updateSystemSettings: (updates: Partial<SystemSettings>) => void;
  resetSystemSettings: () => void;

  // Day 11: 偏好设置变更追踪
  addPreferenceChange: (change: PreferenceChange) => void;
  getPreferenceHistory: () => PreferenceChange[];
  clearPreferenceHistory: () => void;
  
  // 推荐反馈 Actions
  addRecommendationFeedback: (feedback: Omit<RecommendationFeedback, 'timestamp'>) => void;
  clearIgnoredItem: (id: string) => void;
  clearAllIgnored: () => void;
  getFeedbackHistory: () => RecommendationFeedbackHistory;
}

// 初始状态 - 基于HVsLYEp的appState
const initialState: WorkplaceWellnessState = {
  activeTab: "assessment",
  calendar: {
    currentDate: new Date(),
    selectedDate: null,
    showAddForm: false,
    periodData: mockPeriodData,
  },
  workImpact: {
    painLevel: 0 as PainLevel,
    efficiency: 100,
    selectedTemplateId: null,
  },
  nutrition: {
    selectedPhase: "menstrual" as MenstrualPhase,
    constitutionType: "balanced" as TCMConstitution,
    searchTerm: "",
  },
  export: {
    exportType: "period" as ExportType,
    format: "json" as ExportFormat,
    isExporting: false,
  },

  // Day 11: 扩展状态
  userPreferences: DEFAULT_USER_PREFERENCES,
  exportTemplates: DEFAULT_EXPORT_TEMPLATES,
  activeTemplate: null,
  batchExportQueue: null,
  exportHistory: [],
  systemSettings: DEFAULT_SYSTEM_SETTINGS,
  
  // 推荐反馈
  recommendationFeedback: {
    feedbacks: [],
    ignoredItems: [],
    savedItems: [],
    itemRatings: {},
  },
};

// 创建Zustand Store - 使用persist进行本地存储持久化
export const useWorkplaceWellnessStore = create<WorkplaceWellnessStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      ...initialState,

      // 语言相关Actions

      // 标签页相关Actions
      setActiveTab: (tab) => set({ activeTab: tab }),

      // 日历相关Actions
      updateCalendar: (updates) =>
        set((state) => ({
          calendar: { ...state.calendar, ...updates },
        })),

      setCurrentDate: (date) =>
        set((state) => ({
          calendar: { ...state.calendar, currentDate: date },
        })),

      setSelectedDate: (date) =>
        set((state) => ({
          calendar: { ...state.calendar, selectedDate: date },
        })),

      toggleAddForm: () =>
        set((state) => ({
          calendar: {
            ...state.calendar,
            showAddForm: !state.calendar.showAddForm,
          },
        })),

      addPeriodRecord: (record) =>
        set((state) => {
          // 检查是否已存在相同日期的记录，如果存在则更新，否则添加
          const existingIndex = state.calendar.periodData.findIndex(
            (r) => r.date === record.date,
          );
          let updatedPeriodData =
            existingIndex >= 0
              ? state.calendar.periodData.map((r, index) =>
                  index === existingIndex ? record : r,
                )
              : [...state.calendar.periodData, record];

          // 数据清理：只保留最近 6 个月的记录（更激进）
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          
          updatedPeriodData = updatedPeriodData.filter((r) => {
            try {
              const recordDate = new Date(r.date);
              return recordDate >= sixMonthsAgo;
            } catch {
              return false; // 无效日期，删除
            }
          });

          // 按日期排序（最新的在前）
          updatedPeriodData.sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );

          return {
            calendar: {
              ...state.calendar,
              periodData: updatedPeriodData,
            },
          };
        }),

      updatePeriodRecord: (date, updates) =>
        set((state) => {
          const updatedPeriodData = state.calendar.periodData.map((r) =>
            r.date === date ? { ...r, ...updates } : r,
          );

          return {
            calendar: {
              ...state.calendar,
              periodData: updatedPeriodData,
            },
          };
        }),

      deletePeriodRecord: (date) =>
        set((state) => {
          const updatedPeriodData = state.calendar.periodData.filter(
            (r) => r.date !== date,
          );

          return {
            calendar: {
              ...state.calendar,
              periodData: updatedPeriodData,
            },
          };
        }),

      // 工作影响相关Actions
      updateWorkImpact: (updates) =>
        set((state) => ({
          workImpact: { ...state.workImpact, ...updates },
        })),

      setPainLevel: (level) =>
        set((state) => ({
          workImpact: {
            ...state.workImpact,
            painLevel: level as PainLevel, // 类型断言
          },
        })),

      setEfficiency: (efficiency) =>
        set((state) => ({
          workImpact: { ...state.workImpact, efficiency },
        })),

      selectTemplate: (templateId) =>
        set((state) => ({
          workImpact: { ...state.workImpact, selectedTemplateId: templateId },
        })),

      // 营养相关Actions
      updateNutrition: (updates) =>
        set((state) => ({
          nutrition: { ...state.nutrition, ...updates },
        })),

      setSelectedPhase: (phase) =>
        set((state) => ({
          nutrition: {
            ...state.nutrition,
            selectedPhase: phase as MenstrualPhase,
          },
        })),

      setConstitutionType: (type) =>
        set((state) => ({
          nutrition: {
            ...state.nutrition,
            constitutionType: type as TCMConstitution,
          },
        })),

      setSearchTerm: (term) =>
        set((state) => ({
          nutrition: { ...state.nutrition, searchTerm: term },
        })),

      // 导出相关Actions
      updateExport: (updates) =>
        set((state) => ({
          export: { ...state.export, ...updates },
        })),

      setExportType: (type) =>
        set((state) => ({
          export: { ...state.export, exportType: type as ExportType },
        })),

      setExportFormat: (format) =>
        set((state) => ({
          export: { ...state.export, format: format as ExportFormat },
        })),

      setExporting: (exporting) =>
        set((state) => ({
          export: { ...state.export, isExporting: exporting },
        })),

      // Day 11: 用户偏好设置相关Actions
      updateUserPreferences: (updates) =>
        set((state) => ({
          userPreferences: { ...state.userPreferences, ...updates },
        })),

      setTheme: (theme) =>
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            ui: { ...state.userPreferences.ui, theme },
          },
        })),

      setFontSize: (fontSize) =>
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            ui: { ...state.userPreferences.ui, fontSize },
          },
        })),

      toggleAnimations: () =>
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            ui: {
              ...state.userPreferences.ui,
              animations: !state.userPreferences.ui.animations,
            },
          },
        })),

      toggleCompactMode: () =>
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            ui: {
              ...state.userPreferences.ui,
              compactMode: !state.userPreferences.ui.compactMode,
            },
          },
        })),

      updateNotificationSettings: (updates) =>
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            notifications: {
              ...state.userPreferences.notifications,
              ...updates,
            },
          },
        })),

      updatePrivacySettings: (updates) =>
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            privacy: { ...state.userPreferences.privacy, ...updates },
          },
        })),

      updateAccessibilitySettings: (updates) =>
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            accessibility: {
              ...state.userPreferences.accessibility,
              ...updates,
            },
          },
        })),

      validateSettings: () => {
        const state = get();
        const errors: SettingsValidationResult["errors"] = [];
        const warnings: SettingsValidationResult["warnings"] = [];

        // 验证时间格式
        if (
          !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(
            state.userPreferences.notifications.reminderTime,
          )
        ) {
          errors.push({
            category: "notifications",
            key: "reminderTime",
            message: "Invalid time format",
          });
        }

        // 验证提醒天数
        if (
          !state.userPreferences.notifications.reminderDays.every(
            (day) => day >= 0 && day <= 6,
          )
        ) {
          errors.push({
            category: "notifications",
            key: "reminderDays",
            message: "Invalid reminder days",
          });
        }

        // 验证文本缩放
        if (
          state.userPreferences.accessibility.textScaling < 0.8 ||
          state.userPreferences.accessibility.textScaling > 2.0
        ) {
          errors.push({
            category: "accessibility",
            key: "textScaling",
            message: "Invalid text scaling",
          });
        }

        return {
          isValid: errors.length === 0,
          errors,
          warnings,
        };
      },

      resetPreferences: () =>
        set(() => ({
          userPreferences: DEFAULT_USER_PREFERENCES,
        })),

      // Day 11: 导出模板相关Actions
      addExportTemplate: (template) => {
        const newTemplate: ExportTemplate = {
          ...template,
          id: `template_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          exportTemplates: [...state.exportTemplates, newTemplate],
        }));
      },

      updateExportTemplate: (id, updates) =>
        set((state) => ({
          exportTemplates: state.exportTemplates.map((template) =>
            template.id === id
              ? { ...template, ...updates, updatedAt: new Date().toISOString() }
              : template,
          ),
        })),

      deleteExportTemplate: (id) =>
        set((state) => ({
          exportTemplates: state.exportTemplates.filter(
            (template) => template.id !== id,
          ),
          activeTemplate:
            state.activeTemplate?.id === id ? null : state.activeTemplate,
        })),

      setActiveTemplate: (template) => set({ activeTemplate: template }),

      loadTemplate: (id) => {
        const state = get();
        const template = state.exportTemplates.find((t) => t.id === id);
        if (template) {
          set({ activeTemplate: template });
        }
      },

      duplicateTemplate: (id) => {
        const state = get();
        const template = state.exportTemplates.find((t) => t.id === id);
        if (template) {
          const newTemplate: Omit<
            ExportTemplate,
            "id" | "createdAt" | "updatedAt"
          > = {
            name: `${template.name} (Copy)`,
            description: template.description,
            exportType: template.exportType,
            format: template.format,
            fields: template.fields,
            dateRange: template.dateRange,
            filters: template.filters,
            isDefault: false,
          };
          get().addExportTemplate(newTemplate);
        }
      },

      // Day 11: 批量导出相关Actions
      createBatchExport: (items) => {
        const batchItems: BatchExportItem[] = items.map((item) => ({
          ...item,
          id: `batch_item_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          status: "pending" as const,
          progress: 0,
          createdAt: new Date().toISOString(),
        }));

        const batchQueue: BatchExportQueue = {
          id: `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: `Batch Export ${new Date().toLocaleDateString()}`,
          items: batchItems,
          status: "idle",
          totalItems: batchItems.length,
          completedItems: 0,
          failedItems: 0,
          createdAt: new Date().toISOString(),
        };

        set({ batchExportQueue: batchQueue });
      },

      updateBatchItemStatus: (itemId, status, progress = 0, error) => {
        set((state) => {
          if (!state.batchExportQueue) return state;

          const updatedItems = state.batchExportQueue.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  status,
                  progress,
                  error,
                  completedAt:
                    status === "completed"
                      ? new Date().toISOString()
                      : undefined,
                }
              : item,
          );

          const completedItems = updatedItems.filter(
            (item) => item.status === "completed",
          ).length;
          const failedItems = updatedItems.filter(
            (item) => item.status === "failed",
          ).length;

          return {
            batchExportQueue: {
              ...state.batchExportQueue,
              items: updatedItems,
              completedItems,
              failedItems,
              status:
                status === "completed" || status === "failed"
                  ? status
                  : "running",
            },
          };
        });
      },

      cancelBatchExport: () =>
        set((state) => ({
          batchExportQueue: state.batchExportQueue
            ? {
                ...state.batchExportQueue,
                status: "cancelled",
              }
            : null,
        })),

      retryFailedItems: () =>
        set((state) => {
          if (!state.batchExportQueue) return state;

          const updatedItems = state.batchExportQueue.items.map((item) =>
            item.status === "failed"
              ? {
                  ...item,
                  status: "pending" as const,
                  progress: 0,
                  error: undefined,
                }
              : item,
          );

          return {
            batchExportQueue: {
              ...state.batchExportQueue,
              items: updatedItems,
              status: "idle",
              failedItems: 0,
            },
          };
        }),

      clearBatchExport: () => set({ batchExportQueue: null }),

      // Day 11: 导出历史相关Actions
      addExportHistory: (history) => {
        const newHistory: ExportHistory = {
          ...history,
          id: `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          exportHistory: [newHistory, ...state.exportHistory].slice(0, 100), // 保留最近100条记录
        }));
      },

      clearExportHistory: () => set({ exportHistory: [] }),

      deleteExportHistory: (id) =>
        set((state) => ({
          exportHistory: state.exportHistory.filter(
            (history) => history.id !== id,
          ),
        })),

      // Day 11: 系统设置相关Actions
      updateSystemSettings: (updates) =>
        set((state) => ({
          systemSettings: { ...state.systemSettings, ...updates },
        })),

      resetSystemSettings: () =>
        set({ systemSettings: DEFAULT_SYSTEM_SETTINGS }),

      // Day 11: 偏好设置变更追踪
      addPreferenceChange: (change) => {
        // 这里可以扩展为存储到历史记录中
        // eslint-disable-next-line no-console
        console.log("Preference change:", change);
      },

      getPreferenceHistory: () => {
        // 这里可以返回偏好设置变更历史
        return [];
      },

      clearPreferenceHistory: () => {
        // 清除偏好设置变更历史
      },
      
      // 推荐反馈 Actions
      addRecommendationFeedback: (feedback) => {
        const newFeedback: RecommendationFeedback = {
          ...feedback,
          timestamp: new Date().toISOString(),
        };
        
        set((state) => {
          const newState = {
            ...state.recommendationFeedback,
            feedbacks: [...state.recommendationFeedback.feedbacks, newFeedback],
          };
          
          // 更新忽略列表
          if (feedback.action === 'dismissed') {
            newState.ignoredItems = [
              ...state.recommendationFeedback.ignoredItems,
              feedback.recommendationId,
            ];
          }
          
          // 更新收藏列表
          if (feedback.action === 'saved') {
            newState.savedItems = [
              ...state.recommendationFeedback.savedItems,
              feedback.recommendationId,
            ];
          }
          
          // 更新评分
          if (feedback.rating) {
            const existingRating = state.recommendationFeedback.itemRatings[feedback.recommendationId];
            newState.itemRatings = {
              ...state.recommendationFeedback.itemRatings,
              [feedback.recommendationId]: existingRating 
                ? (existingRating + feedback.rating) / 2 
                : feedback.rating,
            };
          }
          
          return { recommendationFeedback: newState };
        });
      },
      
      clearIgnoredItem: (id) => {
        set((state) => ({
          recommendationFeedback: {
            ...state.recommendationFeedback,
            ignoredItems: state.recommendationFeedback.ignoredItems.filter(i => i !== id),
          },
        }));
      },
      
      clearAllIgnored: () => {
        set((state) => ({
          recommendationFeedback: {
            ...state.recommendationFeedback,
            ignoredItems: [],
          },
        }));
      },
      
      getFeedbackHistory: () => {
        return get().recommendationFeedback;
      },

      // 工具方法
      resetState: () => set(initialState),

      getStateSnapshot: () => {
        const state = get();
        return {
          activeTab: state.activeTab,
          calendar: state.calendar,
          workImpact: state.workImpact,
          nutrition: state.nutrition,
          export: state.export,
          // Day 11: 扩展状态快照
          userPreferences: state.userPreferences,
          exportTemplates: state.exportTemplates,
          activeTemplate: state.activeTemplate,
          batchExportQueue: state.batchExportQueue,
          exportHistory: state.exportHistory,
          systemSettings: state.systemSettings,
        };
      },
    }),
    {
      name: "workplace-wellness-storage",
      // 添加SSR安全配置
      skipHydration: false,
      // 自定义存储适配器，添加错误处理、降级、智能清理和防抖保存
      storage: createJSONStorage(() => {
        // 错误标志键（使用 sessionStorage 避免循环）
        const ERROR_FLAG_KEY = 'workplace-wellness-storage-error';
        const FAILURE_COUNT_KEY = 'workplace-wellness-storage-failures';
        const MAX_FAILURES = 3;

        // 防抖保存：减少保存频率
        let saveTimer: NodeJS.Timeout | null = null;
        let pendingValue: string | null = null;
        const DEBOUNCE_DELAY = 500; // 500ms 防抖延迟

        // 关键数据键（需要立即保存）
        const CRITICAL_KEYS = ['userPreferences', 'systemSettings'];
        
        // 判断是否为关键数据
        const isCriticalData = (data: string): boolean => {
          try {
            const parsed = JSON.parse(data);
            const state = parsed?.state || {};
            // 检查是否包含关键数据的变化
            return CRITICAL_KEYS.some(key => state.hasOwnProperty(key));
          } catch {
            return false;
          }
        };

        // 检查错误标志
        const checkErrorFlag = (): boolean => {
          try {
            return sessionStorage.getItem(ERROR_FLAG_KEY) === 'disabled';
          } catch {
            return false;
          }
        };

        // 增加失败计数
        const incrementFailureCount = (): number => {
          try {
            const count = parseInt(sessionStorage.getItem(FAILURE_COUNT_KEY) || '0', 10) + 1;
            sessionStorage.setItem(FAILURE_COUNT_KEY, count.toString());
            if (count >= MAX_FAILURES) {
              sessionStorage.setItem(ERROR_FLAG_KEY, 'disabled');
            }
            return count;
          } catch {
            return MAX_FAILURES;
          }
        };

        // 重置失败计数
        const resetFailureCount = (): void => {
          try {
            sessionStorage.removeItem(FAILURE_COUNT_KEY);
            sessionStorage.removeItem(ERROR_FLAG_KEY);
          } catch {
            // 忽略错误
          }
        };

        // 智能清理：清理所有相关键和临时数据
        const aggressiveCleanup = (targetKey: string): boolean => {
          try {
            // 1. 清理所有以 'workplace-wellness-' 开头的键
            const keysToRemove: string[] = [];
            for (let i = localStorage.length - 1; i >= 0; i--) {
              const key = localStorage.key(i);
              if (key && key.startsWith('workplace-wellness-')) {
                keysToRemove.push(key);
              }
            }
            keysToRemove.forEach(key => {
              try {
                localStorage.removeItem(key);
              } catch {
                // 忽略错误
              }
            });

            // 2. 清理临时数据（_temp, _cache 后缀）
            const tempKeys: string[] = [];
            for (let i = localStorage.length - 1; i >= 0; i--) {
              const key = localStorage.key(i);
              if (key && (key.includes('_temp') || key.includes('_cache'))) {
                tempKeys.push(key);
              }
            }
            tempKeys.forEach(key => {
              try {
                localStorage.removeItem(key);
              } catch {
                // 忽略错误
              }
            });

            return true;
          } catch {
            return false;
          }
        };

        // 清理并优化数据
        const cleanAndOptimizeData = (data: any): any => {
          if (!data?.state) return data;

          // 清理 periodData：只保留最近 3 个月
          if (data.state.calendar?.periodData) {
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            
            data.state.calendar.periodData = data.state.calendar.periodData
              .filter((r: any) => {
                try {
                  const recordDate = new Date(r.date);
                  return recordDate >= threeMonthsAgo;
                } catch {
                  return false;
                }
              })
              .sort((a: any, b: any) => 
                new Date(b.date).getTime() - new Date(a.date).getTime()
              );
          }

          // 清理 exportHistory：只保留最近 20 条
          if (data.state.exportHistory) {
            data.state.exportHistory = data.state.exportHistory
              .slice(-20)
              .sort((a: any, b: any) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
          }

          return data;
        };

        // 创建自定义存储对象
        const customStorage: Storage = {
          ...localStorage,
          getItem: (key: string): string | null => {
            try {
              return localStorage.getItem(key);
            } catch {
              return null;
            }
          },
          setItem: (name: string, value: string): void => {
            // 检查错误标志
            if (checkErrorFlag()) {
              // 已禁用，尝试降级到 sessionStorage
              try {
                sessionStorage.setItem(name, value);
                return;
              } catch {
                // sessionStorage 也失败，放弃保存
                return;
              }
            }

            // 判断是否为关键数据
            const critical = isCriticalData(value);
            
            // 处理保存错误
            const handleSaveError = (saveName: string, saveValue: string, saveError: unknown): void => {
              // 处理配额超出错误
              if (
                saveError instanceof DOMException &&
                (saveError.code === 22 || saveError.name === "QuotaExceededError")
              ) {
                const failureCount = incrementFailureCount();
                
                // 如果失败次数过多，禁用持久化
                if (failureCount >= MAX_FAILURES) {
                  console.warn("Storage disabled after multiple failures, using sessionStorage");
                  try {
                    sessionStorage.setItem(saveName, saveValue);
                    return;
                  } catch {
                    return;
                  }
                }

                // 尝试智能清理
                aggressiveCleanup(saveName);

                // 尝试清理并优化现有数据
                try {
                  const existingData = localStorage.getItem(saveName);
                  if (existingData) {
                    let parsed: any;
                    try {
                      parsed = JSON.parse(existingData);
                    } catch {
                      // 数据损坏，删除
                      localStorage.removeItem(saveName);
                      // 尝试降级到 sessionStorage
                      try {
                        sessionStorage.setItem(saveName, saveValue);
                        return;
                      } catch {
                        return;
                      }
                    }

                    // 清理并优化数据
                    const cleaned = cleanAndOptimizeData(parsed);
                    const cleanedData = JSON.stringify(cleaned);

                    try {
                      localStorage.setItem(saveName, cleanedData);
                      resetFailureCount();
                      return;
                    } catch {
                      // 继续尝试其他方案
                    }
                  }
                } catch {
                  // 继续尝试其他方案
                }

                // 尝试保存最小数据集
                try {
                  localStorage.removeItem(saveName);
                  const minimalData = {
                    state: {
                      activeTab: "assessment",
                      calendar: {
                        currentDate: new Date().toISOString(),
                        selectedDate: null,
                        showAddForm: false,
                        periodData: [],
                      },
                    },
                  };
                  localStorage.setItem(saveName, JSON.stringify(minimalData));
                  resetFailureCount();
                  return;
                } catch {
                  // 最后尝试：降级到 sessionStorage
                  try {
                    sessionStorage.setItem(saveName, saveValue);
                    return;
                  } catch {
                    // 完全失败，放弃保存
                    return;
                  }
                }
              } else {
                console.error("Failed to set item in localStorage:", saveError);
              }
            };

            // 关键数据立即保存，非关键数据防抖保存
            const performSave = () => {
              const valueToSave = pendingValue || value;
              try {
                localStorage.setItem(name, valueToSave);
                // 成功保存，重置失败计数
                resetFailureCount();
                pendingValue = null;
              } catch (error) {
                // 处理保存错误
                handleSaveError(name, valueToSave, error);
              }
            };

            // 如果是关键数据，立即保存
            if (critical) {
              // 清除待保存的数据
              if (saveTimer) {
                clearTimeout(saveTimer);
                saveTimer = null;
              }
              pendingValue = null;
              performSave();
              return;
            }

            // 非关键数据：防抖保存
            pendingValue = value;
            if (saveTimer) {
              clearTimeout(saveTimer);
            }
            saveTimer = setTimeout(() => {
              performSave();
              saveTimer = null;
            }, DEBOUNCE_DELAY);
          },
          removeItem: (key: string): void => {
            try {
              localStorage.removeItem(key);
            } catch {
              // 忽略错误
            }
          },
          clear: (): void => {
            try {
              localStorage.clear();
            } catch {
              // 忽略错误
            }
          },
          get length(): number {
            try {
              return localStorage.length;
            } catch {
              return 0;
            }
          },
          key: (index: number): string | null => {
            try {
              return localStorage.key(index);
            } catch {
              return null;
            }
          },
        } as Storage;
        return customStorage;
      }),
      // 部分持久化：只持久化关键数据，减少存储大小
      // 分层存储：关键数据用 localStorage，会话数据用 sessionStorage
      partialize: (state) => {
        // 清理 periodData：只保留最近 6 个月的记录（更激进）
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const cleanedPeriodData = state.calendar.periodData
          .filter((r) => {
            try {
              const recordDate = new Date(r.date);
              return recordDate >= sixMonthsAgo;
            } catch {
              return false; // 无效日期，删除
            }
          })
          .sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );

        // 限制 exportHistory 数量（只保留最近 20 条）
        const limitedExportHistory = state.exportHistory
          .slice(-20)
          .sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        // 关键数据：持久化到 localStorage
        // 非关键数据：不持久化或使用 sessionStorage
        return {
          // 关键数据（必须持久化）
          activeTab: state.activeTab,
          userPreferences: state.userPreferences,
          systemSettings: state.systemSettings,
          exportTemplates: state.exportTemplates,
          activeTemplate: state.activeTemplate,
          
          // 重要数据（持久化但限制大小）
          calendar: {
            ...state.calendar,
            periodData: cleanedPeriodData,
          },
          workImpact: state.workImpact,
          nutrition: state.nutrition,
          export: {
            ...state.export,
            // 不持久化 isExporting（临时状态）
            isExporting: false,
          },
          exportHistory: limitedExportHistory,
          
          // 不持久化 batchExportQueue（临时数据，只在内存中）
        };
      },
      // 数据迁移：清理旧数据
      onRehydrateStorage: () => (state) => {
        if (state) {
          // 清理 periodData：只保留最近 6 个月
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          
          const cleanedPeriodData = state.calendar.periodData
            .filter((r) => {
              try {
                const recordDate = new Date(r.date);
                return recordDate >= sixMonthsAgo;
              } catch {
                return false; // 无效日期，删除
              }
            })
            .sort((a, b) => 
              new Date(b.date).getTime() - new Date(a.date).getTime()
            );

          // 限制 exportHistory：只保留最近 20 条
          const limitedExportHistory = state.exportHistory
            .slice(-20)
            .sort((a, b) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

          // 更新状态
          state.calendar.periodData = cleanedPeriodData;
          state.exportHistory = limitedExportHistory;
        }
      },
    },
  ),
);

// 选择器Hooks - 基于HVsLYEp的状态结构
export const useActiveTab = () =>
  useWorkplaceWellnessStore((state) => state.activeTab);
export const useCalendar = () =>
  useWorkplaceWellnessStore((state) => state.calendar);
export const useWorkImpact = () =>
  useWorkplaceWellnessStore((state) => state.workImpact);
export const useNutrition = () =>
  useWorkplaceWellnessStore((state) => state.nutrition);
export const useExport = () =>
  useWorkplaceWellnessStore((state) => state.export);

// Day 11: 新增选择器Hooks
export const useUserPreferences = () =>
  useWorkplaceWellnessStore((state) => state.userPreferences);
export const useExportTemplates = () =>
  useWorkplaceWellnessStore((state) => state.exportTemplates);
export const useActiveTemplate = () =>
  useWorkplaceWellnessStore((state) => state.activeTemplate);
export const useBatchExportQueue = () =>
  useWorkplaceWellnessStore((state) => state.batchExportQueue);
export const useExportHistory = () =>
  useWorkplaceWellnessStore((state) => state.exportHistory);
export const useSystemSettings = () =>
  useWorkplaceWellnessStore((state) => state.systemSettings);

// Actions Hooks - 使用独立的store调用避免无限循环
export const useWorkplaceWellnessActions = () => {
  const setActiveTab = useWorkplaceWellnessStore((state) => state.setActiveTab);
  const updateCalendar = useWorkplaceWellnessStore(
    (state) => state.updateCalendar,
  );
  const setCurrentDate = useWorkplaceWellnessStore(
    (state) => state.setCurrentDate,
  );
  const addPeriodRecord = useWorkplaceWellnessStore(
    (state) => state.addPeriodRecord,
  );
  const updatePeriodRecord = useWorkplaceWellnessStore(
    (state) => state.updatePeriodRecord,
  );
  const deletePeriodRecord = useWorkplaceWellnessStore(
    (state) => state.deletePeriodRecord,
  );
  const updateWorkImpact = useWorkplaceWellnessStore(
    (state) => state.updateWorkImpact,
  );
  const selectTemplate = useWorkplaceWellnessStore(
    (state) => state.selectTemplate,
  );
  const updateNutrition = useWorkplaceWellnessStore(
    (state) => state.updateNutrition,
  );
  const updateExport = useWorkplaceWellnessStore((state) => state.updateExport);
  const setExporting = useWorkplaceWellnessStore((state) => state.setExporting);
  const resetState = useWorkplaceWellnessStore((state) => state.resetState);

  return {
    setActiveTab,
    updateCalendar,
    setCurrentDate,
    addPeriodRecord,
    updatePeriodRecord,
    deletePeriodRecord,
    updateWorkImpact,
    selectTemplate,
    updateNutrition,
    updateExport,
    setExporting,
    resetState,
  };
};

// Day 11: 用户偏好设置Actions Hook
export const useUserPreferencesActions = () => {
  const updateUserPreferences = useWorkplaceWellnessStore(
    (state) => state.updateUserPreferences,
  );
  const setTheme = useWorkplaceWellnessStore((state) => state.setTheme);
  const setFontSize = useWorkplaceWellnessStore((state) => state.setFontSize);
  const toggleAnimations = useWorkplaceWellnessStore(
    (state) => state.toggleAnimations,
  );
  const toggleCompactMode = useWorkplaceWellnessStore(
    (state) => state.toggleCompactMode,
  );
  const updateNotificationSettings = useWorkplaceWellnessStore(
    (state) => state.updateNotificationSettings,
  );
  const updatePrivacySettings = useWorkplaceWellnessStore(
    (state) => state.updatePrivacySettings,
  );
  const updateAccessibilitySettings = useWorkplaceWellnessStore(
    (state) => state.updateAccessibilitySettings,
  );
  const validateSettings = useWorkplaceWellnessStore(
    (state) => state.validateSettings,
  );
  const resetPreferences = useWorkplaceWellnessStore(
    (state) => state.resetPreferences,
  );

  return {
    updateUserPreferences,
    setTheme,
    setFontSize,
    toggleAnimations,
    toggleCompactMode,
    updateNotificationSettings,
    updatePrivacySettings,
    updateAccessibilitySettings,
    validateSettings,
    resetPreferences,
  };
};

// Day 11: 导出模板Actions Hook
export const useExportTemplateActions = () => {
  const addExportTemplate = useWorkplaceWellnessStore(
    (state) => state.addExportTemplate,
  );
  const updateExportTemplate = useWorkplaceWellnessStore(
    (state) => state.updateExportTemplate,
  );
  const deleteExportTemplate = useWorkplaceWellnessStore(
    (state) => state.deleteExportTemplate,
  );
  const setActiveTemplate = useWorkplaceWellnessStore(
    (state) => state.setActiveTemplate,
  );
  const loadTemplate = useWorkplaceWellnessStore((state) => state.loadTemplate);
  const duplicateTemplate = useWorkplaceWellnessStore(
    (state) => state.duplicateTemplate,
  );

  return {
    addExportTemplate,
    updateExportTemplate,
    deleteExportTemplate,
    setActiveTemplate,
    loadTemplate,
    duplicateTemplate,
  };
};

// Day 11: 批量导出Actions Hook
export const useBatchExportActions = () => {
  const createBatchExport = useWorkplaceWellnessStore(
    (state) => state.createBatchExport,
  );
  const updateBatchItemStatus = useWorkplaceWellnessStore(
    (state) => state.updateBatchItemStatus,
  );
  const cancelBatchExport = useWorkplaceWellnessStore(
    (state) => state.cancelBatchExport,
  );
  const retryFailedItems = useWorkplaceWellnessStore(
    (state) => state.retryFailedItems,
  );
  const clearBatchExport = useWorkplaceWellnessStore(
    (state) => state.clearBatchExport,
  );

  return {
    createBatchExport,
    updateBatchItemStatus,
    cancelBatchExport,
    retryFailedItems,
    clearBatchExport,
  };
};

// Day 11: 导出历史Actions Hook
export const useExportHistoryActions = () => {
  const addExportHistory = useWorkplaceWellnessStore(
    (state) => state.addExportHistory,
  );
  const clearExportHistory = useWorkplaceWellnessStore(
    (state) => state.clearExportHistory,
  );
  const deleteExportHistory = useWorkplaceWellnessStore(
    (state) => state.deleteExportHistory,
  );

  return {
    addExportHistory,
    clearExportHistory,
    deleteExportHistory,
  };
};

// Day 11: 系统设置Actions Hook
export const useSystemSettingsActions = () => {
  const updateSystemSettings = useWorkplaceWellnessStore(
    (state) => state.updateSystemSettings,
  );
  const resetSystemSettings = useWorkplaceWellnessStore(
    (state) => state.resetSystemSettings,
  );

  return {
    updateSystemSettings,
    resetSystemSettings,
  };
};

// 推荐反馈 Actions Hook
export const useRecommendationFeedbackActions = () => {
  const addRecommendationFeedback = useWorkplaceWellnessStore(
    (state) => state.addRecommendationFeedback,
  );
  const clearIgnoredItem = useWorkplaceWellnessStore(
    (state) => state.clearIgnoredItem,
  );
  const clearAllIgnored = useWorkplaceWellnessStore(
    (state) => state.clearAllIgnored,
  );
  const getFeedbackHistory = useWorkplaceWellnessStore(
    (state) => state.getFeedbackHistory,
  );

  return {
    addRecommendationFeedback,
    clearIgnoredItem,
    clearAllIgnored,
    getFeedbackHistory,
  };
};
