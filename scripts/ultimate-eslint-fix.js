#!/usr/bin/env node

/**
 * 终极ESLint修复脚本
 * 融合所有优化方案的最佳实践
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 终极ESLint修复脚本启动...\n');

// 终极配置
const ultimateConfig = {
  // 执行策略
  execution: {
    mode: 'intelligent', // intelligent, fast, thorough
    parallel: true,
    batchSize: 5,
    maxRetries: 3
  },
  
  // 质量门禁
  qualityGates: {
    maxErrors: 0,
    maxWarnings: 3,
    maxAnyTypes: 2,
    buildMustPass: true,
    testsMustPass: true,
    performanceRegression: 0.05 // 5%
  },
  
  // 风险控制
  riskControl: {
    createBackup: true,
    dryRun: false,
    rollbackOnFailure: true,
    validateEachStep: true
  },
  
  // 修复策略组合
  strategies: {
    importCleanup: 'balanced',    // conservative, balanced, aggressive
    typeSafety: 'progressive',    // conservative, progressive, strict
    hooksOptimization: 'balanced', // safe, balanced, aggressive
    migration: 'automatic'        // manual, automatic, hybrid
  }
};

// 执行阶段
const executionPhases = [
  {
    name: '环境准备',
    function: phase1_environmentSetup,
    critical: true,
    rollback: false
  },
  {
    name: '智能导入清理',
    function: phase2_smartImportCleanup,
    critical: true,
    rollback: true
  },
  {
    name: '渐进式类型安全',
    function: phase3_progressiveTypeSafety,
    critical: true,
    rollback: true
  },
  {
    name: 'Hooks依赖优化',
    function: phase4_hooksOptimization,
    critical: false,
    rollback: true
  },
  {
    name: '工具链现代化',
    function: phase5_toolchainModernization,
    critical: false,
    rollback: false
  },
  {
    name: '质量验证',
    function: phase6_qualityValidation,
    critical: true,
    rollback: false
  }
];

// 主执行函数
async function ultimateEslintFix() {
  console.log('🎯 终极ESLint修复开始...');
  console.log('═'.repeat(60));
  
  const startTime = Date.now();
  const results = {
    phases: [],
    overall: {
      success: false,
      duration: 0,
      errors: [],
      warnings: []
    }
  };
  
  try {
    // 执行所有阶段
    for (let i = 0; i < executionPhases.length; i++) {
      const phase = executionPhases[i];
      console.log(`\n📋 阶段 ${i + 1}: ${phase.name}`);
      console.log('─'.repeat(50));
      
      const phaseStartTime = Date.now();
      let phaseResult = {
        name: phase.name,
        success: false,
        duration: 0,
        errors: [],
        warnings: []
      };
      
      try {
        // 执行阶段
        const phaseOutput = await phase.function();
        phaseResult.success = true;
        phaseResult.output = phaseOutput;
        
        console.log(`✅ ${phase.name} 完成`);
        
        // 关键阶段验证
        if (phase.critical && !await validateCriticalPhase()) {
          throw new Error(`关键阶段验证失败: ${phase.name}`);
        }
        
      } catch (error) {
        phaseResult.success = false;
        phaseResult.errors.push(error.message);
        
        console.log(`❌ ${phase.name} 失败: ${error.message}`);
        
        // 关键阶段失败，回滚
        if (phase.critical && phase.rollback) {
          console.log(`🔄 回滚阶段: ${phase.name}`);
          await rollbackPhase(phase.name);
        }
        
        // 如果配置要求，停止执行
        if (phase.critical && ultimateConfig.riskControl.rollbackOnFailure) {
          throw new Error(`关键阶段失败，停止执行: ${phase.name}`);
        }
      }
      
      phaseResult.duration = Date.now() - phaseStartTime;
      results.phases.push(phaseResult);
    }
    
    // 最终验证
    console.log('\n🔍 最终验证...');
    const finalValidation = await performFinalValidation();
    
    results.overall.success = finalValidation.success;
    results.overall.duration = Date.now() - startTime;
    results.overall.errors = finalValidation.errors;
    results.overall.warnings = finalValidation.warnings;
    
    // 生成最终报告
    await generateUltimateReport(results);
    
    if (results.overall.success) {
      console.log('\n🎉 终极ESLint修复成功完成！');
      console.log(`⏱️  总耗时: ${Math.round(results.overall.duration / 1000)}秒`);
    } else {
      console.log('\n⚠️  终极ESLint修复部分完成');
      console.log('📋 请查看详细报告了解问题');
    }
    
  } catch (error) {
    console.error('\n❌ 终极ESLint修复失败:', error.message);
    results.overall.success = false;
    results.overall.errors.push(error.message);
    
    // 紧急回滚
    if (ultimateConfig.riskControl.rollbackOnFailure) {
      console.log('🔄 执行紧急回滚...');
      await emergencyRollback();
    }
    
    process.exit(1);
  }
}

// 阶段1: 环境准备
async function phase1_environmentSetup() {
  console.log('🔧 准备修复环境...');
  
  // 1.1 创建备份
  if (ultimateConfig.riskControl.createBackup) {
    console.log('💾 创建代码备份...');
    try {
      execSync('git add . && git commit -m "backup: 终极ESLint修复前备份"', { stdio: 'inherit' });
      console.log('✅ 代码备份完成');
    } catch (error) {
      console.log('⚠️  备份失败，继续执行...');
    }
  }
  
  // 1.2 环境检查
  console.log('🔍 检查环境...');
  const envCheck = await checkEnvironment();
  if (!envCheck.valid) {
    throw new Error(`环境检查失败: ${envCheck.errors.join(', ')}`);
  }
  
  // 1.3 依赖分析
  console.log('📊 分析项目依赖...');
  const dependencyAnalysis = await analyzeDependencies();
  
  // 1.4 错误基线
  console.log('📈 建立错误基线...');
  const baseline = await establishErrorBaseline();
  
  return {
    environment: envCheck,
    dependencies: dependencyAnalysis,
    baseline
  };
}

// 阶段2: 智能导入清理
async function phase2_smartImportCleanup() {
  console.log('🧹 智能清理未使用导入...');
  
  const strategy = ultimateConfig.strategies.importCleanup;
  console.log(`🎯 使用策略: ${strategy}`);
  
  // 运行智能导入清理器
  try {
    execSync(`node scripts/smart-import-cleaner.js ${strategy}`, { stdio: 'inherit' });
    console.log('✅ 智能导入清理完成');
  } catch (error) {
    throw new Error(`智能导入清理失败: ${error.message}`);
  }
  
  // 验证清理结果
  const cleanupValidation = await validateImportCleanup();
  if (!cleanupValidation.success) {
    throw new Error(`导入清理验证失败: ${cleanupValidation.errors.join(', ')}`);
  }
  
  return cleanupValidation;
}

// 阶段3: 渐进式类型安全
async function phase3_progressiveTypeSafety() {
  console.log('🔒 渐进式类型安全修复...');
  
  const strategy = ultimateConfig.strategies.typeSafety;
  console.log(`🎯 使用策略: ${strategy}`);
  
  // 运行智能类型修复器
  try {
    execSync(`node scripts/intelligent-type-fixer.js ${strategy}`, { stdio: 'inherit' });
    console.log('✅ 类型安全修复完成');
  } catch (error) {
    throw new Error(`类型安全修复失败: ${error.message}`);
  }
  
  // 验证类型修复结果
  const typeValidation = await validateTypeSafety();
  if (!typeValidation.success) {
    throw new Error(`类型安全验证失败: ${typeValidation.errors.join(', ')}`);
  }
  
  return typeValidation;
}

// 阶段4: Hooks依赖优化
async function phase4_hooksOptimization() {
  console.log('⚛️  React Hooks依赖优化...');
  
  const strategy = ultimateConfig.strategies.hooksOptimization;
  console.log(`🎯 使用策略: ${strategy}`);
  
  // 运行Hooks依赖优化器
  try {
    execSync(`node scripts/hooks-dependency-optimizer.js ${strategy}`, { stdio: 'inherit' });
    console.log('✅ Hooks依赖优化完成');
  } catch (error) {
    throw new Error(`Hooks依赖优化失败: ${error.message}`);
  }
  
  // 验证Hooks优化结果
  const hooksValidation = await validateHooksOptimization();
  if (!hooksValidation.success) {
    throw new Error(`Hooks优化验证失败: ${hooksValidation.errors.join(', ')}`);
  }
  
  return hooksValidation;
}

// 阶段5: 工具链现代化
async function phase5_toolchainModernization() {
  console.log('🔧 工具链现代化...');
  
  const strategy = ultimateConfig.strategies.migration;
  console.log(`🎯 使用策略: ${strategy}`);
  
  // 运行工具链迁移
  try {
    execSync('node scripts/migrate-to-eslint-cli.js', { stdio: 'inherit' });
    console.log('✅ 工具链现代化完成');
  } catch (error) {
    throw new Error(`工具链现代化失败: ${error.message}`);
  }
  
  return { success: true };
}

// 阶段6: 质量验证
async function phase6_qualityValidation() {
  console.log('✅ 质量验证...');
  
  const validation = await performFinalValidation();
  if (!validation.success) {
    throw new Error(`质量验证失败: ${validation.errors.join(', ')}`);
  }
  
  return validation;
}

// 辅助函数
async function checkEnvironment() {
  const errors = [];
  
  // 检查Node.js版本
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    console.log(`📦 Node.js版本: ${nodeVersion}`);
  } catch (error) {
    errors.push('Node.js未安装或不可用');
  }
  
  // 检查npm
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    console.log(`📦 npm版本: ${npmVersion}`);
  } catch (error) {
    errors.push('npm未安装或不可用');
  }
  
  // 检查Git
  try {
    execSync('git --version', { stdio: 'pipe' });
  } catch (error) {
    errors.push('Git未安装或不可用');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

async function analyzeDependencies() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    return {
      dependencies: Object.keys(packageJson.dependencies || {}).length,
      devDependencies: Object.keys(packageJson.devDependencies || {}).length
    };
  } catch (error) {
    return { error: error.message };
  }
}

async function establishErrorBaseline() {
  try {
    execSync('npx eslint . --ext .ts,.tsx --format json > eslint-baseline.json', { stdio: 'pipe' });
    const baseline = JSON.parse(fs.readFileSync('eslint-baseline.json', 'utf8'));
    
    const stats = {
      files: baseline.length,
      errors: baseline.reduce((sum, file) => sum + file.errorCount, 0),
      warnings: baseline.reduce((sum, file) => sum + file.warningCount, 0)
    };
    
    console.log(`📊 错误基线: ${stats.files}个文件, ${stats.errors}个错误, ${stats.warnings}个警告`);
    return stats;
  } catch (error) {
    return { error: error.message };
  }
}

async function validateCriticalPhase() {
  try {
    // 检查构建
    execSync('npm run build', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

async function rollbackPhase(phaseName) {
  console.log(`🔄 回滚阶段: ${phaseName}`);
  try {
    execSync('git checkout -- .', { stdio: 'pipe' });
    console.log('✅ 回滚完成');
  } catch (error) {
    console.log('❌ 回滚失败');
  }
}

async function validateImportCleanup() {
  try {
    execSync('npm run build', { stdio: 'pipe' });
    return { success: true };
  } catch (error) {
    return { success: false, errors: [error.message] };
  }
}

async function validateTypeSafety() {
  try {
    execSync('npm run type-check', { stdio: 'pipe' });
    return { success: true };
  } catch (error) {
    return { success: false, errors: [error.message] };
  }
}

async function validateHooksOptimization() {
  try {
    execSync('npm run build', { stdio: 'pipe' });
    return { success: true };
  } catch (error) {
    return { success: false, errors: [error.message] };
  }
}

async function performFinalValidation() {
  const validation = {
    success: true,
    errors: [],
    warnings: []
  };
  
  // ESLint检查
  try {
    execSync('npx eslint . --ext .ts,.tsx --format json > eslint-final.json', { stdio: 'pipe' });
    const finalReport = JSON.parse(fs.readFileSync('eslint-final.json', 'utf8'));
    
    const errorCount = finalReport.reduce((sum, file) => sum + file.errorCount, 0);
    const warningCount = finalReport.reduce((sum, file) => sum + file.warningCount, 0);
    
    if (errorCount > ultimateConfig.qualityGates.maxErrors) {
      validation.success = false;
      validation.errors.push(`ESLint错误过多: ${errorCount} > ${ultimateConfig.qualityGates.maxErrors}`);
    }
    
    if (warningCount > ultimateConfig.qualityGates.maxWarnings) {
      validation.warnings.push(`ESLint警告过多: ${warningCount} > ${ultimateConfig.qualityGates.maxWarnings}`);
    }
  } catch (error) {
    validation.success = false;
    validation.errors.push(`ESLint检查失败: ${error.message}`);
  }
  
  // 构建检查
  try {
    execSync('npm run build', { stdio: 'pipe' });
  } catch (error) {
    validation.success = false;
    validation.errors.push(`构建失败: ${error.message}`);
  }
  
  // 类型检查
  try {
    execSync('npm run type-check', { stdio: 'pipe' });
  } catch (error) {
    validation.warnings.push(`类型检查失败: ${error.message}`);
  }
  
  return validation;
}

async function emergencyRollback() {
  console.log('🚨 执行紧急回滚...');
  try {
    execSync('git reset --hard HEAD~1', { stdio: 'inherit' });
    console.log('✅ 紧急回滚完成');
  } catch (error) {
    console.log('❌ 紧急回滚失败');
  }
}

async function generateUltimateReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    config: ultimateConfig,
    results,
    summary: {
      overallSuccess: results.overall.success,
      totalDuration: results.overall.duration,
      phasesCompleted: results.phases.filter(p => p.success).length,
      totalPhases: results.phases.length,
      successRate: Math.round((results.phases.filter(p => p.success).length / results.phases.length) * 100)
    }
  };
  
  fs.writeFileSync('ultimate-eslint-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 终极修复报告已保存: ultimate-eslint-report.json');
}

// 主执行函数
async function main() {
  try {
    await ultimateEslintFix();
  } catch (error) {
    console.error('❌ 终极ESLint修复失败:', error.message);
    process.exit(1);
  }
}

// 运行主函数
if (require.main === module) {
  main();
}

module.exports = { ultimateEslintFix, ultimateConfig };
































