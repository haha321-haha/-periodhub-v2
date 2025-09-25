'use client';

import React, { useState, useEffect } from 'react';
import { useSafeTranslations } from '@/hooks/useSafeTranslations';
import { usePartnerHandbookStore } from '../stores/partnerHandbookStore';
import { Locale } from '../types/common';
import { QuizResult } from '../types/quiz';

// 懒加载组件
import dynamic from 'next/dynamic';

// 动态导入组件以优化性能
const PartnerUnderstandingQuiz = dynamic(
  () => import('./PartnerUnderstandingQuiz'),
  { 
    loading: () => <div className="quiz-container"><div className="loading-skeleton h-96 rounded-lg"></div></div>,
    ssr: false 
  }
);

const ResultsDisplay = dynamic(
  () => import('./ResultsDisplay'),
  { 
    loading: () => <div className="results-container"><div className="loading-skeleton h-96 rounded-lg"></div></div>,
    ssr: false 
  }
);

const TrainingCampSchedule = dynamic(
  () => import('./TrainingCampSchedule'),
  { 
    loading: () => <div className="training-camp-container"><div className="loading-skeleton h-96 rounded-lg"></div></div>,
    ssr: false 
  }
);

const RelatedLinks = dynamic(
  () => import('./RelatedLinks'),
  { 
    loading: () => <div className="related-links-section"><div className="loading-skeleton h-64 rounded-lg"></div></div>,
    ssr: false 
  }
);

// 静态导入的组件
import LanguageSwitcher from './LanguageSwitcher';
import MedicalDisclaimer from './MedicalDisclaimer';
import ViewMoreArticlesButton from './ViewMoreArticlesButton';

interface PartnerHandbookClientProps {
  locale: Locale;
}

type AppState = 'intro' | 'quiz' | 'results' | 'training';

export default function PartnerHandbookClient({ locale }: PartnerHandbookClientProps) {
  const { t } = useSafeTranslations('partnerHandbook');
  const { 
    currentLanguage, 
    quizResult, 
    isQuizCompleted,
    completeQuiz,
    resetQuiz 
  } = usePartnerHandbookStore();
  
  const [currentState, setCurrentState] = useState<AppState>('intro');
  const [isLoading, setIsLoading] = useState(false);

  // 同步语言设置
  useEffect(() => {
    if (currentLanguage !== locale) {
      usePartnerHandbookStore.getState().setLanguage(locale);
    }
  }, [locale, currentLanguage]);

  // 测试结果现在直接显示在页面上，不需要状态切换

  const handleStartQuiz = () => {
    // 滚动到测试区域
    const quizSection = document.getElementById('quiz-section');
    if (quizSection) {
      quizSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuizComplete = (result: QuizResult) => {
    completeQuiz(result);
    // 保持在intro状态，测试结果会直接显示在页面上
  };

  const handleStartTraining = () => {
    setIsLoading(true);
    setCurrentState('training');
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleRetakeQuiz = () => {
    resetQuiz();
    setCurrentState('quiz');
  };

  const handleBackToIntro = () => {
    setCurrentState('intro');
  };

  const handleDayComplete = (dayId: string) => {
    usePartnerHandbookStore.getState().completeTraining(dayId);
  };

  // 渲染加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">
            {locale === 'zh' ? '加载中...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 页面头部 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container-custom">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-800">
                {t('pageTitle')}
              </h1>
              <LanguageSwitcher variant="compact" />
            </div>
            <div className="flex items-center space-x-4">
              <ViewMoreArticlesButton locale={locale} variant="outline" size="sm" />
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="container-custom py-8">
        {currentState === 'intro' && (
          <div className="max-w-4xl mx-auto">
            {/* 英雄区域 */}
            <section 
              className="hero-gradient rounded-2xl p-8 md:p-12 text-white text-center mb-12"
              style={{ 
                background: 'linear-gradient(135deg, #6d28d9 0%, #be185d 100%)',
                color: '#ffffff'
              }}
            >
              <h1 
                className="text-3xl md:text-4xl font-bold mb-6"
                style={{ color: '#ffffff' }}
              >
                {t('mainTitle')}
              </h1>
              <p 
                className="text-lg md:text-xl mb-8 leading-relaxed"
                style={{ color: '#ffffff' }}
              >
                {t('intro')}
              </p>
            </section>

            {/* 理解度测试 - 直接显示 */}
            <section id="quiz-section" className="mb-16">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  {locale === 'zh' ? '伴侣理解度测试' : 'Partner Understanding Test'}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {locale === 'zh' 
                    ? '通过10道专业题目，了解你对痛经的认知水平，获得个性化建议' 
                    : 'Understand your knowledge level through 10 professional questions and get personalized recommendations'
                  }
                </p>
              </div>
              
              {!isQuizCompleted ? (
                <PartnerUnderstandingQuiz
                  locale={locale}
                  onQuizComplete={handleQuizComplete}
                />
              ) : (
                <ResultsDisplay
                  result={quizResult!}
                  locale={locale}
                  onStartTraining={handleStartTraining}
                  onRetakeQuiz={handleRetakeQuiz}
                />
              )}
            </section>

            {/* 功能特色 */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <button 
                onClick={handleStartQuiz}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 text-center cursor-pointer hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {locale === 'zh' ? '理解度测试' : 'Understanding Test'}
                </h3>
                <p className="text-gray-600">
                  {locale === 'zh' 
                    ? '通过10道专业题目，了解你对痛经的认知水平' 
                    : 'Understand your knowledge level through 10 professional questions'
                  }
                </p>
                <div className="mt-4 text-primary-600 font-medium">
                  {locale === 'zh' ? '开始测试 →' : 'Start Test →'}
                </div>
              </button>
              
              <button 
                onClick={handleStartTraining}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 text-center cursor-pointer hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {locale === 'zh' ? '30天训练营' : '30-Day Training Camp'}
                </h3>
                <p className="text-gray-600">
                  {locale === 'zh' 
                    ? '每天5分钟，循序渐进成为暖心伴侣' 
                    : '5 minutes daily, gradually become a caring partner'
                  }
                </p>
                <div className="mt-4 text-primary-600 font-medium">
                  {locale === 'zh' ? '查看训练营 →' : 'View Training →'}
                </div>
              </button>
              
              <div className="bg-white rounded-xl p-6 shadow-md text-center opacity-75">
                <div className="text-4xl mb-4">💝</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {locale === 'zh' ? '个性化指导' : 'Personalized Guidance'}
                </h3>
                <p className="text-gray-600">
                  {locale === 'zh' 
                    ? '基于测试结果，提供专属的改善建议' 
                    : 'Based on test results, provide exclusive improvement suggestions'
                  }
                </p>
                <div className="mt-4 text-gray-500 font-medium">
                  {locale === 'zh' ? '完成测试后解锁' : 'Unlock after test'}
                </div>
              </div>
            </section>

            {/* 相关推荐区域 */}
            <section className="bg-gray-50 rounded-2xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  {locale === 'zh' ? '相关推荐' : 'Related Recommendations'}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {locale === 'zh' ? '探索更多专业健康内容，深入了解痛经管理和伴侣支持' : 'Explore more professional health content to deepen your understanding of period pain management and partner support'}
                </p>
              </div>
              
              <RelatedLinks locale={locale} showTitle={false} />
            </section>
          </div>
        )}

        {currentState === 'quiz' && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <button
                onClick={handleBackToIntro}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {locale === 'zh' ? '返回首页' : 'Back to Home'}
              </button>
            </div>
            <PartnerUnderstandingQuiz
              locale={locale}
              onQuizComplete={handleQuizComplete}
            />
          </div>
        )}

        {currentState === 'results' && quizResult && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <button
                onClick={handleBackToIntro}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {locale === 'zh' ? '返回首页' : 'Back to Home'}
              </button>
            </div>
            <ResultsDisplay
              result={quizResult}
              locale={locale}
              onStartTraining={handleStartTraining}
              onRetakeQuiz={handleRetakeQuiz}
            />
          </div>
        )}

        {currentState === 'training' && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <button
                onClick={handleBackToIntro}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {locale === 'zh' ? '返回首页' : 'Back to Home'}
              </button>
            </div>
            <TrainingCampSchedule
              locale={locale}
              onDayComplete={handleDayComplete}
            />
          </div>
        )}
      </main>

      {/* 医疗免责声明 */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container-custom">
          <MedicalDisclaimer locale={locale} />
        </div>
      </footer>
    </div>
  );
}
