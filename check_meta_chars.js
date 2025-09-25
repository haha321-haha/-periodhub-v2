const fs = require('fs');
const path = require('path');

// 读取文件内容
const zhFile = './content/articles/zh/when-to-seek-medical-care-comprehensive-guide.md';
const enFile = './content/articles/en/when-to-seek-medical-care-comprehensive-guide.md';

function parseFrontMatter(content) {
  const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontMatterMatch) return null;
  
  const frontMatter = frontMatterMatch[1];
  const lines = frontMatter.split('\n');
  const data = {};
  
  lines.forEach(line => {
    if (line.includes(':')) {
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
      data[key.trim()] = value;
    }
  });
  
  return data;
}

function checkCharacterCount(text, fieldName, language) {
  const charCount = text.length;
  const targetMin = language === 'zh' ? 80 : 150;
  const targetMax = language === 'zh' ? 120 : 160;
  
  let status = '✅ 符合要求';
  if (charCount < targetMin) {
    status = `❌ 太短 (需要${targetMin}-${targetMax}字符)`;
  } else if (charCount > targetMax) {
    status = `❌ 太长 (需要${targetMin}-${targetMax}字符)`;
  }
  
  return {
    field: fieldName,
    language,
    text,
    charCount,
    targetMin,
    targetMax,
    status
  };
}

// 检查中文文件
const zhContent = fs.readFileSync(zhFile, 'utf8');
const zhData = parseFrontMatter(zhContent);

console.log('=== 中文版本 Meta 信息检查 ===');
console.log(`文件: ${zhFile}`);
console.log('');

const zhResults = [];

if (zhData.summary) {
  const result = checkCharacterCount(zhData.summary, 'summary', 'zh');
  zhResults.push(result);
  console.log(`📝 Summary: ${result.charCount}字符 - ${result.status}`);
  console.log(`内容: "${result.text}"`);
  console.log('');
}

if (zhData.seo_description) {
  const result = checkCharacterCount(zhData.seo_description, 'seo_description', 'zh');
  zhResults.push(result);
  console.log(`🔍 SEO Description: ${result.charCount}字符 - ${result.status}`);
  console.log(`内容: "${result.text}"`);
  console.log('');
}

// 检查英文文件
const enContent = fs.readFileSync(enFile, 'utf8');
const enData = parseFrontMatter(enContent);

console.log('=== 英文版本 Meta 信息检查 ===');
console.log(`文件: ${enFile}`);
console.log('');

const enResults = [];

if (enData.summary) {
  const result = checkCharacterCount(enData.summary, 'summary', 'en');
  enResults.push(result);
  console.log(`📝 Summary: ${result.charCount} characters - ${result.status}`);
  console.log(`Content: "${result.text}"`);
  console.log('');
}

if (enData.seo_description) {
  const result = checkCharacterCount(enData.seo_description, 'seo_description', 'en');
  enResults.push(result);
  console.log(`🔍 SEO Description: ${result.charCount} characters - ${result.status}`);
  console.log(`Content: "${result.text}"`);
  console.log('');
}

// 总结
console.log('=== 检查结果总结 ===');
const allResults = [...zhResults, ...enResults];
const issues = allResults.filter(r => r.status.includes('❌'));

if (issues.length === 0) {
  console.log('✅ 所有meta信息都符合字符数要求！');
} else {
  console.log(`❌ 发现 ${issues.length} 个问题需要修复:`);
  issues.forEach(issue => {
    console.log(`- ${issue.language.toUpperCase()} ${issue.field}: ${issue.charCount}字符 (需要${issue.targetMin}-${issue.targetMax}字符)`);
  });
}
