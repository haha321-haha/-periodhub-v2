
'use client';

import { useEffect } from 'react';

interface Metric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

export function WebVitalsReporter() {
  useEffect(() => {
    // 使用web-vitals库进行Core Web Vitals监控
    import('web-vitals').then((webVitals) => {
      // 注意：跳过已废弃的FID，使用新的API
      webVitals.onCLS(sendToAnalytics);
      webVitals.onFCP(sendToAnalytics);
      webVitals.onLCP(sendToAnalytics);
      webVitals.onTTFB(sendToAnalytics);
      
      // INP现在有官方支持
      webVitals.onINP(sendToAnalytics);
    }).catch(error => {
      console.warn('Failed to load web-vitals:', error);
    });
  }, []);

  function sendToAnalytics(metric: Metric) {
    // 跳过已废弃的FID指标
    if (metric.name === 'FID') return;
    
    // 发送到分析服务
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
      });
    }
    
    // 控制台输出（开发环境）
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 ${metric.name}: ${metric.value} (${metric.rating})`);
    }
    
    // 发送到自定义分析端点
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metric),
    }).catch(console.error);
  }


  return null;
}

// 性能优化Hook
export function usePerformanceOptimization() {
  useEffect(() => {
    // 预加载关键资源
    const criticalResources = [
      '/api/user/profile',
      '/api/period/current'
    ];
    
    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = resource;
      document.head.appendChild(link);
    });
    
    // 延迟加载非关键资源
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      observer.observe(img);
    });
    
    return () => observer.disconnect();
  }, []);
}
