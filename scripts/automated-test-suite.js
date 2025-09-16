#!/usr/bin/env node

const https = require('https');
const http = require('http');
const { performance } = require('perf_hooks');

// 测试配置
const BASE_URL = 'http://localhost:3001';
const TEST_TIMEOUT = 10000; // 10秒超时

// 测试结果存储
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// 测试页面列表
const testPages = [
  { path: '/', name: '主页', critical: true },
  { path: '/en', name: '英文版', critical: true },
  { path: '/zh', name: '中文版', critical: true },
  { path: '/en/health-guide', name: '健康指南', critical: true },
  { path: '/en/health-guide/global-perspectives', name: '全球视角', critical: false },
  { path: '/en/health-guide/myths-facts', name: '误区与事实', critical: false },
  { path: '/en/natural-therapies', name: '自然疗法', critical: false },
  { path: '/en/interactive-tools/pain-tracker', name: '疼痛追踪工具', critical: true },
  { path: '/en/interactive-tools/symptom-assessment', name: '症状评估工具', critical: true },
  { path: '/en/interactive-tools/constitution-test', name: '体质测试工具', critical: true }
];

// 性能测试页面
const performancePages = [
  { path: '/', name: '主页性能' },
  { path: '/en', name: '英文版性能' },
  { path: '/en/health-guide', name: '健康指南性能' }
];

// 工具函数
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logTest(name, status, details = '') {
  const statusColor = status === 'PASS' ? colors.green : colors.red;
  const statusSymbol = status === 'PASS' ? '✅' : '❌';
  
  log(`${statusSymbol} ${name}: ${status}`, statusColor);
  if (details) {
    log(`   ${details}`, colors.yellow);
  }
  
  testResults.total++;
  if (status === 'PASS') {
    testResults.passed++;
  } else {
    testResults.failed++;
  }
  
  testResults.details.push({
    name,
    status,
    details,
    timestamp: new Date().toISOString()
  });
}

// HTTP请求测试
function testPage(url, name, critical = false) {
  return new Promise((resolve) => {
    const startTime = performance.now();
    
    const req = http.get(url, (res) => {
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          // 检查页面内容
          const hasContent = data.length > 1000; // 至少1KB内容
          const hasTitle = data.includes('<title>');
          const hasBody = data.includes('<body>') || data.includes('</body>') || data.includes('__next_f');
          // 更精确的错误检测 - 避免误判JSON数据中的"error"字段
          const hasError = data.includes('Error:') || data.includes('500 Internal Server Error') || data.includes('404 Not Found') || 
                          data.includes('<!DOCTYPE html><html><head><title>Error') || data.includes('<h1>Error</h1>');
          
          if (hasContent && hasTitle && hasBody && !hasError) {
            logTest(name, 'PASS', `响应时间: ${responseTime}ms, 内容长度: ${data.length}字节`);
          } else {
            logTest(name, 'FAIL', `页面内容不完整 - 内容: ${hasContent}, 标题: ${hasTitle}, 主体: ${hasBody}, 错误: ${hasError}`);
          }
        } else {
          logTest(name, 'FAIL', `HTTP状态码: ${res.statusCode}`);
        }
        resolve();
      });
    });
    
    req.on('error', (err) => {
      logTest(name, 'FAIL', `网络错误: ${err.message}`);
      resolve();
    });
    
    req.setTimeout(TEST_TIMEOUT, () => {
      req.destroy();
      logTest(name, 'FAIL', `请求超时 (${TEST_TIMEOUT}ms)`);
      resolve();
    });
  });
}

// 性能测试
function testPerformance(url, name) {
  return new Promise((resolve) => {
    const startTime = performance.now();
    
    const req = http.get(url, (res) => {
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          // 性能评估
          let performanceGrade = 'A';
          if (responseTime > 3000) performanceGrade = 'C';
          else if (responseTime > 1500) performanceGrade = 'B';
          
          logTest(name, 'PASS', `响应时间: ${responseTime}ms (等级: ${performanceGrade})`);
        } else {
          logTest(name, 'FAIL', `HTTP状态码: ${res.statusCode}`);
        }
        resolve();
      });
    });
    
    req.on('error', (err) => {
      logTest(name, 'FAIL', `网络错误: ${err.message}`);
      resolve();
    });
    
    req.setTimeout(TEST_TIMEOUT, () => {
      req.destroy();
      logTest(name, 'FAIL', `请求超时 (${TEST_TIMEOUT}ms)`);
      resolve();
    });
  });
}

// 并发测试
async function runConcurrentTests() {
  log(`\n${colors.bold}🚀 开始并发测试...${colors.reset}`);
  
  const criticalPages = testPages.filter(page => page.critical);
  const nonCriticalPages = testPages.filter(page => !page.critical);
  
  // 先测试关键页面
  log(`\n${colors.blue}📋 测试关键页面 (${criticalPages.length}个)...${colors.reset}`);
  for (const page of criticalPages) {
    await testPage(`${BASE_URL}${page.path}`, page.name, page.critical);
  }
  
  // 再测试非关键页面
  log(`\n${colors.blue}📋 测试非关键页面 (${nonCriticalPages.length}个)...${colors.reset}`);
  for (const page of nonCriticalPages) {
    await testPage(`${BASE_URL}${page.path}`, page.name, page.critical);
  }
}

// 性能测试
async function runPerformanceTests() {
  log(`\n${colors.bold}⚡ 开始性能测试...${colors.reset}`);
  
  for (const page of performancePages) {
    await testPerformance(`${BASE_URL}${page.path}`, page.name);
  }
}

// 生成测试报告
function generateReport() {
  log(`\n${colors.bold}📊 测试报告生成中...${colors.reset}`);
  
  const report = {
    summary: {
      total: testResults.total,
      passed: testResults.passed,
      failed: testResults.failed,
      passRate: Math.round((testResults.passed / testResults.total) * 100)
    },
    details: testResults.details,
    timestamp: new Date().toISOString(),
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      baseUrl: BASE_URL
    }
  };
  
  // 保存报告到文件
  const fs = require('fs');
  const reportPath = 'test-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  log(`\n${colors.green}✅ 测试报告已保存到: ${reportPath}${colors.reset}`);
  
  return report;
}

// 主测试函数
async function runTests() {
  log(`${colors.bold}🧪 自动化测试套件启动${colors.reset}`);
  log(`测试目标: ${BASE_URL}`);
  log(`测试时间: ${new Date().toLocaleString()}`);
  log(`超时设置: ${TEST_TIMEOUT}ms`);
  
  try {
    // 运行并发测试
    await runConcurrentTests();
    
    // 运行性能测试
    await runPerformanceTests();
    
    // 生成报告
    const report = generateReport();
    
    // 显示总结
    log(`\n${colors.bold}📈 测试总结${colors.reset}`);
    log(`总测试数: ${report.summary.total}`);
    log(`通过数: ${colors.green}${report.summary.passed}${colors.reset}`);
    log(`失败数: ${colors.red}${report.summary.failed}${colors.reset}`);
    log(`通过率: ${colors.blue}${report.summary.passRate}%${colors.reset}`);
    
    // 判断是否适合上传GitHub
    if (report.summary.passRate >= 80) {
      log(`\n${colors.green}✅ 测试通过率良好，建议可以上传GitHub${colors.reset}`);
    } else if (report.summary.passRate >= 60) {
      log(`\n${colors.yellow}⚠️  测试通过率一般，建议修复问题后再上传GitHub${colors.reset}`);
    } else {
      log(`\n${colors.red}❌ 测试通过率较低，不建议上传GitHub${colors.reset}`);
    }
    
  } catch (error) {
    log(`\n${colors.red}❌ 测试过程中发生错误: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// 运行测试
if (require.main === module) {
  runTests();
}

module.exports = { runTests, testPage, testPerformance };
