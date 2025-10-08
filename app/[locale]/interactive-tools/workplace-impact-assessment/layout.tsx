import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "interactiveTools.workplaceImpactAssessment.meta",
  });

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      siteName: "Period Hub",
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
    },
    alternates: {
      canonical: `https://www.periodhub.health/${locale}/interactive-tools/workplace-impact-assessment`,
      languages: {
        zh: "https://www.periodhub.health/zh/interactive-tools/workplace-impact-assessment",
        en: "https://www.periodhub.health/en/interactive-tools/workplace-impact-assessment",
      },
    },
  };
}

export default function WorkplaceImpactAssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
