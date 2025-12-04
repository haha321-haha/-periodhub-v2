import { useTranslations } from "next-intl";
import Link from "next/link";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-gray-100 dark:bg-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <svg
                className="w-8 h-8 text-primary-pink"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                <circle
                  cx="12"
                  cy="12"
                  r="5"
                  fill="currentColor"
                  opacity="0.3"
                />
              </svg>
              <span className="font-display font-semibold text-xl">
                PeriodHub
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("tagline")}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("tools.title")}</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link href="#" className="hover:text-primary-purple">
                  {t("tools.symptom_checker")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-purple">
                  {t("tools.cycle_tracker")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-purple">
                  {t("tools.pain_diary")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-purple">
                  {t("tools.doctor_reports")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("resources.title")}</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link href="#" className="hover:text-primary-purple">
                  {t("resources.medical_guides")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-purple">
                  {t("resources.natural_remedies")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-purple">
                  {t("resources.emergency_guide")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-purple">
                  {t("resources.research_papers")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("legal.title")}</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link href="#" className="hover:text-primary-purple">
                  {t("legal.privacy_policy")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-purple">
                  {t("legal.hipaa_compliance")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-purple">
                  {t("legal.terms_of_service")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-purple">
                  {t("legal.medical_disclaimer")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
