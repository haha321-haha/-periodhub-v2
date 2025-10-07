#!/usr/bin/env node
/**
 * 翻译键同步验证脚本
 * 检测代码中使用的 anchorTextType 值与翻译文件中的键是否同步
 *
 * 使用方法：
 * node scripts/verify-translation-sync.js
 */

const fs = require('fs');
const path = require('path');

// 颜色输出工具
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function colorLog(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 检测代码中使用的 anchorTextType 值
function detectAnchorTextTypes() {
  const codeFiles = [
    'app/[locale]/interactive-tools/[tool]/page.tsx',
    'app/[locale]/interactive-tools/components/RelatedArticleCard.tsx'
  ];

  const types = new Set();

  codeFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const matches = content.match(/anchorTextType:\s*["']([^"']+)["']/g);
      if (matches) {
        matches.forEach(match => {
          const type = match.match(/["']([^"']+)["']/)[1];
          types.add(type);
        });
      }
    } else {
      colorLog('yellow', `⚠️  文件不存在: ${file}`);
    }
  });

  return Array.from(types);
}

// 检测翻译文件中的键
function detectTranslationKeys(locale) {
  const filePath = path.join(__dirname, '..', `messages/${locale}.json`);

  if (!fs.existsSync(filePath)) {
    colorLog('red', `❌ 翻译文件不存在: messages/${locale}.json`);
    return [];
  }

  try {
    const translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const keys = [];

    if (translations.anchorTexts?.articles) {
      Object.keys(translations.anchorTexts.articles).forEach(key => {
        keys.push(key);
      });
    }
    return keys;
  } catch (error) {
    colorLog('red', `❌ 解析翻译文件失败: ${filePath}`);
    colorLog('red', `错误: ${error.message}`);
    return [];
  }
}

// 检测面包屑导航键
function detectBreadcrumbKeys(locale) {
  const filePath = path.join(__dirname, '..', `messages/${locale}.json`);

  if (!fs.existsSync(filePath)) {
    return [];
  }

  try {
    const translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const keys = [];

    if (translations.interactiveTools?.breadcrumb) {
      Object.keys(translations.interactiveTools.breadcrumb).forEach(key => {
        keys.push(key);
      });
    }
    return keys;
  } catch (error) {
    return [];
  }
}

// 检测代码中使用的面包屑键
function detectBreadcrumbUsage() {
  const codeFiles = [
    'app/[locale]/interactive-tools/pain-tracker/pain-tracker-client.tsx'
  ];

  const types = new Set();

  codeFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const matches = content.match(/breadcrumbT\(["']([^"']+)["']\)/g);
      if (matches) {
        matches.forEach(match => {
          const type = match.match(/["']([^"']+)["']/)[1];
          types.add(type);
        });
      }
    }
  });

  return Array.from(types);
}

// 主验证逻辑
function verifyTranslationSync() {
  colorLog('cyan', '🔍 翻译键同步验证开始...\n');

  // 验证文章类型翻译键
  colorLog('blue', '📚 验证文章类型翻译键');
  const codeTypes = detectAnchorTextTypes();
  const zhKeys = detectTranslationKeys('zh');
  const enKeys = detectTranslationKeys('en');

  colorLog('cyan', `代码中的类型: [${codeTypes.join(', ')}]`);
  colorLog('cyan', `中文翻译键: [${zhKeys.join(', ')}]`);
  colorLog('cyan', `英文翻译键: [${enKeys.join(', ')}]`);

  const missingZh = codeTypes.filter(type => !zhKeys.includes(type));
  const missingEn = codeTypes.filter(type => !enKeys.includes(type));

  if (missingZh.length > 0) {
    colorLog('red', `❌ 中文翻译键缺失: [${missingZh.join(', ')}]`);
  }
  if (missingEn.length > 0) {
    colorLog('red', `❌ 英文翻译键缺失: [${missingEn.join(', ')}]`);
  }

  // 验证面包屑导航键
  colorLog('blue', '\n🧭 验证面包屑导航翻译键');
  const breadcrumbUsage = detectBreadcrumbUsage();
  const zhBreadcrumbKeys = detectBreadcrumbKeys('zh');
  const enBreadcrumbKeys = detectBreadcrumbKeys('en');

  colorLog('cyan', `代码中使用的面包屑: [${breadcrumbUsage.join(', ')}]`);
  colorLog('cyan', `中文面包屑键: [${zhBreadcrumbKeys.join(', ')}]`);
  colorLog('cyan', `英文面包屑键: [${enBreadcrumbKeys.join(', ')}]`);

  const missingBreadcrumbZh = breadcrumbUsage.filter(type => !zhBreadcrumbKeys.includes(type));
  const missingBreadcrumbEn = breadcrumbUsage.filter(type => !enBreadcrumbKeys.includes(type));

  if (missingBreadcrumbZh.length > 0) {
    colorLog('red', `❌ 中文面包屑键缺失: [${missingBreadcrumbZh.join(', ')}]`);
  }
  if (missingBreadcrumbEn.length > 0) {
    colorLog('red', `❌ 英文面包屑键缺失: [${missingBreadcrumbEn.join(', ')}]`);
  }

  // 总结
  const totalMissing = missingZh.length + missingEn.length + missingBreadcrumbZh.length + missingBreadcrumbEn.length;

  if (totalMissing === 0) {
    colorLog('green', '\n✅ 所有翻译键同步正常！');
    process.exit(0);
  } else {
    colorLog('red', `\n❌ 发现 ${totalMissing} 个翻译键同步问题`);
    colorLog('yellow', '\n💡 修复建议：');
    if (missingZh.length > 0) {
      colorLog('yellow', `1. 在 messages/zh.json 的 anchorTexts.articles 中添加: ${missingZh.map(k => `"${k}": "对应中文翻译"`).join(', ')}`);
    }
    if (missingEn.length > 0) {
      colorLog('yellow', `2. 在 messages/en.json 的 anchorTexts.articles 中添加: ${missingEn.map(k => `"${k}": "对应英文翻译"`).join(', ')}`);
    }
    if (missingBreadcrumbZh.length > 0) {
      colorLog('yellow', `3. 在 messages/zh.json 的 interactiveTools.breadcrumb 中添加: ${missingBreadcrumbZh.map(k => `"${k}": "对应中文翻译"`).join(', ')}`);
    }
    if (missingBreadcrumbEn.length > 0) {
      colorLog('yellow', `4. 在 messages/en.json 的 interactiveTools.breadcrumb 中添加: ${missingBreadcrumbEn.map(k => `"${k}": "对应英文翻译"`).join(', ')}`);
    }
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  verifyTranslationSync();
}

module.exports = {
  detectAnchorTextTypes,
  detectTranslationKeys,
  detectBreadcrumbUsage,
  detectBreadcrumbKeys,
  verifyTranslationSync
};
