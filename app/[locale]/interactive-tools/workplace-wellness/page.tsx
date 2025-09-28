/**
 * Workplace Wellness Assistant - Main Page
 * Day 10: User Experience Optimization - Responsive Design Optimization
 * Based on HVsLYEp renderer.js structure design
 */

'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useWorkplaceWellnessStore } from './hooks/useWorkplaceWellnessStore';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Breadcrumb from '@/components/Breadcrumb';
import CalendarComponent from './components/CalendarComponent';
import WorkImpactComponent from './components/WorkImpactComponent';
import NutritionComponent from './components/NutritionComponent';
import DataExportComponent from './components/DataExportComponent';
import Footer from './components/Footer';
import { ErrorBoundary } from './components/ErrorHandling';
import ResponsiveContainer from './components/ResponsiveContainer';
import { LoadingWrapper, SkeletonCard } from './components/LoadingAnimations';
// Day 12: 懒加载优化导入
import { createLazyPage, createLazyModule, preloadCriticalComponents } from './components/LazyLoader';
import { PerformanceMonitor, MemoryMonitor } from './utils/performanceOptimizer';

// Day 11: 懒加载组件导入
const UserPreferencesSettings = createLazyModule(
  () => import('./components/UserPreferencesSettings'),
  'UserPreferencesSettings'
);

const ExportTemplateManager = createLazyModule(
  () => import('./components/ExportTemplateManager'),
  'ExportTemplateManager'
);

const BatchExportManager = createLazyModule(
  () => import('./components/BatchExportManager'),
  'BatchExportManager'
);

// Day 12: 懒加载Day 9组件
const AdvancedCycleAnalysis = createLazyModule(
  () => import('./components/AdvancedCycleAnalysis'),
  'AdvancedCycleAnalysis'
);

const SymptomStatistics = createLazyModule(
  () => import('./components/SymptomStatistics'),
  'SymptomStatistics'
);

const WorkImpactAnalysis = createLazyModule(
  () => import('./components/WorkImpactAnalysis'),
  'WorkImpactAnalysis'
);

const DataVisualizationDashboard = createLazyModule(
  () => import('./components/DataVisualizationDashboard'),
  'DataVisualizationDashboard'
);

// Day 12: 懒加载Day 8组件
const CycleStatisticsChart = createLazyModule(
  () => import('./components/CycleStatisticsChart'),
  'CycleStatisticsChart'
);

const HistoryDataViewer = createLazyModule(
  () => import('./components/HistoryDataViewer'),
  'HistoryDataViewer'
);

export default function WorkplaceWellnessPage() {
  const { activeTab } = useWorkplaceWellnessStore();
  const t = useTranslations('workplaceWellness');
  const [isLoading, setIsLoading] = useState(true);
  const [previousTab, setPreviousTab] = useState(activeTab);
  const locale = useLocale();

  // Day 12: 性能监控和优化
  useEffect(() => {
    // 启动性能监控
    PerformanceMonitor.observeWebVitals();
    
    // 预加载关键组件
    preloadCriticalComponents();
    
    // 监控内存使用
    const memoryCheckInterval = setInterval(() => {
      if (MemoryMonitor.checkMemoryLeak()) {
        console.warn('检测到潜在内存泄漏，建议进行垃圾回收');
        MemoryMonitor.forceGC();
      }
    }, 30000); // 每30秒检查一次

    return () => {
      PerformanceMonitor.stopAllObservers();
      clearInterval(memoryCheckInterval);
    };
  }, []);

  // 模拟加载状态
  useEffect(() => {
    PerformanceMonitor.startMeasure('page-load');
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      PerformanceMonitor.endMeasure('page-load');
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // 标签页切换动画
  useEffect(() => {
    if (activeTab !== previousTab) {
      setPreviousTab(activeTab);
    }
  }, [activeTab, previousTab]);

  // 渲染内容组件 - 基于HVsLYEp的Content函数，增强Day 9功能
  const renderContent = () => {
    if (isLoading) {
      return (
        <LoadingWrapper isLoading={true} loadingComponent={
          <div className="space-y-6">
            <SkeletonCard className="h-[200px]" />
            <SkeletonCard className="h-[150px]" />
            <SkeletonCard className="h-[100px]" />
          </div>
        }>
          <div className="space-y-6">
            <SkeletonCard className="h-[200px]" />
            <SkeletonCard className="h-[150px]" />
            <SkeletonCard className="h-[100px]" />
          </div>
        </LoadingWrapper>
      );
    }

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
      case 'work-impact':
        return (
          <div className="space-y-6">
            <WorkImpactComponent />
            <WorkImpactAnalysis />
          </div>
        );
      case 'analysis':
        return (
          <div className="space-y-6">
            <DataVisualizationDashboard />
            <AdvancedCycleAnalysis />
            <SymptomStatistics />
          </div>
        );
      case 'export':
        return <DataExportComponent />;
      case 'settings':
        return (
          <div className="space-y-6">
            <UserPreferencesSettings />
          </div>
        );
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
    <ErrorBoundary>
      <div className="min-h-screen bg-neutral-50 text-neutral-800 font-sans">
        {/* 头部组件 */}
        <Header />
        
        {/* 导航组件 */}
        <Navigation />
        
        {/* 面包屑导航 */}
        <div className="max-w-6xl mx-auto px-4">
          <Breadcrumb 
            items={[
              { label: locale === 'zh' ? '互动工具' : 'Interactive Tools', href: `/${locale}/interactive-tools` },
              { label: locale === 'zh' ? '职场健康助手' : 'Workplace Wellness Assistant' }
            ]}
          />
        </div>
        
        {/* 主要内容区域 */}
        <ResponsiveContainer>
          <main className="max-w-6xl mx-auto px-4 py-8 w-full">
            {renderContent()}
          </main>
        </ResponsiveContainer>
        
        {/* 页脚组件 */}
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
