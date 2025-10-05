const fs = require('fs');
const path = require('path');

// 从CSV文件读取Bing报告的URL列表
function readBingReportUrls() {
  const csvPath = 'www.periodhub.health_FailingUrls_9_23_2025.csv';
  if (!fs.existsSync(csvPath)) {
    console.log('❌ CSV文件不存在:', csvPath);
    return [];
  }

  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.split('\n').filter(line => line.trim() && line !== '"URL"');
  return lines.map(line => line.replace(/"/g, ''));
}

// 检查文章文件的Meta描述
function checkArticleMetaDescriptions() {
  const articlesDir = 'content/articles';
  const locales = ['en', 'zh'];
  let shortDescriptions = [];

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

          // 检查各种description字段
          const descFields = [
            'description',
            'summary',
            'seo_description',
            'seo_description_zh'
          ];

          descFields.forEach(field => {
            const regex = new RegExp(`${field}:\\s*['"](.*?)['"]`, 'g');
            let match;
            while ((match = regex.exec(frontmatter)) !== null) {
              const desc = match[1];
              if (desc && desc.length < 150) {
                shortDescriptions.push({
                  file: file,
                  locale: locale,
                  field: field,
                  length: desc.length,
                  description: desc.substring(0, 100) + (desc.length > 100 ? '...' : ''),
                  url: `https://www.periodhub.health/${locale}/articles/${file.replace('.md', '')}`
                });
              }
            }
          });
        }
      }
    });
  });

  return shortDescriptions;
}

// 检查页面组件的Meta描述
function checkPageMetaDescriptions() {
  const pagesDir = 'app/[locale]';
  let shortDescriptions = [];

  function scanDirectory(dir) {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        scanDirectory(itemPath);
      } else if (item === 'page.tsx') {
        const content = fs.readFileSync(itemPath, 'utf8');

        // 查找description字段
        const descMatches = content.match(/description:\s*['"`](.*?)['"`]/g);
        if (descMatches) {
          descMatches.forEach(match => {
            const desc = match.match(/description:\s*['"`](.*?)['"`]/)[1];
            if (desc && desc.length < 150) {
              // 尝试从路径推断URL
              const urlPath = itemPath.replace('app/[locale]', '').replace('/page.tsx', '');
              const url = `https://www.periodhub.health/zh${urlPath}`;

              shortDescriptions.push({
                file: itemPath,
                length: desc.length,
                description: desc.substring(0, 100) + (desc.length > 100 ? '...' : ''),
                url: url
              });
            }
          });
        }
      }
    });
  }

  scanDirectory(pagesDir);
  return shortDescriptions;
}

// 主分析函数
function analyzeMetaDescriptions() {
  console.log('=== Meta Descriptions 全面分析报告 ===\n');

  // 读取Bing报告的URL列表
  const bingUrls = readBingReportUrls();
  console.log(`📋 Bing报告中的URL数量: ${bingUrls.length}`);

  // 检查文章Meta描述
  const articleShortDescs = checkArticleMetaDescriptions();
  console.log(`\n📚 文章页面Meta描述长度问题:`);
  console.log(`总数: ${articleShortDescs.length}`);

  // 按长度分组
  const lengthGroups = {
    '0-50': 0,
    '51-100': 0,
    '101-149': 0
  };

  articleShortDescs.forEach(item => {
    if (item.length <= 50) lengthGroups['0-50']++;
    else if (item.length <= 100) lengthGroups['51-100']++;
    else lengthGroups['101-149']++;
  });

  console.log(`长度分布:`);
  console.log(`  0-50字符: ${lengthGroups['0-50']}个`);
  console.log(`  51-100字符: ${lengthGroups['51-100']}个`);
  console.log(`  101-149字符: ${lengthGroups['101-149']}个`);

  // 显示前10个最短的描述
  const sortedByLength = articleShortDescs.sort((a, b) => a.length - b.length);
  console.log(`\n🔍 最短的10个Meta描述:`);
  sortedByLength.slice(0, 10).forEach((item, index) => {
    console.log(`${index + 1}. ${item.file} (${item.locale}) - ${item.field}`);
    console.log(`   长度: ${item.length}字符`);
    console.log(`   内容: ${item.description}`);
    console.log(`   URL: ${item.url}`);
    console.log('');
  });

  // 检查页面组件Meta描述
  const pageShortDescs = checkPageMetaDescriptions();
  console.log(`\n📄 页面组件Meta描述长度问题:`);
  console.log(`总数: ${pageShortDescs.length}`);

  if (pageShortDescs.length > 0) {
    pageShortDescs.forEach((item, index) => {
      console.log(`${index + 1}. ${item.file}`);
      console.log(`   长度: ${item.length}字符`);
      console.log(`   内容: ${item.description}`);
      console.log(`   URL: ${item.url}`);
      console.log('');
    });
  }

  // 总计
  const totalShort = articleShortDescs.length + pageShortDescs.length;
  console.log(`\n📊 总计问题页面数量: ${totalShort}`);
  console.log(`📊 文章页面问题: ${articleShortDescs.length}`);
  console.log(`📊 页面组件问题: ${pageShortDescs.length}`);

  // 与Bing报告对比
  console.log(`\n🔍 与Bing报告对比:`);
  console.log(`Bing报告问题页面: ${bingUrls.length}`);
  console.log(`代码检查发现问题: ${totalShort}`);
  console.log(`差异: ${Math.abs(bingUrls.length - totalShort)}`);

  return {
    total: totalShort,
    articles: articleShortDescs.length,
    pages: pageShortDescs.length,
    bingReport: bingUrls.length,
    articleDetails: articleShortDescs,
    pageDetails: pageShortDescs,
    lengthGroups: lengthGroups
  };
}

const result = analyzeMetaDescriptions();
