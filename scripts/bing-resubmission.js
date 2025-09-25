#!/usr/bin/env node

/**
 * Bing Webmaster Tools 重新提交脚本
 * 用于向 Bing 重新提交修复后的 URL
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  bingApiUrl: 'https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch',
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://www.periodhub.health',
  urlsToResubmit: [
    `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.periodhub.health'}/articles`,
    `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.periodhub.health'}/zh/articles`,
    `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.periodhub.health'}/en/articles`
  ],
  outputFile: 'reports/bing-resubmission-report.json'
};

/**
 * 向 Bing 提交 URL
 */
async function submitToBing(urls, apiKey) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      siteUrl: CONFIG.siteUrl,
      urlList: urls.map(url => ({ url }))
    });

    const options = {
      hostname: 'ssl.bing.com',
      path: '/webmaster/api.svc/json/SubmitUrlbatch',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': `Bearer ${apiKey}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({
            success: res.statusCode === 200,
            statusCode: res.statusCode,
            response: response,
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          reject(new Error(`解析响应失败: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`请求失败: ${error.message}`));
    });

    req.write(postData);
    req.end();
  });
}

/**
 * 生成重新提交报告
 */
function generateResubmissionReport(results) {
  return {
    summary: {
      totalUrls: CONFIG.urlsToResubmit.length,
      successfulSubmissions: results.filter(r => r.success).length,
      failedSubmissions: results.filter(r => !r.success).length,
      timestamp: new Date().toISOString()
    },
    details: results,
    nextSteps: [
      '等待 24-48 小时让 Bing 重新抓取页面',
      '在 Bing Webmaster Tools 中检查 "URL 检查" 工具',
      '监控 "网站扫描" 中的 Meta Refresh 警告是否消失',
      '如果问题持续，考虑联系 Bing 支持'
    ],
    monitoring: {
      bingWebmasterTools: 'https://www.bing.com/webmasters',
      urlInspection: 'https://www.bing.com/webmasters/tools/url-inspection',
      siteScan: 'https://www.bing.com/webmasters/tools/site-scan'
    }
  };
}

/**
 * 主执行函数
 */
async function main() {
  console.log('🚀 开始向 Bing Webmaster Tools 重新提交 URL...\n');
  
  // 检查 API Key
  const apiKey = process.env.BING_API_KEY;
  if (!apiKey) {
    console.log('⚠️  未找到 BING_API_KEY 环境变量');
    console.log('📝 请设置 Bing Webmaster Tools API Key:');
    console.log('   export BING_API_KEY="your_api_key_here"');
    console.log('\n💡 或者手动在 Bing Webmaster Tools 中重新提交以下 URL:');
    CONFIG.urlsToResubmit.forEach((url, index) => {
      console.log(`   ${index + 1}. ${url}`);
    });
    
    // 生成手动提交指南
    const manualGuide = {
      message: 'Bing API Key 未设置，请手动重新提交',
      urls: CONFIG.urlsToResubmit,
      steps: [
        '访问 Bing Webmaster Tools',
        '选择您的网站',
        '进入 "URL 提交" 页面',
        '逐个提交上述 URL',
        '等待 24-48 小时重新抓取'
      ],
      timestamp: new Date().toISOString()
    };
    
    const outputDir = path.dirname(CONFIG.outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(CONFIG.outputFile, JSON.stringify(manualGuide, null, 2));
    console.log(`\n📄 手动提交指南已保存到: ${CONFIG.outputFile}`);
    process.exit(0);
  }
  
  const results = [];
  
  try {
    console.log(`📤 提交 ${CONFIG.urlsToResubmit.length} 个 URL 到 Bing...`);
    
    const result = await submitToBing(CONFIG.urlsToResubmit, apiKey);
    results.push(result);
    
    if (result.success) {
      console.log('✅ 成功提交到 Bing Webmaster Tools');
      console.log(`📊 响应: ${JSON.stringify(result.response, null, 2)}`);
    } else {
      console.log(`❌ 提交失败 (状态码: ${result.statusCode})`);
      console.log(`📊 响应: ${JSON.stringify(result.response, null, 2)}`);
    }
    
  } catch (error) {
    console.error('❌ 提交过程中发生错误:', error.message);
    results.push({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
  
  // 生成报告
  const report = generateResubmissionReport(results);
  
  // 确保输出目录存在
  const outputDir = path.dirname(CONFIG.outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // 保存报告
  fs.writeFileSync(CONFIG.outputFile, JSON.stringify(report, null, 2));
  
  console.log('\n📊 重新提交完成！');
  console.log(`📄 报告已保存到: ${CONFIG.outputFile}`);
  console.log(`\n📈 统计信息:`);
  console.log(`   - 总 URL 数: ${report.summary.totalUrls}`);
  console.log(`   - 成功提交: ${report.summary.successfulSubmissions}`);
  console.log(`   - 失败提交: ${report.summary.failedSubmissions}`);
  
  console.log(`\n📋 后续步骤:`);
  report.nextSteps.forEach((step, index) => {
    console.log(`   ${index + 1}. ${step}`);
  });
  
  console.log(`\n🔗 监控链接:`);
  console.log(`   - Bing Webmaster Tools: ${report.monitoring.bingWebmasterTools}`);
  console.log(`   - URL 检查: ${report.monitoring.urlInspection}`);
  console.log(`   - 网站扫描: ${report.monitoring.siteScan}`);
}

// 执行
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { submitToBing, generateResubmissionReport };
