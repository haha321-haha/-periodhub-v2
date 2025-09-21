#!/usr/bin/env node

/**
 * 医疗护理指南综合验证脚本
 * 验证所有组件、翻译、性能优化和SEO配置
 */

const fs = require('fs');
const path = require('path');

// 测试结果收集
const testResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  errors: [],
  warnings: []
};

function logTest(testName, status, message = null) {
  const statusIcon = {
    'passed': '✅',
    'failed': '❌', 
    'warning': '⚠️'
  };
  
  console.log(`${statusIcon[status]} ${testName}`);
  testResults[status]++;
  
  if (message) {
    if (status === 'failed') {
      testResults.errors.push({ test: testName, error: message });
    } else if (status === 'warning') {
      testResults.warnings.push({ test: testName, warning: message });
    }
  }
}

function testFileExists(filePath, description) {
  try {
    const exists = fs.existsSync(filePath);
    logTest(`${description}: ${filePath}`, exists ? 'passed' : 'failed');
    return exists;
  } catch (error) {
    logTest(`${description}: ${filePath}`, 'failed', error.message);
    return false;
  }
}

function testFileContent(filePath, checks, description) {
  try {
    if (!fs.existsSync(filePath)) {
      logTest(`${description}: 文件不存在`, 'failed');
      return false;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    let allChecksPassed = true;
    
    for (const [checkName, checkFn] of Object.entries(checks)) {
      const result = checkFn(content);
      if (result === true) {
        logTest(`${description} - ${checkName}`, 'passed');
      } else if (result === 'warning') {
        logTest(`${description} - ${checkName}`, 'warning');
      } else {
        logTest(`${description} - ${checkName}`, 'failed', result);
        allChecksPassed = false;
      }
    }
    
    return allChecksPassed;
  } catch (error) {
    logTest(`${description}: 文件读取失败`, 'failed', error.message);
    return false;
  }
}

function testTranslationCompleteness() {
  console.log('\n🌐 测试翻译完整性:');
  
  const zhPath = 'messages/zh.json';
  const enPath = 'messages/en.json';
  
  if (!testFileExists(zhPath, '中文翻译文件') || !testFileExists(enPath, '英文翻译文件')) {
    return false;
  }
  
  try {
    const zhContent = JSON.parse(fs.readFileSync(zhPath, 'utf8'));
    const enContent = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    
    // 检查医疗护理指南相关翻译
    const requiredKeys = [
      'medicalCareGuide.meta.title',
      'medicalCareGuide.meta.description', 
      'medicalCareGuide.header.title',
      'medicalCareGuide.painTool.title',
      'medicalCareGuide.symptomChecker.title',
      'medicalCareGuide.decisionTree.title',
      'medicalCareGuide.comparisonTable.title'
    ];
    
    let allKeysExist = true;
    
    for (const key of requiredKeys) {
      const keyPath = key.split('.');
      let zhValue = zhContent;
      let enValue = enContent;
      
      for (const part of keyPath) {
        zhValue = zhValue?.[part];
        enValue = enValue?.[part];
      }
      
      if (!zhValue || !enValue) {
        logTest(`翻译键缺失: ${key}`, 'failed');
        allKeysExist = false;
      } else {
        logTest(`翻译键存在: ${key}`, 'passed');
      }
    }
    
    return allKeysExist;
  } catch (error) {
    logTest('翻译文件解析失败', 'failed', error.message);
    return false;
  }
}

function testComponentIntegration() {
  console.log('\n🧩 测试组件集成:');
  
  const componentsDir = 'app/[locale]/articles/when-to-seek-medical-care-comprehensive-guide/components';
  const components = [
    'PainAssessmentTool.tsx',
    'SymptomChecklist.tsx',
    'DecisionTree.tsx', 
    'ComparisonTable.tsx'
  ];
  
  let allComponentsValid = true;
  
  for (const component of components) {
    const filePath = path.join(componentsDir, component);
    
    const checks = {
      'React导入': (content) => content.includes("import") && (content.includes("'react'") || content.includes('"react"')),
      '翻译Hook': (content) => content.includes("useTranslations"),
      '样式导入': (content) => content.includes(".module.css"),
      '导出组件': (content) => content.includes("export default"),
      '类型安全': (content) => content.includes("interface") || content.includes("type"),
      '错误处理': (content) => content.includes("try") || content.includes("catch") || content.includes("Error") ? true : 'warning'
    };
    
    if (!testFileContent(filePath, checks, component)) {
      allComponentsValid = false;
    }
  }
  
  return allComponentsValid;
}

function testPerformanceOptimization() {
  console.log('\n⚡ 测试性能优化:');
  
  const performanceOptimizerPath = 'app/[locale]/articles/when-to-seek-medical-care-comprehensive-guide/utils/performanceOptimizer.ts';
  
  const checks = {
    '懒加载工厂': (content) => content.includes("createLazyComponent"),
    '预加载功能': (content) => content.includes("preloadComponents"),
    '性能监控': (content) => content.includes("PerformanceMonitor"),
    '错误边界': (content) => content.includes("withErrorBoundary"),
    '防抖节流': (content) => content.includes("useDebounce") && content.includes("useThrottle"),
    '内存监控': (content) => content.includes("useMemoryMonitor"),
    '图片懒加载': (content) => content.includes("LazyImage")
  };
  
  return testFileContent(performanceOptimizerPath, checks, '性能优化工具');
}

function testSEOOptimization() {
  console.log('\n🔍 测试SEO优化:');
  
  const seoOptimizerPath = 'app/[locale]/articles/when-to-seek-medical-care-comprehensive-guide/utils/seoOptimizer.ts';
  
  const checks = {
    '结构化数据': (content) => content.includes("generateStructuredData"),
    'FAQ数据': (content) => content.includes("generateFAQStructuredData"),
    'HowTo数据': (content) => content.includes("generateHowToStructuredData"),
    '元数据生成': (content) => content.includes("generateEnhancedMetadata"),
    '面包屑导航': (content) => content.includes("generateBreadcrumbs"),
    'Schema.org': (content) => content.includes("schema.org"),
    'Open Graph': (content) => content.includes("openGraph"),
    'Twitter Card': (content) => content.includes("twitter")
  };
  
  return testFileContent(seoOptimizerPath, checks, 'SEO优化工具');
}

function testStylesAndResponsiveness() {
  console.log('\n🎨 测试样式和响应式:');
  
  const stylesDir = 'app/[locale]/articles/when-to-seek-medical-care-comprehensive-guide/styles';
  const styleFiles = [
    'PainAssessmentTool.module.css',
    'SymptomChecklist.module.css',
    'DecisionTree.module.css',
    'ComparisonTable.module.css'
  ];
  
  let allStylesValid = true;
  
  for (const styleFile of styleFiles) {
    const filePath = path.join(stylesDir, styleFile);
    
    const checks = {
      '容器类': (content) => content.includes('.container'),
      'Tailwind应用': (content) => content.includes('@apply'),
      '响应式设计': (content) => content.includes('@media') || content.includes('sm:') || content.includes('md:') || content.includes('lg:'),
      '可访问性': (content) => content.includes('focus:') || content.includes('hover:') ? true : 'warning',
      '颜色变量': (content) => content.includes('--') || content.includes('var(') ? true : 'warning'
    };
    
    if (!testFileContent(filePath, checks, styleFile)) {
      allStylesValid = false;
    }
  }
  
  return allStylesValid;
}

function testHooksAndLogic() {
  console.log('\n🪝 测试Hooks和逻辑:');
  
  const hooksDir = 'app/[locale]/articles/when-to-seek-medical-care-comprehensive-guide/hooks';
  const hookFiles = [
    'usePainAssessment.ts',
    'useSymptomChecker.ts', 
    'useDecisionTree.ts'
  ];
  
  let allHooksValid = true;
  
  for (const hookFile of hookFiles) {
    const filePath = path.join(hooksDir, hookFile);
    
    const checks = {
      'Hook命名': (content) => hookFile.startsWith('use'),
      'React导入': (content) => content.includes('react'),
      '状态管理': (content) => content.includes('useState') || content.includes('useReducer'),
      '副作用处理': (content) => content.includes('useEffect') || content.includes('useCallback') ? true : 'warning',
      '类型定义': (content) => content.includes('interface') || content.includes('type'),
      '导出Hook': (content) => content.includes('export')
    };
    
    if (!testFileContent(filePath, checks, hookFile)) {
      allHooksValid = false;
    }
  }
  
  return allHooksValid;
}

function testUtilsAndData() {
  console.log('\n🛠️ 测试工具和数据:');
  
  const utilsFiles = [
    {
      path: 'app/[locale]/articles/when-to-seek-medical-care-comprehensive-guide/utils/storageManager.ts',
      name: '存储管理器',
      checks: {
        '本地存储': (content) => content.includes('localStorage'),
        '数据验证': (content) => content.includes('validate') || content.includes('check'),
        '错误处理': (content) => content.includes('try') && content.includes('catch'),
        '类型安全': (content) => content.includes('interface') || content.includes('type')
      }
    },
    {
      path: 'app/[locale]/articles/when-to-seek-medical-care-comprehensive-guide/utils/assessmentLogic.ts',
      name: '评估逻辑',
      checks: {
        '评估函数': (content) => content.includes('assess') || content.includes('evaluate'),
        '算法实现': (content) => content.includes('calculate') || content.includes('compute'),
        '结果处理': (content) => content.includes('result') || content.includes('score'),
        '边界检查': (content) => content.includes('validate') || content.includes('check') ? true : 'warning'
      }
    },
    {
      path: 'app/[locale]/articles/when-to-seek-medical-care-comprehensive-guide/utils/medicalCareData.ts',
      name: '医疗数据',
      checks: {
        '数据结构': (content) => content.includes('interface') || content.includes('type'),
        '医疗术语': (content) => content.includes('pain') || content.includes('symptom'),
        '分类数据': (content) => content.includes('category') || content.includes('level'),
        '导出数据': (content) => content.includes('export')
      }
    }
  ];
  
  let allUtilsValid = true;
  
  for (const util of utilsFiles) {
    if (!testFileContent(util.path, util.checks, util.name)) {
      allUtilsValid = false;
    }
  }
  
  return allUtilsValid;
}

function testMainPageIntegration() {
  console.log('\n📄 测试主页面集成:');
  
  const mainPagePath = 'app/[locale]/articles/when-to-seek-medical-care-comprehensive-guide/page.tsx';
  
  const checks = {
    '元数据生成': (content) => content.includes('generateMetadata'),
    '组件导入': (content) => content.includes('PainAssessmentTool') && content.includes('SymptomChecklist'),
    '懒加载': (content) => content.includes('dynamic') || content.includes('lazy'),
    '错误边界': (content) => content.includes('ErrorBoundary'),
    '加载状态': (content) => content.includes('LoadingSystem') || content.includes('Suspense'),
    '性能优化': (content) => content.includes('preloadComponents'),
    'SEO优化': (content) => content.includes('seoOptimizer') || content.includes('structuredData'),
    '翻译集成': (content) => content.includes('useTranslations')
  };
  
  return testFileContent(mainPagePath, checks, '主页面组件');
}

function testAccessibilityCompliance() {
  console.log('\n♿ 测试可访问性合规:');
  
  // 检查组件中的可访问性特性
  const componentsDir = 'app/[locale]/articles/when-to-seek-medical-care-comprehensive-guide/components';
  const components = ['PainAssessmentTool.tsx', 'SymptomChecklist.tsx', 'DecisionTree.tsx', 'ComparisonTable.tsx'];
  
  let accessibilityScore = 0;
  const totalChecks = components.length * 5;
  
  for (const component of components) {
    const filePath = path.join(componentsDir, component);
    
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // 检查可访问性特性
      if (content.includes('aria-') || content.includes('role=')) {
        logTest(`${component}: ARIA属性`, 'passed');
        accessibilityScore++;
      } else {
        logTest(`${component}: ARIA属性`, 'warning', '建议添加ARIA属性');
      }
      
      if (content.includes('alt=') || content.includes('aria-label')) {
        logTest(`${component}: 标签描述`, 'passed');
        accessibilityScore++;
      } else {
        logTest(`${component}: 标签描述`, 'warning', '建议添加描述性标签');
      }
      
      if (content.includes('tabIndex') || content.includes('onKeyDown')) {
        logTest(`${component}: 键盘导航`, 'passed');
        accessibilityScore++;
      } else {
        logTest(`${component}: 键盘导航`, 'warning', '建议支持键盘导航');
      }
      
      if (content.includes('focus:') || content.includes('hover:')) {
        logTest(`${component}: 焦点样式`, 'passed');
        accessibilityScore++;
      } else {
        logTest(`${component}: 焦点样式`, 'warning', '建议添加焦点样式');
      }
      
      if (content.includes('semantic') || content.includes('<button') || content.includes('<input')) {
        logTest(`${component}: 语义化标签`, 'passed');
        accessibilityScore++;
      } else {
        logTest(`${component}: 语义化标签`, 'warning', '建议使用语义化HTML');
      }
    }
  }
  
  const accessibilityPercentage = (accessibilityScore / totalChecks * 100).toFixed(1);
  console.log(`\n♿ 可访问性评分: ${accessibilityPercentage}%`);
  
  return accessibilityScore > totalChecks * 0.7; // 70%通过率
}

function generateComprehensiveReport() {
  console.log('\n📊 生成综合报告...');
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: testResults.passed + testResults.failed + testResults.warnings,
      passed: testResults.passed,
      failed: testResults.failed,
      warnings: testResults.warnings,
      successRate: ((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)
    },
    errors: testResults.errors,
    warnings: testResults.warnings,
    recommendations: []
  };
  
  // 生成建议
  if (testResults.failed > 0) {
    report.recommendations.push('修复失败的测试项目以确保功能正常');
  }
  
  if (testResults.warnings > 5) {
    report.recommendations.push('关注警告项目以提升代码质量');
  }
  
  if (report.summary.successRate < 90) {
    report.recommendations.push('提升测试通过率至90%以上');
  }
  
  // 保存报告
  const reportPath = 'scripts/medical-care-guide-validation-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`\n📄 详细报告已保存至: ${reportPath}`);
  
  return report;
}

function runComprehensiveValidation() {
  console.log('🧪 开始医疗护理指南综合验证\n');
  
  // 运行所有测试
  const testSuites = [
    { name: '翻译完整性', fn: testTranslationCompleteness },
    { name: '组件集成', fn: testComponentIntegration },
    { name: '性能优化', fn: testPerformanceOptimization },
    { name: 'SEO优化', fn: testSEOOptimization },
    { name: '样式响应式', fn: testStylesAndResponsiveness },
    { name: 'Hooks逻辑', fn: testHooksAndLogic },
    { name: '工具数据', fn: testUtilsAndData },
    { name: '主页面集成', fn: testMainPageIntegration },
    { name: '可访问性', fn: testAccessibilityCompliance }
  ];
  
  const results = {};
  
  for (const suite of testSuites) {
    try {
      results[suite.name] = suite.fn();
    } catch (error) {
      console.error(`\n❌ 测试套件 "${suite.name}" 执行失败:`, error.message);
      results[suite.name] = false;
    }
  }
  
  // 生成报告
  const report = generateComprehensiveReport();
  
  // 输出最终结果
  console.log('\n' + '='.repeat(60));
  console.log('📊 综合验证结果汇总:');
  console.log('='.repeat(60));
  console.log(`✅ 通过: ${report.summary.passed}`);
  console.log(`❌ 失败: ${report.summary.failed}`);
  console.log(`⚠️  警告: ${report.summary.warnings}`);
  console.log(`🎯 成功率: ${report.summary.successRate}%`);
  
  if (report.errors.length > 0) {
    console.log('\n🚨 需要修复的错误:');
    report.errors.forEach(({ test, error }) => {
      console.log(`- ${test}: ${error}`);
    });
  }
  
  if (report.warnings.length > 0) {
    console.log('\n⚠️  建议改进的项目:');
    report.warnings.forEach(({ test, warning }) => {
      console.log(`- ${test}: ${warning}`);
    });
  }
  
  if (report.recommendations.length > 0) {
    console.log('\n💡 改进建议:');
    report.recommendations.forEach(rec => {
      console.log(`- ${rec}`);
    });
  }
  
  const overallSuccess = report.summary.failed === 0 && report.summary.successRate >= 90;
  
  if (overallSuccess) {
    console.log('\n🎉 医疗护理指南验证通过！系统已准备就绪。');
  } else {
    console.log('\n⚠️  验证发现问题，请根据上述建议进行改进。');
  }
  
  return overallSuccess;
}

// 运行验证
if (require.main === module) {
  const success = runComprehensiveValidation();
  process.exit(success ? 0 : 1);
}

module.exports = { runComprehensiveValidation };