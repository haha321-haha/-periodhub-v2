"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, Shield, CheckCircle, Heart } from "lucide-react";
import CycleViz from "../CycleViz";

interface V2HeroSectionProps {
  cycleInfo: any;
  isSetup: boolean;
  onCycleClick: () => void;
  onPrimaryCtaClick: () => void;
  onSecondaryCtaClick: () => void;
  trustTranslations: string[];
}

export function V2HeroSection({
  cycleInfo,
  isSetup,
  onCycleClick,
  onPrimaryCtaClick,
  onSecondaryCtaClick,
  trustTranslations,
}: V2HeroSectionProps) {
  const t = useTranslations("v2Home");

  return (
    <section
      id="home"
      className="relative overflow-hidden pb-16 lg:pb-24 pt-12"
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
          <div className="space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              {t("hero.h1_prefix")} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                {t("hero.h1_highlight")}
              </span>
              <span className="sr-only"> | </span>
              <span className="block text-xl sm:text-2xl text-gray-600 dark:text-gray-300 font-medium mt-4">
                {t("hero.h2_prefix")}{" "}
                <span className="text-purple-600 dark:text-purple-400 font-bold">
                  {t("hero.h2_highlight")}
                </span>
              </span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed">
              {t("hero.description")}
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                className="bg-purple-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-purple-500/30 hover:bg-purple-700 hover:-translate-y-1 transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                onClick={onPrimaryCtaClick}
              >
                {t("hero.cta_primary")}{" "}
                <ArrowRight size={20} aria-hidden="true" />
              </button>
              <button
                className="bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 border-2 border-purple-100 dark:border-purple-900 px-8 py-4 rounded-full font-semibold hover:bg-purple-50 dark:hover:bg-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                onClick={onSecondaryCtaClick}
              >
                {t("hero.cta_secondary")}
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Shield
                  size={16}
                  className="text-green-500"
                  aria-hidden="true"
                />
                <span>{trustTranslations[0] || "Medical Grade"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle
                  size={16}
                  className="text-green-500"
                  aria-hidden="true"
                />
                <span>{trustTranslations[1] || "Privacy First"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Heart
                  size={16}
                  className="text-green-500"
                  aria-hidden="true"
                />
                <span>{trustTranslations[2] || "User Loved"}</span>
              </div>
            </div>
          </div>

          {/* Hero Visual - Cycle Viz */}
          <div className="flex justify-center lg:justify-end relative">
            <div
              className="glass dark:bg-slate-800 p-8 rounded-full relative cursor-pointer transition-transform hover:scale-105"
              onClick={onCycleClick}
              role="button"
              tabIndex={0}
              aria-label="Interactive Cycle Visualization. Click to setup or update."
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onCycleClick();
                }
              }}
            >
              <CycleViz cycleInfo={cycleInfo} />
              <div
                className="absolute -bottom-4 -left-4 glass dark:bg-slate-700 px-4 py-2 rounded-xl shadow-lg animate-bounce"
                style={{ animationDuration: "3s" }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold ${
                      isSetup
                        ? "text-green-600 dark:text-green-400"
                        : "text-purple-600 dark:text-purple-400"
                    }`}
                  >
                    {isSetup ? "TRACKING LIVE 🟢" : "CLICK TO SETUP 👆"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
