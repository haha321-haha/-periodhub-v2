"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import LunaAI from "../LunaAI";
import WelcomeOnboarding from "../WelcomeOnboarding";
import CycleSetupModal from "../CycleSetupModal";
import PainTrackerModal from "../PainTrackerModal";
import { STATS, SCENARIOS } from "../../utils/constants";
import { trackEvent } from "../../utils/analytics";
import { useCycleTracker } from "../../hooks/useCycleTracker";
import { V2HeroSection } from "./V2HeroSection";
import ComparisonSection from "@/components/sections/ComparisonSection";
import StatsSection from "./StatsSection";
import ScenariosSection from "./ScenariosSection";
import DownloadsSection from "./DownloadsSection";
import { PrivacyNotice } from "./PrivacyNotice";

interface V2HomeProps {
  locale: string;
}

const V2Home: React.FC<V2HomeProps> = ({ locale: _locale }) => {
  // locale参数当前未使用，但保留接口兼容性
  void _locale;
  const t = useTranslations("v2Home");

  // Helper to safely get object translations
  const getObjectTranslations = (key: string): Record<string, unknown> => {
    try {
      return (t.raw(key) as Record<string, unknown>) || {};
    } catch {
      return {};
    }
  };

  // Helper to safely get array translations
  const getArrayTranslations = (key: string): unknown[] => {
    try {
      return (t.raw(key) as unknown[]) || [];
    } catch {
      return [];
    }
  };

  const scenariosTranslations = getObjectTranslations("scenarios");
  const statsTranslations = getObjectTranslations("stats");
  const trustTranslations = getArrayTranslations("hero.trust") as string[];

  // Get translated tools, scenarios, and stats based on language
  // translatedTools当前未使用，但保留以备将来需要
  // const translatedTools = TOOLS.map((tool) => {
  //   const translated = toolsTranslations?.[tool.id];
  //   return translated
  //     ? {
  //         ...tool,
  //         title: translated.title,
  //         description: translated.description,
  //       }
  //     : tool;
  // });

  const translatedScenarios = SCENARIOS.map((scenario) => {
    const translated = scenariosTranslations?.[scenario.id] as
      | { title?: string; description?: string }
      | undefined;
    return translated
      ? {
          ...scenario,
          title: translated.title || scenario.title,
          description: translated.description || scenario.description,
        }
      : scenario;
  });

  // Convert stats object to array format
  const translatedStats =
    statsTranslations && Object.keys(statsTranslations).length > 0
      ? Object.values(statsTranslations).map(
          (stat: { value?: string; label?: string }) => ({
            value: stat.value || "",
            label: stat.label || "",
          }),
        )
      : STATS;

  // Handle anchor link clicks for smooth scrolling
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement;

      if (anchor && anchor.href) {
        const href = anchor.getAttribute("href");
        if (href && href.startsWith("#")) {
          const id = href.substring(1);
          const element = document.getElementById(id);

          if (element) {
            e.preventDefault();
            const offset = 80; // Navigation bar height
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.pageYOffset - offset;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  // Phase 1.1: Cycle Tracker Hook
  const { currentInfo, isSetup, setupCycle, updateLastPeriod } =
    useCycleTracker();

  // Modal States
  const [isCycleModalOpen, setIsCycleModalOpen] = useState(false);
  const [isPainModalOpen, setIsPainModalOpen] = useState(false);

  // Handle click on the Hero Cycle Visualization
  const handleCycleClick = () => {
    trackEvent("cycle_viz_click");
    if (!isSetup) {
      setIsCycleModalOpen(true);
    } else {
      const confirmed = window.confirm(
        "Do you want to log your period starting today?",
      );
      if (confirmed) {
        const todayStr = new Date().toISOString().split("T")[0];
        updateLastPeriod(todayStr);
      }
    }
  };

  const handleCycleSetupSave = (data: {
    lastPeriodDate: string;
    averageCycleLength: number;
  }) => {
    setupCycle(data);
    setIsCycleModalOpen(false);
  };

  // Unified Tool Click Handler
  const handleToolClick = (toolId: string) => {
    trackEvent("tool_click", { tool_id: toolId });

    if (toolId === "pain-tracker") {
      setIsPainModalOpen(true);
    } else if (toolId === "cycle-tracker") {
      // Scroll to top to see visualization or open modal
      if (!isSetup) {
        setIsCycleModalOpen(true);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      alert("This tool is coming soon in Phase 2!");
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50 transition-colors duration-300">
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="skip-link absolute top-0 left-0 bg-purple-600 text-white p-3 -translate-y-full focus:translate-y-0 transition-transform z-50 rounded-br-lg"
      >
        Skip to main content
      </a>

      <div id="main-content">
        {/* HERO SECTION */}
        <V2HeroSection
          cycleInfo={currentInfo}
          isSetup={isSetup}
          onCycleClick={handleCycleClick}
          onPrimaryCtaClick={() => handleToolClick("pain-tracker")}
          onSecondaryCtaClick={() =>
            trackEvent("hero_secondary_click", { action: "view_guides" })
          }
          trustTranslations={trustTranslations}
        />

        {/* COMPARISON SECTION (Marketing) */}
        <ComparisonSection />

        {/* STATS SECTION */}
        {translatedStats && translatedStats.length > 0 && (
          <StatsSection stats={translatedStats} />
        )}

        {/* SCENARIOS SECTION */}
        <ScenariosSection scenarios={translatedScenarios} />

        {/* DOWNLOADS SECTION */}
        <DownloadsSection />

        {/* PRIVACY NOTICE */}
        <PrivacyNotice />
      </div>

      <LunaAI />

      {/* Welcome Onboarding Modal - Shows automatically for new users */}
      <WelcomeOnboarding
        onClose={() => {
          // Onboarding component handles localStorage internally
          // This callback is called when user completes or skips onboarding
        }}
        userTier="free"
      />

      {/* Modals */}
      <CycleSetupModal
        isOpen={isCycleModalOpen}
        onClose={() => setIsCycleModalOpen(false)}
        onSave={handleCycleSetupSave}
      />

      <PainTrackerModal
        isOpen={isPainModalOpen}
        onClose={() => setIsPainModalOpen(false)}
      />
    </div>
  );
};

export default V2Home;
