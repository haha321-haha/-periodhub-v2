"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { trackEvent } from "../../utils/analytics";

interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge?: string;
  type: "zone" | "card";
}

interface ScenariosSectionProps {
  scenarios: Scenario[];
}

export default function ScenariosSection({ scenarios }: ScenariosSectionProps) {
  const t = useTranslations("v2Home");

  const zoneScenarios = scenarios.filter((s) => s.type === "zone");
  const cardScenarios = scenarios.filter((s) => s.type === "card");

  return (
    <section
      id="scenarios"
      className="py-20 bg-gradient-to-b from-purple-50/50 to-white dark:from-slate-800/50 dark:to-slate-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">
            {t("sections.scenarios_title")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t("sections.scenarios_desc")}
          </p>
        </div>

        {/* Zone Scenarios */}
        {zoneScenarios.length > 0 && (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {zoneScenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
                tabIndex={0}
                role="link"
                onClick={() =>
                  trackEvent("scenario_zone_click", { zone_id: scenario.id })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    trackEvent("scenario_zone_click", { zone_id: scenario.id });
                  }
                }}
              >
                <div
                  className="text-5xl sm:text-6xl bg-pink-50 dark:bg-pink-900/20 rounded-2xl p-4"
                  aria-hidden="true"
                >
                  <span role="img" aria-label={scenario.title}>
                    {scenario.icon}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold dark:text-white">
                      {scenario.title}
                    </h3>
                    {scenario.badge && (
                      <span className="bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {scenario.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {scenario.description}
                  </p>
                  <span className="text-pink-500 dark:text-pink-400 font-bold text-sm hover:underline">
                    {t("sections.enter_zone")} →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Card Scenarios */}
        {cardScenarios.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cardScenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-slate-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                tabIndex={0}
                role="link"
                onClick={() =>
                  trackEvent("scenario_card_click", { card_id: scenario.id })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    trackEvent("scenario_card_click", { card_id: scenario.id });
                  }
                }}
              >
                <div className="text-3xl mb-3" aria-hidden="true">
                  <span role="img" aria-label={scenario.title}>
                    {scenario.icon}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                  {scenario.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {scenario.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
