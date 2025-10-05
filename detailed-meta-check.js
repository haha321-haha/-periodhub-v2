const fs = require('fs');
const path = require('path');

// 检查特定页面的meta descriptions长度
function checkSpecificPages() {
  const pages = [
    { path: 'app/[locale]/downloads/page.tsx', name: 'Downloads页面' },
    { path: 'app/[locale]/pain-tracker/page.tsx', name: 'Pain Tracker页面' },
    { path: 'app/[locale]/natural-therapies/page.tsx', name: 'Natural Therapies页面' },
    { path: 'app/[locale]/medical-disclaimer/page.tsx', name: 'Medical Disclaimer页面' },
    { path: 'app/[locale]/health-guide/page.tsx', name: 'Health Guide页面' },
    { path: 'app/[locale]/health-guide/understanding-pain/page.tsx', name: 'Understanding Pain页面' },
    { path: 'app/[locale]/interactive-tools/symptom-assessment/page.tsx', name: 'Symptom Assessment页面' }
  ];

  let shortDescriptions = [];

  pages.forEach(page => {
    if (fs.existsSync(page.path)) {
      const content = fs.readFileSync(page.path, 'utf8');

      // 查找description字段
      const descMatches = content.match(/description:\s*['"`](.*?)['"`]/g);
      if (descMatches) {
        descMatches.forEach(match => {
          const desc = match.match(/description:\s*['"`](.*?)['"`]/)[1];
          if (desc && desc.length < 150) {
            shortDescriptions.push({
              file: page.name,
              path: page.path,
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

// 检查所有健康指南子页面
function checkHealthGuidePages() {
  const healthGuideDir = 'app/[locale]/health-guide';
  let shortDescriptions = [];

  if (fs.existsSync(healthGuideDir)) {
    const files = fs.readdirSync(healthGuideDir, { withFileTypes: true });

    files.forEach(file => {
      if (file.isDirectory()) {
        const pagePath = path.join(healthGuideDir, file.name, 'page.tsx');
        if (fs.existsSync(pagePath)) {
          const content = fs.readFileSync(pagePath, 'utf8');

          // 查找description字段
          const descMatches = content.match(/description:\s*['"`](.*?)['"`]/g);
          if (descMatches) {
            descMatches.forEach(match => {
              const desc = match.match(/description:\s*['"`](.*?)['"`]/)[1];
              if (desc && desc.length < 150) {
                shortDescriptions.push({
                  file: `Health Guide - ${file.name}`,
                  path: pagePath,
                  length: desc.length,
                  description: desc.substring(0, 100) + '...'
                });
              }
            });
          }
        }
      }
    });
  }

  return shortDescriptions;
}

// 检查场景解决方案页面
function checkScenarioPages() {
  const scenarioDir = 'app/[locale]/scenario-solutions';
  let shortDescriptions = [];

  if (fs.existsSync(scenarioDir)) {
    const files = fs.readdirSync(scenarioDir, { withFileTypes: true });

    files.forEach(file => {
      if (file.isDirectory()) {
        const pagePath = path.join(scenarioDir, file.name, 'page.tsx');
        if (fs.existsSync(pagePath)) {
          const content = fs.readFileSync(pagePath, 'utf8');

          // 查找description字段
          const descMatches = content.match(/description:\s*['"`](.*?)['"`]/g);
          if (descMatches) {
            descMatches.forEach(match => {
              const desc = match.match(/description:\s*['"`](.*?)['"`]/)[1];
              if (desc && desc.length < 150) {
                shortDescriptions.push({
                  file: `Scenario Solutions - ${file.name}`,
                  path: pagePath,
                  length: desc.length,
                  description: desc.substring(0, 100) + '...'
                });
              }
            });
          }
        }
      }
    });
  }

  return shortDescriptions;
}

// 主检查函数
function comprehensiveMetaCheck() {
  console.log('=== 全面Meta Descriptions长度检查报告 ===\n');

  // 检查文章页面（中文）
  const articleShortDescs = checkArticleMetaDescriptions();
  console.log('📚 中文文章页面meta descriptions长度问题:');
  console.log('总数:', articleShortDescs.length);
  articleShortDescs.forEach((item, index) => {
    console.log(`${index + 1}. ${item.file} (${item.type}) - 长度: ${item.length}字符`);
    console.log(`   内容: ${item.description}`);
    console.log('');
  });

  // 检查其他页面
  const pageShortDescs = checkSpecificPages();
  console.log('📄 主要页面meta descriptions长度问题:');
  console.log('总数:', pageShortDescs.length);
  pageShortDescs.forEach((item, index) => {
    console.log(`${index + 1}. ${item.file} - 长度: ${item.length}字符`);
    console.log(`   路径: ${item.path}`);
    console.log(`   内容: ${item.description}`);
    console.log('');
  });

  // 检查健康指南子页面
  const healthGuideShortDescs = checkHealthGuidePages();
  console.log('🏥 健康指南子页面meta descriptions长度问题:');
  console.log('总数:', healthGuideShortDescs.length);
  healthGuideShortDescs.forEach((item, index) => {
    console.log(`${index + 1}. ${item.file} - 长度: ${item.length}字符`);
    console.log(`   路径: ${item.path}`);
    console.log(`   内容: ${item.description}`);
    console.log('');
  });

  // 检查场景解决方案页面
  const scenarioShortDescs = checkScenarioPages();
  console.log('🎯 场景解决方案页面meta descriptions长度问题:');
  console.log('总数:', scenarioShortDescs.length);
  scenarioShortDescs.forEach((item, index) => {
    console.log(`${index + 1}. ${item.file} - 长度: ${item.length}字符`);
    console.log(`   路径: ${item.path}`);
    console.log(`   内容: ${item.description}`);
    console.log('');
  });

  // 总计
  const totalShort = articleShortDescs.length + pageShortDescs.length + healthGuideShortDescs.length + scenarioShortDescs.length;
  console.log('📊 总计问题页面数量:', totalShort);
  console.log('📊 中文文章页面问题:', articleShortDescs.length);
  console.log('📊 主要页面问题:', pageShortDescs.length);
  console.log('📊 健康指南子页面问题:', healthGuideShortDescs.length);
  console.log('📊 场景解决方案页面问题:', scenarioShortDescs.length);

  return {
    total: totalShort,
    articles: articleShortDescs.length,
    pages: pageShortDescs.length,
    healthGuides: healthGuideShortDescs.length,
    scenarios: scenarioShortDescs.length,
    articleDetails: articleShortDescs,
    pageDetails: pageShortDescs,
    healthGuideDetails: healthGuideShortDescs,
    scenarioDetails: scenarioShortDescs
  };
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
        const seoDescZhMatch = frontmatter.match(/seo_description_zh:\s*['"](.*?)['"]/);

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

const result = comprehensiveMetaCheck();
