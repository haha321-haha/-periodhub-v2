/**
 * Workplace Wellness Assistant - Header Component
 * Based on HVsLYEp Header function design
 */

'use client';

import { Heart } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

export default function Header() {
  const t = useTranslations('workplaceWellness');
  const locale = useLocale();

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
            {/* 用户头像 */}
            <div className="w-8 h-8 bg-secondary-500/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-secondary-700">L</span>
            </div>
          </div>
        </div>
        
        {/* 面包屑导航 */}
        <nav className="mt-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <a 
              href={`/${locale}`}
              className="hover:text-pink-600"
            >
              {locale === 'zh' ? '首页' : 'Home'}
            </a>
            <span>/</span>
            <a 
              href={`/${locale}/interactive-tools`}
              className="hover:text-pink-600"
            >
              {locale === 'zh' ? '互动工具' : 'Interactive Tools'}
            </a>
            <span>/</span>
            <span className="text-gray-900">
              {t('header.title')}
            </span>
          </div>
        </nav>
      </div>
    </header>
  );
}
