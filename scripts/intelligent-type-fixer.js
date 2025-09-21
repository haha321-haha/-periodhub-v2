#!/usr/bin/env node

/**
 * 智能类型修复器
 * 融合类型推导和API分析，智能替换any类型
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧠 智能类型修复器启动...\n');

// 类型修复策略
const typeStrategies = {
  // 保守策略：只替换明显的类型
  conservative: {
    maxReplacements: 5,
    confidenceThreshold: 0.9,
    preserveAny: true
  },
  
  // 渐进策略：逐步替换，验证后继续
  progressive: {
    maxReplacements: 10,
    confidenceThreshold: 0.7,
    preserveAny: false,
    batchSize: 3
  },
  
  // 严格策略：尽可能替换所有any
  strict: {
    maxReplacements: 50,
    confidenceThreshold: 0.5,
    preserveAny: false,
    batchSize: 1
  }
};

// 类型模式匹配规则
const typePatterns = {
  // API响应模式
  apiResponse: {
    pattern: /(?:fetch|axios|api)\([^)]+\)/g,
    type: 'ApiResponse<T>',
    confidence: 0.8
  },
  
  // 事件处理模式
  eventHandler: {
    pattern: /(?:on|handle)\w+.*Event/g,
    type: 'EventHandler<T>',
    confidence: 0.9
  },
  
  // 用户数据模式
  userData: {
    pattern: /(?:user|profile|account)\w*/gi,
    type: 'User',
    confidence: 0.8
  },
  
  // 配置对象模式
  configObject: {
    pattern: /(?:config|options|settings)\w*/gi,
    type: 'Record<string, unknown>',
    confidence: 0.7
  },
  
  // 数组模式
  arrayPattern: {
    pattern: /\[\]/g,
    type: 'unknown[]',
    confidence: 0.6
  },
  
  // 函数模式
  functionPattern: {
    pattern: /\([^)]*\)\s*=>/g,
    type: '(...args: unknown[]) => unknown',
    confidence: 0.5
  }
};

// 主修复函数
async function intelligentTypeFix(strategy = 'progressive') {
  console.log(`🎯 使用策略: ${strategy}`);
  console.log('─'.repeat(50));
  
  const config = typeStrategies[strategy];
  if (!config) {
    throw new Error(`未知策略: ${strategy}`);
  }
  
  // 1. 扫描包含any类型的文件
  console.log('🔍 扫描包含any类型的文件...');
  const filesWithAny = await findFilesWithAnyTypes();
  console.log(`📁 发现 ${filesWithAny.length} 个文件包含any类型`);
  
  // 2. 分析每个文件的类型使用模式
  console.log('🧠 分析类型使用模式...');
  const analysisResults = await analyzeTypePatterns(filesWithAny);
  
  // 3. 生成类型替换建议
  console.log('💡 生成类型替换建议...');
  const replacementSuggestions = await generateTypeSuggestions(analysisResults);
  
  // 4. 应用类型替换
  console.log('🔧 应用类型替换...');
  const replacementResults = await applyTypeReplacements(replacementSuggestions, config);
  
  // 5. 验证替换结果
  console.log('✅ 验证替换结果...');
  const validationResults = await validateTypeReplacements();
  
  // 6. 生成报告
  console.log('📊 生成修复报告...');
  await generateTypeFixReport(replacementResults, validationResults);
  
  console.log('🎉 智能类型修复完成！');
}

// 查找包含any类型的文件
async function findFilesWithAnyTypes() {
  try {
    const result = execSync('grep -r "any" --include="*.ts" --include="*.tsx" . | grep -v node_modules | grep -v ".next"', { encoding: 'utf8' });
    const lines = result.split('\n').filter(line => line.trim());
    
    const files = new Set();
    lines.forEach(line => {
      const filePath = line.split(':')[0];
      if (filePath && fs.existsSync(filePath)) {
        files.add(filePath);
      }
    });
    
    return Array.from(files);
  } catch (error) {
    console.log('⚠️  扫描any类型失败，使用备用方法...');
    return await findFilesWithAnyTypesFallback();
  }
}

// 备用any类型查找方法
async function findFilesWithAnyTypesFallback() {
  const files = [];
  const extensions = ['.ts', '.tsx'];
  
  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scanDirectory(fullPath);
      } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('any')) {
          files.push(fullPath);
        }
      }
    }
  }
  
  scanDirectory('.');
  return files;
}

// 分析类型使用模式
async function analyzeTypePatterns(files) {
  const results = [];
  
  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const analysis = {
        filePath,
        anyUsages: [],
        suggestions: []
      };
      
      // 查找any类型使用
      const anyMatches = content.matchAll(/: any/g);
      for (const match of anyMatches) {
        const context = extractContext(content, match.index, 100);
        analysis.anyUsages.push({
          position: match.index,
          context,
          confidence: 0
        });
      }
      
      // 分析上下文，确定最佳类型
      for (const usage of analysis.anyUsages) {
        const suggestion = await analyzeContext(usage.context);
        if (suggestion) {
          analysis.suggestions.push(suggestion);
        }
      }
      
      results.push(analysis);
    } catch (error) {
      console.log(`❌ 分析文件失败: ${filePath} - ${error.message}`);
    }
  }
  
  return results;
}

// 提取上下文
function extractContext(content, position, length) {
  const start = Math.max(0, position - length);
  const end = Math.min(content.length, position + length);
  return content.substring(start, end);
}

// 分析上下文，生成类型建议
async function analyzeContext(context) {
  let bestSuggestion = null;
  let bestConfidence = 0;
  
  for (const [patternName, pattern] of Object.entries(typePatterns)) {
    if (pattern.pattern.test(context)) {
      if (pattern.confidence > bestConfidence) {
        bestConfidence = pattern.confidence;
        bestSuggestion = {
          pattern: patternName,
          type: pattern.type,
          confidence: pattern.confidence,
          context
        };
      }
    }
  }
  
  return bestSuggestion;
}

// 生成类型替换建议
async function generateTypeSuggestions(analysisResults) {
  const suggestions = [];
  
  for (const analysis of analysisResults) {
    for (const suggestion of analysis.suggestions) {
      suggestions.push({
        filePath: analysis.filePath,
        ...suggestion
      });
    }
  }
  
  // 按置信度排序
  suggestions.sort((a, b) => b.confidence - a.confidence);
  
  return suggestions;
}

// 应用类型替换
async function applyTypeReplacements(suggestions, config) {
  const results = {
    total: suggestions.length,
    applied: 0,
    failed: 0,
    skipped: 0
  };
  
  let processed = 0;
  
  for (const suggestion of suggestions) {
    if (processed >= config.maxReplacements) {
      results.skipped = suggestions.length - processed;
      break;
    }
    
    if (suggestion.confidence < config.confidenceThreshold) {
      results.skipped++;
      continue;
    }
    
    try {
      await applySingleReplacement(suggestion);
      results.applied++;
      
      // 批量验证
      if (config.batchSize && results.applied % config.batchSize === 0) {
        if (await validateTypeCheck()) {
          console.log(`✅ 批量验证通过 (${results.applied}/${suggestions.length})`);
        } else {
          console.log(`❌ 批量验证失败，停止应用替换`);
          break;
        }
      }
    } catch (error) {
      console.log(`❌ 替换失败: ${suggestion.filePath} - ${error.message}`);
      results.failed++;
    }
    
    processed++;
  }
  
  return results;
}

// 应用单个类型替换
async function applySingleReplacement(suggestion) {
  const content = fs.readFileSync(suggestion.filePath, 'utf8');
  
  // 简单的替换逻辑（实际实现会更复杂）
  let newContent = content;
  
  // 替换 : any 为具体类型
  if (suggestion.type) {
    newContent = newContent.replace(/: any/g, `: ${suggestion.type}`);
  }
  
  // 添加必要的导入
  if (suggestion.type && suggestion.type.includes('ApiResponse')) {
    newContent = addImport(newContent, "import { ApiResponse } from '@/types/common';");
  }
  
  if (suggestion.type && suggestion.type.includes('User')) {
    newContent = addImport(newContent, "import { User } from '@/types/common';");
  }
  
  fs.writeFileSync(suggestion.filePath, newContent);
}

// 添加导入语句
function addImport(content, importStatement) {
  if (content.includes(importStatement)) {
    return content;
  }
  
  const lines = content.split('\n');
  let insertIndex = 0;
  
  // 找到最后一个import语句的位置
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ')) {
      insertIndex = i + 1;
    }
  }
  
  lines.splice(insertIndex, 0, importStatement);
  return lines.join('\n');
}

// 验证类型替换
async function validateTypeReplacements() {
  try {
    execSync('npm run type-check', { stdio: 'pipe' });
    return { success: true, errors: [] };
  } catch (error) {
    return { success: false, errors: [error.message] };
  }
}

// 验证类型检查
async function validateTypeCheck() {
  try {
    execSync('npm run type-check', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// 生成类型修复报告
async function generateTypeFixReport(replacementResults, validationResults) {
  const report = {
    timestamp: new Date().toISOString(),
    strategy: 'progressive',
    results: replacementResults,
    validation: validationResults,
    summary: {
      totalSuggestions: replacementResults.total,
      applied: replacementResults.applied,
      failed: replacementResults.failed,
      skipped: replacementResults.skipped,
      successRate: Math.round((replacementResults.applied / replacementResults.total) * 100)
    }
  };
  
  fs.writeFileSync('type-fix-report.json', JSON.stringify(report, null, 2));
  console.log('📄 类型修复报告已保存: type-fix-report.json');
}

// 主执行函数
async function main() {
  const strategy = process.argv[2] || 'progressive';
  
  try {
    await intelligentTypeFix(strategy);
  } catch (error) {
    console.error('❌ 智能类型修复失败:', error.message);
    process.exit(1);
  }
}

// 运行主函数
if (require.main === module) {
  main();
}

module.exports = { intelligentTypeFix, typeStrategies, typePatterns };



















