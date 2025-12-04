/**
 * 推荐列表组件
 * Phase 3: 个性化推荐系统
 */

"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  RefreshCw,
  Filter,
  SortDesc,
  ChevronDown,
  CheckCircle,
  Bookmark,
  Clock,
  AlertTriangle,
} from "lucide-react";

import {
  RecommendationType,
  RecommendationFeedback,
} from "@/types/recommendations";
import {
  useRecommendationStore,
  useRecommendationActions,
} from "@/lib/recommendations/store";
import RecommendationCard from "./RecommendationCard";
import { cn } from "@/lib/utils";

interface RecommendationListProps {
  className?: string;
  maxItems?: number;
  showFilters?: boolean;
  showSortOptions?: boolean;
  refreshable?: boolean;
  onView?: (recommendationId: string) => void;
  onSave?: (recommendationId: string) => void;
  onDismiss?: (recommendationId: string) => void;
  onComplete?: (recommendationId: string) => void;
  onFeedback?: (feedback: RecommendationFeedback) => void;
}

type SortOption = "priority" | "date" | "score" | "type";
type FilterStatus = "all" | "active" | "viewed" | "saved" | "completed";
type FilterPriority = "all" | "urgent" | "high" | "medium" | "low";
type FilterType = "all" | RecommendationType;

export const RecommendationList: React.FC<RecommendationListProps> = ({
  className,
  maxItems,
  showFilters = true,
  showSortOptions = true,
  refreshable = true,
  onView,
  onSave,
  onDismiss,
  onComplete,
  onFeedback,
}) => {
  const t = useTranslations("recommendations");
  const { activeRecommendations, isGenerating } = useRecommendationStore();
  const { refreshRecommendations } = useRecommendationActions();

  const [filters, setFilters] = useState({
    status: "all" as FilterStatus,
    priority: "all" as FilterPriority,
    type: "all" as FilterType,
  });

  const [sortOption, setSortOption] = useState<SortOption>("priority");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // 过滤推荐
  const filteredRecommendations = useMemo(() => {
    let filtered = [...activeRecommendations];

    // 状态过滤
    if (filters.status !== "all") {
      filtered = filtered.filter((rec) => rec.status === filters.status);
    }

    // 优先级过滤
    if (filters.priority !== "all") {
      filtered = filtered.filter((rec) => rec.priority === filters.priority);
    }

    // 类型过滤
    if (filters.type !== "all") {
      filtered = filtered.filter((rec) => rec.content.type === filters.type);
    }

    return filtered;
  }, [activeRecommendations, filters]);

  // 排序推荐
  const sortedRecommendations = useMemo(() => {
    const sorted = [...filteredRecommendations];

    switch (sortOption) {
      case "priority":
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return sorted.sort(
          (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
        );

      case "date":
        return sorted.sort(
          (a, b) =>
            new Date(b.generatedAt).getTime() -
            new Date(a.generatedAt).getTime(),
        );

      case "score":
        return sorted.sort((a, b) => b.score - a.score);

      case "type":
        return sorted.sort((a, b) =>
          a.content.type.localeCompare(b.content.type),
        );

      default:
        return sorted;
    }
  }, [filteredRecommendations, sortOption]);

  // 限制显示数量
  const displayRecommendations = useMemo(() => {
    if (maxItems && maxItems > 0) {
      return sortedRecommendations.slice(0, maxItems);
    }
    return sortedRecommendations;
  }, [sortedRecommendations, maxItems]);

  // 统计信息
  const statistics = useMemo(() => {
    const stats = {
      total: activeRecommendations.length,
      urgent: activeRecommendations.filter((r) => r.priority === "urgent")
        .length,
      high: activeRecommendations.filter((r) => r.priority === "high").length,
      medium: activeRecommendations.filter((r) => r.priority === "medium")
        .length,
      low: activeRecommendations.filter((r) => r.priority === "low").length,
      viewed: activeRecommendations.filter((r) => r.status === "viewed").length,
      saved: activeRecommendations.filter((r) => r.status === "saved").length,
      completed: activeRecommendations.filter((r) => r.status === "completed")
        .length,
    };

    return stats;
  }, [activeRecommendations]);

  // 处理刷新
  const handleRefresh = useCallback(async () => {
    await refreshRecommendations();
  }, [refreshRecommendations]);

  // 处理过滤器变化
  const handleFilterChange = useCallback(
    (key: keyof typeof filters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  // 重置过滤器
  const handleResetFilters = useCallback(() => {
    setFilters({
      status: "all",
      priority: "all",
      type: "all",
    });
  }, []);

  // 渲染统计信息
  const renderStatistics = () => {
    if (!showFilters) return null;

    return (
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full text-sm">
          <span className="font-medium">总计:</span>
          <span>{statistics.total}</span>
        </div>

        {statistics.urgent > 0 && (
          <div className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
            <AlertTriangle className="h-3 w-3" />
            <span>紧急: {statistics.urgent}</span>
          </div>
        )}

        {statistics.high > 0 && (
          <div className="flex items-center space-x-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            <span>高优先级: {statistics.high}</span>
          </div>
        )}

        {statistics.viewed > 0 && (
          <div className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            <Clock className="h-3 w-3" />
            <span>已查看: {statistics.viewed}</span>
          </div>
        )}

        {statistics.saved > 0 && (
          <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            <Bookmark className="h-3 w-3" />
            <span>已保存: {statistics.saved}</span>
          </div>
        )}

        {statistics.completed > 0 && (
          <div className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            <CheckCircle className="h-3 w-3" />
            <span>已完成: {statistics.completed}</span>
          </div>
        )}
      </div>
    );
  };

  // 渲染过滤器
  const renderFilters = () => {
    if (!showFilters) return null;

    return (
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* 状态过滤器 */}
        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>{t("filter")}</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {showFilterDropdown && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="p-4 space-y-3">
                {/* 状态过滤 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("status")}
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">{t("allStatuses")}</option>
                    <option value="active">{t("active")}</option>
                    <option value="viewed">{t("viewed")}</option>
                    <option value="saved">{t("saved")}</option>
                    <option value="completed">{t("completed")}</option>
                  </select>
                </div>

                {/* 优先级过滤 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("priority")}
                  </label>
                  <select
                    value={filters.priority}
                    onChange={(e) =>
                      handleFilterChange("priority", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">{t("allPriorities")}</option>
                    <option value="urgent">{t("urgent")}</option>
                    <option value="high">{t("high")}</option>
                    <option value="medium">{t("medium")}</option>
                    <option value="low">{t("low")}</option>
                  </select>
                </div>

                {/* 类型过滤 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("type")}
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange("type", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">{t("allTypes")}</option>
                    <option value="nutrition">{t("nutrition")}</option>
                    <option value="exercise">{t("exercise")}</option>
                    <option value="selfcare">{t("selfcare")}</option>
                    <option value="workplace">{t("workplace")}</option>
                    <option value="emotional">{t("emotional")}</option>
                    <option value="medical">{t("medical")}</option>
                    <option value="lifestyle">{t("lifestyle")}</option>
                    <option value="emergency">{t("emergency")}</option>
                  </select>
                </div>

                {/* 重置按钮 */}
                <button
                  onClick={handleResetFilters}
                  className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  {t("resetFilters")}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 排序选项 */}
        {showSortOptions && (
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SortDesc className="h-4 w-4" />
              <span>{t("sortBy")}</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {showSortDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  {[
                    { value: "priority", label: t("priority") },
                    { value: "date", label: t("date") },
                    { value: "score", label: t("score") },
                    { value: "type", label: t("type") },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortOption(option.value as SortOption);
                        setShowSortDropdown(false);
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors",
                        sortOption === option.value &&
                          "bg-blue-50 text-blue-600",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 刷新按钮 */}
        {refreshable && (
          <button
            onClick={handleRefresh}
            disabled={isGenerating}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw
              className={cn("h-4 w-4", isGenerating && "animate-spin")}
            />
            <span>{isGenerating ? t("generating") : t("refresh")}</span>
          </button>
        )}
      </div>
    );
  };

  // 渲染空状态
  const renderEmptyState = () => {
    const isFiltered =
      filters.status !== "all" ||
      filters.priority !== "all" ||
      filters.type !== "all";

    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {isFiltered
                ? t("noFilteredRecommendations")
                : t("noRecommendations")}
            </h3>
            <p className="text-gray-600 mt-1">
              {isFiltered ? t("tryAdjustingFilters") : t("checkBackLater")}
            </p>
          </div>
          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t("resetFilters")}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* 统计信息 */}
      {renderStatistics()}

      {/* 过滤器和排序 */}
      {renderFilters()}

      {/* 推荐列表 */}
      <div className="space-y-4">
        {displayRecommendations.length > 0
          ? displayRecommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
                onView={onView}
                onSave={onSave}
                onDismiss={onDismiss}
                onComplete={onComplete}
                onFeedback={onFeedback}
              />
            ))
          : renderEmptyState()}
      </div>

      {/* 显示更多提示 */}
      {maxItems &&
        displayRecommendations.length === maxItems &&
        sortedRecommendations.length > maxItems && (
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {t("showingNOfM", {
                count: displayRecommendations.length,
                total: sortedRecommendations.length,
              })}
            </p>
          </div>
        )}

      {/* 点击外部关闭下拉菜单 */}
      {(showFilterDropdown || showSortDropdown) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setShowFilterDropdown(false);
            setShowSortDropdown(false);
          }}
        />
      )}
    </div>
  );
};

export default RecommendationList;
