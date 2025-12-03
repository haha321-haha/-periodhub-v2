/**
 * 推荐卡片组件
 * Phase 3: 个性化推荐系统
 */

"use client";

import React, { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { 
  Clock, 
  Bookmark, 
  CheckCircle, 
  X, 
  Star, 
  ThumbsUp, 
  ThumbsDown,
  ChevronRight,
  AlertTriangle,
  Info,
  Heart,
  Activity,
  Briefcase,
  Brain,
  Apple,
  Dumbbell,
  Shield
} from "lucide-react";

import {
  RecommendationItem,
  RecommendationPriority,
  RecommendationType,
  RecommendationFeedback,
} from "@/types/recommendations";
import { useRecommendationActions } from "@/lib/recommendations/store";
import { cn } from "@/lib/utils";

interface RecommendationCardProps {
  recommendation: RecommendationItem;
  className?: string;
  onView?: (recommendationId: string) => void;
  onSave?: (recommendationId: string) => void;
  onDismiss?: (recommendationId: string) => void;
  onComplete?: (recommendationId: string) => void;
  onFeedback?: (feedback: Omit<RecommendationFeedback, "id" | "timestamp">) => void;
  compact?: boolean;
  showFeedback?: boolean;
  variant?: "default" | "minimal" | "detailed";
}

/**
 * 推荐类型图标映射
 */
const TYPE_ICONS: Record<RecommendationType, React.ReactNode> = {
  nutrition: <Apple className="h-5 w-5" />,
  exercise: <Dumbbell className="h-5 w-5" />,
  selfcare: <Heart className="h-5 w-5" />,
  workplace: <Briefcase className="h-5 w-5" />,
  emotional: <Brain className="h-5 w-5" />,
  medical: <Shield className="h-5 w-5" />,
  lifestyle: <Activity className="h-5 w-5" />,
  emergency: <AlertTriangle className="h-5 w-5" />,
};

/**
 * 优先级颜色配置
 */
const PRIORITY_COLORS: Record<RecommendationPriority, string> = {
  urgent: "border-red-500 bg-red-50",
  high: "border-orange-500 bg-orange-50",
  medium: "border-blue-500 bg-blue-50",
  low: "border-gray-300 bg-gray-50",
};

/**
 * 优先级标签配置
 */
const PRIORITY_LABELS: Record<RecommendationPriority, { zh: string; en: string }> = {
  urgent: { zh: "紧急", en: "Urgent" },
  high: { zh: "高优先级", en: "High" },
  medium: { zh: "中等", en: "Medium" },
  low: { zh: "一般", en: "Low" },
};

/**
 * 优先级图标配置
 */
const PRIORITY_ICONS: Record<RecommendationPriority, React.ReactNode> = {
  urgent: <AlertTriangle className="h-4 w-4 text-red-600" />,
  high: <Info className="h-4 w-4 text-orange-600" />,
  medium: <Info className="h-4 w-4 text-blue-600" />,
  low: <Info className="h-4 w-4 text-gray-600" />,
};

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  className,
  onView,
  onSave,
  onDismiss,
  onComplete,
  onFeedback,
  compact = false,
  showFeedback = true,
  variant = "default",
}) => {
  const t = useTranslations("recommendations");
  const actions = useRecommendationActions();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  const { content, priority, status, personalizedReason, context } = recommendation;

  // 处理查看详情
  const handleView = useCallback(() => {
    if (status !== "viewed" && status !== "completed") {
      actions.markAsViewed(recommendation.id);
    }
    onView?.(recommendation.id);
    setIsExpanded(true);
  }, [status, recommendation.id, actions, onView]);

  // 处理保存
  const handleSave = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (status === "saved") {
      // 如果已保存，则取消保存
      // 这里可以添加取消保存的逻辑
    } else {
      actions.saveRecommendation(recommendation.id);
      onSave?.(recommendation.id);
    }
  }, [status, recommendation.id, actions, onSave]);

  // 处理忽略
  const handleDismiss = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    actions.dismissRecommendation(recommendation.id);
    onDismiss?.(recommendation.id);
  }, [recommendation.id, actions, onDismiss]);

  // 处理完成
  const handleComplete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    actions.markAsCompleted(recommendation.id);
    onComplete?.(recommendation.id);
  }, [recommendation.id, actions, onComplete]);

  // 处理反馈
  const handleFeedback = useCallback((type: "useful" | "not_useful") => {
    onFeedback?.({
      recommendationId: recommendation.id,
      type,
      context: {
        viewedDuration: isExpanded ? 30 : 5, // 简化的查看时长估算
      },
    });
  }, [recommendation.id, onFeedback, isExpanded]);

  // 处理评分
  const handleRating = useCallback((rating: number) => {
    onFeedback?.({
      recommendationId: recommendation.id,
      type: "rating",
      rating: rating as 1 | 2 | 3 | 4 | 5,
    });
    setShowRatingDialog(false);
  }, [recommendation.id, onFeedback]);

  // 渲染状态指示器
  const renderStatusIndicator = () => {
    if (status === "completed") {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    if (status === "saved") {
      return <Bookmark className="h-4 w-4 text-blue-600" />;
    }
    if (status === "viewed") {
      return <Clock className="h-4 w-4 text-gray-500" />;
    }
    return null;
  };

  // 渲染操作按钮
  const renderActionButtons = () => {
    if (variant === "minimal") return null;

    return (
      <div className="flex items-center space-x-1">
        {status !== "completed" && status !== "dismissed" && (
          <button
            onClick={handleComplete}
            onMouseEnter={() => setHoveredAction("complete")}
            onMouseLeave={() => setHoveredAction(null)}
            className="p-2 rounded-full hover:bg-green-100 transition-colors"
            title={t("markAsComplete")}
          >
            <CheckCircle className={cn(
              "h-4 w-4",
              hoveredAction === "complete" ? "text-green-600" : "text-gray-400"
            )} />
          </button>
        )}

        {status !== "saved" && status !== "dismissed" && (
          <button
            onClick={handleSave}
            onMouseEnter={() => setHoveredAction("save")}
            onMouseLeave={() => setHoveredAction(null)}
            className="p-2 rounded-full hover:bg-blue-100 transition-colors"
            title={status === "saved" ? t("saved") : t("save")}
          >
            <Bookmark className={cn(
              "h-4 w-4",
              status === "saved" ? "text-blue-600" : hoveredAction === "save" ? "text-blue-600" : "text-gray-400"
            )} />
          </button>
        )}

        <button
          onClick={handleDismiss}
          onMouseEnter={() => setHoveredAction("dismiss")}
          onMouseLeave={() => setHoveredAction(null)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          title={t("dismiss")}
        >
          <X className={cn(
            "h-4 w-4",
            hoveredAction === "dismiss" ? "text-gray-600" : "text-gray-400"
          )} />
        </button>
      </div>
    );
  };

  // 渲染反馈区域
  const renderFeedbackSection = () => {
    if (!showFeedback || status === "dismissed") return null;

    return (
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">{t("wasThisHelpful")}</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleFeedback("useful")}
              className="flex items-center space-x-1 px-3 py-1 text-sm rounded-full hover:bg-green-100 transition-colors"
            >
              <ThumbsUp className="h-3 w-3" />
              <span>{t("useful")}</span>
            </button>
            <button
              onClick={() => handleFeedback("not_useful")}
              className="flex items-center space-x-1 px-3 py-1 text-sm rounded-full hover:bg-red-100 transition-colors"
            >
              <ThumbsDown className="h-3 w-3" />
              <span>{t("notUseful")}</span>
            </button>
            <button
              onClick={() => setShowRatingDialog(true)}
              className="flex items-center space-x-1 px-3 py-1 text-sm rounded-full hover:bg-yellow-100 transition-colors"
            >
              <Star className="h-3 w-3" />
              <span>{t("rate")}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 渲染评分对话框
  const renderRatingDialog = () => {
    if (!showRatingDialog) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">{t("rateThisRecommendation")}</h3>
          <div className="flex justify-center space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRating(rating)}
                className="p-2 hover:bg-yellow-100 rounded-full transition-colors"
              >
                <Star className="h-6 w-6 text-gray-400 hover:text-yellow-500" />
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setShowRatingDialog(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 获取本地化文本
  const getLocalizedText = (text: { zh: string; en: string }) => {
    // 这里应该根据当前语言选择，暂时使用中文
    return text.zh || text.en;
  };

  // 紧凑模式渲染
  if (compact) {
    return (
      <div
        className={cn(
          "p-3 border rounded-lg cursor-pointer hover:shadow-md transition-all duration-200",
          PRIORITY_COLORS[priority],
          status === "dismissed" && "opacity-60",
          className
        )}
        onClick={handleView}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-gray-700">
              {TYPE_ICONS[content.type]}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {getLocalizedText(content.title)}
              </h4>
              <p className="text-xs text-gray-600 truncate">
                {getLocalizedText(content.description)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {renderStatusIndicator()}
            {PRIORITY_ICONS[priority]}
          </div>
        </div>
      </div>
    );
  }

  // 默认模式渲染
  return (
    <>
      <div
        className={cn(
          "bg-white border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer",
          PRIORITY_COLORS[priority],
          status === "dismissed" && "opacity-60",
          "border-l-4", // 左边框强调优先级
          className
        )}
        onClick={handleView}
      >
        {/* 头部区域 */}
        <div className="p-4 pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              {/* 类型图标 */}
              <div className={cn(
                "p-2 rounded-lg",
                priority === "urgent" && "bg-red-100 text-red-600",
                priority === "high" && "bg-orange-100 text-orange-600",
                priority === "medium" && "bg-blue-100 text-blue-600",
                priority === "low" && "bg-gray-100 text-gray-600"
              )}>
                {TYPE_ICONS[content.type]}
              </div>

              {/* 标题和描述 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {getLocalizedText(content.title)}
                  </h3>
                  <span className={cn(
                    "px-2 py-1 text-xs font-medium rounded-full",
                    priority === "urgent" && "bg-red-100 text-red-700",
                    priority === "high" && "bg-orange-100 text-orange-700",
                    priority === "medium" && "bg-blue-100 text-blue-700",
                    priority === "low" && "bg-gray-100 text-gray-700"
                  )}>
                    {PRIORITY_LABELS[priority].zh}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {getLocalizedText(content.description)}
                </p>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center space-x-1">
              {renderStatusIndicator()}
              {renderActionButtons()}
            </div>
          </div>
        </div>

        {/* 个性化理由 */}
        {(variant === "detailed" || isExpanded) && personalizedReason && (
          <div className="px-4 pb-2">
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-700 bg-blue-50 rounded-lg p-2 flex-1">
                {getLocalizedText(personalizedReason)}
              </p>
            </div>
          </div>
        )}

        {/* 展开内容 */}
        {isExpanded && (
          <div className="px-4 pb-3">
            {/* 行动步骤 */}
            {content.actionSteps && content.actionSteps.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-900 mb-2">{t("actionSteps")}</h4>
                <ol className="space-y-1">
                  {content.actionSteps.slice(0, 3).map((step, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <span>{getLocalizedText(step)}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* 资源链接 */}
            {content.resources && content.resources.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-900 mb-2">{t("relatedResources")}</h4>
                <div className="space-y-1">
                  {content.resources.slice(0, 2).map((resource) => (
                    <a
                      key={resource.id}
                      href={resource.url}
                      className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ChevronRight className="h-3 w-3" />
                      <span>{getLocalizedText(resource.title)}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* 上下文信息 */}
            {context && (
              <div className="text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  {context.assessmentData && (
                    <span>评分: {context.assessmentData.score}</span>
                  )}
                  {context.cyclePhase && (
                    <span>阶段: {context.cyclePhase}</span>
                  )}
                  {recommendation.expiresAt && (
                    <span>过期: {new Date(recommendation.expiresAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 反馈区域 */}
        {renderFeedbackSection()}
      </div>

      {/* 评分对话框 */}
      {renderRatingDialog()}
    </>
  );
};

export default RecommendationCard;