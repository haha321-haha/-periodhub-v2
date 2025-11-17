import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import Link from "next/link";
import { Locale, locales } from "@/i18n";
import StressAssessmentWidget from "@/components/StressAssessmentWidget";
import {
  generateToolStructuredData,
  ToolStructuredDataScript,
} from "@/lib/seo/tool-structured-data";
import StressManagementRecommendations from "./components/StressManagementRecommendations";

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "stressManagement" });

  return {
    title: t("pageTitle"),
    description: t("description"),
    keywords: t("keywords").split(","),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"}/${locale}/interactive-tools/stress-management`,
      languages: {
        "zh-CN": `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"}/zh/interactive-tools/stress-management`,
        "en-US": `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"}/en/interactive-tools/stress-management`,
        "x-default": `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"}/en/interactive-tools/stress-management`, // ✅ 修复：默认英文版本（北美市场优先）
      },
    },
    openGraph: {
      title: t("pageTitle"),
      description: t("description"),
      type: "website",
      locale: locale,
    },
  };
}

// Generate static params for all supported locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function StressManagementPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "stressManagement" });
  const isZh = locale === "zh";

  // 生成工具结构化数据
  const toolStructuredData = await generateToolStructuredData({
    locale,
    toolSlug: "stress-management",
    toolName: t("pageTitle"),
    description: t("description"),
    features: [
      isZh ? "压力水平科学评估" : "Scientific stress level assessment",
      isZh ? "个性化减压技巧" : "Personalized stress relief techniques",
      isZh ? "进度追踪与分析" : "Progress tracking and analysis",
      isZh ? "呼吸练习指导" : "Breathing exercise guidance",
      isZh ? "冥想和放松训练" : "Meditation and relaxation training",
      isZh ? "压力管理计划" : "Stress management plan",
    ],
    category: "HealthApplication",
    rating: {
      value: 4.7,
      count: 850,
    },
    breadcrumbs: [
      {
        name: isZh ? "交互工具" : "Interactive Tools",
        url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"}/${locale}/interactive-tools`,
      },
      {
        name: isZh ? "压力管理" : "Stress Management",
        url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"}/${locale}/interactive-tools/stress-management`,
      },
    ],
  });

  return (
    <>
      <ToolStructuredDataScript data={toolStructuredData} />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Breadcrumb Navigation */}
          <nav className="text-sm text-neutral-600 mb-8">
            <Link href={`/${locale}`} className="hover:text-primary-600">
              {t("common.breadcrumb.home")}
            </Link>
            <span className="mx-2">›</span>
            <Link
              href={`/${locale}/interactive-tools`}
              className="hover:text-primary-600"
            >
              {t("common.breadcrumb.interactiveTools")}
            </Link>
            <span className="mx-2">›</span>
            <span className="text-neutral-800">{t("title")}</span>
          </nav>
          {/* Header Section */}
          <header className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6">
              <span className="text-3xl">🧘</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {t("title")}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t("subtitle")}
            </p>
          </header>

          {/* Assessment Widget - Direct Access */}
          <StressAssessmentWidget />

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Techniques Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {t("techniques.title")}
              </h3>
              <p className="text-gray-600 mb-4">{t("techniques.subtitle")}</p>
              <Link
                href={`/${locale}/interactive-tools/stress-management/techniques`}
                className="text-green-600 font-semibold hover:text-green-700"
              >
                {t("learnMore")} →
              </Link>
            </div>

            {/* Progress Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {t("progress.title")}
              </h3>
              <p className="text-gray-600 mb-4">{t("progress.subtitle")}</p>
              <Link
                href={`/${locale}/interactive-tools/stress-management/progress`}
                className="text-purple-600 font-semibold hover:text-purple-700"
              >
                {t("learnMore")} →
              </Link>
            </div>
          </div>

          {/* Quick Tips Section */}
          <section className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-6 text-center">
              {t("tips.title")}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">😌</div>
                <h3 className="text-xl font-semibold mb-2">
                  {t("tips.daily.title")}
                </h3>
                <p className="text-blue-100">{t("tips.daily.regularSleep")}</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">💨</div>
                <h3 className="text-xl font-semibold mb-2">
                  {t("tips.emergency.title")}
                </h3>
                <p className="text-blue-100">
                  {t("tips.emergency.deepBreathing")}
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🛡️</div>
                <h3 className="text-xl font-semibold mb-2">
                  {t("tips.prevention.title")}
                </h3>
                <p className="text-blue-100">
                  {t("tips.prevention.identifyTriggers")}
                </p>
              </div>
            </div>
          </section>

          {/* Related Recommendations */}
          <StressManagementRecommendations locale={locale} />

          {/* Medical Disclaimer */}
          <div
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mt-12 rounded-r-lg"
            role="alert"
          >
            <p className="font-bold">{t("common.importantNote")}</p>
            <p className="text-sm mt-1">{t("common.medicalDisclaimer")}</p>
          </div>
        </div>
      </div>
    </>
  );
}
