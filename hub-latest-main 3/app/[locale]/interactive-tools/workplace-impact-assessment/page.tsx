'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { titleManager } from '@/utils/unifiedTitleManager';
import { getWorkplaceQuestions } from '../shared/data/assessmentQuestions';
import { calculateWorkplaceImpact } from '../shared/data/calculationAlgorithms';
import WelcomeScreen from './components/WelcomeScreen';
import QuestionScreen from './components/QuestionScreen';
import ResultsScreen from './components/ResultsScreen';
import ProgressBar from './components/ProgressBar';

// 页面状态类型
type PageState = 'welcome' | 'questions' | 'results';

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

export default function WorkplaceImpactAssessmentPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const router = useRouter();
  const t = useTranslations('interactiveTools.workplaceAssessment');
  const commonT = useTranslations('common');

  // 页面状态管理
  const [currentState, setCurrentState] = useState<PageState>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<WorkplaceAnswers>({});
  const [results, setResults] = useState<WorkplaceResults | null>(null);

  // 获取题库数据
  const questions = getWorkplaceQuestions('zh'); // 使用固定语言，因为题库数据已经在组件中处理国际化

  // 设置页面标题
  useEffect(() => {
    const metaTitle = t('metaTitle') || '职场影响评估 - 专业痛经对工作影响分析工具 | Period Hub';
    titleManager.setTitle(metaTitle, 'zh');
  }, [t]);

  // 开始评估
  const handleStartAssessment = () => {
    setCurrentState('questions');
    setCurrentQuestionIndex(0);
  };

  // 处理问题答案
  const handleAnswer = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // 下一题
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 完成所有问题，计算结果
      const workplaceResults = calculateWorkplaceImpact(answers, 'zh');
      setResults(workplaceResults);
      setCurrentState('results');
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
    setCurrentState('welcome');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResults(null);
  };

  // 返回主页
  const handleBack = () => {
    router.push('/zh/interactive-tools');
  };

  // 渲染当前页面内容
  const renderCurrentContent = () => {
    switch (currentState) {
      case 'welcome':
        return <WelcomeScreen onStart={handleStartAssessment} onBack={handleBack} />;

      case 'questions':
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

      case 'results':
        return (
          <ResultsScreen
            results={results}
            onRestart={handleRestart}
            onBack={handleBack}
          />
        );

      default:
        return <WelcomeScreen onStart={handleStartAssessment} onBack={handleBack} />;
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
