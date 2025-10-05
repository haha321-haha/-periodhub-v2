'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

/**
 * 优化的第三方脚本加载组件
 * 实现智能延迟加载和性能优化
 */
export default function OptimizedScripts() {
  const [shouldLoadScripts, setShouldLoadScripts] = useState(false);
  const [isProduction, setIsProduction] = useState(false);

  useEffect(() => {
    // 检查环境 - 允许开发环境测试，但使用不同的GA ID
    setIsProduction(process.env.NODE_ENV === 'production');
    
    // 智能延迟加载策略
    const loadScriptsAfterDelay = () => {
      // 延迟3秒后开始加载非关键脚本
      setTimeout(() => {
        setShouldLoadScripts(true);
      }, 3000);
    };

    // 在用户交互后立即加载
    const handleUserInteraction = () => {
      if (!shouldLoadScripts) {
        setShouldLoadScripts(true);
        // 移除事件监听器，避免重复触发
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('scroll', handleUserInteraction);
        document.removeEventListener('keydown', handleUserInteraction);
      }
    };

    // 添加用户交互监听
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('scroll', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    // 启动延迟加载
    loadScriptsAfterDelay();

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  // 开发环境也加载脚本，但使用测试配置
  const shouldLoadGA = process.env.NEXT_PUBLIC_GA_ID || process.env.NODE_ENV === 'development';

  return (
    <>
      {/* Google Analytics 4 - 优化加载 */}
      {shouldLoadGA && (
        <>
          <Script
            id="gtag-config"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || 'G-TEST-ID'}`}
            onLoad={() => console.log('✅ GA4 script loaded')}
            onError={(e) => console.error('❌ GA4 script failed:', e)}
          />
          
          <Script
            id="gtag-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || 'G-TEST-ID'}', {
              page_title: document.title,
              page_location: window.location.href,
              anonymize_ip: true,
              allow_google_signals: false,
              allow_ad_personalization_signals: false,
              // 性能优化配置
              send_page_view: false, // 手动控制页面视图发送
              transport_type: 'beacon' // 使用beacon传输
            });
              `,
            }}
          />
        </>
      )}

      {/* Microsoft Clarity - 智能延迟加载 */}
      {shouldLoadScripts && (
        <Script
          id="clarity-init"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "ssdsoc827u");
            `,
          }}
          onLoad={() => console.log('✅ Clarity script loaded')}
          onError={(e) => console.error('❌ Clarity script failed:', e)}
        />
      )}

      {/* Google AdSense - 智能延迟加载 */}
      {shouldLoadScripts && (
        <Script
          id="adsense-init"
          strategy="lazyOnload"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5773162579508714"
          crossOrigin="anonymous"
          onLoad={() => console.log('✅ AdSense script loaded')}
          onError={(e) => console.error('❌ AdSense script failed:', e)}
        />
      )}
    </>
  );
}

/**
 * 优化的Chart.js加载组件
 */
export function OptimizedChartJS() {
  const [shouldLoadChart, setShouldLoadChart] = useState(false);

  useEffect(() => {
    // 检测是否需要Chart.js
    const checkChartNeeded = () => {
      // 检查是否有图表容器
      const chartContainers = document.querySelectorAll('[data-chart]');
      if (chartContainers.length > 0) {
        setShouldLoadChart(true);
      }
    };

    // 延迟检查，避免过早加载
    const timer = setTimeout(checkChartNeeded, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  if (!shouldLoadChart) {
    return null;
  }

  return (
    <Script
      id="chartjs"
      strategy="lazyOnload"
      src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"
      onLoad={() => console.log('✅ Chart.js loaded')}
      onError={(e) => console.error('❌ Chart.js failed:', e)}
    />
  );
}

/**
 * 优化的Lucide图标加载组件
 */
export function OptimizedLucide() {
  const [shouldLoadLucide, setShouldLoadLucide] = useState(false);

  useEffect(() => {
    // 检查是否需要Lucide图标
    const checkLucideNeeded = () => {
      // 检查是否有lucide图标元素
      const lucideElements = document.querySelectorAll('[data-lucide]');
      if (lucideElements.length > 0) {
        setShouldLoadLucide(true);
      }
    };

    // 延迟检查
    const timer = setTimeout(checkLucideNeeded, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (!shouldLoadLucide) {
    return null;
  }

  return (
    <Script
      id="lucide"
      strategy="lazyOnload"
      src="https://unpkg.com/lucide@latest"
      onLoad={() => console.log('✅ Lucide icons loaded')}
      onError={(e) => console.error('❌ Lucide icons failed:', e)}
    />
  );
}

// 性能监控功能已移至独立的PerformanceTracker组件，避免重复
