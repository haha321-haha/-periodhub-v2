#!/bin/bash

# 清理冲突的标题脚本
echo "🧹 开始清理冲突的标题脚本..."

# 1. 移除或重命名冲突的脚本文件
echo "📁 处理冲突的脚本文件..."

# 重命名而不是删除，以便备份
if [ -f "public/force-title.js" ]; then
    mv "public/force-title.js" "public/force-title.js.backup"
    echo "✅ 已备份 public/force-title.js"
fi

if [ -f "emergency-title-fix.js" ]; then
    mv "emergency-title-fix.js" "emergency-title-fix.js.backup"
    echo "✅ 已备份 emergency-title-fix.js"
fi

# 2. 检查并清理HTML中的脚本引用
echo "🔍 检查HTML中的脚本引用..."

# 查找可能引用这些脚本的HTML文件
find . -name "*.html" -o -name "*.tsx" -o -name "*.jsx" | xargs grep -l "force-title.js\|emergency-title-fix.js" 2>/dev/null || echo "未找到相关引用"

# 3. 清理浏览器缓存相关的脚本
echo "🧹 清理缓存相关脚本..."

if [ -f "clear-browser-cache.js" ]; then
    mv "clear-browser-cache.js" "clear-browser-cache.js.backup"
    echo "✅ 已备份 clear-browser-cache.js"
fi

# 4. 创建新的统一标题初始化脚本
echo "📝 创建新的统一标题初始化脚本..."

cat > "public/unified-title-init.js" << 'EOF'
// 统一标题初始化脚本
(function() {
  'use strict';
  
  // 等待页面加载完成
  function initUnifiedTitle() {
    // 检查是否在痛经影响算法页面
    const isPainCalculatorPage = window.location.pathname.includes('/period-pain-impact-calculator');
    
    if (isPainCalculatorPage) {
      const isChinesePage = window.location.pathname.includes('/zh/');
      
      const chineseTitle = '痛经影响算法 - 症状评估与职场分析完整解决方案 | 专业经期疼痛测试工具与个性化建议系统，科学评估痛经严重程度及工作影响，提供精准医疗建议和生活方式指导 | PeriodHub';
      const englishTitle = 'Period Pain Impact Calculator - Comprehensive Symptom Assessment & Workplace Analysis Solution | Professional Dysmenorrhea Evaluation Tool with Personalized Medical Recommendations, Scientific Severity Analysis and Lifestyle Guidance | PeriodHub';
      
      const correctTitle = isChinesePage ? chineseTitle : englishTitle;
      
      // 设置标题
      document.title = correctTitle;
      
      const titleElement = document.querySelector('head > title');
      if (titleElement) {
        titleElement.textContent = correctTitle;
      }
      
      console.log('🎯 [UnifiedTitleInit] 标题已初始化:', correctTitle);
    }
  }
  
  // 立即执行
  initUnifiedTitle();
  
  // 页面加载完成后再次执行
  if (document.readyState === 'complete') {
    initUnifiedTitle();
  } else {
    window.addEventListener('load', initUnifiedTitle);
  }
  
  console.log('🚀 [UnifiedTitleInit] 统一标题初始化脚本已加载');
})();
EOF

echo "✅ 已创建 public/unified-title-init.js"

# 5. 更新package.json脚本（如果存在）
echo "📦 检查package.json..."

if [ -f "package.json" ]; then
    echo "✅ package.json 存在，请手动检查是否有相关脚本需要清理"
else
    echo "ℹ️ 未找到 package.json"
fi

echo ""
echo "🎉 清理完成！"
echo ""
echo "📋 清理总结："
echo "  ✅ 已备份冲突的脚本文件"
echo "  ✅ 已创建新的统一标题初始化脚本"
echo "  ✅ 建议重启开发服务器以应用更改"
echo ""
echo "🔧 下一步操作："
echo "  1. 重启开发服务器: npm run dev 或 yarn dev"
echo "  2. 清除浏览器缓存"
echo "  3. 访问页面检查标题是否正确显示"
echo ""
echo "⚠️  如果问题仍然存在，请检查："
echo "  - 浏览器开发者工具中的控制台错误"
echo "  - 是否有其他脚本仍在运行"
echo "  - Next.js 的模板设置是否正确"
