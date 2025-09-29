#!/usr/bin/env node

/**
 * 批量提交PDF文件到IndexNow
 * 解决Bing Webmaster Tools中的IndexNow提交问题
 */

const fs = require('fs');
const path = require('path');

// IndexNow配置
const INDEXNOW_KEY = 'a3f202e9872f45238294db525b233bf5';
const BASE_URL = 'https://www.periodhub.health';
const API_ENDPOINT = 'https://api.indexnow.org/indexnow';

// 获取所有PDF文件
function getAllPdfFiles() {
  const downloadsDir = path.resolve(process.cwd(), 'public/downloads');
  const files = fs.readdirSync(downloadsDir);
  
  return files
    .filter(file => file.endsWith('.pdf'))
    .map(file => `${BASE_URL}/downloads/${file}`);
}

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

// 批量提交（每批10个URL）
async function batchSubmit(urls, batchSize = 10) {
  const results = [];
  
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    console.log(`📤 提交批次 ${Math.floor(i/batchSize) + 1}: ${batch.length} 个URL`);
    
    const result = await submitToIndexNow(batch);
    results.push({
      batch: Math.floor(i/batchSize) + 1,
      urls: batch,
      result
    });
    
    // 避免请求过于频繁
    if (i + batchSize < urls.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}

// 主函数
async function main() {
  console.log('🚀 开始批量提交PDF文件到IndexNow...');
  
  const pdfUrls = getAllPdfFiles();
  console.log(`📋 发现 ${pdfUrls.length} 个PDF文件:`);
  pdfUrls.forEach((url, index) => {
    console.log(`  ${index + 1}. ${url}`);
  });
  
  console.log('\n📤 开始提交到IndexNow...');
  const results = await batchSubmit(pdfUrls);
  
  // 统计结果
  const successful = results.filter(r => r.result.success).length;
  const failed = results.filter(r => !r.result.success).length;
  
  console.log('\n📊 提交结果统计:');
  console.log(`✅ 成功批次: ${successful}`);
  console.log(`❌ 失败批次: ${failed}`);
  console.log(`📄 总文件数: ${pdfUrls.length}`);
  
  // 显示详细结果
  results.forEach(({ batch, urls, result }) => {
    if (result.success) {
      console.log(`✅ 批次 ${batch}: 成功提交 ${urls.length} 个URL`);
    } else {
      console.log(`❌ 批次 ${batch}: 提交失败 - ${result.error || result.statusText}`);
    }
  });
  
  // 生成报告
  const report = {
    timestamp: new Date().toISOString(),
    totalFiles: pdfUrls.length,
    successfulBatches: successful,
    failedBatches: failed,
    results: results.map(({ batch, urls, result }) => ({
      batch,
      urlCount: urls.length,
      success: result.success,
      status: result.status,
      error: result.error
    }))
  };
  
  const reportPath = path.resolve(process.cwd(), 'reports/indexnow-submission-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 详细报告已保存: ${reportPath}`);
  
  if (failed === 0) {
    console.log('\n🎉 所有PDF文件已成功提交到IndexNow！');
    console.log('💡 建议: 等待24-48小时后检查Bing Webmaster Tools中的IndexNow状态');
  } else {
    console.log('\n⚠️  部分提交失败，请检查网络连接和API密钥');
  }
}

// 运行脚本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { getAllPdfFiles, submitToIndexNow, batchSubmit };
