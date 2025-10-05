#!/usr/bin/env node

/**
 * 生产环境性能日志分析脚本
 * 用于分析Vercel函数日志中的性能数据
 */

// 模拟日志分析（实际使用时需要从Vercel获取真实日志）
function analyzeProductionLogs(logData) {
  console.log('=== 生产环境性能分析 ===\n');

  const metrics = {
    coldStarts: [],
    warmStarts: [],
    articleFetchTimes: [],
    relatedArticlesTimes: [],
    renderPrepTimes: [],
    errors: []
  };

  // 解析日志数据（示例结构）
  logData.forEach(log => {
    if (log.includes('[PROD-MONITOR]')) {
      if (log.includes('Cold start detected')) {
        const time = extractTime(log);
        metrics.coldStarts.push(time);
      } else if (log.includes('Warm start')) {
        const time = extractTime(log);
        metrics.warmStarts.push(time);
      } else if (log.includes('Article fetch:')) {
        const time = extractTime(log);
        metrics.articleFetchTimes.push(time);
      } else if (log.includes('Related articles calculation:')) {
        const time = extractTime(log);
        metrics.relatedArticlesTimes.push(time);
      } else if (log.includes('Render preparation completed:')) {
        const time = extractTime(log);
        metrics.renderPrepTimes.push(time);
      } else if (log.includes('Error in ArticlePage after')) {
        const time = extractTime(log);
        metrics.errors.push(time);
      }
    }
  });

  // 分析结果
  console.log('📊 性能指标统计：');
  console.log(`冷启动次数: ${metrics.coldStarts.length}`);
  console.log(`热启动次数: ${metrics.warmStarts.length}`);
  console.log(`错误次数: ${metrics.errors.length}`);

  if (metrics.articleFetchTimes.length > 0) {
    console.log(`\n📄 文章获取时间:`);
    console.log(`  平均: ${average(metrics.articleFetchTimes).toFixed(2)}ms`);
    console.log(`  中位数: ${median(metrics.articleFetchTimes).toFixed(2)}ms`);
    console.log(`  最大值: ${Math.max(...metrics.articleFetchTimes).toFixed(2)}ms`);
    console.log(`  最小值: ${Math.min(...metrics.articleFetchTimes).toFixed(2)}ms`);
  }

  if (metrics.relatedArticlesTimes.length > 0) {
    console.log(`\n🔗 相关文章计算时间:`);
    console.log(`  平均: ${average(metrics.relatedArticlesTimes).toFixed(2)}ms`);
    console.log(`  中位数: ${median(metrics.relatedArticlesTimes).toFixed(2)}ms`);
    console.log(`  最大值: ${Math.max(...metrics.relatedArticlesTimes).toFixed(2)}ms`);
    console.log(`  最小值: ${Math.min(...metrics.relatedArticlesTimes).toFixed(2)}ms`);
  }

  if (metrics.renderPrepTimes.length > 0) {
    console.log(`\n🎨 渲染准备时间:`);
    console.log(`  平均: ${average(metrics.renderPrepTimes).toFixed(2)}ms`);
    console.log(`  中位数: ${median(metrics.renderPrepTimes).toFixed(2)}ms`);
    console.log(`  最大值: ${Math.max(...metrics.renderPrepTimes).toFixed(2)}ms`);
    console.log(`  最小值: ${Math.min(...metrics.renderPrepTimes).toFixed(2)}ms`);
  }

  // 分析冷启动vs热启动的影响
  if (metrics.coldStarts.length > 0 && metrics.warmStarts.length > 0) {
    console.log(`\n❄️ 冷启动 vs 🔥 热启动影响:`);
    console.log(`  冷启动平均初始化: ${average(metrics.coldStarts).toFixed(2)}ms`);
    console.log(`  热启动平均检查: ${average(metrics.warmStarts).toFixed(2)}ms`);
    console.log(`  差异: ${(average(metrics.coldStarts) - average(metrics.warmStarts)).toFixed(2)}ms`);
  }

  // 错误分析
  if (metrics.errors.length > 0) {
    console.log(`\n❌ 错误分析:`);
    console.log(`  错误发生时间分布:`);
    metrics.errors.forEach((time, index) => {
      console.log(`    错误 ${index + 1}: ${time}ms`);
    });
    console.log(`  平均错误发生时间: ${average(metrics.errors).toFixed(2)}ms`);
  }

  // 生成建议
  console.log(`\n💡 优化建议:`);

  if (metrics.coldStarts.length > metrics.warmStarts.length) {
    console.log(`  - 冷启动频率高 (${metrics.coldStarts.length}/${metrics.coldStarts.length + metrics.warmStarts.length})，考虑预热策略`);
  }

  if (metrics.relatedArticlesTimes.some(time => time > 1000)) {
    console.log(`  - 相关文章计算存在超过1秒的情况，需要优化或缓存`);
  }

  if (metrics.renderPrepTimes.some(time => time > 5000)) {
    console.log(`  - 渲染准备时间存在超过5秒的情况，可能导致超时`);
  }

  const errorRate = metrics.errors.length / (metrics.coldStarts.length + metrics.warmStarts.length) * 100;
  if (errorRate > 5) {
    console.log(`  - 错误率 ${errorRate.toFixed(1)}% 较高，需要重点关注`);
  }
}

function extractTime(logString) {
  const match = logString.match(/(\d+(?:\.\d+)?)ms/);
  return match ? parseFloat(match[1]) : 0;
}

function average(arr) {
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

function median(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

// 示例用法（实际使用时替换为真实日志数据）
const sampleLogs = [
  '[PROD-MONITOR] Cold start detected - initialization: 1200ms',
  '[PROD-MONITOR] Article fetch: 45ms',
  '[PROD-MONITOR] Related articles calculation: 850ms',
  '[PROD-MONITOR] Render preparation completed: 2100ms',
  '[PROD-MONITOR] Warm start - check: 2ms',
  '[PROD-MONITOR] Article fetch: 32ms',
  '[PROD-MONITOR] Related articles calculation: 1200ms',
  '[PROD-MONITOR] Error in ArticlePage after 8500ms: Timeout',
];

if (require.main === module) {
  console.log('生产环境性能日志分析工具');
  console.log('================================\n');
  console.log('示例分析（使用模拟数据）：\n');
  analyzeProductionLogs(sampleLogs);
  console.log('\n📝 使用说明：');
  console.log('1. 部署带有监控代码的版本到生产环境');
  console.log('2. 从Vercel Dashboard获取函数日志');
  console.log('3. 将日志数据传入此脚本进行分析');
  console.log('4. 基于分析结果确定优化方向');
}

module.exports = { analyzeProductionLogs };
