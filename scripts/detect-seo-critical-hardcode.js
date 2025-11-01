#!/usr/bin/env node

/**
 * SEO关键页面硬编码检测脚本
 * 专门检测对SEO影响最大的P0页面
 * 基于零硬编码开发标准体系
 */

const fs = require('fs');
const path = require('path');

// SEO关键页面配置
const SEO_CRITICAL_PAGES = {
  // P0页面 - 最高优先级
  p0: [
    'app/[locale]/page.tsx',                    // 首页
    'app/[locale]/interactive-tools/page.tsx', // Interactive Tools
    'app/[locale]/scenario-solutions/page.tsx', // Scenario Solutions
    'app/[locale]/health-guide/page.tsx',      // Health Guide
    'app/[locale]/teen-health/page.tsx',       // Teen Health
    'app/[locale]/natural-therapies/page.tsx', // Natural Therapies
  ],
  
  // P1页面 - 高优先级
  p1: [
    'app/[locale]/articles/[slug]/page.tsx',   // 文章页面
    'app/[locale]/downloads/page.tsx',         // Downloads
    'app/[locale]/privacy-policy/page.tsx',    // Privacy Policy
    'app/[locale]/terms-of-service/page.tsx',  // Terms of Service
  ],
  
  // P2页面 - 中优先级
  p2: [
    'app/[locale]/stress-management/page.tsx', // Stress Management
    'app/[locale]/data-dashboard/page.tsx',    // Data Dashboard
    'app/[locale]/framework-demo/page.tsx',    // Framework Demo
  ]
};

// 硬编码检测模式
const HARDCODE_PATTERNS = {
  // 中文硬编码
  chineseText: /[\u4e00-\u9fff]+/g,
  
  // Locale判断
  localeCheck: /locale\s*===\s*['"]zh['"]/g,
  
  // 硬编码字符串
  hardcodedStrings: /['"`]([\u4e00-\u9fff\s]+)['"`]/g,
  
  // Metadata中的硬编码
  metadataHardcode: /(title|description|keywords):\s*['"`]([\u4e00-\u9fff\s]+)['"`]/g,
  
  // 组件中的硬编码
  componentHardcode: />([\u4e00-\u9fff\s]+)</g,
};

// 允许的模式（不需要修复）
const ALLOWED_PATTERNS = [
  /locale\s*===\s*['"]zh['"]/, // Locale判断可以保留
  /console\.log/,              // 调试日志
  /\/\*.*?\*\//gs,            // 注释
  /\/\/.*$/gm,                // 单行注释
  /import.*from/,             // 导入语句
  /export.*from/,             // 导出语句
  /useTranslations\(/,        // 翻译函数调用
  /getTranslations\(/,        // 翻译函数调用
  /t\(['"`][^'"`]+['"`]\)/,  // 翻译键使用
];

class SEOCriticalHardcodeDetector {
  constructor() {
    this.results = {
      p0: { total: 0, files: [], issues: [] },
      p1: { total: 0, files: [], issues: [] },
      p2: { total: 0, files: [], issues: [] },
      summary: {
        totalFiles: 0,
        totalIssues: 0,
        criticalIssues: 0,
        highPriorityIssues: 0,
        mediumPriorityIssues: 0
      }
    };
  }

  // 检查是否为允许的模式
  isAllowedPattern(content, match) {
    return ALLOWED_PATTERNS.some(pattern => {
      const beforeMatch = content.substring(0, match.index);
      return pattern.test(beforeMatch + match[0]);
    });
  }

  // 检测文件中的硬编码
  detectHardcodeInFile(filePath, priority) {
    if (!fs.existsSync(filePath)) {
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    let totalIssues = 0;

    // 检测各种硬编码模式
    Object.entries(HARDCODE_PATTERNS).forEach(([type, pattern]) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        // 跳过允许的模式
        if (this.isAllowedPattern(content, match)) {
          continue;
        }

        const lineNumber = content.substring(0, match.index).split('\n').length;
        const lineContent = content.split('\n')[lineNumber - 1]?.trim() || '';
        
        issues.push({
          type,
          line: lineNumber,
          match: match[0],
          content: lineContent,
          file: filePath,
          priority
        });
        
        totalIssues++;
      }
    });

    if (totalIssues > 0) {
      this.results[priority].files.push(filePath);
      this.results[priority].issues.push(...issues);
      this.results[priority].total += totalIssues;
      this.results.summary.totalIssues += totalIssues;
      
      if (priority === 'p0') {
        this.results.summary.criticalIssues += totalIssues;
      } else if (priority === 'p1') {
        this.results.summary.highPriorityIssues += totalIssues;
      } else {
        this.results.summary.mediumPriorityIssues += totalIssues;
      }
    }

    this.results.summary.totalFiles++;
  }

  // 扫描所有SEO关键页面
  scanSEOCriticalPages() {
    console.log('🚀 开始SEO关键页面硬编码检测...\n');

    Object.entries(SEO_CRITICAL_PAGES).forEach(([priority, files]) => {
      console.log(`📂 扫描 ${priority.toUpperCase()} 页面 (${files.length}个文件):`);
      
      files.forEach(file => {
        console.log(`   📄 ${file}`);
        this.detectHardcodeInFile(file, priority);
      });
      
      console.log(`   ✅ ${priority.toUpperCase()} 页面扫描完成\n`);
    });
  }

  // 生成检测报告
  generateReport() {
    console.log('🎯 SEO关键页面硬编码检测报告');
    console.log('==================================================\n');

    // 统计信息
    console.log('📊 统计信息:');
    console.log(`   - 扫描文件: ${this.results.summary.totalFiles}`);
    console.log(`   - 发现问题: ${this.results.summary.totalIssues}`);
    console.log(`   - P0关键问题: ${this.results.summary.criticalIssues}`);
    console.log(`   - P1高优先级问题: ${this.results.summary.highPriorityIssues}`);
    console.log(`   - P2中优先级问题: ${this.results.summary.mediumPriorityIssues}\n`);

    // 按优先级显示问题
    Object.entries(this.results).forEach(([priority, data]) => {
      if (priority === 'summary' || data.total === 0) return;

      console.log(`📁 ${priority.toUpperCase()} 页面问题 (${data.total}个):\n`);

      data.files.forEach(file => {
        const fileIssues = data.issues.filter(issue => issue.file === file);
        console.log(`📄 ${file}`);
        
        fileIssues.forEach(issue => {
          const typeIcon = issue.type === 'chineseText' ? '🈲' : 
                          issue.type === 'localeCheck' ? '🌐' : 
                          issue.type === 'metadataHardcode' ? '📝' : '⚠️';
          
          console.log(`   ${typeIcon} 第${issue.line}行 [${issue.type}]: ${issue.match}`);
        });
        console.log('');
      });
    });

    // 修复建议
    console.log('💡 修复建议:');
    console.log('   - P0页面优先修复，影响SEO最大');
    console.log('   - 使用 t("translation.key") 替换硬编码');
    console.log('   - 在 messages/zh.json 和 messages/en.json 中添加翻译键');
    console.log('   - 运行 npm run detect-seo-critical-hardcode 验证修复\n');

    // 修复步骤
    console.log('🔧 修复步骤:');
    console.log('   1. 优先修复P0页面硬编码');
    console.log('   2. 添加缺失的翻译键');
    console.log('   3. 使用 useTranslations 或 getTranslations');
    console.log('   4. 运行检测脚本验证修复结果\n');

    // 生成JSON报告
    const reportPath = path.join(process.cwd(), 'reports', 'seo-critical-hardcode-report.json');
    const reportDir = path.dirname(reportPath);
    
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const reportData = {
      timestamp: new Date().toISOString(),
      summary: this.results.summary,
      results: {
        p0: this.results.p0,
        p1: this.results.p1,
        p2: this.results.p2
      },
      recommendations: [
        {
          priority: 'P0',
          action: '立即修复首页、Interactive Tools、Scenario Solutions硬编码',
          impact: '极高',
          effort: '1-2天'
        },
        {
          priority: 'P1',
          action: '修复文章页面、Downloads等P1页面硬编码',
          impact: '高',
          effort: '2-3天'
        },
        {
          priority: 'P2',
          action: '修复Stress Management等P2页面硬编码',
          impact: '中',
          effort: '1-2天'
        }
      ]
    };

    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    console.log(`📄 详细报告已保存: ${reportPath}\n`);

    // 返回结果
    return {
      success: this.results.summary.totalIssues === 0,
      totalIssues: this.results.summary.totalIssues,
      criticalIssues: this.results.summary.criticalIssues
    };
  }

  // 运行检测
  run() {
    try {
      this.scanSEOCriticalPages();
      const result = this.generateReport();
      
      if (result.success) {
        console.log('🎉 所有SEO关键页面都没有硬编码问题！');
        process.exit(0);
      } else {
        console.log(`⚠️ 发现 ${result.totalIssues} 个硬编码问题，其中 ${result.criticalIssues} 个为关键问题`);
        console.log('💡 建议优先修复P0页面的硬编码问题');
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ 检测过程中发生错误:', error);
      process.exit(1);
    }
  }
}

// 运行检测
const detector = new SEOCriticalHardcodeDetector();
detector.run();
