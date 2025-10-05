const fs = require('fs');
const path = require('path');

// 映射翻译键到实际meta描述
function mapTranslationKeysToMetaDescriptions() {
  console.log('=== 翻译键到Meta描述的映射分析 ===\n');

  const results = {
    hardcodedPages: [],
    translationPages: [],
    markdownPages: [],
    unknownPages: []
  };

  // 1. 检查不同页面类型的元数据生成方式
  console.log('🔍 分析页面类型的元数据生成方式...');

  const pageTypes = [
    'app/[locale]/page.tsx', // 主页
    'app/[locale]/articles/[slug]/page.tsx', // 文章页面
    'app/[locale]/health-guide/page.tsx', // 健康指南
    'app/[locale]/scenario-solutions/page.tsx', // 场景解决方案
    'app/[locale]/downloads/page.tsx', // 下载页面
    'app/[locale]/interactive-tools/page.tsx' // 互动工具
  ];

  pageTypes.forEach(pagePath => {
    if (fs.existsSync(pagePath)) {
      const content = fs.readFileSync(pagePath, 'utf8');

      // 检查generateMetadata函数
      const metadataMatch = content.match(/generateMetadata[^}]*description:\s*['"`](.*?)['"`]/s);
      const translationMatch = content.match(/generateMetadata[^}]*description:\s*t\(['"`](.*?)['"`]/s);

      if (metadataMatch) {
        const description = metadataMatch[1];
        results.hardcodedPages.push({
          page: pagePath,
          type: 'hardcoded',
          description: description.substring(0, 100) + (description.length > 100 ? '...' : ''),
          length: description.length
        });
      } else if (translationMatch) {
        const translationKey = translationMatch[1];
        results.translationPages.push({
          page: pagePath,
          type: 'translation',
          translationKey: translationKey
        });
      } else {
        results.unknownPages.push({
          page: pagePath,
          type: 'unknown'
        });
      }
    }
  });

  console.log('📊 页面类型分析结果:');
  console.log(`硬编码页面: ${results.hardcodedPages.length}个`);
  results.hardcodedPages.forEach((item, index) => {
    console.log(`${index + 1}. ${item.page}`);
    console.log(`   长度: ${item.length}字符`);
    console.log(`   内容: ${item.description}`);
    console.log('');
  });

  console.log(`翻译页面: ${results.translationPages.length}个`);
  results.translationPages.forEach((item, index) => {
    console.log(`${index + 1}. ${item.page}`);
    console.log(`   翻译键: ${item.translationKey}`);
    console.log('');
  });

  console.log(`未知页面: ${results.unknownPages.length}个`);
  results.unknownPages.forEach((item, index) => {
    console.log(`${index + 1}. ${item.page}`);
    console.log('');
  });

  // 2. 检查翻译键的实际用途
  console.log('🌐 检查翻译键的实际用途...');
  const translationFiles = ['messages/zh.json', 'messages/en.json'];

  translationFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);

      // 检查关键翻译键
      const keyPaths = [
        'site.description',
        'metadata.home.description',
        'metadata.home.structuredData.description',
        'metadata.articles.description',
        'metadata.tools.description'
      ];

      keyPaths.forEach(keyPath => {
        const value = getNestedValue(data, keyPath);
        if (value && typeof value === 'string') {
          console.log(`${keyPath} (${filePath}):`);
          console.log(`   长度: ${value.length}字符`);
          console.log(`   内容: ${value.substring(0, 100)}${value.length > 100 ? '...' : ''}`);
          console.log('');
        }
      });
    }
  });

  // 3. 分析Bing报告中的页面类型
  console.log('📋 分析Bing报告中的页面类型...');
  const csvPath = 'www.periodhub.health_FailingUrls_9_23_2025.csv';
  if (fs.existsSync(csvPath)) {
    const content = fs.readFileSync(csvPath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim() && line !== '"URL"');
    const urls = lines.map(line => line.replace(/"/g, ''));

    const urlTypes = {
      articles: 0,
      healthGuide: 0,
      scenarioSolutions: 0,
      downloads: 0,
      interactiveTools: 0,
      other: 0
    };

    urls.forEach(url => {
      if (url.includes('/articles/')) urlTypes.articles++;
      else if (url.includes('/health-guide')) urlTypes.healthGuide++;
      else if (url.includes('/scenario-solutions')) urlTypes.scenarioSolutions++;
      else if (url.includes('/downloads')) urlTypes.downloads++;
      else if (url.includes('/interactive-tools')) urlTypes.interactiveTools++;
      else urlTypes.other++;
    });

    console.log('Bing报告中的页面类型分布:');
    Object.entries(urlTypes).forEach(([type, count]) => {
      if (count > 0) {
        console.log(`${type}: ${count}个`);
      }
    });
  }

  return results;
}

// 辅助函数：获取嵌套对象的值
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

const result = mapTranslationKeysToMetaDescriptions();
