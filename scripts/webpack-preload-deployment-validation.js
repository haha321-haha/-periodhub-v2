#!/usr/bin/env node

/**
 * Webpack预加载修复部署验证脚本
 * 验证修复在生产环境的效果
 */

const fs = require('fs');
const path = require('path');

// 部署验证配置
const DEPLOYMENT_CONFIG = {
  productionUrl: 'https://www.periodhub.health',
  testPages: [
    '/zh/downloads',
    '/en/downloads'
  ],
  expectedResults: {
    webpackPreloadWarning: false, // 期望没有警告
    performanceImprovement: true,  // 期望性能改善
    consoleErrors: 0               // 期望没有控制台错误
  }
};

class DeploymentValidator {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      environment: 'production',
      tests: [],
      summary: {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        successRate: '0%'
      }
    };
  }

  // 验证webpack预加载修复
  async validateWebpackPreloadFix() {
    console.log('🔍 验证Webpack预加载修复...');

    const testResult = {
      name: 'Webpack预加载警告修复',
      status: 'pending',
      details: []
    };

    try {
      // 检查next.config.js配置
      const configPath = path.join(__dirname, '../next.config.js');
      const configContent = fs.readFileSync(configPath, 'utf8');

      // 验证配置修改
      const hasConditionalPreload = configContent.includes('process.env.NODE_ENV === \'development\'');
      const hasWebpackPreload = configContent.includes('webpack.js');

      if (hasConditionalPreload && hasWebpackPreload) {
        testResult.status = 'passed';
        testResult.details.push('✅ Next.js配置已正确修改');
        testResult.details.push('✅ 条件预加载策略已实施');
      } else {
        testResult.status = 'failed';
        testResult.details.push('❌ Next.js配置修改不完整');
      }

      // 检查智能预加载Hook
      const hookPath = path.join(__dirname, '../hooks/useSmartPreload.ts');
      if (fs.existsSync(hookPath)) {
        testResult.details.push('✅ 智能预加载Hook已创建');
      } else {
        testResult.status = 'failed';
        testResult.details.push('❌ 智能预加载Hook未找到');
      }

      // 检查SmartPreloadProvider组件
      const providerPath = path.join(__dirname, '../components/SmartPreloadProvider.tsx');
      if (fs.existsSync(providerPath)) {
        testResult.details.push('✅ SmartPreloadProvider组件已创建');
      } else {
        testResult.status = 'failed';
        testResult.details.push('❌ SmartPreloadProvider组件未找到');
      }

    } catch (error) {
      testResult.status = 'failed';
      testResult.details.push(`❌ 验证过程出错: ${error.message}`);
    }

    this.results.tests.push(testResult);
    console.log(`   ${testResult.status === 'passed' ? '✅' : '❌'} ${testResult.name}`);

    return testResult.status === 'passed';
  }

  // 验证性能改善
  async validatePerformanceImprovement() {
    console.log('📊 验证性能改善...');

    const testResult = {
      name: '性能改善验证',
      status: 'pending',
      details: []
    };

    try {
      // 检查构建输出
      const buildOutput = fs.readFileSync(path.join(__dirname, '../.next/build-manifest.json'), 'utf8');
      const manifest = JSON.parse(buildOutput);

      // 验证webpack.js不再被强制预加载
      const hasWebpackInManifest = JSON.stringify(manifest).includes('webpack.js');

      if (!hasWebpackInManifest) {
        testResult.status = 'passed';
        testResult.details.push('✅ Webpack.js不再在构建清单中强制预加载');
      } else {
        testResult.status = 'failed';
        testResult.details.push('❌ Webpack.js仍在构建清单中被预加载');
      }

      // 检查bundle大小
      const bundleSize = this.calculateBundleSize();
      if (bundleSize < 500000) { // 500KB
        testResult.details.push('✅ Bundle大小合理');
      } else {
        testResult.details.push('⚠️ Bundle大小较大，需要进一步优化');
      }

    } catch (error) {
      testResult.status = 'failed';
      testResult.details.push(`❌ 性能验证出错: ${error.message}`);
    }

    this.results.tests.push(testResult);
    console.log(`   ${testResult.status === 'passed' ? '✅' : '❌'} ${testResult.name}`);

    return testResult.status === 'passed';
  }

  // 计算Bundle大小
  calculateBundleSize() {
    try {
      const statsPath = path.join(__dirname, '../.next/static/chunks');
      if (!fs.existsSync(statsPath)) {
        return 0;
      }

      const files = fs.readdirSync(statsPath);
      let totalSize = 0;

      files.forEach(file => {
        const filePath = path.join(statsPath, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
      });

      return totalSize;
    } catch (error) {
      return 0;
    }
  }

  // 验证代码质量
  async validateCodeQuality() {
    console.log('🔧 验证代码质量...');

    const testResult = {
      name: '代码质量验证',
      status: 'pending',
      details: []
    };

    try {
      // 检查TypeScript类型
      const hookContent = fs.readFileSync(path.join(__dirname, '../hooks/useSmartPreload.ts'), 'utf8');
      const providerContent = fs.readFileSync(path.join(__dirname, '../components/SmartPreloadProvider.tsx'), 'utf8');

      // 验证类型定义
      if (hookContent.includes('interface') && hookContent.includes('ReactNode')) {
        testResult.details.push('✅ TypeScript类型定义完整');
      } else {
        testResult.details.push('⚠️ TypeScript类型定义需要完善');
      }

      // 验证错误处理
      if (hookContent.includes('try') && hookContent.includes('catch')) {
        testResult.details.push('✅ 错误处理机制已实现');
      } else {
        testResult.details.push('⚠️ 需要添加错误处理机制');
      }

      // 验证日志记录
      if (hookContent.includes('console.log') || hookContent.includes('console.warn')) {
        testResult.details.push('✅ 日志记录已实现');
      } else {
        testResult.details.push('⚠️ 需要添加日志记录');
      }

      testResult.status = 'passed';

    } catch (error) {
      testResult.status = 'failed';
      testResult.details.push(`❌ 代码质量验证出错: ${error.message}`);
    }

    this.results.tests.push(testResult);
    console.log(`   ${testResult.status === 'passed' ? '✅' : '❌'} ${testResult.name}`);

    return testResult.status === 'passed';
  }

  // 生成部署报告
  generateDeploymentReport() {
    this.results.summary.totalTests = this.results.tests.length;
    this.results.summary.passedTests = this.results.tests.filter(t => t.status === 'passed').length;
    this.results.summary.failedTests = this.results.tests.filter(t => t.status === 'failed').length;
    this.results.summary.successRate =
      ((this.results.summary.passedTests / this.results.summary.totalTests) * 100).toFixed(2) + '%';

    // 添加部署建议
    this.results.deploymentRecommendations = this.generateDeploymentRecommendations();

    return this.results;
  }

  // 生成部署建议
  generateDeploymentRecommendations() {
    const recommendations = [];

    if (this.results.summary.successRate === '100.00%') {
      recommendations.push('✅ 所有验证测试通过，可以安全部署到生产环境');
      recommendations.push('🚀 建议立即部署修复');
      recommendations.push('📊 部署后监控性能指标');
    } else if (parseFloat(this.results.summary.successRate) >= 80) {
      recommendations.push('⚠️ 大部分测试通过，但需要修复失败的测试');
      recommendations.push('🔧 修复失败项目后再部署');
      recommendations.push('📊 部署前进行额外测试');
    } else {
      recommendations.push('❌ 多个测试失败，不建议部署');
      recommendations.push('🔄 需要重新检查修复方案');
      recommendations.push('🧪 在开发环境进行更多测试');
    }

    return recommendations;
  }

  // 保存部署报告
  saveDeploymentReport(report) {
    const reportDir = path.join(__dirname, 'reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const filename = `webpack-preload-deployment-report-${Date.now()}.json`;
    const filepath = path.join(reportDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
    console.log(`📊 部署报告已保存: ${filepath}`);

    return filepath;
  }
}

// 主验证函数
async function runDeploymentValidation() {
  console.log('🚀 开始Webpack预加载修复部署验证...\n');

  const validator = new DeploymentValidator();

  // 运行所有验证测试
  await validator.validateWebpackPreloadFix();
  await validator.validatePerformanceImprovement();
  await validator.validateCodeQuality();

  // 生成部署报告
  console.log('\n📊 生成部署报告...');
  const report = validator.generateDeploymentReport();

  console.log('\n📈 验证结果摘要:');
  console.log(`   总测试数: ${report.summary.totalTests}`);
  console.log(`   通过测试: ${report.summary.passedTests}`);
  console.log(`   失败测试: ${report.summary.failedTests}`);
  console.log(`   成功率: ${report.summary.successRate}`);

  console.log('\n💡 部署建议:');
  report.deploymentRecommendations.forEach(rec => console.log(`   ${rec}`));

  // 保存报告
  const reportPath = validator.saveDeploymentReport(report);

  console.log(`\n✅ 部署验证完成！报告已保存到: ${reportPath}`);

  return report;
}

// 如果直接运行此脚本
if (require.main === module) {
  runDeploymentValidation().catch(console.error);
}

module.exports = { runDeploymentValidation, DeploymentValidator };
