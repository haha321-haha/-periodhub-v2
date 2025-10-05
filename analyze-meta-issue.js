const fs = require('fs');
const path = require('path');

// 分析CSV中的URL
function analyzeBingUrls() {
  const csvPath = 'www.periodhub.health_FailingUrls_9_27_2025.csv';
  const content = fs.readFileSync(csvPath, 'utf8');
  const urls = content.split('\n').filter(line => line.trim() && line !== '"URL"').map(line => line.replace(/"/g, ''));

  console.log('=== Bing报告URL分析 ===');
  console.log('总URL数量:', urls.length);

  const urlTypes = {};
  urls.forEach(url => {
    if (url.includes('/articles/')) {
      urlTypes.articles = (urlTypes.articles || 0) + 1;
    } else if (url.includes('/health-guide/')) {
      urlTypes['health-guide'] = (urlTypes['health-guide'] || 0) + 1;
    } else if (url.includes('/interactive-tools')) {
      urlTypes['interactive-tools'] = (urlTypes['interactive-tools'] || 0) + 1;
    } else if (url.includes('/scenario-solutions/')) {
      urlTypes['scenario-solutions'] = (urlTypes['scenario-solutions'] || 0) + 1;
    } else if (url.includes('/downloads')) {
      urlTypes.downloads = (urlTypes.downloads || 0) + 1;
    } else if (url.includes('/pain-tracker')) {
      urlTypes['pain-tracker'] = (urlTypes['pain-tracker'] || 0) + 1;
    } else if (url === 'https://www.periodhub.health/' || url === 'https://periodhub.health/') {
      urlTypes.homepage = (urlTypes.homepage || 0) + 1;
    } else {
      urlTypes.other = (urlTypes.other || 0) + 1;
    }
  });

  console.log('URL类型分布:');
  Object.entries(urlTypes).forEach(([type, count]) => {
    console.log('  ' + type + ': ' + count + '个');
  });

  return urls;
}

// 检查文章文件的meta描述长度
function checkArticleMetaDescriptions() {
  console.log('\n=== 文章Meta描述长度检查 ===');
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

        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
          const frontmatter = frontmatterMatch[1];

          // 检查seo_description字段
          const seoDescMatch = frontmatter.match(/seo_description:\s*['"](.*?)['"]/);
          if (seoDescMatch) {
            const desc = seoDescMatch[1];
            if (desc.length < 150) {
              shortDescriptions.push({
                file: file,
                locale: locale,
                length: desc.length,
                description: desc.substring(0, 80) + (desc.length > 80 ? '...' : '')
              });
            }
          }
        }
      }
    });
  });

  console.log(`发现 ${shortDescriptions.length} 个Meta描述过短的文章:`);
  shortDescriptions.forEach(item => {
    console.log(`  ${item.locale}/${item.file}: ${item.length}字符 - ${item.description}`);
  });

  return shortDescriptions;
}

// 检查页面组件的meta描述
function checkPageMetaDescriptions() {
  console.log('\n=== 页面组件Meta描述检查 ===');
  const pages = [
    'app/[locale]/page.tsx',
    'app/[locale]/downloads/page.tsx',
    'app/[locale]/pain-tracker/page.tsx',
    'app/[locale]/interactive-tools/page.tsx'
  ];

  let pageIssues = [];

  pages.forEach(pagePath => {
    if (fs.existsSync(pagePath)) {
      const content = fs.readFileSync(pagePath, 'utf8');

      // 查找description字段
      const descMatches = content.match(/description:\s*['"`](.*?)['"`]/g);
      if (descMatches) {
        descMatches.forEach(match => {
          const desc = match.match(/description:\s*['"`](.*?)['"`]/)[1];
          if (desc && desc.length < 150) {
            pageIssues.push({
              file: pagePath,
              length: desc.length,
              description: desc.substring(0, 80) + (desc.length > 80 ? '...' : '')
            });
          }
        });
      }
    }
  });

  console.log(`发现 ${pageIssues.length} 个页面组件Meta描述过短:`);
  pageIssues.forEach(item => {
    console.log(`  ${item.file}: ${item.length}字符 - ${item.description}`);
  });

  return pageIssues;
}

// 执行完整分析
console.log('开始分析Meta描述问题...\n');

const bingUrls = analyzeBingUrls();
const shortArticles = checkArticleMetaDescriptions();
const shortPages = checkPageMetaDescriptions();

console.log('\n=== 问题总结 ===');
console.log('1. Bing报告问题页面总数:', bingUrls.length);
console.log('2. 文章文件Meta描述过短数量:', shortArticles.length);
console.log('3. 页面组件Meta描述过短数量:', shortPages.length);
