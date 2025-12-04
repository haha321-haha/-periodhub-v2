import { Metadata } from "next";
import { generateAlternatesConfig } from "@/lib/seo/canonical-url-utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === "zh";

  // 生成canonical和hreflang配置
  const alternatesData = generateAlternatesConfig(
    "interactive-tools/p2-advanced-features",
  );
  const alternates = {
    canonical: alternatesData[locale === "zh" ? "zh-CN" : "en-US"],
    languages: alternatesData,
  };

  return {
    title: isZh
      ? "高级功能 - 痛经管理工具 | PeriodHub"
      : "Advanced Features - Period Pain Management Tools | PeriodHub",
    description: isZh
      ? "探索PeriodHub的高级功能，包括数据分析、个性化建议、社交功能等专业痛经管理工具。"
      : "Explore PeriodHub's advanced features including data analytics, personalized recommendations, social features, and professional period pain management tools.",
    alternates,
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function P2AdvancedFeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
