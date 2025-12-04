import { useTranslations } from "next-intl";

export function EvidenceChart() {
  const t = useTranslations("home.evidence");

  return (
    <div className="relative">
      <div className="glass rounded-2xl p-8 shadow-2xl">
        <h3 className="text-lg font-semibold mb-6 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-primary-blue"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
          {t("title")}
        </h3>
        <div className="space-y-4">
          {/* NSAIDs */}
          <div className="relative">
            <div className="flex justify-between mb-2">
              <span className="font-medium">{t("nsaids.label")}</span>
              <span className="text-orange-500 font-semibold">
                {t("nsaids.score")}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="chart-bar bg-gradient-to-r from-orange-400 to-orange-500 h-3 rounded-full"
                style={{ width: "62%" }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{t("nsaids.note")}</p>
          </div>

          {/* Exercise + Heat */}
          <div className="relative">
            <div className="flex justify-between mb-2">
              <span className="font-medium">{t("exercise.label")}</span>
              <span className="text-green-500 font-semibold">
                {t("exercise.score")}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="chart-bar bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full"
                style={{ width: "75%" }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{t("exercise.note")}</p>
          </div>

          {/* Combined Approach */}
          <div className="relative">
            <div className="flex justify-between mb-2">
              <span className="font-medium">{t("combined.label")}</span>
              <span className="text-purple-500 font-semibold">
                {t("combined.score")}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="chart-bar bg-gradient-to-r from-primary-purple to-primary-pink h-3 rounded-full animate-pulse-glow"
                style={{ width: "89%" }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{t("combined.note")}</p>
          </div>

          {/* Acetaminophen */}
          <div className="relative">
            <div className="flex justify-between mb-2">
              <span className="font-medium">{t("acetaminophen.label")}</span>
              <span className="text-yellow-500 font-semibold">
                {t("acetaminophen.score")}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="chart-bar bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full"
                style={{ width: "58%" }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {t("acetaminophen.note")}
            </p>
          </div>
        </div>

        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            <strong>{t("source.label")}:</strong> {t("source.text")}
          </p>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-primary-purple to-primary-pink rounded-full opacity-20 animate-float"></div>
      <div
        className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-primary-blue to-primary-purple rounded-full opacity-20 animate-float"
        style={{ animationDelay: "1s" }}
      ></div>
    </div>
  );
}
