import { Metadata } from 'next';

// 生成页面元数据 - 使用硬编码避免 next-intl 问题
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';

  const title = isZh 
    ? '工作影响计算器 - 痛经症状评估与职场影响分析工具 | PeriodHub'
    : 'Work Impact Calculator - Menstrual Pain Assessment & Workplace Analysis | PeriodHub';

  const description = isZh
    ? '专业痛经评估工具，科学分析经期疼痛严重程度及对工作生活的影响，提供个性化医疗建议。'
    : 'Professional menstrual pain assessment tool that scientifically evaluates pain severity and its impact on work and daily life.';

  return {
    title,
    description,
    keywords: isZh ? [
      '痛经评估', '经期疼痛测试', '痛经严重程度', '月经疼痛评估', '痛经影响分析',
      '经期症状评估', '痛经工作影响', '月经疼痛管理', '痛经缓解建议', '经期健康评估',
      '痛经自测', '月经疼痛程度', '痛经症状分析', '经期影响评估', '痛经专业测试'
    ] : [
      'period pain assessment', 'menstrual pain calculator', 'dysmenorrhea evaluation', 'period pain severity',
      'menstrual pain impact', 'period pain symptoms', 'dysmenorrhea assessment tool', 'menstrual pain management'
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://www.periodhub.health/${locale}/interactive-tools/period-pain-impact-calculator`,
      siteName: 'PeriodHub',
      locale: isZh ? 'zh_CN' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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
    alternates: {
      canonical: `https://www.periodhub.health/${locale}/interactive-tools/period-pain-impact-calculator`,
      languages: {
        'zh': 'https://www.periodhub.health/zh/interactive-tools/period-pain-impact-calculator',
        'en': 'https://www.periodhub.health/en/interactive-tools/period-pain-impact-calculator',
      },
    },
  };
}

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
