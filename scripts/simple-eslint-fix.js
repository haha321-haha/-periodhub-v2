#!/usr/bin/env node

/**
 * 简化ESLint修复脚本
 * 基于验证结果，使用简单有效的方法
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 简化ESLint修复脚本启动...\n');

async function simpleEslintFix() {
  try {
    // 1. 检查当前ESLint状态
    console.log('📊 检查当前ESLint状态...');
    await checkEslintStatus();
    
    // 2. 运行自动修复
    console.log('🔧 运行ESLint自动修复...');
    await runEslintFix();
    
    // 3. 验证修复结果
    console.log('✅ 验证修复结果...');
    await validateFix();
    
    // 4. 生成修复报告
    console.log('📄 生成修复报告...');
    await generateFixReport();
    
    console.log('\n🎉 简化ESLint修复完成！');
    
  } catch (error) {
    console.error('❌ ESLint修复失败:', error.message);
    process.exit(1);
  }
}

async function checkEslintStatus() {
  try {
    // 使用.eslintignore排除备份目录
    execSync('npx eslint . --ext .ts,.tsx --format json > eslint-before.json', { stdio: 'inherit' });
    const beforeReport = JSON.parse(fs.readFileSync('eslint-before.json', 'utf8'));
    
    const stats = {
      files: beforeReport.length,
      errors: beforeReport.reduce((sum, file) => sum + file.errorCount, 0),
      warnings: beforeReport.reduce((sum, file) => sum + file.warningCount, 0)
    };
    
    console.log(`📊 修复前状态: ${stats.files}个文件, ${stats.errors}个错误, ${stats.warnings}个警告`);
    
    // 保存修复前状态
    fs.writeFileSync('eslint-before-stats.json', JSON.stringify(stats, null, 2));
    
  } catch (error) {
    console.log('⚠️  ESLint状态检查失败，继续执行...');
  }
}

async function runEslintFix() {
  try {
    // 运行ESLint自动修复
    execSync('npx eslint . --ext .ts,.tsx --fix', { stdio: 'inherit' });
    console.log('✅ ESLint自动修复完成');
    
  } catch (error) {
    console.log('⚠️  ESLint自动修复部分失败，继续执行...');
  }
}

async function validateFix() {
  try {
    // 检查构建
    console.log('🔨 验证构建...');
    execSync('npm run build', { stdio: 'pipe' });
    console.log('✅ 构建验证通过');
    
    // 检查类型
    console.log('🔍 验证类型检查...');
    execSync('npm run type-check', { stdio: 'pipe' });
    console.log('✅ 类型检查通过');
    
    // 检查ESLint状态
    console.log('📊 检查修复后ESLint状态...');
    execSync('npx eslint . --ext .ts,.tsx --format json > eslint-after.json', { stdio: 'pipe' });
    const afterReport = JSON.parse(fs.readFileSync('eslint-after.json', 'utf8'));
    
    const afterStats = {
      files: afterReport.length,
      errors: afterReport.reduce((sum, file) => sum + file.errorCount, 0),
      warnings: afterReport.reduce((sum, file) => sum + file.warningCount, 0)
    };
    
    console.log(`📊 修复后状态: ${afterStats.files}个文件, ${afterStats.errors}个错误, ${afterStats.warnings}个警告`);
    
    // 保存修复后状态
    fs.writeFileSync('eslint-after-stats.json', JSON.stringify(afterStats, null, 2));
    
    return afterStats;
    
  } catch (error) {
    console.log('❌ 验证失败:', error.message);
    throw error;
  }
}

async function generateFixReport() {
  try {
    const beforeStats = JSON.parse(fs.readFileSync('eslint-before-stats.json', 'utf8'));
    const afterStats = JSON.parse(fs.readFileSync('eslint-after-stats.json', 'utf8'));
    
    const report = {
      timestamp: new Date().toISOString(),
      before: beforeStats,
      after: afterStats,
      improvement: {
        errorsReduced: beforeStats.errors - afterStats.errors,
        warningsReduced: beforeStats.warnings - afterStats.warnings,
        errorReductionRate: Math.round(((beforeStats.errors - afterStats.errors) / beforeStats.errors) * 100),
        warningReductionRate: Math.round(((beforeStats.warnings - afterStats.warnings) / beforeStats.warnings) * 100)
      },
      summary: {
        success: afterStats.errors <= 10, // 允许少量错误
        buildPassed: true,
        typeCheckPassed: true
      }
    };
    
    fs.writeFileSync('simple-eslint-fix-report.json', JSON.stringify(report, null, 2));
    console.log('📄 修复报告已保存: simple-eslint-fix-report.json');
    
    // 显示修复摘要
    console.log('\n📊 修复摘要:');
    console.log(`错误减少: ${report.improvement.errorsReduced} (${report.improvement.errorReductionRate}%)`);
    console.log(`警告减少: ${report.improvement.warningsReduced} (${report.improvement.warningReductionRate}%)`);
    
    if (report.summary.success) {
      console.log('🎉 修复成功！代码质量达到可接受水平');
    } else {
      console.log('⚠️  修复部分成功，仍有少量错误需要手动处理');
    }
    
  } catch (error) {
    console.log('⚠️  报告生成失败:', error.message);
  }
}

// 运行修复
if (require.main === module) {
  simpleEslintFix();
}

module.exports = { simpleEslintFix };

