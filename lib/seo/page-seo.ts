/**
 * Page SEO Utilities
 * 页面 SEO 工具函数
 */

export interface PageSEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  locale?: string;
  path?: string;
  structuredDataType?: StructuredDataType;
  additionalStructuredData?: Record<string, unknown>;
}

export type StructuredDataType = Record<string, unknown>;

/**
 * 生成页面 SEO 元数据
 */
export function generatePageSEO(props: PageSEOProps) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";
  const locale = props.locale || "en";

  // 处理 canonical URL
  let canonicalUrl = props.canonical;
  if (props.path && !canonicalUrl) {
    canonicalUrl = `${baseUrl}/${locale}/${props.path.replace(/^\//, "")}`;
  }

  const metadata = {
    title: props.title,
    description: props.description,
    keywords: props.keywords?.join(","),

    openGraph: {
      title: props.title,
      description: props.description,
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      siteName: "PeriodHub",
      images: props.ogImage ? [{ url: props.ogImage }] : undefined,
    },

    twitter: {
      card: "summary_large_image",
      title: props.title,
      description: props.description,
      images: props.ogImage ? [props.ogImage] : undefined,
    },

    alternates: {
      canonical: canonicalUrl,
      languages: {
        "zh-CN": `${baseUrl}/zh`,
        "en-US": `${baseUrl}/en`,
        "x-default": `${baseUrl}/en`,
      },
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };

  return { metadata };
}

/**
 * 生成 JSON-LD 脚本标签
 */
export function generateJSONLD(data: unknown) {
  return {
    __html: JSON.stringify(data),
  };
}
