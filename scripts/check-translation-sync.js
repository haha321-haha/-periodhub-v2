#!/usr/bin/env node

/**
 * 检查中英文翻译键同步性
 * 确保两个翻译文件的键结构完全一致
 */

const fs = require('fs');
const path = require('path');

// 颜色输出
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 递归获取所有键路径
function getAllKeys(obj, prefix = '') {
  const keys = [];
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

function checkTranslationSync() {
  log('\n🔍 检查翻译键同步性...', 'bold');
  log('', 'reset');
  
  // 加载翻译文件
  const zhPath = path.join(__dirname, '..', 'messages', 'zh.json');
  const enPath = path.join(__dirname, '..', 'messages', 'en.json');
  
  let zhTranslations, enTranslations;
  
  try {
    zhTranslations = JSON.parse(fs.readFileSync(zhPath, 'utf8'));
    enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    log('✅ 翻译文件加载成功', 'green');
  } catch (error) {
    log(`❌ 无法加载翻译文件: ${error.message}`, 'red');
    process.exit(1);
  }
  
  // 获取所有键
  const zhKeys = new Set(getAllKeys(zhTranslations));
  const enKeys = new Set(getAllKeys(enTranslations));
  
  // 检查差异
  const missingInEn = [...zhKeys].filter(k => !enKeys.has(k));
  const missingInZh = [...enKeys].filter(k => !zhKeys.has(k));
  
  log(`\n📊 同步性检查结果:`, 'bold');
  log(`中文翻译键总数: ${zhKeys.size}`, 'cyan');
  log(`英文翻译键总数: ${enKeys.size}`, 'cyan');
  
  if (missingInEn.length > 0) {
    log(`\n❌ 英文缺失 ${missingInEn.length} 个翻译键:`, 'red');
    missingInEn.slice(0, 10).forEach(key => {
      log(`  - ${key}`, 'yellow');
    });
    if (missingInEn.length > 10) {
      log(`  ... 还有 ${missingInEn.length - 10} 个`, 'yellow');
    }
  }
  
  if (missingInZh.length > 0) {
    log(`\n❌ 中文缺失 ${missingInZh.length} 个翻译键:`, 'red');
    missingInZh.slice(0, 10).forEach(key => {
      log(`  - ${key}`, 'yellow');
    });
    if (missingInZh.length > 10) {
      log(`  ... 还有 ${missingInZh.length - 10} 个`, 'yellow');
    }
  }
  
  if (missingInEn.length === 0 && missingInZh.length === 0) {
    log('\n✅ 翻译键完全同步！', 'green');
    return true;
  } else {
    log('\n⚠️  翻译键存在不同步问题，请修复', 'yellow');
    return false;
  }
}

// 运行检查
if (require.main === module) {
  const isSync = checkTranslationSync();
  process.exit(isSync ? 0 : 1);
}

module.exports = { checkTranslationSync };
