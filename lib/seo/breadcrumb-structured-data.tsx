interface BreadcrumbStructuredDataProps {
  locale: string;
  path: string;
  breadcrumbs: Array<{
    name: string;
    url: string;
  }>;
}

export function generateBreadcrumbStructuredData({
  locale,
  breadcrumbs,
}: BreadcrumbStructuredDataProps) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";

  // 确保面包屑包含首页
  const fullBreadcrumbs = [
    {
      name: locale === "zh" ? "首页" : "Home",
      url: `${baseUrl}/${locale}`,
    },
    ...breadcrumbs,
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: fullBreadcrumbs
      .filter((crumb) => crumb.name && crumb.url) // 过滤掉无效的面包屑
      .map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name || "",
        item: crumb.url || "",
      })),
  };
}

/**
 * 清理数据，移除 undefined 值
 */
function cleanDataForJSON(data: unknown): unknown {
  if (data === null || data === undefined) {
    return null;
  }
  if (Array.isArray(data)) {
    return data.map(cleanDataForJSON).filter((item) => item !== null);
  }
  if (typeof data === "object") {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        const cleanedValue = cleanDataForJSON(value);
        if (cleanedValue !== null && cleanedValue !== undefined) {
          cleaned[key] = cleanedValue;
        }
      }
    }
    return cleaned;
  }
  return data;
}

export function BreadcrumbStructuredDataScript({ data }: { data: unknown }) {
  // 清理数据，确保没有 undefined 值
  const cleanedData = cleanDataForJSON(data);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(cleanedData, null, 2),
      }}
    />
  );
}
