#!/usr/bin/env node

/**
 * AEO 监控系统同步脚本
 * 
 * 将 CI_WORKFLOW_VERIFICATION_REPORT.md 中的验证结果同步到 AEO 监控报告
 * 确保监控系统与 CI 验证结果保持一致
 */

const fs = require('fs');
const path = require('path');

// 导入 AEOMonitoringSystem
const AEOMonitoringSystem = require('../lib/seo/aeo-monitoring-system.js');

/**
 * 同步验证结果到监控系统
 */
function syncValidationResults() {
  console.log('🔄 开始同步验证结果到 AEO 监控系统...');
  
  try {
    // 1. 解析日志生成趋势数据
    console.log('📊 分析验证日志...');
    const trendData = AEOMonitoringSystem.parseValidationLog();
    
    // 2. 更新监控报告
    console.log('📝 更新监控报告...');
    const reportUpdated = AEOMonitoringSystem.updateMonitoringReport();
    
    if (reportUpdated) {
      console.log('✅ 验证结果已成功同步到 AEO 监控系统');
      
      // 显示简要统计
      if (trendData.totalPages > 0) {
        console.log('\n📈 验证趋势摘要:');
        console.log(`   总页面数: ${trendData.totalPages}`);
        console.log(`   平均分数: ${trendData.averageScore.toFixed(1)}`);
        console.log(`   通过率: ${(trendData.passedPages / trendData.totalPages * 100).toFixed(1)}%`);
        
        if (trendData.commonIssues.length > 0) {
          console.log(`   最常见问题: "${trendData.commonIssues[0].issue}" (${trendData.commonIssues[0].count}次)`);
        }
      }
      
      // 显示报告路径
      const reportPath = path.join(process.cwd(), 'reports/AEO-Monitoring-Report.html');
      console.log(`\n📄 监控报告路径: ${reportPath}`);
      
      return true;
    } else {
      console.error('❌ 同步失败：无法更新监控报告');
      return false;
    }
  } catch (error) {
    console.error('❌ 同步过程中发生错误:', error);
    return false;
  }
}

/**
 * 从 CI 报告中解析验证表格
 */
function parseCiValidationTable() {
  const reportPath = path.join(process.cwd(), 'CI_WORKFLOW_VERIFICATION_REPORT.md');
  
  if (!fs.existsSync(reportPath)) {
    console.warn('⚠️ CI_WORKFLOW_VERIFICATION_REPORT.md 不存在');
    return [];
  }
  
  const content = fs.readFileSync(reportPath, 'utf8');
  const tableStart = '<!-- VALIDATION_TABLE_START -->';
  const tableEnd = '<!-- VALIDATION_TABLE_END -->';
  
  const startIndex = content.indexOf(tableStart);
  const endIndex = content.indexOf(tableEnd);
  
  if (startIndex === -1 || endIndex === -1) {
    console.warn('⚠️ 无法找到验证表格标记');
    return [];
  }
  
  const tableContent = content.substring(startIndex, endIndex);
  const lines = tableContent.split('\n').filter(line => line.trim());
  
  // 查找表头位置
  const headerIndex = lines.findIndex(line => 
    line.includes('日期') && line.includes('页面') && line.includes('Schema 类型')
  );
  
  if (headerIndex === -1) {
    console.warn('⚠️ 无法找到表格头');
    return [];
  }
  
  // 解析表格行
  const validations = [];
  for (let i = headerIndex + 2; i < lines.length; i++) { // 跳过分隔符行
    const line = lines[i].trim();
    if (!line.startsWith('|')) break; // 表格结束
    
    const cols = line.split('|').map(col => col.trim()).filter(col => col);
    if (cols.length >= 7) {
      validations.push({
        date: cols[0],
        page: cols[1],
        schema: cols[2],
        tool: cols[3],
        result: cols[4],
        issues: cols[5],
        priority: cols[6],
        notes: cols[7] || ''
      });
    }
  }
  
  return validations;
}

/**
 * 检查是否需要重新生成报告
 */
function shouldRegenerateReport() {
  const reportPath = path.join(process.cwd(), 'reports/AEO-Monitoring-Report.html');
  const logPath = path.join(process.cwd(), 'logs/schema-validation.log');
  
  // 如果任一文件不存在，需要生成
  if (!fs.existsSync(reportPath) || !fs.existsSync(logPath)) {
    return true;
  }
  
  // 检查修改时间
  const reportStat = fs.statSync(reportPath);
  const logStat = fs.statSync(logPath);
  
  // 如果日志比报告更新，需要重新生成
  return logStat.mtime > reportStat.mtime;
}

/**
 * 主函数
 */
function main() {
  // 检查是否需要重新生成
  if (!shouldRegenerateReport()) {
    console.log('ℹ️ 监控报告已是最新版本，无需重新生成');
    console.log('使用 --force 强制重新生成');
    return;
  }
  
  // 显示帮助信息
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(`
AEO 监控系统同步脚本

使用方法:
  node scripts/sync-to-aeo-monitoring.js [选项]

选项:
  --force     强制重新生成报告
  --help      显示帮助信息

功能:
  将验证结果同步到 AEO 监控系统
  生成包含趋势分析的监控报告
  分析常见问题并提供改进建议
`);
    return;
  }
  
  // 同步验证结果
  const success = syncValidationResults();
  
  if (success) {
    console.log('\n🎉 AEO 监控系统同步完成！');
    
    // 提供后续操作建议
    console.log('\n💡 后续操作建议:');
    console.log('1. 在 GitHub Actions 中添加此脚本作为验证步骤');
    console.log('2. 配置报告自动部署到预览环境');
    console.log('3. 设置定时任务定期更新监控数据');
  } else {
    console.error('\n❌ 同步失败，请检查错误信息');
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  syncValidationResults,
  parseCiValidationTable,
  shouldRegenerateReport
};