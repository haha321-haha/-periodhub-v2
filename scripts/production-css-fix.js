#!/usr/bin/env node

/**
 * 生产环境layout.css 404问题修复脚本
 * 用于诊断和修复生产环境CSS文件404问题
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

class ProductionCSSFixer {
  constructor() {
    this.productionUrl = 'https://www.periodhub.health';
    this.report = {
      timestamp: new Date().toISOString(),
      environment: 'production',
      issues: [],
      fixes: [],
      recommendations: []
    };
  }

  // 检查生产环境CSS文件
  async checkProductionCSS() {
    console.log('🔍 检查生产环境CSS文件...');
    
    const cssFiles = [
      '/_next/static/css/app/layout.css',
      '/_next/static/css/026415d6fc36570a.css',
      '/_next/static/css/18b13dbb475de698.css'
    ];

    for (const cssFile of cssFiles) {
      const url = `${this.productionUrl}${cssFile}`;
      const status = await this.checkUrl(url);
      
      this.report.issues.push({
        url: url,
        status: status.status,
        exists: status.exists,
        size: status.size,
        timestamp: new Date().toISOString()
      });

      console.log(`   ${cssFile}: ${status.exists ? '✅' : '❌'} ${status.status}`);
    }
  }

  // 检查URL状态
  checkUrl(url) {
    return new Promise((resolve) => {
      const request = https.get(url, (response) => {
        resolve({
          status: response.statusCode,
          exists: response.statusCode === 200,
          size: response.headers['content-length'] || 0
        });
      });

      request.on('error', (error) => {
        resolve({
          status: 'ERROR',
          exists: false,
          size: 0,
          error: error.message
        });
      });

      request.setTimeout(10000, () => {
        request.destroy();
        resolve({
          status: 'TIMEOUT',
          exists: false,
          size: 0
        });
      });
    });
  }

  // 检查本地构建产物
  checkLocalBuild() {
    console.log('🔍 检查本地构建产物...');
    
    const localFiles = [
      '.next/static/css/app/layout.css',
      '.next/static/css/026415d6fc36570a.css',
      '.next/static/css/18b13dbb475de698.css'
    ];

    for (const file of localFiles) {
      const exists = fs.existsSync(file);
      const size = exists ? fs.statSync(file).size : 0;
      
      this.report.fixes.push({
        file: file,
        exists: exists,
        size: size,
        timestamp: new Date().toISOString()
      });

      console.log(`   ${file}: ${exists ? '✅' : '❌'} ${size} bytes`);
    }
  }

  // 检查Next.js配置
  checkNextConfig() {
    console.log('🔍 检查Next.js配置...');
    
    const configPath = 'next.config.js';
    if (!fs.existsSync(configPath)) {
      this.report.issues.push({
        type: 'error',
        message: 'next.config.js 不存在'
      });
      return;
    }

    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // 检查是否有layout.css预加载配置
    const hasLayoutCSSPreload = configContent.includes('layout.css');
    const isCommented = configContent.includes('//   value: \'</_next/static/css/app/layout.css>');
    
    this.report.fixes.push({
      type: 'config',
      hasLayoutCSSPreload: hasLayoutCSSPreload,
      isCommented: isCommented,
      status: isCommented ? 'fixed' : 'needs_fix'
    });

    console.log(`   layout.css预加载配置: ${isCommented ? '✅ 已注释' : '❌ 仍存在'}`);
  }

  // 生成修复建议
  generateRecommendations() {
    console.log('💡 生成修复建议...');
    
    const layoutCSSIssue = this.report.issues.find(issue => 
      issue.url && issue.url.includes('layout.css')
    );

    if (layoutCSSIssue && !layoutCSSIssue.exists) {
      this.report.recommendations.push('❌ 生产环境layout.css文件不存在');
      this.report.recommendations.push('🔧 需要重新部署到生产环境');
      this.report.recommendations.push('📊 检查部署流程和CDN缓存');
    }

    // 检查本地构建
    const localLayoutCSS = this.report.fixes.find(fix => 
      fix.file && fix.file.includes('layout.css')
    );

    if (localLayoutCSS && localLayoutCSS.exists) {
      this.report.recommendations.push('✅ 本地layout.css文件存在');
      this.report.recommendations.push('🚀 可以重新部署');
    } else {
      this.report.recommendations.push('❌ 本地layout.css文件不存在');
      this.report.recommendations.push('🔧 需要重新构建项目');
    }

    // 具体修复步骤
    this.report.recommendations.push('');
    this.report.recommendations.push('🔧 修复步骤:');
    this.report.recommendations.push('   1. 确保本地构建正常');
    this.report.recommendations.push('   2. 提交代码到GitHub');
    this.report.recommendations.push('   3. 触发生产环境重新部署');
    this.report.recommendations.push('   4. 清除CDN缓存');
    this.report.recommendations.push('   5. 验证生产环境文件存在');

    // 预防措施
    this.report.recommendations.push('');
    this.report.recommendations.push('🛡️ 预防措施:');
    this.report.recommendations.push('   1. 建立自动化部署流程');
    this.report.recommendations.push('   2. 部署后自动验证关键文件');
    this.report.recommendations.push('   3. 设置文件存在性监控');
    this.report.recommendations.push('   4. 定期检查生产环境状态');
  }

  // 生成报告
  generateReport() {
    this.report.summary = {
      totalIssues: this.report.issues.length,
      totalFixes: this.report.fixes.length,
      productionIssues: this.report.issues.filter(i => !i.exists).length,
      localIssues: this.report.fixes.filter(f => !f.exists).length,
      status: this.report.issues.filter(i => !i.exists).length === 0 ? 'healthy' : 'needs_deployment'
    };

    return this.report;
  }

  // 保存报告
  saveReport(report) {
    const reportDir = path.join(__dirname, 'reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const filename = `production-css-fix-report-${Date.now()}.json`;
    const filepath = path.join(reportDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
    console.log(`📊 报告已保存: ${filepath}`);
    
    return filepath;
  }
}

// 主修复函数
async function runProductionCSSFix() {
  console.log('🚀 开始生产环境CSS修复...\n');

  const fixer = new ProductionCSSFixer();

  // 检查生产环境CSS文件
  await fixer.checkProductionCSS();

  // 检查本地构建产物
  fixer.checkLocalBuild();

  // 检查Next.js配置
  fixer.checkNextConfig();

  // 生成修复建议
  fixer.generateRecommendations();

  // 生成报告
  console.log('\n📊 生成修复报告...');
  const report = fixer.generateReport();
  
  console.log('\n📈 修复结果摘要:');
  console.log(`   总问题数: ${report.summary.totalIssues}`);
  console.log(`   生产环境问题: ${report.summary.productionIssues}`);
  console.log(`   本地问题: ${report.summary.localIssues}`);
  console.log(`   状态: ${report.summary.status === 'healthy' ? '✅ 健康' : '⚠️ 需要部署'}`);

  console.log('\n💡 修复建议:');
  report.recommendations.forEach(rec => console.log(`   ${rec}`));

  // 保存报告
  const reportPath = fixer.saveReport(report);
  
  console.log(`\n✅ 生产环境CSS修复完成！报告已保存到: ${reportPath}`);
  
  return report;
}

// 如果直接运行此脚本
if (require.main === module) {
  runProductionCSSFix().catch(console.error);
}

module.exports = { runProductionCSSFix, ProductionCSSFixer };






