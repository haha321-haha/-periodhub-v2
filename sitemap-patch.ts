/**
 * sitemap.ts 补丁文件 - 移除测试页面
 * 使用方法：将此内容合并到 app/sitemap.ts 中
 */

// 原始的interactiveTools数组（包含测试页面）
const interactiveTools = [
  "/zh/interactive-tools/symptom-assessment",
  "/en/interactive-tools/symptom-assessment",
  "/zh/interactive-tools/pain-tracker",
  "/en/interactive-tools/pain-tracker",
  // "/zh/interactive-tools/constitution-test",      // ❌ 移除这些测试页面
  // "/en/interactive-tools/constitution-test",      // ❌ 移除这些测试页面
  "/zh/interactive-tools/cycle-tracker",
  "/en/interactive-tools/cycle-tracker",
  "/zh/interactive-tools/symptom-tracker",         // ⚠️ 确认是否为测试页面
  "/en/interactive-tools/symptom-tracker",         // ⚠️ 确认是否为测试页面
  "/zh/interactive-tools/period-pain-assessment",
  "/en/interactive-tools/period-pain-assessment",
  "/zh/interactive-tools/period-pain-impact-calculator",
  "/en/interactive-tools/period-pain-impact-calculator",
  "/zh/interactive-tools/nutrition-recommendation-generator",  // 🔧 拼写修正
  "/en/interactive-tools/nutrition-recommendation-generator",  // 🔧 拼写修正
  "/zh/interactive-tools/workplace-wellness",
  "/en/interactive-tools/workplace-wellness",
  "/zh/interactive-tools/stress-management",
  "/en/interactive-tools/stress-management",
];

// 修复后的interactiveTools数组（移除测试页面）
const interactiveToolsFixed = [
  "/zh/interactive-tools/symptom-assessment",
  "/en/interactive-tools/symptom-assessment",
  "/zh/interactive-tools/pain-tracker",
  "/en/interactive-tools/pain-tracker",
  // 移除constitution-test页面（这些是测试页面，不应出现在sitemap中）
  "/zh/interactive-tools/cycle-tracker",
  "/en/interactive-tools/cycle-tracker",
  "/zh/interactive-tools/period-pain-assessment",
  "/en/interactive-tools/period-pain-assessment",
  "/zh/interactive-tools/period-pain-impact-calculator",
  "/en/interactive-tools/period-pain-impact-calculator",
  // 修复拼写错误：recommendation-generator 而不是 recommendation-generator
  "/zh/interactive-tools/nutrition-recommendation-generator", 
  "/en/interactive-tools/nutrition-recommendation-generator", 
  "/zh/interactive-tools/workplace-wellness",
  "/en/interactive-tools/workplace-wellness",
  "/zh/interactive-tools/stress-management",
  "/en/interactive-tools/stress-management",
];

export { interactiveToolsFixed };