#!/usr/bin/env node

/**
 * SEO监控仪表板
 * 用于监控关键SEO指标和生成报告
 */

const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  baseUrl: 'https://www.periodhub.health',
  reportDir: path.join(__dirname, '..', 'reports'),
  monitoringInterval: 24 * 60 * 60 * 1000, // 24小时
  criticalPages: [
    '/en/articles/effective-herbal-tea-menstrual-pain',
    '/en/scenario-solutions/office',
    '/en/teen-health/development-pain',
    '/en/scenario-solutions/social',
    '/en/articles/when-to-seek-medical-care-comprehensive-guide',
    '/en/articles/period-friendly-recipes',
    '/en/articles/comprehensive-iud-guide',
    '/en/articles/comprehensive-medical-guide-to-dysmenorrhea',
    '/en/articles/anti-inflammatory-diet-period-pain'
  ],
  pdfFiles: [
    '/downloads/menstrual-cycle-nutrition-plan.pdf',
    '/downloads/parent-communication-guide.pdf',
    '/downloads/healthy-habits-checklist.pdf',
    '/downloads/specific-menstrual-pain-management-guide.pdf',
    '/downloads/teacher-collaboration-handbook.pdf'
  ]
};

// 监控指标类
class SEOMonitor {
  constructor() {
    this.metrics = {
      timestamp: new Date().toISOString(),
      pages: {
        total: 0,
        accessible: 0,
        notIndexed: 0,
        errors: 0
      },
      pdfs: {
        total: 0,
        accessible: 0,
        errors: 0
      },
      sitemap: {
        status: 'unknown',
        lastModified: null,
        urlCount: 0
      },
      robots: {
        status: 'unknown',
        iconRules: 0,
        pdfRules: 0
      },
      performance: {
        averageResponseTime: 0,
        slowPages: []
      }
    };
  }

  // 检查页面可访问性
  async checkPageAccessibility() {
    console.log('🔍 检查页面可访问性...');

    const { makeRequest } = require('./seo-fix-verification');

    for (const page of CONFIG.criticalPages) {
      try {
        const response = await makeRequest(`${CONFIG.baseUrl}${page}`);

        this.metrics.pages.total++;

        if (response.status === 200) {
          this.metrics.pages.accessible++;
        } else if (response.status === 404) {
          this.metrics.pages.notIndexed++;
        } else {
          this.metrics.pages.errors++;
        }
      } catch (error) {
        this.metrics.pages.total++;
        this.metrics.pages.errors++;
      }
    }

    console.log(`📊 页面检查完成: ${this.metrics.pages.accessible}/${this.metrics.pages.total} 可访问`);
  }

  // 检查PDF文件
  async checkPdfFiles() {
    console.log('🔍 检查PDF文件...');

    const { makeRequest } = require('./seo-fix-verification');

    for (const pdf of CONFIG.pdfFiles) {
      try {
        const response = await makeRequest(`${CONFIG.baseUrl}${pdf}`);

        this.metrics.pdfs.total++;

        if (response.status === 200) {
          this.metrics.pdfs.accessible++;
        } else {
          this.metrics.pdfs.errors++;
        }
      } catch (error) {
        this.metrics.pdfs.total++;
        this.metrics.pdfs.errors++;
      }
    }

    console.log(`📊 PDF检查完成: ${this.metrics.pdfs.accessible}/${this.metrics.pdfs.total} 可访问`);
  }

  // 检查Sitemap状态
  async checkSitemapStatus() {
    console.log('🔍 检查Sitemap状态...');

    try {
      const response = await fetch(`${CONFIG.baseUrl}/sitemap.xml`);

      if (response.ok) {
        this.metrics.sitemap.status = 'accessible';
        this.metrics.sitemap.lastModified = response.headers.get('last-modified');

        const content = await response.text();
        const urlMatches = content.match(/<url>/g) || [];
        this.metrics.sitemap.urlCount = urlMatches.length;

        console.log(`✅ Sitemap可访问，包含 ${this.metrics.sitemap.urlCount} 个URL`);
      } else {
        this.metrics.sitemap.status = 'error';
        console.log(`❌ Sitemap访问失败: ${response.status}`);
      }
    } catch (error) {
      this.metrics.sitemap.status = 'error';
      console.log(`❌ Sitemap检查失败: ${error.message}`);
    }
  }

  // 检查Robots.txt状态
  async checkRobotsStatus() {
    console.log('🔍 检查Robots.txt状态...');

    try {
      const response = await fetch(`${CONFIG.baseUrl}/robots.txt`);

      if (response.ok) {
        this.metrics.robots.status = 'accessible';

        const content = await response.text();
        const iconRules = content.match(/Disallow:\s*\/icon/g) || [];
        const pdfRules = content.match(/Disallow:\s*\/pdf/g) || [];

        this.metrics.robots.iconRules = iconRules.length;
        this.metrics.robots.pdfRules = pdfRules.length;

        console.log(`✅ Robots.txt可访问，Icon规则: ${this.metrics.robots.iconRules}, PDF规则: ${this.metrics.robots.pdfRules}`);
      } else {
        this.metrics.robots.status = 'error';
        console.log(`❌ Robots.txt访问失败: ${response.status}`);
      }
    } catch (error) {
      this.metrics.robots.status = 'error';
      console.log(`❌ Robots.txt检查失败: ${error.message}`);
    }
  }

  // 计算性能指标
  calculatePerformanceMetrics() {
    const totalPages = this.metrics.pages.total;
    const accessiblePages = this.metrics.pages.accessible;

    if (totalPages > 0) {
      this.metrics.performance.averageResponseTime = (accessiblePages / totalPages) * 100;
    }

    // 识别慢页面（这里简化处理）
    if (this.metrics.pages.errors > 0) {
      this.metrics.performance.slowPages = CONFIG.criticalPages.slice(0, this.metrics.pages.errors);
    }
  }

  // 生成健康评分
  generateHealthScore() {
    let score = 0;
    let maxScore = 0;

    // 页面可访问性 (40分)
    maxScore += 40;
    if (this.metrics.pages.total > 0) {
      score += (this.metrics.pages.accessible / this.metrics.pages.total) * 40;
    }

    // PDF文件可访问性 (20分)
    maxScore += 20;
    if (this.metrics.pdfs.total > 0) {
      score += (this.metrics.pdfs.accessible / this.metrics.pdfs.total) * 20;
    }

    // Sitemap状态 (20分)
    maxScore += 20;
    if (this.metrics.sitemap.status === 'accessible') {
      score += 20;
    }

    // Robots.txt状态 (20分)
    maxScore += 20;
    if (this.metrics.robots.status === 'accessible') {
      score += 20;
    }

    return {
      score: Math.round(score),
      maxScore: maxScore,
      percentage: Math.round((score / maxScore) * 100),
      grade: this.getGrade(score / maxScore)
    };
  }

  getGrade(percentage) {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  }

  // 生成报告
  generateReport() {
    const healthScore = this.generateHealthScore();

    const report = {
      ...this.metrics,
      healthScore,
      recommendations: this.generateRecommendations(),
      nextCheck: new Date(Date.now() + CONFIG.monitoringInterval).toISOString()
    };

    return report;
  }

  // 生成建议
  generateRecommendations() {
    const recommendations = [];

    if (this.metrics.pages.errors > 0) {
      recommendations.push({
        priority: 'HIGH',
        category: '页面可访问性',
        issue: `${this.metrics.pages.errors} 个页面无法访问`,
        action: '检查页面配置和服务器状态'
      });
    }

    if (this.metrics.pdfs.errors > 0) {
      recommendations.push({
        priority: 'MEDIUM',
        category: 'PDF文件',
        issue: `${this.metrics.pdfs.errors} 个PDF文件无法访问`,
        action: '检查PDF文件路径和权限设置'
      });
    }

    if (this.metrics.sitemap.status !== 'accessible') {
      recommendations.push({
        priority: 'HIGH',
        category: 'Sitemap',
        issue: 'Sitemap无法访问',
        action: '检查sitemap.xml配置和服务器状态'
      });
    }

    if (this.metrics.robots.status !== 'accessible') {
      recommendations.push({
        priority: 'HIGH',
        category: 'Robots.txt',
        issue: 'Robots.txt无法访问',
        action: '检查robots.txt配置和服务器状态'
      });
    }

    if (this.metrics.robots.iconRules > 0) {
      recommendations.push({
        priority: 'LOW',
        category: 'Robots.txt',
        issue: '发现Icon相关规则',
        action: '检查Icon规则是否过于宽泛'
      });
    }

    return recommendations;
  }

  // 保存报告
  async saveReport() {
    const report = this.generateReport();

    // 确保报告目录存在
    if (!fs.existsSync(CONFIG.reportDir)) {
      fs.mkdirSync(CONFIG.reportDir, { recursive: true });
    }

    // 保存详细报告
    const reportPath = path.join(CONFIG.reportDir, `seo-monitoring-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // 保存最新报告
    const latestReportPath = path.join(CONFIG.reportDir, 'latest-seo-monitoring.json');
    fs.writeFileSync(latestReportPath, JSON.stringify(report, null, 2));

    console.log(`📋 监控报告已保存: ${reportPath}`);

    return report;
  }

  // 显示仪表板
  displayDashboard(report) {
    console.log('\n📊 SEO监控仪表板');
    console.log('='.repeat(50));

    // 健康评分
    console.log(`\n🏆 健康评分: ${report.healthScore.score}/${report.healthScore.maxScore} (${report.healthScore.percentage}%) - 等级 ${report.healthScore.grade}`);

    // 页面状态
    console.log(`\n📄 页面状态:`);
    console.log(`   总页面数: ${report.pages.total}`);
    console.log(`   可访问: ${report.pages.accessible}`);
    console.log(`   未索引: ${report.pages.notIndexed}`);
    console.log(`   错误: ${report.pages.errors}`);

    // PDF状态
    console.log(`\n📁 PDF文件状态:`);
    console.log(`   总文件数: ${report.pdfs.total}`);
    console.log(`   可访问: ${report.pdfs.accessible}`);
    console.log(`   错误: ${report.pdfs.errors}`);

    // 技术配置
    console.log(`\n⚙️  技术配置:`);
    console.log(`   Sitemap: ${report.sitemap.status}`);
    console.log(`   Robots.txt: ${report.robots.status}`);
    console.log(`   Icon规则: ${report.robots.iconRules}`);
    console.log(`   PDF规则: ${report.robots.pdfRules}`);

    // 建议
    if (report.recommendations.length > 0) {
      console.log(`\n💡 建议:`);
      report.recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. [${rec.priority}] ${rec.category}: ${rec.issue}`);
        console.log(`      行动: ${rec.action}`);
      });
    } else {
      console.log(`\n✅ 所有检查通过，无需特别建议`);
    }

    console.log(`\n⏰ 下次检查: ${new Date(report.nextCheck).toLocaleString()}`);
    console.log('='.repeat(50));
  }

  // 运行监控
  async run() {
    console.log('🚀 开始SEO监控...\n');

    await this.checkPageAccessibility();
    await this.checkPdfFiles();
    await this.checkSitemapStatus();
    await this.checkRobotsStatus();

    this.calculatePerformanceMetrics();

    const report = await this.saveReport();
    this.displayDashboard(report);

    return report;
  }
}

// 主函数
async function main() {
  const monitor = new SEOMonitor();
  await monitor.run();
}

// 运行主函数
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { SEOMonitor, main };
