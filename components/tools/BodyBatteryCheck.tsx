"use client";

import { useState } from "react";
import DownloadModal from "../DownloadModal";

interface BodyBatteryCheckProps {
  onClose: () => void;
}

export function BodyBatteryCheck({ onClose }: BodyBatteryCheckProps) {
  const [energyLevel, setEnergyLevel] = useState(50);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [stressLevel, setStressLevel] = useState(5);
  const [showResults, setShowResults] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const calculateBattery = () => {
    const battery = Math.min(
      100,
      Math.max(0, energyLevel + sleepQuality * 10 - stressLevel * 10),
    );
    return battery;
  };

  const getBatteryStatus = (battery: number) => {
    if (battery >= 80)
      return { status: "Excellent", color: "text-green-500", icon: "🔋✨" };
    if (battery >= 60)
      return { status: "Good", color: "text-blue-500", icon: "🔋" };
    if (battery >= 40)
      return { status: "Moderate", color: "text-yellow-500", icon: "🔋⚠️" };
    if (battery >= 20)
      return { status: "Low", color: "text-orange-500", icon: "🪫" };
    return { status: "Critical", color: "text-red-500", icon: "🪫⚠️" };
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const battery = calculateBattery();
  const batteryStatus = getBatteryStatus(battery);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl animate-pulse">🔋</span>
        </div>
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Body Battery Check
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Analyze your current energy levels and recovery needs
        </p>
      </div>

      {!showResults ? (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Current Energy Level: {energyLevel}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Exhausted</span>
              <span>Energized</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Last Night Sleep Quality: {sleepQuality}/10
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => setSleepQuality(num)}
                  className={`flex-1 py-2 rounded-lg transition ${
                    sleepQuality >= num
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Current Stress Level: {stressLevel}/10
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => setStressLevel(num)}
                  className={`flex-1 py-2 rounded-lg transition ${
                    stressLevel >= num
                      ? "bg-gradient-to-r from-red-500 to-orange-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Period Status
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 border-2 rounded-lg hover:border-purple-500 transition">
                <div className="text-2xl mb-1">🩸</div>
                <div className="text-sm">On Period</div>
              </button>
              <button className="p-3 border-2 rounded-lg hover:border-purple-500 transition">
                <div className="text-2xl mb-1">📅</div>
                <div className="text-sm">Off Period</div>
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
          >
            Calculate Body Battery
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
            <div className="text-6xl mb-4">{batteryStatus.icon}</div>
            <div className={`text-4xl font-bold ${batteryStatus.color} mb-2`}>
              {battery}%
            </div>
            <div className="text-xl font-semibold mb-4">
              Battery Status: {batteryStatus.status}
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all duration-500 ${
                  battery >= 60
                    ? "bg-gradient-to-r from-green-400 to-green-500"
                    : battery >= 40
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                      : "bg-gradient-to-r from-red-400 to-red-500"
                }`}
                style={{ width: `${battery}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">
              Personalized Recommendations:
            </h3>
            {battery < 40 && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <p className="font-medium">Low Energy Alert</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Consider resting and avoiding strenuous activities today.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <span className="text-xl">💧</span>
                <div>
                  <p className="font-medium">Hydration</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Drink at least 8 glasses of water today
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <span className="text-xl">🧘</span>
                <div>
                  <p className="font-medium">Gentle Movement</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    10-15 minutes of yoga or stretching
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* PDF Download Section */}
          <div className="p-6 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl">
            <h4 className="font-semibold mb-3 flex items-center">
              <span className="mr-2">📧</span>
              Get Complete Assessment Report
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Download the full Body Battery Assessment & Energy Management
              Guide PDF
            </p>
            <button
              onClick={() => setShowEmailModal(true)}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
            >
              <span className="mr-2">📧</span>
              Get Free PDF Report
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Includes personalized energy plan + cycle tracking tools
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowResults(false)}
              className="flex-1 border-2 border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg font-semibold hover:border-purple-500 transition"
            >
              Retake Assessment
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-3 rounded-lg font-semibold hover:shadow-lg transition"
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
        source="body_battery_complete"
        resourceTitle="Body Battery Assessment & Energy Management Guide"
      />
    </div>
  );
}
