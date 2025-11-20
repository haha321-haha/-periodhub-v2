import type { Metadata } from 'next';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const isZh = locale === 'zh';

  return {
    title: isZh
      ? '职场影响评估 - 专业痛经对工作影响分析工具 | Period Hub'
      : 'Workplace Impact Assessment - Professional Period Pain Work Impact Analysis Tool | Period Hub',
    description: isZh
      ? '专业的职场影响评估工具，分析痛经对工作效率、注意力、沟通能力的影响，提供个性化的职场适应建议和管理策略。'
      : 'Professional workplace impact assessment tool that analyzes how menstrual pain affects work efficiency, concentration, and communication, providing personalized workplace adaptation recommendations.',
    keywords: isZh
      ? '职场影响评估,痛经工作影响,工作效率分析,职场适应策略,女性健康管理'
      : 'workplace impact assessment,period pain work impact,work efficiency analysis,workplace adaptation strategies,women health management',
    openGraph: {
      title: isZh
        ? '职场影响评估 - 专业痛经对工作影响分析工具'
        : 'Workplace Impact Assessment - Professional Period Pain Work Impact Analysis Tool',
      description: isZh
        ? '专业的职场影响评估工具，分析痛经对工作效率、注意力、沟通能力的影响。'
        : 'Professional workplace impact assessment tool that analyzes how menstrual pain affects work efficiency, concentration, and communication.',
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      siteName: 'Period Hub'
    },
    twitter: {
      card: 'summary_large_image',
      title: isZh
        ? '职场影响评估 - 专业痛经对工作影响分析工具'
        : 'Workplace Impact Assessment - Professional Period Pain Work Impact Analysis Tool',
      description: isZh
        ? '专业的职场影响评估工具，分析痛经对工作效率、注意力、沟通能力的影响。'
        : 'Professional workplace impact assessment tool that analyzes how menstrual pain affects work efficiency, concentration, and communication.'
    },
    alternates: {
      canonical: `https://www.periodhub.health/${locale}/interactive-tools/workplace-impact-assessment`,
      languages: {
        'zh': 'https://www.periodhub.health/zh/interactive-tools/workplace-impact-assessment',
        'en': 'https://www.periodhub.health/en/interactive-tools/workplace-impact-assessment'
      }
    }
  };
}

export default function WorkplaceImpactAssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
