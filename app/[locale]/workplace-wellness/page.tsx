/**
 * HVsLYEp职场健康助手 - 主页面
 * 基于HVsLYEp的renderer.js结构设计
 */

'use client';

import { useEffect } from 'react';
import { useWorkplaceWellnessStore } from './hooks/useWorkplaceWellnessStore';
import { createTranslationFunction } from './data';
import Header from './components/Header';
import Navigation from './components/Navigation';
import CalendarComponent from './components/CalendarComponent';
import WorkImpactComponent from './components/WorkImpactComponent';
import NutritionComponent from './components/NutritionComponent';
import DataExportComponent from './components/DataExportComponent';
import CycleStatisticsChart from './components/CycleStatisticsChart';
import HistoryDataViewer from './components/HistoryDataViewer';
import Footer from './components/Footer';

export default function WorkplaceWellnessPage() {
  const { activeTab, lang } = useWorkplaceWellnessStore();
  const t = createTranslationFunction(lang);

  // 渲染内容组件 - 基于HVsLYEp的Content函数，增强Day 8功能
  const renderContent = () => {
    switch (activeTab) {
      case 'calendar':
        return (
          <div className="space-y-6">
            <CalendarComponent />
            <CycleStatisticsChart />
            <HistoryDataViewer />
          </div>
        );
      case 'nutrition':
        return <NutritionComponent />;
      case 'export':
        return <DataExportComponent />;
      default:
        return (
          <div className="space-y-6">
            <CalendarComponent />
            <CycleStatisticsChart />
            <HistoryDataViewer />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 font-sans">
      {/* 头部组件 */}
      <Header />
      
      {/* 导航组件 */}
      <Navigation />
      
      {/* 主要内容区域 */}
      <main className="max-w-6xl mx-auto px-4 py-8 w-full">
        {renderContent()}
      </main>
      
      {/* 页脚组件 */}
      <Footer />
    </div>
  );
}
