#!/usr/bin/env node

/**
 * 自动修复硬编码URL脚本
 * 批量替换硬编码的URL为动态配置
 */

const fs = require('fs');
const path = require('path');

// 颜色定义
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// 日志函数
const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.cyan}=== ${msg} ===${colors.reset}`),
};

// 配置
const CONFIG = {
  // 硬编码URL模式
  hardcodedPatterns: [
    {
      pattern: /https:\/\/periodhub\.health/g,
      replacement: 'process.env.NEXT_PUBLIC_BASE_URL || "https://periodhub.health"',
      description: 'periodhub.health'
    },
    {
      pattern: /https:\/\/www\.periodhub\.health/g,
      replacement: 'process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"',
      description: 'www.periodhub.health'
    }
  ],
  
  // 需要特殊处理的文件
  specialFiles: {
    'app/seo-config.ts': {
      // SEO配置文件需要保持静态URL用于搜索引擎
      skip: true,
      reason: 'SEO配置文件需要静态URL'
    },
    'app/sitemap.ts': {
      // sitemap需要静态URL
      skip: true,
      reason: 'sitemap需要静态URL'
    },
    'app/robots.ts': {
      // robots.txt需要静态URL
      skip: true,
      reason: 'robots.txt需要静态URL'
    }
  },
  
  // 需要添加导入的文件类型
  needsImport: ['.tsx', '.ts'],
  
  // 导入语句
  importStatement: "import { URL_CONFIG } from '@/lib/url-config';"
};

// 检查文件是否需要特殊处理
function shouldSkipFile(filePath) {
  const relativePath = path.relative('.', filePath);
  return CONFIG.specialFiles[relativePath]?.skip || false;
}

// 检查文件是否已经有导入语句
function hasImport(content, importPath) {
  return content.includes(importPath);
}

// 添加导入语句
function addImport(content, filePath) {
  const ext = path.extname(filePath);
  
  if (!CONFIG.needsImport.includes(ext)) {
    return content;
  }
  
  if (hasImport(content, 'URL_CONFIG')) {
    return content;
  }
  
  // 在文件开头添加导入
  const lines = content.split('\n');
  let insertIndex = 0;
  
  // 找到第一个import语句的位置
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      insertIndex = i + 1;
    } else if (lines[i].trim() === '' && insertIndex > 0) {
      break;
    }
  }
  
  lines.splice(insertIndex, 0, CONFIG.importStatement);
  return lines.join('\n');
}

// 修复单个文件
function fixFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let changes = 0;
    
    // 检查是否需要跳过
    if (shouldSkipFile(filePath)) {
      const relativePath = path.relative('.', filePath);
      const reason = CONFIG.specialFiles[relativePath].reason;
      log.warning(`跳过文件 ${relativePath}: ${reason}`);
      return { success: true, changes: 0, skipped: true };
    }
    
    // 应用所有替换模式
    CONFIG.hardcodedPatterns.forEach(({ pattern, replacement, description }) => {
      const matches = newContent.match(pattern);
      if (matches) {
        newContent = newContent.replace(pattern, replacement);
        changes += matches.length;
        log.info(`替换 ${matches.length} 个 ${description} URL`);
      }
    });
    
    // 如果有更改，添加导入语句
    if (changes > 0) {
      newContent = addImport(newContent, filePath);
      
      // 写回文件
      fs.writeFileSync(filePath, newContent, 'utf8');
      log.success(`修复文件: ${filePath} (${changes} 处更改)`);
    }
    
    return { success: true, changes, skipped: false };
  } catch (error) {
    log.error(`修复文件失败: ${filePath} - ${error.message}`);
    return { success: false, changes: 0, skipped: false, error: error.message };
  }
}

// 扫描并修复目录
function scanAndFixDirectory(dirPath, depth = 0, maxDepth = 3) {
  const results = {
    total: 0,
    fixed: 0,
    skipped: 0,
    errors: 0,
    files: []
  };
  
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // 跳过排除的目录
        if (['node_modules', '.next', 'recovery-workspace', 'hub-latest-main', 'backup', 'backups', 'recovered', 'recovery-backups'].includes(item)) {
          continue;
        }
        
        // 限制扫描深度
        if (depth < maxDepth) {
          const subResults = scanAndFixDirectory(fullPath, depth + 1, maxDepth);
          results.total += subResults.total;
          results.fixed += subResults.fixed;
          results.skipped += subResults.skipped;
          results.errors += subResults.errors;
          results.files.push(...subResults.files);
        }
      } else if (stat.isFile()) {
        // 检查文件类型
        const ext = path.extname(item);
        if (['.tsx', '.ts', '.js', '.json'].includes(ext)) {
          results.total++;
          
          const result = fixFile(fullPath);
          results.files.push({
            file: fullPath,
            ...result
          });
          
          if (result.success) {
            if (result.skipped) {
              results.skipped++;
            } else if (result.changes > 0) {
              results.fixed++;
            }
          } else {
            results.errors++;
          }
        }
      }
    }
  } catch (error) {
    log.error(`扫描目录失败: ${dirPath} - ${error.message}`);
  }
  
  return results;
}

// 生成修复报告
function generateReport(results) {
  log.header('硬编码URL修复报告');
  
  log.info(`总文件数: ${results.total}`);
  log.success(`成功修复: ${results.fixed}`);
  log.warning(`跳过文件: ${results.skipped}`);
  log.error(`错误文件: ${results.errors}`);
  
  if (results.files.length > 0) {
    log.header('详细结果');
    
    results.files.forEach(({ file, success, changes, skipped, error }) => {
      const relativePath = path.relative('.', file);
      
      if (skipped) {
        log.warning(`⏭️  ${relativePath} (跳过)`);
      } else if (success && changes > 0) {
        log.success(`✅ ${relativePath} (${changes} 处更改)`);
      } else if (success) {
        log.info(`ℹ️  ${relativePath} (无更改)`);
      } else {
        log.error(`❌ ${relativePath} (错误: ${error})`);
      }
    });
  }
  
  log.warning('\n🔧 修复说明:');
  log.info('1. 硬编码URL已替换为环境变量');
  log.info('2. 已添加必要的导入语句');
  log.info('3. 特殊文件（SEO配置等）已跳过');
  log.info('4. 请确保设置了 NEXT_PUBLIC_BASE_URL 环境变量');
}

// 主函数
function main() {
  log.header('开始自动修复硬编码URL');
  
  const startTime = Date.now();
  
  // 优先修复主要目录
  const priorityDirs = ['app', 'components', 'lib', 'utils'];
  let results = {
    total: 0,
    fixed: 0,
    skipped: 0,
    errors: 0,
    files: []
  };
  
  for (const dir of priorityDirs) {
    if (fs.existsSync(dir)) {
      log.info(`修复目录: ${dir}`);
      const dirResults = scanAndFixDirectory(dir, 0, 2);
      results.total += dirResults.total;
      results.fixed += dirResults.fixed;
      results.skipped += dirResults.skipped;
      results.errors += dirResults.errors;
      results.files.push(...dirResults.files);
    }
  }
  
  const endTime = Date.now();
  
  generateReport(results);
  
  log.info(`\n⏱️ 修复完成，耗时: ${endTime - startTime}ms`);
  
  // 如果有错误，退出码为1
  if (results.errors > 0) {
    process.exit(1);
  }
}

// 运行修复
if (require.main === module) {
  main();
}

module.exports = { fixFile, scanAndFixDirectory, generateReport };








