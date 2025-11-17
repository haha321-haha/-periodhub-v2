"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { titleManager } from "@/utils/unifiedTitleManager";
import { getWorkplaceQuestions } from "../shared/data/assessmentQuestions";
import { calculateWorkplaceImpact } from "../shared/data/calculationAlgorithms";

const WelcomeScreen = dynamic(() => import("./components/WelcomeScreen"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />,
});

const QuestionScreen = dynamic(() => import("./components/QuestionScreen"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />,
});

const ResultsScreen = dynamic(() => import("./components/ResultsScreen"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />,
});

const ProgressBar = dynamic(() => import("./components/ProgressBar"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-8 rounded-lg" />,
});

// 页面状态类型
type PageState = "welcome" | "questions" | "results";

// 答案类型
interface WorkplaceAnswers {
  concentration?: string;
  absenteeism?: string;
  communication?: string;
  support?: string[];
}

// 结果类型
interface WorkplaceResults {
  score: number;
  profile: string;
  suggestions: string[];
}

export default function WorkplaceImpactClient() {
  const router = useRouter();
  const t = useTranslations("interactiveTools.workplaceAssessment");

  // 页面状态管理
  const [currentState, setCurrentState] = useState<PageState>("welcome");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<WorkplaceAnswers>({});
  const [results, setResults] = useState<WorkplaceResults | null>(null);
  const [sessionData, setSessionData] = useState({
    sessionId: '',
    startTime: '',
    endTime: '',
    completionTime: 0,
    upgraded: false
  });

  // 获取题库数据
  const questions = getWorkplaceQuestions("zh");

  // 保存进度到localStorage
  const saveProgress = (state: PageState, index: number, assessmentAnswers: WorkplaceAnswers) => {
    const progressData = {
      state,
      currentQuestionIndex: index,
      answers: assessmentAnswers,
      timestamp: Date.now(),
      locale: "zh"
    };
    try {
      localStorage.setItem('workplaceAssessmentProgress', JSON.stringify(progressData));
    } catch (error) {
      console.warn('保存进度失败:', error);
    }
  };

  // 从localStorage恢复进度
  const loadProgress = () => {
    try {
      const saved = localStorage.getItem('workplaceAssessmentProgress');
      if (saved) {
        const progressData = JSON.parse(saved);
        const isExpired = Date.now() - progressData.timestamp > 24 * 60 * 60 * 1000;
        if (!isExpired) {
          setCurrentState(progressData.state || "welcome");
          setCurrentQuestionIndex(progressData.currentQuestionIndex || 0);
          setAnswers(progressData.answers || {});
          return true;
        } else {
          localStorage.removeItem('workplaceAssessmentProgress');
        }
      }
    } catch (error) {
      console.warn('恢复进度失败:', error);
    }
    return false;
  };

  // 生成会话ID
  const generateSessionId = () => {
    return `workplace_assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // 组件加载时恢复进度和初始化会话
  useEffect(() => {
    loadProgress();
    setSessionData(prev => ({
      ...prev,
      sessionId: generateSessionId(),
      startTime: new Date().toISOString()
    }));
  }, []);

  // 状态变化时自动保存进度
  useEffect(() => {
    if (currentState === "questions" || currentState === "results") {
      saveProgress(currentState, currentQuestionIndex, answers);
    }
  }, [currentState, currentQuestionIndex, answers]);

  // 设置页面标题
  useEffect(() => {
    const metaTitle =
      t("metaTitle") ||
      "职场影响评估 - 专业痛经对工作影响分析工具 | Period Hub";
    titleManager.setTitle(metaTitle, "zh");
  }, [t]);

  // 开始评估
  const handleStartAssessment = () => {
    setCurrentState("questions");
    setCurrentQuestionIndex(0);
  };

  // 处理问题答案
  const handleAnswer = (questionId: string, answer: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  // 下一题
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const workplaceResults = calculateWorkplaceImpact(answers, "zh");
      setResults(workplaceResults);
      setCurrentState("results");
    }
  };

  // 上一题
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // 重新评估
  const handleRestart = () => {
    setCurrentState("welcome");
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResults(null);
    try {
      localStorage.removeItem('workplaceAssessmentProgress');
    } catch (error) {
      console.warn('清除进度失败:', error);
    }
  };

  // 返回主页
  const handleBack = () => {
    router.push("/zh/interactive-tools");
  };

  // 渲染当前页面内容
  const renderCurrentContent = () => {
    switch (currentState) {
      case "welcome":
        return (
          <WelcomeScreen onStart={handleStartAssessment} onBack={handleBack} />
        );

      case "questions":
        return (
          <div className="space-y-6">
            <ProgressBar
              current={currentQuestionIndex + 1}
              total={questions.length}
            />
            <QuestionScreen
              question={questions[currentQuestionIndex]}
              answer={answers[questions[currentQuestionIndex]?.id]}
              onAnswer={handleAnswer}
              onNext={handleNext}
              onPrevious={handlePrevious}
              isFirstQuestion={currentQuestionIndex === 0}
              isLastQuestion={currentQuestionIndex === questions.length - 1}
            />
          </div>
        );

      case "results":
        return (
          <ResultsScreen
            results={results}
            onRestart={handleRestart}
            onBack={handleBack}
          />
        );

      default:
        return (
          <WelcomeScreen onStart={handleStartAssessment} onBack={handleBack} />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {renderCurrentContent()}
      </div>
    </div>
  );
}
