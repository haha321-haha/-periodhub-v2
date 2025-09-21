import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { Suspense, useEffect } from 'react';
import { ResponsiveContainer } from '../../interactive-tools/shared/components/ResponsiveContainer';
import { LoadingSystem } from '../../interactive-tools/shared/components/LoadingSystem';
import { ErrorBoundary } from '../../interactive-tools/shared/components/ErrorBoundary';
import { preloadComponents, MedicalCareGuidePerformanceMonitor } from './utils/performanceOptimizer';

// 懒加载组件 - 基于souW1e2的优化策略
import dynamic from 'next/dynamic';

const PainAssessmentTool = dynamic(() => import('./components/PainAssessmentTool'), {
  loading: () => <LoadingSystem type="component" />,
  ssr: false
});

const SymptomChecklist = dynamic(() => import('./components/SymptomChecklist'), {
  loading: () => <LoadingSystem type="component" />,
  ssr: false
});

const DecisionTree = dynamic(() => import('./components/DecisionTree'), {
  loading: () => <LoadingSystem type="component" />,
  ssr: false
});

const ComparisonTable = dynamic(() => import('./components/ComparisonTable'), {
  loading: () => <LoadingSystem type="component" />,
  ssr: false
});

// SEO元数据生成 - 基于技术日志的成功经验
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isZh = params.locale === 'zh';
  
  // 结构化数据 - 基于souW1e2的Schema设计
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    'name': isZh ? '痛经就医指南' : 'Period Pain Medical Guide',
    'description': isZh ? '专业的痛经就医指导，包含疼痛评估工具和决策支持' : 'Professional period pain medical guidance with assessment tools and decision support',
    'medicalAudience': {
      '@type': 'MedicalAudience',
      'audienceType': 'Patient'
    },
    'about': {
      '@type': 'MedicalCondition',
      'name': 'Dysmenorrhea',
      'alternateName': isZh ? '痛经' : 'Period Pain',
      'associatedAnatomy': {
        '@type': 'AnatomicalStructure',
        'name': isZh ? '子宫' : 'Uterus'
      }
    },
    'mainEntity': {
      '@type': 'MedicalSignOrSymptom',
      'name': isZh ? '痛经症状评估' : 'Menstrual Pain Assessment',
      'possibleTreatment': {
        '@type': 'MedicalTherapy',
        'name': isZh ? '痛经治疗指导' : 'Dysmenorrhea Treatment Guidance'
      }
    },
    'author': {
      '@type': 'Organization',
      'name': 'PeriodHub Health',
      'url': 'https://www.periodhub.health'
    },
    'datePublished': '2025-09-20',
    'dateModified': '2025-09-20',
    'inLanguage': params.locale,
    'isAccessibleForFree': true,
    'hasPart': [
      {
        '@type': 'WebPageElement',
        'name': isZh ? '疼痛评估工具' : 'Pain Assessment Tool'
      },
      {
        '@type': 'WebPageElement', 
        'name': isZh ? '症状检查清单' : 'Symptom Checklist'
      },
      {
        '@type': 'WebPageElement',
        'name': isZh ? '就医决策树' : 'Medical Decision Tree'
      }
    ]
  };

  return {
    title: isZh 
      ? '痛经别再忍！医生详述7大妇科危险信号，教你何时就医 | PeriodHub'
      : 'Period Pain or Health Alert? A Doctor\'s Guide to 7 Red Flags | PeriodHub',
    description: isZh
      ? '你的痛经正常吗？本文教你进行症状自查，识别7个必须就医的危险信号。包含互动疼痛评估工具、症状检查清单、智能决策树，科学管理你的健康。'
      : 'Is your period pain normal? Learn to self-check symptoms, identify 7 critical red flags requiring medical attention. Interactive pain assessment, symptom checker, decision tree, and professional medical guidance.',
    keywords: isZh
      ? '痛经, 何时就医, 妇科疾病, 症状自查, 医疗指南, 月经疼痛, 健康评估, 疼痛等级, 危险信号'
      : 'period pain, when to see doctor, gynecological conditions, symptom checker, medical guide, menstrual pain, health assessment, pain scale, warning signs',
    openGraph: {
      title: isZh ? '痛经就医指南 - 识别7个危险信号' : 'Period Pain Medical Guide - 7 Warning Signs',
      description: isZh ? '专业的痛经评估和就医指导工具' : 'Professional period pain assessment and medical guidance tools',
      type: 'article',
      locale: params.locale,
      alternateLocale: params.locale === 'zh' ? 'en' : 'zh',
      images: [
        {
          url: '/images/medical-care-guide-og.jpg',
          width: 1200,
          height: 630,
          alt: isZh ? '痛经就医指南' : 'Period Pain Medical Guide'
        }
      ]
    },
    alternates: {
      canonical: `https://www.periodhub.health/${params.locale}/articles/when-to-seek-medical-care-comprehensive-guide`,
      languages: {
        'en': 'https://www.periodhub.health/en/articles/when-to-seek-medical-care-comprehensive-guide',
        'zh': 'https://www.periodhub.health/zh/articles/when-to-seek-medical-care-comprehensive-guide'
      }
    },
    other: {
      'structured-data': JSON.stringify(structuredData)
    }
  };
}

export default function WhenToSeekMedicalCarePage({ params }: { params: { locale: string } }) {
  const t = useTranslations('medicalCareGuide');

  return (
    <ResponsiveContainer className="py-12 md:py-20">
      <article className="prose prose-lg lg:prose-xl max-w-none prose-h1:font-bold prose-h1:text-gray-900 prose-h2:font-semibold prose-h2:text-gray-800 prose-p:text-gray-700 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:text-blue-800 prose-a:text-blue-600 hover:prose-a:text-blue-700">
        
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
        <header className="mb-12 border-b pb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-center">
            {t('header.title')}
          </h1>
          <p className="mt-4 text-xl text-gray-600 text-center max-w-3xl mx-auto">
            {t('header.subtitle')}
          </p>
        </header>

        {/* 导言部分 */}
        <section className="mb-16">
          <h2>{t('article.section1.title')}</h2>
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
        <section className="mb-16">
          <h2>{t('article.section2.title')}</h2>
          <p>{t('article.section2.p1')}</p>
          <p>{t('article.section2.p2')}</p>
          <ul className="list-disc pl-5 space-y-2">
            <li dangerouslySetInnerHTML={{ __html: t('article.section2.li1') }} />
            <li dangerouslySetInnerHTML={{ __html: t('article.section2.li2') }} />
          </ul>
          <p>{t('article.section2.p3')}</p>
          
          {/* 疼痛评估工具 */}
          <ErrorBoundary>
            <Suspense fallback={<LoadingSystem type="component" />}>
              <PainAssessmentTool />
            </Suspense>
          </ErrorBoundary>
        </section>
        
        <div className="my-16 h-px bg-gray-200"></div>

        {/* 危险信号部分 */}
        <section className="mb-16">
          <h2>{t('article.section3.title')}</h2>
          <p>{t('article.section3.p1')}</p>
          
          {/* 症状检查清单 */}
          <ErrorBoundary>
            <Suspense fallback={<LoadingSystem type="component" />}>
              <SymptomChecklist />
            </Suspense>
          </ErrorBoundary>
          
          <h3>{t('article.section3.h3_1')}</h3>
          <p dangerouslySetInnerHTML={{ __html: t('article.section3.p2') }} />
          
          <h3>{t('article.section3.h3_2')}</h3>
          <p dangerouslySetInnerHTML={{ __html: t('article.section3.p3') }} />
          
          <h3>{t('article.section3.h3_3')}</h3>
          <p dangerouslySetInnerHTML={{ __html: t('article.section3.p4') }} />
          
          <h3>{t('article.section3.h3_4')}</h3>
          <p dangerouslySetInnerHTML={{ __html: t('article.section3.p5') }} />
          
          <h3>{t('article.section3.h3_5')}</h3>
          <p dangerouslySetInnerHTML={{ __html: t('article.section3.p6') }} />
          
          <h3>{t('article.section3.h3_6')}</h3>
          <p dangerouslySetInnerHTML={{ __html: t('article.section3.p7') }} />
          
          <h3>{t('article.section3.h3_7')}</h3>
          <p>{t('article.section3.p8')}</p>
          
          {/* 对比表格 */}
          <ErrorBoundary>
            <Suspense fallback={<LoadingSystem type="component" />}>
              <ComparisonTable />
            </Suspense>
          </ErrorBoundary>
          
          <blockquote className="border-l-4 border-red-500 bg-red-50 p-4 my-6">
            <p className="text-red-800 font-medium" dangerouslySetInnerHTML={{ __html: t('article.section3.quote') }} />
          </blockquote>
        </section>

        <div className="my-16 h-px bg-gray-200"></div>

        {/* 决策树部分 */}
        <section className="mb-16">
          <h2>{t('article.section4.title')}</h2>
          <p>{t('article.section4.p1')}</p>
          
          {/* 决策树工具 */}
          <ErrorBoundary>
            <Suspense fallback={<LoadingSystem type="component" />}>
              <DecisionTree />
            </Suspense>
          </ErrorBoundary>
        </section>

        <div className="my-16 h-px bg-gray-200"></div>

        {/* 总结部分 */}
        <section className="mb-16">
          <h2>{t('article.section5.title')}</h2>
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
        <section className="mt-16 pt-8 border-t border-gray-200">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">
              {t('disclaimer.title')}
            </h3>
            <p className="text-yellow-700 text-sm">
              {t('disclaimer.text')}
            </p>
          </div>
        </section>
        
      </article>
    </ResponsiveContainer>
  );
}