#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 开始重构翻译文件结构...');

try {
  // 读取原始文件
  const zhContent = fs.readFileSync('messages/zh.json', 'utf8');
  const zhData = JSON.parse(zhContent);

  console.log('📖 已读取中文翻译文件');

  // 读取提取的组件内容
  const symptomCheckerContent = fs.readFileSync('temp_symptomChecker.json', 'utf8');
  const decisionTreeContent = fs.readFileSync('temp_decisionTree.json', 'utf8');
  const comparisonTableContent = fs.readFileSync('temp_comparisonTable.json', 'utf8');

  console.log('📖 已读取提取的组件内容');

  // 解析提取的内容 - 直接解析为临时JSON对象
  const tempSymptomChecker = JSON.parse(`{${symptomCheckerContent.trim().slice(0, -1)}}`);
  const tempDecisionTree = JSON.parse(`{${decisionTreeContent.trim().slice(0, -1)}}`);
  const tempComparisonTable = JSON.parse(`{${comparisonTableContent.trim().slice(0, -1)}}`);

  const symptomChecker = tempSymptomChecker.symptomChecker;
  const decisionTree = tempDecisionTree.decisionTree;
  const comparisonTable = tempComparisonTable.comparisonTable;

  console.log('✅ 成功解析组件内容');

  // 将组件添加到 medicalCareGuide
  if (!zhData.medicalCareGuide) {
    throw new Error('medicalCareGuide 不存在');
  }

  zhData.medicalCareGuide.symptomChecker = symptomChecker;
  zhData.medicalCareGuide.decisionTree = decisionTree;
  zhData.medicalCareGuide.comparisonTable = comparisonTable;

  console.log('✅ 已将组件添加到 medicalCareGuide');

  // 删除独立的组件定义
  delete zhData.symptomChecker;
  delete zhData.decisionTree;
  delete zhData.comparisonTable;

  console.log('✅ 已删除独立的组件定义');

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
