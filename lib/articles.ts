import fs from "fs";
import path from "path";
import matter from "gray-matter";

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
      console.warn(`[ARTICLES] Article not found: ${slug} for locale: ${locale}`);
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

export function getRelatedArticles(
  currentSlug: string,
  locale: string = "en",
  limit: number = 3,
): Article[] {
  const currentArticle = getArticleBySlug(currentSlug, locale);
  if (!currentArticle) return [];

  const allArticles = getAllArticles(locale);
  const otherArticles = allArticles.filter(
    (article) => article.slug !== currentSlug,
  );

  // Score articles based on shared tags and category
  const scoredArticles = otherArticles.map((article) => {
    let score = 0;

    // Same category gets higher score
    const currentCategory =
      locale === "zh" ? currentArticle.category_zh : currentArticle.category;
    const articleCategory =
      locale === "zh" ? article.category_zh : article.category;
    if (currentCategory === articleCategory) {
      score += 3;
    }

    // Shared tags get points
    const currentTags =
      locale === "zh" ? currentArticle.tags_zh : currentArticle.tags;
    const articleTags = locale === "zh" ? article.tags_zh : article.tags;
    const sharedTags =
      currentTags?.filter((tag) => articleTags?.includes(tag)) || [];
    score += sharedTags.length;

    return { article, score };
  });

  // Sort by score and return top articles
  return scoredArticles
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.article);
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
