import { useTranslations } from "next-intl";

interface SymptomCheckerProps {
  onClose: () => void;
}

export function SymptomChecker({ onClose }: SymptomCheckerProps) {
  const t = useTranslations("tools.symptom_checker");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-600 dark:text-gray-400">{t("description")}</p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-sm font-medium mb-2">
            {t("pain_level.label")}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            className="w-full"
            defaultValue="5"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{t("pain_level.mild")}</span>
            <span>{t("pain_level.moderate")}</span>
            <span>{t("pain_level.severe")}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t("symptoms.label")}
          </label>
          <div className="space-y-2">
            {["cramps", "back_pain", "headache", "nausea"].map((symptom) => (
              <label key={symptom} className="flex items-center">
                <input type="checkbox" className="mr-2" />
                {t(`symptoms.${symptom}`)}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t("duration.label")}
          </label>
          <select className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-gray-600">
            <option>{t("duration.options.less_than_1")}</option>
            <option>{t("duration.options.1_2_days")}</option>
            <option>{t("duration.options.3_5_days")}</option>
            <option>{t("duration.options.more_than_5")}</option>
          </select>
        </div>

        <button className="w-full bg-gradient-to-r from-primary-purple to-primary-pink text-white py-3 rounded-lg font-semibold hover:shadow-lg transition">
          {t("submit")}
        </button>
      </form>

      <button
        onClick={onClose}
        className="w-full text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm"
      >
        {t("close")}
      </button>
    </div>
  );
}
