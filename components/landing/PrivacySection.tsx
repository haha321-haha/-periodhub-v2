import { useTranslations } from "next-intl";

export function PrivacySection() {
  const t = useTranslations("home.privacy");

  return (
    <section
      id="privacy"
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-display font-bold mb-4">{t("title")}</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="space-y-6">
            {/* Local Storage */}
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold mb-2">
                  {t("features.local.title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("features.local.desc")}
                </p>
              </div>
            </div>

            {/* HIPAA & CCPA */}
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600 dark:text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold mb-2">
                  {t("features.compliance.title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("features.compliance.desc")}
                </p>
              </div>
            </div>

            {/* Encryption */}
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-purple-600 dark:text-purple-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 016 0v2h2V7a5 5 0 00-5-5z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold mb-2">
                  {t("features.encryption.title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("features.encryption.desc")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-8">
          <h3 className="text-2xl font-semibold mb-6">
            {t("disclaimer.title")}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {t("disclaimer.p1")}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t("disclaimer.p2")}
          </p>

          <h4 className="font-semibold mb-3">
            {t("disclaimer.data_privacy.title")}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("disclaimer.data_privacy.text")}
          </p>
        </div>
      </div>
    </section>
  );
}
