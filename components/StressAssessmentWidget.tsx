"use client";

import { useState, useEffect, Suspense } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { PrivacyNotice } from "@/components/PrivacyNotice";
// LocalStorageManager removed - using localStorage directly
import {
  trackAssessmentStart,
  trackAssessmentComplete,
  // generateAnonymousUserId, // Reserved for future analytics
} from "@/lib/ab-test-tracking";

const StressRadarChart = dynamic(
  () =>
    import("@/components/StressRadarChart").then((mod) => ({
      default: mod.StressRadarChart,
    })),
  {
    loading: () => (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    ),
    ssr: false,
  },
);

export default function StressAssessmentWidget() {
  const t = useTranslations("stressManagement");
  const ui = useTranslations("ui");

  // Reserved for future analytics: const [userId] = useState(() => generateAnonymousUserId());
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [stressScore, setStressScore] = useState(0);
  const [stressLevel, setStressLevel] = useState("");
  const [startTime] = useState<number>(Date.now());

  const FREE_QUESTIONS = 5; // 免费问题数量

  useEffect(() => {
    trackAssessmentStart("stress_assessment", "stress_assessment");
  }, []);

  const questions = [
    // 免费问题 (1-5)
    {
      id: "q1",
      questionKey: "assessment.q1.question",
      optionKeys: [
        "assessment.q1.option1",
        "assessment.q1.option2",
        "assessment.q1.option3",
        "assessment.q1.option4",
      ],
    },
    {
      id: "q2",
      questionKey: "assessment.q2.question",
      optionKeys: [
        "assessment.q2.option1",
        "assessment.q2.option2",
        "assessment.q2.option3",
        "assessment.q2.option4",
      ],
    },
    {
      id: "q3",
      questionKey: "assessment.q3.question",
      optionKeys: [
        "assessment.q3.option1",
        "assessment.q3.option2",
        "assessment.q3.option3",
        "assessment.q3.option4",
      ],
    },
    {
      id: "q4",
      questionKey: "assessment.q4.question",
      optionKeys: [
        "assessment.q4.option1",
        "assessment.q4.option2",
        "assessment.q4.option3",
        "assessment.q4.option4",
      ],
    },
    {
      id: "q5",
      questionKey: "assessment.q5.question",
      optionKeys: [
        "assessment.q5.option1",
        "assessment.q5.option2",
        "assessment.q5.option3",
        "assessment.q5.option4",
      ],
    },
    // 付费问题 (6-10)
    {
      id: "q6",
      questionKey: "assessment.q6.question",
      optionKeys: [
        "assessment.q6.option1",
        "assessment.q6.option2",
        "assessment.q6.option3",
        "assessment.q6.option4",
      ],
    },
    {
      id: "q7",
      questionKey: "assessment.q7.question",
      optionKeys: [
        "assessment.q7.option1",
        "assessment.q7.option2",
        "assessment.q7.option3",
        "assessment.q7.option4",
      ],
    },
    {
      id: "q8",
      questionKey: "assessment.q8.question",
      optionKeys: [
        "assessment.q8.option1",
        "assessment.q8.option2",
        "assessment.q8.option3",
        "assessment.q8.option4",
      ],
    },
    {
      id: "q9",
      questionKey: "assessment.q9.question",
      optionKeys: [
        "assessment.q9.option1",
        "assessment.q9.option2",
        "assessment.q9.option3",
        "assessment.q9.option4",
      ],
    },
    {
      id: "q10",
      questionKey: "assessment.q10.question",
      optionKeys: [
        "assessment.q10.option1",
        "assessment.q10.option2",
        "assessment.q10.option3",
        "assessment.q10.option4",
      ],
    },
  ];

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);

    // 第5题（索引4）后显示付费墙
    if (currentQuestion === FREE_QUESTIONS - 1) {
      // 延迟一点让用户看到答案被选中，然后显示付费墙
      setTimeout(() => {
        setShowPaywall(true);
      }, 300);
    } else if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      setTimeout(() => {
        const score = calculateScore(newAnswers);
        const { level } = getStressLevel(score);

        // Save assessment to localStorage
        try {
          const assessmentData = {
            answers: newAnswers,
            score,
            stressLevel: level,
            isPremium: newAnswers.length > FREE_QUESTIONS,
            timestamp: Date.now(),
          };
          const existing = localStorage.getItem("stress_assessments");
          const assessments = existing ? JSON.parse(existing) : [];
          assessments.push(assessmentData);
          localStorage.setItem(
            "stress_assessments",
            JSON.stringify(assessments),
          );
        } catch {
          // Failed to save
        }

        setStressScore(score);
        setStressLevel(level);
        setShowResults(true);
        // 计算持续时间（秒），使用开始时间或默认值
        const duration = Math.round(
          (Date.now() - (startTime || Date.now())) / 1000,
        );
        trackAssessmentComplete(
          "stress_assessment",
          "stress_assessment",
          score,
          duration,
        );
      }, 300);
    }
  };

  const handleUnlockPremium = () => {
    alert(t("alerts.paymentComingSoon"));
    setShowPaywall(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSkipPaywall = () => {
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

    // 追踪评估完成
    const duration = Math.round(
      (Date.now() - (startTime || Date.now())) / 1000,
    );
    trackAssessmentComplete(
      "stress_assessment",
      "stress_assessment",
      score,
      duration,
    );
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowPaywall(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setShowPaywall(false);
    setStressScore(0);
    setStressLevel("");
  };

  const handleUnlockFromResults = () => {
    // 从结果页面打开付费墙
    setShowResults(false);
    setShowPaywall(true);
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

  const convertAnswersToRadarData = (answers: number[]) => {
    return {
      work: answers[0] || 0,
      sleep: answers[2] || 0,
      emotion: answers[3] || 0,
      physical: answers[4] || 0,
      social: answers[1] || 0,
    };
  };

  const getPersonalizedActionSteps = (
    answers: number[], // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _level: string,
  ) => {
    const steps = [
      {
        title: "Establish Sleep Routine",
        description:
          "Go to bed and wake up at consistent times. Create a relaxing bedtime routine to improve sleep quality.",
      },
      {
        title: "Practice Stress Relief Techniques",
        description:
          "Try deep breathing exercises, meditation, or gentle yoga for 10-15 minutes daily to manage stress.",
      },
      {
        title: "Improve Work-Life Balance",
        description:
          "Set clear boundaries between work and personal time. Take regular breaks during work hours.",
      },
      {
        title: "Build Emotional Support Network",
        description:
          "Connect with friends, family, or support groups. Consider talking to a mental health professional if needed.",
      },
    ];

    // 根据用户的具体问题调整建议
    if (answers[1] >= 2) {
      // 睡眠问题
      steps[0].description =
        "Focus on improving sleep hygiene - avoid screens 1 hour before bed, keep bedroom cool and dark.";
    }

    if (answers[0] >= 2) {
      // 工作压力问题
      steps[2].description =
        "Break large tasks into smaller ones, delegate when possible, and practice saying no to additional responsibilities.";
    }

    if (answers[3] >= 2) {
      // 情绪问题
      steps[1].description =
        "Practice mindfulness and emotional regulation techniques. Consider journaling your feelings.";
    }

    if (answers[4] >= 2) {
      // 社交压力
      steps[3].description =
        "Join support groups or community activities that align with your interests and values.";
    }

    return steps;
  };

  const getPersonalizedRecommendations = (
    answers: number[], // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _level: string,
  ) => {
    const recommendations = [];
    const avgScore =
      answers.reduce((sum, answer) => sum + answer, 0) / answers.length;

    if (avgScore <= 1) {
      recommendations.push(
        {
          emoji: "🌟",
          title: "Maintain Good Habits",
          description:
            "Your stress level is low. Keep up your healthy lifestyle habits.",
        },
        {
          emoji: "📊",
          title: "Regular Self-Assessment",
          description:
            "Conduct weekly stress self-assessments to monitor your mental state.",
        },
      );
    } else if (avgScore <= 2) {
      recommendations.push(
        {
          emoji: "🧘",
          title: "Practice Relaxation Techniques",
          description:
            "Try 10-15 minutes of deep breathing or meditation daily to manage moderate stress.",
        },
        {
          emoji: "😴",
          title: "Optimize Sleep Quality",
          description:
            "Aim for 7-8 hours of sleep per night and avoid electronic devices before bed.",
        },
      );
    } else {
      recommendations.push(
        {
          emoji: "🆘",
          title: "Seek Professional Help",
          description:
            "Your stress level is high. Consider consulting a mental health professional.",
        },
        {
          emoji: "👥",
          title: "Strengthen Social Support",
          description:
            "Share your feelings with trusted friends and family for emotional support.",
        },
      );
    }

    return recommendations;
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  // 只有回答了超过免费问题数量（即6个或更多）才被认为是付费用户
  const isPremiumUser = answers.length > FREE_QUESTIONS;

  // Paywall view
  if (showPaywall) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
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
              <li className="flex items-center gap-2 text-gray-400">
                <span className="text-gray-300">✗</span>
                {t("paywall.comparison.free.features.analysis")}
              </li>
            </ul>
          </div>

          <div className="p-6 border-2 border-orange-500 rounded-xl bg-gradient-to-br from-orange-50 to-yellow-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {t("paywall.comparison.premium.title")}
              </h3>
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {t("paywall.comparison.premium.badge")}
              </span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-gray-700">
                <span className="text-orange-500">✓</span>
                {t("paywall.comparison.premium.features.report")}
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="text-orange-500">✓</span>
                {t("paywall.comparison.premium.features.phq9")}
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="text-orange-500">✓</span>
                {t("paywall.comparison.premium.features.management")}
              </li>
            </ul>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                $4.99
              </div>
              <p className="text-sm text-gray-600">
                One-time payment for lifetime access
              </p>
            </div>
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
          <button
            onClick={handleUnlockPremium}
            className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            {t("buttons.comingSoon")}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          {t("paywall.thanksMessage")}
        </p>
      </div>
    );
  }

  // Results view
  if (showResults) {
    const { color } = getStressLevel(stressScore);

    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
            <span className="text-3xl">📊</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {t("results.title")}
          </h2>
          <p className="text-gray-600">{t("results.subtitle")}</p>
        </div>

        {/* Score Display */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-blue-600 mb-2">
              {stressScore}
            </div>
            <div className="text-lg text-gray-700 mb-4">
              {t("results.score")}
            </div>
            <div
              className={`inline-block px-6 py-2 rounded-full text-white font-semibold bg-${color}-500`}
            >
              {t(`results.stressLevels.${stressLevel}`)}
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="mb-6">
          <Suspense
            fallback={
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            }
          >
            <StressRadarChart
              scores={convertAnswersToRadarData(answers)}
              className="border-2 border-blue-200"
            />
          </Suspense>
        </div>

        {/* Recommendations */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {t("results.basicRecommendations")}
          </h3>
          <div className="space-y-3">
            {getPersonalizedRecommendations(answers, stressLevel).map(
              (recommendation, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg"
                >
                  <span className="text-2xl">{recommendation.emoji}</span>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      {recommendation.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {recommendation.description}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        {/* 付费解锁提示 - 仅免费用户显示 */}
        {!isPremiumUser && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white mb-6">
            <div className="flex items-center gap-4">
              <span className="text-4xl">🔒</span>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">
                  {t("results.unlockCompleteReport.title")}
                </h3>
                <p className="text-purple-100 mb-4">
                  {t("results.unlockCompleteReport.description")}
                </p>
                <button
                  onClick={handleUnlockFromResults}
                  className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
                >
                  {t("results.unlockCompleteReport.button")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 完整报告内容（付费用户） */}
        {isPremiumUser && (
          <div className="space-y-6 mb-6">
            <div className="border-t pt-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {t("results.detailedAnalysis.title")}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {t("results.detailedAnalysis.stressAnalysis.title")}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {t("results.detailedAnalysis.stressAnalysis.description")}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {t("results.detailedAnalysis.improvementFocus.title")}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {t("results.detailedAnalysis.improvementFocus.description")}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {t("results.personalizedActionPlan.title")}
              </h3>
              <div className="space-y-3">
                {getPersonalizedActionSteps(answers, stressLevel).map(
                  (step, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                    >
                      <span className="text-xl">✓</span>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">
                          {step.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!isPremiumUser && (
            <button
              onClick={handleUnlockFromResults}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
            >
              {t("results.unlockCompleteReport.button")}
            </button>
          )}
          <button onClick={handleRestart} className="btn-secondary px-8 py-3">
            {t("buttons.restartAssessment")}
          </button>
        </div>
      </div>
    );
  }

  // Assessment view
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
      {/* Privacy Notice - only on first question */}
      {currentQuestion === 0 && (
        <div className="mb-6">
          <PrivacyNotice />
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            {ui("questionProgress", {
              current: currentQuestion + 1,
              total: questions.length,
            })}
          </span>
          <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        {currentQuestion >= FREE_QUESTIONS && (
          <p className="text-xs text-purple-600 mt-1 font-semibold">
            {ui("premiumQuestion")}
          </p>
        )}
      </div>

      {/* Question */}
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
          <span className="text-2xl font-bold text-white">
            {currentQuestion + 1}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {t(questions[currentQuestion].questionKey)}
        </h2>
        <p className="text-gray-600">{t("assessment.selectOption")}</p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {questions[currentQuestion].optionKeys.map((optionKey, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
              answers[currentQuestion] === index
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  answers[currentQuestion] === index
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300"
                }`}
              >
                {answers[currentQuestion] === index && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className="text-gray-800 font-medium">{t(optionKey)}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Navigation */}
      {currentQuestion > 0 && (
        <div className="text-center">
          <button
            onClick={handlePrevious}
            className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            ← Previous
          </button>
        </div>
      )}
    </div>
  );
}
