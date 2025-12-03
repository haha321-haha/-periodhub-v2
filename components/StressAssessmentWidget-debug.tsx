"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
// import dynamic from "next/dynamic"; // 已注释：当前未使用
// 已注释：当前未使用，但保留以备将来需要
// import { PrivacyNotice } from "@/components/PrivacyNotice";
import {
  trackAssessmentStart,
  // trackAssessmentComplete, // 已注释：当前未使用
} from "@/lib/ab-test-tracking";
import { logInfo, logError } from "@/lib/debug-logger";

// 确保全局升级处理函数可用
import "@/lib/pro-upgrade-handler";

const FREE_QUESTIONS = 5;
// const TOTAL_QUESTIONS = 10; // 已注释：当前未使用

// 评估问题
const questions = [
  {
    id: "work_stress",
    questionKey: "stressManagement.questions.work.title",
    options: [
      { key: "stressManagement.questions.work.options.none", value: 0 },
      { key: "stressManagement.questions.work.options.low", value: 1 },
      { key: "stressManagement.questions.work.options.moderate", value: 2 },
      { key: "stressManagement.questions.work.options.high", value: 3 },
    ],
  },
  {
    id: "sleep_quality",
    questionKey: "stressManagement.questions.sleep.title",
    options: [
      { key: "stressManagement.questions.sleep.options.excellent", value: 0 },
      { key: "stressManagement.questions.sleep.options.good", value: 1 },
      { key: "stressManagement.questions.sleep.options.fair", value: 2 },
      { key: "stressManagement.questions.sleep.options.poor", value: 3 },
    ],
  },
  {
    id: "social_stress",
    questionKey: "stressManagement.questions.social.title",
    options: [
      { key: "stressManagement.questions.social.options.none", value: 0 },
      { key: "stressManagement.questions.social.options.low", value: 1 },
      { key: "stressManagement.questions.social.options.moderate", value: 2 },
      { key: "stressManagement.questions.social.options.high", value: 3 },
    ],
  },
  {
    id: "emotional_stress",
    questionKey: "stressManagement.questions.emotional.title",
    options: [
      { key: "stressManagement.questions.emotional.options.calm", value: 0 },
      {
        key: "stressManagement.questions.emotional.options.slightly_anxious",
        value: 1,
      },
      { key: "stressManagement.questions.emotional.options.anxious", value: 2 },
      {
        key: "stressManagement.questions.emotional.options.very_anxious",
        value: 3,
      },
    ],
  },
  {
    id: "physical_symptoms",
    questionKey: "stressManagement.questions.physical.title",
    options: [
      { key: "stressManagement.questions.physical.options.none", value: 0 },
      { key: "stressManagement.questions.physical.options.mild", value: 1 },
      { key: "stressManagement.questions.physical.options.moderate", value: 2 },
      { key: "stressManagement.questions.physical.options.severe", value: 3 },
    ],
  },
];

export default function StressAssessmentWidgetDebug() {
  const t = useTranslations("stressManagement");
  const ui = useTranslations("ui");

  // State management
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showResults, setShowResults] = useState(false);
  // stressScore和stressLevel当前未在渲染中使用，但保留以备将来需要
  const [, setStressScore] = useState(0);
  const [, setStressLevel] = useState("");
  // startTime当前未使用
  // const [startTime] = useState(Date.now());
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  // 添加调试信息
  const addDebugInfo = (info: string) => {
    setDebugInfo((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${info}`,
    ]);
    console.log(`🔍 [DEBUG] ${info}`);
  };

  // Check for global payment function on mount
  useEffect(() => {
    addDebugInfo("组件已挂载");

    // 检查全局函数是否存在
    if (typeof window !== "undefined") {
      addDebugInfo("窗口对象存在");

      const hasHandleProUpgrade = "handleProUpgrade" in window;
      addDebugInfo(`handleProUpgrade 存在: ${hasHandleProUpgrade}`);

      if (hasHandleProUpgrade) {
        const handleProUpgrade = window.handleProUpgrade;
        addDebugInfo(`handleProUpgrade 类型: ${typeof handleProUpgrade}`);
      }
    } else {
      addDebugInfo("窗口对象不存在");
    }

    trackAssessmentStart("stress_assessment", "stress_assessment");
  }, []);

  const handleAnswer = (value: number) => {
    addDebugInfo(`问题 ${currentQuestion + 1} 回答: ${value}`);
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    // 如果是第5个问题，显示付费墙
    if (currentQuestion === FREE_QUESTIONS - 1) {
      addDebugInfo("免费问题已完成，准备显示付费墙");
      setTimeout(() => {
        setShowPaywall(true);
        addDebugInfo("付费墙已显示");
      }, 300);
    } else if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      setTimeout(() => {
        const score = calculateScore(newAnswers);
        const { level } = getStressLevel(score);
        setStressScore(score);
        setStressLevel(level);
        setShowResults(true);
      }, 300);
    }
  };

  const handleUnlockPremium = () => {
    addDebugInfo("🔓 解锁高级版按钮被点击");
    // 使用logger而不是console.log（开发环境自动启用，生产环境自动禁用）
    logInfo(
      "🔓 解锁高级版按钮被点击",
      undefined,
      "StressAssessmentWidget-debug",
    );

    // 检查全局函数是否存在
    if (typeof window !== "undefined" && window.handleProUpgrade) {
      const score = calculateScore(answers);
      addDebugInfo(`全局函数存在，准备调用，评分: ${score}`);

      window.handleProUpgrade({
        plan: "oneTime",
        painPoint: "stress_management_assessment",
        assessmentScore: score,
        customData: { answers: answers },
      });
    } else {
      addDebugInfo("❌ 全局支付函数不存在");
      logError(
        "❌ 全局支付函数不存在",
        undefined,
        "StressAssessmentWidget-debug",
      );
      alert("支付功能暂时不可用，请稍后重试。");
    }
  };

  const handleSkipPaywall = () => {
    addDebugInfo("跳过付费墙按钮被点击");
    // 获取当前所有的答案，包括最新的
    const currentAnswers = [...answers];
    // 确保answers数组有效，至少有5个答案
    if (!currentAnswers || currentAnswers.length < FREE_QUESTIONS) {
      return;
    }

    const score = calculateScore(currentAnswers);
    const { level } = getStressLevel(score);

    // Save assessment to localStorage
    try {
      const assessmentData = {
        answers: currentAnswers,
        score,
        stressLevel: level,
        isPremium: false,
        timestamp: Date.now(),
      };
      const existing = localStorage.getItem("stress_assessments");
      const assessments = existing ? JSON.parse(existing) : [];
      assessments.push(assessmentData);
      localStorage.setItem("stress_assessments", JSON.stringify(assessments));
    } catch {
      // Failed to save
    }

    // 先隐藏 paywall，然后显示结果
    setShowPaywall(false);
    setStressScore(score);
    setStressLevel(level);
    setShowResults(true);
  };

  const handleRestart = () => {
    addDebugInfo("重新开始按钮被点击");
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setShowPaywall(false);
    setStressScore(0);
    setStressLevel("");
  };

  const calculateScore = (answersArray: number[]) => {
    const validAnswers = answersArray.filter((a) => a !== undefined);
    if (validAnswers.length === 0) return 0;
    const total = validAnswers.reduce((sum, answer) => sum + answer, 0);
    return Math.round((total / (validAnswers.length * 3)) * 100);
  };

  const getStressLevel = (score: number) => {
    if (score < 25) return { level: "low", color: "green" };
    if (score < 50) return { level: "moderate", color: "yellow" };
    if (score < 75) return { level: "high", color: "orange" };
    return { level: "severe", color: "red" };
  };

  // Debug panel for development
  const DebugPanel = () => (
    <div className="fixed bottom-4 right-4 w-80 h-64 bg-gray-900 text-white p-4 rounded-lg shadow-lg overflow-y-auto z-50">
      <h3 className="font-bold mb-2">调试信息</h3>
      <button
        onClick={() => setDebugInfo([])}
        className="mb-2 px-2 py-1 bg-blue-600 rounded text-xs"
      >
        清除日志
      </button>
      <div className="text-xs space-y-1">
        {debugInfo.map((info, index) => (
          <div key={index} className="border-b border-gray-700 pb-1">
            {info}
          </div>
        ))}
      </div>
      <div className="mt-2 pt-2 border-t border-gray-700">
        <p>
          当前问题: {currentQuestion + 1}/{questions.length}
        </p>
        <p>回答数量: {answers.length}</p>
        <p>付费墙: {showPaywall ? "显示" : "隐藏"}</p>
        <p>结果页: {showResults ? "显示" : "隐藏"}</p>
      </div>
    </div>
  );

  // Paywall view with enhanced debug
  if (showPaywall) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
        {/* Debug Panel for Development */}
        {process.env.NODE_ENV === "development" && <DebugPanel />}

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
            <span className="text-3xl">🔒</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {t("paywall.title")}
          </h2>
          <p className="text-lg text-gray-600 mb-6">{t("paywall.subtitle")}</p>
        </div>

        {/* 付费功能对比 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 border-2 border-gray-200 rounded-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {t("paywall.comparison.free.title")}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-600">
                <span className="text-green-500">✓</span>
                {t("paywall.comparison.free.features.questions")}
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <span className="text-green-500">✓</span>
                {t("paywall.comparison.free.features.score")}
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <span className="text-green-500">✓</span>
                {t("paywall.comparison.free.features.radar")}
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <span className="text-gray-300">✗</span>
                {t("paywall.comparison.free.features.analysis")}
              </li>
            </ul>
          </div>

          <div className="p-6 border-2 border-orange-200 rounded-xl bg-orange-50 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {t("paywall.comparison.premium.badge")}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mt-4 mb-4">
              {t("paywall.comparison.premium.title")}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-600">
                <span className="text-orange-500">✓</span>
                {t("paywall.comparison.premium.features.report")}
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <span className="text-orange-500">✓</span>
                {t("paywall.comparison.premium.features.phq9")}
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <span className="text-orange-500">✓</span>
                {t("paywall.comparison.premium.features.management")}
              </li>
            </ul>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-4">
          <button
            onClick={handleSkipPaywall}
            className="flex-1 btn-secondary py-3"
          >
            {t("buttons.viewFreeResults")}
          </button>

          {/* Enhanced payment button with debug */}
          <button
            onClick={() => {
              addDebugInfo("按钮点击事件触发");
              handleUnlockPremium();
            }}
            onMouseDown={() => addDebugInfo("按钮 onMouseDown 事件")}
            onMouseUp={() => addDebugInfo("按钮 onMouseUp 事件")}
            className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow relative z-10"
            style={{ pointerEvents: "auto" }}
          >
            {t("buttons.unlockPremium")}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          {t("paywall.thanksMessage")}
        </p>
      </div>
    );
  }

  // Assessment question view with debug
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
      {/* Debug Panel for Development */}
      {process.env.NODE_ENV === "development" && <DebugPanel />}

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            {ui("progress.question", {
              current: currentQuestion + 1,
              total: questions.length,
            })}
          </span>
          <span className="text-sm text-gray-600">
            {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {t(questions[currentQuestion].questionKey)}
        </h2>
        <p className="text-gray-600">{t("assessment.selectOption")}</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {questions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option.value)}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              answers[currentQuestion] === option.value
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div className="flex items-center">
              <div
                className={`w-6 h-6 rounded-full border-2 mr-3 ${
                  answers[currentQuestion] === option.value
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300"
                }`}
              >
                {answers[currentQuestion] === option.value && (
                  <div className="w-2 h-2 bg-white rounded-full m-1.5"></div>
                )}
              </div>
              <span className="text-gray-800">{t(option.key)}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => {
            addDebugInfo("重新开始按钮被点击");
            handleRestart();
          }}
          className="btn-secondary px-6 py-2"
        >
          {t("buttons.restart")}
        </button>
        {currentQuestion > 0 && (
          <button
            onClick={() => {
              addDebugInfo("返回上一题按钮被点击");
              setCurrentQuestion(currentQuestion - 1);
            }}
            className="btn-secondary px-6 py-2"
          >
            {t("buttons.previous")}
          </button>
        )}
      </div>
    </div>
  );
}
