#!/usr/bin/env node

/**
 * 检查重定向问题的URL状态
 */

const https = require('https');

const urlsToCheck = [
  'https://www.periodhub.health/zh/articles/long-term-healthy-lifestyle-guide',
  'https://www.periodhub.health/zh/articles/effective-herbal-tea-menstrual-pain',
  'https://www.periodhub.health/zh/assessment',
  'https://www.periodhub.health/zh/articles'
];

function checkUrl(url) {
  return new Promise((resolve) => {
    const req = https.request(url, { method: 'HEAD' }, (res) => {
      resolve({
        url,
        statusCode: res.statusCode,
        location: res.headers.location,
        hasRedirect: res.statusCode >= 300 && res.statusCode < 400,
        finalStatus: res.statusCode
      });
    });

    req.on('error', (err) => {
      resolve({
        url,
        error: err.message,
        statusCode: 'ERROR'
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        url,
        error: 'Timeout',
        statusCode: 'TIMEOUT'
      });
    });

    req.end();
  });
}

async function checkAllUrls() {
  console.log('🔍 检查重定向问题的URL状态...\n');

  for (const url of urlsToCheck) {
    try {
      const result = await checkUrl(url);

      console.log(`📋 URL: ${url}`);
      console.log(`   状态码: ${result.statusCode}`);

      if (result.hasRedirect) {
        console.log(`   ⚠️  重定向到: ${result.location}`);
        console.log(`   问题: 存在重定向`);
      } else if (result.statusCode === 200) {
        console.log(`   ✅ 状态: 正常`);
      } else if (result.error) {
        console.log(`   ❌ 错误: ${result.error}`);
      } else {
        console.log(`   ⚠️  状态: ${result.statusCode}`);
      }

      console.log('');

    } catch (error) {
      console.log(`❌ ${url} 检查失败: ${error.message}\n`);
    }
  }

  console.log('📊 检查完成！');
  console.log('\n💡 解决建议:');
  console.log('- 如果存在重定向，检查是否为必要的301重定向');
  console.log('- 确保重定向链不超过3跳');
  console.log('- 对于404错误，检查页面是否存在');
  console.log('- 更新sitemap中的URL为最终目标URL');
}

checkAllUrls().catch(console.error);
