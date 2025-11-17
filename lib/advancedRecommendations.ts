/**
 * 高级推荐功能
 * 包括热门文章推荐、季节性推荐、趋势内容推荐等
 */

import { Article, getAllArticles } from './articles';
import { getArticleRecommendationStats } from './recommendationAnalytics';

/**
 * 获取热门文章推荐
 * 基于点击率和推荐次数
 */
export function getPopularArticles(
  locale: string = 'en',
  limit: number = 10,
  excludeSlugs?: string[]
): Article[] {
  const allArticles = getAllArticles(locale);

  // 为每篇文章计算热门度分数
  const scoredArticles = allArticles.map((article) => {
    const stats = getArticleRecommendationStats(article.slug);
    
    // 热门度算法：点击次数 + 点击率权重
    const popularityScore =
      stats.timesClicked * 2 + // 点击次数权重更高
      stats.clickThroughRate * 0.5 + // 点击率也很重要
      stats.timesRecommended * 0.1; // 曝光次数作为基础分

    return {
      article,
      popularityScore,
    };
  });

  // 过滤掉排除的文章
  let filteredArticles = scoredArticles;
  if (excludeSlugs && excludeSlugs.length > 0) {
    filteredArticles = scoredArticles.filter(
      (item) => !excludeSlugs.includes(item.article.slug)
    );
  }

  // 按热门度排序
  return filteredArticles
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, limit)
    .map((item) => item.article);
}

/**
 * 获取季节性推荐文章
 * 根据当前月份推荐相关主题的文章
 */
export function getSeasonalArticles(
  locale: string = 'en',
  limit: number = 5,
  excludeSlugs?: string[]
): Article[] {
  const allArticles = getAllArticles(locale);
  const currentMonth = new Date().getMonth(); // 0-11

  // 定义季节性标签和关键词
  const seasonalKeywords = getSeasonalKeywords(currentMonth);

  // 为每篇文章计算季节性相关度分数
  const scoredArticles = allArticles.map((article) => {
    let seasonalScore = 0;

    // 检查标签匹配
    const articleTags = locale === 'zh' ? article.tags_zh : article.tags;
    articleTags?.forEach((tag) => {
      if (seasonalKeywords.tags.includes(tag.toLowerCase())) {
        seasonalScore += 3;
      }
    });

    // 检查标题匹配
    const title = locale === 'zh' ? article.title_zh : article.title;
    seasonalKeywords.keywords.forEach((keyword) => {
      if (title?.toLowerCase().includes(keyword.toLowerCase())) {
        seasonalScore += 2;
      }
    });

    // 检查摘要匹配
    const summary = locale === 'zh' ? article.summary_zh : article.summary;
    seasonalKeywords.keywords.forEach((keyword) => {
      if (summary?.toLowerCase().includes(keyword.toLowerCase())) {
        seasonalScore += 1;
      }
    });

    return {
      article,
      seasonalScore,
    };
  });

  // 过滤掉排除的文章和分数为0的文章
  let filteredArticles = scoredArticles.filter((item) => item.seasonalScore > 0);
  if (excludeSlugs && excludeSlugs.length > 0) {
    filteredArticles = filteredArticles.filter(
      (item) => !excludeSlugs.includes(item.article.slug)
    );
  }

  // 按季节性相关度排序
  return filteredArticles
    .sort((a, b) => b.seasonalScore - a.seasonalScore)
    .slice(0, limit)
    .map((item) => item.article);
}

/**
 * 获取季节性关键词
 */
function getSeasonalKeywords(month: number): {
  tags: string[];
  keywords: string[];
} {
  // 春季 (3-5月)
  if (month >= 2 && month <= 4) {
    return {
      tags: ['运动', 'exercise', '户外', 'outdoor', '瑜伽', 'yoga'],
      keywords: ['春季', 'spring', '运动', 'exercise', '户外活动', 'outdoor'],
    };
  }

  // 夏季 (6-8月)
  if (month >= 5 && month <= 7) {
    return {
      tags: ['清凉', 'cooling', '防暑', 'heat', '游泳', 'swimming'],
      keywords: ['夏季', 'summer', '清凉', 'cool', '防暑', 'heat'],
    };
  }

  // 秋季 (9-11月)
  if (month >= 8 && month <= 10) {
    return {
      tags: ['滋补', 'nourishing', '养生', 'wellness', '调理', 'conditioning'],
      keywords: ['秋季', 'autumn', 'fall', '滋补', 'nourish', '养生', 'wellness'],
    };
  }

  // 冬季 (12-2月)
  return {
    tags: ['保暖', 'warmth', '温补', 'warming', '御寒', 'cold'],
    keywords: ['冬季', 'winter', '保暖', 'warm', '温补', 'warming', '御寒', 'cold'],
  };
}

/**
 * 获取趋势内容推荐
 * 基于最近发布且表现良好的文章
 */
export function getTrendingArticles(
  locale: string = 'en',
  limit: number = 5,
  excludeSlugs?: string[],
  daysRange: number = 30
): Article[] {
  const allArticles = getAllArticles(locale);
  const now = Date.now();
  const rangeMs = daysRange * 24 * 60 * 60 * 1000;

  // 筛选最近发布的文章
  const recentArticles = allArticles.filter((article) => {
    const articleDate = new Date(article.date).getTime();
    return now - articleDate <= rangeMs;
  });

  // 为每篇文章计算趋势分数
  const scoredArticles = recentArticles.map((article) => {
    const stats = getArticleRecommendationStats(article.slug);
    const articleDate = new Date(article.date).getTime();
    const daysOld = Math.floor((now - articleDate) / (24 * 60 * 60 * 1000));

    // 趋势算法：新鲜度 + 表现
    const freshnessScore = Math.max(0, daysRange - daysOld); // 越新分数越高
    const performanceScore = stats.timesClicked * 2 + stats.clickThroughRate;

    const trendingScore = freshnessScore * 0.6 + performanceScore * 0.4;

    return {
      article,
      trendingScore,
    };
  });

  // 过滤掉排除的文章
  let filteredArticles = scoredArticles;
  if (excludeSlugs && excludeSlugs.length > 0) {
    filteredArticles = scoredArticles.filter(
      (item) => !excludeSlugs.includes(item.article.slug)
    );
  }

  // 按趋势分数排序
  return filteredArticles
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, limit)
    .map((item) => item.article);
}

/**
 * 获取"编辑推荐"文章
 * 基于文章的 recommended 标记
 */
export function getEditorRecommendedArticles(
  locale: string = 'en',
  limit: number = 5,
  excludeSlugs?: string[]
): Article[] {
  const allArticles = getAllArticles(locale);

  // 筛选编辑推荐的文章
  let recommendedArticles = allArticles.filter(
    (article) => (article as any).recommended === true
  );

  // 过滤掉排除的文章
  if (excludeSlugs && excludeSlugs.length > 0) {
    recommendedArticles = recommendedArticles.filter(
      (article) => !excludeSlugs.includes(article.slug)
    );
  }

  // 按日期排序（最新优先）
  return recommendedArticles
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

/**
 * 混合推荐策略
 * 结合多种推荐算法，提供多样化的推荐结果
 */
export function getMixedRecommendations(
  locale: string = 'en',
  limit: number = 10,
  excludeSlugs?: string[]
): Article[] {
  const result: Article[] = [];
  const usedSlugs = new Set(excludeSlugs || []);

  // 1. 编辑推荐 (20%)
  const editorCount = Math.ceil(limit * 0.2);
  const editorRecommended = getEditorRecommendedArticles(
    locale,
    editorCount,
    Array.from(usedSlugs)
  );
  editorRecommended.forEach((article) => {
    result.push(article);
    usedSlugs.add(article.slug);
  });

  // 2. 热门文章 (40%)
  const popularCount = Math.ceil(limit * 0.4);
  const popular = getPopularArticles(
    locale,
    popularCount,
    Array.from(usedSlugs)
  );
  popular.forEach((article) => {
    result.push(article);
    usedSlugs.add(article.slug);
  });

  // 3. 趋势内容 (20%)
  const trendingCount = Math.ceil(limit * 0.2);
  const trending = getTrendingArticles(
    locale,
    trendingCount,
    Array.from(usedSlugs)
  );
  trending.forEach((article) => {
    result.push(article);
    usedSlugs.add(article.slug);
  });

  // 4. 季节性推荐 (20%)
  const seasonalCount = limit - result.length;
  const seasonal = getSeasonalArticles(
    locale,
    seasonalCount,
    Array.from(usedSlugs)
  );
  seasonal.forEach((article) => {
    result.push(article);
    usedSlugs.add(article.slug);
  });

  return result.slice(0, limit);
}
