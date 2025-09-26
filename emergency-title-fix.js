// 紧急修复脚本 - 在浏览器控制台运行
function emergencyTitleFix() {
  console.log('🚨 执行紧急标题修复...');
  
  const chineseTitle = '痛经影响算法 - 症状评估与职场分析完整解决方案 | 专业经期疼痛测试工具与个性化建议系统，科学评估痛经严重程度及工作影响，提供精准医疗建议和生活方式指导 | PeriodHub';
  
  // 1. 强制设置多次
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      document.title = chineseTitle;
      const titleEl = document.querySelector('head > title');
      if (titleEl) {
        titleEl.textContent = chineseTitle;
        titleEl.innerHTML = chineseTitle;
      }
      console.log(`🔄 尝试 ${i + 1}: ${document.title}`);
    }, i * 200);
  }
  
  // 2. 完全清理缓存
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => caches.delete(name));
      console.log('🧹 已清理所有缓存');
    });
  }
  
  // 3. 清理localStorage
  Object.keys(localStorage).forEach(key => {
    if (key.includes('title') || key.includes('meta') || key.includes('cache')) {
      localStorage.removeItem(key);
    }
  });
  
  // 4. 强制页面重载
  setTimeout(() => {
    if (document.title !== chineseTitle) {
      console.log('⚠️ 标题修复失败，建议强制刷新页面');
      console.log('请执行: location.reload(true)');
    } else {
      console.log('✅ 标题修复成功！');
    }
  }, 2000);
}

// 在控制台运行: emergencyTitleFix();
console.log('紧急修复脚本已加载，运行 emergencyTitleFix() 开始修复');
