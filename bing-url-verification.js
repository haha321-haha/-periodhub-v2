const fs = require('fs');
const path = require('path');

// 从Bing报告中随机选择10个URL进行验证
function selectBingUrlsForVerification() {
  const csvPath = 'www.periodhub.health_FailingUrls_9_23_2025.csv';
  if (!fs.existsSync(csvPath)) {
    console.log('❌ CSV文件不存在:', csvPath);
    return [];
  }

  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.split('\n').filter(line => line.trim() && line !== '"URL"');
  const urls = lines.map(line => line.replace(/"/g, ''));

  // 随机选择10个URL
  const shuffled = urls.sort(() => 0.5 - Math.random());
  const selectedUrls = shuffled.slice(0, 10);

  console.log('=== Bing报告验证样本 ===\n');
  console.log(`总URL数量: ${urls.length}`);
  console.log(`选择验证样本: ${selectedUrls.length}`);
  console.log('');

  console.log('🔍 需要验证的10个URL:');
  selectedUrls.forEach((url, index) => {
    console.log(`${index + 1}. ${url}`);
  });
  console.log('');

  // 分析URL类型
  const urlTypes = {
    articles: 0,
    downloads: 0,
    healthGuide: 0,
    scenarioSolutions: 0,
    interactiveTools: 0,
    other: 0
  };

  selectedUrls.forEach(url => {
    if (url.includes('/articles/')) urlTypes.articles++;
    else if (url.includes('/downloads')) urlTypes.downloads++;
    else if (url.includes('/health-guide')) urlTypes.healthGuide++;
    else if (url.includes('/scenario-solutions')) urlTypes.scenarioSolutions++;
    else if (url.includes('/interactive-tools')) urlTypes.interactiveTools++;
    else urlTypes.other++;
  });

  console.log('📊 URL类型分布:');
  Object.entries(urlTypes).forEach(([type, count]) => {
    if (count > 0) {
      console.log(`${type}: ${count}个`);
    }
  });
  console.log('');

  // 检查哪些URL在文件分析中
  const fileAnalysisUrls = [
    'https://www.periodhub.health/en/articles/ginger-menstrual-pain-relief-guide',
    'https://www.periodhub.health/zh/articles/understanding-your-cycle',
    'https://www.periodhub.health/en/articles/period-pain-simulator-accuracy-analysis',
    'https://www.periodhub.health/zh/articles/menstrual-nausea-relief-guide',
    'https://www.periodhub.health/zh/articles/menstrual-pain-accompanying-symptoms-guide'
  ];

  const inFileAnalysis = selectedUrls.filter(url =>
    fileAnalysisUrls.some(fileUrl => url.includes(fileUrl.split('/').pop()))
  );

  console.log('📋 验证计划:');
  console.log(`在文件分析中的URL: ${inFileAnalysis.length}个`);
  console.log(`不在文件分析中的URL: ${selectedUrls.length - inFileAnalysis.length}个`);
  console.log('');

  console.log('🎯 验证重点:');
  console.log('1. 检查实际HTML meta标签');
  console.log('2. 对比文件分析结果');
  console.log('3. 识别动态内容问题');
  console.log('4. 确定CDN缓存问题');
  console.log('5. 验证服务器端渲染');
  console.log('');

  return {
    selectedUrls,
    urlTypes,
    inFileAnalysis: inFileAnalysis.length,
    notInFileAnalysis: selectedUrls.length - inFileAnalysis.length
  };
}

const result = selectBingUrlsForVerification();
