"use client";

import { useState } from "react";
import DownloadModal from "../DownloadModal";

interface EnergyForecastProps {
  onClose: () => void;
}

export function EnergyForecast({ onClose }: EnergyForecastProps) {
  const [lastPeriodDate, setLastPeriodDate] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [showForecast, setShowForecast] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const getDaysUntilPeriod = () => {
    if (!lastPeriodDate) return null;
    const last = new Date(lastPeriodDate);
    const today = new Date();
    const daysSince = Math.floor(
      (today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24),
    );
    const daysUntil = cycleLength - (daysSince % cycleLength);
    return daysUntil;
  };

  const getCyclePhase = () => {
    if (!lastPeriodDate) return null;
    const last = new Date(lastPeriodDate);
    const today = new Date();
    const daysSince = Math.floor(
      (today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24),
    );
    const currentDay = daysSince % cycleLength;

    if (currentDay <= 5)
      return {
        phase: "Menstrual",
        energy: "Low",
        icon: "🩸",
        color: "text-red-500",
      };
    if (currentDay <= 13)
      return {
        phase: "Follicular",
        energy: "Rising",
        icon: "🌱",
        color: "text-green-500",
      };
    if (currentDay <= 16)
      return {
        phase: "Ovulation",
        energy: "Peak",
        icon: "✨",
        color: "text-yellow-500",
      };
    return {
      phase: "Luteal",
      energy: "Declining",
      icon: "🌙",
      color: "text-blue-500",
    };
  };

  const handleCalculate = () => {
    setShowForecast(true);
  };

  const daysUntil = getDaysUntilPeriod();
  const phaseInfo = getCyclePhase();

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">⚡</span>
        </div>
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
          Cycle Energy Forecast
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Predict energy dips and peaks based on your cycle
        </p>
      </div>

      {!showForecast ? (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              First Day of Last Period
            </label>
            <input
              type="date"
              value={lastPeriodDate}
              onChange={(e) => setLastPeriodDate(e.target.value)}
              className="w-full p-3 border rounded-lg dark:bg-slate-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Average Cycle Length: {cycleLength} days
            </label>
            <input
              type="range"
              min="21"
              max="35"
              value={cycleLength}
              onChange={(e) => setCycleLength(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>21 days</span>
              <span>28 days</span>
              <span>35 days</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Typical Flow Intensity
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button className="p-3 border-2 rounded-lg hover:border-purple-500 transition">
                <div className="text-2xl mb-1">💧</div>
                <div className="text-sm">Light</div>
              </button>
              <button className="p-3 border-2 border-purple-500 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <div className="text-2xl mb-1">💧💧</div>
                <div className="text-sm">Medium</div>
              </button>
              <button className="p-3 border-2 rounded-lg hover:border-purple-500 transition">
                <div className="text-2xl mb-1">💧💧💧</div>
                <div className="text-sm">Heavy</div>
              </button>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            disabled={!lastPeriodDate}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Forecast
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {phaseInfo && (
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
              <div className="text-6xl mb-4">{phaseInfo.icon}</div>
              <div className="text-2xl font-bold mb-2">
                {phaseInfo.phase} Phase
              </div>
              <div className={`text-xl font-semibold ${phaseInfo.color} mb-4`}>
                Energy Level: {phaseInfo.energy}
              </div>
              {daysUntil !== null && (
                <div className="text-gray-600 dark:text-gray-400">
                  Next period in approximately{" "}
                  <span className="font-bold text-purple-600">
                    {daysUntil} days
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">7-Day Energy Forecast:</h3>
            <div className="space-y-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                const energyLevel =
                  phaseInfo?.phase === "Ovulation"
                    ? 80
                    : phaseInfo?.phase === "Follicular"
                      ? 70
                      : phaseInfo?.phase === "Luteal"
                        ? 50
                        : 40;
                const variance = Math.random() * 20 - 10;
                const dayEnergy = Math.max(
                  20,
                  Math.min(100, energyLevel + variance),
                );

                return (
                  <div key={day} className="flex items-center gap-3">
                    <div className="w-12 text-sm font-medium">{day}</div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6">
                      <div
                        className={`h-6 rounded-full transition-all ${
                          dayEnergy >= 70
                            ? "bg-gradient-to-r from-green-400 to-green-500"
                            : dayEnergy >= 50
                              ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                              : "bg-gradient-to-r from-red-400 to-red-500"
                        }`}
                        style={{ width: `${dayEnergy}%` }}
                      />
                    </div>
                    <div className="w-12 text-sm text-right">
                      {Math.round(dayEnergy)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Personalized Tips:</h3>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <span className="text-xl">🏃‍♀️</span>
                <div>
                  <p className="font-medium">Exercise Timing</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Best days for intense workouts: Days 8-14 (Follicular phase)
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <span className="text-xl">🍎</span>
                <div>
                  <p className="font-medium">Nutrition Support</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Increase iron-rich foods during menstrual phase
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* PDF Download Section */}
          <div className="p-6 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl">
            <h4 className="font-semibold mb-3 flex items-center">
              <span className="mr-2">📧</span>
              Get Cycle Energy Management Guide
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Download the complete Cycle Energy Prediction & Management
              Handbook PDF
            </p>
            <button
              onClick={() => setShowEmailModal(true)}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
            >
              <span className="mr-2">📧</span>
              Get Free Complete Guide PDF
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Includes 7-day energy charts + personalized tips
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowForecast(false)}
              className="flex-1 border-2 border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg font-semibold hover:border-purple-500 transition"
            >
              Edit Input
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-500 text-white px-4 py-3 rounded-lg font-semibold hover:shadow-lg transition"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Email Collection Modal */}
      <DownloadModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        source="energy_forecast_complete"
        resourceTitle="Cycle Energy Prediction & Management Handbook"
      />
    </div>
  );
}
