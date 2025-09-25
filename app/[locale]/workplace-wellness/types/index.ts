/**
 * HVsLYEp职场健康助手 - TypeScript类型定义
 * 基于HVsLYEp现有结构设计，不重复造轮子
 */

// 基础类型定义
export type Language = 'zh' | 'en';

// 月经阶段类型
export type MenstrualPhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

// 中医体质类型
export type TCMConstitution = 'qi_deficiency' | 'yang_deficiency' | 'yin_deficiency' | 'blood_deficiency' | 'balanced';

// 经期类型
export type PeriodType = 'period' | 'predicted' | 'ovulation';

// 流量类型
export type FlowType = 'light' | 'medium' | 'heavy';

// 疼痛程度类型
export type PainLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

// 工作调整类型
export type WorkAdjustment = 'leave' | 'workFromHome' | 'postponeMeeting' | 'reduceTasks';

// 请假模板严重程度
export type SeverityLevel = 'mild' | 'moderate' | 'severe';

// 导出格式类型
export type ExportFormat = 'json' | 'csv' | 'pdf';

// 导出类型
export type ExportType = 'period' | 'nutrition' | 'all';

// 中医性质类型
export type TCMNature = 'warm' | 'cool' | 'neutral';

// 多语言文本接口
export interface LocalizedText {
  zh: string;
  en: string;
}

// 经期记录接口
export interface PeriodRecord {
  date: string;
  type: PeriodType;
  painLevel: PainLevel | null;
  flow: FlowType | null;
}

// 工作影响数据接口
export interface WorkImpactData {
  painLevel: PainLevel;
  efficiency: number;
  selectedTemplateId: number | null;
}

// 营养数据接口
export interface NutritionData {
  selectedPhase: MenstrualPhase;
  constitutionType: TCMConstitution;
  searchTerm: string;
}

// 营养建议接口
export interface NutritionRecommendation {
  name: string;
  benefits: string[];
  phase: MenstrualPhase;
  tcmNature: TCMNature;
  nutrients: string[];
}

// 请假模板接口
export interface LeaveTemplate {
  id: number;
  title: string;
  severity: SeverityLevel;
  subject: string;
  content: string;
}

// 导出配置接口
export interface ExportConfig {
  exportType: ExportType;
  format: ExportFormat;
  isExporting: boolean;
}

// 日历状态接口
export interface CalendarState {
  currentDate: Date;
  selectedDate: Date | null;
  showAddForm: boolean;
}

// 应用状态接口 - 基于HVsLYEp的appState结构
export interface WorkplaceWellnessState {
  lang: Language;
  activeTab: 'calendar' | 'nutrition' | 'export';
  calendar: CalendarState;
  workImpact: WorkImpactData;
  nutrition: NutritionData;
  export: ExportConfig;
}

// 翻译函数类型
export type TranslationFunction = (key: string) => string;

// 状态更新函数类型
export type UpdateStateFunction = (updates: Partial<WorkplaceWellnessState>) => void;

// 组件Props接口
export interface WorkplaceWellnessProps {
  initialLanguage?: Language;
  onStateChange?: (state: WorkplaceWellnessState) => void;
}

// 日历组件Props
export interface CalendarProps {
  state: CalendarState;
  periodData: PeriodRecord[];
  t: TranslationFunction;
  updateState: UpdateStateFunction;
}

// 工作影响组件Props
export interface WorkImpactProps {
  state: WorkImpactData;
  templates: LeaveTemplate[];
  t: TranslationFunction;
  updateState: UpdateStateFunction;
}

// 营养建议组件Props
export interface NutritionProps {
  state: NutritionData;
  nutritionData: Record<Language, NutritionRecommendation[]>;
  t: TranslationFunction;
  updateState: UpdateStateFunction;
}

// 数据导出组件Props
export interface DataExportProps {
  state: ExportConfig;
  periodData: PeriodRecord[];
  nutritionData: Record<Language, NutritionRecommendation[]>;
  t: TranslationFunction;
  updateState: UpdateStateFunction;
}

// 导航组件Props
export interface NavigationProps {
  activeTab: string;
  t: TranslationFunction;
  onTabChange: (tab: string) => void;
}

// 头部组件Props
export interface HeaderProps {
  t: TranslationFunction;
  currentLanguage: Language;
  onLanguageToggle: () => void;
}

// 错误类型
export type WorkplaceWellnessError = 
  | 'DATA_LOAD_ERROR'
  | 'EXPORT_ERROR'
  | 'VALIDATION_ERROR'
  | 'NETWORK_ERROR';

// 错误信息接口
export interface ErrorInfo {
  type: WorkplaceWellnessError;
  message: string;
  details?: string;
}

// 配置接口
export interface WorkplaceWellnessConfig {
  defaultLanguage: Language;
  enableLocalStorage: boolean;
  enableAnalytics: boolean;
  maxPainLevel: number;
  minEfficiency: number;
  maxEfficiency: number;
}

// 所有类型已通过export type声明导出，无需重复导出
