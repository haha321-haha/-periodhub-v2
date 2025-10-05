#!/usr/bin/env node

/**
 * Next.js 16 ESLint CLI迁移脚本
 * 将项目从 next lint 迁移到 ESLint CLI
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 开始迁移到ESLint CLI...\n');

// 1. 运行Next.js迁移工具
console.log('📝 步骤1: 运行Next.js官方迁移工具...');
try {
  execSync('npx @next/codemod@canary next-lint-to-eslint-cli .', { stdio: 'inherit' });
  console.log('✅ Next.js迁移工具执行完成\n');
} catch (error) {
  console.log('⚠️  Next.js迁移工具执行失败，手动配置...\n');
}

// 2. 更新package.json脚本
console.log('📝 步骤2: 更新package.json脚本...');
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// 更新lint脚本
packageJson.scripts.lint = 'eslint . --ext .ts,.tsx --fix';
packageJson.scripts['lint:check'] = 'eslint . --ext .ts,.tsx';
packageJson.scripts['lint:fix'] = 'eslint . --ext .ts,.tsx --fix';
packageJson.scripts['lint:report'] = 'eslint . --ext .ts,.tsx --format json --output-file eslint-report.json';

// 添加新的ESLint相关脚本
packageJson.scripts['eslint:init'] = 'eslint --init';
packageJson.scripts['eslint:check-types'] = 'tsc --noEmit && eslint . --ext .ts,.tsx';
packageJson.scripts['eslint:fix-all'] = 'eslint . --ext .ts,.tsx --fix && prettier --write .';

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('✅ package.json脚本更新完成\n');

// 3. 创建新的ESLint配置
console.log('📝 步骤3: 创建增强的ESLint配置...');
const eslintConfig = {
  "extends": [
    "next/core-web-vitals",
    "next/typescript"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }
    ],
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "prefer-const": "error",
    "no-var": "error",
    "no-console": "warn"
  }
};

fs.writeFileSync('.eslintrc.json', JSON.stringify(eslintConfig, null, 2));
console.log('✅ ESLint配置创建完成\n');

// 4. 创建Prettier配置
console.log('📝 步骤4: 创建Prettier配置...');
const prettierConfig = {
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "plugins": ["prettier-plugin-tailwindcss"]
};

fs.writeFileSync('.prettierrc.json', JSON.stringify(prettierConfig, null, 2));
console.log('✅ Prettier配置创建完成\n');

// 5. 创建VSCode设置
console.log('📝 步骤5: 创建VSCode设置...');
const vscodeDir = '.vscode';
if (!fs.existsSync(vscodeDir)) {
  fs.mkdirSync(vscodeDir);
}

const vscodeSettings = {
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
};

fs.writeFileSync(
  path.join(vscodeDir, 'settings.json'),
  JSON.stringify(vscodeSettings, null, 2)
);
console.log('✅ VSCode设置创建完成\n');

// 6. 创建GitHub Actions工作流
console.log('📝 步骤6: 创建GitHub Actions工作流...');
const workflowsDir = '.github/workflows';
if (!fs.existsSync(workflowsDir)) {
  fs.mkdirSync(workflowsDir, { recursive: true });
}

const workflowContent = `name: ESLint Check

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  lint:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run ESLint
      run: npm run lint:check

    - name: Run TypeScript check
      run: npm run type-check
`;

fs.writeFileSync(
  path.join(workflowsDir, 'eslint.yml'),
  workflowContent
);
console.log('✅ GitHub Actions工作流创建完成\n');

// 7. 运行初始检查
console.log('📝 步骤7: 运行初始ESLint检查...');
try {
  execSync('npm run lint:check', { stdio: 'inherit' });
  console.log('✅ 初始ESLint检查完成\n');
} catch (error) {
  console.log('⚠️  ESLint检查发现问题，请查看上述输出\n');
}

console.log('🎉 ESLint CLI迁移完成！');
console.log('\n📋 迁移总结:');
console.log('✅ 更新了package.json脚本');
console.log('✅ 创建了增强的ESLint配置');
console.log('✅ 添加了Prettier配置');
console.log('✅ 配置了VSCode设置');
console.log('✅ 创建了GitHub Actions工作流');
console.log('\n📝 后续步骤:');
console.log('1. 运行 npm run lint:fix 自动修复可修复的问题');
console.log('2. 手动修复剩余的ESLint错误');
console.log('3. 运行 npm run lint:check 验证修复效果');
console.log('4. 提交代码并推送');
