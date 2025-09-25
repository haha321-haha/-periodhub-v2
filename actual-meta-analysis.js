const fs = require('fs');
const path = require('path');

// 基于实际元数据生成逻辑重新分析
function analyzeActualMetaDescriptions() {
  console.log('=== 基于实际元数据生成逻辑的分析 ===\n');
  
  // 元数据生成逻辑：
  // 中文：seo_description_zh → seo_description → summary_zh → summary
  // 英文：seo_description → summary
  // 最终输出：seoDescription字段
  
  const articlesDir = 'content/articles';
  const locales = ['en', 'zh'];
  let actualProblems = [];
  
  locales.forEach(locale => {
    const localeDir = path.join(articlesDir, locale);
    if (!fs.existsSync(localeDir)) return;
    
    const files = fs.readdirSync(localeDir);
    files.forEach(file => {
      if (file.endsWith('.md')) {
        const filePath = path.join(localeDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // 解析frontmatter
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
          const frontmatter = frontmatterMatch[1];
          
          // 根据实际逻辑确定最终使用的描述
          let finalDescription = '';
          let sourceField = '';
          
          if (locale === 'zh') {
            // 中文优先级：seo_description_zh → seo_description → summary_zh → summary
            const seoDescZhMatch = frontmatter.match(/seo_description_zh:\s*['"](.*?)['"]/);
            const seoDescMatch = frontmatter.match(/seo_description:\s*['"](.*?)['"]/);
            const summaryZhMatch = frontmatter.match(/summary_zh:\s*['"](.*?)['"]/);
            const summaryMatch = frontmatter.match(/summary:\s*['"](.*?)['"]/);
            
            if (seoDescZhMatch) {
              finalDescription = seoDescZhMatch[1];
              sourceField = 'seo_description_zh';
            } else if (seoDescMatch) {
              finalDescription = seoDescMatch[1];
              sourceField = 'seo_description';
            } else if (summaryZhMatch) {
              finalDescription = summaryZhMatch[1];
              sourceField = 'summary_zh';
            } else if (summaryMatch) {
              finalDescription = summaryMatch[1];
              sourceField = 'summary';
            }
          } else {
            // 英文优先级：seo_description → summary
            const seoDescMatch = frontmatter.match(/seo_description:\s*['"](.*?)['"]/);
            const summaryMatch = frontmatter.match(/summary:\s*['"](.*?)['"]/);
            
            if (seoDescMatch) {
              finalDescription = seoDescMatch[1];
              sourceField = 'seo_description';
            } else if (summaryMatch) {
              finalDescription = summaryMatch[1];
              sourceField = 'summary';
            }
          }
          
          // 检查长度
          if (finalDescription && finalDescription.length < 150) {
            actualProblems.push({
              file: file,
              locale: locale,
              sourceField: sourceField,
              length: finalDescription.length,
              description: finalDescription.substring(0, 100) + (finalDescription.length > 100 ? '...' : ''),
              url: `https://www.periodhub.health/${locale}/articles/${file.replace('.md', '')}`
            });
          }
        }
      }
    });
  });
  
  // 按长度排序
  actualProblems.sort((a, b) => a.length - b.length);
  
  console.log('📊 实际元数据问题分析:');
  console.log(`总数: ${actualProblems.length}`);
  console.log('');
  
  console.log('🔍 最短的10个实际问题:');
  actualProblems.slice(0, 10).forEach((item, index) => {
    console.log(`${index + 1}. ${item.file} (${item.locale}) - ${item.sourceField}`);
    console.log(`   长度: ${item.length}字符`);
    console.log(`   内容: ${item.description}`);
    console.log(`   URL: ${item.url}`);
    console.log('');
  });
  
  // 按语言分组
  const zhProblems = actualProblems.filter(item => item.locale === 'zh');
  const enProblems = actualProblems.filter(item => item.locale === 'en');
  
  console.log('📈 按语言分组:');
  console.log(`中文问题: ${zhProblems.length}个`);
  console.log(`英文问题: ${enProblems.length}个`);
  console.log('');
  
  // 按字段分组
  const fieldGroups = {};
  actualProblems.forEach(item => {
    if (!fieldGroups[item.sourceField]) {
      fieldGroups[item.sourceField] = 0;
    }
    fieldGroups[item.sourceField]++;
  });
  
  console.log('📋 按字段分组:');
  Object.entries(fieldGroups).forEach(([field, count]) => {
    console.log(`${field}: ${count}个问题`);
  });
  
  return actualProblems;
}

const result = analyzeActualMetaDescriptions();



