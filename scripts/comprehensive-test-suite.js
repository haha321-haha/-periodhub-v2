#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { performance } = require('perf_hooks');

// 测试配置
const config = {
  baseUrl: 'http://localhost:3001',
  timeout: 15000,
  maxRetries: 3,
  performanceThresholds: {
    responseTime: 3000,
    bundleSize: 1024 * 1024, // 1MB
    memoryUsage: 100 * 1024 * 1024 // 100MB
  }
};

// 测试结果
const results = {
  eslint: { passed: 0, failed: 0, total: 0, details: [] },
  build: { passed: 0, failed: 0, total: 0, details: [] },
  functionality: { passed: 0, failed: 0, total: 0, details: [] },
  performance: { passed: 0, failed: 0, total: 0, details: [] },
  overall: { passed: 0, failed: 0, total: 0 }
};

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// 工具函数
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logTest(category, name, status, details = '') {
  const statusColor = status === 'PASS' ? colors.green : colors.red;
  const statusSymbol = status === 'PASS' ? '✅' : '❌';
  
  log(`${statusSymbol} [${category}] ${name}: ${status}`, statusColor);
  if (details) {
    log(`   ${details}`, colors.yellow);
  }
  
  results[category].total++;
  if (status === 'PASS') {
    results[category].passed++;
  } else {
    results[category].failed++;
  }
  
  results[category].details.push({
    name,
    status,
    details,
    timestamp: new Date().toISOString()
  });
  
  results.overall.total++;
  if (status === 'PASS') {
    results.overall.passed++;
  } else {
    results.overall.failed++;
  }
}

// ESLint测试
async function testESLint() {
  log(`\n${colors.bold}🔍 运行ESLint检查...${colors.reset}`);
  
  try {
    // 检查ESLint配置
    const eslintConfig = fs.existsSync('.eslintrc.json');
    if (eslintConfig) {
      logTest('eslint', 'ESLint配置存在', 'PASS');
    } else {
      logTest('eslint', 'ESLint配置存在', 'FAIL', '未找到.eslintrc.json文件');
    }
    
    // 运行ESLint检查
    try {
      const eslintOutput = execSync('npm run lint:check', { 
        encoding: 'utf8', 
        timeout: 30000,
        cwd: process.cwd()
      });
      
      // 检查是否有错误
      if (eslintOutput.includes('error') || eslintOutput.includes('Error')) {
        logTest('eslint', 'ESLint错误检查', 'FAIL', '发现ESLint错误');
      } else {
        logTest('eslint', 'ESLint错误检查', 'PASS', '无ESLint错误');
      }
      
    } catch (error) {
      logTest('eslint', 'ESLint错误检查', 'FAIL', `ESLint执行失败: ${error.message}`);
    }
    
    // 检查TypeScript类型
    try {
      const typeCheckOutput = execSync('npx tsc --noEmit', { 
        encoding: 'utf8', 
        timeout: 30000,
        cwd: process.cwd()
      });
      logTest('eslint', 'TypeScript类型检查', 'PASS', '无类型错误');
    } catch (error) {
      logTest('eslint', 'TypeScript类型检查', 'FAIL', `类型检查失败: ${error.message}`);
    }
    
  } catch (error) {
    logTest('eslint', 'ESLint测试', 'FAIL', `ESLint测试失败: ${error.message}`);
  }
}

// 构建测试
async function testBuild() {
  log(`\n${colors.bold}🏗️  运行构建测试...${colors.reset}`);
  
  try {
    // 清理之前的构建
    if (fs.existsSync('.next')) {
      execSync('rm -rf .next', { cwd: process.cwd() });
      logTest('build', '清理构建缓存', 'PASS');
    }
    
    // 运行构建
    const startTime = performance.now();
    try {
      const buildOutput = execSync('npm run build', { 
        encoding: 'utf8', 
        timeout: 120000, // 2分钟超时
        cwd: process.cwd()
      });
      
      const endTime = performance.now();
      const buildTime = Math.round(endTime - startTime);
      
      logTest('build', 'Next.js构建', 'PASS', `构建时间: ${buildTime}ms`);
      
      // 检查构建输出
      if (fs.existsSync('.next')) {
        logTest('build', '构建输出目录', 'PASS', '.next目录已创建');
      } else {
        logTest('build', '构建输出目录', 'FAIL', '.next目录未创建');
      }
      
    } catch (error) {
      logTest('build', 'Next.js构建', 'FAIL', `构建失败: ${error.message}`);
    }
    
  } catch (error) {
    logTest('build', '构建测试', 'FAIL', `构建测试失败: ${error.message}`);
  }
}

// 功能测试
async function testFunctionality() {
  log(`\n${colors.bold}🧪 运行功能测试...${colors.reset}`);
  
  const testPages = [
    { path: '/', name: '主页', critical: true },
    { path: '/en', name: '英文版', critical: true },
    { path: '/zh', name: '中文版', critical: true },
    { path: '/en/health-guide', name: '健康指南', critical: true },
    { path: '/en/interactive-tools/pain-tracker', name: '疼痛追踪工具', critical: true }
  ];
  
  for (const page of testPages) {
    await testPage(page.path, page.name, page.critical);
  }
}

// 页面测试
function testPage(path, name, critical = false) {
  return new Promise((resolve) => {
    const url = `${config.baseUrl}${path}`;
    const startTime = performance.now();
    
    const req = http.get(url, (res) => {
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          // 检查页面内容
          const hasContent = data.length > 1000;
          const hasTitle = data.includes('<title>');
          const hasBody = data.includes('<body>');
          const hasErrors = data.includes('Error') || data.includes('error');
          
          if (hasContent && hasTitle && hasBody && !hasErrors) {
            logTest('functionality', name, 'PASS', `响应时间: ${responseTime}ms, 内容长度: ${data.length}字节`);
          } else {
            logTest('functionality', name, 'FAIL', `页面内容问题 - 内容: ${hasContent}, 标题: ${hasTitle}, 主体: ${hasBody}, 错误: ${hasErrors}`);
          }
        } else {
          logTest('functionality', name, 'FAIL', `HTTP状态码: ${res.statusCode}`);
        }
        resolve();
      });
    });
    
    req.on('error', (err) => {
      logTest('functionality', name, 'FAIL', `网络错误: ${err.message}`);
      resolve();
    });
    
    req.setTimeout(config.timeout, () => {
      req.destroy();
      logTest('functionality', name, 'FAIL', `请求超时 (${config.timeout}ms)`);
      resolve();
    });
  });
}

// 性能测试
async function testPerformance() {
  log(`\n${colors.bold}⚡ 运行性能测试...${colors.reset}`);
  
  try {
    // 检查内存使用
    const memUsage = process.memoryUsage();
    const memUsageMB = Math.round(memUsage.heapUsed / 1024 / 1024);
    
    if (memUsageMB < 100) {
      logTest('performance', '内存使用', 'PASS', `内存使用: ${memUsageMB}MB`);
    } else {
      logTest('performance', '内存使用', 'FAIL', `内存使用过高: ${memUsageMB}MB`);
    }
    
    // 检查构建文件大小
    if (fs.existsSync('.next')) {
      const buildSize = getDirectorySize('.next');
      const buildSizeMB = Math.round(buildSize / 1024 / 1024);
      
      if (buildSizeMB < 50) {
        logTest('performance', '构建文件大小', 'PASS', `构建大小: ${buildSizeMB}MB`);
      } else {
        logTest('performance', '构建文件大小', 'FAIL', `构建文件过大: ${buildSizeMB}MB`);
      }
    }
    
  } catch (error) {
    logTest('performance', '性能测试', 'FAIL', `性能测试失败: ${error.message}`);
  }
}

// 计算目录大小
function getDirectorySize(dirPath) {
  let totalSize = 0;
  
  function calculateSize(itemPath) {
    const stats = fs.statSync(itemPath);
    if (stats.isDirectory()) {
      const files = fs.readdirSync(itemPath);
      files.forEach(file => {
        calculateSize(path.join(itemPath, file));
      });
    } else {
      totalSize += stats.size;
    }
  }
  
  calculateSize(dirPath);
  return totalSize;
}

// 生成测试报告
function generateReport() {
  log(`\n${colors.bold}📊 生成测试报告...${colors.reset}`);
  
  const report = {
    summary: {
      overall: {
        total: results.overall.total,
        passed: results.overall.passed,
        failed: results.overall.failed,
        passRate: Math.round((results.overall.passed / results.overall.total) * 100)
      },
      categories: {
        eslint: {
          total: results.eslint.total,
          passed: results.eslint.passed,
          failed: results.eslint.failed,
          passRate: Math.round((results.eslint.passed / results.eslint.total) * 100)
        },
        build: {
          total: results.build.total,
          passed: results.build.passed,
          failed: results.build.failed,
          passRate: Math.round((results.build.passed / results.build.total) * 100)
        },
        functionality: {
          total: results.functionality.total,
          passed: results.functionality.passed,
          failed: results.functionality.failed,
          passRate: Math.round((results.functionality.passed / results.functionality.total) * 100)
        },
        performance: {
          total: results.performance.total,
          passed: results.performance.passed,
          failed: results.performance.failed,
          passRate: Math.round((results.performance.passed / results.performance.total) * 100)
        }
      }
    },
    details: results,
    timestamp: new Date().toISOString(),
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      baseUrl: config.baseUrl
    }
  };
  
  // 保存报告
  const reportPath = 'comprehensive-test-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  log(`\n${colors.green}✅ 测试报告已保存到: ${reportPath}${colors.reset}`);
  
  return report;
}

// 显示测试总结
function displaySummary(report) {
  log(`\n${colors.bold}📈 测试总结${colors.reset}`);
  log(`总测试数: ${report.summary.overall.total}`);
  log(`通过数: ${colors.green}${report.summary.overall.passed}${colors.reset}`);
  log(`失败数: ${colors.red}${report.summary.overall.failed}${colors.reset}`);
  log(`通过率: ${colors.blue}${report.summary.overall.passRate}%${colors.reset}`);
  
  log(`\n${colors.bold}📋 分类总结${colors.reset}`);
  Object.entries(report.summary.categories).forEach(([category, data]) => {
    const color = data.passRate >= 80 ? colors.green : data.passRate >= 60 ? colors.yellow : colors.red;
    log(`${category.toUpperCase()}: ${color}${data.passRate}%${colors.reset} (${data.passed}/${data.total})`);
  });
  
  // 上传建议
  log(`\n${colors.bold}🚀 上传GitHub建议${colors.reset}`);
  if (report.summary.overall.passRate >= 80) {
    log(`${colors.green}✅ 测试通过率良好，建议可以上传GitHub${colors.reset}`);
  } else if (report.summary.overall.passRate >= 60) {
    log(`${colors.yellow}⚠️  测试通过率一般，建议修复问题后再上传GitHub${colors.reset}`);
  } else {
    log(`${colors.red}❌ 测试通过率较低，不建议上传GitHub${colors.reset}`);
  }
}

// 主测试函数
async function runComprehensiveTests() {
  log(`${colors.bold}🧪 综合测试套件启动${colors.reset}`);
  log(`测试目标: ${config.baseUrl}`);
  log(`测试时间: ${new Date().toLocaleString()}`);
  
  try {
    // 运行所有测试
    await testESLint();
    await testBuild();
    await testFunctionality();
    await testPerformance();
    
    // 生成报告
    const report = generateReport();
    
    // 显示总结
    displaySummary(report);
    
  } catch (error) {
    log(`\n${colors.red}❌ 测试过程中发生错误: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// 运行测试
if (require.main === module) {
  runComprehensiveTests();
}

module.exports = { runComprehensiveTests };



















