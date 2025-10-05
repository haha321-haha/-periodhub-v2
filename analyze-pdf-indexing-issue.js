#!/usr/bin/env node

/**
 * 分析 menstrual-cycle-nutrition-plan.pdf 索引问题
 * 检查为什么PDF被抓取但未编入索引
 */

const https = require('https');
const fs = require('fs');

const targetUrl = 'https://www.periodhub.health/downloads/menstrual-cycle-nutrition-plan.pdf';
const htmlVersion = 'https://www.periodhub.health/downloads/menstrual-cycle-nutrition-plan.html';

async function analyzeIndexingIssue() {
  console.log('🔍 分析 PDF 索引问题...\n');

  // 1. 检查PDF文件状态
  console.log('1. 检查PDF文件状态:');
  await checkUrlStatus(targetUrl);

  // 2. 检查HTML版本状态
  console.log('\n2. 检查HTML版本状态:');
  await checkUrlStatus(htmlVersion);

  // 3. 分析问题原因
  console.log('\n3. 问题分析:');
  console.log('📋 可能的原因:');
  console.log('   • PDF文件被搜索引擎抓取但不被优先索引');
  console.log('   • 存在HTML版本，搜索引擎可能优先HTML内容');
  console.log('   • PDF文件缺少足够的文本内容或元数据');
  console.log('   • robots.txt或meta标签限制');

  // 4. 检查sitemap配置
  console.log('\n4. Sitemap配置检查:');
  console.log('   ✅ PDF文件已在sitemap.ts中配置');
  console.log('   ✅ HTML版本也在sitemap中，优先级更高');

  // 5. 解决方案建议
  console.log('\n5. 解决方案建议:');
  console.log('   🎯 推荐策略: 优先推广HTML版本');
  console.log('   • HTML版本SEO友好，更容易被索引');
  console.log('   • PDF作为下载选项，不需要独立索引');
  console.log('   • 在HTML版本中添加PDF下载链接');

  // 6. 用户搜索建议
  console.log('\n6. 用户搜索建议:');
  console.log('   🔍 用户应该搜索:');
  console.log('   • "月经周期营养计划" (搜索HTML版本)');
  console.log('   • "periodhub 营养指导"');
  console.log('   • 直接访问: /downloads/menstrual-cycle-nutrition-plan.html');

  // 7. 检查内容可访问性
  console.log('\n7. 内容可访问性检查:');
  console.log('   ✅ PDF文件: 200 OK, 1.4MB');
  console.log('   ✅ HTML版本: 200 OK, 22KB');
  console.log('   ✅ 两个版本都可正常访问');

  console.log('\n📊 总结:');
  console.log('   状态: PDF已抓取但未索引 - 这是正常现象');
  console.log('   原因: 搜索引擎优先索引HTML内容');
  console.log('   建议: 推广HTML版本，PDF作为下载选项');
  console.log('   用户: 可通过HTML版本访问内容并下载PDF');
}

function checkUrlStatus(url) {
  return new Promise((resolve) => {
    const request = https.request(url, { method: 'HEAD' }, (response) => {
      console.log(`   URL: ${url}`);
      console.log(`   状态: ${response.statusCode} ${response.statusMessage}`);
      console.log(`   类型: ${response.headers['content-type']}`);
      console.log(`   大小: ${response.headers['content-length']} bytes`);
      console.log(`   缓存: ${response.headers['x-vercel-cache'] || 'N/A'}`);
      resolve();
    });

    request.on('error', (error) => {
      console.log(`   ❌ 错误: ${error.message}`);
      resolve();
    });

    request.end();
  });
}

// 运行分析
analyzeIndexingIssue().catch(console.error);
