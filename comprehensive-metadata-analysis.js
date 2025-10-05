const fs = require('fs');
const path = require('path');

// 全面元数据分析脚本
function comprehensiveMetadataAnalysis() {
  console.log('=== 全面元数据生成源分析 ===\n');

  const results = {
    hardcodedPages: [],
    translationPages: [],
    markdownPages: [],
    totalProblems: 0
  };

  // 1. 分析硬编码页面
  console.log('🔍 分析硬编码页面组件...');
  const hardcodedFiles = [
    'app/[locale]/health-guide/global-perspectives/page.tsx',
    'app/[locale]/scenario-solutions/office/page.tsx',
    'app/[locale]/test-banner/page.tsx',
    'app/[locale]/medical-disclaimer/page.tsx'
  ];

  hardcodedFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');

      // 查找硬编码的description
      const descMatch = content.match(/description:\s*['"`](.*?)['"`]/);
      if (descMatch) {
        const description = descMatch[1];
        if (description.length < 150) {
          results.hardcodedPages.push({
            file: filePath,
            length: description.length,
            description: description.substring(0, 100) + (description.length > 100 ? '...' : ''),
            type: 'hardcoded'
          });
        }
      }
    }
  });

  console.log(`硬编码问题页面: ${results.hardcodedPages.length}个`);
  results.hardcodedPages.forEach((item, index) => {
    console.log(`${index + 1}. ${item.file}`);
    console.log(`   长度: ${item.length}字符`);
    console.log(`   内容: ${item.description}`);
    console.log('');
  });

  // 2. 分析翻译文件
  console.log('🌐 分析翻译文件...');
  const translationFiles = ['messages/zh.json', 'messages/en.json'];

  translationFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);

      // 递归查找所有description字段
      function findDescriptions(obj, path = '') {
        const descriptions = [];

        for (const [key, value] of Object.entries(obj)) {
          const currentPath = path ? `${path}.${key}` : key;

          if (key === 'description' && typeof value === 'string') {
            if (value.length < 150) {
              descriptions.push({
                path: currentPath,
                length: value.length,
                description: value.substring(0, 100) + (value.length > 100 ? '...' : ''),
                type: 'translation'
              });
            }
          } else if (typeof value === 'object' && value !== null) {
            descriptions.push(...findDescriptions(value, currentPath));
          }
        }

        return descriptions;
      }

      const shortDescriptions = findDescriptions(data);
      results.translationPages.push(...shortDescriptions);
    }
  });

  console.log(`翻译文件问题: ${results.translationPages.length}个`);
  results.translationPages.slice(0, 5).forEach((item, index) => {
    console.log(`${index + 1}. ${item.path}`);
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
            results.markdownPages.push({
              file: file,
              locale: locale,
              sourceField: sourceField,
              length: finalDescription.length,
              description: finalDescription.substring(0, 100) + (finalDescription.length > 100 ? '...' : ''),
              type: 'markdown'
            });
          }
        }
      }
    });
  });

  console.log(`Markdown文件问题: ${results.markdownPages.length}个`);
  results.markdownPages.slice(0, 5).forEach((item, index) => {
    console.log(`${index + 1}. ${item.file} (${item.locale}) - ${item.sourceField}`);
    console.log(`   长度: ${item.length}字符`);
    console.log(`   内容: ${item.description}`);
    console.log('');
  });

  // 4. 总计分析
  results.totalProblems = results.hardcodedPages.length + results.translationPages.length + results.markdownPages.length;

  console.log('📊 总计分析:');
  console.log(`硬编码页面问题: ${results.hardcodedPages.length}个`);
  console.log(`翻译文件问题: ${results.translationPages.length}个`);
  console.log(`Markdown文件问题: ${results.markdownPages.length}个`);
  console.log(`总问题数量: ${results.totalProblems}个`);
  console.log('');

  console.log('🎯 修复优先级:');
  console.log('1. 硬编码页面（立即修复）');
  console.log('2. 翻译文件优化');
  console.log('3. Markdown文件优化');

  return results;
}

const result = comprehensiveMetadataAnalysis();
