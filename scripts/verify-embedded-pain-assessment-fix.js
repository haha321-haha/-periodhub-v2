#!/usr/bin/env node

/**
 * EmbeddedPainAssessment 组件修复验证脚本
 * 功能：自动化测试修复后的组件是否正常工作
 */

const fs = require('fs');
const path = require('path');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(type, message) {
  const icons = {
    info: 'ℹ️ ',
    success: '✅',
    error: '❌',
    warning: '⚠️ ',
    test: '🧪'
  };
  
  const color = {
    info: colors.blue,
    success: colors.green,
    error: colors.red,
    warning: colors.yellow,
    test: colors.blue
  }[type] || colors.reset;
  
  console.log(`${color}${icons[type] || ''} ${message}${colors.reset}`);
}

// ============================================================================
// 测试套件
// ============================================================================

class FixVerifier {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.tests = [];
  }

  // Test 1: 检查文件是否存在硬编码
  async testNoHardcodedText() {
    log('test', 'Test 1: 检查是否移除了所有硬编码...');
    
    const filePath = 'components/EmbeddedPainAssessment.tsx';
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 检查是否还有 locale === 'zh' ? 模式
    const hardcodedPattern = /locale\s*===\s*['"]zh['"]\s*\?/g;
    const matches = content.match(hardcodedPattern);
    
    if (matches && matches.length > 0) {
      log('error', `发现 ${matches.length} 处硬编码残留`);
      this.failed++;
      return false;
    }
    
    // 检查是否还有 translations 对象
    if (content.includes('const translations = {')) {
      log('error', '发现残留的 translations 对象');
      this.failed++;
      return false;
    }
    
    log('success', '已移除所有硬编码');
    this.passed++;
    return true;
  }

  // Test 2: 检查是否使用了翻译系统
  async testUsesTranslationSystem() {
    log('test', 'Test 2: 检查是否使用翻译系统...');
    
    const filePath = 'components/EmbeddedPainAssessment.tsx';
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 检查是否导入了 useTranslations
    if (!content.includes("import { useTranslations } from 'next-intl'")) {
      log('error', '未导入 useTranslations');
      this.failed++;
      return false;
    }
    
    // 检查是否使用了 useTranslations
    if (!content.includes("const t = useTranslations('embeddedPainAssessment')")) {
      log('error', '未使用 useTranslations hook');
      this.failed++;
      return false;
    }
    
    // 检查是否使用了 t() 函数
    const tCallPattern = /t\(['"][^'"]+['"]\)/g;
    const tCalls = content.match(tCallPattern);
    
    if (!tCalls || tCalls.length < 16) {
      log('error', `t() 调用次数不足: ${tCalls ? tCalls.length : 0}/16`);
      this.failed++;
      return false;
    }
    
    log('success', `正确使用翻译系统 (${tCalls.length}个翻译键)`);
    this.passed++;
    return true;
  }

  // Test 3: 检查翻译键完整性
  async testTranslationKeysComplete() {
    log('test', 'Test 3: 检查翻译键完整性...');
    
    const requiredKeys = [
      'title',
      'subtitle',
      'question',
      'selectIntensityFirst',
      'options.mild',
      'options.moderate',
      'options.severe',
      'buttons.getAdvice',
      'buttons.detailedAssessment',
      'buttons.testAgain',
      'buttons.fullAssessment',
      'resultTitle',
      'results.mild',
      'results.moderate',
      'results.severe',
      'disclaimer'
    ];
    
    // 检查中文翻译
    const zhContent = fs.readFileSync('messages/zh.json', 'utf8');
    const zhJson = JSON.parse(zhContent);
    
    let missingZh = [];
    for (const key of requiredKeys) {
      const keys = key.split('.');
      let value = zhJson.embeddedPainAssessment;
      
      for (const k of keys) {
        if (!value || !value[k]) {
          missingZh.push(key);
          break;
        }
        value = value[k];
      }
    }
    
    // 检查英文翻译
    const enContent = fs.readFileSync('messages/en.json', 'utf8');
    const enJson = JSON.parse(enContent);
    
    let missingEn = [];
    for (const key of requiredKeys) {
      const keys = key.split('.');
      let value = enJson.embeddedPainAssessment;
      
      for (const k of keys) {
        if (!value || !value[k]) {
          missingEn.push(key);
          break;
        }
        value = value[k];
      }
    }
    
    if (missingZh.length > 0 || missingEn.length > 0) {
      log('error', '翻译键不完整:');
      if (missingZh.length > 0) {
        console.log('  中文缺失:', missingZh.join(', '));
      }
      if (missingEn.length > 0) {
        console.log('  英文缺失:', missingEn.join(', '));
      }
      this.failed++;
      return false;
    }
    
    log('success', `所有翻译键完整 (${requiredKeys.length}/16)`);
    this.passed++;
    return true;
  }

  // Test 4: 检查代码质量
  async testCodeQuality() {
    log('test', 'Test 4: 检查代码质量...');
    
    const filePath = 'components/EmbeddedPainAssessment.tsx';
    const content = fs.readFileSync(filePath, 'utf8');
    
    const issues = [];
    
    // 检查是否有 console.log
    if (content.includes('console.log')) {
      issues.push('包含 console.log');
    }
    
    // 检查是否有 TODO 注释
    if (content.includes('// TODO') || content.includes('// FIXME')) {
      issues.push('包含 TODO/FIXME 注释');
    }
    
    // 检查导入顺序
    const imports = content.match(/^import .+$/gm) || [];
    if (imports.length > 0) {
      const hasReact = imports.some(i => i.includes('react'));
      const hasNextIntl = imports.some(i => i.includes('next-intl'));
      
      if (!hasReact || !hasNextIntl) {
        issues.push('缺少必要的导入');
      }
    }
    
    if (issues.length > 0) {
      log('warning', '代码质量问题: ' + issues.join(', '));
      // 不算失败，只是警告
    } else {
      log('success', '代码质量良好');
    }
    
    this.passed++;
    return true;
  }

  // Test 5: 检查文件大小变化
  async testFileSize() {
    log('test', 'Test 5: 检查文件大小优化...');
    
    const filePath = 'components/EmbeddedPainAssessment.tsx';
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').length;
    
    // 预期修复后应该减少约20行
    if (lines > 180) {
      log('warning', `文件行数: ${lines} (预期 < 180)`);
    } else if (lines < 140) {
      log('warning', `文件行数过少: ${lines} (可能删除了必要代码)`);
      this.failed++;
      return false;
    } else {
      log('success', `文件行数合理: ${lines} 行`);
    }
    
    this.passed++;
    return true;
  }

  // Test 6: 检查TypeScript类型
  async testTypeScript() {
    log('test', 'Test 6: 检查TypeScript类型定义...');
    
    const filePath = 'components/EmbeddedPainAssessment.tsx';
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 检查接口定义
    if (!content.includes('interface EmbeddedPainAssessmentProps')) {
      log('error', '缺少接口定义');
      this.failed++;
      return false;
    }
    
    // 检查类型注解
    if (!content.includes(': React.FC<EmbeddedPainAssessmentProps>')) {
      log('error', '缺少组件类型注解');
      this.failed++;
      return false;
    }
    
    log('success', 'TypeScript类型定义完整');
    this.passed++;
    return true;
  }

  // Test 7: 检查使用该组件的页面
  async testUsagePages() {
    log('test', 'Test 7: 检查使用该组件的页面...');
    
    const pages = [
      'app/[locale]/teen-health/page.tsx',
      'app/[locale]/teen-health/development-pain/page.tsx'
    ];
    
    let allPagesExist = true;
    for (const page of pages) {
      if (!fs.existsSync(page)) {
        log('error', `页面文件不存在: ${page}`);
        allPagesExist = false;
      } else {
        const content = fs.readFileSync(page, 'utf8');
        if (!content.includes('EmbeddedPainAssessment')) {
          log('warning', `页面未使用组件: ${page}`);
        }
      }
    }
    
    if (!allPagesExist) {
      this.failed++;
      return false;
    }
    
    log('success', `所有使用页面存在 (${pages.length}个)`);
    this.passed++;
    return true;
  }

  // 运行所有测试
  async runAll() {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║     EmbeddedPainAssessment 修复验证测试套件            ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
    const tests = [
      this.testNoHardcodedText.bind(this),
      this.testUsesTranslationSystem.bind(this),
      this.testTranslationKeysComplete.bind(this),
      this.testCodeQuality.bind(this),
      this.testFileSize.bind(this),
      this.testTypeScript.bind(this),
      this.testUsagePages.bind(this)
    ];
    
    for (const test of tests) {
      await test();
      console.log('');
    }
    
    // 输出总结
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║                     测试结果总结                        ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
    const total = this.passed + this.failed;
    const passRate = ((this.passed / total) * 100).toFixed(1);
    
    console.log(`  总测试数: ${total}`);
    console.log(`  ${colors.green}✅ 通过: ${this.passed}${colors.reset}`);
    console.log(`  ${colors.red}❌ 失败: ${this.failed}${colors.reset}`);
    console.log(`  通过率: ${passRate}%\n`);
    
    if (this.failed === 0) {
      log('success', '所有测试通过！修复成功 🎉');
      console.log('\n下一步操作：');
      console.log('  1. npm run dev          # 启动开发服务器');
      console.log('  2. 访问 /zh/teen-health  # 测试中文显示');
      console.log('  3. 访问 /en/teen-health  # 测试英文显示');
      console.log('  4. 提交代码到Git\n');
      return 0;
    } else {
      log('error', `有 ${this.failed} 个测试失败，请检查并修复`);
      return 1;
    }
  }
}

// ============================================================================
// 主程序
// ============================================================================

async function main() {
  try {
    const verifier = new FixVerifier();
    const exitCode = await verifier.runAll();
    process.exit(exitCode);
  } catch (error) {
    console.error(`${colors.red}❌ 验证过程出错: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

main();


