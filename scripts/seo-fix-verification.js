#!/usr/bin/env node

/**
 * SEO修复验证脚本
 * 用于验证sitemap、robots.txt和PDF文件配置的正确性
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://www.periodhub.health',
  testPages: [
    '/en/articles/effective-herbal-tea-menstrual-pain',
    '/en/scenario-solutions/office',
    '/en/teen-health/development-pain',
    '/en/scenario-solutions/social',
    '/en/articles/when-to-seek-medical-care-comprehensive-guide',
    '/en/articles/period-friendly-recipes',
    '/en/articles/comprehensive-iud-guide',
    '/en/articles/comprehensive-medical-guide-to-dysmenorrhea',
    '/en/articles/anti-inflammatory-diet-period-pain'
  ],
  testPdfs: [
    '/downloads/menstrual-cycle-nutrition-plan.pdf',
    '/downloads/parent-communication-guide.pdf',
    '/downloads/healthy-habits-checklist.pdf'
  ],
  iconPages: [
    '/en/icon?9c1a5eaddb17b0ab'
  ]
};

// 工具函数
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'HEAD',
      timeout: 10000
    };

    const req = https.request(url, options, (res) => {
      resolve({
        status: res.statusCode,
        headers: res.headers,
        url: url
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

function checkSitemap() {
  return new Promise(async (resolve) => {
    console.log('🔍 检查sitemap.xml...');
    
    try {
      const response = await makeRequest(`${CONFIG.baseUrl}/sitemap.xml`);
      
      if (response.status === 200) {
        console.log('✅ Sitemap可访问');
        
        // 检查sitemap内容
        const sitemapContent = await fetch(`${CONFIG.baseUrl}/sitemap.xml`).then(r => r.text());
        
        // 检查PDF路径
        const pdfPaths = sitemapContent.match(/\/downloads\/[^"]*\.pdf/g) || [];
        const oldPdfPaths = sitemapContent.match(/\/pdf-files\/[^"]*\.pdf/g) || [];
        
        console.log(`📊 PDF文件统计:`);
        console.log(`   - 正确路径(/downloads/): ${pdfPaths.length}个`);
        console.log(`   - 错误路径(/pdf-files/): ${oldPdfPaths.length}个`);
        
        if (oldPdfPaths.length > 0) {
          console.log('⚠️  发现错误路径，需要修复sitemap.ts');
        } else {
          console.log('✅ PDF路径配置正确');
        }
        
        resolve({ success: true, pdfPaths, oldPdfPaths });
      } else {
        console.log(`❌ Sitemap访问失败: ${response.status}`);
        resolve({ success: false, error: `HTTP ${response.status}` });
      }
    } catch (error) {
      console.log(`❌ Sitemap检查失败: ${error.message}`);
      resolve({ success: false, error: error.message });
    }
  });
}

function checkRobots() {
  return new Promise(async (resolve) => {
    console.log('🔍 检查robots.txt...');
    
    try {
      const response = await makeRequest(`${CONFIG.baseUrl}/robots.txt`);
      
      if (response.status === 200) {
        console.log('✅ Robots.txt可访问');
        
        // 检查robots内容
        const robotsContent = await fetch(`${CONFIG.baseUrl}/robots.txt`).then(r => r.text());
        
        // 检查icon规则
        const iconRules = robotsContent.match(/Disallow:\s*\/icon/g) || [];
        const iconStarRules = robotsContent.match(/Disallow:\s*\/icon\*/g) || [];
        
        console.log(`📊 Robots.txt规则:`);
        console.log(`   - Icon规则: ${iconRules.length}个`);
        console.log(`   - Icon*规则: ${iconStarRules.length}个`);
        
        if (iconStarRules.length > 0) {
          console.log('⚠️  发现过于宽泛的/icon*规则，建议精确化');
        } else {
          console.log('✅ Icon规则配置合理');
        }
        
        resolve({ success: true, iconRules, iconStarRules });
      } else {
        console.log(`❌ Robots.txt访问失败: ${response.status}`);
        resolve({ success: false, error: `HTTP ${response.status}` });
      }
    } catch (error) {
      console.log(`❌ Robots.txt检查失败: ${error.message}`);
      resolve({ success: false, error: error.message });
    }
  });
}

function checkPages() {
  return new Promise(async (resolve) => {
    console.log('🔍 检查问题页面...');
    
    const results = [];
    
    for (const page of CONFIG.testPages) {
      try {
        const response = await makeRequest(`${CONFIG.baseUrl}${page}`);
        results.push({
          page,
          status: response.status,
          success: response.status === 200
        });
        
        if (response.status === 200) {
          console.log(`✅ ${page} - 可访问`);
        } else {
          console.log(`❌ ${page} - HTTP ${response.status}`);
        }
      } catch (error) {
        results.push({
          page,
          status: 'ERROR',
          success: false,
          error: error.message
        });
        console.log(`❌ ${page} - ${error.message}`);
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    console.log(`📊 页面检查结果: ${successCount}/${results.length} 可访问`);
    
    resolve({ success: true, results });
  });
}

function checkPdfs() {
  return new Promise(async (resolve) => {
    console.log('🔍 检查PDF文件...');
    
    const results = [];
    
    for (const pdf of CONFIG.testPdfs) {
      try {
        const response = await makeRequest(`${CONFIG.baseUrl}${pdf}`);
        results.push({
          pdf,
          status: response.status,
          success: response.status === 200
        });
        
        if (response.status === 200) {
          console.log(`✅ ${pdf} - 可访问`);
        } else {
          console.log(`❌ ${pdf} - HTTP ${response.status}`);
        }
      } catch (error) {
        results.push({
          pdf,
          status: 'ERROR',
          success: false,
          error: error.message
        });
        console.log(`❌ ${pdf} - ${error.message}`);
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    console.log(`📊 PDF检查结果: ${successCount}/${results.length} 可访问`);
    
    resolve({ success: true, results });
  });
}

function checkIconPages() {
  return new Promise(async (resolve) => {
    console.log('🔍 检查Icon页面...');
    
    const results = [];
    
    for (const iconPage of CONFIG.iconPages) {
      try {
        const response = await makeRequest(`${CONFIG.baseUrl}${iconPage}`);
        results.push({
          iconPage,
          status: response.status,
          success: response.status === 200
        });
        
        if (response.status === 200) {
          console.log(`✅ ${iconPage} - 可访问`);
        } else {
          console.log(`❌ ${iconPage} - HTTP ${response.status}`);
        }
      } catch (error) {
        results.push({
          iconPage,
          status: 'ERROR',
          success: false,
          error: error.message
        });
        console.log(`❌ ${iconPage} - ${error.message}`);
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    console.log(`📊 Icon页面检查结果: ${successCount}/${results.length} 可访问`);
    
    resolve({ success: true, results });
  });
}

// 生成报告
function generateReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    baseUrl: CONFIG.baseUrl,
    summary: {
      sitemap: results.sitemap.success ? 'PASS' : 'FAIL',
      robots: results.robots.success ? 'PASS' : 'FAIL',
      pages: results.pages.success ? 'PASS' : 'FAIL',
      pdfs: results.pdfs.success ? 'PASS' : 'FAIL',
      icons: results.icons.success ? 'PASS' : 'FAIL'
    },
    details: results
  };
  
  // 保存报告
  const reportPath = path.join(__dirname, '..', 'reports', `seo-verification-${Date.now()}.json`);
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`\n📋 验证报告已保存: ${reportPath}`);
  
  return report;
}

// 主函数
async function main() {
  console.log('🚀 开始SEO修复验证...\n');
  
  const results = {};
  
  // 执行所有检查
  results.sitemap = await checkSitemap();
  console.log('');
  
  results.robots = await checkRobots();
  console.log('');
  
  results.pages = await checkPages();
  console.log('');
  
  results.pdfs = await checkPdfs();
  console.log('');
  
  results.icons = await checkIconPages();
  console.log('');
  
  // 生成报告
  const report = generateReport(results);
  
  // 输出总结
  console.log('📊 验证总结:');
  console.log(`   Sitemap: ${report.summary.sitemap}`);
  console.log(`   Robots: ${report.summary.robots}`);
  console.log(`   Pages: ${report.summary.pages}`);
  console.log(`   PDFs: ${report.summary.pdfs}`);
  console.log(`   Icons: ${report.summary.icons}`);
  
  const allPassed = Object.values(report.summary).every(status => status === 'PASS');
  
  if (allPassed) {
    console.log('\n🎉 所有检查通过！SEO配置正常。');
  } else {
    console.log('\n⚠️  发现问题，请根据上述信息进行修复。');
  }
  
  console.log('\n✅ 验证完成！');
}

// 运行主函数
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, checkSitemap, checkRobots, checkPages, checkPdfs, checkIconPages };
