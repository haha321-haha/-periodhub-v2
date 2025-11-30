import { useTranslations } from "next-intl";

interface NaturalRemediesProps {
  onClose: () => void;
}

export function NaturalRemedies({ onClose }: NaturalRemediesProps) {
  const t = useTranslations("tools.remedies");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-600 dark:text-gray-400">{t("description")}</p>
      </div>

      <div className="space-y-4">
        {["yoga", "heat", "diet", "supplements"].map((remedy) => (
          <div
            key={remedy}
            className="border rounded-lg p-4 hover:shadow-lg transition"
          >
            <h3 className="font-semibold mb-2">{t(`items.${remedy}.title`)}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {t(`items.${remedy}.desc`)}
            </p>
            <button className="text-primary-purple text-sm font-medium hover:underline">
              {t("learn_more")} →
            </button>
          </div>
        ))}
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
