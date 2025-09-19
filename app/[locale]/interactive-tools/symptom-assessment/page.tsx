import { getTranslations } from 'next-intl/server';
import SymptomAssessmentClient from './symptom-assessment-client';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'interactiveTools' });
  
  return {
    title: t('meta.title', { 
      default: locale === 'zh' 
        ? '痛经严重度计算器 - PeriodHub | 经期疼痛智能评估工具'
        : 'Period Pain Calculator - PeriodHub | Menstrual Pain Assessment Tool'
    }),
    description: t('meta.description', { 
      default: locale === 'zh'
        ? '免费痛经严重度计算器：3分钟科学评估经期疼痛程度，获得个性化缓解建议。包含疼痛机制解析、补镁指导、热敷方案等专业医疗建议。'
        : 'Free Period Pain Calculator: 3-minute scientific assessment of menstrual pain severity with personalized relief recommendations. Includes pain mechanism analysis, magnesium guidance, and heat therapy protocols.'
    }),
    keywords: locale === 'zh' ? [
      '痛经计算器', '痛经严重度评估', '经期疼痛测试', '痛经疼痛原理', '痛经补镁', '经期疼痛缓解', '月经疼痛评估工具'
    ] : [
      'period pain calculator', 'menstrual pain assessment', 'dysmenorrhea severity test', 'period pain mechanisms', 'magnesium for cramps', 'menstrual pain relief', 'period pain evaluation tool'
    ],
    
    openGraph: {
      title: t('meta.ogTitle', { 
        default: locale === 'zh' ? '症状评估工具 - PeriodHub' : 'Symptom Assessment Tool - PeriodHub'
      }),
      description: t('meta.ogDescription', { 
        default: locale === 'zh' 
          ? '智能经期症状分析工具'
          : 'Smart menstrual symptom analysis tool'
      }),
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      siteName: 'PeriodHub',
      url: `https://www.periodhub.health/${locale}/interactive-tools/symptom-assessment`,
    },
    
    twitter: {
      card: 'summary_large_image',
      title: t('meta.twitterTitle', { 
        default: locale === 'zh' ? '症状评估工具 - PeriodHub' : 'Symptom Assessment Tool - PeriodHub'
      }),
      description: t('meta.twitterDescription', { 
        default: locale === 'zh' 
          ? '专业的经期健康评估工具'
          : 'Professional menstrual health assessment tool'
      }),
    },

    alternates: {
      canonical: `https://www.periodhub.health/${locale}/interactive-tools/symptom-assessment`,
      languages: {
        'zh-CN': 'https://www.periodhub.health/zh/interactive-tools/symptom-assessment',
        'en-US': 'https://www.periodhub.health/en/interactive-tools/symptom-assessment',
        'x-default': 'https://www.periodhub.health/en/interactive-tools/symptom-assessment',
      },
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function SymptomAssessmentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <SymptomAssessmentClient params={{ locale }} />;
}