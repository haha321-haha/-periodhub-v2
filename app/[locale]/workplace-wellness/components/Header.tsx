/**
 * HVsLYEp职场健康助手 - 头部组件
 * 基于HVsLYEp的Header函数设计
 */

'use client';

import { Heart } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useWorkplaceWellnessActions } from '../hooks/useWorkplaceWellnessStore';
import { createTranslationFunction } from '../data';

export default function Header() {
  const locale = useLocale();
  const { toggleLanguage } = useWorkplaceWellnessActions();
  const t = createTranslationFunction(locale as 'zh' | 'en');

  return (
    <header className="bg-white shadow-sm border-b border-neutral-100">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo和标题区域 */}
          <div className="flex items-center gap-3">
            <Heart className="text-primary-500" size={28} />
            <div>
              <h1 className="text-xl font-bold text-neutral-900">
                {t('header.title')}
              </h1>
              <p className="text-sm text-neutral-600">
                {t('header.subtitle')}
              </p>
            </div>
          </div>
          
          {/* 右侧操作区域 */}
          <div className="flex items-center gap-3">
            {/* 语言切换按钮 */}
            <button 
              onClick={toggleLanguage}
              className="px-3 py-1.5 text-sm rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 hover:bg-neutral-100 text-neutral-800"
            >
              {t('lang_name')}
            </button>
            
            {/* 用户头像 */}
            <div className="w-8 h-8 bg-secondary-500/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-secondary-700">L</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
