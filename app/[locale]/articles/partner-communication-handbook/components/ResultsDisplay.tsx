'use client';

import React, { useState, useEffect } from 'react';
import { useSafeTranslations } from '@/hooks/useSafeTranslations';
import { QuizResult } from '../types/quiz';
import { Locale } from '../types/common';

interface ResultsDisplayProps {
  result: QuizResult;
  locale: Locale;
  onStartTraining: () => void;
  onRetakeQuiz: () => void;
  className?: string;
}

export default function ResultsDisplay({
  result,
  locale,
  onStartTraining,
  onRetakeQuiz,
  className = ''
}: ResultsDisplayProps) {
  const { t } = useSafeTranslations('partnerHandbook.quiz.results');
  const [showCelebration, setShowCelebration] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  useEffect(() => {
    // 触发庆祝动画
    setShowCelebration(true);
    
    // 延迟显示建议
    const timer = setTimeout(() => {
      setShowRecommendations(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'text-yellow-600 bg-yellow-100';
      case 'intermediate':
        return 'text-blue-600 bg-blue-100';
      case 'advanced':
        return 'text-purple-600 bg-purple-100';
      case 'expert':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMotivationalMessage = (level: string) => {
    const messages = {
      beginner: locale === 'zh' 
        ? "别担心，每个人都是从零开始的！" 
        : "Don't worry, everyone starts from zero!",
      intermediate: locale === 'zh' 
        ? "你已经有了不错的基础，继续加油！" 
        : "You already have a good foundation, keep going!",
      advanced: locale === 'zh' 
        ? "太棒了！你已经是理解痛经的高手了！" 
        : "Amazing! You're already an expert at understanding period pain!",
      expert: locale === 'zh' 
        ? "完美！你就是最暖心的伴侣！" 
        : "Perfect! You are the most caring partner!"
    };
    return messages[level as keyof typeof messages];
  };

  return (
    <div className={`results-container ${className}`}>
      {/* 庆祝动画 */}
      {showCelebration && (
        <div className="celebration-animation text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-primary-600 mb-2">
            {locale === 'zh' ? '测试完成！' : 'Quiz Completed!'}
          </h2>
          <p className="text-lg text-gray-600">
            {getMotivationalMessage(result.level)}
          </p>
        </div>
      )}

      {/* 分数展示 */}
      <div className="text-center mb-8">
        <div className={`score-display ${getScoreColor(result.percentage)}`}>
          {result.percentage}%
        </div>
        <div className="text-xl font-semibold text-gray-700 mb-2">
          {result.totalScore} / {result.maxScore} {locale === 'zh' ? '分' : 'points'}
        </div>
        
        {/* 等级徽章 */}
        <div className={`level-badge level-${result.level} inline-block mb-4`}>
          {t(`${result.level}.title`)}
        </div>
      </div>

      {/* 详细结果 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* 分数分析 */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {locale === 'zh' ? '分数分析' : 'Score Analysis'}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">{locale === 'zh' ? '总分' : 'Total Score'}:</span>
              <span className="font-medium">{result.totalScore}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{locale === 'zh' ? '满分' : 'Max Score'}:</span>
              <span className="font-medium">{result.maxScore}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{locale === 'zh' ? '正确率' : 'Accuracy'}:</span>
              <span className="font-medium">{result.percentage}%</span>
            </div>
          </div>
        </div>

        {/* 等级说明 */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {locale === 'zh' ? '等级说明' : 'Level Description'}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {t(`${result.level}.description`)}
          </p>
        </div>
      </div>

      {/* 建议和反馈 */}
      {showRecommendations && (
        <div className="bg-white rounded-lg p-6 shadow-md mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {locale === 'zh' ? '个性化建议' : 'Personalized Recommendations'}
          </h3>
          <div className="space-y-3">
            {result.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start">
                <span className="bg-primary-100 text-primary-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">
                  {index + 1}
                </span>
                <p className="text-gray-700">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 下一步行动 */}
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {locale === 'zh' ? '下一步行动' : 'Next Steps'}
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onStartTraining}
            className="btn-primary flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {locale === 'zh' ? '开始30天训练营' : 'Start 30-Day Training Camp'}
          </button>
          
          <button
            onClick={onRetakeQuiz}
            className="btn-outline flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {locale === 'zh' ? '重新测试' : 'Retake Quiz'}
          </button>
        </div>
      </div>

      {/* 分享功能 */}
      <div className="text-center mt-8 pt-6 border-t border-gray-200">
        <p className="text-gray-600 mb-4">
          {locale === 'zh' ? '分享你的成果' : 'Share Your Achievement'}
        </p>
        <div className="flex justify-center space-x-4">
          <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
            </svg>
          </button>
          <button className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
          </button>
          <button className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}



