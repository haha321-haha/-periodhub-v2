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
    title: t("progress.title") + " - PeriodHub",
    description: t("progress.subtitle"),
    keywords:
      locale === "zh"
        ? "进度追踪,压力管理,健康记录,数据追踪,个人健康"
        : "progress tracking,stress management,health records,data tracking,personal health",
    alternates: {
      canonical: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
      }/${locale}/stress-management/progress`,
      languages: {
        "zh-CN": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/zh/stress-management/progress`,
        "en-US": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/en/stress-management/progress`,
        "x-default": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/zh/stress-management/progress`,
      },
    },
    openGraph: {
      title: t("progress.title") + " - PeriodHub",
      description: t("progress.subtitle"),
      type: "website",
      locale: locale,
    },
  };
}

// Generate static params for all supported locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function ProgressTrackingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "stressManagement" });

  const trackingFeatures = [
    {
      icon: "📊",
      title: t("progress.features.stressLevel.title"),
      description: t("progress.features.stressLevel.description"),
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
    },
    {
      icon: "🧘",
      title: t("progress.features.techniquesUsed.title"),
      description: t("progress.features.techniquesUsed.description"),
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: "😊",
      title: t("progress.features.moodRating.title"),
      description: t("progress.features.moodRating.description"),
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: "📝",
      title: t("progress.features.notes.title"),
      description: t("progress.features.notes.description"),
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const timePeriods = [
    {
      key: "today",
      title: t("progress.today"),
      icon: "📅",
      color: "from-blue-500 to-blue-600",
    },
    {
      key: "week",
      title: t("progress.week"),
      icon: "📈",
      color: "from-green-500 to-green-600",
    },
    {
      key: "month",
      title: t("progress.month"),
      icon: "📊",
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <>
      <StructuredData
        type="WebPage"
        title={t("progress.title")}
        description={t("progress.subtitle")}
        url={`${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/${locale}/stress-management/progress`}
      />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <Link href={`/${locale}`} className="hover:text-blue-600">
              {t("common.breadcrumb.home")}
            </Link>
            <span>/</span>
            <Link
              href={`/${locale}/stress-management`}
              className="hover:text-blue-600"
            >
              {t("title")}
            </Link>
            <span>/</span>
            <span className="text-gray-800">{t("progress.title")}</span>
          </nav>

          {/* Header */}
          <header className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6">
              <span className="text-3xl">📈</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {t("progress.title")}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t("progress.subtitle")}
            </p>
          </header>

          {/* Quick Add Entry */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {t("progress.addEntry.title")}
              </h2>
              <p className="text-gray-600">{t("progress.addEntry.subtitle")}</p>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-6">
              {trackingFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`${feature.bgColor} rounded-lg p-4 text-center`}
                >
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href={`/${locale}/stress-management/progress/add`}
                className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
              >
                <span>{t("progress.addEntry.title")}</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Time Period Tabs */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {t("progress.viewHistory.title")}
            </h2>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {timePeriods.map((period) => (
                <Link
                  key={period.key}
                  href={`/${locale}/stress-management/progress/${period.key}`}
                  className={`bg-gradient-to-r ${period.color} text-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow`}
                >
                  <div className="text-3xl mb-3">{period.icon}</div>
                  <h3 className="font-bold text-lg">{period.title}</h3>
                  <p className="text-sm opacity-90 mt-2">
                    {t(`progress.viewHistory.${period.key}.description`)}
                  </p>
                </Link>
              ))}
            </div>

            {/* Sample Data Preview */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                {t("progress.sampleData.title")}
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      7.2
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("progress.sampleData.averageStress")}
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      85%
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("progress.sampleData.techniquesUsed")}
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      6.8
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("progress.sampleData.averageMood")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {t("progress.benefits.title")}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="font-semibold mb-2">
                  {t("progress.benefits.insights.title")}
                </h3>
                <p className="text-purple-100 text-sm">
                  {t("progress.benefits.insights.description")}
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="font-semibold mb-2">
                  {t("progress.benefits.trends.title")}
                </h3>
                <p className="text-purple-100 text-sm">
                  {t("progress.benefits.trends.description")}
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">💪</div>
                <h3 className="font-semibold mb-2">
                  {t("progress.benefits.motivation.title")}
                </h3>
                <p className="text-purple-100 text-sm">
                  {t("progress.benefits.motivation.description")}
                </p>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center">
            <Link
              href={`/${locale}/stress-management`}
              className="btn-secondary text-lg px-6 py-3 inline-flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>{t("backToTools")}</span>
            </Link>
          </div>

          {/* Medical Disclaimer */}
          <div
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mt-8 rounded-r-lg"
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
