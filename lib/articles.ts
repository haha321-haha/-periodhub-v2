import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  getCachedRecommendations,
  setCachedRecommendations,
} from './recommendationCache';
import { trackRecommendationDisplay } from './recommendationAnalytics';

export interface Article {
  slug: string;
  title: string;
  title_zh?: string;
  date: string;
  summary: string;
  summary_zh?: string;
  tags: string[];
  tags_zh?: string[];
  category: string;
  category_zh?: string;
  author: string;
  featured_image: string;
  reading_time: string;
  reading_time_zh?: string;
  content: string;
  seo_title?: string;
  seo_title_zh?: string;
  seo_description?: string;
  seo_description_zh?: string;
  canonical_url?: string;
  schema_type?: string;
}

const articlesDirectory = path.join(process.cwd(), "content/articles");

// ===== Day 2: 基于预生成索引的缓存和加载函数 =====

// 运行时缓存（基于预生成索引）
let cachedArticlesIndex: Record<string, Article[]> | null = null;

/**
 * 从预生成的索引加载文章列表
 * ✅ 避免运行时文件系统扫描
 * ✅ 兼容Vercel Edge Functions
 */
function loadArticlesIndex(): Record<string, Article[]> {
  if (cachedArticlesIndex !== null) {
    return cachedArticlesIndex;
  }

  try {
    const indexPath = path.join(process.cwd(), 'public/articles-index.json');
    const indexData = fs.readFileSync(indexPath, 'utf8');
    cachedArticlesIndex = JSON.parse(indexData);
    return cachedArticlesIndex;
  } catch (error) {
    console.error('❌ Failed to load articles index:', error);
    // 降级到空数组
    return { en: [], zh: [] };
  }
}

/**
 * 获取文章列表（分页）
 * ✅ 基于预生成索引
 * ✅ 支持分页参数
 * ✅ 不包含content字段
 */
export function getArticlesList(
  locale: string = 'en',
  page: number = 1,
  limit: number = 10
) {
  const articlesIndex = loadArticlesIndex();
  const articles = articlesIndex[locale] || [];

  // 按日期排序（最新优先）
  const sortedArticles = articles.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // 分页逻辑
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedArticles = sortedArticles.slice(startIndex, endIndex);

  return {
    articles: paginatedArticles,
    total: articles.length,
    page,
    limit,
    totalPages: Math.ceil(articles.length / limit)
  };
}

// ===== End Day 2 additions =====

// 递归扫描目录获取所有markdown文件
function scanDirectoryRecursively(
  dir: string,
  basePath: string = "",
): string[] {
  const files: string[] = [];

  try {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const itemPath = path.join(dir, item);
      const relativePath = basePath ? `${basePath}/${item}` : item;
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        // 递归扫描子目录
        const subFiles = scanDirectoryRecursively(itemPath, relativePath);
        files.push(...subFiles);
      } else if (item.endsWith(".md")) {
        // 添加markdown文件
        const slug = relativePath.replace(".md", "");
        files.push(slug);
      }
    }
  } catch (error) {
    console.warn(`扫描目录失败: ${dir}`, error);
  }

  return files;
}

export function getAllArticles(locale: string = "en"): Article[] {
  // Day 2: 使用预生成索引（保留向后兼容）
  const articlesIndex = loadArticlesIndex();
  const articles = articlesIndex[locale] || [];
  
  return articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

// Slug映射表 - 处理URL slug与实际文件名的映射
const slugMapping: Record<string, string> = {
  // IndexNow索引问题修复映射
  "personal-health-profile": "personal-menstrual-health-profile", // 主URL，保留映射
  "pain-complications-management": "menstrual-pain-complications-management",
  // 注意：health-tracking-and-analysis 已通过301重定向到 personal-health-profile
  "evidence-based-pain-guidance": "menstrual-pain-medical-guide",
  "sustainable-health-management": "menstrual-preventive-care-complete-plan",
  "anti-inflammatory-diet-guide": "anti-inflammatory-diet-period-pain",
  "iud-comprehensive-guide": "comprehensive-iud-guide",
  // 其他可能的映射
  "long-term-healthy-lifestyle-guide": "long-term-healthy-lifestyle-guide", // 新创建的文件
  // 404错误修复映射 - 已删除的文章重定向到相似主题
  "menstrual-nutrition-tcm-guide": "anti-inflammatory-diet-period-pain", // 营养主题映射到抗炎饮食
  // 新增：体质相关旧链接映射到综合自然与物理疗法指南（主题最相关，避免404）
  "tcm-constitution-complete-guide": "natural-physical-therapy-comprehensive-guide",
  // 修复：immediate-relief-methods 映射到5分钟快速缓解文章（最相关的即时缓解主题）
  "immediate-relief-methods": "5-minute-period-pain-relief",
};

export function getArticleBySlug(
  slug: string,
  locale: string = "en",
): Article | null {
  try {
    // 添加输入验证
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      console.warn(`[ARTICLES] Invalid slug provided: ${slug}`);
      return null;
    }
    
    if (!locale || typeof locale !== 'string' || !['en', 'zh'].includes(locale)) {
      console.warn(`[ARTICLES] Invalid locale provided: ${locale}`);
      return null;
    }

    const articlesPath =
      locale === "zh"
        ? path.join(articlesDirectory, "zh")
        : path.join(articlesDirectory, "en");

    // 首先尝试直接映射的slug
    const actualSlug = slugMapping[slug] || slug;
    let fullPath = path.join(articlesPath, `${actualSlug}.md`);

    // 如果映射的文件不存在，尝试原始slug
    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(articlesPath, `${slug}.md`);
    }

    // 如果直接文件不存在，尝试子目录结构
    if (!fs.existsSync(fullPath)) {
      // 处理子目录结构，如 pain-management/understanding-dysmenorrhea
      const slugParts = slug.split("/");
      if (slugParts.length > 1) {
        const subDirPath = path.join(articlesPath, ...slugParts.slice(0, -1));
        const fileName = `${slugParts[slugParts.length - 1]}.md`;
        fullPath = path.join(subDirPath, fileName);
      }
    }

    if (!fs.existsSync(fullPath)) {
      // 检查是否有映射建议
      const mappedSlug = slugMapping[slug];
      if (mappedSlug) {
        console.warn(
          `[ARTICLES] Article not found: ${slug} for locale: ${locale}. Attempted mapping to: ${mappedSlug}, but file still not found.`,
        );
      } else {
        console.warn(
          `[ARTICLES] Article not found: ${slug} for locale: ${locale}. No mapping available.`,
        );
      }
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || "",
      title_zh: data.title_zh,
      date: data.date || data.publishDate || "",
      summary: data.summary || "",
      summary_zh: data.summary_zh,
      tags: data.tags || [],
      tags_zh: data.tags_zh,
      category: data.category || "",
      category_zh: data.category_zh,
      author: data.author || "",
      featured_image: data.featured_image || "",
      reading_time: data.reading_time || "",
      reading_time_zh: data.reading_time_zh,
      content,
      seo_title: data.seo_title,
      seo_title_zh: data.seo_title_zh,
      seo_description: data.seo_description,
      seo_description_zh: data.seo_description_zh,
      canonical_url: data.canonical_url,
      schema_type: data.schema_type,
    };
  } catch (error) {
    console.error(`Error reading article ${slug}:`, error);
    return null;
  }
}

export function getArticlesByCategory(
  category: string,
  locale: string = "en",
): Article[] {
  const articles = getAllArticles(locale);
  const categoryKey = locale === "zh" ? "category_zh" : "category";

  return articles.filter((article) => {
    const articleCategory =
      locale === "zh" ? article.category_zh : article.category;
    return articleCategory === category;
  });
}

export function getArticlesByTag(
  tag: string,
  locale: string = "en",
): Article[] {
  const articles = getAllArticles(locale);
  const tagsKey = locale === "zh" ? "tags_zh" : "tags";

  return articles.filter((article) => {
    const articleTags = locale === "zh" ? article.tags_zh : article.tags;
    return articleTags?.includes(tag);
  });
}

export function getFeaturedArticles(
  locale: string = "en",
  limit: number = 3,
): Article[] {
  const articles = getAllArticles(locale);
  return articles.slice(0, limit);
}

// ===== 配置部分 =====
interface RecommendationConfig {
  weights: {
    category: number;
    tag: number;
    freshness: number;
    readingTime: number;
    random: number;
  };
  diversification: {
    sameCategoryRatio: number;
    differentCategoryRatio: number;
  };
  freshness: {
    recent: number;      // 30天内
    moderate: number;    // 60天内
    older: number;       // 90天内
  };
}

const DEFAULT_CONFIG: RecommendationConfig = {
  weights: {
    category: 5,
    tag: 2,
    freshness: 3,
    readingTime: 1,
    random: 2,
  },
  diversification: {
    sameCategoryRatio: 0.67,
    differentCategoryRatio: 0.33,
  },
  freshness: {
    recent: 3,
    moderate: 2,
    older: 1,
  },
};

// ===== 智能推荐函数 =====
export function getRelatedArticlesSmart(
  currentSlug: string,
  locale: string = "en",
  limit: number = 3,
  userHistory?: string[],
  config: RecommendationConfig = DEFAULT_CONFIG,
): Article[] {
  const currentArticle = getArticleBySlug(currentSlug, locale);
  if (!currentArticle) return [];

  const allArticles = getAllArticles(locale);
  let otherArticles = allArticles.filter(
    (article) => article.slug !== currentSlug,
  );

  // 过滤掉用户已读文章
  if (userHistory && userHistory.length > 0) {
    otherArticles = otherArticles.filter(
      (article) => !userHistory.includes(article.slug)
    );
  }

  // 阶段1：增强评分算法
  const scoredArticles = otherArticles.map((article) => {
    let score = 0;

    // 1. 分类匹配
    const currentCategory =
      locale === "zh" ? currentArticle.category_zh : currentArticle.category;
    const articleCategory =
      locale === "zh" ? article.category_zh : article.category;
    const isSameCategory = currentCategory === articleCategory;
    if (isSameCategory) {
      score += config.weights.category;
    }

    // 2. 标签匹配
    const currentTags =
      locale === "zh" ? currentArticle.tags_zh : currentArticle.tags;
    const articleTags = locale === "zh" ? article.tags_zh : article.tags;
    const sharedTags =
      currentTags?.filter((tag) => articleTags?.includes(tag)) || [];
    score += sharedTags.length * config.weights.tag;

    // 3. 文章新鲜度
    const articleDate = new Date(article.date);
    const daysSincePublished = Math.floor(
      (Date.now() - articleDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSincePublished <= 30) {
      score += config.freshness.recent;
    } else if (daysSincePublished <= 60) {
      score += config.freshness.moderate;
    } else if (daysSincePublished <= 90) {
      score += config.freshness.older;
    }

    // 4. 阅读时间相似度
    const currentReadingTime = parseInt(currentArticle.reading_time) || 0;
    const articleReadingTime = parseInt(article.reading_time) || 0;
    const readingTimeDiff = Math.abs(currentReadingTime - articleReadingTime);
    if (readingTimeDiff <= 5) {
      score += config.weights.readingTime;
    }

    // 5. 随机因素
    const randomBoost = Math.random() * config.weights.random;
    score += randomBoost;

    return { article, score, isSameCategory };
  });

  // 阶段2：应用多样化规则
  const sameCategory = scoredArticles.filter((item) => item.isSameCategory);
  const differentCategory = scoredArticles.filter((item) => !item.isSameCategory);

  // 排序
  const sortByScore = (a: typeof scoredArticles[0], b: typeof scoredArticles[0]) => {
    if (Math.abs(b.score - a.score) < 0.5) {
      return new Date(b.article.date).getTime() - new Date(a.article.date).getTime();
    }
    return b.score - a.score;
  };

  sameCategory.sort(sortByScore);
  differentCategory.sort(sortByScore);

  // 计算推荐比例
  const sameCategoryCount = Math.ceil(limit * config.diversification.sameCategoryRatio);
  const differentCategoryCount = limit - sameCategoryCount;

  // 混合推荐
  const result: Article[] = [];
  result.push(...sameCategory.slice(0, sameCategoryCount).map((item) => item.article));
  result.push(...differentCategory.slice(0, differentCategoryCount).map((item) => item.article));

  // 如果不够，用另一组补充
  if (result.length < limit) {
    const remaining = limit - result.length;
    if (sameCategory.length > sameCategoryCount) {
      result.push(
        ...sameCategory
          .slice(sameCategoryCount, sameCategoryCount + remaining)
          .map((item) => item.article)
      );
    } else if (differentCategory.length > differentCategoryCount) {
      result.push(
        ...differentCategory
          .slice(differentCategoryCount, differentCategoryCount + remaining)
          .map((item) => item.article)
      );
    }
  }

  return result.slice(0, limit);
}

// ===== 带缓存的推荐函数 =====
export function getRelatedArticlesWithCache(
  currentSlug: string,
  locale: string = "en",
  limit: number = 3,
  userHistory?: string[],
): Article[] {
  // 尝试从缓存获取
  const cached = getCachedRecommendations(currentSlug, locale, limit, userHistory);
  if (cached && cached.length >= limit) {
    console.log(`[Articles] Cache hit for ${currentSlug}`);
    return cached;
  }

  // 计算推荐
  const recommendations = getRelatedArticlesSmart(
    currentSlug,
    locale,
    limit,
    userHistory
  );

  // 缓存结果
  if (recommendations.length > 0) {
    setCachedRecommendations(currentSlug, locale, limit, recommendations);
  }

  // 追踪推荐展示
  trackRecommendationDisplay(
    currentSlug,
    recommendations.map((a) => a.slug),
    locale
  );

  return recommendations;
}

// ===== 向后兼容的包装函数 =====
export function getRelatedArticles(
  currentSlug: string,
  locale: string = "en",
  limit: number = 3,
): Article[] {
  // 默认使用带缓存的版本
  return getRelatedArticlesWithCache(currentSlug, locale, limit);
}

export function getAllCategories(locale: string = "en"): string[] {
  const articles = getAllArticles(locale);
  const categoryKey = locale === "zh" ? "category_zh" : "category";

  const categories = articles
    .map((article) => {
      return locale === "zh" ? article.category_zh : article.category;
    })
    .filter(Boolean) as string[];

  return [...new Set(categories)];
}

export function getAllTags(locale: string = "en"): string[] {
  const articles = getAllArticles(locale);
  const tagsKey = locale === "zh" ? "tags_zh" : "tags";

  const allTags = articles
    .flatMap((article) => {
      return locale === "zh" ? article.tags_zh : article.tags;
    })
    .filter(Boolean) as string[];

  return [...new Set(allTags)];
}
