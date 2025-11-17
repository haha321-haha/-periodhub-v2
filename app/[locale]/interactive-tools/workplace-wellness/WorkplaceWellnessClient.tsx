"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import dynamic from "next/dynamic";
import { useWorkplaceWellnessStore } from "./hooks/useWorkplaceWellnessStore";

// 动态导入组件以优化性能
const WorkplaceWellnessHeader = dynamic(
  () => import("./components/Header"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

const Navigation = dynamic(
  () => import("./components/Navigation"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-16 rounded-lg" />
    ),
  },
);

const CalendarComponent = dynamic(
  () => import("./components/CalendarComponent"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

const NutritionComponent = dynamic(
  () => import("./components/NutritionComponent"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

const WorkImpactComponent = dynamic(
  () => import("./components/WorkImpactComponent"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

const DataVisualizationDashboard = dynamic(
  () => import("./components/DataVisualizationDashboard"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

const AdvancedCycleAnalysis = dynamic(
  () => import("./components/AdvancedCycleAnalysis"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

const CycleStatisticsChart = dynamic(
  () => import("./components/CycleStatisticsChart"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

const DataExportComponent = dynamic(
  () => import("./components/DataExportComponent"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

const UserPreferencesSettings = dynamic(
  () => import("./components/UserPreferencesSettings"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
    ),
  },
);

const Footer = dynamic(() => import("./components/Footer"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-16 rounded-lg" />,
});

const DataRetentionWarning = dynamic(
  () => import("./components/DataRetentionWarning"),
  {
    loading: () => null,
  },
);

const ResponsiveContainer = dynamic(
  () => import("./components/ResponsiveContainer"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
    ),
  },
);

const Breadcrumb = dynamic(() => import("@/components/Breadcrumb"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-8 rounded" />,
});

// 个性化推荐组件 - 使用智能推荐系统
const PersonalizedRecommendations = dynamic(
  () => import("./components/PersonalizedRecommendations"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

export default function WorkplaceWellnessClient() {
  const { activeTab } = useWorkplaceWellnessStore();
  const t = useTranslations("workplaceWellness");
  const breadcrumbT = useTranslations("interactiveTools.breadcrumb");
  const [isLoading, setIsLoading] = useState(true);
  const [previousTab, setPreviousTab] = useState(activeTab);
  const locale = useLocale();

  // 模拟加载状态
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 标签页切换动画
  useEffect(() => {
    if (previousTab !== activeTab) {
      const timer = setTimeout(() => {
        setPreviousTab(activeTab);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [activeTab, previousTab]);

  // 渲染标签页内容
  const renderTabContent = () => {
    switch (activeTab) {
      case "calendar":
        return (
          <div className="space-y-6">
            <CalendarComponent />
            <CycleStatisticsChart />
          </div>
        );
      case "nutrition":
        return <NutritionComponent />;
      case "work-impact":
        return <WorkImpactComponent />;
      case "analysis":
        return (
          <div className="space-y-6">
            <DataVisualizationDashboard />
            <AdvancedCycleAnalysis />
          </div>
        );
      case "export":
        return <DataExportComponent />;
      case "settings":
        return <UserPreferencesSettings />;
      default:
        return (
          <div className="space-y-6">
            <CalendarComponent />
            <CycleStatisticsChart />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 面包屑导航 */}
      <Breadcrumb
        items={[
          { label: breadcrumbT("home"), href: `/${locale}` },
          { label: breadcrumbT("tools"), href: `/${locale}/interactive-tools` },
          { label: t("title"), href: `/${locale}/interactive-tools/workplace-wellness` },
          ]}
      />

        {/* 头部组件 */}
        <WorkplaceWellnessHeader />

        {/* 导航组件 */}
        <Navigation />

        {/* 主要内容 */}
        <ResponsiveContainer>
          {/* 数据保留提醒 */}
          <DataRetentionWarning />

          {/* 标签页内容 */}
          <div className="relative min-h-[500px] mt-6">
            {/* 加载状态 */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            )}

            {/* 淡入淡出动画 */}
            <div
              className={`transition-opacity duration-300 ${
                previousTab === activeTab ? "opacity-100" : "opacity-0"
              }`}
            >
              {renderTabContent()}
            </div>
          </div>

          {/* 个性化推荐 - 使用智能推荐系统 */}
          <div className="mt-12">
            <PersonalizedRecommendations />
          </div>
        </ResponsiveContainer>

        {/* 页脚 */}
        <Footer />
      </div>
  );
}