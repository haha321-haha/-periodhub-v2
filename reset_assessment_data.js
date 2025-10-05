// 重置评估历史数据脚本
// 在浏览器控制台中运行此脚本来清除测试数据

console.log('=== 重置评估历史数据 ===');

// 清除localStorage中的评估历史
localStorage.removeItem('assessmentHistory');
console.log('✅ 已清除 assessmentHistory');

// 清除其他可能相关的数据
localStorage.removeItem('assessmentTrends');
localStorage.removeItem('userPreferences');
console.log('✅ 已清除相关数据');

// 验证清除结果
const remaining = Object.keys(localStorage).filter(key =>
  key.includes('assessment') || key.includes('history')
);
console.log('剩余相关数据:', remaining);

console.log('🎉 数据重置完成！刷新页面查看效果');
