import { useTranslations } from "next-intl";
import { EvidenceChart } from "./EvidenceChart";

export function HeroSection() {
  const t = useTranslations("home.hero");

  return (
    <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-6">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100-4h-.5a1 1 0 000-2H8a2 2 0 114 0h1.5a1 1 0 100 2H14a2 2 0 100 4h-2a2 2 0 100-4h.5a1 1 0 100-2H12a2 2 0 01-2-2V5z"
                clipRule="evenodd"
              />
            </svg>
            {t("acog_badge")}
          </div>

          <h1 className="text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
            {t("title_line1")}
            <br />
            <span className="text-gradient">{t("title_line2")}</span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            <span className="font-semibold text-red-500">
              {t("subtitle_prefix")}
            </span>
            <br />
            {t("subtitle_middle")}{" "}
            <span className="font-semibold text-green-500">
              {t("subtitle_suffix")}
            </span>
            .
          </p>

          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            {t("description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              id="start-assessment"
              className="bg-gradient-to-r from-primary-purple to-primary-pink text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition animate-pulse-glow"
            >
              {t("cta_primary")}
            </button>
            <button className="border-2 border-gray-300 dark:border-gray-600 px-8 py-4 rounded-full font-semibold text-lg hover:border-primary-purple transition">
              {t("cta_secondary")}
            </button>
          </div>

          <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-1 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {t("trust.private")}
            </span>
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-1 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {t("trust.storage")}
            </span>
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-1 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {t("trust.hipaa")}
            </span>
          </div>
        </div>

        <EvidenceChart />
      </div>
    </section>
  );
}
