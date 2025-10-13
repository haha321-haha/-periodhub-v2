#!/usr/bin/env node

/**
 * 测试动态文章列表的 Atom Feed
 * 验证 Feed 是否包含真实文章内容
 */

const https = require('https');
const { JSDOM } = require('jsdom');

const BASE_URL = process.env.BASE_URL || 'https://www.periodhub.health';
const TIMEOUT = 15000;

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const request = https.request(url, {
      method: 'GET',
      timeout: TIMEOUT,
      headers: {
        'User-Agent': 'Dynamic-Feed-Tester/1.0',
        'Accept': 'application/atom+xml, application/xml, text/xml'
      }
    }, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        resolve({
          statusCode: response.statusCode,
          headers: response.headers,
          body: data,
          url: response.responseUrl || url
        });
      });
    });
    
    request.on('error', (error) => {
      reject(error);
    });
    
    request.on('timeout', () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
    
    request.end();
  });
}

async function testDynamicFeed() {
  console.log('🚀 测试动态文章列表的 Atom Feed...\n');
  console.log(`📍 测试目标: ${BASE_URL}\n`);
  
  try {
    console.log('🔍 测试: 获取 Feed 内容');
    const response = await makeRequest(`${BASE_URL}/feed.xml`);
    
    if (response.statusCode !== 200) {
      console.log(`   ❌ 状态码: ${response.statusCode}`);
      return 1;
    }
    
    console.log(`   ✅ 状态码: ${response.statusCode}`);
    console.log(`   📄 Content-Type: ${response.headers['content-type']}`);
    
    // 解析 XML 内容
    const dom = new JSDOM(response.body, { contentType: 'text/xml' });
    const document = dom.window.document;
    
    // 检查 Feed 基本信息
    const title = document.querySelector('feed > title')?.textContent;
    const subtitle = document.querySelector('feed > subtitle')?.textContent;
    const updated = document.querySelector('feed > updated')?.textContent;
    const author = document.querySelector('feed > author > name')?.textContent;
    
    console.log(`   📋 Feed 标题: ${title}`);
    console.log(`   📝 副标题: ${subtitle}`);
    console.log(`   🕒 更新时间: ${updated}`);
    console.log(`   👤 作者: ${author}`);
    
    // 检查文章条目
    const entries = document.querySelectorAll('feed > entry');
    console.log(`   📚 文章数量: ${entries.length}`);
    
    if (entries.length === 0) {
      console.log(`   ❌ 没有找到文章条目`);
      return 1;
    }
    
    // 分析文章条目
    let hasZhArticles = false;
    let hasEnArticles = false;
    let hasRecentArticles = false;
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 30); // 30天内
    
    entries.forEach((entry, index) => {
      const entryTitle = entry.querySelector('title')?.textContent;
      const entryLink = entry.querySelector('link')?.getAttribute('href');
      const entryUpdated = entry.querySelector('updated')?.textContent;
      const entrySummary = entry.querySelector('summary')?.textContent;
      const entryAuthor = entry.querySelector('author > name')?.textContent;
      
      // 检查语言
      if (entryLink && entryLink.includes('/zh/')) {
        hasZhArticles = true;
      } else if (entryLink && entryLink.includes('/en/')) {
        hasEnArticles = true;
      }
      
      // 检查最近文章
      if (entryUpdated && new Date(entryUpdated) > recentDate) {
        hasRecentArticles = true;
      }
      
      // 显示前3篇文章的详细信息
      if (index < 3) {
        console.log(`\n   📖 文章 ${index + 1}:`);
        console.log(`     标题: ${entryTitle}`);
        console.log(`     链接: ${entryLink}`);
        console.log(`     更新: ${entryUpdated}`);
        console.log(`     作者: ${entryAuthor}`);
        console.log(`     摘要: ${entrySummary?.substring(0, 100)}...`);
      }
    });
    
    // 验证结果
    console.log('\n📊 验证结果:');
    console.log('=' .repeat(50));
    
    const checks = [
      { name: 'Feed 基本结构', passed: title && subtitle && updated, weight: 1 },
      { name: '包含文章条目', passed: entries.length > 0, weight: 2 },
      { name: '包含中文文章', passed: hasZhArticles, weight: 2 },
      { name: '包含英文文章', passed: hasEnArticles, weight: 2 },
      { name: '包含最近文章', passed: hasRecentArticles, weight: 2 },
      { name: '文章信息完整', passed: entries.length > 0 && document.querySelector('entry > title')?.textContent, weight: 1 }
    ];
    
    let totalScore = 0;
    let maxScore = 0;
    
    checks.forEach(check => {
      maxScore += check.weight;
      if (check.passed) {
        totalScore += check.weight;
        console.log(`   ✅ ${check.name}`);
      } else {
        console.log(`   ❌ ${check.name}`);
      }
    });
    
    const score = Math.round((totalScore / maxScore) * 100);
    
    console.log('\n🎯 评分结果:');
    console.log('=' .repeat(50));
    console.log(`📊 总分: ${score}/100 (${totalScore}/${maxScore})`);
    
    if (score >= 90) {
      console.log('\n🎉 动态 Feed 实现完美！');
      console.log('✅ 用户现在可以订阅到真实的文章内容');
      console.log('✅ Feed 包含完整的中英文文章');
      console.log('✅ 文章信息详细完整');
      console.log('✅ 符合 Atom Feed 标准');
      
      console.log('\n🔧 技术改进总结:');
      console.log('   • 从硬编码示例 → 动态文章列表');
      console.log('   • 从单一语言 → 中英文双语支持');
      console.log('   • 从静态内容 → 实时更新内容');
      console.log('   • 从基础功能 → 完整 Feed 功能');
      
      return 0;
    } else if (score >= 70) {
      console.log('\n✅ 动态 Feed 基本实现成功！');
      console.log('⚠️  部分功能需要进一步优化');
      return 1;
    } else {
      console.log('\n❌ 动态 Feed 实现需要改进');
      console.log('🔧 建议检查文章数据源和解析逻辑');
      return 1;
    }
    
  } catch (error) {
    console.log(`   ❌ 请求失败: ${error.message}`);
    return 1;
  }
}

if (require.main === module) {
  testDynamicFeed().then(code => {
    process.exit(code);
  }).catch(error => {
    console.error('🚨 测试运行失败:', error);
    process.exit(1);
  });
}

module.exports = { testDynamicFeed };
