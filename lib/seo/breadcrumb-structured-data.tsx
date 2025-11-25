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

export function BreadcrumbStructuredDataScript({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}
