import { Metadata } from "next";
import { generatePageSEO, StructuredDataType } from '@/lib/seo/page-seo';
import PeriodPainCalculatorClient from './period-pain-calculator-client';

// 生成页面元数据（包含Canonical配置）
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const { metadata } = generatePageSEO({
    locale: locale as "en" | "zh",
    path: "/interactive-tools/period-pain-impact-calculator",
    title: locale === "zh" 
      ? "痛经影响计算器 - 科学评估工作影响" 
      : "Period Pain Impact Calculator - Scientific Workplace Impact Assessment",
    description: locale === "zh"
      ? "专业的痛经影响计算器，量化分析痛经对工作效率和生活质量的影响，提供个性化的健康管理建议和缓解方案。"
      : "Professional period pain impact calculator that quantifies the effects of menstrual pain on work efficiency and quality of life, providing personalized health management advice and relief solutions.",
    keywords: (locale === "zh"
      ? "痛经影响,工作影响计算器,痛经评估,工作效率,健康管理"
      : "period pain impact,workplace impact calculator,menstrual pain assessment,work efficiency,health management").split(','),
    structuredDataType: "SoftwareApplication" as StructuredDataType,
    additionalStructuredData: {
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      featureList: [
        locale === "zh" ? "痛经严重程度评估" : "Menstrual pain severity assessment",
        locale === "zh" ? "工作影响量化分析" : "Work impact quantitative analysis",
        locale === "zh" ? "个性化缓解方案" : "Personalized relief solutions",
      ],
    },
  });

  return metadata;
}

export default async function PeriodPainImpactCalculatorPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;

  return <PeriodPainCalculatorClient params={{ locale }} />;
}
