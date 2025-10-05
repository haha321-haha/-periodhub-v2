#!/usr/bin/env node

const fs = require('fs');

console.log('🔧 开始重构翻译文件结构（版本2）...');

try {
  // 读取原始文件
  const zhContent = fs.readFileSync('messages/zh.json', 'utf8');
  const zhData = JSON.parse(zhContent);

  console.log('📖 已读取中文翻译文件');

  // 直接操作JSON对象
  // 将独立的组件移动到 medicalCareGuide 内部
  if (zhData.symptomChecker) {
    zhData.medicalCareGuide.symptomChecker = zhData.symptomChecker;
    delete zhData.symptomChecker;
    console.log('✅ 已移动 symptomChecker 到 medicalCareGuide');
  }

  if (zhData.decisionTree) {
    zhData.medicalCareGuide.decisionTree = zhData.decisionTree;
    delete zhData.decisionTree;
    console.log('✅ 已移动 decisionTree 到 medicalCareGuide');
  }

  if (zhData.comparisonTable) {
    zhData.medicalCareGuide.comparisonTable = zhData.comparisonTable;
    delete zhData.comparisonTable;
    console.log('✅ 已移动 comparisonTable 到 medicalCareGuide');
  }

  // 写入重构后的文件
  const formattedContent = JSON.stringify(zhData, null, 2);
  fs.writeFileSync('messages/zh_restructured.json', formattedContent);

  console.log('✅ 重构后的文件已保存为 messages/zh_restructured.json');

  // 验证重构后的文件
  try {
    JSON.parse(formattedContent);
    console.log('✅ 重构后的JSON格式验证通过');
  } catch (error) {
    console.error('❌ 重构后的JSON格式验证失败:', error.message);
    process.exit(1);
  }

  console.log('🎉 重构完成！');

} catch (error) {
  console.error('❌ 重构过程中出现错误:', error.message);
  process.exit(1);
}
