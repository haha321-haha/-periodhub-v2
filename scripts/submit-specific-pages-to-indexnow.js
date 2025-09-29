#!/usr/bin/env node

/**
 * 提交特定页面到IndexNow
 * 解决Bing Webmaster Tools中未提交的页面问题
 */

const INDEXNOW_KEY = 'a3f202e9872f45238294db525b233bf5';
const BASE_URL = 'https://www.periodhub.health';
const API_ENDPOINT = 'https://api.indexnow.org/indexnow';

// 需要提交的页面列表
const urlsToSubmit = [
  'https://www.periodhub.health/zh/interactive-tools/workplace-wellness',
  'https://www.periodhub.health/en/interactive-tools/workplace-wellness',
  'https://www.periodhub.health/zh/interactive-tools/period-pain-impact-calculator',
  'https://www.periodhub.health/en/interactive-tools/period-pain-impact-calculator',
  'https://www.periodhub.health/en/interactive-tools/nutrition-recommendation-generator',
  'https://www.periodhub.health/zh/interactive-tools/nutrition-recommendation-generator',
  'https://www.periodhub.health/en/scenario-solutions/partnerCommunication',
  'https://www.periodhub.health/zh/scenario-solutions/partnerCommunication'
];

// 提交单个URL到IndexNow
async function submitToIndexNow(urls) {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        host: 'periodhub.health',
        key: INDEXNOW_KEY,
        urlList: urls
      })
    });

    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// 主函数
async function main() {
  console.log('🔍 检查特定页面的IndexNow提交状态...');
  console.log(`📋 需要检查的页面数量: ${urlsToSubmit.length}`);
  
  urlsToSubmit.forEach((url, index) => {
    console.log(`  ${index + 1}. ${url}`);
  });
  
  console.log('\n📤 开始提交到IndexNow...');
  const result = await submitToIndexNow(urlsToSubmit);
  
  if (result.success) {
    console.log('✅ 所有页面已成功提交到IndexNow！');
    console.log(`📊 状态码: ${result.status}`);
    console.log(`📄 提交页面数: ${urlsToSubmit.length}`);
    
    console.log('\n🎯 提交的页面:');
    urlsToSubmit.forEach((url, index) => {
      console.log(`  ✅ ${index + 1}. ${url}`);
    });
    
    console.log('\n💡 建议:');
    console.log('  - 等待24-48小时后检查Bing Webmaster Tools状态');
    console.log('  - 这些页面应该会从"未提交"列表中移除');
    console.log('  - 搜索引擎将更快发现和索引这些页面');
    
  } else {
    console.log('❌ IndexNow提交失败');
    console.log(`错误: ${result.error || result.statusText}`);
    console.log(`状态码: ${result.status}`);
  }
}

// 运行脚本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { submitToIndexNow };
