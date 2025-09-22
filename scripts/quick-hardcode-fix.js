#!/usr/bin/env node

/**
 * 快速硬编码修复脚本
 * 专门处理 Meta Refresh 修复后的硬编码问题
 */

const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://www.periodhub.health',
  filesToFix: [
    'app/seo-config.ts',
    'app/robots.ts',
    'app/[locale]/medical-disclaimer/page.tsx'
  ],
  outputFile: 'reports/quick-hardcode-fix-report.json'
};

/**
 * 修复文件中的硬编码URL
 */
function fixHardcodedUrls(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changes = 0;
    
    // 替换硬编码的域名
    const originalContent = content;
    content = content.replace(/https:\/\/www\.periodhub\.health/g, '${process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"}');
    
    // 计算变更数量
    changes = (originalContent.match(/https:\/\/www\.periodhub\.health/g) || []).length;
    
    if (changes > 0) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ 修复 ${filePath}: ${changes} 个硬编码URL`);
    } else {
      console.log(`ℹ️  ${filePath}: 无需修复`);
    }
    
    return {
      file: filePath,
      changes,
      success: true
    };
  } catch (error) {
    console.error(`❌ 修复失败 ${filePath}:`, error.message);
    return {
      file: filePath,
      changes: 0,
      success: false,
      error: error.message
    };
  }
}

/**
 * 生成修复报告
 */
function generateFixReport(results) {
  const totalChanges = results.reduce((sum, result) => sum + result.changes, 0);
  const successfulFixes = results.filter(r => r.success).length;
  const failedFixes = results.filter(r => !r.success).length;
  
  return {
    summary: {
      totalFiles: results.length,
      successfulFixes,
      failedFixes,
      totalChanges,
      timestamp: new Date().toISOString()
    },
    details: results,
    recommendations: [
      '设置环境变量 NEXT_PUBLIC_BASE_URL',
      '在部署时确保环境变量正确配置',
      '定期检查硬编码URL问题'
    ]
  };
}

/**
 * 主执行函数
 */
async function main() {
  console.log('🚀 开始快速硬编码修复...\n');
  
  const results = [];
  
  for (const filePath of CONFIG.filesToFix) {
    if (fs.existsSync(filePath)) {
      const result = fixHardcodedUrls(filePath);
      results.push(result);
    } else {
      console.log(`⚠️  文件不存在: ${filePath}`);
      results.push({
        file: filePath,
        changes: 0,
        success: false,
        error: '文件不存在'
      });
    }
  }
  
  // 生成报告
  const report = generateFixReport(results);
  
  // 确保输出目录存在
  const outputDir = path.dirname(CONFIG.outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // 保存报告
  fs.writeFileSync(CONFIG.outputFile, JSON.stringify(report, null, 2));
  
  console.log('\n📊 快速修复完成！');
  console.log(`📄 报告已保存到: ${CONFIG.outputFile}`);
  console.log(`\n📈 统计信息:`);
  console.log(`   - 处理文件数: ${report.summary.totalFiles}`);
  console.log(`   - 成功修复: ${report.summary.successfulFixes}`);
  console.log(`   - 失败修复: ${report.summary.failedFixes}`);
  console.log(`   - 总变更数: ${report.summary.totalChanges}`);
  
  if (report.recommendations.length > 0) {
    console.log(`\n💡 建议:`);
    report.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });
  }
  
  // 返回退出码
  process.exit(report.summary.failedFixes > 0 ? 1 : 0);
}

// 执行
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { fixHardcodedUrls, generateFixReport };

