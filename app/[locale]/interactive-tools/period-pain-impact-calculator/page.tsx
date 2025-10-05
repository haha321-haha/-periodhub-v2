// 完全修复的页面组件 - 移除所有翻译依赖
// /Users/duting/Downloads/money💰/--main/app/[locale]/interactive-tools/period-pain-impact-calculator/page.tsx

'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { titleManager } from '@/utils/unifiedTitleManager';
import Breadcrumb from '@/components/Breadcrumb';

// 动态导入相关组件 - 代码分割优化
const RelatedArticleCard = dynamic(() => import('../components/RelatedArticleCard'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
});

const RelatedToolCard = dynamic(() => import('../components/RelatedToolCard'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
});

const ScenarioSolutionCard = dynamic(() => import('../components/ScenarioSolutionCard'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
});

// 完全硬编码的文本内容
const TEXTS = {
  zh: {
    metaTitle: '痛经影响计算器 - 职场影响专项分析与工作调整建议 | PeriodHub',
    pageTitle: '痛经影响计算器 - 职场影响专项分析工具',
    subtitle: '专业评估痛经对工作和生活的影响程度，提供个性化的工作调整建议和职场健康管理方案',
    breadcrumbHome: '首页',
    breadcrumbTools: '互动工具',
    breadcrumbCurrent: '工作影响计算器',
    modeTitle: '选择分析模式',
    simplifiedMode: '快速影响评估',
    simplifiedDesc: '快速评估痛经对工作的基础影响',
    detailedMode: '全面影响分析',
    detailedDesc: '深入分析工作、生活各方面的影响',
    medicalMode: '专业职场指导',
    medicalDesc: '专业职场健康管理和工作调整建议',
    startButton: '开始评估',
    impactButton: '职场影响分析',
    backButton: '返回',
    disclaimer: '此工具不是医疗诊断。如有健康问题，请咨询医生。'
  },
  en: {
    metaTitle: 'Work Impact Calculator - Menstrual Pain Assessment & Workplace Analysis | PeriodHub',
    pageTitle: 'Work Impact Calculator - Comprehensive Symptom Assessment & Workplace Analysis Solution',
    subtitle: 'Professional Dysmenorrhea Evaluation Tool with Personalized Medical Recommendations, Scientific Severity Analysis and Lifestyle Guidance',
    description: 'Scientifically assess how menstrual pain affects your life and work',
    breadcrumbHome: 'Home',
    breadcrumbTools: 'Interactive Tools',
    breadcrumbCurrent: 'Work Impact Calculator',
    modeTitle: 'Choose Assessment Mode',
    simplifiedMode: 'Simplified Version',
    simplifiedDesc: 'Quick assessment, suitable for general users',
    detailedMode: 'Detailed Version',
    detailedDesc: 'Comprehensive assessment, provides detailed recommendations',
    medicalMode: 'Medical Professional Version',
    medicalDesc: 'Professional assessment, includes clinical guidance',
    startButton: 'Start Assessment',
    impactButton: 'Workplace Impact Analysis',
    backButton: 'Back',
    disclaimer: 'This tool is not a medical diagnosis. Consult a doctor for any health concerns.'
  }
};

// 痛经影响计算器专用推荐数据配置
const getPainCalculatorRecommendations = (locale: string) => {
  const isZh = locale === 'zh';

  // 推荐文章推荐
  const relatedArticles = [
    {
      id: 'menstrual-stress-management',
      title: isZh ? '经期压力管理完全指南' : 'Menstrual Stress Management Complete Guide',
      description: isZh
        ? '职场环境下的压力管理策略和经期健康维护'
        : 'Stress management strategies and menstrual health maintenance in workplace environment',
      href: `/${locale}/articles/menstrual-stress-management-complete-guide`,
      category: isZh ? '压力管理' : 'stress-management',
      readTime: isZh ? '12分钟阅读' : '12 min read',
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
      readTime: isZh ? '10分钟阅读' : '10 min read',
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
      readTime: isZh ? '8分钟阅读' : '8 min read',
      priority: 'medium',
      icon: '🥗',
      iconColor: 'green',
      anchorTextType: 'quick_relief'
    }
  ];

  // 相关工具推荐
  const relatedTools = [
    {
      id: 'symptom-assessment',
      title: isZh ? '症状评估工具' : 'Symptom Assessment Tool',
      description: isZh
        ? '专业评估痛经症状严重程度和类型'
        : 'Professional assessment of menstrual pain symptom severity and types',
      href: `/${locale}/interactive-tools/symptom-assessment`,
      category: isZh ? '症状评估' : 'symptom-assessment',
      difficulty: isZh ? '简单' : 'Easy',
      estimatedTime: isZh ? '3-5分钟' : '3-5 min',
      priority: 'high',
      icon: '🔍',
      iconColor: 'purple',
      anchorTextType: 'assessment'
    },
    {
      id: 'workplace-wellness',
      title: isZh ? '职场健康管理' : 'Workplace Wellness',
      description: isZh
        ? '职场环境下的经期健康管理和工作调整'
        : 'Menstrual health management and work adjustments in workplace environment',
      href: `/${locale}/interactive-tools/workplace-wellness`,
      category: isZh ? '职场管理' : 'workplace-management',
      difficulty: isZh ? '中等' : 'Medium',
      estimatedTime: isZh ? '5-8分钟' : '5-8 min',
      priority: 'high',
      icon: '💼',
      iconColor: 'blue',
      anchorTextType: 'tracker'
    },
    {
      id: 'pain-tracker',
      title: isZh ? '痛经追踪器' : 'Pain Tracker',
      description: isZh
        ? '记录疼痛模式，分析症状变化趋势'
        : 'Track pain patterns and analyze symptom trends',
      href: `/${locale}/interactive-tools/pain-tracker`,
      category: isZh ? '疼痛追踪' : 'pain-tracking',
      difficulty: isZh ? '简单' : 'Easy',
      estimatedTime: isZh ? '每日2-3分钟' : '2-3 min daily',
      priority: 'medium',
      icon: '📊',
      iconColor: 'red',
      anchorTextType: 'pain_tracker'
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
      iconColor: 'blue',
      anchorTextType: 'office'
    },
    {
      id: 'emergency-kit',
      title: isZh ? '痛经应急包指南' : 'Emergency Kit Guide',
      description: isZh
        ? '疼痛发作时的快速缓解方法和应急处理'
        : 'Quick relief methods and emergency treatment when pain occurs',
      href: `/${locale}/scenario-solutions/emergency-kit`,
      icon: '🚨',
      priority: 'high',
      iconColor: 'red',
      anchorTextType: 'relief'
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
    }
  ];

  return { relatedArticles, relatedTools, scenarioSolutions };
};

export default function PeriodPainImpactCalculatorPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const currentLocale = resolvedParams?.locale || 'zh';

  // 获取当前语言的文本
  const t = TEXTS[currentLocale as keyof typeof TEXTS] || TEXTS.zh;

  // 状态管理
  const [selectedMode, setSelectedMode] = useState<string>('');
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [workImpactScore, setWorkImpactScore] = useState<number>(0);
  const [painLevel, setPainLevel] = useState<number>(0);
  const [workDaysAffected, setWorkDaysAffected] = useState<number>(0);
  const [productivityLoss, setProductivityLoss] = useState<number>(0);

  // 使用统一标题管理器设置页面标题
  useEffect(() => {
    const correctTitle = t.metaTitle;
    titleManager.setTitle(correctTitle, currentLocale);

    return () => {
      // 组件卸载时不需要清理，因为管理器是单例
    };
  }, [t.metaTitle, currentLocale]);

  const handleModeSelect = (mode: string) => {
    setSelectedMode(mode);
    console.log('选择模式:', mode);
  };

  const handleStartAssessment = () => {
    if (!selectedMode) {
      setSelectedMode('simplified');
    }
    console.log('开始职场影响分析, 模式:', selectedMode || 'simplified');

    // 设置计算器状态，不再跳转到其他页面
    setShowCalculator(true);
  };

  const handleImpactAnalysis = () => {
    console.log('开始职场影响分析');

    // 跳转到职场影响评估页面
    router.push(`/${currentLocale}/interactive-tools/workplace-wellness`);
  };

  // 计算职场影响评分
  const calculateWorkImpact = () => {
    const score = (painLevel * 0.4) + (workDaysAffected * 0.3) + (productivityLoss * 0.3);
    setWorkImpactScore(Math.round(score));
  };

  // 当输入值改变时重新计算
  useEffect(() => {
    if (showCalculator) {
      calculateWorkImpact();
    }
  }, [painLevel, workDaysAffected, productivityLoss, showCalculator]);

  // 获取影响等级描述
  const getImpactLevel = (score: number) => {
    if (score <= 30) return { level: '轻度影响', color: 'text-green-600', bgColor: 'bg-green-50' };
    if (score <= 60) return { level: '中度影响', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    if (score <= 80) return { level: '重度影响', color: 'text-orange-600', bgColor: 'bg-orange-50' };
    return { level: '严重影响', color: 'text-red-600', bgColor: 'bg-red-50' };
  };

  const handleBack = () => {
    console.log('返回互动工具页面');

    // 返回到互动工具页面
    router.push(`/${currentLocale}/interactive-tools`);
  };

  return (
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* 面包屑导航 */}
      <Breadcrumb
        items={[
          { label: currentLocale === 'zh' ? '互动工具' : 'Interactive Tools', href: `/${currentLocale}/interactive-tools` },
          { label: currentLocale === 'zh' ? '工作影响计算器' : 'Work Impact Calculator' }
        ]}
      />

      <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 lg:p-16 max-w-5xl mx-auto">
        <div className="text-center">
          {/* 页面主标题 */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            {t.pageTitle}
          </h1>

          {/* 副标题 */}
          <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
            {t.subtitle}
          </p>

          {/* 评估模式选择 */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {t.modeTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            {/* 简化版 */}
            <div
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                selectedMode === 'simplified'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
              onClick={() => handleModeSelect('simplified')}
            >
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {t.simplifiedMode}
              </h3>
              <p className="text-gray-600">
                {t.simplifiedDesc}
                        </p>
                      </div>

            {/* 详细版 */}
            <div
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                selectedMode === 'detailed'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
              onClick={() => handleModeSelect('detailed')}
            >
              <div className="text-3xl mb-3">📋</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {t.detailedMode}
              </h3>
              <p className="text-gray-600">
                {t.detailedDesc}
                        </p>
                      </div>

            {/* 医疗专业版 */}
            <div
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                selectedMode === 'medical'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
              onClick={() => handleModeSelect('medical')}
            >
              <div className="text-3xl mb-3">👩‍⚕️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {t.medicalMode}
              </h3>
              <p className="text-gray-600">
                {t.medicalDesc}
              </p>
                  </div>
                </div>

          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <button
              onClick={handleStartAssessment}
              className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-300"
                  >
              {t.startButton}
                  </button>
                  <button
              onClick={handleImpactAnalysis}
              className="px-8 py-3 border border-purple-600 text-purple-600 font-semibold rounded-lg shadow-md hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-300"
                  >
              {t.impactButton}
                  </button>
                </div>

          {/* 职场影响计算器 */}
          {showCalculator && (
            <div className="mt-12 p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-purple-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                {currentLocale === 'zh' ? '职场影响评估' : 'Workplace Impact Assessment'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* 疼痛程度 */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {currentLocale === 'zh' ? '疼痛程度 (1-10)' : 'Pain Level (1-10)'}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={painLevel}
                    onChange={(e) => setPainLevel(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1</span>
                    <span className="font-semibold text-purple-600">{painLevel}</span>
                    <span>10</span>
                  </div>
                </div>

                {/* 受影响工作日 */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {currentLocale === 'zh' ? '每月受影响天数' : 'Affected Days per Month'}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    value={workDaysAffected}
                    onChange={(e) => setWorkDaysAffected(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span className="font-semibold text-purple-600">{workDaysAffected}</span>
                    <span>15</span>
                  </div>
                </div>

                {/* 工作效率损失 */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {currentLocale === 'zh' ? '工作效率损失 (%)' : 'Productivity Loss (%)'}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={productivityLoss}
                    onChange={(e) => setProductivityLoss(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span className="font-semibold text-purple-600">{productivityLoss}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* 影响评分结果 */}
              <div className="text-center">
                <div className={`inline-block p-6 rounded-xl ${getImpactLevel(workImpactScore).bgColor}`}>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    {currentLocale === 'zh' ? '职场影响评分' : 'Workplace Impact Score'}
                  </h4>
                  <div className={`text-4xl font-bold ${getImpactLevel(workImpactScore).color} mb-2`}>
                    {workImpactScore}/100
                  </div>
                  <p className={`text-lg font-medium ${getImpactLevel(workImpactScore).color}`}>
                    {getImpactLevel(workImpactScore).level}
                  </p>
                </div>
              </div>

              {/* 建议按钮 */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowCalculator(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg border border-gray-300 hover:border-gray-400 transition duration-300 mr-4"
                >
                  {currentLocale === 'zh' ? '重新评估' : 'Re-assess'}
                </button>
                <button
                  onClick={handleImpactAnalysis}
                  className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition duration-300"
                >
                  {currentLocale === 'zh' ? '获取专业建议' : 'Get Professional Advice'}
                </button>
              </div>
            </div>
          )}

          {/* 返回按钮 */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleBack}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-300"
            >
              ← {t.backButton}
            </button>
          </div>
              </div>

        {/* 免责声明 - 正确的语言版本 */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            {t.disclaimer}
          </p>
          <p className="text-center text-xs text-gray-400 mt-2">
            © 2024 PeriodWise. All Rights Reserved.
                        </p>
                      </div>
          </div>

          {/* 相关推荐区域 */}
          <div className="bg-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="space-y-12">

              {/* 推荐文章区域 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {currentLocale === 'zh' ? '相关健康文章' : 'Related Health Articles'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {getPainCalculatorRecommendations(currentLocale).relatedArticles.map((article) => (
                    <RelatedArticleCard
                      key={article.id}
                      article={article}
                      locale={currentLocale}
                    />
                  ))}
                </div>
              </section>

              {/* 相关工具区域 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {currentLocale === 'zh' ? '相关工具' : 'Related Tools'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {getPainCalculatorRecommendations(currentLocale).relatedTools.map((tool) => (
                    <RelatedToolCard
                      key={tool.id}
                      tool={tool}
                      locale={currentLocale}
                    />
                  ))}
                </div>
              </section>

              {/* 场景解决方案区域 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {currentLocale === 'zh' ? '场景解决方案' : 'Scenario Solutions'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {getPainCalculatorRecommendations(currentLocale).scenarioSolutions.map((solution) => (
                    <ScenarioSolutionCard
                      key={solution.id}
                      solution={solution}
                      locale={currentLocale}
                    />
                  ))}
                </div>
              </section>

            </div>
          </div>
          </div>
        </main>
  );
}

// generateMetadata 函数已移至 layout.tsx
