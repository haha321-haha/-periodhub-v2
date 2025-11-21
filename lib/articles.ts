/**
 * Articles Library - 文章管理工具
 * 管理文章数据和相关功能
 */

export interface Article {
  slug: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  featured: boolean;
  // 兼容性属性
  title_zh?: string;
  seo_title_zh?: string;
  summary?: string;
  summary_zh?: string;
}

// 文章数据（示例）
const ARTICLES: Article[] = [
  {
    slug: "comprehensive-medical-guide-to-dysmenorrhea",
    title: "Comprehensive Medical Guide to Dysmenorrhea",
    titleZh: "痛经全面医学指南",
    title_zh: "痛经全面医学指南",
    description:
      "Evidence-based guide to understanding and managing period pain",
    descriptionZh: "基于循证医学的痛经理解和管理指南",
    summary: "Evidence-based guide to understanding and managing period pain",
    summary_zh: "基于循证医学的痛经理解和管理指南",
    category: "medical-guide",
    tags: ["dysmenorrhea", "period-pain", "pain-management"],
    publishedAt: "2024-12-19",
    updatedAt: "2024-12-19",
    readingTime: 15,
    featured: true,
  },
  {
    slug: "when-to-seek-medical-care-comprehensive-guide",
    title: "When to Seek Medical Care: Comprehensive Guide",
    titleZh: "何时就医：综合指南",
    title_zh: "何时就医：综合指南",
    description: "Learn when period pain requires medical attention",
    descriptionZh: "了解何时痛经需要就医",
    summary: "Learn when period pain requires medical attention",
    summary_zh: "了解何时痛经需要就医",
    category: "medical-guide",
    tags: ["medical-care", "symptoms", "health"],
    publishedAt: "2024-12-19",
    updatedAt: "2024-12-19",
    readingTime: 10,
    featured: true,
  },
];

/**
 * 获取所有文章
 */
export function getAllArticles(): Article[] {
  return ARTICLES;
}

/**
 * 根据 slug 获取文章
 */
export function getArticleBySlug(slug: string): Article | null {
  return ARTICLES.find((article) => article.slug === slug) || null;
}

/**
 * 获取相关文章（带缓存）
 */
export function getRelatedArticlesWithCache(
  currentSlug: string,
  locale: string,
  count: number = 3,
): Article[] {
  const currentArticle = getArticleBySlug(currentSlug);
  if (!currentArticle) return [];

  // 简单的相关文章逻辑：同类别的其他文章
  return ARTICLES.filter(
    (article) =>
      article.slug !== currentSlug &&
      article.category === currentArticle.category,
  ).slice(0, count);
}

/**
 * 获取特色文章
 */
export function getFeaturedArticles(count: number = 5): Article[] {
  return ARTICLES.filter((article) => article.featured).slice(0, count);
}

/**
 * 按类别获取文章
 */
export function getArticlesByCategory(category: string): Article[] {
  return ARTICLES.filter((article) => article.category === category);
}

/**
 * 搜索文章
 */
export function searchArticles(
  query: string,
  locale: string = "en",
): Article[] {
  const lowerQuery = query.toLowerCase();

  return ARTICLES.filter((article) => {
    const title = locale === "zh" ? article.titleZh : article.title;
    const description =
      locale === "zh" ? article.descriptionZh : article.description;

    return (
      title.toLowerCase().includes(lowerQuery) ||
      description.toLowerCase().includes(lowerQuery) ||
      article.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  });
}

/**
 * 获取相关文章
 */
export function getRelatedArticles(
  currentSlug: string,
  locale: string,
  count: number = 3,
): Article[] {
  const currentArticle = getArticleBySlug(currentSlug);
  if (!currentArticle) return [];

  // 简单的相关文章逻辑：同类别的其他文章
  return ARTICLES.filter(
    (article) =>
      article.slug !== currentSlug &&
      article.category === currentArticle.category,
  ).slice(0, count);
}
