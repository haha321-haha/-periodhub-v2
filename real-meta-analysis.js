const fs = require('fs');
const path = require('path');

// 重新分析真正的meta描述问题
function analyzeRealMetaDescriptionIssues() {
  console.log('=== 真正的Meta描述问题分析 ===\n');
  
  const results = {
    hardcodedMetaIssues: [],
    translationMetaIssues: [],
    markdownMetaIssues: []
  };
  
  // 1. 检查硬编码的meta描述（排除测试页面）
  console.log('🔍 检查硬编码meta描述...');
  const hardcodedFiles = [
    'app/[locale]/health-guide/global-perspectives/page.tsx',
    'app/[locale]/medical-disclaimer/page.tsx',
    'app/[locale]/natural-therapies/page.tsx'
  ];
  
  hardcodedFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // 查找generateMetadata函数中的description
      const metadataMatch = content.match(/generateMetadata[^}]*description:\s*['"`](.*?)['"`]/s);
      if (metadataMatch) {
        const description = metadataMatch[1];
        if (description.length < 150) {
          results.hardcodedMetaIssues.push({
            file: filePath,
            length: description.length,
            description: description.substring(0, 100) + (description.length > 100 ? '...' : ''),
            type: 'hardcoded_meta'
          });
        }
      }
    }
  });
  
  console.log(`硬编码meta描述问题: ${results.hardcodedMetaIssues.length}个`);
  results.hardcodedMetaIssues.forEach((item, index) => {
    console.log(`${index + 1}. ${item.file}`);
    console.log(`   长度: ${item.length}字符`);
    console.log(`   内容: ${item.description}`);
    console.log('');
  });
  
  // 2. 检查翻译文件中的关键meta描述
  console.log('🌐 检查翻译文件中的关键meta描述...');
  const translationFiles = ['messages/zh.json', 'messages/en.json'];
  
  translationFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      
      // 检查关键的meta描述字段
      const keyPaths = [
        'site.description',
        'metadata.home.description',
        'metadata.home.structuredData.description',
        'metadata.articles.description',
        'metadata.tools.description'
      ];
      
      keyPaths.forEach(keyPath => {
        const value = getNestedValue(data, keyPath);
        if (value && typeof value === 'string' && value.length < 150) {
          results.translationMetaIssues.push({
            path: keyPath,
            file: filePath,
            length: value.length,
            description: value.substring(0, 100) + (value.length > 100 ? '...' : ''),
            type: 'translation_meta'
          });
        }
      });
    }
  });
  
  console.log(`翻译文件meta描述问题: ${results.translationMetaIssues.length}个`);
  results.translationMetaIssues.forEach((item, index) => {
    console.log(`${index + 1}. ${item.path} (${item.file})`);
    console.log(`   长度: ${item.length}字符`);
    console.log(`   内容: ${item.description}`);
    console.log('');
  });
  
  // 3. 重新分析Markdown文件（基于实际元数据生成逻辑）
  console.log('📚 重新分析Markdown文件...');
  const articlesDir = 'content/articles';
  const locales = ['en', 'zh'];
  
  locales.forEach(locale => {
    const localeDir = path.join(articlesDir, locale);
    if (!fs.existsSync(localeDir)) return;
    
    const files = fs.readdirSync(localeDir);
    files.forEach(file => {
      if (file.endsWith('.md')) {
        const filePath = path.join(localeDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
          const frontmatter = frontmatterMatch[1];
          
          // 根据实际元数据生成逻辑确定最终描述
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
          
          if (finalDescription && finalDescription.length < 150) {
            results.markdownMetaIssues.push({
              file: file,
              locale: locale,
              sourceField: sourceField,
              length: finalDescription.length,
              description: finalDescription.substring(0, 100) + (finalDescription.length > 100 ? '...' : ''),
              type: 'markdown_meta'
            });
          }
        }
      }
    });
  });
  
  console.log(`Markdown文件meta描述问题: ${results.markdownMetaIssues.length}个`);
  results.markdownMetaIssues.slice(0, 5).forEach((item, index) => {
    console.log(`${index + 1}. ${item.file} (${item.locale}) - ${item.sourceField}`);
    console.log(`   长度: ${item.length}字符`);
    console.log(`   内容: ${item.description}`);
    console.log('');
  });
  
  // 4. 总计分析
  const totalIssues = results.hardcodedMetaIssues.length + results.translationMetaIssues.length + results.markdownMetaIssues.length;
  
  console.log('📊 真正的Meta描述问题总计:');
  console.log(`硬编码meta描述问题: ${results.hardcodedMetaIssues.length}个`);
  console.log(`翻译文件meta描述问题: ${results.translationMetaIssues.length}个`);
  console.log(`Markdown文件meta描述问题: ${results.markdownMetaIssues.length}个`);
  console.log(`总问题数量: ${totalIssues}个`);
  console.log('');
  
  console.log('🎯 修复优先级:');
  console.log('1. 硬编码meta描述（立即修复）');
  console.log('2. 翻译文件meta描述（高影响）');
  console.log('3. Markdown文件meta描述（逐个修复）');
  
  return results;
}

// 辅助函数：获取嵌套对象的值
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

const result = analyzeRealMetaDescriptionIssues();



