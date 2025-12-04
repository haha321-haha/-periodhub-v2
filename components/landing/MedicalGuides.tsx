import { useTranslations } from "next-intl";

export function MedicalGuides() {
  const t = useTranslations("home.guides");

  return (
    <section id="guides" className="py-20 bg-gray-50 dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold mb-4">{t("title")}</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t("subtitle")}
          </p>
        </div>

        {/* Guide Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {["natural", "hormone", "nutrition", "exercise"].map((category) => (
            <div
              key={category}
              className="bg-white dark:bg-slate-700 rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
            >
              <h4 className="font-semibold mb-2">
                {t(`categories.${category}.title`)}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t(`categories.${category}.count`)}
              </p>
            </div>
          ))}
        </div>

        {/* Featured Guides */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Guide 1 */}
          <article className="bg-white dark:bg-slate-700 rounded-xl overflow-hidden hover:shadow-xl transition">
            <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400"></div>
            <div className="p-6">
              <div className="text-xs uppercase tracking-wide text-purple-600 dark:text-purple-400 mb-2">
                {t("featured.popular.tag")}
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {t("featured.popular.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t("featured.popular.desc")}
              </p>
              <a
                href="#"
                className="text-primary-purple font-medium hover:underline"
              >
                {t("read_guide")} →
              </a>
            </div>
          </article>

          {/* Guide 2 */}
          <article className="bg-white dark:bg-slate-700 rounded-xl overflow-hidden hover:shadow-xl transition">
            <div className="h-48 bg-gradient-to-br from-green-400 to-blue-400"></div>
            <div className="p-6">
              <div className="text-xs uppercase tracking-wide text-green-600 dark:text-green-400 mb-2">
                {t("featured.natural.tag")}
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {t("featured.natural.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t("featured.natural.desc")}
              </p>
              <a
                href="#"
                className="text-primary-purple font-medium hover:underline"
              >
                {t("read_guide")} →
              </a>
            </div>
          </article>

          {/* Guide 3 */}
          <article className="bg-white dark:bg-slate-700 rounded-xl overflow-hidden hover:shadow-xl transition">
            <div className="h-48 bg-gradient-to-br from-orange-400 to-red-400"></div>
            <div className="p-6">
              <div className="text-xs uppercase tracking-wide text-orange-600 dark:text-orange-400 mb-2">
                {t("featured.nutrition.tag")}
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {t("featured.nutrition.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t("featured.nutrition.desc")}
              </p>
              <a
                href="#"
                className="text-primary-purple font-medium hover:underline"
              >
                {t("read_guide")} →
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
