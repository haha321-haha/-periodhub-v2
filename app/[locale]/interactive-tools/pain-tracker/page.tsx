import { getTranslations } from "next-intl/server";
import PainTrackerClient from "./pain-tracker-client";
import {
  generateToolStructuredData,
  ToolStructuredDataScript,
} from "@/lib/seo/tool-structured-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "interactiveTools" });

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    keywords: t("meta.keywords").split(","),

    openGraph: {
      title: t("meta.ogTitle"),
      description: t("meta.ogDescription"),
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      siteName: "PeriodHub",
      url: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
      }/${locale}/interactive-tools/pain-tracker`,
    },

    twitter: {
      card: "summary_large_image",
      title: t("meta.twitterTitle"),
      description: t("meta.twitterDescription"),
    },

    alternates: {
      canonical: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
      }/${locale}/interactive-tools/pain-tracker`,
      languages: {
        "zh-CN": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/zh/interactive-tools/pain-tracker`,
        "en-US": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/en/interactive-tools/pain-tracker`,
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
}

export default async function PainTrackerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "interactiveTools" });
  const isZh = locale === "zh";

  // 生成工具结构化数据
  const toolStructuredData = await generateToolStructuredData({
    locale,
    toolSlug: "pain-tracker",
    toolName: t("meta.title"),
    description: t("meta.description"),
    features: [
      isZh ? "每日疼痛记录与追踪" : "Daily pain recording and tracking",
      isZh ? "疼痛模式可视化分析" : "Pain pattern visualization",
      isZh ? "症状趋势图表展示" : "Symptom trend charts",
      isZh ? "周期性疼痛识别" : "Cyclical pain identification",
      isZh ? "触发因素分析" : "Trigger factor analysis",
      isZh ? "数据导出与分享" : "Data export and sharing",
    ],
    category: "HealthApplication",
    rating: {
      value: 4.7,
      count: 980,
    },
    breadcrumbs: [
      {
        name: isZh ? "交互工具" : "Interactive Tools",
        url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"}/${locale}/interactive-tools`,
      },
      {
        name: isZh ? "痛经追踪器" : "Pain Tracker",
        url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"}/${locale}/interactive-tools/pain-tracker`,
      },
    ],
  });

  return (
    <>
      <ToolStructuredDataScript data={toolStructuredData} />
      <PainTrackerClient params={{ locale }} />
    </>
  );
}
