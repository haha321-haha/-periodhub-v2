import { Locale } from "@/i18n";
import { safeStringify } from "@/lib/utils/json-serialization";

// HowTo步骤接口
export interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

// HowTo工具接口
export interface HowToTool {
  name: string;
  image?: string;
}

// HowTo结构化数据配置接口
export interface HowToConfig {
  locale: Locale;
  scenarioSlug: string;
  name: string;
  description: string;
  steps: HowToStep[];
  tools?: HowToTool[];
  supplies?: string[];
  totalTime: string; // ISO 8601 duration format, e.g. "PT30M" for 30 minutes
  estimatedCost?: {
    currency: string;
    value: string;
  };
  image?: string;
}

// 生成HowTo结构化数据
export async function generateHowToStructuredData(config: HowToConfig) {
  const {
    locale,
    scenarioSlug,
    name,
    description,
    steps,
    tools = [],
    supplies = [],
    totalTime,
    estimatedCost,
    image,
  } = config;
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";
  const isZh = locale === "zh";

  // 生成步骤数据 - 过滤空步骤并清理空白字符
  const validSteps = steps.filter(
    (step) => step.name && step.text && step.name.trim() && step.text.trim(),
  );

  const howToSteps = validSteps.map((step, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    name: step.name.trim(),
    text: step.text.trim(),
    image:
      step.image ||
      `${baseUrl}/images/scenario-solutions/${scenarioSlug}/step-${
        index + 1
      }.webp`,
    url: `${baseUrl}/${locale}/scenario-solutions/${scenarioSlug}#step-${
      index + 1
    }`,
  }));

  // 生成工具数据 - 过滤空工具
  const howToTools = tools
    .filter((tool) => tool.name && tool.name.trim())
    .map((tool) => ({
      "@type": "HowToTool",
      name: tool.name.trim(),
      image:
        tool.image ||
        `${baseUrl}/images/tools/${tool.name
          .toLowerCase()
          .replace(/\s+/g, "-")}.webp`,
    }));

  // 生成用品数据 - 过滤空用品
  const howToSupplies = supplies
    .filter((supply) => supply && supply.trim())
    .map((supply) => ({
      "@type": "HowToSupply",
      name: supply.trim(),
    }));

  // 构建HowTo结构化数据 - 只在有有效步骤时构建
  // 如果所有步骤都被过滤掉，不应该生成无效的结构化数据
  if (howToSteps.length === 0) {
    return null;
  }

  const howToStructuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: name?.trim() || "",
    description: description?.trim() || "",
    image:
      image || `${baseUrl}/images/scenario-solutions/${scenarioSlug}/hero.webp`,
    totalTime,
    estimatedCost: estimatedCost || {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: "0", // 默认免费
    },
    ...(howToSupplies.length > 0 && { supply: howToSupplies }),
    ...(howToTools.length > 0 && { tool: howToTools }),
    step: howToSteps,
    url: `${baseUrl}/${locale}/scenario-solutions/${scenarioSlug}`,
    inLanguage: isZh ? "zh-CN" : "en-US",
  };

  return howToStructuredData;
}

// HowTo结构化数据脚本组件
interface HowToStructuredDataScriptProps {
  data: unknown;
}

export function HowToStructuredDataScript({
  data,
}: HowToStructuredDataScriptProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: safeStringify(data),
      }}
    />
  );
}
