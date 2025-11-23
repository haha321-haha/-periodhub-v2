/**
 * Recommendation Cache - 推荐缓存管理
 * 缓存文章推荐结果以提高性能
 */

// Using direct localStorage API instead of LocalStorageManager

export interface CachedRecommendation {
  articleSlug: string;
  recommendations: string[];
  timestamp: number;
  locale: string;
}

const CACHE_KEY_PREFIX = "recommendation_cache_";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * 获取缓存的推荐
 */
export function getCachedRecommendations(
  articleSlug: string,
  locale: string,
): string[] | null {
  const cacheKey = `${CACHE_KEY_PREFIX}${articleSlug}_${locale}`;
  const cached = LocalStorageManager.getItem<CachedRecommendation>(cacheKey);

  if (!cached) return null;

  // 检查缓存是否过期
  const now = Date.now();
  if (now - cached.timestamp > CACHE_DURATION) {
    LocalStorageManager.removeItem(cacheKey);
    return null;
  }

  return cached.recommendations;
}

/**
 * 设置推荐缓存
 */
export function setCachedRecommendations(
  articleSlug: string,
  locale: string,
  recommendations: string[],
): boolean {
  const cacheKey = `${CACHE_KEY_PREFIX}${articleSlug}_${locale}`;
  const cached: CachedRecommendation = {
    articleSlug,
    recommendations,
    timestamp: Date.now(),
    locale,
  };

  try {
    if (typeof window === "undefined") return false;
    localStorage.setItem(cacheKey, JSON.stringify(cached));
    return true;
  } catch {
    return false;
  }
}

/**
 * 清除特定文章的缓存
 */
export function clearRecommendationCache(
  articleSlug: string,
  locale: string,
): boolean {
  const cacheKey = `${CACHE_KEY_PREFIX}${articleSlug}_${locale}`;
  try {
    if (typeof window === "undefined") return false;
    localStorage.removeItem(cacheKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * 清除所有推荐缓存
 */
export function clearAllRecommendationCache(): void {
  if (typeof window === "undefined") return;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(CACHE_KEY_PREFIX)) {
      localStorage.removeItem(key);
    }
  }
}

/**
 * 获取缓存统计
 */
export function getRecommendationCacheStats() {
  const keys = LocalStorageManager.getAllKeys();
  const cacheKeys = keys.filter((key) => key.startsWith(CACHE_KEY_PREFIX));

  let totalSize = 0;
  let expiredCount = 0;
  const now = Date.now();

  cacheKeys.forEach((key) => {
    const stored = localStorage.getItem(key);
    if (!stored) continue;
    const cached = JSON.parse(stored) as CachedRecommendation;
    if (cached) {
      totalSize += JSON.stringify(cached).length;
      if (now - cached.timestamp > CACHE_DURATION) {
        expiredCount++;
      }
    }
  });

  return {
    totalCached: cacheKeys.length,
    expiredCount,
    totalSize,
    averageSize: cacheKeys.length > 0 ? totalSize / cacheKeys.length : 0,
  };
}

/**
 * 获取缓存统计（别名，兼容性）
 */
export function getCacheStats() {
  return getRecommendationCacheStats();
}
