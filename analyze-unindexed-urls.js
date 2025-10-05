#!/usr/bin/env node

/**
 * 分析Google Search Console中"已抓取-尚未编入索引"的URL
 * 检查11个示例URL的具体情况并给出建议
 */

const https = require('https');

// 从Google Search Console提供的示例URL
const unindexedUrls = [
  'https://www.periodhub.health/en/articles/effective-herbal-tea-menstrual-pain',
  'https://www.periodhub.health/en/icon?9c1a5eaddb17b0ab',
  'https://www.periodhub.health/en/scenario-solutions/office',
  'https://www.periodhub.health/en/articles/when-to-seek-medical-care-comprehensive-guide',
  'https://www.periodhub.health/en/articles/period-friendly-recipes',
  'https://www.periodhub.health/en/articles/comprehensive-iud-guide',
  'https://www.periodhub.health/downloads/menstrual-cycle-nutrition-plan.pdf',
  'https://www.periodhub.health/en/articles/comprehensive-medical-guide-to-dysmenorrhea',
  'https://www.periodhub.health/en/teen-health/development-pain',
  'https://www.periodhub.health/en/scenario-solutions/social',
  'https://www.periodhub.health/en/articles/anti-inflammatory-diet-period-pain'
];

const crawlDates = [
  '2025年9月16日',
  '2025年9月11日',
  '2025年9月11日',
  '2025年7月4日',
  '2025年7月4日',
  '2025年7月4日',
  '2025年7月3日',
  '2025年7月3日',
  '2025年7月3日',
  '2025年6月30日',
  '2025年6月28日'
];

async function analyzeUnindexedUrls() {
  console.log('🔍 分析Google Search Console中"已抓取-尚未编入索引"的URL\n');
  console.log(`📊 总计: 11个受影响的网页 (共112个未索引页面)\n`);

  const results = [];

  for (let i = 0; i < unindexedUrls.length; i++) {
    const url = unindexedUrls[i];
    const crawlDate = crawlDates[i];

    console.log(`\n${i + 1}. 检查URL: ${url}`);
    console.log(`   上次抓取: ${crawlDate}`);

    const analysis = await analyzeUrl(url);
    results.push({
      url,
      crawlDate,
      ...analysis
    });

    // 添加延迟避免请求过快
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // 生成分析报告
  generateAnalysisReport(results);
}

async function analyzeUrl(url) {
  return new Promise((resolve) => {
    const request = https.request(url, { method: 'HEAD' }, (response) => {
      const status = response.statusCode;
      const contentType = response.headers['content-type'] || '';
      const contentLength = response.headers['content-length'] || 'unknown';

      // 分析URL类型
      let urlType = 'unknown';
      let issue = 'none';
      let priority = 'medium';

      if (url.includes('/icon?')) {
        urlType = 'icon';
        issue = 'dynamic-icon';
        priority = 'low';
      } else if (url.includes('.pdf')) {
        urlType = 'pdf';
        issue = 'pdf-not-indexed';
        priority = 'low';
      } else if (url.includes('/articles/')) {
        urlType = 'article';
        issue = 'content-quality';
        priority = 'high';
      } else if (url.includes('/scenario-solutions/')) {
        urlType = 'scenario';
        issue = 'thin-content';
        priority = 'medium';
      } else if (url.includes('/teen-health/')) {
        urlType = 'teen-health';
        issue = 'content-depth';
        priority = 'medium';
      }

      console.log(`   状态: ${status} ${response.statusMessage}`);
      console.log(`   类型: ${contentType}`);
      console.log(`   大小: ${contentLength} bytes`);
      console.log(`   分类: ${urlType} | 问题: ${issue} | 优先级: ${priority}`);

      resolve({
        status,
        contentType,
        contentLength,
        urlType,
        issue,
        priority
      });
    });

    request.on('error', (error) => {
      console.log(`   ❌ 错误: ${error.message}`);
      resolve({
        status: 'error',
        contentType: 'unknown',
        contentLength: 'unknown',
        urlType: 'error',
        issue: 'request-failed',
        priority: 'high'
      });
    });

    request.end();
  });
}

function generateAnalysisReport(results) {
  console.log('\n\n📋 分析报告总结\n');
  console.log('=' .repeat(60));

  // 按问题类型分组
  const issueGroups = {};
  results.forEach(result => {
    if (!issueGroups[result.issue]) {
      issueGroups[result.issue] = [];
    }
    issueGroups[result.issue].push(result);
  });

  console.log('\n🎯 问题分类统计:');
  Object.keys(issueGroups).forEach(issue => {
    const count = issueGroups[issue].length;
    const priority = issueGroups[issue][0].priority;
    console.log(`   ${issue}: ${count}个URL (优先级: ${priority})`);
  });

  console.log('\n📊 详细建议:\n');

  // 高优先级问题
  console.log('🔴 高优先级问题 (需要立即关注):');
  const highPriority = results.filter(r => r.priority === 'high');
  if (highPriority.length > 0) {
    highPriority.forEach(result => {
      console.log(`   • ${result.url}`);
      console.log(`     问题: ${getIssueDescription(result.issue)}`);
      console.log(`     建议: ${getRecommendation(result.issue)}`);
    });
  } else {
    console.log('   ✅ 无高优先级问题');
  }

  // 中优先级问题
  console.log('\n🟡 中优先级问题 (建议优化):');
  const mediumPriority = results.filter(r => r.priority === 'medium');
  if (mediumPriority.length > 0) {
    mediumPriority.forEach(result => {
      console.log(`   • ${result.urlType}: ${result.url.split('/').pop()}`);
    });
    console.log(`     建议: ${getRecommendation('content-depth')}`);
  }

  // 低优先级问题
  console.log('\n🟢 低优先级问题 (可接受):');
  const lowPriority = results.filter(r => r.priority === 'low');
  if (lowPriority.length > 0) {
    lowPriority.forEach(result => {
      console.log(`   • ${result.urlType}: ${result.issue}`);
    });
    console.log(`     说明: 这些问题是正常现象，无需修复`);
  }

  console.log('\n🎯 总体建议:');
  console.log('   1. 重点关注文章内容质量和深度');
  console.log('   2. 确保每个页面有足够的独特内容');
  console.log('   3. 添加内部链接提升页面权重');
  console.log('   4. 监控索引状态变化');
  console.log('   5. 考虑提交重要页面到Google Search Console');

  console.log('\n📈 预期结果:');
  console.log('   • 文章页面: 应该在1-2周内被索引');
  console.log('   • 场景页面: 需要增加内容深度');
  console.log('   • PDF/图标: 不索引是正常现象');
}

function getIssueDescription(issue) {
  const descriptions = {
    'content-quality': '内容质量可能不足或与其他页面重复',
    'thin-content': '页面内容较少，缺乏深度',
    'content-depth': '内容深度不够，需要更多详细信息',
    'pdf-not-indexed': 'PDF文件通常不被索引，这是正常现象',
    'dynamic-icon': '动态图标URL，不应该被索引',
    'request-failed': '请求失败，可能是临时问题'
  };
  return descriptions[issue] || '未知问题';
}

function getRecommendation(issue) {
  const recommendations = {
    'content-quality': '检查内容独特性，增加原创内容，优化关键词',
    'thin-content': '扩展页面内容，添加更多有价值的信息',
    'content-depth': '增加内容深度，添加详细说明和示例',
    'pdf-not-indexed': '无需处理，确保有对应的HTML版本',
    'dynamic-icon': '添加到robots.txt排除列表',
    'request-failed': '检查服务器状态和网络连接'
  };
  return recommendations[issue] || '需要进一步分析';
}

// 运行分析
analyzeUnindexedUrls().catch(console.error);
