
// 清理可能导致页面卡死的缓存数据
if (typeof window !== 'undefined') {
  try {
    // 清理localStorage中的问题数据
    const keysToRemove = [
      'partner-handbook-store',
      'stageProgress',
      'quiz-answers',
      'web-vitals-cache'
    ];

    keysToRemove.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log('已清理:', key);
      }
    });

    // 清理sessionStorage
    sessionStorage.clear();

    console.log('✅ 浏览器缓存已清理');
  } catch (error) {
    console.error('清理缓存时出错:', error);
  }
}
