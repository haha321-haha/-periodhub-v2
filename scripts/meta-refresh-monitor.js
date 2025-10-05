#!/usr/bin/env node

/**
 * Meta Refresh 修复监控脚本
 * 用于验证重定向修复效果和监控 SEO 状态
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://www.periodhub.health',
  testUrls: [
    '/articles',
    '/zh/articles',
    '/en/articles'
  ],
  outputFile: 'reports/meta-refresh-fix-report.json'
};

/**
 * 检查 URL 是否包含 Meta Refresh 标记
 */
async function checkMetaRefresh(url) {
  return new Promise((resolve) => {
    const fullUrl = `${CONFIG.baseUrl}${url}`;
    console.log(`🔍 检查 URL: ${fullUrl}`);

    https.get(fullUrl, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const hasMetaRefresh = /<meta[^>]*http-equiv\s*=\s*["']refresh["'][^>]*>/i.test(data);
        const hasRefreshRedirect = /<meta[^>]*content\s*=\s*["'][^"']*url\s*=/i.test(data);

        resolve({
          url: fullUrl,
          statusCode: res.statusCode,
          hasMetaRefresh,
          hasRefreshRedirect,
          hasAnyRefresh: hasMetaRefresh || hasRefreshRedirect,
          redirectLocation: res.headers.location || null,
          contentLength: data.length,
          timestamp: new Date().toISOString()
        });
      });
    }).on('error', (error) => {
      console.error(`❌ 检查失败: ${fullUrl}`, error.message);
      resolve({
        url: fullUrl,
        statusCode: 0,
        hasMetaRefresh: false,
        hasRefreshRedirect: false,
        hasAnyRefresh: false,
        redirectLocation: null,
        contentLength: 0,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    });
  });
}

/**
 * 生成 SEO 验证报告
 */
function generateSEOReport(results) {
  const report = {
    summary: {
      totalUrls: results.length,
      urlsWithMetaRefresh: results.filter(r => r.hasMetaRefresh).length,
      urlsWithRefreshRedirect: results.filter(r => r.hasRefreshRedirect).length,
      urlsWithAnyRefresh: results.filter(r => r.hasAnyRefresh).length,
      successfulRedirects: results.filter(r => r.redirectLocation).length,
      errors: results.filter(r => r.error).length,
      timestamp: new Date().toISOString()
    },
    details: results,
    recommendations: []
  };

  // 生成建议
  if (report.summary.urlsWithAnyRefresh > 0) {
    report.recommendations.push({
      type: 'warning',
      message: '发现 Meta Refresh 标记，需要进一步检查',
      affectedUrls: results.filter(r => r.hasAnyRefresh).map(r => r.url)
    });
  }

  if (report.summary.successfulRedirects > 0) {
    report.recommendations.push({
      type: 'info',
      message: '重定向工作正常',
      redirects: results.filter(r => r.redirectLocation).map(r => ({
        from: r.url,
        to: r.redirectLocation
      }))
    });
  }

  if (report.summary.errors > 0) {
    report.recommendations.push({
      type: 'error',
      message: '发现访问错误，需要检查服务器状态',
      errors: results.filter(r => r.error).map(r => ({
        url: r.url,
        error: r.error
      }))
    });
  }

  return report;
}

/**
 * 主执行函数
 */
async function main() {
  console.log('🚀 开始 Meta Refresh 修复验证...\n');

  const results = [];

  for (const url of CONFIG.testUrls) {
    const result = await checkMetaRefresh(url);
    results.push(result);

    // 显示结果
    if (result.error) {
      console.log(`❌ ${url}: 错误 - ${result.error}`);
    } else if (result.hasAnyRefresh) {
      console.log(`⚠️  ${url}: 发现 Meta Refresh 标记`);
    } else if (result.redirectLocation) {
      console.log(`✅ ${url}: 重定向到 ${result.redirectLocation}`);
    } else {
      console.log(`✅ ${url}: 正常访问 (${result.statusCode})`);
    }

    // 避免请求过于频繁
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // 生成报告
  const report = generateSEOReport(results);

  // 确保输出目录存在
  const outputDir = path.dirname(CONFIG.outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 保存报告
  fs.writeFileSync(CONFIG.outputFile, JSON.stringify(report, null, 2));

  console.log('\n📊 验证完成！');
  console.log(`📄 报告已保存到: ${CONFIG.outputFile}`);
  console.log(`\n📈 统计信息:`);
  console.log(`   - 总 URL 数: ${report.summary.totalUrls}`);
  console.log(`   - 发现 Meta Refresh: ${report.summary.urlsWithAnyRefresh}`);
  console.log(`   - 成功重定向: ${report.summary.successfulRedirects}`);
  console.log(`   - 访问错误: ${report.summary.errors}`);

  if (report.recommendations.length > 0) {
    console.log(`\n💡 建议:`);
    report.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec.message}`);
    });
  }

  // 返回退出码
  process.exit(report.summary.urlsWithAnyRefresh > 0 ? 1 : 0);
}

// 执行
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { checkMetaRefresh, generateSEOReport };
