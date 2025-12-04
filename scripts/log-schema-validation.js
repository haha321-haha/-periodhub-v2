#!/usr/bin/env node

/**
 * Schema Validation Logger (Fixed Version)
 * 
 * 将验证结果记录到 CI_WORKFLOW_VERIFICATION_REPORT.md 和 logs/schema-validation.log
 * 
 * 使用方法:
 * node scripts/log-schema-validation.js \
 *   --page "/zh/articles/.../dysmenorrhea" \
 *   --schema "MedicalWebPage" \
 *   --tool "Google Rich Results Test" \
 *   --result "✅ 通过" \
 *   --issues "-" \
 *   --priority "low" \
 *   --notes "Footer claim verified"
 */

const fs = require('fs');
const path = require('path');

// 解析命令行参数
function parseArgs() {
  const args = process.argv.slice(2);
  const params = {};
  
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, '');
    const value = args[i + 1];
    params[key] = value;
  }
  
  // 设置默认值
  return {
    page: params.page || '',
    schema: params.schema || '',
    tool: params.tool || 'Google Rich Results Test',
    result: params.result || '待验证',
    issues: params.issues || '-',
    priority: params.priority || 'medium',
    notes: params.notes || '-',
    date: new Date().toISOString().split('T')[0]
  };
}

// 获取表格行
function getTableRow(params) {
  return `| ${params.date} | ${params.page} | ${params.schema} | ${params.tool} | ${params.result} | ${params.issues} | ${params.priority} | ${params.notes} |\n`;
}

// 更新 CI 报告
function updateCiReport(params) {
  const reportPath = path.join(process.cwd(), 'CI_WORKFLOW_VERIFICATION_REPORT.md');
  
  if (!fs.existsSync(reportPath)) {
    console.error('❌ CI_WORKFLOW_VERIFICATION_REPORT.md 文件不存在');
    return false;
  }
  
  const content = fs.readFileSync(reportPath, 'utf8');
  const tableStart = '<!-- VALIDATION_TABLE_START -->';
  const tableEnd = '<!-- VALIDATION_TABLE_END -->';
  
  const startIndex = content.indexOf(tableStart);
  const endIndex = content.indexOf(tableEnd);
  
  if (startIndex === -1 || endIndex === -1) {
    console.error('❌ 无法找到验证表格标记');
    return false;
  }
  
  const tableContent = content.substring(startIndex, endIndex);
  
  // 查找表头
  const tableHeader = '| 日期 | 页面 | Schema 类型 | 验证工具 | 结果 | 主要问题 | 优先级 | 备注 |';
  const tableHeaderIndex = tableContent.indexOf(tableHeader);
  
  if (tableHeaderIndex === -1) {
    console.error('❌ 无法找到表头');
    return false;
  }
  
  // 检查页面是否已存在
  const existingPageRegex = new RegExp(`\\| ${params.page.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\|`, 'g');
  const pageExists = existingPageRegex.test(tableContent);
  
  let newTableContent;
  if (pageExists) {
    // 更新现有行
    const rowRegex = new RegExp(`\\| [^|]*\\| ${params.page.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\|[^|]*\\|[^|]*\\|[^|]*\\|[^|]*\\|[^|]*\\|[^|]*\\|`, 'g');
    newTableContent = tableContent.replace(rowRegex, getTableRow(params).trim());
    console.log(`✅ 更新现有页面记录: ${params.page}`);
  } else {
    // 添加新行 - 在表头后添加
    const separatorRow = '|------|------|-------------|----------|------|----------|--------|------|';
    const separatorIndex = tableContent.indexOf(separatorRow, tableHeaderIndex);
    const insertPosition = separatorIndex + separatorRow.length + 1;
    
    newTableContent = tableContent.substring(0, insertPosition) + '\n' + getTableRow(params) + tableContent.substring(insertPosition);
    console.log(`✅ 添加新页面记录: ${params.page}`);
  }
  
  // 更新文件内容
  const beforeTable = content.substring(0, startIndex);
  const afterTable = content.substring(endIndex);
  const newContent = beforeTable + newTableContent + afterTable;
  
  fs.writeFileSync(reportPath, newContent);
  return true;
}

// 写入验证日志
function writeToLog(params) {
  const logDir = path.join(process.cwd(), 'logs');
  const logPath = path.join(logDir, 'schema-validation.log');
  const trendJsonPath = path.join(logDir, 'schema-validation-trend.json');
  
  // 确保 logs 目录存在
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  const logEntry = `[${new Date().toISOString()}] page=${params.page} | schema=${params.schema} | tool=${params.tool} | result=${params.result} | issues=${params.issues} | priority=${params.priority} | notes=${params.notes}\n`;
  
  fs.appendFileSync(logPath, logEntry);
  console.log(`📝 日志已写入: ${logPath}`);
  
  // 生成趋势 JSON 数据
  updateTrendData(trendJsonPath);
  console.log(`📊 趋势数据已更新: ${trendJsonPath}`);
  
  return true;
}

// 更新趋势 JSON 数据
function updateTrendData(trendJsonPath) {
  const logPath = path.join(process.cwd(), 'logs/schema-validation.log');
  
  if (!fs.existsSync(logPath)) {
    return createEmptyTrendData();
  }

  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.trim().split('\n').filter(line => line.trim());
  
  const validations = [];
  const dailyScores = new Map();
  const issuesMap = new Map();
  
  lines.forEach(line => {
    // 解析日志行
    const match = line.match(/^\[([^\]]+)\] page=([^|]+) \| schema=([^|]+) \| tool=([^|]+) \| result=([^|]+) \| issues=([^|]+) \| priority=([^|]+) \| notes=(.+)$/);
    
    if (match) {
      const [, date, page, schema, tool, result, issues, priority, notes] = match;
      const day = date.split('T')[0];
      
      // 计算分数
      let score = 0;
      if (result.includes('✅') || result.includes('通过')) {
        score = 100;
      } else if (result.includes('⚠️') || result.includes('警告')) {
        score = 80;
      } else if (result.includes('❌') || result.includes('失败')) {
        score = 60;
      }
      
      // 从备注中提取分数（如果有）
      const scoreMatch = notes.match(/分数[：:]\s*(\d+)/);
      if (scoreMatch) {
        score = parseInt(scoreMatch[1]);
      }
      
      const validation = {
        date,
        page: page.trim(),
        schema,
        tool,
        result,
        issues: issues.trim(),
        priority,
        notes: notes.trim(),
        score
      };
      
      validations.push(validation);
      
      // 统计每日分数
      if (!dailyScores.has(day)) {
        dailyScores.set(day, []);
      }
      dailyScores.get(day).push(score);
      
      // 统计常见问题
      if (issues && issues !== '-' && issues.trim()) {
        if (!issuesMap.has(issues)) {
          issuesMap.set(issues, { count: 0, pages: new Set() });
        }
        const issueData = issuesMap.get(issues);
        issueData.count++;
        issueData.pages.add(page.trim());
      }
    }
  });
  
  // 计算每日趋势
  const dailyTrends = [];
  dailyScores.forEach((scores, date) => {
    const dayValidations = validations.filter(v => v.date.startsWith(date));
    const passed = dayValidations.filter(v => v.result.includes('✅') || v.result.includes('通过')).length;
    const warnings = dayValidations.filter(v => v.result.includes('⚠️') || v.result.includes('警告')).length;
    const failed = dayValidations.filter(v => v.result.includes('❌') || v.result.includes('失败')).length;
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    dailyTrends.push({
      date,
      passed,
      warnings,
      failed,
      averageScore: Math.round(averageScore * 10) / 10
    });
  });
  
  // 按日期排序
  dailyTrends.sort((a, b) => a.date.localeCompare(b.date));
  
  // 只保留最近7天的趋势
  const last7Days = dailyTrends.slice(-7);
  
  // 统计常见问题
  const commonIssues = Array.from(issuesMap.entries())
    .map(([issue, data]) => ({
      issue,
      count: data.count,
      affectedPages: Array.from(data.pages)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // 计算总体数据
  const totalPages = validations.length;
  const passedPages = validations.filter(v => v.result.includes('✅') || v.result.includes('通过')).length;
  const warningPages = validations.filter(v => v.result.includes('⚠️') || v.result.includes('警告')).length;
  const failedPages = validations.filter(v => v.result.includes('❌') || v.result.includes('失败')).length;
  const averageScore = validations.reduce((sum, v) => sum + (v.score || 0), 0) / totalPages;
  
  const trendData = {
    lastUpdated: new Date().toISOString(),
    totalPages,
    passedPages,
    warningPages,
    failedPages,
    averageScore: Math.round(averageScore * 10) / 10,
    commonIssues,
    dailyTrends: last7Days
  };
  
  // 写入 JSON 文件
  fs.writeFileSync(trendJsonPath, JSON.stringify(trendData, null, 2));
  
  return trendData;
}

// 显示帮助信息
function showHelp() {
  console.log(`
Schema Validation Logger

使用方法:
  node scripts/log-schema-validation.js \\
    --page "/zh/articles/.../dysmenorrhea" \\
    --schema "MedicalWebPage" \\
    --tool "Google Rich Results Test" \\
    --result "✅ 通过" \\
    --issues "-" \\
    --priority "low" \\
    --notes "Footer claim verified"

参数说明:
  --page      页面路径 (必需)
  --schema    Schema 类型 (必需)
  --tool      验证工具 (默认: Google Rich Results Test)
  --result    验证结果 (默认: 待验证)
  --issues    发现的问题 (默认: -)
  --priority  优先级 (low/medium/high, 默认: medium)
  --notes     备注 (默认: -)

示例:
  # 记录成功验证
  node scripts/log-schema-validation.js \\
    --page "/zh/articles/comprehensive-medical-guide-to-dysmenorrhea" \\
    --schema "MedicalWebPage" \\
    --result "✅ 通过"

  # 记录验证失败
  node scripts/log-schema-validation.js \\
    --page "/zh/interactive-tools/symptom-assessment" \\
    --schema "SoftwareApplication" \\
    --result "❌ 失败" \\
    --issues "缺少 potentialAction 字段" \\
    --priority "high"
`);
}

// 主函数
function main() {
  // 检查是否请求帮助
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    showHelp();
    return;
  }
  
  const params = parseArgs();
  
  // 验证必需参数
  if (!params.page || !params.schema) {
    console.error('❌ 缺少必需参数: --page 和 --schema');
    console.error('使用 --help 查看使用说明');
    process.exit(1);
  }
  
  console.log('🔍 开始记录 Schema 验证结果...');
  console.log(`📄 页面: ${params.page}`);
  console.log(`🏗️  Schema: ${params.schema}`);
  console.log(`🔧 工具: ${params.tool}`);
  console.log(`📊 结果: ${params.result}`);
  
  // 更新 CI 报告
  const reportUpdated = updateCiReport(params);
  
  // 写入日志
  const logWritten = writeToLog(params);
  
  if (reportUpdated && logWritten) {
    console.log('\n✅ 验证结果记录成功!');
    
    // 显示 AEOMonitoringSystem 集成提示
    console.log('\n💡 AEOMonitoringSystem 集成提示:');
    console.log('CI 调用 AEOValidationSystem.validateSchema() 时，应该把 score/errors 写入同一份报告，确保与监控系统保持一致。');
  } else {
    console.error('\n❌ 验证结果记录失败!');
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  parseArgs,
  getTableRow,
  updateCiReport,
  writeToLog
};