'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import SymptomAssessmentTool from '../components/SymptomAssessmentTool';

interface Props {
  params: { locale: string };
}

export default function SymptomAssessmentClient({ params: { locale } }: Props) {
  const t = useTranslations('interactiveTools');
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'simplified';

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('symptomAssessment.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('symptomAssessment.description')}
            </p>
            {/* 显示当前评估模式 */}
            <div className="mt-4">
              <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                {mode === 'simplified' && t('symptomAssessment.modes.simplified')}
                {mode === 'detailed' && t('symptomAssessment.modes.detailed')}
                {mode === 'medical' && t('symptomAssessment.modes.medical')}
              </span>
            </div>
          </div>

          {/* 面包屑导航 */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Link href={`/${locale}`} className="hover:text-pink-600">
                {t('breadcrumb.home')}
              </Link>
              <span>/</span>
              <Link href={`/${locale}/interactive-tools`} className="hover:text-pink-600">
                {t('breadcrumb.interactiveTools')}
              </Link>
              <span>/</span>
              <span className="text-gray-900">{t('symptomAssessment.title')}</span>
            </div>
          </nav>

          {/* 症状评估工具 */}
          <SymptomAssessmentTool locale={locale} mode={mode} />

          {/* 返回按钮 - 页面底部 */}
          <div className="mt-8 flex justify-center">
            <Link 
              href={`/${locale}/interactive-tools/period-pain-impact-calculator`}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-300"
            >
              ← {locale === 'zh' ? '返回' : 'Back'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}