#!/usr/bin/env node

/**
 * 快速硬编码URL检测脚本
 * 优化版本，添加进度显示和快速扫描
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
  // 要检查的文件类型
  fileExtensions: ['.tsx', '.ts', '.js', '.json'],

  // 排除的目录
  excludeDirs: ['node_modules', '.next', 'recovery-workspace', 'hub-latest-main', 'backup', 'backups', 'recovered', 'recovery-backups'],

  // 硬编码URL模式
  hardcodedPatterns: [
    /https:\/\/periodhub\.health/g,
    /https:\/\/www\.periodhub\.health/g,
  ],

  // 允许的硬编码模式（在特定上下文中）
  allowedPatterns: [
    /\/\/.*https:\/\/periodhub\.health/g,
    /\/\*.*https:\/\/periodhub\.health.*\*\//g,
    /`.*\$\{.*BASE_URL.*\}.*`/g,
    // 允许在环境变量默认值中的硬编码URL
    /process\.env\.NEXT_PUBLIC_BASE_URL\s*\|\|\s*["']https:\/\/periodhub\.health["']/g,
    /process\.env\.NEXT_PUBLIC_BASE_URL\s*\|\|\s*["']https:\/\/www\.periodhub\.health["']/g,
  ],

  // 最大文件大小 (1MB)
  maxFileSize: 1024 * 1024,
};

// 检查单个文件
function checkFile(filePath) {
  try {
    const stats = fs.statSync(filePath);

    // 跳过过大的文件
    if (stats.size > CONFIG.maxFileSize) {
      return [];
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];

    CONFIG.hardcodedPatterns.forEach((pattern) => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          // 检查是否在允许的上下文中
          const isAllowed = CONFIG.allowedPatterns.some(allowedPattern => {
            // 检查整个文件内容是否包含允许的模式
            return allowedPattern.test(content);
          });

          if (!isAllowed) {
            issues.push({
              type: 'hardcoded_url',
              pattern: pattern.toString(),
              match: match,
              line: getLineNumber(content, match),
            });
          }
        });
      }
    });

    return issues;
  } catch (error) {
    // 静默处理错误，避免输出过多错误信息
    return [];
  }
}

// 获取行号
function getLineNumber(content, match) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(match)) {
      return i + 1;
    }
  }
  return 0;
}

// 快速扫描目录（只扫描主要目录）
function quickScanDirectory(dirPath, depth = 0, maxDepth = 3) {
  const results = [];
  let fileCount = 0;

  try {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // 跳过排除的目录
        if (CONFIG.excludeDirs.includes(item)) {
          continue;
        }

        // 限制扫描深度
        if (depth < maxDepth) {
          results.push(...quickScanDirectory(fullPath, depth + 1, maxDepth));
        }
      } else if (stat.isFile()) {
        fileCount++;

        // 显示进度
        if (fileCount % 50 === 0) {
          process.stdout.write(`\r扫描进度: ${fileCount} 个文件...`);
        }

        // 检查文件类型
        const ext = path.extname(item);
        if (CONFIG.fileExtensions.includes(ext)) {
          const issues = checkFile(fullPath);
          if (issues.length > 0) {
            results.push({
              file: fullPath,
              issues: issues,
            });
          }
        }
      }
    }
  } catch (error) {
    // 静默处理错误
  }

  return results;
}

// 生成报告
function generateReport(results) {
  console.log('\r'); // 清除进度显示
  log.header('硬编码URL检测报告');

  if (results.length === 0) {
    log.success('✅ 没有发现硬编码URL问题');
    return;
  }

  log.warning(`⚠️ 发现 ${results.length} 个文件包含硬编码URL`);

  results.forEach(({ file, issues }) => {
    log.error(`\n📁 文件: ${file}`);
    issues.forEach(issue => {
      log.error(`  第${issue.line}行: ${issue.match}`);
    });
  });

  log.warning('\n🔧 建议修复方法:');
  log.info('1. 使用 lib/url-config.ts 中的配置');
  log.info('2. 使用环境变量 process.env.NEXT_PUBLIC_BASE_URL');
  log.info('3. 使用 URL_CONFIG.getUrl() 函数生成URL');
}

// 主函数
function main() {
  log.header('开始快速硬编码URL检测');

  const startTime = Date.now();

  // 优先扫描主要目录
  const priorityDirs = ['app', 'components', 'lib', 'utils', 'scripts'];
  let results = [];

  for (const dir of priorityDirs) {
    if (fs.existsSync(dir)) {
      log.info(`扫描目录: ${dir}`);
      results.push(...quickScanDirectory(dir, 0, 2));
    }
  }

  // 如果主要目录没有发现问题，再扫描其他目录
  if (results.length === 0) {
    log.info('主要目录无问题，扫描其他目录...');
    results = quickScanDirectory('.', 0, 1);
  }

  const endTime = Date.now();

  generateReport(results);

  log.info(`\n⏱️ 检测完成，耗时: ${endTime - startTime}ms`);

  // 如果有问题，退出码为1
  if (results.length > 0) {
    process.exit(1);
  }
}

// 运行检测
if (require.main === module) {
  main();
}

module.exports = { checkFile, quickScanDirectory, generateReport };
