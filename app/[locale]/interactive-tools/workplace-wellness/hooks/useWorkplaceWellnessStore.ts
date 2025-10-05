/**
 * HVsLYEp职场健康助手 - Zustand状态管理
 * 基于HVsLYEp的appState结构设计
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  WorkplaceWellnessState,
  CalendarState,
  WorkImpactData,
  NutritionData,
  ExportConfig,
  PeriodRecord,
  LeaveTemplate,
  NutritionRecommendation,
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
  ExtendedExportFormat,
  Theme,
  FontSize,
  DateFormat,
  TimeFormat,
  NotificationType,
  NotificationChannel,
  SettingsValidationResult,
  PreferenceChange,
} from "../types";

// Day 11: 导入默认值
import {
  DEFAULT_USER_PREFERENCES,
  DEFAULT_EXPORT_TEMPLATES,
  DEFAULT_SYSTEM_SETTINGS,
} from "../types/defaults";

// 扩展状态接口，添加Actions
interface WorkplaceWellnessStore extends WorkplaceWellnessState {
  // 标签页相关Actions
  setActiveTab: (tab: "calendar" | "nutrition" | "export" | "settings") => void;

  // 日历相关Actions
  updateCalendar: (updates: Partial<CalendarState>) => void;
  setCurrentDate: (date: Date) => void;
  setSelectedDate: (date: Date | null) => void;
  toggleAddForm: () => void;

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
}

// 初始状态 - 基于HVsLYEp的appState
const initialState: WorkplaceWellnessState = {
  activeTab: "calendar",
  calendar: {
    currentDate: new Date(),
    selectedDate: null,
    showAddForm: false,
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

      // 工作影响相关Actions
      updateWorkImpact: (updates) =>
        set((state) => ({
          workImpact: { ...state.workImpact, ...updates },
        })),

      setPainLevel: (level) =>
        set((state) => ({
          workImpact: {
            ...state.workImpact,
            painLevel: level as any, // 临时类型断言
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
        set((state) => ({
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
        console.log("Preference change:", change);
      },

      getPreferenceHistory: () => {
        // 这里可以返回偏好设置变更历史
        return [];
      },

      clearPreferenceHistory: () => {
        // 清除偏好设置变更历史
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
      partialize: (state) => ({
        activeTab: state.activeTab,
        calendar: {
          ...state.calendar,
          currentDate: state.calendar.currentDate.toISOString(),
          selectedDate: state.calendar.selectedDate?.toISOString() || null,
        },
        workImpact: state.workImpact,
        nutrition: state.nutrition,
        export: state.export,
        // Day 11: 扩展持久化状态
        userPreferences: state.userPreferences,
        exportTemplates: state.exportTemplates,
        activeTemplate: state.activeTemplate,
        exportHistory: state.exportHistory,
        systemSettings: state.systemSettings,
      }),
      // 添加SSR安全配置
      skipHydration: false,
      onRehydrateStorage: () => (state) => {
        if (state) {
          // 确保 Date 对象正确反序列化
          if (
            state.calendar.currentDate &&
            typeof state.calendar.currentDate === "string"
          ) {
            state.calendar.currentDate = new Date(state.calendar.currentDate);
          }
          if (
            state.calendar.selectedDate &&
            typeof state.calendar.selectedDate === "string"
          ) {
            state.calendar.selectedDate = new Date(state.calendar.selectedDate);
          }
          console.log("Workplace Wellness Store rehydrated successfully");
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
