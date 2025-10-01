import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import StructuredData from '@/components/StructuredData';
import { Locale, locales } from '@/i18n';
import RelatedToolCard from '@/app/[locale]/interactive-tools/components/RelatedToolCard';
import RelatedArticleCard from '@/app/[locale]/interactive-tools/components/RelatedArticleCard';
import ScenarioSolutionCard from '@/app/[locale]/interactive-tools/components/ScenarioSolutionCard';
import { URL_CONFIG } from '@/lib/url-config';

// 推荐数据配置函数（健康指南主题）
function getHealthGuideRecommendations(locale: string) {
  const isZh = locale === 'zh';
  
  return {
    relatedTools: [
      {
        id: 'symptom-assessment',
        title: isZh ? '症状评估工具' : 'Symptom Assessment',
        description: isZh 
          ? '专业症状评估系统，科学分析痛经类型和严重程度，获得个性化健康建议' 
          : 'Professional symptom assessment system, scientifically analyze pain type and severity, get personalized health advice',
        href: `/${locale}/interactive-tools/symptom-assessment`,
        icon: '🔍',
        priority: 'high',
        iconColor: 'red',
        anchorTextType: 'symptom_assessment'
      },
      {
        id: 'pain-tracker',
        title: isZh ? '痛经追踪器' : 'Pain Tracker',
        description: isZh 
          ? '智能疼痛追踪系统，记录症状模式，生成健康报告，辅助医生诊断' 
          : 'Smart pain tracking system, record symptom patterns, generate health reports, assist doctor diagnosis',
        href: `/${locale}/interactive-tools/pain-tracker`,
        icon: '📊',
        priority: 'high',
        iconColor: 'blue',
        anchorTextType: 'pain_tracker'
      },
      {
        id: 'period-pain-impact-calculator',
        title: isZh ? '痛经影响计算器' : 'Pain Impact Calculator',
        description: isZh 
          ? '评估痛经对生活质量的影响，量化健康损失，制定科学管理方案' 
          : 'Assess period pain impact on quality of life, quantify health loss, create scientific management plans',
        href: `/${locale}/interactive-tools/period-pain-impact-calculator`,
        icon: '🧮',
        priority: 'high',
        iconColor: 'purple',
        anchorTextType: 'calculator'
      }
    ],
    relatedArticles: [
      {
        id: 'comprehensive-medical-guide-to-dysmenorrhea',
        title: isZh ? '痛经医疗综合指南' : 'Medical Guide to Dysmenorrhea',
        description: isZh 
          ? '全面的痛经医疗知识，从病因到治疗的完整医学指南' 
          : 'Comprehensive dysmenorrhea medical knowledge, complete medical guide from causes to treatment',
        href: `/${locale}/articles/comprehensive-medical-guide-to-dysmenorrhea`,
        readTime: isZh ? '18分钟阅读' : '18 min read',
        category: isZh ? '医疗指南' : 'Medical Guide',
        priority: 'high',
        icon: '📋',
        anchorTextType: 'medical_guide'
      },
      {
        id: 'when-to-seek-medical-care-comprehensive-guide',
        title: isZh ? '何时就医完整指南' : 'When to Seek Medical Care',
        description: isZh 
          ? '识别需要就医的警示信号，掌握就医时机和健康管理策略' 
          : 'Identify warning signs requiring medical care, master medical timing and health management strategies',
        href: `/${locale}/articles/when-to-seek-medical-care-comprehensive-guide`,
        readTime: isZh ? '15分钟阅读' : '15 min read',
        category: isZh ? '医疗指导' : 'Medical Care',
        priority: 'high',
        icon: '🏥',
        anchorTextType: 'medical'
      },
      {
        id: 'menstrual-pain-faq-expert-answers',
        title: isZh ? '痛经常见问题解答' : 'Period Pain FAQ',
        description: isZh 
          ? '专家解答痛经常见疑问，科学破解健康误区和疑虑' 
          : 'Expert answers to common period pain questions, scientifically debunk health myths and concerns',
        href: `/${locale}/articles/menstrual-pain-faq-expert-answers`,
        readTime: isZh ? '12分钟阅读' : '12 min read',
        category: isZh ? '专家问答' : 'FAQ',
        priority: 'medium',
        icon: '❓',
        anchorTextType: 'faq'
      }
    ],
    healthTopics: [
      {
        id: 'natural-therapies',
        title: isZh ? '自然疗法大全' : 'Natural Therapies Guide',
        description: isZh 
          ? '探索8种科学验证的自然疗法，无副作用的健康缓解方案' 
          : 'Explore 8 scientifically validated natural therapies, side-effect-free health relief solutions',
        href: `/${locale}/natural-therapies`,
        icon: '🌿',
        priority: 'high',
        anchorTextType: 'natural_therapies'
      },
      {
        id: 'scenario-solutions',
        title: isZh ? '场景解决方案' : 'Scenario Solutions',
        description: isZh 
          ? '针对通勤、办公、运动等不同场景的个性化健康管理策略' 
          : 'Personalized health management strategies for commute, office, exercise and other scenarios',
        href: `/${locale}/scenario-solutions`,
        icon: '🎯',
        priority: 'high',
        anchorTextType: 'scenarios'
      },
      {
        id: 'teen-health',
        title: isZh ? '青少年健康专区' : 'Teen Health Zone',
        description: isZh 
          ? '专为12-18岁青少年设计的经期健康教育和管理指南' 
          : 'Period health education and management guide designed for teens aged 12-18',
        href: `/${locale}/teen-health`,
        icon: '🌸',
        priority: 'medium',
        anchorTextType: 'teen_main'
      }
    ]
  };
}

// Generate metadata for the page
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'healthGuidePage' });

  return {
    title: t('title'),
    description: t('description'),
        keywords: t('keywords'),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"}/${locale}/health-guide`,
      languages: {
        'zh-CN': `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"}/zh/health-guide`,
        'en-US': `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"}/en/health-guide`,
        'x-default': `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"}/zh/health-guide`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale: locale,
    },
  };
}

// Generate static params for all supported locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function HealthGuidePage({
  params
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params;
  // Enable static rendering
  unstable_setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'healthGuidePage' });
  const commonT = await getTranslations({ locale, namespace: 'common' });
  
  // 获取推荐数据（健康指南主题）
  const recommendations = getHealthGuideRecommendations(locale);
  const isZh = locale === 'zh';

  const guideChapters = [
    {
      id: 'understanding-pain',
      title: t('sections.understandingPain.title'),
      description: t('sections.understandingPain.description'),
      href: `/${locale}/health-guide/understanding-pain`,
      icon: '🧠',
      cta: t('sections.understandingPain.cta')
    },
    {
      id: 'relief-methods-az',
      title: t('sections.reliefMethods.title'),
      description: t('sections.reliefMethods.description'),
      href: `/${locale}/health-guide/relief-methods`,
      icon: '📚',
      cta: t('sections.reliefMethods.cta')
    },
    {
      id: 'lifestyle-management',
      title: t('sections.lifestyleManagement.title'),
      description: t('sections.lifestyleManagement.description'),
      href: `/${locale}/health-guide/lifestyle`,
      icon: '🌱',
      cta: t('sections.lifestyleManagement.cta')
    },
    {
      id: 'when-seek-help',
      title: t('sections.whenSeekHelp.title'),
      description: t('sections.whenSeekHelp.description'),
      href: `/${locale}/health-guide/medical-care`,
      icon: '🏥',
      cta: t('sections.whenSeekHelp.cta')
    },
    {
      id: 'myths-facts',
      title: t('sections.mythsFacts.title'),
      description: t('sections.mythsFacts.description'),
      href: `/${locale}/health-guide/myths-facts`,
      icon: '💡',
      cta: t('sections.mythsFacts.cta')
    },
    {
      id: 'global-perspectives',
      title: t('sections.globalPerspective.title'),
      description: t('sections.globalPerspective.description'),
      href: `/${locale}/health-guide/global-perspectives`,
      icon: '🌍',
      cta: t('sections.globalPerspective.cta')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* SEO结构化数据 */}
      <StructuredData
        type="healthTopicPage"
        title={t('title')}
        description={t('description')}
        url={`${process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"}/${locale}/health-guide`}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-12">
          {/* Breadcrumb */}
          <nav className="text-sm text-neutral-600">
            <Link href={`/${locale}`} className="hover:text-primary-600">
              {locale === 'zh' ? '首页' : 'Home'}
            </Link>
            <span className="mx-2">›</span>
            <span className="text-neutral-800">
              {locale === 'zh' ? '痛经健康指南' : 'Health Guide'}
            </span>
          </nav>

          {/* Page Header */}
          <header className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
              {t('hero.title')}
            </h1>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              {t('hero.description')}
            </p>
          </header>

      {/* Introduction Section */}
      <section className="bg-gradient-to-br from-primary-50 to-neutral-50 p-6 md:p-8 rounded-xl">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
            {t('whyGuide.title')}
          </h2>
          <p className="text-neutral-700 leading-relaxed mb-4">
            {t('whyGuide.description')}
          </p>
          <p className="text-neutral-700 leading-relaxed mb-6">
            {t('hero.description')}
          </p>
          
          {/* 快速访问相关工具 */}
          <div className="bg-white rounded-lg p-4 border border-primary-200">
            <h3 className="text-lg font-semibold text-neutral-800 mb-3">
              {t('tools.title')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link href={`/${locale}/interactive-tools/symptom-assessment`} className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-blue-700 group-hover:text-blue-800">
                    {t('tools.painAssessment.title')}
                  </div>
                  <div className="text-xs text-blue-600">
                    {t('tools.painAssessment.description')}
                  </div>
                </div>
              </Link>
              
              <Link href={`/${locale}/interactive-tools/pain-tracker`} className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-green-700 group-hover:text-green-800">
                    {t('tools.painTracker.title')}
                  </div>
                  <div className="text-xs text-green-600">
                    {t('tools.painTracker.description')}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Medical Principles Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-8 rounded-xl">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-neutral-800 mb-6 text-center">
            {t('medicalPrinciples.title')}
          </h2>
          <p className="text-neutral-700 text-center mb-8 max-w-4xl mx-auto">
            {t('medicalPrinciples.description')}
          </p>

          {/* Anatomy Overview */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <picture>
                  <source media="(min-width: 768px)" srcSet="/images/medical/female_reproductive_system_anatomy_800x800.webp" type="image/webp" />
                  <source media="(min-width: 768px)" srcSet="/images/medical/female_reproductive_system_anatomy_800x800.png" type="image/png" />
                  <source media="(max-width: 767px)" srcSet="/images/medical/female_reproductive_system_anatomy_400x400.webp" type="image/webp" />
                  <source media="(max-width: 767px)" srcSet="/images/medical/female_reproductive_system_anatomy_400x400.png" type="image/png" />
                  <img 
                    src="/images/medical/female_reproductive_system_anatomy_800x800.png" 
                    alt={t('medicalPrinciples.anatomy.imageAlt')}
                    className="w-full h-auto rounded-lg shadow-md"
                    loading="lazy"
                  />
                </picture>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-4 text-indigo-700">
                  {t('medicalPrinciples.anatomy.title')}
                </h3>
                
                <div className="space-y-3">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <h4 className="font-semibold text-red-700 mb-1">
                      {t('medicalPrinciples.anatomy.uterus.title')}
                    </h4>
                    <p className="text-sm text-red-600">
                      {t('medicalPrinciples.anatomy.uterus.description')}
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <h4 className="font-semibold text-purple-700 mb-1">
                      {t('medicalPrinciples.anatomy.endometrium.title')}
                    </h4>
                    <p className="text-sm text-purple-600">
                      {t('medicalPrinciples.anatomy.endometrium.description')}
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-semibold text-blue-700 mb-1">
                      {t('medicalPrinciples.anatomy.ovaries.title')}
                    </h4>
                    <p className="text-sm text-blue-600">
                      {t('medicalPrinciples.anatomy.ovaries.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pathophysiology */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Prostaglandin Mechanism */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 text-red-700">
                {t('medicalPrinciples.prostaglandinMechanism.title')}
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <span className="bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">1</span>
                  <div>
                    <strong>{t('medicalPrinciples.prostaglandinMechanism.molecularEffects.enzymeActivation.title')}</strong>
                    {t('medicalPrinciples.prostaglandinMechanism.molecularEffects.enzymeActivation.description')}
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">2</span>
                  <div>
                    <strong>{t('medicalPrinciples.prostaglandinMechanism.molecularEffects.synthesisPathway.title')}</strong>
                    {t('medicalPrinciples.prostaglandinMechanism.molecularEffects.synthesisPathway.description')}
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">3</span>
                  <div>
                    <strong>{t('medicalPrinciples.prostaglandinMechanism.molecularEffects.mainProducts.title')}</strong>
                    {t('medicalPrinciples.prostaglandinMechanism.molecularEffects.mainProducts.description')}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 space-y-3">
                <div className="p-3 bg-red-50 rounded">
                  <p className="text-xs text-red-600">
                    <strong>{t('medicalPrinciples.prostaglandinMechanism.physiologicalEffects.title')}</strong>
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <strong className="text-red-700 text-xs">{t('medicalPrinciples.prostaglandinMechanism.physiologicalEffects.uterineContraction.title')}</strong>
                    <p className="text-xs text-red-600 mt-1">
                      {t('medicalPrinciples.prostaglandinMechanism.physiologicalEffects.uterineContraction.description')}
                    </p>
                  </div>
                  
                  <div className="bg-orange-50 border border-orange-200 rounded p-3">
                    <strong className="text-orange-700 text-xs">{t('medicalPrinciples.prostaglandinMechanism.physiologicalEffects.vasoconstriction.title')}</strong>
                    <p className="text-xs text-orange-600 mt-1">
                      {t('medicalPrinciples.prostaglandinMechanism.physiologicalEffects.vasoconstriction.description')}
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                    <strong className="text-yellow-700 text-xs">{t('medicalPrinciples.prostaglandinMechanism.physiologicalEffects.neuralSensitization.title')}</strong>
                    <p className="text-xs text-yellow-600 mt-1">
                      {t('medicalPrinciples.prostaglandinMechanism.physiologicalEffects.neuralSensitization.description')}
                    </p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded p-3">
                    <strong className="text-green-700 text-xs">{t('medicalPrinciples.prostaglandinMechanism.physiologicalEffects.inflammatoryResponse.title')}</strong>
                    <p className="text-xs text-green-600 mt-1">
                      {t('medicalPrinciples.prostaglandinMechanism.physiologicalEffects.inflammatoryResponse.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hormonal Control */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 text-purple-700">
                {t('medicalPrinciples.hormonalControl.title')}
              </h3>
              
              <div className="space-y-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <h4 className="font-semibold text-purple-700 mb-2 text-sm">
                    {t('medicalPrinciples.hormonalControl.estrogen.title')}
                  </h4>
                  <ul className="text-xs space-y-1 text-purple-600">
                    <li>• {t('medicalPrinciples.hormonalControl.estrogen.promotesThickening')}</li>
                    <li>• {t('medicalPrinciples.hormonalControl.estrogen.increasesSensitivity')}</li>
                    <li>• {t('medicalPrinciples.hormonalControl.estrogen.peaksBeforeOvulation')}</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-semibold text-blue-700 mb-2 text-sm">
                    {t('medicalPrinciples.hormonalControl.progesterone.title')}
                  </h4>
                  <ul className="text-xs space-y-1 text-blue-600">
                    <li>• {t('medicalPrinciples.hormonalControl.progesterone.inhibitsContraction')}</li>
                    <li>• {t('medicalPrinciples.hormonalControl.progesterone.stabilizesEndometrium')}</li>
                    <li>• {t('medicalPrinciples.hormonalControl.progesterone.declinesBeforeMenstruation')}</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-semibold text-green-700 mb-2 text-sm">
                    {t('medicalPrinciples.hormonalControl.feedbackRegulation.title')}
                  </h4>
                  <ul className="text-xs space-y-1 text-green-600">
                    <li>• {t('medicalPrinciples.hormonalControl.feedbackRegulation.hypothalamicPituitaryOvarian')}</li>
                    <li>• {t('medicalPrinciples.hormonalControl.feedbackRegulation.gnrhPulsatileSecretion')}</li>
                    <li>• {t('medicalPrinciples.hormonalControl.feedbackRegulation.fshLhCyclicalChanges')}</li>
                    <li>• {t('medicalPrinciples.hormonalControl.feedbackRegulation.negativeFeedbackMechanism')}</li>
                  </ul>
                  <div className="mt-2 p-2 bg-green-100 rounded">
                    <p className="text-xs text-green-600">
                      <strong>{t('medicalPrinciples.hormonalControl.feedbackRegulation.balancePoint')}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Neural Pathways */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-6 text-center text-blue-700">
              {t('medicalPrinciples.neuralConduction.title')}
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4 text-blue-700">
                  {t('medicalPrinciples.neuralConduction.painPathway.title')}
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-blue-50 rounded border">
                    <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                    <div>
                      <strong className="text-blue-700">{t('medicalPrinciples.neuralConduction.painPathway.receptors.title')}</strong>
                      <span className="text-sm text-blue-600 ml-1">
                        {t('medicalPrinciples.neuralConduction.painPathway.receptors.description')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 rounded border">
                    <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                    <div>
                      <strong className="text-blue-700">{t('medicalPrinciples.neuralConduction.painPathway.afferentNerves.title')}</strong>
                      <span className="text-sm text-blue-600 ml-1">
                        {t('medicalPrinciples.neuralConduction.painPathway.afferentNerves.description')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 rounded border">
                    <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                    <div>
                      <strong className="text-blue-700">{t('medicalPrinciples.neuralConduction.painPathway.spinalProcessing.title')}</strong>
                      <span className="text-sm text-blue-600 ml-1">
                        {t('medicalPrinciples.neuralConduction.painPathway.spinalProcessing.description')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 rounded border">
                    <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                    <div>
                      <strong className="text-blue-700">{t('medicalPrinciples.neuralConduction.painPathway.centralPerception.title')}</strong>
                      <span className="text-sm text-blue-600 ml-1">
                        {t('medicalPrinciples.neuralConduction.painPathway.centralPerception.description')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4 text-blue-700">
                  {t('medicalPrinciples.neuralConduction.painControl.title')}
                </h4>
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded p-4">
                    <h5 className="font-semibold text-green-700 mb-2 text-sm">
                      {t('medicalPrinciples.neuralConduction.painControl.gateControlTheory.title')}
                    </h5>
                    <p className="text-xs text-green-600">
                      {t('medicalPrinciples.neuralConduction.painControl.gateControlTheory.description')}
                    </p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                    <h5 className="font-semibold text-yellow-700 mb-2 text-sm">
                      {t('medicalPrinciples.neuralConduction.painControl.endogenousAnalgesia.title')}
                    </h5>
                    <p className="text-xs text-yellow-600">
                      {t('medicalPrinciples.neuralConduction.painControl.endogenousAnalgesia.description')}
                    </p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded p-4">
                    <h5 className="font-semibold text-purple-700 mb-2 text-sm">
                      {t('medicalPrinciples.neuralConduction.painControl.descendingControl.title')}
                    </h5>
                    <p className="text-xs text-purple-600">
                      {t('medicalPrinciples.neuralConduction.painControl.descendingControl.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Treatment Mechanisms */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-6 text-center text-indigo-700">
              {t('medicalPrinciples.treatmentMechanisms.title')}
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* NSAIDs */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-center mb-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1h-6l-1-1z"></path>
                    </svg>
                  </div>
                  <h4 className="font-bold text-red-700 text-sm">NSAIDs</h4>
                </div>
                
                <div className="text-xs space-y-1">
                  <p><strong>{t('medicalPrinciples.treatmentMechanisms.nsaids.mechanism')}</strong> {t('medicalPrinciples.treatmentMechanisms.nsaids.mechanismDescription')}</p>
                  <p><strong>{t('medicalPrinciples.treatmentMechanisms.nsaids.effect')}</strong> {t('medicalPrinciples.treatmentMechanisms.nsaids.effectDescription')}</p>
                  <p><strong>{t('medicalPrinciples.treatmentMechanisms.nsaids.representativeDrugs')}</strong> {t('medicalPrinciples.treatmentMechanisms.nsaids.representativeDrugsDescription')}</p>
                  <p><strong>{t('medicalPrinciples.treatmentMechanisms.nsaids.bestTiming')}</strong> {t('medicalPrinciples.treatmentMechanisms.nsaids.bestTimingDescription')}</p>
                  <p><strong>{t('medicalPrinciples.treatmentMechanisms.nsaids.efficacy')}</strong> {t('medicalPrinciples.treatmentMechanisms.nsaids.efficacyDescription')}</p>
                </div>
              </div>

              {/* Heat Therapy */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="text-center mb-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                    </svg>
                  </div>
                  <h4 className="font-bold text-orange-700 text-sm">
                    {t('medicalPrinciples.treatmentMechanisms.heatTherapy.title')}
                  </h4>
                </div>
                
                <div className="text-xs space-y-1">
                  <p><strong>{t('medicalPrinciples.treatmentMechanisms.heatTherapy.mechanism')}</strong> {t('medicalPrinciples.treatmentMechanisms.heatTherapy.mechanismDescription')}</p>
                  <p><strong>{t('medicalPrinciples.treatmentMechanisms.heatTherapy.effect')}</strong> {t('medicalPrinciples.treatmentMechanisms.heatTherapy.effectDescription')}</p>
                  <p><strong>{t('medicalPrinciples.treatmentMechanisms.heatTherapy.temperature')}</strong> {t('medicalPrinciples.treatmentMechanisms.heatTherapy.temperatureDescription')}</p>
                  <p><strong>{t('medicalPrinciples.treatmentMechanisms.heatTherapy.duration')}</strong> {t('medicalPrinciples.treatmentMechanisms.heatTherapy.durationDescription')}</p>
                  <p><strong>{t('medicalPrinciples.treatmentMechanisms.heatTherapy.synergy')}</strong> {t('medicalPrinciples.treatmentMechanisms.heatTherapy.synergyDescription')}</p>
                </div>
              </div>

              {/* Hormonal Therapy */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="text-center mb-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h4 className="font-bold text-purple-700 text-sm">
                    {t('medicalPrinciples.treatmentMechanisms.hormonalTherapy.title')}
                  </h4>
                </div>
                
                <div className="text-xs space-y-1">
                  <p><strong>{t('medicalPrinciples.treatmentMechanisms.hormonalTherapy.mechanism')}</strong> {t('medicalPrinciples.treatmentMechanisms.hormonalTherapy.mechanismDescription')}</p>
                  <p><strong>{t('medicalPrinciples.treatmentMechanisms.hormonalTherapy.effect')}</strong> {t('medicalPrinciples.treatmentMechanisms.hormonalTherapy.effectDescription')}</p>
                  <p><strong>{t('medicalPrinciples.treatmentMechanisms.hormonalTherapy.type')}</strong> {t('medicalPrinciples.treatmentMechanisms.hormonalTherapy.typeDescription')}</p>
                  <p><strong>{t('medicalPrinciples.treatmentMechanisms.hormonalTherapy.applicable')}</strong> {t('medicalPrinciples.treatmentMechanisms.hormonalTherapy.applicableDescription')}</p>
                  <p><strong>{t('medicalPrinciples.treatmentMechanisms.hormonalTherapy.efficacy')}</strong> {t('medicalPrinciples.treatmentMechanisms.hormonalTherapy.efficacyDescription')}</p>
                </div>
              </div>

              {/* Exercise Therapy */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-center mb-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                    </svg>
                  </div>
                  <h4 className="font-bold text-green-700 text-sm">
                    {t('medicalPrinciples.treatmentMechanisms.exerciseTherapy.title')}
                  </h4>
                </div>
                
                <div className="text-xs space-y-1">
                  <p><strong>{t('medicalPrinciples.treatmentMechanisms.exerciseTherapy.mechanism')}</strong> {t('medicalPrinciples.treatmentMechanisms.exerciseTherapy.mechanismDescription')}</p>
                  <p><strong>{t('medicalPrinciples.treatmentMechanisms.exerciseTherapy.effect')}</strong> {t('medicalPrinciples.treatmentMechanisms.exerciseTherapy.effectDescription')}</p>
                  <p><strong>{t('medicalPrinciples.treatmentMechanisms.exerciseTherapy.type')}</strong> {t('medicalPrinciples.treatmentMechanisms.exerciseTherapy.typeDescription')}</p>
                  <p><strong>{t('medicalPrinciples.treatmentMechanisms.exerciseTherapy.intensity')}</strong> {t('medicalPrinciples.treatmentMechanisms.exerciseTherapy.intensityDescription')}</p>
                  <p><strong>{t('medicalPrinciples.treatmentMechanisms.exerciseTherapy.longTerm')}</strong> {t('medicalPrinciples.treatmentMechanisms.exerciseTherapy.longTermDescription')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Research Progress */}
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h3 className="text-xl font-bold mb-6 text-center text-indigo-700">
              {t('medicalPrinciples.researchProgress.title')}
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-blue-700">
                  {t('medicalPrinciples.researchProgress.molecularTargets.title')}
                </h4>
                <p className="text-sm text-gray-700 mb-2">
                  {t('medicalPrinciples.researchProgress.molecularTargets.description')}
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-green-700">
                  {t('medicalPrinciples.researchProgress.aiApplications.title')}
                </h4>
                <p className="text-sm text-gray-700 mb-2">
                  {t('medicalPrinciples.researchProgress.aiApplications.description')}
                </p>
              </div>
            </div>
            
            {/* Gene Therapy Research */}
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-4 text-center text-purple-700">
                {t('medicalPrinciples.geneTherapy.title')}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 text-purple-700">
                    {t('medicalPrinciples.geneTherapy.genePolymorphism.title')}
                  </h4>
                  <p className="text-sm text-gray-700">
                    {t('medicalPrinciples.geneTherapy.genePolymorphism.description')}
                  </p>
                </div>
                
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 text-indigo-700">
                    {t('medicalPrinciples.geneTherapy.epigeneticMechanisms.title')}
                  </h4>
                  <p className="text-sm text-gray-700">
                    {t('medicalPrinciples.geneTherapy.epigeneticMechanisms.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Evidence */}
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h3 className="text-xl font-bold mb-6 text-center text-blue-700">
              {t('medicalPrinciples.clinicalEvidence.title')}
            </h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="text-lg font-bold mb-4 text-blue-700">
                {t('medicalPrinciples.clinicalEvidence.importantStudies.title')}
              </h4>
              
              <div className="space-y-6">
                <div className="bg-white rounded p-4">
                  <h5 className="font-semibold mb-2 text-gray-800">
                    {t('medicalPrinciples.clinicalEvidence.importantStudies.cochrane2020.title')}
                  </h5>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700">
                      <strong>{t('medicalPrinciples.clinicalEvidence.importantStudies.cochrane2020.studyContent')}</strong>
                      {t('medicalPrinciples.clinicalEvidence.importantStudies.cochrane2020.studyContentDescription')}
                    </p>
                    <p className="text-gray-700">
                      <strong>{t('medicalPrinciples.clinicalEvidence.importantStudies.cochrane2020.sampleSize')}</strong>
                      {t('medicalPrinciples.clinicalEvidence.importantStudies.cochrane2020.sampleSizeDescription')}
                    </p>
                    <p className="text-gray-700">
                      <strong>{t('medicalPrinciples.clinicalEvidence.importantStudies.cochrane2020.conclusion')}</strong>
                      {t('medicalPrinciples.clinicalEvidence.importantStudies.cochrane2020.conclusionDescription')}
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded p-4">
                  <h5 className="font-semibold mb-2 text-gray-800">
                    {t('medicalPrinciples.clinicalEvidence.importantStudies.bmj2019.title')}
                  </h5>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700">
                      <strong>{t('medicalPrinciples.clinicalEvidence.importantStudies.bmj2019.studyContent')}</strong>
                      {t('medicalPrinciples.clinicalEvidence.importantStudies.bmj2019.studyContentDescription')}
                    </p>
                    <p className="text-gray-700">
                      <strong>{t('medicalPrinciples.clinicalEvidence.importantStudies.bmj2019.method')}</strong>
                      {t('medicalPrinciples.clinicalEvidence.importantStudies.bmj2019.methodDescription')}
                    </p>
                    <p className="text-gray-700">
                      <strong>{t('medicalPrinciples.clinicalEvidence.importantStudies.bmj2019.conclusion')}</strong>
                      {t('medicalPrinciples.clinicalEvidence.importantStudies.bmj2019.conclusionDescription')}
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded p-4">
                  <h5 className="font-semibold mb-2 text-gray-800">
                    {t('medicalPrinciples.clinicalEvidence.importantStudies.jcm2021.title')}
                  </h5>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700">
                      <strong>{t('medicalPrinciples.clinicalEvidence.importantStudies.jcm2021.studyContent')}</strong>
                      {t('medicalPrinciples.clinicalEvidence.importantStudies.jcm2021.studyContentDescription')}
                    </p>
                    <p className="text-gray-700">
                      <strong>{t('medicalPrinciples.clinicalEvidence.importantStudies.jcm2021.design')}</strong>
                      {t('medicalPrinciples.clinicalEvidence.importantStudies.jcm2021.designDescription')}
                    </p>
                    <p className="text-gray-700">
                      <strong>{t('medicalPrinciples.clinicalEvidence.importantStudies.jcm2021.conclusion')}</strong>
                      {t('medicalPrinciples.clinicalEvidence.importantStudies.jcm2021.conclusionDescription')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded">
                <p className="text-sm text-yellow-700">
                  <strong>{t('medicalPrinciples.clinicalEvidence.evidenceLevel.title')}</strong>
                  {t('medicalPrinciples.clinicalEvidence.evidenceLevel.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guide Chapters */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-8 text-center">
          {t('sections.title')}
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guideChapters.map((chapter) => (
            <Link 
              key={chapter.id}
              href={chapter.href}
              className="card group hover:shadow-lg transition-all duration-300 block"
            >
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">{chapter.icon}</span>
                <h3 className="text-xl font-semibold text-neutral-800 group-hover:text-primary-600 transition-colors">
                  {chapter.title}
                </h3>
              </div>
              <p className="text-neutral-600 mb-4 leading-relaxed">
                {chapter.description}
              </p>
              <div className="flex items-center text-primary-600 group-hover:text-primary-700 font-medium">
                {chapter.cta}
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="bg-secondary-50 p-6 md:p-8 rounded-xl">
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
          {t('quickAccess.title')}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-semibold text-neutral-800 mb-2">
              {t('quickAccess.emergencyRelief')}
            </h3>
            <p className="text-neutral-600 text-sm mb-3">
              {t('quickAccess.emergencyReliefDescription')}
            </p>
                        <Link
              href={`/${locale}/immediate-relief`}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              {t('quickAccess.methodsTechniques')} →
            </Link>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-semibold text-neutral-800 mb-2">
              {t('quickAccess.personalizedAssessment')}
            </h3>
            <p className="text-neutral-600 text-sm mb-3">
              {t('quickAccess.personalizedAssessmentDescription')}
            </p>
            <Link 
              href={`/${locale}/interactive-tools`}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              {t('quickAccess.startAssessment')} →
            </Link>
          </div>
        </div>
      </section>

          {/* Medical Disclaimer */}
          <section className="bg-primary-50 border-l-4 border-primary-500 p-4 rounded-r-lg">
            <p className="text-neutral-700">
              <strong className="text-primary-700">
                {t('quickAccess.medicalDisclaimer')}
              </strong>
              {t('quickAccess.medicalDisclaimerText')}
            </p>
          </section>

          {/* Related Recommendations - 健康指南主题 */}
          <section className="py-8 sm:py-12">
            <div className="space-y-8 sm:space-y-12">
              {/* 专业评估工具 */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center">
                  <span className="mr-3">🔧</span>
                  {isZh ? '专业评估工具' : 'Professional Assessment Tools'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {recommendations.relatedTools.map((tool) => (
                    <RelatedToolCard
                      key={tool.id}
                      tool={tool}
                      locale={locale}
                    />
                  ))}
                </div>
              </div>

              {/* 深度健康文章 */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center">
                  <span className="mr-3">📚</span>
                  {isZh ? '深度健康文章' : 'In-Depth Health Articles'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {recommendations.relatedArticles.map((article) => (
                    <RelatedArticleCard
                      key={article.id}
                      article={article}
                      locale={locale}
                    />
                  ))}
                </div>
              </div>

              {/* 健康管理专题 */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center">
                  <span className="mr-3">🎯</span>
                  {isZh ? '健康管理专题' : 'Health Management Topics'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {recommendations.healthTopics.map((topic) => (
                    <ScenarioSolutionCard
                      key={topic.id}
                      solution={topic}
                      locale={locale}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
