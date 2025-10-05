// 强制标题设置脚本
(function() {
  'use strict';

  const CHINESE_TITLE = '工作影响计算器 - 症状评估与职场分析完整解决方案 | 专业经期疼痛测试工具与个性化建议系统，科学评估痛经严重程度及工作影响，提供精准医疗建议和生活方式指导 | PeriodHub';
  const ENGLISH_TITLE = 'Work Impact Calculator - Comprehensive Symptom Assessment & Workplace Analysis Solution | Professional Dysmenorrhea Evaluation Tool with Personalized Medical Recommendations, Scientific Severity Analysis and Lifestyle Guidance | PeriodHub';

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
