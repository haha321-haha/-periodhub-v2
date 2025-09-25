'use client';

import React, { useState, useEffect } from 'react';
import { useSafeTranslations } from '@/hooks/useSafeTranslations';
import { QuizQuestion, QuizAnswer, QuizResult, QuizProgress } from '../types/quiz';
import { Locale } from '../types/common';

interface PartnerUnderstandingQuizProps {
  locale: Locale;
  onQuizComplete: (result: QuizResult) => void;
  className?: string;
}

export default function PartnerUnderstandingQuiz({
  locale,
  onQuizComplete,
  className = ''
}: PartnerUnderstandingQuizProps) {
  const { t } = useSafeTranslations('partnerHandbook.quiz');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // 从翻译中获取测试题目
  const questions: QuizQuestion[] = [
    {
      id: 'q1',
      question: t('questions.0.question'),
      options: [
        { id: 1, text: t('questions.0.options.0.text'), score: 1 },
        { id: 2, text: t('questions.0.options.1.text'), score: 2 },
        { id: 3, text: t('questions.0.options.2.text'), score: 3 },
        { id: 4, text: t('questions.0.options.3.text'), score: 4 }
      ],
      correctAnswer: 4,
      explanation: t('questions.0.explanation')
    },
    {
      id: 'q2',
      question: t('questions.1.question'),
      options: [
        { id: 1, text: t('questions.1.options.0.text'), score: 1 },
        { id: 2, text: t('questions.1.options.1.text'), score: 2 },
        { id: 3, text: t('questions.1.options.2.text'), score: 3 },
        { id: 4, text: t('questions.1.options.3.text'), score: 4 }
      ],
      correctAnswer: 4,
      explanation: t('questions.1.explanation')
    },
    {
      id: 'q3',
      question: t('questions.2.question'),
      options: [
        { id: 1, text: t('questions.2.options.0.text'), score: 2 },
        { id: 2, text: t('questions.2.options.1.text'), score: 3 },
        { id: 3, text: t('questions.2.options.2.text'), score: 3 },
        { id: 4, text: t('questions.2.options.3.text'), score: 4 }
      ],
      correctAnswer: 4,
      explanation: t('questions.2.explanation')
    },
    {
      id: 'q4',
      question: t('questions.3.question'),
      options: [
        { id: 1, text: t('questions.3.options.0.text'), score: 1 },
        { id: 2, text: t('questions.3.options.1.text'), score: 3 },
        { id: 3, text: t('questions.3.options.2.text'), score: 4 },
        { id: 4, text: t('questions.3.options.3.text'), score: 1 }
      ],
      correctAnswer: 3,
      explanation: t('questions.3.explanation')
    },
    {
      id: 'q5',
      question: t('questions.4.question'),
      options: [
        { id: 1, text: t('questions.4.options.0.text'), score: 1 },
        { id: 2, text: t('questions.4.options.1.text'), score: 1 },
        { id: 3, text: t('questions.4.options.2.text'), score: 3 },
        { id: 4, text: t('questions.4.options.3.text'), score: 4 }
      ],
      correctAnswer: 4,
      explanation: t('questions.4.explanation')
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const progress: QuizProgress = {
    current: currentQuestionIndex + 1,
    total: questions.length,
    percentage: Math.round(((currentQuestionIndex + 1) / questions.length) * 100)
  };

  const handleOptionSelect = (optionId: number) => {
    setSelectedOption(optionId);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (selectedOption !== null && currentQuestion) {
      const answer: QuizAnswer = {
        questionId: currentQuestion.id,
        selectedOption,
        isCorrect: selectedOption === currentQuestion.correctAnswer,
        score: currentQuestion.options.find(opt => opt.id === selectedOption)?.score || 0
      };

      setAnswers(prev => [...prev, answer]);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        setShowExplanation(false);
      } else {
        // 测试完成
        const result = calculateResult();
        setIsCompleted(true);
        onQuizComplete(result);
      }
    }
  };

  const calculateResult = (): QuizResult => {
    const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0);
    const maxScore = questions.length * 4; // 每题最高4分
    const percentage = Math.round((totalScore / maxScore) * 100);

    let level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    if (percentage < 40) level = 'beginner';
    else if (percentage < 60) level = 'intermediate';
    else if (percentage < 80) level = 'advanced';
    else level = 'expert';

    return {
      totalScore,
      maxScore,
      percentage,
      level,
      feedback: t(`results.${level}.description`),
      recommendations: Object.values(t(`results.${level}.recommendations`)) as string[]
    };
  };

  if (isCompleted) {
    return (
      <div className={`quiz-container ${className}`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary-600 mb-4">
            {t('title')} - {t('results.beginner.title')}
          </h2>
          <p className="text-gray-600">
            {t('results.beginner.description')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`quiz-container ${className}`}>
      {/* 测试标题和说明 */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary-600 mb-4">
          {t('title')}
        </h2>
        <p className="text-gray-600 mb-6">
          {t('instructions')}
        </p>
      </div>

      {/* 进度条 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {t('progress', { current: progress.current, total: progress.total })}
          </span>
          <span className="text-sm text-gray-500">
            {progress.percentage}%
          </span>
        </div>
        <div className="quiz-progress">
          <div 
            className="quiz-progress-bar"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>

      {/* 当前题目 */}
      <div className="quiz-card mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          {currentQuestion?.question}
        </h3>

        {/* 选项 */}
        <div className="space-y-3">
          {currentQuestion?.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className={`quiz-option w-full text-left ${
                selectedOption === option.id ? 'selected' : ''
              } ${
                showExplanation && option.id === currentQuestion.correctAnswer ? 'correct' : ''
              } ${
                showExplanation && selectedOption === option.id && option.id !== currentQuestion.correctAnswer ? 'incorrect' : ''
              }`}
              disabled={showExplanation}
            >
              <span className="font-medium">{option.id}.</span> {option.text}
            </button>
          ))}
        </div>

        {/* 解释 */}
        {showExplanation && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 font-medium">
              {currentQuestion?.explanation}
            </p>
          </div>
        )}
      </div>

      {/* 下一题按钮 */}
      <div className="text-center">
        <button
          onClick={handleNext}
          disabled={selectedOption === null}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestionIndex < questions.length - 1 ? t('nextButton') : t('submitButton')}
        </button>
      </div>
    </div>
  );
}



