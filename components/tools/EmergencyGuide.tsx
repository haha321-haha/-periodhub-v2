import { useTranslations } from "next-intl";

interface EmergencyGuideProps {
  onClose: () => void;
}

export function EmergencyGuide({ onClose }: EmergencyGuideProps) {
  const t = useTranslations("tools.emergency");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-red-600">{t("title")}</h2>
        <p className="text-gray-600 dark:text-gray-400">{t("description")}</p>
      </div>

      <div className="space-y-4">
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4">
          <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">
            {t("immediate.title")}
          </h3>
          <ul className="space-y-2 text-sm list-disc list-inside">
            {["bleeding", "clots", "pain", "shock", "fever"].map((item) => (
              <li key={item}>{t(`immediate.items.${item}`)}</li>
            ))}
          </ul>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4">
          <h3 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-2">
            {t("urgent.title")}
          </h3>
          <ul className="space-y-2 text-sm list-disc list-inside">
            {["duration", "irregular", "changes", "interference"].map(
              (item) => (
                <li key={item}>{t(`urgent.items.${item}`)}</li>
              ),
            )}
          </ul>
        </div>

        <button className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition">
          {t("find_er")}
        </button>
      </div>

      <button
        onClick={onClose}
        className="w-full text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm"
      >
        {t("close")}
      </button>
    </div>
  );
}
