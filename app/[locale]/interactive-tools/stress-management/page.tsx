import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import Link from "next/link";
import { Locale, locales } from "@/i18n";
import StructuredData from "@/components/StructuredData";

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

  return (
    <>
      <StructuredData
        type="WebPage"
        title={t("pageTitle")}
        description={t("description")}
        url={`${process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"}/${locale}/interactive-tools/stress-management`}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <Link href={`/${locale}`} className="hover:text-blue-600">
              {t("common.breadcrumb.home")}
            </Link>
            <span>/</span>
            <Link
              href={`/${locale}/interactive-tools`}
              className="hover:text-blue-600"
            >
              {t("common.breadcrumb.interactiveTools")}
            </Link>
            <span>/</span>
            <span className="text-gray-800">{t("title")}</span>
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

          {/* Quick Start Section */}
          <section className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {t("assessment.title")}
              </h2>
              <p className="text-lg text-gray-600">
                {t("assessment.subtitle")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/interactive-tools/interactive-tools/stress-management/assessment`}
                className="btn-primary text-lg px-8 py-4"
              >
                {t("startAssessment")}
              </Link>
              <Link
                href={`/${locale}/interactive-tools`}
                className="btn-secondary text-lg px-8 py-4"
              >
                {t("backToTools")}
              </Link>
            </div>
          </section>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Assessment Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {t("assessment.title")}
              </h3>
              <p className="text-gray-600 mb-4">{t("assessment.subtitle")}</p>
              <Link
                href={`/${locale}/interactive-tools/interactive-tools/stress-management/assessment`}
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                {t("learnMore")} →
              </Link>
            </div>

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
                href={`/${locale}/interactive-tools/interactive-tools/stress-management/techniques`}
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
                href={`/${locale}/interactive-tools/interactive-tools/stress-management/progress`}
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
