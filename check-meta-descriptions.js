const fs = require('fs');
const path = require('path');

// 检查页面组件的meta descriptions
function checkPageMetaDescriptions() {
  const pages = [
    'app/[locale]/page.tsx',
    'app/[locale]/downloads/page.tsx',
    'app/[locale]/pain-tracker/page.tsx',
    'app/[locale]/natural-therapies/page.tsx',
    'app/[locale]/medical-disclaimer/page.tsx',
    'app/[locale]/health-guide/page.tsx',
    'app/[locale]/health-guide/understanding-pain/page.tsx',
    'app/[locale]/interactive-tools/symptom-assessment/page.tsx'
  ];

  let shortDescriptions = [];

  pages.forEach(pagePath => {
    if (fs.existsSync(pagePath)) {
      const content = fs.readFileSync(pagePath, 'utf8');

      // 查找description字段
      const descMatches = content.match(/description:\s*['"`](.*?)['"`]/g);
      if (descMatches) {
        descMatches.forEach(match => {
          const desc = match.match(/description:\s*['"`](.*?)['"`]/)[1];
          if (desc && desc.length < 150) {
            shortDescriptions.push({
              file: pagePath,
              length: desc.length,
              description: desc.substring(0, 100) + '...'
            });
          }
        });
      }
    }
  });

  return shortDescriptions;
}

// 检查文章页面的meta descriptions
function checkArticleMetaDescriptions() {
  const articlesDir = 'content/articles/en';
  const files = fs.readdirSync(articlesDir);
  let shortDescriptions = [];

  files.forEach(file => {
    if (file.endsWith('.md')) {
      const content = fs.readFileSync(path.join(articlesDir, file), 'utf8');
      const frontmatter = content.split('---')[1];
      if (frontmatter) {
        const seoDescMatch = frontmatter.match(/seo_description:\s*['"](.*?)['"]/);
        const seoDescZhMatch = frontmatter.match(/seo_description_zh:\s*['"](.*?)['"]/);

        if (seoDescMatch) {
          const desc = seoDescMatch[1];
          if (desc.length < 150) {
            shortDescriptions.push({
              file: file,
              type: 'en',
              length: desc.length,
              description: desc.substring(0, 100) + '...'
            });
          }
        }

        if (seoDescZhMatch) {
          const desc = seoDescZhMatch[1];
          if (desc.length < 150) {
            shortDescriptions.push({
              file: file,
              type: 'zh',
              length: desc.length,
              description: desc.substring(0, 100) + '...'
            });
          }
        }
      }
    }
  });

  return shortDescriptions;
}

// 检查所有页面类型
function checkAllMetaDescriptions() {
  console.log('=== Meta Descriptions 长度检查报告 ===\n');

  // 检查文章页面
  const articleShortDescs = checkArticleMetaDescriptions();
  console.log('📚 文章页面meta descriptions长度问题:');
  console.log('总数:', articleShortDescs.length);
  articleShortDescs.forEach((item, index) => {
    console.log(`${index + 1}. ${item.file} (${item.type}) - 长度: ${item.length}字符`);
    console.log(`   内容: ${item.description}`);
    console.log('');
  });

  // 检查页面组件
  const pageShortDescs = checkPageMetaDescriptions();
  console.log('📄 页面组件meta descriptions长度问题:');
  console.log('总数:', pageShortDescs.length);
  pageShortDescs.forEach((item, index) => {
    console.log(`${index + 1}. ${item.file} - 长度: ${item.length}字符`);
    console.log(`   内容: ${item.description}`);
    console.log('');
  });

  // 总计
  const totalShort = articleShortDescs.length + pageShortDescs.length;
  console.log('📊 总计问题页面数量:', totalShort);
  console.log('📊 文章页面问题:', articleShortDescs.length);
  console.log('📊 页面组件问题:', pageShortDescs.length);

  return {
    total: totalShort,
    articles: articleShortDescs.length,
    pages: pageShortDescs.length,
    articleDetails: articleShortDescs,
    pageDetails: pageShortDescs
  };
}

const result = checkAllMetaDescriptions();
