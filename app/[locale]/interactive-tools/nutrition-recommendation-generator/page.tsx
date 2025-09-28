/**
 * 营养推荐生成器 - 主页面组件
 * 基于ziV1d3d项目集成方案
 */

import { Metadata } from 'next';
import NutritionGenerator from './components/NutritionGenerator';
import Breadcrumb from '@/components/Breadcrumb';

// 生成页面元数据
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  
  // 基于ziV1d3d的硬编码元数据，避免翻译问题
  const isZh = locale === 'zh';
  const title = isZh ? '营养推荐生成器' : 'Nutrition Recommendation Generator';
  const description = isZh 
    ? '基于月经周期、健康目标和中医体质的个性化营养建议生成器，提供科学专业的饮食指导，结合现代营养学与中医理论，为女性提供精准的营养建议和生活方式指导，帮助优化生理期健康管理' 
    : 'Personalized nutrition recommendations for your menstrual cycle, health goals, TCM constitution. Scientific guidance combining modern and traditional medicine.';

  return {
    title,
    description,
    keywords: 'nutrition suggestion generator,menstrual cycle nutrition,TCM constitution diet,personalized nutrition plan,women\'s health nutrition,period nutrition management',
    other: {
      'http-equiv': 'content-language',
      content: isZh ? 'zh-CN' : 'en-US',
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: isZh ? 'zh_CN' : 'en_US',
      siteName: 'Period Hub',
      images: [
        {
          url: '/images/nutrition-generator-og.jpg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/nutrition-generator-twitter.jpg'],
    },
    alternates: {
             canonical: `https://www.periodhub.health/${locale}/interactive-tools/nutrition-recommendation-generator`,
             languages: {
               'zh': 'https://www.periodhub.health/zh/interactive-tools/nutrition-recommendation-generator',
               'en': 'https://www.periodhub.health/en/interactive-tools/nutrition-recommendation-generator',
             },
           },
  };
}

// 主页面组件
export default async function NutritionRecommendationGeneratorPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isZh = locale === 'zh';

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* 面包屑导航 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Breadcrumb 
          items={[
            { label: locale === 'zh' ? '互动工具' : 'Interactive Tools', href: `/${locale}/interactive-tools` },
            { label: locale === 'zh' ? '营养推荐生成器' : 'Nutrition Recommendation Generator' }
          ]}
        />
      </div>
      
      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NutritionGenerator />
      </div>

      {/* 相关工具推荐 */}
      <div className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center border-b-2 border-red-500 pb-2">
            {isZh ? '相关工具' : 'Related Tools'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 智能周期追踪器 */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {isZh ? '智能周期追踪器' : 'Smart Cycle Tracker'}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {isZh 
                      ? '智能追踪月经周期，预测下次月经时间，记录症状变化，帮助您更好地了解身体规律'
                      : 'Intelligently track your menstrual cycle, predict next period, record symptom changes, helping you better understand your body patterns'
                    }
                  </p>
                  <a 
                    href={`/${locale}/interactive-tools/cycle-tracker`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    {isZh ? '开始周期追踪 >' : 'Start Cycle Tracking >'}
                  </a>
                </div>
              </div>
            </div>

            {/* 中医体质测试 */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {isZh ? '中医体质测试' : 'TCM Constitution Test'}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {isZh 
                      ? '通过8个问题了解您的中医体质类型，获得个性化的穴位、饮食和生活方式建议'
                      : 'Understand your TCM constitution type through 8 questions and get personalized acupuncture points, diet and lifestyle recommendations'
                    }
                  </p>
                  <a 
                    href={`/${locale}/interactive-tools/constitution-test`}
                    className="inline-flex items-center text-green-600 hover:text-green-800 font-medium text-sm"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {isZh ? '开始体质测试 >' : 'Start Constitution Test >'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 页面底部 */}
      <div className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p className="text-sm">
              {isZh ? '个性化健康，触手可及。' : 'Personalized wellness at your fingertips.'}
            </p>
            <p className="text-xs mt-2">
              {isZh 
                ? '本工具提供一般性营养指导，不能替代专业医疗建议。'
                : 'This tool provides general nutrition guidance and should not replace professional medical advice.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
