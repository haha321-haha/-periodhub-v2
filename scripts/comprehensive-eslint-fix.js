#!/usr/bin/env node

/**
 * ESLint综合修复脚本
 * 一键修复所有ESLint错误和警告
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始ESLint综合修复...\n');

// 修复步骤
const steps = [
  {
    name: '1. 迁移到ESLint CLI',
    command: 'node scripts/migrate-to-eslint-cli.js',
    description: '将项目从next lint迁移到ESLint CLI'
  },
  {
    name: '2. 自动修复ESLint错误',
    command: 'node scripts/fix-eslint-errors.js',
    description: '自动修复未使用的导入和变量'
  },
  {
    name: '3. 修复React Hooks依赖',
    command: 'node scripts/fix-react-hooks-deps.js',
    description: '修复useEffect和useCallback依赖问题'
  },
  {
    name: '4. 运行ESLint自动修复',
    command: 'npx eslint . --ext .ts,.tsx --fix',
    description: '运行ESLint自动修复功能'
  },
  {
    name: '5. 运行Prettier格式化',
    command: 'npx prettier --write .',
    description: '格式化所有代码文件'
  },
  {
    name: '6. 最终检查',
    command: 'npx eslint . --ext .ts,.tsx',
    description: '检查修复后的代码质量'
  }
];

let successCount = 0;
let errorCount = 0;

steps.forEach((step, index) => {
  console.log(`\n📝 ${step.name}: ${step.description}`);
  console.log('─'.repeat(50));
  
  try {
    execSync(step.command, { stdio: 'inherit' });
    console.log(`✅ ${step.name} 完成`);
    successCount++;
  } catch (error) {
    console.log(`❌ ${step.name} 失败: ${error.message}`);
    errorCount++;
    
    // 如果是最终检查失败，继续执行
    if (index === steps.length - 1) {
      console.log('⚠️  最终检查发现问题，但修复过程已完成');
    }
  }
});

// 生成修复报告
console.log('\n📊 修复报告');
console.log('═'.repeat(50));
console.log(`✅ 成功步骤: ${successCount}`);
console.log(`❌ 失败步骤: ${errorCount}`);
console.log(`📈 成功率: ${Math.round((successCount / steps.length) * 100)}%`);

// 生成详细报告
const report = {
  timestamp: new Date().toISOString(),
  totalSteps: steps.length,
  successCount,
  errorCount,
  successRate: Math.round((successCount / steps.length) * 100),
  steps: steps.map((step, index) => ({
    name: step.name,
    description: step.description,
    status: index < successCount ? 'success' : 'failed'
  }))
};

fs.writeFileSync('eslint-fix-report.json', JSON.stringify(report, null, 2));
console.log('\n📄 详细报告已保存到: eslint-fix-report.json');

// 提供后续建议
console.log('\n📋 后续建议');
console.log('─'.repeat(50));

if (errorCount === 0) {
  console.log('🎉 所有修复步骤都成功完成！');
  console.log('✅ 项目已准备好提交');
  console.log('✅ 可以运行 npm run lint:check 进行最终验证');
} else {
  console.log('⚠️  部分步骤失败，需要手动处理：');
  console.log('1. 检查失败步骤的错误信息');
  console.log('2. 手动修复剩余的ESLint错误');
  console.log('3. 运行 npm run lint:check 验证修复效果');
}

console.log('\n🔧 常用命令:');
console.log('• npm run lint:check    - 检查ESLint错误');
console.log('• npm run lint:fix      - 自动修复ESLint错误');
console.log('• npm run type-check    - 检查TypeScript类型');
console.log('• npm run build         - 构建项目');

console.log('\n🎯 下一步:');
console.log('1. 检查修复后的代码');
console.log('2. 运行测试确保功能正常');
console.log('3. 提交代码到版本控制');
console.log('4. 部署到生产环境');

console.log('\n✨ ESLint综合修复完成！');
