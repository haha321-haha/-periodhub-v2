/**
 * 个性化推荐系统类型定义
 * Phase 3: 个性化推荐系统
 */

// 推荐优先级
export type RecommendationPriority = "urgent" | "high" | "medium" | "low";

// 推荐类型
export type RecommendationType = 
  | "nutrition"
  | "exercise"
  | "selfcare"
  | "workplace"
  | "emotional"
  | "medical"
  | "lifestyle"
  | "emergency";

// 推荐状态
export type RecommendationStatus = 
  | "active"
  | "viewed"
  | "dismissed"
  | "saved"
  | "completed";

// 推荐触发条件
export type RecommendationTrigger = 
  | "assessment_complete"
  | "abnormal_pattern"
  | "cycle_phase"
  | "time_based"
  | "user_request"
  | "emergency_alert";

// 评估记录接口（兼容现有系统）
export interface AssessmentRecord {
  id: string;
  date: string;
  type: "stress" | "pain" | "symptom" | "constitution" | "workplace";
  answers: number[];
  score: number;
  severity: "mild" | "moderate" | "severe" | "emergency";
  primaryPainPoint: "work" | "emotion" | "pain" | "default";
  isPremium: boolean;
  timestamp: number;
  completedAt: string;
}

// 评估历史接口
export interface AssessmentHistory {
  records: AssessmentRecord[];
  lastAssessmentDate: string | null;
  totalAssessments: number;
  premiumAssessments: number;
}

// 推荐内容接口
export interface RecommendationContent {
  id: string;
  type: RecommendationType;
  title: LocalizedText;
  description: LocalizedText;
  actionSteps: LocalizedText[];
  priority: RecommendationPriority;
  triggerConditions: RecommendationTrigger[];
  targetAudience: {
    stressLevel?: number[];
    painLevel?: number[];
    phases?: string[];
    constitutions?: string[];
  };
  evidence?: string;
  resources?: RecommendationResource[];
  validityPeriod: {
    start?: string;
    end?: string;
  };
  category: string;
  tags: string[];
}

// 推荐资源接口
export interface RecommendationResource {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  type: "article" | "video" | "tool" | "external" | "exercise" | "recipe";
  url: string;
  thumbnail?: string;
  duration?: number;
}

// 推荐项接口
export interface RecommendationItem {
  id: string;
  contentId: string;
  content: RecommendationContent;
  userId?: string;
  generatedAt: string;
  status: RecommendationStatus;
  priority: RecommendationPriority;
  triggerSource: RecommendationTrigger;
  personalizedReason: LocalizedText;
  score: number; // 推荐算法分数
  context: {
    assessmentData?: Partial<AssessmentRecord>;
    cyclePhase?: string;
    painLevel?: number;
    stressLevel?: number;
    recentPattern?: string;
  };
  expiresAt?: string;
  viewedAt?: string;
  dismissedAt?: string;
  savedAt?: string;
  completedAt?: string;
}

// 推荐历史接口
export interface RecommendationHistory {
  items: RecommendationItem[];
  totalGenerated: number;
  totalViewed: number;
  totalSaved: number;
  totalCompleted: number;
  lastGeneratedAt?: string;
}

// 推荐反馈接口
export interface RecommendationFeedback {
  id: string;
  recommendationId: string;
  type: "useful" | "not_useful" | "helpful" | "not_helpful" | "rating" | "comment";
  rating?: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  timestamp: string;
  context?: {
    viewedDuration?: number; // 查看时长（秒）
    implementationStatus?: "implemented" | "partially_implemented" | "not_implemented";
  };
}

// 推荐算法配置接口
export interface RecommendationAlgorithmConfig {
  weights: {
    stressLevel: number;      // 压力水平权重
    painLevel: number;        // 疼痛水平权重
    cyclePhase: number;       // 周期阶段权重
    constitution: number;     // 体质权重
    historyPattern: number;   // 历史模式权重
    userFeedback: number;     // 用户反馈权重
  };
  thresholds: {
    urgentScore: number;      // 紧急推荐阈值
    highScore: number;        // 高优先级阈值
    mediumScore: number;      // 中等优先级阈值
  };
  limits: {
    maxActiveRecommendations: number;  // 最大同时活跃推荐数
    maxDailyRecommendations: number;   // 每日最大推荐数
    recommendationCooldown: number;   // 推荐冷却时间（小时）
  };
}

// 推荐模式检测接口
export interface PatternDetection {
  type: "stress_spike" | "pain_pattern" | "cycle_irregularity" | "declining_trend" | "improvement";
  severity: "mild" | "moderate" | "severe";
  description: string;
  confidence: number; // 置信度 0-1
  detectedAt: string;
  dataPoints: any[]; // 相关数据点
}

// 推荐触发上下文接口
export interface RecommendationContext {
  currentDate: string;
  lastAssessment?: AssessmentRecord;
  recentAssessments: AssessmentRecord[];
  currentCyclePhase?: string;
  detectedPatterns: PatternDetection[];
  userPreferences: {
    savedCategories: string[];
    dismissedTypes: RecommendationType[];
    preferredTime: string[];
  };
  environment: {
    isWorkHours: boolean;
    isWeekend: boolean;
    season: string;
  };
}

// 推荐生成结果接口
export interface RecommendationGenerationResult {
  recommendations: RecommendationItem[];
  algorithmInsights: {
    patternsDetected: PatternDetection[];
    scoreDistribution: Record<string, number>;
    priorityBreakdown: Record<RecommendationPriority, number>;
  };
  metadata: {
    generatedAt: string;
    algorithmVersion: string;
    processingTime: number;
    contextSnapshot: RecommendationContext;
  };
}

// 推荐统计接口
export interface RecommendationStatistics {
  totalGenerated: number;
  totalViewed: number;
  totalSaved: number;
  totalCompleted: number;
  averageRating: number;
  categoryEffectiveness: Record<string, number>;
  priorityEngagement: Record<RecommendationPriority, number>;
  recentTrends: {
    generationRate: number[];
    engagementRate: number[];
    satisfactionRate: number[];
  };
}

// 推荐内容模板接口
export interface RecommendationTemplate {
  id: string;
  type: RecommendationType;
  priority: RecommendationPriority;
  conditions: {
    stressLevel?: { min?: number; max?: number };
    painLevel?: { min?: number; max?: number };
    phases?: string[];
    constitutions?: string[];
    symptoms?: string[];
    timeRanges?: string[];
  };
  content: {
    titleTemplate: string;
    descriptionTemplate: string;
    actionStepTemplates: string[];
    reasonTemplate: string;
  };
  resources: Omit<RecommendationResource, 'id'>[];
  tags: string[];
}

// 多语言文本接口
export interface LocalizedText {
  zh: string;
  en: string;
}

// 推荐导出配置
export interface RecommendationExportConfig {
  format: "json" | "csv" | "pdf";
  dateRange: {
    start: string;
    end: string;
  };
  includeStatistics: boolean;
  includeFeedback: boolean;
  filters?: {
    types?: RecommendationType[];
    priorities?: RecommendationPriority[];
    statuses?: RecommendationStatus[];
  };
}

// 推荐系统设置
export interface RecommendationSettings {
  algorithm: RecommendationAlgorithmConfig;
  notifications: {
    enabled: boolean;
    frequency: "immediate" | "daily" | "weekly";
    preferredTimes: string[];
    channels: ("in_app" | "email" | "push")[];
  };
  privacy: {
    shareAnalytics: boolean;
    anonymizeData: boolean;
  };
  personalization: {
    learningEnabled: boolean;
    adaptationRate: "slow" | "medium" | "fast";
  };
}