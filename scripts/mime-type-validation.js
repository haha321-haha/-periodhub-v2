#!/usr/bin/env node

/**
 * MIME类型验证脚本
 * 用于检测和修复静态资源的MIME类型问题
 */

const fs = require('fs');
const path = require('path');

// MIME类型配置
const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

class MimeTypeValidator {
  constructor() {
    this.issues = [];
    this.fixes = [];
  }

  // 验证静态资源MIME类型
  validateStaticAssets() {
    console.log('🔍 验证静态资源MIME类型...');
    
    const staticDir = path.join(__dirname, '../.next/static');
    if (!fs.existsSync(staticDir)) {
      console.log('⚠️ 静态资源目录不存在，请先运行构建');
      return;
    }

    this.scanDirectory(staticDir);
    
    console.log(`📊 扫描完成: 发现 ${this.issues.length} 个问题`);
    return this.issues;
  }

  // 扫描目录
  scanDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        this.scanDirectory(itemPath);
      } else {
        this.validateFile(itemPath);
      }
    });
  }

  // 验证单个文件
  validateFile(filePath) {
    const ext = path.extname(filePath);
    const expectedMimeType = MIME_TYPES[ext];
    
    if (!expectedMimeType) {
      return; // 跳过未知文件类型
    }

    // 检查文件内容
    const content = fs.readFileSync(filePath, 'utf8');
    const isTextFile = this.isTextFile(content);
    
    if (ext === '.css' && !isTextFile) {
      this.issues.push({
        file: filePath,
        issue: 'CSS文件内容异常',
        expected: expectedMimeType,
        actual: 'binary content'
      });
    }
  }

  // 判断是否为文本文件
  isTextFile(content) {
    try {
      // 尝试解码为UTF-8
      Buffer.from(content, 'utf8');
      return true;
    } catch (error) {
      return false;
    }
  }

  // 生成修复建议
  generateFixSuggestions() {
    const suggestions = [];
    
    if (this.issues.length === 0) {
      suggestions.push('✅ 所有静态资源MIME类型正确');
      return suggestions;
    }

    suggestions.push('🔧 MIME类型修复建议:');
    
    this.issues.forEach(issue => {
      suggestions.push(`   - ${issue.file}: ${issue.issue}`);
      suggestions.push(`     期望: ${issue.expected}`);
      suggestions.push(`     实际: ${issue.actual}`);
    });

    suggestions.push('');
    suggestions.push('💡 解决方案:');
    suggestions.push('   1. 检查Next.js headers配置');
    suggestions.push('   2. 验证服务器MIME类型配置');
    suggestions.push('   3. 检查CDN或代理服务器设置');
    suggestions.push('   4. 重新构建项目');

    return suggestions;
  }

  // 验证Next.js配置
  validateNextConfig() {
    console.log('🔍 验证Next.js配置...');
    
    const configPath = path.join(__dirname, '../next.config.js');
    if (!fs.existsSync(configPath)) {
      console.log('❌ next.config.js 不存在');
      return false;
    }

    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // 检查MIME类型配置
    const hasCssMimeType = configContent.includes('text/css');
    const hasJsMimeType = configContent.includes('application/javascript');
    
    console.log(`   CSS MIME类型配置: ${hasCssMimeType ? '✅' : '❌'}`);
    console.log(`   JS MIME类型配置: ${hasJsMimeType ? '✅' : '❌'}`);
    
    return hasCssMimeType && hasJsMimeType;
  }

  // 生成报告
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      issues: this.issues,
      nextConfigValid: this.validateNextConfig(),
      suggestions: this.generateFixSuggestions(),
      summary: {
        totalIssues: this.issues.length,
        criticalIssues: this.issues.filter(i => i.issue.includes('CSS')).length,
        configValid: this.validateNextConfig()
      }
    };

    return report;
  }

  // 保存报告
  saveReport(report) {
    const reportDir = path.join(__dirname, 'reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const filename = `mime-type-validation-report-${Date.now()}.json`;
    const filepath = path.join(reportDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
    console.log(`📊 报告已保存: ${filepath}`);
    
    return filepath;
  }
}

// 主验证函数
async function runMimeTypeValidation() {
  console.log('🚀 开始MIME类型验证...\n');

  const validator = new MimeTypeValidator();

  // 验证静态资源
  validator.validateStaticAssets();

  // 验证Next.js配置
  const configValid = validator.validateNextConfig();

  // 生成报告
  console.log('\n📊 生成验证报告...');
  const report = validator.generateReport();
  
  console.log('\n📈 验证结果摘要:');
  console.log(`   总问题数: ${report.summary.totalIssues}`);
  console.log(`   关键问题: ${report.summary.criticalIssues}`);
  console.log(`   配置有效: ${report.summary.configValid ? '✅' : '❌'}`);

  console.log('\n💡 修复建议:');
  report.suggestions.forEach(suggestion => console.log(`   ${suggestion}`));

  // 保存报告
  const reportPath = validator.saveReport(report);
  
  console.log(`\n✅ MIME类型验证完成！报告已保存到: ${reportPath}`);
  
  return report;
}

// 如果直接运行此脚本
if (require.main === module) {
  runMimeTypeValidation().catch(console.error);
}

module.exports = { runMimeTypeValidation, MimeTypeValidator };
