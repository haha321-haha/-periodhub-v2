/**
 * HVsLYEp职场健康助手 - Zustand状态管理
 * 基于HVsLYEp的appState结构设计
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  WorkplaceWellnessState, 
  Language, 
  CalendarState, 
  WorkImpactData, 
  NutritionData, 
  ExportConfig,
  PeriodRecord,
  LeaveTemplate,
  NutritionRecommendation
} from '../types';

// 扩展状态接口，添加Actions
interface WorkplaceWellnessStore extends WorkplaceWellnessState {
  // 语言相关Actions
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  
  // 标签页相关Actions
  setActiveTab: (tab: 'calendar' | 'nutrition' | 'export') => void;
  
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
  setExporting: (isExporting: boolean) => void;
  
  // 数据相关Actions
  addPeriodRecord: (record: PeriodRecord) => void;
  updatePeriodRecord: (date: string, updates: Partial<PeriodRecord>) => void;
  removePeriodRecord: (date: string) => void;
  
  // 工具方法
  resetState: () => void;
  getStateSnapshot: () => WorkplaceWellnessState;
}

// 初始状态 - 基于HVsLYEp的appState
const initialState: WorkplaceWellnessState = {
  lang: 'zh',
  activeTab: 'calendar',
  calendar: {
    currentDate: new Date(),
    selectedDate: null,
    showAddForm: false,
  },
  workImpact: {
    painLevel: 5,
    efficiency: 70,
    selectedTemplateId: null,
  },
  nutrition: {
    selectedPhase: 'menstrual',
    constitutionType: 'qi_deficiency',
    searchTerm: '',
  },
  export: {
    exportType: 'period',
    format: 'json',
    isExporting: false,
  }
};

// 创建Zustand Store - 暂时禁用persist以避免SSR问题
export const useWorkplaceWellnessStore = create<WorkplaceWellnessStore>()((set, get) => ({
  // 初始状态
  ...initialState,

  // 语言相关Actions
  setLanguage: (lang: Language) => set({ lang }),
  
  toggleLanguage: () => set((state) => ({ 
    lang: state.lang === 'zh' ? 'en' : 'zh' 
  })),

  // 标签页相关Actions
  setActiveTab: (tab) => set({ activeTab: tab }),

  // 日历相关Actions
  updateCalendar: (updates) => set((state) => ({
    calendar: { ...state.calendar, ...updates }
  })),
  
  setCurrentDate: (date) => set((state) => ({
    calendar: { ...state.calendar, currentDate: date }
  })),
  
  setSelectedDate: (date) => set((state) => ({
    calendar: { ...state.calendar, selectedDate: date }
  })),
  
  toggleAddForm: () => set((state) => ({
    calendar: { 
      ...state.calendar, 
      showAddForm: !state.calendar.showAddForm 
    }
  })),

  // 工作影响相关Actions
  updateWorkImpact: (updates) => set((state) => ({
    workImpact: { ...state.workImpact, ...updates }
  })),
  
  setPainLevel: (level) => set((state) => ({
    workImpact: { ...state.workImpact, painLevel: level as any }
  })),
  
  setEfficiency: (efficiency) => set((state) => ({
    workImpact: { ...state.workImpact, efficiency }
  })),
  
  selectTemplate: (templateId) => set((state) => ({
    workImpact: { ...state.workImpact, selectedTemplateId: templateId }
  })),

  // 营养相关Actions
  updateNutrition: (updates) => set((state) => ({
    nutrition: { ...state.nutrition, ...updates }
  })),
  
  setSelectedPhase: (phase) => set((state) => ({
    nutrition: { ...state.nutrition, selectedPhase: phase as any }
  })),
  
  setConstitutionType: (type) => set((state) => ({
    nutrition: { ...state.nutrition, constitutionType: type as any }
  })),
  
  setSearchTerm: (term) => set((state) => ({
    nutrition: { ...state.nutrition, searchTerm: term }
  })),

  // 导出相关Actions
  updateExport: (updates) => set((state) => ({
    export: { ...state.export, ...updates }
  })),
  
  setExportType: (type) => set((state) => ({
    export: { ...state.export, exportType: type as any }
  })),
  
  setExportFormat: (format) => set((state) => ({
    export: { ...state.export, format: format as any }
  })),
  
  setExporting: (isExporting) => set((state) => ({
    export: { ...state.export, isExporting }
  })),

  // 数据相关Actions
  addPeriodRecord: (record) => {
    // 这里可以添加数据持久化逻辑
    console.log('Adding period record:', record);
  },
  
  updatePeriodRecord: (date, updates) => {
    // 这里可以添加数据更新逻辑
    console.log('Updating period record:', date, updates);
  },
  
  removePeriodRecord: (date) => {
    // 这里可以添加数据删除逻辑
    console.log('Removing period record:', date);
  },

  // 工具方法
  resetState: () => set(initialState),
  
  getStateSnapshot: () => {
    const state = get();
    return {
      lang: state.lang,
      activeTab: state.activeTab,
      calendar: state.calendar,
      workImpact: state.workImpact,
      nutrition: state.nutrition,
      export: state.export
    };
  },
}));

// 选择器Hooks - 基于HVsLYEp的状态结构
export const useLanguage = () => useWorkplaceWellnessStore((state) => state.lang);
export const useActiveTab = () => useWorkplaceWellnessStore((state) => state.activeTab);
export const useCalendar = () => useWorkplaceWellnessStore((state) => state.calendar);
export const useWorkImpact = () => useWorkplaceWellnessStore((state) => state.workImpact);
export const useNutrition = () => useWorkplaceWellnessStore((state) => state.nutrition);
export const useExport = () => useWorkplaceWellnessStore((state) => state.export);

// Actions Hooks
export const useWorkplaceWellnessActions = () => useWorkplaceWellnessStore((state) => ({
  setLanguage: state.setLanguage,
  toggleLanguage: state.toggleLanguage,
  setActiveTab: state.setActiveTab,
  updateCalendar: state.updateCalendar,
  setCurrentDate: state.setCurrentDate,
  updateWorkImpact: state.updateWorkImpact,
  selectTemplate: state.selectTemplate,
  updateNutrition: state.updateNutrition,
  updateExport: state.updateExport,
  setExporting: state.setExporting,
  resetState: state.resetState,
}));
