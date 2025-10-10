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
  const alternates = generateAlternatesConfig(
    locale,
    "interactive-tools/p3-system-optimization",
  );

  return {
    title: isZh
      ? "系统优化 - 痛经管理工具 | PeriodHub"
      : "System Optimization - Period Pain Management Tools | PeriodHub",
    description: isZh
      ? "了解PeriodHub的系统优化功能，包括性能提升、用户体验改进、数据同步等专业优化工具。"
      : "Learn about PeriodHub's system optimization features including performance improvements, user experience enhancements, data synchronization, and professional optimization tools.",
    alternates,
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function P3SystemOptimizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
