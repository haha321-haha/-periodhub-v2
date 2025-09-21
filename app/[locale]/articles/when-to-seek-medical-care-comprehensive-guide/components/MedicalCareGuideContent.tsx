'use client';

import { useTranslations } from 'next-intl';
import { Suspense } from 'react';
import { ResponsiveContainer } from '../../../interactive-tools/shared/components/ResponsiveContainer';
import LoadingSystem from '../../../interactive-tools/shared/components/LoadingSystem';
import { ErrorBoundary } from '../../../interactive-tools/shared/components/ErrorBoundary';
import { 
  PainAssessmentToolClient, 
  SymptomChecklistClient, 
  DecisionTreeClient, 
  ComparisonTableClient 
} from './MedicalCareGuideClient';

export default function MedicalCareGuideContent() {
  const t = useTranslations('medicalCareGuide');

  return (
    <ResponsiveContainer className="py-12 md:py-20">
      <main role="main" aria-label="医疗护理指南主要内容">
        <article 
          role="article" 
          aria-labelledby="main-title"
          className="prose prose-lg lg:prose-xl max-w-none prose-h1:font-bold prose-h1:text-gray-900 prose-h2:font-semibold prose-h2:text-gray-800 prose-p:text-gray-700 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:text-blue-800 prose-a:text-blue-600 hover:prose-a:text-blue-700"
        >
        
        {/* 结构化数据注入 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'MedicalWebPage',
              'name': t('meta.title'),
              'description': t('meta.description')
            })
          }}
        />

        {/* 文章头部 */}
        <header role="banner" aria-label="文章标题区域" className="mb-12 border-b pb-8">
          <h1 id="main-title" className="text-4xl md:text-5xl font-extrabold tracking-tight text-center">
            {t('header.title')}
          </h1>
          <p className="mt-4 text-xl text-gray-600 text-center max-w-3xl mx-auto">
            {t('header.subtitle')}
          </p>
        </header>

        {/* 导言部分 */}
        <section role="region" aria-labelledby="introduction-title" className="mb-16">
          <h2 id="introduction-title">{t('article.section1.title')}</h2>
          <blockquote className="border-l-4 border-blue-500 bg-blue-50 p-4 my-6">
            <p className="text-blue-800 font-medium">{t('article.section1.quote')}</p>
          </blockquote>
          <p>{t('article.section1.p1')}</p>
          <p>{t('article.section1.p2')}</p>
          <p>{t('article.section1.p3')}</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>{t('article.section1.li1')}</li>
            <li>{t('article.section1.li2')}</li>
            <li>{t('article.section1.li3')}</li>
            <li>{t('article.section1.li4')}</li>
          </ul>
          <p>{t('article.section1.p4')}</p>
        </section>
        
        <div className="my-16 h-px bg-gray-200"></div>

        {/* 疼痛量化部分 */}
        <section role="region" aria-labelledby="pain-assessment-title" className="mb-16">
          <h2 id="pain-assessment-title">{t('article.section2.title')}</h2>
          <p>{t('article.section2.p1')}</p>
          <p>{t('article.section2.p2')}</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              {t.rich('article.section2.li1', {
                strong: (chunks) => <strong>{chunks}</strong>
              })}
            </li>
            <li>
              {t.rich('article.section2.li2', {
                strong: (chunks) => <strong>{chunks}</strong>
              })}
            </li>
          </ul>
          <p>{t('article.section2.p3')}</p>
          
          {/* 疼痛评估工具 */}
          <ErrorBoundary>
            <Suspense fallback={<LoadingSystem.LoadingSpinner size="lg" />}>
              <PainAssessmentToolClient />
            </Suspense>
          </ErrorBoundary>
        </section>
        
        <div className="my-16 h-px bg-gray-200"></div>

        {/* 危险信号部分 */}
        <section role="region" aria-labelledby="warning-signs-title" className="mb-16">
          <h2 id="warning-signs-title">{t('article.section3.title')}</h2>
          <p>{t('article.section3.p1')}</p>
          
          {/* 症状检查清单 */}
          <ErrorBoundary>
            <Suspense fallback={<LoadingSystem.LoadingSpinner size="lg" />}>
              <SymptomChecklistClient />
            </Suspense>
          </ErrorBoundary>
          
          <h3>{t('article.section3.h3_1')}</h3>
          <p>
            {t.rich('article.section3.p2', {
              strong: (chunks) => <strong>{chunks}</strong>
            })}
          </p>
          
          <h3>{t('article.section3.h3_2')}</h3>
          <p>
            {t.rich('article.section3.p3', {
              strong: (chunks) => <strong>{chunks}</strong>
            })}
          </p>
          
          <h3>{t('article.section3.h3_3')}</h3>
          <p>
            {t.rich('article.section3.p4', {
              strong: (chunks) => <strong>{chunks}</strong>
            })}
          </p>
          
          <h3>{t('article.section3.h3_4')}</h3>
          <p>
            {t.rich('article.section3.p5', {
              strong: (chunks) => <strong>{chunks}</strong>
            })}
          </p>
          
          <h3>{t('article.section3.h3_5')}</h3>
          <p>
            {t.rich('article.section3.p6', {
              strong: (chunks) => <strong>{chunks}</strong>
            })}
          </p>
          
          <h3>{t('article.section3.h3_6')}</h3>
          <p>
            {t.rich('article.section3.p7', {
              strong: (chunks) => <strong>{chunks}</strong>
            })}
          </p>
          
          <h3>{t('article.section3.h3_7')}</h3>
          <p>{t('article.section3.p8')}</p>
          
          {/* 对比表格 */}
          <ErrorBoundary>
            <Suspense fallback={<LoadingSystem.LoadingSpinner size="lg" />}>
              <ComparisonTableClient />
            </Suspense>
          </ErrorBoundary>
          
          <blockquote className="border-l-4 border-red-500 bg-red-50 p-4 my-6">
            <p className="text-red-800 font-medium">
              {t.rich('article.section3.quote', {
                strong: (chunks) => <strong>{chunks}</strong>
              })}
            </p>
          </blockquote>
        </section>

        <div className="my-16 h-px bg-gray-200"></div>

        {/* 决策树部分 */}
        <section role="region" aria-labelledby="decision-tree-title" className="mb-16">
          <h2 id="decision-tree-title">{t('article.section4.title')}</h2>
          <p>{t('article.section4.p1')}</p>
          
          {/* 决策树工具 */}
          <ErrorBoundary>
            <Suspense fallback={<LoadingSystem.LoadingSpinner size="lg" />}>
              <DecisionTreeClient />
            </Suspense>
          </ErrorBoundary>
        </section>

        <div className="my-16 h-px bg-gray-200"></div>

        {/* 总结部分 */}
        <section role="region" aria-labelledby="summary-title" className="mb-16">
          <h2 id="summary-title">{t('article.section5.title')}</h2>
          <p>{t('article.section5.p1')}</p>
          <p>{t('article.section5.p2')}</p>
          <p>{t('article.section5.p3')}</p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              {t('article.section5.callout.title')}
            </h3>
            <p className="text-blue-700">
              {t('article.section5.callout.text')}
            </p>
          </div>
        </section>

        {/* 医疗免责声明 */}
        <section role="complementary" aria-labelledby="disclaimer-title" className="mt-16 pt-8 border-t border-gray-200">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 id="disclaimer-title" className="text-lg font-semibold text-yellow-800 mb-3">
              {t('disclaimer.title')}
            </h3>
            <p className="text-yellow-700 text-sm">
              {t('disclaimer.text')}
            </p>
          </div>
        </section>
        
        </article>
      </main>
    </ResponsiveContainer>
  );
}
