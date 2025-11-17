/**
 * Workplace Wellness Assistant - Main Page
 * Day 10: User Experience Optimization - Responsive Design Optimization
 * Based on HVsLYEp renderer.js structure design
 */

import { Metadata } from "next";
import { generatePageSEO, StructuredDataType } from '@/lib/seo/page-seo';
import WorkplaceWellnessClient from './WorkplaceWellnessClient';

// 生成页面元数据（包含Canonical配置）
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const { metadata } = generatePageSEO({
    locale: locale as "en" | "zh",
    path: "/interactive-tools/workplace-wellness",
    title: locale === "zh" 
      ? "职场健康管理 - 经期工作环境优化工具" 
      : "Workplace Wellness - Menstrual Health Management Tool",
    description: locale === "zh"
      ? "专业的职场健康管理工具，帮助女性在工作中更好地管理经期健康，提供个性化的工作环境调整建议和健康管理策略。"
      : "Professional workplace wellness tool helping women better manage menstrual health at work, providing personalized workplace environment adjustments and health management strategies.",
    keywords: locale === "zh"
      ? ["职场健康", "经期管理", "工作环境", "健康管理", "职场女性"]
      : ["workplace wellness", "menstrual management", "work environment", "health management", "working women"],
    structuredDataType: "SoftwareApplication" as StructuredDataType,
    additionalStructuredData: {
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      featureList: [
        locale === "zh" ? "工作环境优化" : "Workplace environment optimization",
        locale === "zh" ? "经期健康跟踪" : "Menstrual health tracking",
        locale === "zh" ? "个性化建议" : "Personalized recommendations",
      ],
    },
  });

  return metadata;
}

// 服务器组件渲染
export default function WorkplaceWellnessPage() {
  return <WorkplaceWellnessClient />;
}