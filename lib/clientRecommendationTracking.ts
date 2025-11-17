/**
 * 客户端推荐追踪工具
 * 用于在浏览器中追踪用户对推荐文章的点击
 */

/**
 * 追踪推荐文章点击
 * 在用户点击推荐文章时调用
 */
export function trackRecommendationClick(
  currentArticleSlug: string,
  clickedArticleSlug: string,
  recommendedArticles: string[],
  locale: string,
): void {
  // 发送到分析API
  if (typeof window !== 'undefined') {
    // 使用 navigator.sendBeacon 确保数据发送
    const data = {
      type: 'recommendation_click',
      currentArticle: currentArticleSlug,
      clickedArticle: clickedArticleSlug,
      recommendedArticles,
      locale,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    };

    // 发送到自己的分析端点
    const apiData = {
      currentArticle: currentArticleSlug,
      clickedArticle: clickedArticleSlug,
      recommendedArticles,
      locale,
    };
    
    // 使用 fetch 发送数据
    fetch('/api/recommendation-click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiData),
      keepalive: true, // 确保页面卸载时也能发送
    }).catch((error) => {
      console.error('Failed to track recommendation click:', error);
    });

    // 或者使用 Google Analytics
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'recommendation_click', {
        event_category: 'Article Recommendations',
        event_label: `${currentArticleSlug} -> ${clickedArticleSlug}`,
        value: 1,
      });
    }

    // 控制台日志（开发环境）
    if (process.env.NODE_ENV === 'development') {
      console.log('[RecommendationTracking] Click tracked:', data);
    }
  }
}

/**
 * 追踪推荐文章展示
 * 在推荐文章显示时调用
 */
export function trackRecommendationDisplay(
  currentArticleSlug: string,
  recommendedArticles: string[],
  locale: string,
): void {
  if (typeof window !== 'undefined') {
    const data = {
      type: 'recommendation_display',
      currentArticle: currentArticleSlug,
      recommendedArticles,
      locale,
      timestamp: Date.now(),
    };

    // 可以发送到自己的分析端点
    // navigator.sendBeacon('/api/analytics/recommendation-display', JSON.stringify(data));

    // 或者使用 Google Analytics
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'recommendation_display', {
        event_category: 'Article Recommendations',
        event_label: currentArticleSlug,
        value: recommendedArticles.length,
      });
    }

    // 控制台日志（开发环境）
    if (process.env.NODE_ENV === 'development') {
      console.log('[RecommendationTracking] Display tracked:', data);
    }
  }
}

/**
 * 初始化推荐追踪
 * 在文章页面加载时调用
 */
export function initRecommendationTracking(
  currentArticleSlug: string,
  recommendedArticles: string[],
  locale: string,
): void {
  // 追踪展示
  trackRecommendationDisplay(currentArticleSlug, recommendedArticles, locale);

  // 为推荐链接添加点击事件监听
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // 等待 DOM 加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        attachClickListeners(currentArticleSlug, recommendedArticles, locale);
      });
    } else {
      attachClickListeners(currentArticleSlug, recommendedArticles, locale);
    }
  }
}

/**
 * 为推荐链接添加点击监听器
 */
function attachClickListeners(
  currentArticleSlug: string,
  recommendedArticles: string[],
  locale: string,
): void {
  // 查找所有推荐文章链接
  recommendedArticles.forEach((slug) => {
    const links = document.querySelectorAll(`a[href*="${slug}"]`);
    links.forEach((link) => {
      link.addEventListener('click', () => {
        trackRecommendationClick(
          currentArticleSlug,
          slug,
          recommendedArticles,
          locale
        );
      });
    });
  });
}

// TypeScript 类型声明
// 注意：gtag 类型已在项目其他地方定义，这里不需要重复声明
