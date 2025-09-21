#!/usr/bin/env node

/**
 * 智能导入清理器
 * 融合多工具分析，安全清理未使用的导入
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 智能导入清理器启动...\n');

// 清理策略配置
const cleanupStrategies = {
  // 保守策略：只清理明显的未使用导入
  conservative: {
    tools: ['eslint'],
    confidence: 0.9,
    preserveDynamic: true,
    preserveConditional: true
  },
  
  // 平衡策略：使用多个工具交叉验证
  balanced: {
    tools: ['eslint', 'unimported', 'depcheck'],
    confidence: 0.7,
    preserveDynamic: true,
    preserveConditional: false
  },
  
  // 激进策略：尽可能清理所有未使用导入
  aggressive: {
    tools: ['eslint', 'unimported', 'depcheck', 'ts-unused-exports'],
    confidence: 0.5,
    preserveDynamic: false,
    preserveConditional: false
  }
};

// 动态导入模式
const dynamicPatterns = [
  /import\s*\(\s*['"`][^'"`]+['"`]\s*\)/g,  // import('module')
  /require\s*\(\s*['"`][^'"`]+['"`]\s*\)/g,  // require('module')
  /new\s+Function\s*\(/g,                    // new Function()
  /eval\s*\(/g,                              // eval()
];

// 条件导入模式
const conditionalPatterns = [
  /if\s*\([^)]*\)\s*{\s*import/g,            // if (condition) { import }
  /switch\s*\([^)]*\)\s*{[\s\S]*import/g,    // switch case with import
  /try\s*{[\s\S]*import/g,                   // try block with import
];

// 主清理函数
async function smartImportCleanup(strategy = 'balanced') {
  console.log(`🎯 使用策略: ${strategy}`);
  console.log('─'.repeat(50));
  
  const config = cleanupStrategies[strategy];
  if (!config) {
    throw new Error(`未知策略: ${strategy}`);
  }
  
  // 1. 多工具分析
  console.log('🔍 多工具分析未使用导入...');
  const analysisResults = await runMultiToolAnalysis(config.tools);
  
  // 2. 交叉验证结果
  console.log('🔍 交叉验证分析结果...');
  const validatedResults = await crossValidateResults(analysisResults);
  
  // 3. 安全清理
  console.log('🧹 安全清理未使用导入...');
  const cleanupResults = await safeCleanup(validatedResults, config);
  
  // 4. 验证清理结果
  console.log('✅ 验证清理结果...');
  const validationResults = await validateCleanup();
  
  // 5. 生成清理报告
  console.log('📊 生成清理报告...');
  await generateCleanupReport(cleanupResults, validationResults);
  
  console.log('🎉 智能导入清理完成！');
}

// 运行多工具分析
async function runMultiToolAnalysis(tools) {
  const results = {
    eslint: null,
    unimported: null,
    depcheck: null,
    tsUnusedExports: null
  };
  
  // ESLint分析
  if (tools.includes('eslint')) {
    console.log('📝 运行ESLint分析...');
    try {
      execSync('npx eslint . --ext .ts,.tsx --format json > eslint-unused.json', { stdio: 'inherit' });
      const eslintReport = JSON.parse(fs.readFileSync('eslint-unused.json', 'utf8'));
      results.eslint = parseEslintUnusedImports(eslintReport);
      console.log(`✅ ESLint发现 ${results.eslint.length} 个未使用导入`);
    } catch (error) {
      console.log('⚠️  ESLint分析失败');
    }
  }
  
  // unimported分析
  if (tools.includes('unimported')) {
    console.log('📝 运行unimported分析...');
    try {
      execSync('npx unimported --json > unimported-report.json', { stdio: 'inherit' });
      const unimportedReport = JSON.parse(fs.readFileSync('unimported-report.json', 'utf8'));
      results.unimported = parseUnimportedReport(unimportedReport);
      console.log(`✅ unimported发现 ${results.unimported.length} 个未使用导入`);
    } catch (error) {
      console.log('⚠️  unimported分析失败');
    }
  }
  
  // depcheck分析
  if (tools.includes('depcheck')) {
    console.log('📝 运行depcheck分析...');
    try {
      execSync('npx depcheck --json > depcheck-report.json', { stdio: 'inherit' });
      const depcheckReport = JSON.parse(fs.readFileSync('depcheck-report.json', 'utf8'));
      results.depcheck = parseDepcheckReport(depcheckReport);
      console.log(`✅ depcheck发现 ${results.depcheck.length} 个未使用依赖`);
    } catch (error) {
      console.log('⚠️  depcheck分析失败');
    }
  }
  
  // ts-unused-exports分析
  if (tools.includes('ts-unused-exports')) {
    console.log('📝 运行ts-unused-exports分析...');
    try {
      execSync('npx ts-unused-exports tsconfig.json --json > ts-unused-exports.json', { stdio: 'inherit' });
      const tsUnusedReport = JSON.parse(fs.readFileSync('ts-unused-exports.json', 'utf8'));
      results.tsUnusedExports = parseTsUnusedExports(tsUnusedReport);
      console.log(`✅ ts-unused-exports发现 ${results.tsUnusedExports.length} 个未使用导出`);
    } catch (error) {
      console.log('⚠️  ts-unused-exports分析失败');
    }
  }
  
  return results;
}

// 解析ESLint未使用导入
function parseEslintUnusedImports(eslintReport) {
  const unusedImports = [];
  
  for (const file of eslintReport) {
    if (file.messages) {
      for (const message of file.messages) {
        if (message.ruleId === '@typescript-eslint/no-unused-vars' && 
            message.message.includes('is defined but never used')) {
          unusedImports.push({
            file: file.filePath,
            line: message.line,
            column: message.column,
            message: message.message,
            source: 'eslint'
          });
        }
      }
    }
  }
  
  return unusedImports;
}

// 解析unimported报告
function parseUnimportedReport(unimportedReport) {
  const unusedImports = [];
  
  if (unimportedReport.unused) {
    for (const [file, imports] of Object.entries(unimportedReport.unused)) {
      for (const importName of imports) {
        unusedImports.push({
          file,
          import: importName,
          source: 'unimported'
        });
      }
    }
  }
  
  return unusedImports;
}

// 解析depcheck报告
function parseDepcheckReport(depcheckReport) {
  const unusedDeps = [];
  
  if (depcheckReport.dependencies) {
    for (const dep of depcheckReport.dependencies) {
      unusedDeps.push({
        dependency: dep,
        source: 'depcheck'
      });
    }
  }
  
  return unusedDeps;
}

// 解析ts-unused-exports报告
function parseTsUnusedExports(tsUnusedReport) {
  const unusedExports = [];
  
  if (Array.isArray(tsUnusedReport)) {
    for (const item of tsUnusedReport) {
      unusedExports.push({
        file: item.file,
        export: item.export,
        source: 'ts-unused-exports'
      });
    }
  }
  
  return unusedExports;
}

// 交叉验证结果
async function crossValidateResults(analysisResults) {
  const validatedResults = {
    highConfidence: [],
    mediumConfidence: [],
    lowConfidence: []
  };
  
  // 合并所有结果
  const allResults = [];
  Object.values(analysisResults).forEach(result => {
    if (result) {
      allResults.push(...result);
    }
  });
  
  // 按文件和导入分组
  const groupedResults = groupByFileAndImport(allResults);
  
  // 计算置信度
  for (const [key, results] of Object.entries(groupedResults)) {
    const confidence = calculateConfidence(results);
    const result = {
      ...results[0],
      confidence,
      sources: results.map(r => r.source)
    };
    
    if (confidence >= 0.8) {
      validatedResults.highConfidence.push(result);
    } else if (confidence >= 0.5) {
      validatedResults.mediumConfidence.push(result);
    } else {
      validatedResults.lowConfidence.push(result);
    }
  }
  
  console.log(`📊 验证结果: 高置信度 ${validatedResults.highConfidence.length}, 中置信度 ${validatedResults.mediumConfidence.length}, 低置信度 ${validatedResults.lowConfidence.length}`);
  
  return validatedResults;
}

// 按文件和导入分组
function groupByFileAndImport(results) {
  const grouped = {};
  
  for (const result of results) {
    const key = `${result.file}:${result.import || result.export || 'unknown'}`;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(result);
  }
  
  return grouped;
}

// 计算置信度
function calculateConfidence(results) {
  const sourceCount = new Set(results.map(r => r.source)).size;
  const totalCount = results.length;
  
  // 基础置信度：工具数量
  let confidence = sourceCount / 4; // 假设最多4个工具
  
  // 增加置信度：多个工具确认
  if (sourceCount > 1) {
    confidence += 0.2;
  }
  
  // 增加置信度：结果数量
  if (totalCount > 1) {
    confidence += 0.1;
  }
  
  return Math.min(confidence, 1.0);
}

// 安全清理
async function safeCleanup(validatedResults, config) {
  const results = {
    total: 0,
    cleaned: 0,
    skipped: 0,
    failed: 0
  };
  
  // 只清理高置信度的结果
  const toClean = validatedResults.highConfidence.filter(result => 
    result.confidence >= config.confidence
  );
  
  results.total = toClean.length;
  
  for (const result of toClean) {
    try {
      // 检查是否为动态导入
      if (config.preserveDynamic && isDynamicImport(result)) {
        console.log(`⏭️  跳过动态导入: ${result.file}`);
        results.skipped++;
        continue;
      }
      
      // 检查是否为条件导入
      if (config.preserveConditional && isConditionalImport(result)) {
        console.log(`⏭️  跳过条件导入: ${result.file}`);
        results.skipped++;
        continue;
      }
      
      // 执行清理
      await cleanSingleImport(result);
      results.cleaned++;
      
      console.log(`✅ 清理成功: ${result.file}`);
      
    } catch (error) {
      console.log(`❌ 清理失败: ${result.file} - ${error.message}`);
      results.failed++;
    }
  }
  
  return results;
}

// 检查是否为动态导入
function isDynamicImport(result) {
  if (!result.file || !fs.existsSync(result.file)) {
    return false;
  }
  
  const content = fs.readFileSync(result.file, 'utf8');
  
  for (const pattern of dynamicPatterns) {
    if (pattern.test(content)) {
      return true;
    }
  }
  
  return false;
}

// 检查是否为条件导入
function isConditionalImport(result) {
  if (!result.file || !fs.existsSync(result.file)) {
    return false;
  }
  
  const content = fs.readFileSync(result.file, 'utf8');
  
  for (const pattern of conditionalPatterns) {
    if (pattern.test(content)) {
      return true;
    }
  }
  
  return false;
}

// 清理单个导入
async function cleanSingleImport(result) {
  const content = fs.readFileSync(result.file, 'utf8');
  let newContent = content;
  
  // 简单的清理逻辑（实际实现会更复杂）
  if (result.import) {
    // 删除未使用的导入行
    const importRegex = new RegExp(`^import\\s+.*\\b${result.import}\\b.*;?$`, 'gm');
    newContent = newContent.replace(importRegex, '');
  }
  
  // 清理空行
  newContent = newContent.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  fs.writeFileSync(result.file, newContent);
}

// 验证清理结果
async function validateCleanup() {
  try {
    // 检查构建
    execSync('npm run build', { stdio: 'pipe' });
    
    // 检查类型
    execSync('npm run type-check', { stdio: 'pipe' });
    
    // 检查ESLint
    execSync('npx eslint . --ext .ts,.tsx', { stdio: 'pipe' });
    
    return { success: true, errors: [] };
  } catch (error) {
    return { success: false, errors: [error.message] };
  }
}

// 生成清理报告
async function generateCleanupReport(cleanupResults, validationResults) {
  const report = {
    timestamp: new Date().toISOString(),
    strategy: 'balanced',
    results: cleanupResults,
    validation: validationResults,
    summary: {
      total: cleanupResults.total,
      cleaned: cleanupResults.cleaned,
      skipped: cleanupResults.skipped,
      failed: cleanupResults.failed,
      successRate: Math.round((cleanupResults.cleaned / cleanupResults.total) * 100)
    }
  };
  
  fs.writeFileSync('import-cleanup-report.json', JSON.stringify(report, null, 2));
  console.log('📄 导入清理报告已保存: import-cleanup-report.json');
}

// 主执行函数
async function main() {
  const strategy = process.argv[2] || 'balanced';
  
  try {
    await smartImportCleanup(strategy);
  } catch (error) {
    console.error('❌ 智能导入清理失败:', error.message);
    process.exit(1);
  }
}

// 运行主函数
if (require.main === module) {
  main();
}

module.exports = { smartImportCleanup, cleanupStrategies };



















