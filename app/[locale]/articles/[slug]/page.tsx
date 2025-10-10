import React from "react";
import { notFound } from "next/navigation";
import { unstable_setRequestLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
// import fs from "fs";
// import path from "path";
// import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { getArticleBySlug, getRelatedArticles } from "@/lib/articles";
import {
  generateArticleStructuredData,
  ArticleStructuredDataScript,
} from "@/lib/seo/article-structured-data";
import {
  generateBreadcrumbStructuredData,
  BreadcrumbStructuredDataScript,
} from "@/lib/seo/breadcrumb-structured-data";

// 按需导入Lucide React图标 - 第三方脚本优化（移除ssr: false）
const Home = dynamic(() =>
  import("lucide-react").then((mod) => ({ default: mod.Home })),
);

// 优化的懒加载组件 - 代码分割优化（Server Component兼容）
const NSAIDInteractive = dynamic(
  () => import("@/components/NSAIDInteractive"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
    ),
  },
);

const NSAIDContentSimple = dynamic(
  () => import("@/components/NSAIDContentSimple"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-24 rounded-lg" />
    ),
  },
);

// const StructuredData = dynamic(() => import("@/components/StructuredData"));

const ArticleInteractions = dynamic(
  () => import("@/components/ArticleInteractions"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-16 rounded-lg" />
    ),
  },
);

const ReadingProgress = dynamic(() => import("@/components/ReadingProgress"));

const TableOfContents = dynamic(() => import("@/components/TableOfContents"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-48 rounded-lg" />,
});

const MarkdownWithMermaid = dynamic(
  () => import("@/components/MarkdownWithMermaid"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
    ),
  },
);

// Server Component面包屑组件
interface BreadcrumbItem {
  label: string;
  href?: string;
}

function ServerBreadcrumb({
  items,
}: {
  items: BreadcrumbItem[];
  locale: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <li className="flex items-center">
                <span className="text-gray-400 mx-2">/</span>
              </li>
            )}
            <li>
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-primary-600 transition-colors flex items-center"
                >
                  {index === 0 && <Home className="w-4 h-4 mr-1" />}
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">{item.label}</span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}

// Types
type Locale = "en" | "zh";

// Article interface
// interface Article {
//   slug: string;
//   title: string;
//   title_zh?: string;
//   date: string;
//   summary: string;
//   summary_zh?: string;
//   tags: string[];
//   tags_zh?: string[];
//   category: string;
//   category_zh?: string;
//   author: string;
//   featured_image: string;
//   reading_time: string;
//   reading_time_zh?: string;
//   content: string;
//   seo_title?: string;
//   seo_title_zh?: string;
//   seo_description?: string;
//   seo_description_zh?: string;
//   canonical_url?: string;
//   schema_type?: string;
// }

// 使用lib/articles.ts中的函数

// 移除本地定义，使用lib/articles.ts中的函数

// Generate static params for all articles
export async function generateStaticParams() {
  const locales: Locale[] = ["en", "zh"];
  const articleSlugs = [
    // 现有文章保持不变
    "5-minute-period-pain-relief",
    "anti-inflammatory-diet-period-pain",
    "comprehensive-iud-guide",
    "comprehensive-medical-guide-to-dysmenorrhea",
    "essential-oils-aromatherapy-menstrual-pain-guide",
    "global-traditional-menstrual-pain-relief",
    "heat-therapy-complete-guide",
    "herbal-tea-menstrual-pain-relief",
    "hidden-culprits-of-menstrual-pain",
    "home-natural-menstrual-pain-relief",
    "magnesium-gut-health-comprehensive-guide",
    "menstrual-nausea-relief-guide",
    "menstrual-pain-accompanying-symptoms-guide",
    "menstrual-pain-complications-management",
    "menstrual-pain-faq-expert-answers",
    "menstrual-pain-medical-guide",
    "menstrual-pain-vs-other-abdominal-pain-guide",
    "natural-physical-therapy-comprehensive-guide",
    "nsaid-menstrual-pain-professional-guide",
    "period-friendly-recipes",
    "personal-menstrual-health-profile",
    "recommended-reading-list",
    "specific-menstrual-pain-management-guide",
    "comprehensive-menstrual-sleep-quality-guide",
    "menstrual-pain-research-progress-2024",
    "menstrual-preventive-care-complete-plan",
    "menstrual-stress-management-complete-guide",
    "understanding-your-cycle",
    "us-menstrual-pain-insurance-coverage-guide",
    "when-to-see-doctor-period-pain",
    "when-to-seek-medical-care-comprehensive-guide",
    "womens-lifecycle-menstrual-pain-analysis",
    "zhan-zhuang-baduanjin-for-menstrual-pain-relief",

    // 🔧 添加缺失的文章slug（修复404错误）
    "ginger-menstrual-pain-relief-guide", // immediate-5
    "comprehensive-report-non-medical-factors-menstrual-pain", // management-1 & management-7
    "period-pain-simulator-accuracy-analysis", // management-8
    "medication-vs-natural-remedies-menstrual-pain", // management-9

    // 🚨 修复IndexNow索引问题 - 添加缺失的slug映射
    "pain-complications-management", // 对应 menstrual-pain-complications-management
    "health-tracking-and-analysis", // 对应 personal-menstrual-health-profile
    "evidence-based-pain-guidance", // 对应 menstrual-pain-medical-guide
    "sustainable-health-management", // 对应 menstrual-preventive-care-complete-plan
    "personal-health-profile", // 已存在，确保包含
    "anti-inflammatory-diet-guide", // 对应 anti-inflammatory-diet-period-pain
    "long-term-healthy-lifestyle-guide", // 需要创建对应文章
    "iud-comprehensive-guide", // 对应 comprehensive-iud-guide
  ];

  const params = [];
  for (const locale of locales) {
    for (const slug of articleSlugs) {
      params.push({ locale, slug });
    }
  }

  return params;
}

// Generate metadata for the article
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug, locale);

  if (!article) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    };
  }

  const title =
    locale === "zh" ? article.title_zh || article.title : article.title;
  const description =
    locale === "zh" ? article.summary_zh || article.summary : article.summary;
  const seoTitle =
    locale === "zh"
      ? article.seo_title_zh || title
      : article.seo_title || title;
  const seoDescription =
    locale === "zh"
      ? article.seo_description_zh || description
      : article.seo_description || description;
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";
  const canonicalUrl = article.canonical_url || `/${locale}/articles/${slug}`;
  const articleUrl = `${baseUrl}${canonicalUrl}`;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: locale === "zh" ? article.tags_zh : article.tags,
    authors: [{ name: article.author }],
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: articleUrl,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
      images: article.featured_image
        ? [
            {
              url: article.featured_image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
      locale: locale === "zh" ? "zh_CN" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: article.featured_image ? [article.featured_image] : undefined,
    },
    alternates: {
      canonical: articleUrl,
      languages: {
        "en-US": `${baseUrl}/en/articles/${slug}`,
        "zh-CN": `${baseUrl}/zh/articles/${slug}`,
        "x-default": `${baseUrl}/en/articles/${slug}`,
      },
    },
    other: {
      "article:published_time": article.date,
      "article:author": article.author,
      "Content-Language": locale === "zh" ? "zh-CN" : "en-US",
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  unstable_setRequestLocale(locale);

  // 🔍 生产性能监控开始
  const requestStart = Date.now();

  try {
    // eslint-disable-next-line no-console
    // eslint-disable-next-line no-console
    // eslint-disable-next-line no-console
    console.log(
      `[PROD-MONITOR] Request start: ${locale}/${slug} at ${new Date().toISOString()}`,
    );

    // 检测冷启动
    const coldStartCheck = Date.now();
    if (!(global as Record<string, unknown>).isWarm) {
      (global as Record<string, unknown>).isWarm = true;
      // eslint-disable-next-line no-console
      // eslint-disable-next-line no-console
      console.log(
        `[PROD-MONITOR] Cold start detected - initialization: ${
          Date.now() - coldStartCheck
        }ms`,
      );
    } else {
      // eslint-disable-next-line no-console
      console.log(
        `[PROD-MONITOR] Warm start - check: ${Date.now() - coldStartCheck}ms`,
      );
    }

    // 文章获取计时
    const articleFetchStart = Date.now();
    // eslint-disable-next-line no-console
    // eslint-disable-next-line no-console
    console.log("ArticlePage - Processing:", { locale, slug });

    const article = await getArticleBySlug(slug, locale);
    const articleFetchTime = Date.now() - articleFetchStart;
    // eslint-disable-next-line no-console
    // eslint-disable-next-line no-console
    console.log(`[PROD-MONITOR] Article fetch: ${articleFetchTime}ms`);
    // eslint-disable-next-line no-console
    // eslint-disable-next-line no-console
    console.log("ArticlePage - Article found:", !!article, article?.title);

    if (!article) {
      console.error(`Article not found: ${slug} for locale: ${locale}`);
      notFound();
    }

    // 相关文章计算计时
    const relatedArticlesStart = Date.now();
    const relatedArticles = await getRelatedArticles(slug, locale, 3);
    const relatedArticlesTime = Date.now() - relatedArticlesStart;
    // eslint-disable-next-line no-console
    // eslint-disable-next-line no-console
    console.log(
      `[PROD-MONITOR] Related articles calculation: ${relatedArticlesTime}ms`,
    );
    // eslint-disable-next-line no-console
    // eslint-disable-next-line no-console
    console.log(
      "ArticlePage - Related articles found:",
      relatedArticles.length,
    );

    const t = await getTranslations({ locale, namespace: "articlePage" });

    const title =
      locale === "zh" ? article.title_zh || article.title : article.title;
    const summary =
      locale === "zh" ? article.summary_zh || article.summary : article.summary;
    // 将category转换为安全的翻译键名
    const categoryKey = article.category
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\u4e00-\u9fff-]/g, "");

    const category =
      locale === "zh"
        ? article.category_zh || t(`tags.${categoryKey}`) || article.category
        : t(`tags.${categoryKey}`) || article.category;
    const readingTime =
      locale === "zh"
        ? article.reading_time_zh || article.reading_time
        : article.reading_time;

    // Check if this is the NSAID article that needs interactive components
    const isNSAIDArticle = slug === "nsaid-menstrual-pain-professional-guide";

    // Check if this article contains Mermaid charts
    const hasMermaidCharts = article.content.includes("```mermaid");

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";
    const articleUrl = `${baseUrl}/${locale}/articles/${slug}`;

    // 🔍 渲染准备完成计时
    const renderPrepTime = Date.now() - requestStart;
    // eslint-disable-next-line no-console
    // eslint-disable-next-line no-console
    console.log(
      `[PROD-MONITOR] Render preparation completed: ${renderPrepTime}ms`,
    );
    // eslint-disable-next-line no-console
    // eslint-disable-next-line no-console
    console.log(
      `[PROD-MONITOR] Component breakdown - Article: ${articleFetchTime}ms, Related: ${relatedArticlesTime}ms, Other: ${
        renderPrepTime - articleFetchTime - relatedArticlesTime
      }ms`,
    );

    // 生成增强的结构化数据
    const articleStructuredData = await generateArticleStructuredData({
      locale,
      slug,
      title,
      description: summary || "",
      author: article.author,
      datePublished: article.date,
      dateModified: article.date,
      image: article.featured_image,
      breadcrumbs: [
        {
          name: t("breadcrumb.articles"),
          url: `${baseUrl}/${locale}/downloads`,
        },
        { name: title, url: articleUrl },
      ],
    });

    // 生成面包屑结构化数据
    const breadcrumbStructuredData = generateBreadcrumbStructuredData({
      locale,
      path: `/articles/${slug}`,
      breadcrumbs: [
        {
          name: t("breadcrumb.articles"),
          url: `${baseUrl}/${locale}/downloads`,
        },
        { name: title, url: articleUrl },
      ],
    });

    return (
      <div className="min-h-screen bg-neutral-50">
        {/* 增强的SEO结构化数据 */}
        <ArticleStructuredDataScript data={articleStructuredData} />
        <BreadcrumbStructuredDataScript data={breadcrumbStructuredData} />

        {/* 阅读进度条和返回顶部 */}
        <ReadingProgress locale={locale} />

        {/* Load NSAID interactive components if needed */}
        {isNSAIDArticle && <NSAIDInteractive locale={locale} />}

        <div className="space-y-6 sm:space-y-8">
          {/* Breadcrumb */}
          <div className="container-custom">
            <ServerBreadcrumb
              locale={locale}
              items={[
                {
                  label: t("breadcrumb.home"),
                  href: `/${locale}`,
                },
                {
                  label: t("breadcrumb.articles"),
                  href: `/${locale}/downloads`,
                },
                { label: title },
              ]}
            />
          </div>

          {/* Article Header */}
          <header className="bg-white border-b border-gray-100">
            <div className="container-custom py-6 sm:py-8">
              <div className="max-w-4xl mx-auto">
                {/* Category and Meta Info */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-neutral-600 mb-4">
                  <span className="bg-primary-100 text-primary-700 px-2 sm:px-3 py-1 rounded-full font-medium">
                    {category}
                  </span>
                  <time
                    dateTime={article.date}
                    className="flex items-center gap-1"
                  >
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {new Date(article.date).toLocaleDateString(
                      locale === "zh" ? "zh-CN" : "en-US",
                    )}
                  </time>
                  {readingTime && (
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {readingTime}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 mb-3 sm:mb-4 leading-tight">
                  {title}
                </h1>

                {/* Summary */}
                {summary && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 sm:p-6 mb-6 rounded-r-lg">
                    <h2 className="text-sm sm:text-base font-semibold text-blue-800 mb-2">
                      {t("content.articleSummary")}
                    </h2>
                    <p className="text-sm sm:text-base text-blue-700 leading-relaxed">
                      {summary}
                    </p>
                  </div>
                )}

                {/* Author and Article Stats */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold text-sm sm:text-base">
                        {article.author?.charAt(0) || "P"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm sm:text-base text-neutral-800">
                        {article.author || "Period Health Team"}
                      </p>
                      <p className="text-xs sm:text-sm text-neutral-600">
                        {t("content.healthExpert")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Article Content with Sidebar */}
          <main className="container-custom">
            <div className="max-w-6xl mx-auto">
              <div className="lg:grid lg:grid-cols-4 lg:gap-8">
                {/* Main Content */}
                <div className="lg:col-span-3">
                  {/* Table of Contents - Mobile */}
                  <div className="lg:hidden mb-6">
                    <TableOfContents locale={locale} />
                  </div>

                  {/* Article Body */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 mb-6">
                    <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-primary prose-headings:text-neutral-800 prose-p:text-neutral-700 prose-li:text-neutral-700">
                      {isNSAIDArticle ? (
                        // For NSAID article, use custom client component
                        <NSAIDContentSimple content={article.content} />
                      ) : hasMermaidCharts ? (
                        // For articles with Mermaid charts, use enhanced Markdown component
                        <MarkdownWithMermaid
                          content={article.content}
                          className="prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-primary prose-headings:text-neutral-800 prose-p:text-neutral-700 prose-li:text-neutral-700"
                        />
                      ) : (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw]}
                          components={{
                            // Convert h1 to h2 to avoid multiple h1 tags on the page
                            h1: ({ children }) => (
                              <h2 className="text-3xl font-bold text-neutral-800 mb-6 mt-8 first:mt-0">
                                {children}
                              </h2>
                            ),
                            table: ({ children }) => (
                              <div className="overflow-x-auto my-6">
                                <table className="min-w-full border-collapse border border-gray-300 bg-white rounded-lg shadow-sm">
                                  {children}
                                </table>
                              </div>
                            ),
                            thead: ({ children }) => (
                              <thead className="bg-primary-50">
                                {children}
                              </thead>
                            ),
                            th: ({ children }) => (
                              <th className="border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 bg-primary-100 font-semibold text-left text-primary-800 text-sm sm:text-base">
                                {children}
                              </th>
                            ),
                            td: ({ children }) => (
                              <td className="border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-neutral-700 text-sm sm:text-base">
                                {children}
                              </td>
                            ),
                            tr: ({ children }) => (
                              <tr className="even:bg-gray-50">{children}</tr>
                            ),
                          }}
                        >
                          {article.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>

                  {/* Article Interactions */}
                  <ArticleInteractions
                    articleId={slug}
                    articleTitle={title}
                    locale={locale}
                    className="mb-6"
                  />
                </div>

                {/* Sidebar - Desktop */}
                <div className="hidden lg:block lg:col-span-1">
                  <div className="sticky top-6 space-y-6">
                    {/* Table of Contents - Desktop */}
                    <TableOfContents locale={locale} />

                    {/* Quick Actions */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3 text-sm">
                        {t("content.quickActions")}
                      </h3>
                      <div className="space-y-2">
                        <Link
                          href={`/${locale}/downloads`}
                          className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded flex items-center gap-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                          {t("content.moreArticles")}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Medical Disclaimer */}
          <section className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-red-800 mb-2 text-sm sm:text-base">
                      {t("content.medicalDisclaimer.title")}
                    </h4>
                    <p className="text-xs sm:text-sm text-red-700 leading-relaxed">
                      {t("content.medicalDisclaimer.content")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Related Articles */}
          <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-8 sm:py-12">
            <div className="container-custom">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-2">
                    {t("content.relatedArticles.title")}
                  </h2>
                  <p className="text-sm sm:text-base text-neutral-600">
                    {t("content.relatedArticles.subtitle")}
                  </p>
                </div>

                {relatedArticles.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {relatedArticles.map((relatedArticle) => {
                      const relatedTitle =
                        locale === "zh"
                          ? relatedArticle.title_zh || relatedArticle.title
                          : relatedArticle.title;
                      const relatedSummary =
                        locale === "zh"
                          ? relatedArticle.summary_zh || relatedArticle.summary
                          : relatedArticle.summary;
                      // 将relatedArticle.category转换为安全的翻译键名
                      const relatedCategoryKey = relatedArticle.category
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^\w\u4e00-\u9fff-]/g, "");

                      const relatedCategory =
                        locale === "zh"
                          ? relatedArticle.category_zh ||
                            t(`tags.${relatedCategoryKey}`) ||
                            relatedArticle.category
                          : t(`tags.${relatedCategoryKey}`) ||
                            relatedArticle.category;

                      return (
                        <Link
                          key={relatedArticle.slug}
                          href={`/${locale}/articles/${relatedArticle.slug}`}
                          className="group block bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-primary-200"
                        >
                          <div className="flex items-center mb-3">
                            <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                              {relatedCategory}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-semibold text-neutral-800 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                            {relatedTitle}
                          </h3>
                          <p className="text-neutral-600 text-sm line-clamp-3 leading-relaxed mb-3">
                            {relatedSummary}
                          </p>
                          <div className="flex items-center text-primary-600 text-sm font-medium">
                            <span>{t("content.relatedArticles.readMore")}</span>
                            <svg
                              className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-primary-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-primary-600 mb-2">
                      {t("content.relatedArticles.moreComing")}
                    </h3>
                    <p className="text-neutral-600 text-sm sm:text-base">
                      {t("content.relatedArticles.description")}
                    </p>
                    <Link
                      href={`/${locale}/downloads`}
                      className="inline-flex items-center mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                    >
                      {t("content.relatedArticles.browseAll")}
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  } catch (error) {
    const errorTime = Date.now() - requestStart;
    console.error(
      `[PROD-MONITOR] Error in ArticlePage after ${errorTime}ms:`,
      error,
    );
    console.error(`[PROD-MONITOR] Error context: ${locale}/${slug}`);
    console.error("Error in ArticlePage:", error);
    notFound();
  }
}
