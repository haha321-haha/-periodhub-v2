import { useTranslations } from "next-intl";

interface CycleTrackerProps {
  onClose: () => void;
}

export function CycleTracker({ onClose }: CycleTrackerProps) {
  const t = useTranslations("tools.cycle_tracker");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-600 dark:text-gray-400">{t("description")}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            {t("last_period.label")}
          </label>
          <input
            type="date"
            className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t("cycle_length.label")}
          </label>
          <select
            className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-gray-600"
            defaultValue="28"
          >
            <option value="21-24">{t("cycle_length.options.short")}</option>
            <option value="25-27">{t("cycle_length.options.standard")}</option>
            <option value="28-30">{t("cycle_length.options.optimal")}</option>
            <option value="31-35">{t("cycle_length.options.long")}</option>
            <option value="irregular">
              {t("cycle_length.options.irregular")}
            </option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t("flow.label")}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["light", "medium", "heavy"].map((flow) => (
              <button
                key={flow}
                className="p-2 border rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition"
              >
                {t(`flow.options.${flow}`)}
              </button>
            ))}
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-primary-purple to-primary-pink text-white py-3 rounded-lg font-semibold hover:shadow-lg transition">
          {t("submit")}
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
