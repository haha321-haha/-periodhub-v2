#!/usr/bin/env node

/**
 * React Hooks依赖优化器
 * 智能分析和修复useEffect、useCallback等Hook的依赖问题
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('⚛️  React Hooks依赖优化器启动...\n');

// 优化策略配置
const optimizationStrategies = {
  // 安全策略：只修复明显的依赖问题
  safe: {
    maxChanges: 5,
    confidenceThreshold: 0.9,
    preserveExisting: true,
    validateEach: true
  },
  
  // 平衡策略：修复大部分依赖问题
  balanced: {
    maxChanges: 15,
    confidenceThreshold: 0.7,
    preserveExisting: false,
    validateEach: true
  },
  
  // 激进策略：尽可能修复所有依赖问题
  aggressive: {
    maxChanges: 50,
    confidenceThreshold: 0.5,
    preserveExisting: false,
    validateEach: false
  }
};

// Hook模式匹配
const hookPatterns = {
  useEffect: {
    pattern: /useEffect\s*\(\s*\(\)\s*=>\s*\{([\s\S]*?)\}\s*,\s*\[([^\]]*)\]\s*\)/g,
    name: 'useEffect'
  },
  useCallback: {
    pattern: /useCallback\s*\(\s*\([^)]*\)\s*=>\s*\{([\s\S]*?)\}\s*,\s*\[([^\]]*)\]\s*\)/g,
    name: 'useCallback'
  },
  useMemo: {
    pattern: /useMemo\s*\(\s*\(\)\s*=>\s*\{([\s\S]*?)\}\s*,\s*\[([^\]]*)\]\s*\)/g,
    name: 'useMemo'
  }
};

// 主优化函数
async function optimizeHooksDependencies(strategy = 'balanced') {
  console.log(`🎯 使用策略: ${strategy}`);
  console.log('─'.repeat(50));
  
  const config = optimizationStrategies[strategy];
  if (!config) {
    throw new Error(`未知策略: ${strategy}`);
  }
  
  // 1. 扫描包含Hook的文件
  console.log('🔍 扫描包含React Hooks的文件...');
  const filesWithHooks = await findFilesWithHooks();
  console.log(`📁 发现 ${filesWithHooks.length} 个文件包含React Hooks`);
  
  // 2. 分析Hook依赖问题
  console.log('🧠 分析Hook依赖问题...');
  const hookAnalysis = await analyzeHookDependencies(filesWithHooks);
  
  // 3. 生成优化建议
  console.log('💡 生成优化建议...');
  const optimizationSuggestions = await generateOptimizationSuggestions(hookAnalysis);
  
  // 4. 应用优化
  console.log('🔧 应用Hook依赖优化...');
  const optimizationResults = await applyOptimizations(optimizationSuggestions, config);
  
  // 5. 验证优化结果
  console.log('✅ 验证优化结果...');
  const validationResults = await validateOptimizations();
  
  // 6. 生成优化报告
  console.log('📊 生成优化报告...');
  await generateOptimizationReport(optimizationResults, validationResults);
  
  console.log('🎉 React Hooks依赖优化完成！');
}

// 查找包含Hook的文件
async function findFilesWithHooks() {
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
        if (containsHooks(content)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  scanDirectory('.');
  return files;
}

// 检查文件是否包含Hook
function containsHooks(content) {
  const hookNames = ['useEffect', 'useCallback', 'useMemo', 'useState', 'useRef'];
  return hookNames.some(hook => content.includes(hook));
}

// 分析Hook依赖问题
async function analyzeHookDependencies(files) {
  const analysis = [];
  
  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileAnalysis = {
        filePath,
        hooks: []
      };
      
      // 分析每种Hook
      for (const [hookName, pattern] of Object.entries(hookPatterns)) {
        const matches = [...content.matchAll(pattern.pattern)];
        
        for (const match of matches) {
          const hookAnalysis = analyzeSingleHook(match, hookName, content);
          if (hookAnalysis) {
            fileAnalysis.hooks.push(hookAnalysis);
          }
        }
      }
      
      if (fileAnalysis.hooks.length > 0) {
        analysis.push(fileAnalysis);
      }
    } catch (error) {
      console.log(`❌ 分析文件失败: ${filePath} - ${error.message}`);
    }
  }
  
  return analysis;
}

// 分析单个Hook
function analyzeSingleHook(match, hookName, content) {
  const [fullMatch, functionBody, dependencies] = match;
  const position = match.index;
  
  // 提取函数体中使用的变量
  const usedVariables = extractUsedVariables(functionBody);
  
  // 解析现有依赖
  const existingDeps = dependencies
    .split(',')
    .map(dep => dep.trim())
    .filter(dep => dep && dep !== '');
  
  // 找出缺失的依赖
  const missingDeps = usedVariables.filter(variable => 
    !existingDeps.includes(variable) && 
    !isReactBuiltIn(variable) &&
    !isHook(variable)
  );
  
  // 找出可能多余的依赖
  const extraDeps = existingDeps.filter(dep => 
    !usedVariables.includes(dep) && 
    !isReactBuiltIn(dep) &&
    !isHook(dep)
  );
  
  if (missingDeps.length === 0 && extraDeps.length === 0) {
    return null; // 没有依赖问题
  }
  
  return {
    hookName,
    position,
    functionBody,
    existingDeps,
    usedVariables,
    missingDeps,
    extraDeps,
    confidence: calculateConfidence(missingDeps, extraDeps, usedVariables)
  };
}

// 提取函数中使用的变量
function extractUsedVariables(functionBody) {
  const variables = new Set();
  
  // 匹配变量名（排除关键字和内置函数）
  const varRegex = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g;
  let match;
  
  while ((match = varRegex.exec(functionBody)) !== null) {
    const varName = match[1];
    
    if (!isKeyword(varName) && !isBuiltInFunction(varName)) {
      variables.add(varName);
    }
  }
  
  return Array.from(variables);
}

// 检查是否为关键字
function isKeyword(word) {
  const keywords = [
    'const', 'let', 'var', 'function', 'if', 'else', 'for', 'while', 'do',
    'switch', 'case', 'default', 'break', 'continue', 'return', 'try',
    'catch', 'finally', 'throw', 'new', 'this', 'super', 'class', 'extends',
    'import', 'export', 'from', 'as', 'default', 'typeof', 'instanceof',
    'in', 'of', 'with', 'debugger', 'yield', 'async', 'await'
  ];
  return keywords.includes(word);
}

// 检查是否为内置函数
function isBuiltInFunction(word) {
  const builtIns = [
    'console', 'window', 'document', 'navigator', 'location', 'history',
    'localStorage', 'sessionStorage', 'setTimeout', 'setInterval',
    'clearTimeout', 'clearInterval', 'fetch', 'Promise', 'Array',
    'Object', 'String', 'Number', 'Boolean', 'Date', 'Math', 'JSON'
  ];
  return builtIns.includes(word);
}

// 检查是否为React内置
function isReactBuiltIn(word) {
  const reactBuiltIns = [
    'React', 'useState', 'useEffect', 'useCallback', 'useMemo', 'useRef',
    'useContext', 'useReducer', 'useImperativeHandle', 'useLayoutEffect',
    'useDebugValue', 'memo', 'forwardRef', 'createContext', 'createElement'
  ];
  return reactBuiltIns.includes(word);
}

// 检查是否为Hook
function isHook(word) {
  return word.startsWith('use') && word.length > 3;
}

// 计算置信度
function calculateConfidence(missingDeps, extraDeps, usedVariables) {
  let confidence = 0.5; // 基础置信度
  
  // 缺失依赖增加置信度
  if (missingDeps.length > 0) {
    confidence += 0.3;
  }
  
  // 多余依赖增加置信度
  if (extraDeps.length > 0) {
    confidence += 0.2;
  }
  
  // 使用变量数量影响置信度
  if (usedVariables.length > 5) {
    confidence += 0.1;
  }
  
  return Math.min(confidence, 1.0);
}

// 生成优化建议
async function generateOptimizationSuggestions(hookAnalysis) {
  const suggestions = [];
  
  for (const fileAnalysis of hookAnalysis) {
    for (const hook of fileAnalysis.hooks) {
      if (hook.missingDeps.length > 0 || hook.extraDeps.length > 0) {
        suggestions.push({
          filePath: fileAnalysis.filePath,
          ...hook,
          suggestion: generateHookSuggestion(hook)
        });
      }
    }
  }
  
  // 按置信度排序
  suggestions.sort((a, b) => b.confidence - a.confidence);
  
  return suggestions;
}

// 生成Hook优化建议
function generateHookSuggestion(hook) {
  const newDeps = [...hook.existingDeps];
  
  // 添加缺失的依赖
  for (const dep of hook.missingDeps) {
    if (!newDeps.includes(dep)) {
      newDeps.push(dep);
    }
  }
  
  // 移除多余的依赖
  const filteredDeps = newDeps.filter(dep => !hook.extraDeps.includes(dep));
  
  return {
    originalDeps: hook.existingDeps,
    suggestedDeps: filteredDeps,
    changes: {
      added: hook.missingDeps,
      removed: hook.extraDeps
    }
  };
}

// 应用优化
async function applyOptimizations(suggestions, config) {
  const results = {
    total: suggestions.length,
    applied: 0,
    failed: 0,
    skipped: 0
  };
  
  let processed = 0;
  
  for (const suggestion of suggestions) {
    if (processed >= config.maxChanges) {
      results.skipped = suggestions.length - processed;
      break;
    }
    
    if (suggestion.confidence < config.confidenceThreshold) {
      results.skipped++;
      continue;
    }
    
    try {
      await applySingleOptimization(suggestion);
      results.applied++;
      
      // 每个优化都验证（如果配置要求）
      if (config.validateEach) {
        if (await validateBuild()) {
          console.log(`✅ 优化成功: ${suggestion.filePath}`);
        } else {
          console.log(`❌ 优化失败，回滚: ${suggestion.filePath}`);
          await revertFile(suggestion.filePath);
          results.applied--;
          results.failed++;
        }
      }
    } catch (error) {
      console.log(`❌ 优化失败: ${suggestion.filePath} - ${error.message}`);
      results.failed++;
    }
    
    processed++;
  }
  
  return results;
}

// 应用单个优化
async function applySingleOptimization(suggestion) {
  const content = fs.readFileSync(suggestion.filePath, 'utf8');
  
  // 构建新的依赖数组
  const newDepsString = suggestion.suggestion.suggestedDeps.join(', ');
  
  // 替换Hook的依赖数组
  const hookPattern = hookPatterns[suggestion.hookName].pattern;
  const newContent = content.replace(hookPattern, (match) => {
    return match.replace(/\[([^\]]*)\]/g, `[${newDepsString}]`);
  });
  
  fs.writeFileSync(suggestion.filePath, newContent);
}

// 验证构建
async function validateBuild() {
  try {
    execSync('npm run build', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// 回滚文件
async function revertFile(filePath) {
  try {
    execSync(`git checkout -- ${filePath}`, { stdio: 'pipe' });
  } catch (error) {
    console.log(`⚠️  无法回滚文件: ${filePath}`);
  }
}

// 验证优化结果
async function validateOptimizations() {
  try {
    // 检查构建
    execSync('npm run build', { stdio: 'pipe' });
    
    // 检查ESLint
    execSync('npx eslint . --ext .ts,.tsx', { stdio: 'pipe' });
    
    return { success: true, errors: [] };
  } catch (error) {
    return { success: false, errors: [error.message] };
  }
}

// 生成优化报告
async function generateOptimizationReport(optimizationResults, validationResults) {
  const report = {
    timestamp: new Date().toISOString(),
    strategy: 'balanced',
    results: optimizationResults,
    validation: validationResults,
    summary: {
      total: optimizationResults.total,
      applied: optimizationResults.applied,
      failed: optimizationResults.failed,
      skipped: optimizationResults.skipped,
      successRate: Math.round((optimizationResults.applied / optimizationResults.total) * 100)
    }
  };
  
  fs.writeFileSync('hooks-optimization-report.json', JSON.stringify(report, null, 2));
  console.log('📄 Hooks优化报告已保存: hooks-optimization-report.json');
}

// 主执行函数
async function main() {
  const strategy = process.argv[2] || 'balanced';
  
  try {
    await optimizeHooksDependencies(strategy);
  } catch (error) {
    console.error('❌ React Hooks依赖优化失败:', error.message);
    process.exit(1);
  }
}

// 运行主函数
if (require.main === module) {
  main();
}

module.exports = { optimizeHooksDependencies, optimizationStrategies };








