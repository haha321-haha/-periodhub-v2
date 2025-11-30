import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { X, Check, Lock } from "lucide-react";

interface WelcomeOnboardingProps {
  onClose: () => void;
  userTier?: "free" | "pro";
}

export default function WelcomeOnboarding({
  onClose,
  userTier = "free",
}: WelcomeOnboardingProps) {
  const t = useTranslations();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // 检查是否已经完成onboarding
    const isCompleted = localStorage.getItem("onboarding_completed");
    if (!isCompleted) {
      setIsVisible(true);
    }
  }, []);

  const steps = [
    {
      id: "welcome",
      title: t("onboarding.welcome.title"),
      description: t("onboarding.welcome.description"),
      icon: "👋",
      action: "none",
    },
    {
      id: "email",
      title: t("onboarding.email.title"),
      description: t("onboarding.email.description"),
      icon: "📧",
      action: "email",
    },
    {
      id: "calendar",
      title: t("onboarding.calendar.title"),
      description: t("onboarding.calendar.description"),
      icon: "📅",
      action: "calendar",
    },
    {
      id: "starred",
      title: t("onboarding.starred.title"),
      description: t("onboarding.starred.description"),
      icon: "⭐",
      action: "starred",
    },
    {
      id: "explore",
      title: t("onboarding.explore.title"),
      description: t("onboarding.explore.description"),
      icon: "🚀",
      action: "explore",
    },
    {
      id: "complete",
      title: t("onboarding.complete.title"),
      description: t("onboarding.complete.description"),
      icon: "🎉",
      action: "complete",
    },
  ];

  const totalSteps = steps.length;

  const handleEmailSubscribe = () => {
    if (email) {
      // 模拟订阅API调用
      setTimeout(() => {
        setIsSubscribed(true);
        // 自动进入下一步
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
        }, 1000);
      }, 500);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    // 标记onboarding已完成
    localStorage.setItem("onboarding_completed", "true");
    onClose();
  };

  const handleSkip = () => {
    handleClose();
  };

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        {/* Progress Bar */}
        <div className="h-1 bg-gray-200 rounded-t-2xl">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="p-8">
          {/* Step Indicator */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full text-white mb-4">
              {currentStepData.icon}
            </div>
            <div className="text-sm text-gray-500 mb-2">
              {t("onboarding.stepIndicator", {
                current: currentStep + 1,
                total: totalSteps,
              })}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {currentStepData.title}
            </h3>
            <p className="text-gray-600">{currentStepData.description}</p>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {currentStepData.action === "email" && (
              <div className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("onboarding.email.placeholder")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleEmailSubscribe}
                  disabled={!email || isSubscribed}
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    isSubscribed
                      ? "bg-green-100 text-green-700"
                      : "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg"
                  }`}
                >
                  {isSubscribed ? (
                    <div className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" />
                      {t("onboarding.email.subscribed")}
                    </div>
                  ) : (
                    t("onboarding.email.subscribe")
                  )}
                </button>
                {isSubscribed && (
                  <p className="text-sm text-green-600 text-center">
                    {t("onboarding.email.successMessage")}
                  </p>
                )}
              </div>
            )}

            {currentStepData.action === "calendar" && (
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-purple-800 mb-4">
                  {t("onboarding.calendar.description")}
                </p>
                <button className="w-full py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700">
                  {t("onboarding.calendar.addToCalendar")}
                </button>
              </div>
            )}

            {currentStepData.action === "starred" && (
              <div className="space-y-3">
                <div className="p-3 border border-purple-200 rounded-lg bg-purple-50">
                  <p className="text-sm text-purple-800">
                    {t("onboarding.starred.feature1")}
                  </p>
                </div>
                <div className="p-3 border border-purple-200 rounded-lg bg-purple-50">
                  <p className="text-sm text-purple-800">
                    {t("onboarding.starred.feature2")}
                  </p>
                </div>
                <div className="p-3 border border-purple-200 rounded-lg bg-purple-50">
                  <p className="text-sm text-purple-800">
                    {t("onboarding.starred.feature3")}
                  </p>
                </div>
              </div>
            )}

            {currentStepData.action === "explore" && (
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="text-sm font-medium">Analytics</div>
                </button>
                <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                  <div className="text-2xl mb-2">📝</div>
                  <div className="text-sm font-medium">Reports</div>
                </button>
                <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="text-sm font-medium">Goals</div>
                </button>
                <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                  <div className="text-2xl mb-2">📅</div>
                  <div className="text-sm font-medium">Calendar</div>
                </button>
              </div>
            )}

            {currentStepData.action === "complete" && (
              <div className="text-center space-y-4">
                <div className="text-6xl">🎉</div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    {t("onboarding.complete.title")}
                  </h4>
                  <p className="text-gray-600">
                    {t("onboarding.complete.description")}
                  </p>
                </div>
                {userTier === "free" && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                    <p className="text-sm text-purple-800 font-medium mb-2">
                      {t("onboarding.complete.proTeaser")}
                    </p>
                    <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-medium">
                      {t("onboarding.complete.upgradeCta")}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              {t("onboarding.skip")}
            </button>
            <button
              onClick={handleNext}
              disabled={currentStepData.action === "email" && !isSubscribed}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                currentStepData.action === "email" && !isSubscribed
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg"
              }`}
            >
              {currentStep === totalSteps - 1
                ? t("onboarding.complete")
                : t("onboarding.next")}
            </button>
          </div>

          {/* Privacy Footer */}
          <div className="mt-6 border-t border-gray-100 pt-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Lock
                  size={16}
                  className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">
                    🔒{" "}
                    {t("onboarding.privacyTitle", {
                      default: "Your Health Data Stays on Your Device",
                    })}
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    {t("onboarding.privacyFooter")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
