"use client";

import React from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { CheckCircle } from "lucide-react";
import ClinicalEffectivenessScores from "@/components/ClinicalEffectivenessScores";

export default function HeroNew() {
  const t = useTranslations("heroNew");
  const locale = useLocale();

  return (
    <section
      id="home"
      className="relative overflow-hidden pb-16 lg:pb-24 pt-24"
    >
      <div
        className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-purple-200/40 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      ></div>
      <div
        className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-pink-200/40 dark:bg-pink-900/20 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-6">
            {/* ACOG Badge */}
            {t("badge") && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-4">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100-4h-.5a1 1 0 000-2H8a2 2 0 114 0h1.5a1 1 0 100 2H14a2 2 0 100 4h-2a2 2 0 100-4h.5a1 1 0 100-2H12a2 2 0 01-2-2V5z"
                    clipRule="evenodd"
                  />
                </svg>
                {t("badge")}
              </div>
            )}

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              {t("h1_prefix")}
              <br />
              <span className="text-gradient">{t("h1_highlight")}</span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              <span className="font-semibold text-red-500 dark:text-red-400">
                {t("h2_prefix")}
              </span>
              <br />
              {t("h2_suffix")}{" "}
              <span className="font-semibold text-green-500 dark:text-green-400">
                {t("h2_highlight")}
              </span>{" "}
              {t("h2_end")}
            </p>

            <p
              className="text-lg text-gray-600 dark:text-gray-300 mb-8"
              data-quotable="true"
              data-ai-searchable="true"
              data-entity="DYSMENORRHEA"
            >
              {t("description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link
                href={`/${locale}/interactive-tools/symptom-assessment`}
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition animate-pulse-glow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 text-center"
              >
                {t("cta_primary")}
              </Link>
              <Link
                href={`/${locale}/downloads`}
                className="border-2 border-gray-300 dark:border-gray-600 px-8 py-4 rounded-full font-semibold text-lg hover:border-purple-600 dark:hover:border-purple-400 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 text-center"
              >
                {t("cta_secondary")}
              </Link>
            </div>

            {/* No Credit Card Notice */}
            {t("no_credit_card") && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {t("no_credit_card")}
              </p>
            )}

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              {["trust1", "trust2", "trust3"].map((key, idx) => (
                <span key={idx} className="flex items-center">
                  <CheckCircle
                    className="w-4 h-4 mr-1 text-green-500"
                    aria-hidden="true"
                  />
                  {t(key)}
                </span>
              ))}
            </div>
          </div>

          {/* Hero Visual - Clinical Effectiveness Scores */}
          <div className="flex justify-center lg:justify-end relative">
            <ClinicalEffectivenessScores />
          </div>
        </div>
      </div>
    </section>
  );
}
