import Link from 'next/link';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import OptimizedImage from '@/components/ui/OptimizedImage';
import BreathingExercise from '@/components/BreathingExercise';
// import Breadcrumb from '@/components/Breadcrumb';
import { BarChart3, Calendar, ClipboardCheck, Lightbulb, Search, User, Apple } from 'lucide-react'; // Icons for cards
import { Locale, locales } from '@/i18n';
import StructuredData from '@/components/StructuredData';
import { URL_CONFIG } from '@/lib/url-config';

// Generate metadata for the page
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'interactiveToolsPage' });
  
  return {
    title: t('title'),
    description: t('description'),
    keywords: locale === 'zh' 
      ? '经期健康管理,症状评估,疼痛追踪,痛经管理,健康工具,个性化建议,数据分析'
      : 'menstrual health management,symptom assessment,pain tracking,period pain management,health tools,personalized recommendations,data analytics',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"}/${locale}/interactive-tools`,
      languages: {
        'zh-CN': `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"}/zh/interactive-tools`,
        'en-US': `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"}/en/interactive-tools`,
        'x-default': `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"}/zh/interactive-tools`,
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

export default async function InteractiveToolsPage({
  params
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params;
  // Enable static rendering
  unstable_setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'interactiveToolsPage' });
  const commonT = await getTranslations({ locale, namespace: 'common' });

  // 职场健康专栏工具
  const workplaceTools = [
    {
      title: locale === 'zh' ? '职场健康日历' : 'Workplace Wellness Calendar',
      description: locale === 'zh' 
        ? '专业的职场健康管理工具，帮助您追踪经期对工作的影响，提供个性化的工作调整建议和健康管理方案。'
        : 'Professional workplace wellness management tool to track menstrual impact on work and provide personalized work adjustment recommendations.',
      href: `/${locale}/interactive-tools/workplace-wellness`,
      iconType: 'BarChart3',
      iconColor: 'text-blue-600',
      cta: locale === 'zh' ? '开始健康管理' : 'Start Wellness Management',
      isPrimary: true,
    },
    {
      title: locale === 'zh' ? '工作影响计算器' : 'Work Impact Calculator',
      description: locale === 'zh' 
        ? '专业的痛经影响评估工具，分析症状对工作和生活的影响程度，提供个性化的管理建议和职场适应策略。'
        : 'Professional period pain impact assessment tool that analyzes how symptoms affect work and daily life, providing personalized management recommendations and workplace adaptation strategies.',
      href: `/${locale}/interactive-tools/period-pain-impact-calculator`,
      iconType: 'Search',
      iconColor: 'text-purple-600',
      cta: locale === 'zh' ? '开始评估' : 'Start Assessment',
      isPrimary: false,
    }
  ];

  // 常规工具
  const regularTools = [
    {
      title: t('periodPainAssessment.title'),
      description: t('periodPainAssessment.description'),
      href: `/${locale}/interactive-tools/period-pain-assessment`,
      iconType: 'Search',
      iconColor: 'text-pink-600',
      cta: t('periodPainAssessment.cta'),
    },
    {
      title: t('symptomAssessment.title'),
      description: t('symptomAssessment.description'),
      href: `/${locale}/interactive-tools/symptom-assessment`,
      iconType: 'ClipboardCheck',
      iconColor: 'text-primary-600',
      cta: t('symptomAssessment.startButton'),
    },
    {
      title: t('painTracker.title'),
      description: t('painTracker.description'),
      href: `/${locale}/interactive-tools/pain-tracker`,
      iconType: 'BarChart3',
      iconColor: 'text-secondary-600',
      cta: t('painTracker.startButton'),
    },
    {
      title: t('cycleTracker.title'),
      description: t('cycleTracker.description'),
      href: `/${locale}/interactive-tools/cycle-tracker`,
      iconType: 'Calendar',
      iconColor: 'text-purple-600',
      cta: t('cycleTracker.cta'),
    },
    {
      title: t('constitutionTest.title'),
      description: t('constitutionTest.description'),
      href: `/${locale}/interactive-tools/constitution-test`,
      iconType: 'User',
      iconColor: 'text-green-600',
      cta: t('constitutionTest.cta'),
    },
    {
      title: locale === 'zh' ? '营养推荐生成器' : 'Nutrition Recommendation Generator',
      description: locale === 'zh' 
        ? '基于您的月经周期、健康目标和中医体质，提供科学的个性化营养建议。使用前请先完成周期追踪和体质测试。'
        : 'Get personalized nutrition recommendations based on your menstrual cycle, health goals, and TCM constitution. Complete cycle tracking and constitution test first.',
      href: `/${locale}/interactive-tools/nutrition-recommendation-generator`,
      iconType: 'Apple',
      iconColor: 'text-orange-600',
      cta: locale === 'zh' ? '开始营养分析' : 'Start Nutrition Analysis',
      requiresPrerequisites: true,
    }
  ];

  // Helper function to render icons
  const renderIcon = (iconType: string, iconColor: string) => {
    const iconProps = { className: `w-8 h-8 ${iconColor}` };
    switch (iconType) {
      case 'ClipboardCheck':
        return <ClipboardCheck {...iconProps} />;
      case 'Search':
        return <Search {...iconProps} />;
      case 'Calendar':
        return <Calendar {...iconProps} />;
      case 'BarChart3':
        return <BarChart3 {...iconProps} />;
      case 'User':
        return <User {...iconProps} />;
      case 'Lightbulb':
        return <Lightbulb {...iconProps} />;
      case 'Apple':
        return <Apple {...iconProps} />;
      default:
        return <ClipboardCheck {...iconProps} />;
    }
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";
  const pageUrl = `${baseUrl}/${locale}/interactive-tools`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* SEO结构化数据 */}
      <StructuredData
        type="healthTopicPage"
        title={locale === 'zh' ? t('title') : 'Interactive Health Tools - Period Hub'}
        description={locale === 'zh' ? t('description') : 'Interactive health assessment tools for menstrual health management'}
        url={pageUrl}
      />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8 sm:space-y-12 mobile-safe-area">
          {/* Breadcrumb Navigation - Temporarily disabled */}
          {/* <Breadcrumb 
            items={[
              { 
                label: locale === 'zh' ? '互动工具' : 'Interactive Tools'
              }
            ]} 
          /> */}
          
          {/* Page Header - 移动端优化 */}
          <header className="text-center px-4 sm:px-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-700 mb-3 sm:mb-4 leading-tight">
              {t('title')}
            </h1>
            <p className="text-base sm:text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              {t('description')}
            </p>
          </header>

          {/* Tools Introduction Section - 移动端优化 */}
          <section className="bg-gradient-to-br from-primary-50 to-neutral-50 p-4 sm:p-6 md:p-8 rounded-xl mx-4 sm:mx-0">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
                <div>
                  <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                    {t('toolsIntroduction')}
                  </p>
                </div>
                <div className="flex justify-center order-first md:order-last">
                  <OptimizedImage
                    src="/images/tools/assessment-illustration.jpg"
                    alt="Woman using digital health assessment tool on tablet in comfortable home setting"
                    width={400}
                    height={300}
                    className="w-full max-w-sm sm:max-w-md rounded-lg shadow-lg"
                    sizes="(max-width: 640px) 320px, (max-width: 768px) 400px, (max-width: 1024px) 480px, 600px"
                    priority={true}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    quality={95}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 职场健康专栏 - 显眼位置 */}
          <section className="container-custom mb-8">
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 sm:p-8 border-2 border-blue-200 shadow-lg">
              {/* 专栏标题 */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
                  <span className="text-2xl sm:text-3xl text-white">💼</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-3">
                  {locale === 'zh' ? '职场健康管理专栏' : 'Workplace Wellness Column'}
                </h2>
                <p className="text-base sm:text-lg text-blue-700 max-w-3xl mx-auto leading-relaxed">
                  {locale === 'zh' 
                    ? '为职场女性量身定制的经期健康管理解决方案，帮助您在工作环境中更好地管理经期健康'
                    : 'Tailored menstrual health management solutions for working women to better manage period health in the workplace'
                  }
                </p>
              </div>

              {/* 职场工具网格 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
                {workplaceTools.map((tool) => (
                  <div key={tool.title} className={`card flex flex-col items-center text-center h-full p-6 sm:p-8 ${tool.isPrimary ? 'bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-blue-300 shadow-lg' : 'bg-white border-2 border-purple-200 shadow-md'}`}>
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full mb-6 ${tool.isPrimary ? 'bg-blue-200' : 'bg-purple-100'}`}>
                      {renderIcon(tool.iconType, tool.iconColor)}
                    </div>
                    
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 leading-tight">
                      {tool.title}
                    </h3>
                    
                    <p className="text-sm sm:text-base text-gray-600 mb-6 flex-grow leading-relaxed">
                      {tool.description}
                    </p>
                    
                    <Link href={tool.href} className={`w-full mobile-touch-target text-sm sm:text-base px-6 py-4 text-center font-semibold rounded-lg transition-all duration-300 ${tool.isPrimary ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg' : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:shadow-lg'}`}>
                      {tool.cta}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 常规工具区域 */}
          <section className="container-custom">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                {locale === 'zh' ? '其他健康工具' : 'Other Health Tools'}
              </h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                {locale === 'zh' 
                  ? '更多专业的经期健康管理工具，帮助您全面了解和管理经期健康'
                  : 'More professional menstrual health management tools to help you comprehensively understand and manage period health'
                }
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
              {regularTools.map((tool) => (
                <div key={tool.title} className={`card flex flex-col items-center text-center h-full p-4 sm:p-6 ${tool.requiresPrerequisites ? 'relative border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50' : ''}`}>
                  {/* 前置条件提示 */}
                  {tool.requiresPrerequisites && (
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      {locale === 'zh' ? '需要前置条件' : 'Prerequisites'}
                    </div>
                  )}
                  
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full mb-4 sm:mb-6 ${tool.requiresPrerequisites ? 'bg-orange-100' : 'bg-neutral-100'}`}>
                    {renderIcon(tool.iconType, tool.iconColor)}
                  </div>
                  
                  <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-neutral-800 mb-2 sm:mb-3 leading-tight">
                    {tool.title}
                  </h2>
                  
                  <p className="text-sm sm:text-base text-neutral-600 mb-4 sm:mb-6 flex-grow leading-relaxed">
                    {tool.description}
                  </p>
                  
                  {/* 前置条件说明 */}
                  {tool.requiresPrerequisites && (
                    <div className="mb-4 p-3 bg-orange-100 rounded-lg border border-orange-200">
                      <p className="text-xs text-orange-700 font-medium mb-1">
                        {locale === 'zh' ? '使用前请先完成：' : 'Complete first:'}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">
                          {locale === 'zh' ? '周期追踪' : 'Cycle Tracker'}
                        </span>
                        <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">
                          {locale === 'zh' ? '体质测试' : 'Constitution Test'}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {tool.href === "#" ? (
                    <span className="btn-disabled w-full mobile-touch-target text-sm sm:text-base px-4 py-3">{tool.cta}</span>
                  ) : (
                    <Link href={tool.href} className={`w-full mobile-touch-target text-sm sm:text-base px-4 py-3 text-center ${tool.requiresPrerequisites ? 'btn-secondary' : 'btn-primary'}`}>
                      {tool.cta}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Breathing Exercise Section - 移动端优化 */}
          <section id="breathing-exercise" className="container-custom">
            <div className="space-y-4 sm:space-y-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6 lg:p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full mb-4 sm:mb-6">
                  <span className="text-2xl sm:text-3xl">🫁</span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-700 mb-3 sm:mb-4 leading-tight">
                  {t('breathingExercise.title')}
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
                  {t('breathingExercise.description')}
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <BreathingExercise locale={locale} />
              </div>

              <div className="bg-blue-50 rounded-lg p-6 max-w-4xl mx-auto">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  {t('breathingExercise.usageTips.title')}
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
                  <div>
                    <h4 className="font-medium mb-2">
                      {t('breathingExercise.usageTips.bestTiming.title')}
                    </h4>
                    <ul className="space-y-1">
                      {t.raw('breathingExercise.usageTips.bestTiming.items').map((item: string, index: number) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">
                      {t('breathingExercise.usageTips.precautions.title')}
                    </h4>
                    <ul className="space-y-1">
                      {t.raw('breathingExercise.usageTips.precautions.items').map((item: string, index: number) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Call to action / Note */}
          <section className="text-center py-8">
            <p className="text-neutral-700">
              {t('developmentNote')}
            </p>
          </section>

          {/* Medical Disclaimer */}
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 my-8 rounded-r-lg" role="alert">
            <p className="font-bold">{commonT('importantNote')}</p>
            <p className="text-sm">
              {commonT('medicalDisclaimer')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
