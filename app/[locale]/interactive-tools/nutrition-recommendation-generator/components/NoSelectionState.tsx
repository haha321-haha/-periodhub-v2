/**
 * 无选择状态组件 - 优化版本
 * 显示用户未选择任何选项时的友好提示
 */

'use client';

import { useState, useEffect } from 'react';
import type { Language } from '../types';
import { getUIContent } from '../utils/uiContent';

interface NoSelectionStateProps {
  language: Language;
}

export default function NoSelectionState({ language }: NoSelectionStateProps) {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    // 添加进入动画
    setAnimationClass('animate-fade-in');
  }, []);

  const isZh = language === 'zh';

  return (
    <div className={`text-center p-12 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 shadow-sm ${animationClass}`}>
      {/* 动画图标 */}
      <div className="relative mb-6">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center shadow-inner">
          <svg 
            className="w-10 h-10 text-purple-500 animate-pulse" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
            />
          </svg>
        </div>
        {/* 装饰性小图标 */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-200 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      </div>

      {/* 主标题 */}
      <h3 className="text-xl font-semibold text-gray-800 mb-3">
        {isZh ? '✨ 开始您的个性化营养之旅' : '✨ Start Your Personalized Nutrition Journey'}
      </h3>

      {/* 描述文字 */}
      <p className="text-gray-600 mb-4 leading-relaxed">
        {isZh 
          ? '请选择您的月经阶段、健康目标和中医体质，我们将为您生成专属的营养建议'
          : 'Please select your menstrual phase, health goals, and TCM constitution to generate personalized nutrition recommendations'
        }
      </p>

      {/* 步骤提示 */}
      <div className="flex justify-center space-x-4 text-sm text-gray-500">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center mr-2">
            <span className="text-purple-600 font-semibold text-xs">1</span>
          </div>
          {isZh ? '选择阶段' : 'Select Phase'}
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center mr-2">
            <span className="text-purple-600 font-semibold text-xs">2</span>
          </div>
          {isZh ? '设定目标' : 'Set Goals'}
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center mr-2">
            <span className="text-purple-600 font-semibold text-xs">3</span>
          </div>
          {isZh ? '生成建议' : 'Generate'}
        </div>
      </div>

      {/* 底部装饰 */}
      <div className="mt-6 pt-4 border-t border-purple-100">
        <p className="text-xs text-gray-400">
          {isZh ? '💡 提示：所有建议都基于科学研究和中医理论' : '💡 Tip: All recommendations are based on scientific research and TCM theory'}
        </p>
      </div>
    </div>
  );
}
