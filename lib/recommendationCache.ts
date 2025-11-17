/**
 * 推荐缓存系统
 * 用于缓存文章推荐结果，提升性能
 */

import { Article } from './articles';

interface CacheEntry {
  articles: Article[];
  timestamp: number;
}

// 缓存存储
const recommendationCache = new Map<string, CacheEntry>();

// 缓存配置
const CACHE_TTL = 3600000; // 1小时（毫秒）
const MAX_CACHE_SIZE = 1000; // 最大缓存条目数

/**
 * 生成缓存键
 */
function generateCacheKey(
  currentSlug: string,
  locale: string,
  limit: number,
): string {
  return `${currentSlug}-${locale}-${limit}`;
}

/**
 * 获取缓存的推荐结果
 */
export function getCachedRecommendations(
  currentSlug: string,
  locale: string,
  limit: number,
  userHistory?: string[],
): Article[] | null {
  const cacheKey = generateCacheKey(currentSlug, locale, limit);

  // 检查缓存
  const cached = recommendationCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    // 如果有用户历史，过滤掉已读文章
    if (userHistory && userHistory.length > 0) {
      const filtered = cached.articles.filter(
        (article) => !userHistory.includes(article.slug)
      );
      // 如果过滤后数量不足，返回null重新计算
      if (filtered.length < limit) {
        return null;
      }
      return filtered.slice(0, limit);
    }
    return cached.articles;
  }

  return null;
}

/**
 * 设置缓存的推荐结果
 */
export function setCachedRecommendations(
  currentSlug: string,
  locale: string,
  limit: number,
  articles: Article[],
): void {
  const cacheKey = generateCacheKey(currentSlug, locale, limit);
  
  recommendationCache.set(cacheKey, {
    articles,
    timestamp: Date.now(),
  });

  // 定期清理过期缓存
  if (recommendationCache.size > MAX_CACHE_SIZE) {
    cleanupExpiredCache();
  }
}

/**
 * 清理过期缓存
 */
function cleanupExpiredCache(): void {
  const now = Date.now();
  const keysToDelete: string[] = [];

  for (const [key, entry] of recommendationCache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      keysToDelete.push(key);
    }
  }

  keysToDelete.forEach((key) => recommendationCache.delete(key));

  console.log(`[RecommendationCache] Cleaned up ${keysToDelete.length} expired entries`);
}

/**
 * 清空所有缓存
 */
export function clearRecommendationCache(): void {
  recommendationCache.clear();
  console.log('[RecommendationCache] All cache cleared');
}

/**
 * 获取缓存统计信息
 */
export function getCacheStats(): {
  size: number;
  maxSize: number;
  ttl: number;
} {
  return {
    size: recommendationCache.size,
    maxSize: MAX_CACHE_SIZE,
    ttl: CACHE_TTL,
  };
}
