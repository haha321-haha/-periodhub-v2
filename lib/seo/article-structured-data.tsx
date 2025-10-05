import { getTranslations } from "next-intl/server";

interface ArticleStructuredDataProps {
  locale: string;
  slug: string;
  title: string;
  description: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
}

export async function generateArticleStructuredData({
  locale,
  slug,
  title,
  description,
  author = "PeriodHub Health Team",
  datePublished = "2025-01-01",
  dateModified,
  image,
  breadcrumbs = [],
}: ArticleStructuredDataProps) {
  const t = await getTranslations({ locale, namespace: "" });
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";

  const articleUrl = `${baseUrl}/${locale}/articles/${slug}`;
  const modifiedDate = dateModified || datePublished;

  // 构建面包屑结构化数据
  const breadcrumbList =
    breadcrumbs.length > 0
      ? {
          "@type": "BreadcrumbList",
          itemListElement: breadcrumbs.map((crumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: crumb.name,
            item: crumb.url,
          })),
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalWebPage",
        "@id": `${articleUrl}#webpage`,
        name: title,
        description: description,
        url: articleUrl,
        inLanguage: locale === "zh" ? "zh-CN" : "en-US",
        isAccessibleForFree: true,
        datePublished: datePublished,
        dateModified: modifiedDate,
        lastReviewed: modifiedDate,
        author: {
          "@type": "Organization",
          name: author,
          url: baseUrl,
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/icon-512.png`,
            width: 512,
            height: 512,
          },
        },
        publisher: {
          "@type": "Organization",
          name: "PeriodHub",
          url: baseUrl,
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/icon-512.png`,
            width: 512,
            height: 512,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": articleUrl,
        },
        about: {
          "@type": "MedicalCondition",
          name: locale === "zh" ? "痛经" : "Dysmenorrhea",
          alternateName:
            locale === "zh"
              ? ["月经疼痛", "经期疼痛", "Dysmenorrhea"]
              : ["Menstrual Pain", "Period Pain", "痛经"],
          description:
            locale === "zh"
              ? "月经期间或前后出现的下腹部疼痛症状"
              : "Pain in the lower abdomen during or around menstruation",
        },
        medicalAudience: {
          "@type": "MedicalAudience",
          audienceType: "Patient",
        },
        reviewedBy: {
          "@type": "Organization",
          name: "PeriodHub Medical Team",
        },
        ...(image && {
          image: {
            "@type": "ImageObject",
            url: image,
            width: 800,
            height: 450,
          },
        }),
        ...(breadcrumbList && { breadcrumb: breadcrumbList }),
      },
      {
        "@type": "Article",
        "@id": `${articleUrl}#article`,
        headline: title,
        description: description,
        url: articleUrl,
        inLanguage: locale === "zh" ? "zh-CN" : "en-US",
        datePublished: datePublished,
        dateModified: modifiedDate,
        author: {
          "@type": "Organization",
          name: author,
          url: baseUrl,
        },
        publisher: {
          "@type": "Organization",
          name: "PeriodHub",
          url: baseUrl,
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/icon-512.png`,
            width: 512,
            height: 512,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": articleUrl,
        },
        articleSection: locale === "zh" ? "女性健康" : "Women's Health",
        keywords:
          locale === "zh"
            ? ["痛经", "月经疼痛", "女性健康", "痛经缓解"]
            : [
                "dysmenorrhea",
                "menstrual pain",
                "women's health",
                "pain relief",
              ],
        ...(image && {
          image: {
            "@type": "ImageObject",
            url: image,
            width: 800,
            height: 450,
          },
        }),
      },
    ],
  };
}

export function ArticleStructuredDataScript({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}
