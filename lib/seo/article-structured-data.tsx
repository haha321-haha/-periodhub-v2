import { Locale } from "@/i18n";

// 文章结构化数据配置接口
export interface ArticleConfig {
  locale: Locale;
  articleSlug: string;
  title: string;
  description: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
  articleSection?: string;
  wordCount?: number;
  keywords?: string[];
  thumbnailUrl?: string;
}

// 生成Article结构化数据
export async function generateArticleStructuredData(config: ArticleConfig) {
  const { 
    locale, 
    articleSlug, 
    title, 
    description, 
    author = "PeriodHub Team",
    datePublished = new Date().toISOString(),
    dateModified = new Date().toISOString(),
    image,
    articleSection,
    wordCount,
    keywords = [],
    thumbnailUrl
  } = config;
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";
  const isZh = locale === "zh";
  
  // 构建Article结构化数据
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: image || `${baseUrl}/images/articles/${articleSlug}/hero.webp`,
    datePublished,
    dateModified,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "PeriodHub",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/icon-512.png`,
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/${locale}/articles/${articleSlug}`,
    },
    url: `${baseUrl}/${locale}/articles/${articleSlug}`,
    inLanguage: isZh ? "zh-CN" : "en-US",
    articleSection: articleSection || (isZh ? "健康" : "Health"),
    ...(wordCount && { wordCount }),
    ...(keywords.length > 0 && { keywords: keywords.join(", ") }),
    ...(thumbnailUrl && { thumbnailUrl }),
  };
  
  return articleStructuredData;
}

// Article结构化数据脚本组件
interface ArticleStructuredDataScriptProps {
  data: any;
}

export function ArticleStructuredDataScript({ data }: ArticleStructuredDataScriptProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2),
      }}
    />
  );
}