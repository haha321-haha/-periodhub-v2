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
