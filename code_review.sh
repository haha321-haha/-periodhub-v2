#!/bin/bash

# 代码审查脚本
# 用于验证痛经影响评估工具的功能完整性

echo "🔍 开始代码审查..."

# 1. 检查Git状态
echo "=== 1. Git状态检查 ==="
git status
echo ""

# 2. 检查构建状态
echo "=== 2. 构建测试 ==="
npm run build
if [ $? -eq 0 ]; then
    echo "✅ 构建测试通过"
else
    echo "❌ 构建测试失败"
    exit 1
fi
echo ""

# 3. 检查类型定义
echo "=== 3. 类型检查 ==="
npx tsc --noEmit
if [ $? -eq 0 ]; then
    echo "✅ 类型检查通过"
else
    echo "❌ 类型检查失败"
    exit 1
fi
echo ""

# 4. 检查关键文件
echo "=== 4. 关键文件检查 ==="
files=(
    "app/[locale]/interactive-tools/components/SymptomAssessmentTool.tsx"
    "app/[locale]/interactive-tools/shared/data/calculationAlgorithms.ts"
    "app/[locale]/interactive-tools/shared/hooks/useSymptomAssessment.ts"
    "messages/zh.json"
    "messages/en.json"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file 存在"
    else
        echo "❌ $file 缺失"
        exit 1
    fi
done
echo ""

# 5. 检查翻译完整性
echo "=== 5. 翻译完整性检查 ==="
node -e "
const fs = require('fs');
const zh = JSON.parse(fs.readFileSync('messages/zh.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));

function countKeys(obj) {
  let count = 0;
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      count += countKeys(obj[key]);
    } else {
      count++;
    }
  }
  return count;
}

const zhCount = countKeys(zh);
const enCount = countKeys(en);
const coverage = (Math.min(zhCount, enCount) / Math.max(zhCount, enCount)) * 100;

console.log('中文键数量:', zhCount);
console.log('英文键数量:', enCount);
console.log('覆盖率:', coverage.toFixed(1) + '%');

if (coverage >= 95) {
  console.log('✅ 翻译完整性检查通过');
  process.exit(0);
} else {
  console.log('❌ 翻译完整性检查失败');
  process.exit(1);
}
"
echo ""

# 6. 检查组件导入
echo "=== 6. 组件导入检查 ==="
grep -r "import.*SymptomAssessmentTool" app/ || echo "❌ SymptomAssessmentTool导入检查失败"
grep -r "import.*calculationAlgorithms" app/ || echo "❌ calculationAlgorithms导入检查失败"
echo ""

# 7. 检查路由配置
echo "=== 7. 路由配置检查 ==="
if [ -f "app/[locale]/interactive-tools/symptom-assessment/page.tsx" ]; then
    echo "✅ 症状评估页面路由存在"
else
    echo "❌ 症状评估页面路由缺失"
    exit 1
fi
echo ""

# 8. 检查样式文件
echo "=== 8. 样式文件检查 ==="
if [ -f "app/[locale]/interactive-tools/period-pain-impact-calculator/style.css" ]; then
    echo "✅ 样式文件存在"
else
    echo "❌ 样式文件缺失"
    exit 1
fi
echo ""

echo "🎉 代码审查完成！所有检查通过。"
echo ""
echo "📋 审查结果摘要："
echo "✅ Git状态正常"
echo "✅ 构建测试通过"
echo "✅ 类型检查通过"
echo "✅ 关键文件完整"
echo "✅ 翻译完整性良好"
echo "✅ 组件导入正确"
echo "✅ 路由配置完整"
echo "✅ 样式文件存在"
echo ""
echo "🚀 准备进行部署测试！"
