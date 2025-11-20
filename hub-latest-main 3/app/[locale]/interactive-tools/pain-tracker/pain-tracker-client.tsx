'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import PainTrackerTool from '../components/PainTrackerTool';
import Breadcrumb from '@/components/Breadcrumb';

interface Props {
  params: { locale: string };
}

export default function PainTrackerClient({ params: { locale } }: Props) {
  const t = useTranslations('interactiveTools');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('painTracker.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('painTracker.description')}
            </p>
          </div>

          {/* 面包屑导航 */}
          <Breadcrumb
            items={[
              { label: locale === 'zh' ? '互动工具' : 'Interactive Tools', href: `/${locale}/interactive-tools` },
              { label: locale === 'zh' ? '疼痛追踪工具' : 'Pain Tracking Tool' }
            ]}
          />

          {/* 疼痛追踪工具 */}
          <PainTrackerTool locale={locale} />
        </div>
      </div>
    </div>
  );
}