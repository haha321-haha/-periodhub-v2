import PricingPageClient from "./PricingPageClient";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface PricingPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: PricingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pro.pricing" });

  return {
    title: t("hero.title"),
    description: t("hero.subtitle"),
  };
}

export default async function PricingPage({ params }: PricingPageProps) {
  // params变量当前未使用，但保留以备将来需要
  void params;

  // 不再需要传递locale，客户端组件会使用 useLocale() 钩子
  return <PricingPageClient />;
}
