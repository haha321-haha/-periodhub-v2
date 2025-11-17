"use client";

// A/B测试启动脚本 - Day 4 数据收集
// 基于 Day 3 完成的免费版本增强测试

import { ABTestManager, conversionEvents } from '@/lib/ab-testing';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface ABTTestTrackerProps {
  userId: string;
  testId: string;
}

// A/B测试数据收集Hook
export function useABTestTracking(userId: string) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [userVariant, setUserVariant] = useState<'control' | 'treatment'>('control');

  useEffect(() => {
    if (!userId) return;

    // 分配用户到测试组
    const variant = ABTestManager.getTestAssignment(userId, 'day3-free-version-enhancement');
    setUserVariant(variant);
    setIsLoaded(true);

    // 记录用户进入测试
    ABTestManager.trackEvent(
      userId, 
      'day3-free-version-enhancement', 
      'test_exposure',
      { 
        variant, 
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        screenSize: `${screen.width}x${screen.height}`
      }
    );

  }, [userId]);

  return { isLoaded, userVariant };
}

// 事件追踪函数
export function trackConversionEvent(
  userId: string, 
  event: string, 
  metadata?: any
) {
  if (!userId) return;

  ABTestManager.trackEvent(
    userId,
    'day3-free-version-enhancement',
    event,
    {
      ...metadata,
      timestamp: new Date().toISOString(),
      sessionId: sessionStorage.getItem('sessionId') || 'unknown'
    }
  );
}

// 评估开始追踪
export function trackAssessmentStart(userId: string) {
  trackConversionEvent(userId, conversionEvents.assessmentStarted, {
    source: 'stress_management_page',
    timestamp: new Date().toISOString()
  });
}

// 评估完成追踪
export function trackAssessmentComplete(userId: string, score: number, answers: number[]) {
  trackConversionEvent(userId, conversionEvents.assessmentCompleted, {
    score,
    answerCount: answers.length,
    averageAnswer: answers.reduce((sum, ans) => sum + ans, 0) / answers.length,
    completionTime: Date.now()
  });
}

// PHQ-9评估追踪
export function trackPHQ9Start(userId: string) {
  trackConversionEvent(userId, conversionEvents.phq9Started, {
    source: 'stress_assessment_results',
    timestamp: new Date().toISOString()
  });
}

export function trackPHQ9Complete(userId: string, score: number, level: string) {
  trackConversionEvent(userId, conversionEvents.phq9Completed, {
    score,
    level,
    completionTime: Date.now()
  });
}

// 付费墙相关追踪
export function trackPaywallView(userId: string) {
  trackConversionEvent(userId, conversionEvents.paywallViewed, {
    viewType: 'free_version_paywall',
    timestamp: new Date().toISOString()
  });
}

export function trackPaywallClick(userId: string, action: 'upgrade' | 'skip') {
  trackConversionEvent(userId, conversionEvents.paywallClicked, {
    action,
    timestamp: new Date().toISOString()
  });
}

// 雷达图交互追踪
export function trackRadarChartInteraction(
  userId: string, 
  interactionType: 'view' | 'hover' | 'click',
  data?: any
) {
  trackConversionEvent(userId, 'radar_chart_interaction', {
    interactionType,
    data,
    timestamp: new Date().toISOString()
  });
}

// 建议点击追踪
export function trackRecommendationClick(
  userId: string, 
  recommendationIndex: number,
  recommendationType: string
) {
  trackConversionEvent(userId, 'recommendation_clicked', {
    index: recommendationIndex,
    type: recommendationType,
    timestamp: new Date().toISOString()
  });
}

// A/B测试显示组件
export function ABTestDebugger({ userId, testId }: ABTTestTrackerProps) {
  const t = useTranslations('abtest.debugger');
  const { isLoaded, userVariant } = useABTestTracking(userId);

  if (process.env.NODE_ENV !== 'development') {
    return null; // 生产环境不显示
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-3 rounded-lg text-sm z-50">
      <div className="font-bold">{t('title')}</div>
      <div>{t('status')}: {isLoaded ? t('loaded') : t('loading')}</div>
      <div>{t('variant')}: {userVariant}</div>
      <div>{t('test')}: {testId}</div>
      <div>{t('user')}: {userId}</div>
    </div>
  );
}

// 数据收集状态Hook
export function useDataCollection() {
  const [collectionStatus, setCollectionStatus] = useState({
    isActive: true,
    lastSync: null as Date | null,
    eventCount: 0,
    pendingEvents: 0
  });

  // 模拟数据同步
  useEffect(() => {
    const interval = setInterval(() => {
      setCollectionStatus(prev => ({
        ...prev,
        lastSync: new Date(),
        pendingEvents: Math.floor(Math.random() * 5) // 模拟待同步事件
      }));
    }, 30000); // 每30秒更新一次

    return () => clearInterval(interval);
  }, []);

  return collectionStatus;
}

// 用户ID生成（临时方案）
export function generateAnonymousUserId(): string {
  // 客户端-only：检查localStorage可用性
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    // 服务端渲染或localStorage不可用时，返回临时ID
    return 'server_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }
  
  try {
    const stored = localStorage.getItem('anonymous_user_id');
    if (stored) return stored;
    const userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('anonymous_user_id', userId);
    return userId;
  } catch (error) {
    // localStorage访问失败时，返回临时ID
    console.warn('Failed to access localStorage:', error);
    return 'fallback_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }
}

// 性能监控
export function trackPerformanceMetric(
  userId: string,
  metricName: string,
  value: number,
  metadata?: any
) {
  trackConversionEvent(userId, 'performance_metric', {
    metric: metricName,
    value,
    metadata,
    timestamp: new Date().toISOString()
  });
}

// 错误追踪
export function trackError(
  userId: string,
  errorType: string,
  errorMessage: string,
  stack?: string
) {
  trackConversionEvent(userId, 'error_occurred', {
    type: errorType,
    message: errorMessage,
    stack,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  });
}

export { ABTestManager } from '@/lib/ab-testing';