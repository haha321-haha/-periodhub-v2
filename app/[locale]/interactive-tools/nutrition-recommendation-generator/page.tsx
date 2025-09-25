/**
 * 营养推荐生成器 - 主页面组件
 * 基于ziV1d3d项目集成方案
 */

import { Metadata } from 'next';
import NutritionGenerator from './components/NutritionGenerator';

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
      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NutritionGenerator />
      </div>

      {/* 页面底部 */}
      <div className="bg-white border-t mt-16">
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
