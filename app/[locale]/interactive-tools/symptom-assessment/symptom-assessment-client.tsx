'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Breadcrumb from '@/components/Breadcrumb';

// 动态导入组件 - 代码分割优化
const SymptomAssessmentTool = dynamic(() => import('../components/SymptomAssessmentTool'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});

const RelatedArticleCard = dynamic(() => import('../components/RelatedArticleCard'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
});

const RelatedToolCard = dynamic(() => import('../components/RelatedToolCard'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
});

const ScenarioSolutionCard = dynamic(() => import('../components/ScenarioSolutionCard'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
});

interface Props {
  params: { locale: string };
}

// 症状评估工具专用推荐数据配置
const getSymptomAssessmentRecommendations = (locale: string) => {
  const isZh = locale === 'zh';
  
  // 推荐文章推荐
  const relatedArticles = [
    {
      id: 'comprehensive-medical-guide',
      title: isZh ? '痛经医学指南大全' : 'Comprehensive Medical Guide to Dysmenorrhea',
      description: isZh 
        ? '专业医学角度的痛经诊断、治疗和预防指南'
        : 'Professional medical guide to dysmenorrhea diagnosis, treatment and prevention',
      href: `/${locale}/articles/comprehensive-medical-guide-to-dysmenorrhea`,
      category: isZh ? '医学指南' : 'medical-guide',
      readTime: isZh ? '15分钟阅读' : '15 min read',
      priority: 'high',
      icon: '🏥',
      iconColor: 'red',
      anchorTextType: 'medical_guide'
    },
    {
      id: 'natural-relief-methods',
      title: isZh ? '痛经自然缓解方法大全' : 'Natural Period Pain Relief Methods',
      description: isZh
        ? '安全有效的自然缓解方法，无副作用'
        : 'Safe and effective natural relief methods without side effects',
      href: `/${locale}/articles/home-natural-menstrual-pain-relief`,
      category: isZh ? '自然疗法' : 'natural-remedies',
      readTime: isZh ? '12分钟阅读' : '12 min read',
      priority: 'high',
      icon: '🌿',
      iconColor: 'green',
      anchorTextType: 'natural'
    },
    {
      id: 'menstrual-pain-faq',
      title: isZh ? '痛经常见问题专家解答' : 'Menstrual Pain FAQ Expert Answers',
      description: isZh
        ? '专业医生解答痛经常见问题'
        : 'Professional doctor answers to common menstrual pain questions',
      href: `/${locale}/articles/menstrual-pain-faq-expert-answers`,
      category: isZh ? '专家解答' : 'expert-answers',
      readTime: isZh ? '10分钟阅读' : '10 min read',
      priority: 'medium',
      icon: '❓',
      iconColor: 'blue',
      anchorTextType: 'comprehensive'
    }
  ];

  // 相关工具推荐
  const relatedTools = [
    {
      id: 'pain-tracker',
      title: isZh ? '痛经追踪器' : 'Pain Tracker',
      description: isZh
        ? '记录疼痛模式，分析症状变化趋势'
        : 'Track pain patterns and analyze symptom trends',
      href: `/${locale}/interactive-tools/pain-tracker`,
      category: isZh ? '疼痛追踪' : 'pain-tracking',
      difficulty: isZh ? '简单' : 'Easy',
      estimatedTime: isZh ? '每日2-3分钟' : '2-3 min daily',
      priority: 'high',
      icon: '📊',
      iconColor: 'red',
      anchorTextType: 'tracker'
    },
    {
      id: 'constitution-test',
      title: isZh ? '中医体质测试' : 'TCM Constitution Test',
      description: isZh
        ? '了解体质类型，获得个性化调理建议'
        : 'Understand constitution type and get personalized conditioning advice',
      href: `/${locale}/interactive-tools/constitution-test`,
      category: isZh ? '体质评估' : 'constitution-assessment',
      difficulty: isZh ? '简单' : 'Easy',
      estimatedTime: isZh ? '5-8分钟' : '5-8 min',
      priority: 'high',
      icon: '🌿',
      iconColor: 'green',
      anchorTextType: 'constitution'
    },
    {
      id: 'period-pain-impact-calculator',
      title: isZh ? '痛经影响计算器' : 'Period Pain Impact Calculator',
      description: isZh
        ? '评估痛经对工作和生活的影响程度'
        : 'Assess the impact of period pain on work and life',
      href: `/${locale}/interactive-tools/period-pain-impact-calculator`,
      category: isZh ? '影响评估' : 'impact-assessment',
      difficulty: isZh ? '中等' : 'Medium',
      estimatedTime: isZh ? '3-5分钟' : '3-5 min',
      priority: 'medium',
      icon: '📈',
      iconColor: 'orange',
      anchorTextType: 'assessment'
    }
  ];

  // 场景解决方案推荐
  const scenarioSolutions = [
    {
      id: 'emergency-kit',
      title: isZh ? '痛经应急包指南' : 'Emergency Kit Guide',
      description: isZh
        ? '疼痛发作时的快速缓解方法和应急处理'
        : 'Quick relief methods and emergency treatment when pain occurs',
      href: `/${locale}/scenario-solutions/emergency-kit`,
      icon: '🚨',
      priority: 'high',
      iconColor: 'red',
      anchorTextType: 'relief'
    },
    {
      id: 'office',
      title: isZh ? '办公环境健康管理' : 'Office Environment Health Management',
      description: isZh
        ? '办公环境下的经期健康管理策略'
        : 'Menstrual health management strategies in office environment',
      href: `/${locale}/scenario-solutions/office`,
      icon: '💼',
      priority: 'medium',
      iconColor: 'blue',
      anchorTextType: 'office'
    },
    {
      id: 'teen-health',
      title: isZh ? '青少年健康专区' : 'Teen Health Zone',
      description: isZh
        ? '专为12-18岁青少年设计的经期健康教育'
        : 'Menstrual health education designed for teenagers aged 12-18',
      href: `/${locale}/teen-health`,
      icon: '👧',
      priority: 'medium',
      iconColor: 'pink',
      anchorTextType: 'teen.main'
    }
  ];

  return { relatedArticles, relatedTools, scenarioSolutions };
};

export default function SymptomAssessmentClient({ params: { locale } }: Props) {
  const t = useTranslations('interactiveTools');
  const breadcrumbT = useTranslations('interactiveTools.breadcrumb');
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'simplified';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 text-neutral-800 font-sans">
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
          <Breadcrumb 
            items={[
              { label: breadcrumbT('interactiveTools'), href: `/${locale}/interactive-tools` },
              { label: breadcrumbT('symptomAssessment') }
            ]}
          />

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

      {/* 相关推荐区域 */}
      <div className="bg-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-12">

            {/* 推荐文章区域 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {locale === 'zh' ? '相关健康文章' : 'Related Health Articles'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getSymptomAssessmentRecommendations(locale).relatedArticles.map((article) => (
                  <RelatedArticleCard
                    key={article.id}
                    article={article}
                    locale={locale}
                  />
                ))}
              </div>
            </section>

            {/* 相关工具区域 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {locale === 'zh' ? '相关工具' : 'Related Tools'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getSymptomAssessmentRecommendations(locale).relatedTools.map((tool) => (
                  <RelatedToolCard
                    key={tool.id}
                    tool={tool}
                    locale={locale}
                  />
                ))}
              </div>
            </section>

            {/* 场景解决方案区域 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {locale === 'zh' ? '场景解决方案' : 'Scenario Solutions'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getSymptomAssessmentRecommendations(locale).scenarioSolutions.map((solution) => (
                  <ScenarioSolutionCard
                    key={solution.id}
                    solution={solution}
                    locale={locale}
                  />
                ))}
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}