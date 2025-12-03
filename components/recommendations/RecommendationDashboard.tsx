/**
 * 推荐仪表板组件
 * Phase 3: 个性化推荐系统
 */

"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  Brain,
  Heart,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
  Settings,
  Download,
  BarChart3,
  Clock,
  Star,
  CheckCircle,
  Bookmark,
  Eye,
  ArrowRight,
} from "lucide-react";

import {
  useRecommendationStore,
  useRecommendationActions,
} from "@/lib/recommendations/store";
import { RecommendationPriority } from "@/types/recommendations";
import RecommendationList from "./RecommendationList";
import RecommendationCard from "./RecommendationCard";
import { cn } from "@/lib/utils";

interface RecommendationDashboardProps {
  className?: string;
  showAnalytics?: boolean;
  showQuickActions?: boolean;
  refreshInterval?: number; // 自动刷新间隔（毫秒）
}

interface QuickStats {
  totalRecommendations: number;
  urgentRecommendations: number;
  completionRate: number;
  averageRating: number;
  weeklyProgress: number;
  activeRecommendations: number;
}

interface CategoryInsight {
  category: string;
  count: number;
  effectiveness: number;
  trend: "up" | "down" | "stable";
  icon: React.ReactNode;
  color: string;
}

export const RecommendationDashboard: React.FC<
  RecommendationDashboardProps
> = ({
  className,
  showAnalytics = true,
  showQuickActions = true,
  refreshInterval = 300000, // 5分钟自动刷新
}) => {
  const t = useTranslations("recommendations");
  const {
    activeRecommendations,
    recommendationHistory,
    statistics,
    isGenerating,
    lastGenerationTime,
  } = useRecommendationStore();
  const { refreshRecommendations, generateReport } = useRecommendationActions();

  const [selectedTimeRange, setSelectedTimeRange] = useState<
    "week" | "month" | "all"
  >("week");
  const [showSettings, setShowSettings] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // 自动刷新
  useEffect(() => {
    if (!autoRefresh || !refreshInterval) return;

    const interval = setInterval(() => {
      refreshRecommendations();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refreshRecommendations]);

  // 计算快速统计数据
  const quickStats: QuickStats = useMemo(() => {
    const total = recommendationHistory.totalGenerated;
    const urgent = activeRecommendations.filter(
      (r) => r.priority === "urgent",
    ).length;
    const completed = recommendationHistory.totalCompleted;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    const averageRating = statistics.averageRating || 0;

    // 计算周进度（简化版）
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const weeklyCompleted = recommendationHistory.items.filter(
      (item) => new Date(item.completedAt || "") >= weekStart,
    ).length;
    const weeklyProgress = Math.min(100, (weeklyCompleted / 7) * 100);

    return {
      totalRecommendations: total,
      urgentRecommendations: urgent,
      completionRate,
      averageRating,
      weeklyProgress,
      activeRecommendations: activeRecommendations.length,
    };
  }, [activeRecommendations, recommendationHistory, statistics]);

  // 计算分类洞察
  const categoryInsights: CategoryInsight[] = useMemo(() => {
    const categories = [
      ...new Set(
        recommendationHistory.items.map((item) => item.content.category),
      ),
    ];

    return categories
      .map((category) => {
        const categoryItems = recommendationHistory.items.filter(
          (item) => item.content.category === category,
        );
        const count = categoryItems.length;
        const effectiveness = statistics.categoryEffectiveness[category] || 0;

        // 简化的趋势计算
        const trend: "up" | "down" | "stable" = "stable"; // 实际应该基于历史数据计算

        // 图标映射
        const iconMap: Record<string, React.ReactNode> = {
          压力管理: <Brain className="h-5 w-5" />,
          疼痛管理: <Heart className="h-5 w-5" />,
          营养管理: <Activity className="h-5 w-5" />,
          职场健康: <Target className="h-5 w-5" />,
          心理健康: <Heart className="h-5 w-5" />,
          医疗急救: <AlertTriangle className="h-5 w-5" />,
        };

        const colorMap: Record<string, string> = {
          压力管理: "text-blue-600 bg-blue-50",
          疼痛管理: "text-red-600 bg-red-50",
          营养管理: "text-green-600 bg-green-50",
          职场健康: "text-purple-600 bg-purple-50",
          心理健康: "text-pink-600 bg-pink-50",
          医疗急救: "text-orange-600 bg-orange-50",
        };

        return {
          category,
          count,
          effectiveness,
          trend,
          icon: iconMap[category] || <Activity className="h-5 w-5" />,
          color: colorMap[category] || "text-gray-600 bg-gray-50",
        };
      })
      .sort((a, b) => b.effectiveness - a.effectiveness);
  }, [recommendationHistory, statistics]);

  // 获取今日重点推荐
  const todayHighlights = useMemo(() => {
    return activeRecommendations
      .filter((rec) => rec.priority === "urgent" || rec.priority === "high")
      .slice(0, 3);
  }, [activeRecommendations]);

  // 处理刷新
  const handleRefresh = useCallback(async () => {
    await refreshRecommendations();
  }, [refreshRecommendations]);

  // 处理导出报告
  const handleExportReport = useCallback(async () => {
    const report = generateReport({
      start:
        selectedTimeRange === "week"
          ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0]
          : selectedTimeRange === "month"
            ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0]
            : undefined,
      end: new Date().toISOString().split("T")[0],
    });

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `recommendation-report-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [generateReport, selectedTimeRange]);

  // 渲染统计卡片
  const renderStatCard = (
    title: string,
    value: string | number,
    icon: React.ReactNode,
    color: string,
    trend?: "up" | "down",
  ) => (
    <div
      className={cn(
        "p-6 bg-white rounded-xl border border-gray-200 shadow-sm",
        color,
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="flex items-center space-x-2">
          {icon}
          {trend &&
            (trend === "up" ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            ))}
        </div>
      </div>
    </div>
  );

  // 渲染快速操作
  const renderQuickActions = () => {
    if (!showQuickActions) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <button
          onClick={handleRefresh}
          disabled={isGenerating}
          className="flex items-center justify-center space-x-2 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw
            className={cn("h-5 w-5", isGenerating && "animate-spin")}
          />
          <span>
            {isGenerating ? t("generating") : t("refreshRecommendations")}
          </span>
        </button>

        <button
          onClick={handleExportReport}
          className="flex items-center justify-center space-x-2 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="h-5 w-5" />
          <span>{t("exportReport")}</span>
        </button>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center justify-center space-x-2 p-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Settings className="h-5 w-5" />
          <span>{t("settings")}</span>
        </button>

        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={cn(
            "flex items-center justify-center space-x-2 p-4 rounded-lg transition-colors",
            autoRefresh
              ? "bg-orange-600 text-white hover:bg-orange-700"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300",
          )}
        >
          <Clock className="h-5 w-5" />
          <span>{autoRefresh ? t("autoRefreshOn") : t("autoRefreshOff")}</span>
        </button>
      </div>
    );
  };

  // 渲染时间范围选择器
  const renderTimeRangeSelector = () => {
    return (
      <div className="flex items-center space-x-2 mb-6">
        <span className="text-sm font-medium text-gray-700">
          {t("timeRange")}:
        </span>
        {[
          { value: "week", label: t("thisWeek") },
          { value: "month", label: t("thisMonth") },
          { value: "all", label: t("allTime") },
        ].map((range) => (
          <button
            key={range.value}
            onClick={() =>
              setSelectedTimeRange(range.value as "week" | "month" | "all")
            }
            className={cn(
              "px-3 py-1 text-sm rounded-full transition-colors",
              selectedTimeRange === range.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200",
            )}
          >
            {range.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={cn("space-y-8", className)}>
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("dashboardTitle")}
          </h1>
          <p className="text-gray-600 mt-1">{t("dashboardSubtitle")}</p>
        </div>
        {lastGenerationTime && (
          <div className="text-sm text-gray-500">
            {t("lastUpdated")}: {new Date(lastGenerationTime).toLocaleString()}
          </div>
        )}
      </div>

      {/* 快速操作 */}
      {renderQuickActions()}

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderStatCard(
          t("totalRecommendations"),
          quickStats.totalRecommendations,
          <Activity className="h-6 w-6 text-blue-600" />,
          "border-blue-200",
        )}
        {renderStatCard(
          t("urgentItems"),
          quickStats.urgentRecommendations,
          <AlertTriangle className="h-6 w-6 text-red-600" />,
          "border-red-200",
        )}
        {renderStatCard(
          t("completionRate"),
          `${quickStats.completionRate.toFixed(1)}%`,
          <CheckCircle className="h-6 w-6 text-green-600" />,
          "border-green-200",
          quickStats.completionRate > 70 ? "up" : "down",
        )}
        {renderStatCard(
          t("averageRating"),
          quickStats.averageRating.toFixed(1),
          <Star className="h-6 w-6 text-yellow-600" />,
          "border-yellow-200",
          quickStats.averageRating > 4 ? "up" : "down",
        )}
      </div>

      {/* 今日重点推荐 */}
      {todayHighlights.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {t("todayHighlights")}
            </h2>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {todayHighlights.map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
                compact
                className="cursor-pointer hover:shadow-md transition-shadow"
              />
            ))}
          </div>
          {activeRecommendations.length > todayHighlights.length && (
            <button className="flex items-center space-x-2 mt-4 text-blue-600 hover:text-blue-800 font-medium">
              <span>{t("viewAllRecommendations")}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* 分类洞察 */}
      {showAnalytics && categoryInsights.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {t("categoryInsights")}
            </h2>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryInsights.slice(0, 6).map((insight) => (
              <div
                key={insight.category}
                className={cn("p-4 rounded-lg border", insight.color)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {insight.icon}
                    <span className="font-medium">{insight.category}</span>
                  </div>
                  {insight.trend === "up" && (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  )}
                  {insight.trend === "down" && (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  <div>
                    {t("count")}: {insight.count}
                  </div>
                  <div>
                    {t("effectiveness")}:{" "}
                    {(insight.effectiveness * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 进度追踪 */}
      {showAnalytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 完成进度 */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t("weeklyProgress")}
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>{t("completionProgress")}</span>
                  <span>{quickStats.weeklyProgress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${quickStats.weeklyProgress}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>
                    {t("completed")}: {recommendationHistory.totalCompleted}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Bookmark className="h-4 w-4 text-blue-600" />
                  <span>
                    {t("saved")}: {recommendationHistory.totalSaved}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4 text-gray-600" />
                  <span>
                    {t("viewed")}: {recommendationHistory.totalViewed}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 活跃状态 */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t("activeStatus")}
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {t("activeRecommendations")}
                </span>
                <span className="font-semibold">
                  {quickStats.activeRecommendations}
                </span>
              </div>
              <div className="space-y-2">
                {[
                  {
                    priority: "urgent" as RecommendationPriority,
                    color: "bg-red-500",
                  },
                  {
                    priority: "high" as RecommendationPriority,
                    color: "bg-orange-500",
                  },
                  {
                    priority: "medium" as RecommendationPriority,
                    color: "bg-blue-500",
                  },
                  {
                    priority: "low" as RecommendationPriority,
                    color: "bg-gray-500",
                  },
                ].map(({ priority, color }) => {
                  const count = activeRecommendations.filter(
                    (r) => r.priority === priority,
                  ).length;
                  if (count === 0) return null;
                  return (
                    <div key={priority} className="flex items-center space-x-2">
                      <div className={cn("w-3 h-3 rounded-full", color)} />
                      <span className="text-sm text-gray-600 capitalize">
                        {priority}:
                      </span>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 推荐列表 */}
      <div>
        {renderTimeRangeSelector()}
        <RecommendationList
          maxItems={10}
          showFilters={true}
          showSortOptions={true}
          refreshable={true}
        />
      </div>

      {/* 设置面板（暂时简化） */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">{t("settings")}</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("autoRefresh")}</span>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors",
                    autoRefresh ? "bg-blue-600" : "bg-gray-300",
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 bg-white rounded-full transition-transform",
                      autoRefresh ? "translate-x-6" : "translate-x-0.5",
                    )}
                  />
                </button>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationDashboard;
