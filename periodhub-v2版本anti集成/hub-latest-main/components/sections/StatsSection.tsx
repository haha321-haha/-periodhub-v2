"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface StatsSectionProps {
  stats?: Array<{ value: string; label: string }>;
}

export default function StatsSection({
  stats: propsStats,
}: StatsSectionProps = {}) {
  const t = useTranslations("v2Home");

  // Use props stats if provided, otherwise get from translations
  const stats = propsStats || [
    {
      value: t("stats.active_users.value"),
      label: t("stats.active_users.label"),
    },
    {
      value: t("stats.user_rating.value"),
      label: t("stats.user_rating.label"),
    },
    {
      value: t("stats.medical_guides.value"),
      label: t("stats.medical_guides.label"),
    },
    {
      value: t("stats.hipaa_compliant.value"),
      label: t("stats.hipaa_compliant.label"),
    },
  ];

  // t is used in the stats array above

  return (
    <section
      className="py-20 bg-white/50 dark:bg-slate-800/50 border-y border-purple-100 dark:border-slate-700"
      data-ai-searchable="true"
      data-entity="STATISTICS"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="text-center group cursor-default"
              data-quotable="true"
            >
              <div className="text-3xl sm:text-4xl font-bold text-gradient mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
