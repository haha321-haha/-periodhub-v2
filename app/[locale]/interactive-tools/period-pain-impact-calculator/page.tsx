// 完全修复的页面组件 - 移除所有翻译依赖
// /Users/duting/Downloads/money💰/--main/app/[locale]/interactive-tools/period-pain-impact-calculator/page.tsx

'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { titleManager } from '@/utils/unifiedTitleManager';

// 完全硬编码的文本内容
const TEXTS = {
  zh: {
    metaTitle: '工作影响计算器 - 症状评估与职场分析完整解决方案 | 专业经期疼痛测试工具与个性化建议系统，科学评估痛经严重程度及工作影响，提供精准医疗建议和生活方式指导 | PeriodHub',
    pageTitle: '工作影响计算器 - 症状评估与职场分析完整解决方案',
    subtitle: '专业经期疼痛测试工具与个性化建议系统，科学评估痛经严重程度及工作影响，提供精准医疗建议和生活方式指导',
    breadcrumbHome: '首页',
    breadcrumbTools: '互动工具',
    breadcrumbCurrent: '工作影响计算器',
    modeTitle: '选择评估模式',
    simplifiedMode: '简化版',
    simplifiedDesc: '快速评估，适合一般用户',
    detailedMode: '详细版',
    detailedDesc: '全面评估，提供详细建议',
    medicalMode: '医疗专业版',
    medicalDesc: '专业评估，包含临床指导',
    startButton: '开始评估',
    impactButton: '职场影响分析',
    backButton: '返回',
    disclaimer: '此工具不是医疗诊断。如有健康问题，请咨询医生。'
  },
  en: {
    metaTitle: 'Work Impact Calculator - Comprehensive Symptom Assessment & Workplace Analysis Solution | Professional Dysmenorrhea Evaluation Tool with Personalized Medical Recommendations, Scientific Severity Analysis and Lifestyle Guidance | PeriodHub',
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
    console.log('开始评估, 模式:', selectedMode || 'simplified');
    
    // 根据选择的模式跳转到不同的页面
    const mode = selectedMode || 'simplified';
    if (mode === 'simplified') {
      router.push(`/${currentLocale}/interactive-tools/symptom-assessment?mode=simplified`);
    } else if (mode === 'detailed') {
      router.push(`/${currentLocale}/interactive-tools/symptom-assessment?mode=detailed`);
    } else if (mode === 'medical') {
      router.push(`/${currentLocale}/interactive-tools/symptom-assessment?mode=medical`);
    } else {
      // 默认跳转到简化版
      router.push(`/${currentLocale}/interactive-tools/symptom-assessment?mode=simplified`);
    }
  };

  const handleImpactAnalysis = () => {
    console.log('开始职场影响分析');
    
    // 跳转到职场影响评估页面
    router.push(`/${currentLocale}/interactive-tools/workplace-impact-assessment`);
  };

  const handleBack = () => {
    console.log('返回互动工具页面');
    
    // 返回到互动工具页面
    router.push(`/${currentLocale}/interactive-tools`);
  };

  return (
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* 面包屑导航 */}
      <nav className="mb-8" aria-label="breadcrumb">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <a 
            href={`/${currentLocale}`} 
            className="hover:text-purple-600 transition-colors"
          >
            {t.breadcrumbHome}
          </a>
          <span>/</span>
          <a 
            href={`/${currentLocale}/interactive-tools`} 
            className="hover:text-purple-600 transition-colors"
          >
            {t.breadcrumbTools}
          </a>
          <span>/</span>
          <span className="text-gray-900 font-medium">
            {t.breadcrumbCurrent}
          </span>
        </div>
      </nav>

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
        </main>
  );
}

// generateMetadata 函数已移至 layout.tsx
