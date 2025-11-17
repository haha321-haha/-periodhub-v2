import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import Link from "next/link";
import { Locale, locales } from "@/i18n";
import StructuredData from "@/components/StructuredData";
import StressManagementRecommendations from "../components/StressManagementRecommendations";

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "stressManagement" });

  return {
    title: t("techniques.title") + " - PeriodHub",
    description: t("techniques.subtitle"),
    keywords: t("techniques.keywords"),
    alternates: {
      canonical: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
      }/${locale}/interactive-tools/stress-management/techniques`,
      languages: {
        "zh-CN": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/zh/interactive-tools/stress-management/techniques`,
        "en-US": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/en/interactive-tools/stress-management/techniques`,
        "x-default": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/zh/interactive-tools/stress-management/techniques`,
      },
    },
    openGraph: {
      title: t("techniques.title") + " - PeriodHub",
      description: t("techniques.subtitle"),
      type: "website",
      locale: locale,
    },
  };
}

// Generate static params for all supported locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RelaxationTechniquesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "stressManagement" });

  const techniques = [
    {
      key: "breathing",
      icon: "💨",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      key: "meditation",
      icon: "🧘",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      key: "exercise",
      icon: "🏃",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      key: "music",
      icon: "🎵",
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
    },
  ];

  return (
    <>
      <StructuredData
        type="WebPage"
        title={t("techniques.title")}
        description={t("techniques.subtitle")}
        url={`${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/${locale}/interactive-tools/stress-management/techniques`}
      />

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Breadcrumb */}
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
            <Link
              href={`/${locale}/interactive-tools/stress-management`}
              className="hover:text-primary-600"
            >
              {t("title")}
            </Link>
            <span className="mx-2">›</span>
            <span className="text-neutral-800">{t("techniques.title")}</span>
          </nav>

          {/* Header */}
          <header className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-6">
              <span className="text-3xl">🌿</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {t("techniques.title")}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t("techniques.subtitle")}
            </p>
          </header>

          {/* Techniques Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {techniques.map((technique) => (
              <div
                key={technique.key}
                className={`${technique.bgColor} ${technique.borderColor} border-2 rounded-2xl p-8 hover:shadow-lg transition-shadow`}
              >
                <div className="text-center mb-6">
                  <div
                    className={`w-20 h-20 bg-gradient-to-r ${technique.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <span className="text-3xl">{technique.icon}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    {t(`techniques.${technique.key}.title`)}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {t(`techniques.${technique.key}.description`)}
                  </p>
                </div>

                {/* Benefits */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    {t("techniques.benefits.title")}
                  </h3>
                  <ul className="space-y-2">
                    {[1, 2, 3].map((benefitIndex) => (
                      <li
                        key={benefitIndex}
                        className="flex items-center gap-2 text-sm text-gray-700"
                      >
                        <div className="w-2 h-2 bg-current rounded-full"></div>
                        {t(
                          `techniques.${technique.key}.benefits.benefit${benefitIndex}`,
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    {t(`techniques.${technique.key}.instructions`)}
                  </h3>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      {t(`techniques.${technique.key}.instructionsDetail`)}
                    </p>
                  </div>
                </div>

                {/* Start Button */}
                <div className="text-center">
                  <Link
                    href={`/${locale}/interactive-tools/stress-management/techniques/${technique.key}`}
                    className={`bg-gradient-to-r ${technique.color} text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow inline-flex items-center gap-2`}
                  >
                    <span>{t(`techniques.${technique.key}.start`)}</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Tips Section */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {t("techniques.quickTips.title")}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white bg-opacity-10 rounded-lg p-6">
                <h3 className="font-semibold mb-3">
                  {t("techniques.quickTips.timing.title")}
                </h3>
                <ul className="space-y-2 text-sm">
                  {[1, 2, 3, 4].map((tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-2">
                      <span className="text-blue-200">•</span>
                      {t(`techniques.quickTips.timing.tip${tipIndex}`)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-6">
                <h3 className="font-semibold mb-3">
                  {t("techniques.quickTips.precautions.title")}
                </h3>
                <ul className="space-y-2 text-sm">
                  {[1, 2, 3, 4].map((tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-2">
                      <span className="text-purple-200">•</span>
                      {t(`techniques.quickTips.precautions.tip${tipIndex}`)}
                    </li>
                  ))}
                </ul>
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

          {/* Related Recommendations */}
          <StressManagementRecommendations locale={locale} />

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
