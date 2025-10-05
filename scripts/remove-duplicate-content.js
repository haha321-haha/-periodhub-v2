#!/usr/bin/env node

const fs = require('fs');

function removeDuplicateContent(filePath) {
  console.log(`正在修复 ${filePath} 中的重复内容...`);

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    // 找到第二个 "symptomChecker" 的位置（第4595行）
    let duplicateStartLine = -1;
    let symptomCheckerCount = 0;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('"symptomChecker"')) {
        symptomCheckerCount++;
        if (symptomCheckerCount === 2) {
          duplicateStartLine = i;
          break;
        }
      }
    }

    if (duplicateStartLine === -1) {
      console.log('未找到重复的 symptomChecker 块');
      return false;
    }

    console.log(`找到重复内容开始于第 ${duplicateStartLine + 1} 行`);

    // 保留从开始到重复内容之前的部分
    const validLines = lines.slice(0, duplicateStartLine);

    // 添加正确的结尾结构
    const correctEnding = [
      '},',
      '"disclaimer": {',
      '  "title": "医疗免责声明",',
      '  "text": "本文内容仅供教育和信息目的，不能替代专业医疗建议、诊断或治疗。如有健康问题，请咨询合格的医疗专业人员。任何医疗决策都应该在咨询医生后做出。"',
      '},',
      '"errors": {',
      '  "title": "出现错误",',
      '  "description": "评估工具暂时无法使用，请稍后再试。",',
      '  "reload": "重新加载"',
      '}',
      '}'
    ];

    // 合并内容
    const fixedContent = validLines.concat(correctEnding).join('\n');

    // 验证JSON格式
    try {
      JSON.parse(fixedContent);
      console.log('✅ JSON格式验证通过');

      // 写入修复后的内容
      fs.writeFileSync(filePath, fixedContent);
      console.log(`✅ 成功修复 ${filePath}`);
      return true;
    } catch (parseError) {
      console.log(`❌ 修复后JSON格式仍有问题: ${parseError.message}`);
      return false;
    }
  } catch (error) {
    console.error(`处理文件失败: ${error.message}`);
    return false;
  }
}

// 修复中文翻译文件
console.log('修复中文翻译文件...');
const zhFixed = removeDuplicateContent('messages/zh.json');

if (zhFixed) {
  console.log('\n🎉 中文翻译文件修复完成！');

  // 验证英文翻译文件
  console.log('\n检查英文翻译文件...');
  try {
    JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
    console.log('✅ 英文翻译文件JSON格式正确');
    console.log('\n🎉 所有翻译文件都正常！');
    process.exit(0);
  } catch (error) {
    console.log(`❌ 英文翻译文件JSON错误: ${error.message}`);
    const enFixed = removeDuplicateContent('messages/en.json');
    process.exit(enFixed ? 0 : 1);
  }
} else {
  console.log('\n⚠️  修复失败，需要手动检查');
  process.exit(1);
}
