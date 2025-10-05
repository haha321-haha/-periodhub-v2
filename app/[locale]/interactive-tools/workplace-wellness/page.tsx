/**
 * Workplace Wellness Assistant - Main Page
 * Day 10: User Experience Optimization - Responsive Design Optimization
 * Based on HVsLYEp renderer.js structure design
 */

'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import dynamic from 'next/dynamic';

// 动态导入大型组件 - 代码分割优化
const Header = dynamic(() => import('./components/Header'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-16 rounded-lg" />
});

const Navigation = dynamic(() => import('./components/Navigation'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-12 rounded-lg" />
});

const CalendarComponent = dynamic(() => import('./components/CalendarComponent'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});

const WorkImpactComponent = dynamic(() => import('./components/WorkImpactComponent'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});

const NutritionComponent = dynamic(() => import('./components/NutritionComponent'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});

const DataExportComponent = dynamic(() => import('./components/DataExportComponent'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});

const Footer = dynamic(() => import('./components/Footer'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-16 rounded-lg" />
});

const ResponsiveContainer = dynamic(() => import('./components/ResponsiveContainer'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
});

const RelatedToolCard = dynamic(() => import('../components/RelatedToolCard'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
});

const RelatedArticleCard = dynamic(() => import('../components/RelatedArticleCard'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
});

const ScenarioSolutionCard = dynamic(() => import('../components/ScenarioSolutionCard'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
});

// 保留必要的直接导入
import Breadcrumb from '@/components/Breadcrumb';
import { useWorkplaceWellnessStore } from './hooks/useWorkplaceWellnessStore';

// 动态导入其他组件 - 代码分割优化
const UserPreferencesSettings = dynamic(() => import('./components/UserPreferencesSettings'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
});

const ExportTemplateManager = dynamic(() => import('./components/ExportTemplateManager'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
});

const BatchExportManager = dynamic(() => import('./components/BatchExportManager'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
});

const AdvancedCycleAnalysis = dynamic(() => import('./components/AdvancedCycleAnalysis'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
});

const SymptomStatistics = dynamic(() => import('./components/SymptomStatistics'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
});

const WorkImpactAnalysis = dynamic(() => import('./components/WorkImpactAnalysis'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
});

const DataVisualizationDashboard = dynamic(() => import('./components/DataVisualizationDashboard'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
});

const CycleStatisticsChart = dynamic(() => import('./components/CycleStatisticsChart'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
});

const HistoryDataViewer = dynamic(() => import('./components/HistoryDataViewer'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
});

// 职场健康管理专用推荐数据配置
const getWorkplaceWellnessRecommendations = (locale: string) => {
  const isZh = locale === 'zh';
  
  // 推荐文章推荐
  const relatedArticles = [
    {
      id: 'menstrual-stress-management',
      title: isZh ? '经期压力管理完全指南' : 'Menstrual Stress Management Complete Guide',
      description: isZh
        ? '职场环境下的压力管理策略和经期健康维护'
        : 'Stress management strategies and menstrual health maintenance in workplace',
      href: `/${locale}/articles/menstrual-stress-management-complete-guide`,
      category: isZh ? '压力管理' : 'stress-management',
      readTime: isZh ? '10分钟阅读' : '10 min read',
      priority: 'high',
      icon: '💼',
      iconColor: 'blue',
      anchorTextType: 'workplace_health'
    },
    {
      id: 'menstrual-sleep-quality',
      title: isZh ? '经期睡眠质量改善指南' : 'Menstrual Sleep Quality Improvement Guide',
      description: isZh
        ? '提升睡眠质量，改善经期不适和工作效率'
        : 'Improve sleep quality to reduce menstrual discomfort and enhance work efficiency',
      href: `/${locale}/articles/menstrual-sleep-quality-improvement-guide`,
      category: isZh ? '睡眠管理' : 'sleep-management',
      readTime: isZh ? '8分钟阅读' : '8 min read',
      priority: 'high',
      icon: '😴',
      iconColor: 'purple',
      anchorTextType: 'pain_management'
    },
    {
      id: 'anti-inflammatory-diet',
      title: isZh ? '抗炎饮食缓解痛经指南' : 'Anti-Inflammatory Diet for Period Pain Relief',
      description: isZh
        ? '适合职场女性的抗炎饮食方案和营养调理'
        : 'Anti-inflammatory diet plan and nutrition conditioning for working women',
      href: `/${locale}/articles/anti-inflammatory-diet-period-pain`,
      category: isZh ? '营养调理' : 'nutrition-conditioning',
      readTime: isZh ? '12分钟阅读' : '12 min read',
      priority: 'medium',
      icon: '🥗',
      iconColor: 'green',
      anchorTextType: 'nutrition_guide'
    }
  ];
  
  // 相关工具推荐
  const relatedTools = [
    {
      id: 'pain-tracker',
      title: isZh ? '痛经追踪器' : 'Pain Tracker',
      description: isZh
        ? '记录疼痛模式，分析职场影响趋势'
        : 'Track pain patterns and analyze workplace impact trends',
      href: `/${locale}/interactive-tools/pain-tracker`,
      category: isZh ? '疼痛追踪' : 'pain-tracking',
      difficulty: isZh ? '简单' : 'Easy',
      estimatedTime: isZh ? '每日2-3分钟' : '2-3 min daily',
      priority: 'high',
      icon: '📊',
      iconColor: 'red',
      anchorTextType: 'tracker'
    },
    {
      id: 'constitution-test',
      title: isZh ? '中医体质测试' : 'TCM Constitution Test',
      description: isZh
        ? '了解体质类型，制定职场调理方案'
        : 'Understand constitution type and develop workplace conditioning plan',
      href: `/${locale}/interactive-tools/constitution-test`,
      category: isZh ? '体质评估' : 'constitution-assessment',
      difficulty: isZh ? '简单' : 'Easy',
      estimatedTime: isZh ? '5-8分钟' : '5-8 min',
      priority: 'high',
      icon: '🌿',
      iconColor: 'green',
      anchorTextType: 'constitution'
    },
    {
      id: 'nutrition-recommendation-generator',
      title: isZh ? '营养推荐生成器' : 'Nutrition Generator',
      description: isZh
        ? '根据工作强度生成个性化营养建议'
        : 'Generate personalized nutrition recommendations based on work intensity',
      href: `/${locale}/interactive-tools/nutrition-recommendation-generator`,
      category: isZh ? '营养管理' : 'nutrition-management',
      difficulty: isZh ? '简单' : 'Easy',
      estimatedTime: isZh ? '3-5分钟' : '3-5 min',
      priority: 'medium',
      icon: '🥗',
      iconColor: 'orange',
      anchorTextType: 'nutrition'
    }
  ];
  
  // 场景解决方案推荐
  const scenarioSolutions = [
    {
      id: 'office',
      title: isZh ? '办公环境健康管理' : 'Office Environment Health Management',
      description: isZh
        ? '办公环境下的经期健康管理策略'
        : 'Menstrual health management strategies in office environment',
      href: `/${locale}/scenario-solutions/office`,
      icon: '💼',
      priority: 'high',
      iconColor: 'blue'
    },
    {
      id: 'commute',
      title: isZh ? '通勤场景' : 'Commute Scenario',
      description: isZh
        ? '通勤途中经期疼痛应急处理指南'
        : 'Emergency menstrual pain management during commute',
      href: `/${locale}/scenario-solutions/commute`,
      icon: '🚗',
      priority: 'medium',
      iconColor: 'orange',
      anchorTextType: 'exercise_balance_new'
    },
    {
      id: 'sleep',
      title: isZh ? '职场睡眠优化' : 'Workplace Sleep Optimization',
      description: isZh
        ? '工作压力下的睡眠质量改善'
        : 'Sleep quality improvement under work pressure',
      href: `/${locale}/scenario-solutions/sleep`,
      icon: '😴',
      priority: 'medium',
      iconColor: 'purple'
    }
  ];
  
  return { relatedTools, relatedArticles, scenarioSolutions };
};

export default function WorkplaceWellnessPage() {
  const { activeTab } = useWorkplaceWellnessStore();
  const t = useTranslations('workplaceWellness');
  const [isLoading, setIsLoading] = useState(true);
  const [previousTab, setPreviousTab] = useState(activeTab);
  const locale = useLocale();

  // Day 12: 性能监控和优化
  useEffect(() => {
    // 模拟加载状态
    const timer = setTimeout(() => {
      setIsLoading(false);
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 text-neutral-800 font-sans">
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
        
        {/* 相关推荐区域 */}
        <div className="bg-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="space-y-12">
              
              {/* 推荐文章区域 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {locale === 'zh' ? '职场健康文章' : 'Workplace Health Articles'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {getWorkplaceWellnessRecommendations(locale).relatedArticles.map((article) => (
                    <RelatedArticleCard
                      key={article.id}
                      article={article}
                      locale={locale}
                    />
                  ))}
                </div>
              </section>
              
              {/* 相关工具区域 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {locale === 'zh' ? '相关工具' : 'Related Tools'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {getWorkplaceWellnessRecommendations(locale).relatedTools.map((tool) => (
                    <RelatedToolCard
                      key={tool.id}
                      tool={tool}
                      locale={locale}
                    />
                  ))}
                </div>
              </section>
              
              {/* 场景解决方案区域 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {locale === 'zh' ? '场景解决方案' : 'Scenario Solutions'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {getWorkplaceWellnessRecommendations(locale).scenarioSolutions.map((solution) => (
                    <ScenarioSolutionCard
                      key={solution.id}
                      solution={solution}
                      locale={locale}
                    />
                  ))}
                </div>
              </section>
              
            </div>
          </div>
        </div>
      </div>
  );
}
