/**
 * 推荐仪表板页面
 * Phase 3: 个性化推荐系统
 */

"use client";

import React, { useEffect } from "react";
import { useTranslations } from "next-intl";

import RecommendationDashboard from "@/components/recommendations/RecommendationDashboard";
import { useRecommendationIntegration } from "@/app/[locale]/interactive-tools/workplace-wellness/hooks/recommendation-integration";
import { useRecommendationStore } from "@/lib/recommendations/store";

/**
 * 推荐仪表板页面组件
 */
export default function RecommendationsPage() {
  const t = useTranslations("recommendations");
  const integration = useRecommendationIntegration();
  const { activeRecommendations, isGenerating } = useRecommendationStore();

  // 页面初始化
  useEffect(() => {
    // 确保集成功能已启用
    if (!integration.integrationEnabled) {
      integration.updateIntegrationSettings({ integrationEnabled: true });
    }

    // 如果没有推荐，尝试生成
    if (activeRecommendations.length === 0 && !isGenerating) {
      integration.triggerRecommendationRefresh();
    }
  }, [integration, activeRecommendations.length, isGenerating]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                {t("pageTitle")}
              </h1>
              {integration.urgentRecommendationsCount > 0 && (
                <span className="ml-3 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                  {integration.urgentRecommendationsCount} {t("urgent")}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* 快速统计 */}
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <span>{t("totalAssessments")}:</span>
                  <span className="font-medium text-gray-900">
                    {integration.assessmentHistory.totalAssessments}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>{t("activeRecommendations")}:</span>
                  <span className="font-medium text-gray-900">
                    {integration.unreadRecommendationsCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 推荐仪表板 */}
        <RecommendationDashboard
          showAnalytics={true}
          showQuickActions={true}
          refreshInterval={300000} // 5分钟自动刷新
        />
      </div>

      {/* 页面底部信息 */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {t("howItWorks")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{t("step1")}</h3>
                <p className="text-sm text-gray-600">{t("step1Desc")}</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{t("step2")}</h3>
                <p className="text-sm text-gray-600">{t("step2Desc")}</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{t("step3")}</h3>
                <p className="text-sm text-gray-600">{t("step3Desc")}</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{t("step4")}</h3>
                <p className="text-sm text-gray-600">{t("step4Desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 推荐卡片预览组件
 * 可在其他页面中嵌入显示推荐
 */
export const RecommendationPreview: React.FC<{
  maxItems?: number;
  showViewAll?: boolean;
  className?: string;
}> = ({ maxItems = 3, showViewAll = true, className = "" }) => {
  const t = useTranslations("recommendations");
  const { activeRecommendations } = useRecommendationStore();

  const previewItems = activeRecommendations
    .filter((rec) => rec.priority === "urgent" || rec.priority === "high")
    .slice(0, maxItems);

  if (previewItems.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {t("yourRecommendations")}
        </h3>
        {showViewAll && (
          <a
            href="/dashboard/recommendations"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {t("viewAll")}
          </a>
        )}
      </div>

      <div className="space-y-3">
        {previewItems.map((recommendation) => (
          <div
            key={recommendation.id}
            className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              // 这里可以添加跳转到详情页的逻辑
              window.location.href = `/dashboard/recommendations#${recommendation.id}`;
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">
                  {recommendation.content.title.zh ||
                    recommendation.content.title.en}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {recommendation.content.description.zh ||
                    recommendation.content.description.en}
                </p>
              </div>

              <span
                className={`
                ml-3 px-2 py-1 text-xs font-medium rounded-full
                ${
                  recommendation.priority === "urgent"
                    ? "bg-red-100 text-red-800"
                    : recommendation.priority === "high"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-blue-100 text-blue-800"
                }
              `}
              >
                {recommendation.priority === "urgent"
                  ? t("urgent")
                  : recommendation.priority === "high"
                    ? t("high")
                    : t("normal")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
