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
  path,
  breadcrumbs
}: BreadcrumbStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";
  
  // 确保面包屑包含首页
  const fullBreadcrumbs = [
    {
      name: locale === 'zh' ? '首页' : 'Home',
      url: `${baseUrl}/${locale}`
    },
    ...breadcrumbs
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": fullBreadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
}

export function BreadcrumbStructuredDataScript({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data)
      }}
    />
  );
}
