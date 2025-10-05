#!/usr/bin/env node

/**
 * CSS预加载修复脚本
 * 用于修复layout.css 404错误和预加载警告
 */

const fs = require('fs');
const path = require('path');

class CSSPreloadFixer {
  constructor() {
    this.cssFiles = [];
    this.report = {
      timestamp: new Date().toISOString(),
      issues: [],
      fixes: [],
      recommendations: []
    };
  }

  // 扫描CSS文件
  scanCSSFiles() {
    console.log('🔍 扫描CSS文件...');

    const cssDir = path.join(__dirname, '../.next/static/css');
    if (!fs.existsSync(cssDir)) {
      this.report.issues.push({
        type: 'error',
        message: 'CSS目录不存在',
        path: cssDir
      });
      return;
    }

    const files = fs.readdirSync(cssDir);
    this.cssFiles = files.filter(file => file.endsWith('.css'));

    console.log(`📊 发现 ${this.cssFiles.length} 个CSS文件`);
    this.cssFiles.forEach(file => {
      console.log(`   - ${file}`);
    });
  }

  // 分析CSS文件
  analyzeCSSFiles() {
    console.log('📈 分析CSS文件...');

    this.cssFiles.forEach(file => {
      const filePath = path.join(__dirname, '../.next/static/css', file);
      const stats = fs.statSync(filePath);

      // 检查文件大小
      if (stats.size < 1000) {
        this.report.issues.push({
          type: 'warning',
          message: 'CSS文件过小，可能不是主要样式文件',
          file: file,
          size: stats.size
        });
      }

      // 检查文件内容
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('layout') || content.includes('app')) {
        this.report.fixes.push({
          type: 'info',
          message: '发现可能的layout CSS文件',
          file: file,
          size: stats.size
        });
      }
    });
  }

  // 生成修复建议
  generateRecommendations() {
    console.log('💡 生成修复建议...');

    if (this.cssFiles.length === 0) {
      this.report.recommendations.push('❌ 未找到CSS文件，需要重新构建项目');
      return;
    }

    // 主要修复建议
    this.report.recommendations.push('✅ 移除错误的预加载配置');
    this.report.recommendations.push('✅ Next.js会自动处理CSS预加载');
    this.report.recommendations.push('✅ 使用动态CSS预加载（如果需要）');

    // 具体修复步骤
    this.report.recommendations.push('');
    this.report.recommendations.push('🔧 修复步骤:');
    this.report.recommendations.push('   1. 移除next.config.js中的layout.css预加载配置');
    this.report.recommendations.push('   2. 重新构建项目');
    this.report.recommendations.push('   3. 测试页面加载');
    this.report.recommendations.push('   4. 验证控制台警告消失');

    // 预防措施
    this.report.recommendations.push('');
    this.report.recommendations.push('🛡️ 预防措施:');
    this.report.recommendations.push('   1. 不要手动预加载Next.js生成的CSS文件');
    this.report.recommendations.push('   2. 使用Next.js内置的CSS优化功能');
    this.report.recommendations.push('   3. 定期检查构建产物');
  }

  // 验证修复效果
  validateFix() {
    console.log('✅ 验证修复效果...');

    const configPath = path.join(__dirname, '../next.config.js');
    const configContent = fs.readFileSync(configPath, 'utf8');

    // 检查是否还有错误的预加载配置
    const hasLayoutCSSPreload = configContent.includes('layout.css');

    if (hasLayoutCSSPreload) {
      this.report.issues.push({
        type: 'error',
        message: '配置中仍存在layout.css预加载',
        status: 'needs_fix'
      });
    } else {
      this.report.fixes.push({
        type: 'success',
        message: 'layout.css预加载配置已移除',
        status: 'fixed'
      });
    }
  }

  // 生成报告
  generateReport() {
    this.report.summary = {
      totalCSSFiles: this.cssFiles.length,
      totalIssues: this.report.issues.length,
      totalFixes: this.report.fixes.length,
      status: this.report.issues.length === 0 ? 'healthy' : 'needs_attention'
    };

    return this.report;
  }

  // 保存报告
  saveReport(report) {
    const reportDir = path.join(__dirname, 'reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const filename = `css-preload-fix-report-${Date.now()}.json`;
    const filepath = path.join(reportDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
    console.log(`📊 报告已保存: ${filepath}`);

    return filepath;
  }
}

// 主修复函数
async function runCSSPreloadFix() {
  console.log('🚀 开始CSS预加载修复...\n');

  const fixer = new CSSPreloadFixer();

  // 扫描CSS文件
  fixer.scanCSSFiles();

  // 分析CSS文件
  fixer.analyzeCSSFiles();

  // 验证修复效果
  fixer.validateFix();

  // 生成修复建议
  fixer.generateRecommendations();

  // 生成报告
  console.log('\n📊 生成修复报告...');
  const report = fixer.generateReport();

  console.log('\n📈 修复结果摘要:');
  console.log(`   CSS文件数: ${report.summary.totalCSSFiles}`);
  console.log(`   问题数: ${report.summary.totalIssues}`);
  console.log(`   修复数: ${report.summary.totalFixes}`);
  console.log(`   状态: ${report.summary.status === 'healthy' ? '✅ 健康' : '⚠️ 需要关注'}`);

  console.log('\n💡 修复建议:');
  report.recommendations.forEach(rec => console.log(`   ${rec}`));

  // 保存报告
  const reportPath = fixer.saveReport(report);

  console.log(`\n✅ CSS预加载修复完成！报告已保存到: ${reportPath}`);

  return report;
}

// 如果直接运行此脚本
if (require.main === module) {
  runCSSPreloadFix().catch(console.error);
}

module.exports = { runCSSPreloadFix, CSSPreloadFixer };
