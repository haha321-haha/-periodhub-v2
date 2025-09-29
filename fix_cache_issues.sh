#!/bin/bash

echo "🚀 开始执行完整缓存清理..."

# 1. 停止所有Next.js进程
echo "📴 停止所有Next.js进程..."
pkill -f "next dev" || true
pkill -f "next start" || true
pkill -f "node.*next" || true

# 2. 删除所有缓存目录
echo "🧹 清理Next.js缓存..."
rm -rf .next
rm -rf .swc
rm -rf .turbo
rm -rf .vercel
rm -rf node_modules/.cache
rm -rf .next-cache

# 3. 查找并移除所有i18n相关文件
echo "🔍 查找i18n相关文件..."
find . -name "*i18n*" -type f -not -path "./node_modules/*" | while read file; do
    echo "发现文件: $file"
done

# 4. 检查是否还有翻译相关的引用
echo "🔍 检查翻译系统引用..."
grep -r "Translations loaded successfully" . --exclude-dir=node_modules || echo "✅ 未发现翻译加载日志"
grep -r "useTranslations" . --exclude-dir=node_modules || echo "✅ 未发现useTranslations引用"
grep -r "next-intl" . --exclude-dir=node_modules || echo "✅ 未发现next-intl引用"

# 5. 重新安装依赖
echo "📦 重新安装依赖..."
rm -rf node_modules
npm install

# 6. 创建强制标题设置脚本
echo "🔧 创建强制标题设置..."
cat > public/force-title.js << 'EOF'
// 强制标题设置脚本
(function() {
  'use strict';
  
  const CHINESE_TITLE = '痛经影响算法 - 症状评估与职场分析 | PeriodHub';
  const ENGLISH_TITLE = 'Period Pain Impact Calculator - Symptom Assessment & Workplace Analysis | PeriodHub';
  
  function forceSetTitle() {
    const isChinesePage = window.location.pathname.includes('/zh/');
    const correctTitle = isChinesePage ? CHINESE_TITLE : ENGLISH_TITLE;
    
    if (document.title !== correctTitle) {
      console.log('🛠️ 强制修复标题:', correctTitle);
      document.title = correctTitle;
      
      const titleEl = document.querySelector('head > title');
      if (titleEl) {
        titleEl.textContent = correctTitle;
      }
    }
  }
  
  // 立即执行
  forceSetTitle();
  
  // 定期检查
  setInterval(forceSetTitle, 1000);
  
  // 页面完全加载后执行
  if (document.readyState === 'complete') {
    forceSetTitle();
  } else {
    window.addEventListener('load', forceSetTitle);
  }
  
  console.log('🛡️ 标题保护脚本已激活');
})();
EOF

# 7. 重新构建
echo "🔨 重新构建项目..."
npm run build

echo "✅ 缓存清理完成！现在请执行以下步骤："
echo "1. 运行: npm run dev"
echo "2. 在浏览器中按 Ctrl+Shift+R 强制刷新"
echo "3. 如果问题仍存在，请在无痕模式下测试"






