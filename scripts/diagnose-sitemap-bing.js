#!/usr/bin/env node

/**
 * Bing Sitemap诊断工具
 * 模拟不同爬虫访问sitemap，分析差异
 */

const https = require('https');
const http = require('http');

const SITEMAP_URL = 'https://www.periodhub.health/sitemap.xml';

// 不同搜索引擎的User-Agent
const USER_AGENTS = {
  bing: 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
  google: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  generic: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
};

function makeRequest(userAgent, label) {
  return new Promise((resolve, reject) => {
    const url = new URL(SITEMAP_URL);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: 'GET',
      headers: {
        'User-Agent': userAgent,
        'Accept': 'application/xml,text/xml,*/*',
        'Accept-Encoding': 'gzip, deflate',
        'Cache-Control': 'no-cache'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          label,
          statusCode: res.statusCode,
          headers: res.headers,
          contentLength: data.length,
          hasXmlDeclaration: data.includes('<?xml'),
          hasUrlsetTag: data.includes('<urlset'),
          urlCount: (data.match(/<url>/g) || []).length,
          firstFewLines: data.split('\n').slice(0, 10).join('\n'),
          contentType: res.headers['content-type']
        });
      });
    });

    req.on('error', (err) => {
      reject({ label, error: err.message });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject({ label, error: 'Request timeout' });
    });

    req.end();
  });
}

async function diagnoseSitemap() {
  console.log('🔍 开始诊断Bing Sitemap问题...\n');
  
  const tests = [
    { agent: USER_AGENTS.bing, label: 'Bing Bot' },
    { agent: USER_AGENTS.google, label: 'Google Bot' },
    { agent: USER_AGENTS.generic, label: 'Generic Browser' }
  ];

  for (const test of tests) {
    try {
      console.log(`📡 测试 ${test.label}...`);
      const result = await makeRequest(test.agent, test.label);
      
      console.log(`✅ ${result.label} 结果:`);
      console.log(`   状态码: ${result.statusCode}`);
      console.log(`   Content-Type: ${result.contentType}`);
      console.log(`   内容长度: ${result.contentLength} bytes`);
      console.log(`   包含XML声明: ${result.hasXmlDeclaration}`);
      console.log(`   包含urlset标签: ${result.hasUrlsetTag}`);
      console.log(`   URL数量: ${result.urlCount}`);
      
      if (result.contentLength < 100) {
        console.log(`⚠️  内容异常短，前几行:`);
        console.log(result.firstFewLines);
      }
      
      console.log('');
      
    } catch (error) {
      console.log(`❌ ${error.label} 失败: ${error.error}\n`);
    }
  }

  // 额外测试：检查robots.txt
  console.log('🤖 检查 robots.txt...');
  try {
    const robotsResult = await makeRequest(USER_AGENTS.bing, 'Robots.txt');
    console.log(`Robots.txt 状态: ${robotsResult.statusCode}`);
    if (robotsResult.contentLength > 0) {
      console.log('Robots.txt 内容:');
      console.log(robotsResult.firstFewLines);
    }
  } catch (error) {
    console.log(`❌ Robots.txt 检查失败: ${error.error}`);
  }

  console.log('\n📋 诊断完成！');
  console.log('\n💡 建议检查项目:');
  console.log('1. 确认所有User-Agent都返回相同内容');
  console.log('2. 检查Content-Type是否为application/xml或text/xml');
  console.log('3. 验证XML格式是否正确');
  console.log('4. 确认没有服务器端缓存问题');
}

// 运行诊断
diagnoseSitemap().catch(console.error);