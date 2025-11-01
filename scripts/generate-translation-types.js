#!/usr/bin/env node

/**
 * 从翻译文件生成 TypeScript 类型定义
 * 提供类型安全的翻译键访问
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 生成翻译类型定义...');
console.log('');

// 加载中文翻译文件作为类型基础
const zhPath = path.join(__dirname, '..', 'messages', 'zh.json');
const zhTranslations = JSON.parse(fs.readFileSync(zhPath, 'utf8'));

// 递归生成类型定义
function generateTypes(obj, indent = 0) {
  const spaces = '  '.repeat(indent);
  let result = '';
  
  for (const key in obj) {
    const value = obj[key];
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result += `${spaces}"${key}": {\n`;
      result += generateTypes(value, indent + 1);
      result += `${spaces}};\n`;
    } else {
      result += `${spaces}"${key}": string;\n`;
    }
  }
  
  return result;
}

// 生成类型文件
const typeDefinition = `
/**
 * 自动生成的翻译键类型定义
 * 请勿手动编辑此文件
 * 
 * 生成时间: ${new Date().toISOString()}
 * 生成命令: npm run types:generate
 */

export interface TranslationKeys {
${generateTypes(zhTranslations, 1)}}

// 翻译命名空间类型
export type TranslationNamespace = keyof TranslationKeys;

// 用于 next-intl 的类型安全 hook
declare module 'next-intl' {
  interface AppPathParams {
    locale: string;
  }
}
`;

// 写入类型文件
const outputPath = path.join(__dirname, '..', 'types', 'translations.d.ts');
const outputDir = path.dirname(outputPath);

// 确保目录存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, typeDefinition, 'utf8');

console.log('✅ 翻译类型定义生成成功！');
console.log(`📁 输出文件: ${outputPath}`);
console.log('');
console.log('💡 现在你可以在代码中享受类型安全的翻译键访问了！');
