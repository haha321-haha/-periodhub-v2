"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Modal } from "../ui/Modal";
import { BodyBatteryCheck } from "../tools/BodyBatteryCheck";
import { EnergyForecast } from "../tools/EnergyForecast";
import { SymptomChecker } from "../tools/SymptomChecker";
import { CycleTracker } from "../tools/CycleTracker";
import { NaturalRemedies } from "../tools/NaturalRemedies";
import { EmergencyGuide } from "../tools/EmergencyGuide";

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  badge?: string;
  badgeColor?: string;
  onClick?: () => void;
  gradient: string;
}

function ToolCard({
  title,
  description,
  icon,
  action,
  badge,
  badgeColor,
  onClick,
  gradient,
}: ToolCardProps) {
  return (
    <div
      className="glass rounded-xl p-6 hover:shadow-xl transition cursor-pointer"
      onClick={onClick}
    >
      <div
        className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center mb-4 relative overflow-hidden`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      <div className="flex items-center justify-between">
        <span className="text-purple-600 font-medium">{action} →</span>
        {badge && (
          <span
            className={`bg-gradient-to-r ${
              badgeColor || "from-purple-500 to-pink-500"
            } text-white px-2 py-1 rounded-full text-xs font-semibold animate-pulse`}
          >
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

type ModalType =
  | "battery"
  | "forecast"
  | "symptom"
  | "cycle"
  | "remedies"
  | "emergency"
  | null;

export function ToolsGrid() {
  const t = useTranslations("home.tools");
  const [openModal, setOpenModal] = useState<ModalType>(null);

  return (
    <section
      id="tools"
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-display font-bold mb-4">{t("title")}</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Body Battery Assessment */}
        <ToolCard
          title={t("body_battery.title")}
          description={t("body_battery.desc")}
          icon={<span className="text-3xl animate-pulse">🔋</span>}
          action={t("body_battery.action")}
          badge={t("body_battery.badge")}
          gradient="from-purple-600 via-pink-500 to-blue-500"
          onClick={() => setOpenModal("battery")}
        />

        {/* Cycle Energy Forecast */}
        <ToolCard
          title={t("cycle_forecast.title")}
          description={t("cycle_forecast.desc")}
          icon={<span className="text-2xl">⚡</span>}
          action={t("cycle_forecast.action")}
          badge={t("cycle_forecast.badge")}
          badgeColor="from-blue-500 to-indigo-500"
          gradient="from-blue-400 via-indigo-500 to-purple-600"
          onClick={() => setOpenModal("forecast")}
        />

        {/* Pain Tracker */}
        <ToolCard
          title={t("pain_tracker.title")}
          description={t("pain_tracker.desc")}
          icon={<span className="text-2xl">📊</span>}
          action={t("pain_tracker.action")}
          badge={t("pain_tracker.badge")}
          badgeColor="from-red-500 to-orange-500"
          gradient="from-red-400 via-orange-500 to-pink-600"
          onClick={() => setOpenModal("symptom")}
        />

        {/* Natural Remedies */}
        <ToolCard
          title={t("remedies.title")}
          description={t("remedies.desc")}
          icon={
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
          }
          action={t("remedies.action")}
          gradient="from-green-400 to-primary-blue"
          onClick={() => setOpenModal("remedies")}
        />

        {/* Doctor Report Generator */}
        <ToolCard
          title={t("doctor_report.title")}
          description={t("doctor_report.desc")}
          icon={
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                clipRule="evenodd"
              />
            </svg>
          }
          action={t("doctor_report.action")}
          gradient="from-blue-400 to-primary-purple"
        />

        {/* Pain Diary */}
        <ToolCard
          title={t("pain_diary.title")}
          description={t("pain_diary.desc")}
          icon={
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100-4h1a1 1 0 100-2h1a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"
                clipRule="evenodd"
              />
            </svg>
          }
          action={t("pain_diary.action")}
          gradient="from-yellow-400 to-orange-400"
          onClick={() => setOpenModal("cycle")}
        />

        {/* Emergency Guide */}
        <ToolCard
          title={t("emergency.title")}
          description={t("emergency.desc")}
          icon={
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          }
          action={t("emergency.action")}
          gradient="from-red-400 to-red-600"
          onClick={() => setOpenModal("emergency")}
        />
      </div>

      {/* Modals */}
      <Modal
        isOpen={openModal === "battery"}
        onClose={() => setOpenModal(null)}
      >
        <BodyBatteryCheck onClose={() => setOpenModal(null)} />
      </Modal>

      <Modal
        isOpen={openModal === "forecast"}
        onClose={() => setOpenModal(null)}
      >
        <EnergyForecast onClose={() => setOpenModal(null)} />
      </Modal>

      <Modal
        isOpen={openModal === "symptom"}
        onClose={() => setOpenModal(null)}
        title={t("pain_tracker.title")}
      >
        <SymptomChecker onClose={() => setOpenModal(null)} />
      </Modal>

      <Modal
        isOpen={openModal === "cycle"}
        onClose={() => setOpenModal(null)}
        title={t("pain_diary.title")}
      >
        <CycleTracker onClose={() => setOpenModal(null)} />
      </Modal>

      <Modal
        isOpen={openModal === "remedies"}
        onClose={() => setOpenModal(null)}
        title={t("remedies.title")}
      >
        <NaturalRemedies onClose={() => setOpenModal(null)} />
      </Modal>

      <Modal
        isOpen={openModal === "emergency"}
        onClose={() => setOpenModal(null)}
        title={t("emergency.title")}
      >
        <EmergencyGuide onClose={() => setOpenModal(null)} />
      </Modal>
    </section>
  );
}
