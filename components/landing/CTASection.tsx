import { useTranslations } from "next-intl";

export function CTASection() {
  const t = useTranslations("home.cta");

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-display font-bold mb-6">{t("title")}</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          {t("subtitle")}
        </p>
        <button className="bg-gradient-to-r from-primary-purple to-primary-pink text-white px-10 py-5 rounded-full font-semibold text-xl hover:shadow-2xl transform hover:scale-105 transition">
          {t("button")}
        </button>
        <p className="mt-4 text-sm text-gray-500">{t("note")}</p>
      </div>
    </section>
  );
}
