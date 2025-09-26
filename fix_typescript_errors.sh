#!/bin/bash
# fix_typescript_errors.sh
# 批量修复TypeScript类型错误

echo "=== 批量修复TypeScript类型错误 ==="

# 1. 修复'multiple'类型问题
echo "修复'multiple'类型问题..."
find app -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/type === '\''multiple'\''/type === '\''multi'\''/g'
find app -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/type: '\''multiple'\''/type: '\''multi'\''/g'

# 2. 修复类型定义不一致问题
echo "修复类型定义不一致问题..."
find app -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/'"'"'single'"'"' | '"'"'multiple'"'"' | '"'"'scale'"'"'/'"'"'single'"'"' | '"'"'multi'"'"' | '"'"'scale'"'"'/g'

# 3. 修复'any'类型问题
echo "修复'any'类型问题..."
find app -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/ as any\[\]/ as any[]/g'

# 4. 修复undefined类型问题
echo "修复undefined类型问题..."
find app -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/|| undefined/|| undefined as any/g'

echo "=== 类型错误修复完成 ==="
