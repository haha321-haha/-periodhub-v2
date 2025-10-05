import { getTranslations } from "next-intl/server";

interface ToolStructuredDataProps {
  locale: string;
  toolSlug: string;
  toolName: string;
  description: string;
  features?: string[];
  category?: string;
  rating?: {
    value: number;
    count: number;
  };
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
}

export async function generateToolStructuredData({
  locale,
  toolSlug,
  toolName,
  description,
  features = [],
  category = "HealthApplication",
  rating = { value: 4.8, count: 1250 },
  breadcrumbs = [],
}: ToolStructuredDataProps) {
  const t = await getTranslations({ locale, namespace: "" });
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";

  const toolUrl = `${baseUrl}/${locale}/interactive-tools/${toolSlug}`;

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
        "@type": "SoftwareApplication",
        "@id": `${toolUrl}#application`,
        name: toolName,
        description: description,
        url: toolUrl,
        applicationCategory: category,
        operatingSystem: "Web",
        inLanguage: locale === "zh" ? "zh-CN" : "en-US",
        isAccessibleForFree: true,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        featureList:
          features.length > 0
            ? features
            : [
                locale === "zh" ? "症状评估" : "Symptom Assessment",
                locale === "zh" ? "个性化建议" : "Personalized Recommendations",
                locale === "zh" ? "健康报告" : "Health Reports",
              ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: rating.value.toString(),
          ratingCount: rating.count.toString(),
          bestRating: "5",
          worstRating: "1",
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
        author: {
          "@type": "Organization",
          name: "PeriodHub Health Team",
          url: baseUrl,
        },
        datePublished: "2025-01-01",
        dateModified: new Date().toISOString().split("T")[0],
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": toolUrl,
        },
        about: {
          "@type": "MedicalCondition",
          name: locale === "zh" ? "痛经" : "Dysmenorrhea",
          alternateName:
            locale === "zh"
              ? ["月经疼痛", "经期疼痛", "Dysmenorrhea"]
              : ["Menstrual Pain", "Period Pain", "痛经"],
        },
        medicalAudience: {
          "@type": "MedicalAudience",
          audienceType: "Patient",
        },
        ...(breadcrumbList && { breadcrumb: breadcrumbList }),
      },
      {
        "@type": "WebApplication",
        "@id": `${toolUrl}#webapp`,
        name: toolName,
        description: description,
        url: toolUrl,
        applicationCategory: category,
        operatingSystem: "Web",
        inLanguage: locale === "zh" ? "zh-CN" : "en-US",
        browserRequirements: "Requires JavaScript. Requires HTML5.",
        softwareVersion: "1.0",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        publisher: {
          "@type": "Organization",
          name: "PeriodHub",
          url: baseUrl,
        },
      },
    ],
  };
}

export function ToolStructuredDataScript({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}
