#!/usr/bin/env node

/**
 * URL格式一致性验证脚本
 * 验证所有页面都使用 https://www.periodhub.health 格式
 */

const fs = require('fs');
const path = require('path');

// 需要检查的文件模式
const filePatterns = [
  'app/**/*.tsx',
  'app/**/*.ts',
  'lib/**/*.ts',
  'components/**/*.tsx',
  'components/**/*.ts'
];

// 应该使用www.periodhub.health的上下文
const wwwContexts = [
  'canonical',
  'alternates',
  'url',
  'openGraph',
  'twitter',
  'sitemap',
  'host',
  'metadataBase',
  'siteName',
  'href',
  'src',
  'logo',
  'image'
];

let issues = [];
let totalFiles = 0;
let checkedFiles = 0;

function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // 检查是否包含不带www的URL
      if (line.includes('https://periodhub.health') && !line.includes('https://www.periodhub.health')) {
        // 检查是否在应该使用www的上下文中
        const shouldUseWww = wwwContexts.some(context =>
          line.toLowerCase().includes(context.toLowerCase())
        );

        if (shouldUseWww) {
          issues.push({
            file: filePath,
            line: index + 1,
            content: line.trim(),
            issue: '应该使用 https://www.periodhub.health'
          });
        }
      }
    });

    checkedFiles++;
  } catch (error) {
    console.error(`读取文件失败: ${filePath}`, error.message);
  }
}

function findFiles(dir, extensions = ['.tsx', '.ts']) {
  const files = [];

  function traverse(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);

      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          traverse(fullPath);
        } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // 忽略无法访问的目录
    }
  }

  traverse(dir);
  return files;
}

// 主检查逻辑
console.log('🔍 开始验证URL格式一致性...\n');

const directories = ['app', 'lib', 'components'];
const allFiles = [];

directories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    const files = findFiles(dirPath);
    allFiles.push(...files);
  }
});

totalFiles = allFiles.length;
console.log(`📁 检查 ${totalFiles} 个文件...\n`);

allFiles.forEach(file => {
  checkFile(file);
});

// 检查配置文件
const configFiles = [
  'lib/url-config.ts',
  'lib/canonical-config.ts',
  'lib/seo-config.ts'
];

configFiles.forEach(configFile => {
  const filePath = path.join(__dirname, configFile);
  if (fs.existsSync(filePath)) {
    checkFile(filePath);
  }
});

// 输出结果
console.log(`📊 检查完成: ${checkedFiles}/${totalFiles} 个文件\n`);

if (issues.length === 0) {
  console.log('✅ 所有URL格式配置正确！');
  console.log('✅ 所有页面都使用 https://www.periodhub.health 域名');
} else {
  console.log(`❌ 发现 ${issues.length} 个问题:\n`);

  issues.forEach((issue, index) => {
    console.log(`${index + 1}. 文件: ${issue.file}`);
    console.log(`   行号: ${issue.line}`);
    console.log(`   问题: ${issue.issue}`);
    console.log(`   内容: ${issue.content}`);
    console.log('');
  });
}

// 检查sitemap.xml
console.log('🗺️ 检查sitemap.xml...');
const sitemapPath = path.join(__dirname, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  const wwwCount = (sitemapContent.match(/https:\/\/www\.periodhub\.health/g) || []).length;
  const nonWwwCount = (sitemapContent.match(/https:\/\/periodhub\.health/g) || []).length;

  console.log(`   https://www.periodhub.health: ${wwwCount} 个`);
  console.log(`   https://periodhub.health: ${nonWwwCount} 个`);

  if (nonWwwCount > 0) {
    console.log('   ⚠️ sitemap.xml中仍有不带www的URL');
  } else {
    console.log('   ✅ sitemap.xml配置正确');
  }
} else {
  console.log('   ⚠️ 未找到sitemap.xml文件');
}

// 生成验证报告
const report = {
  timestamp: new Date().toISOString(),
  totalFiles: totalFiles,
  checkedFiles: checkedFiles,
  issuesFound: issues.length,
  issues: issues,
  summary: {
    status: issues.length === 0 ? 'PASSED' : 'FAILED',
    message: issues.length === 0
      ? '所有URL格式配置正确，都使用https://www.periodhub.health'
      : `发现${issues.length}个URL格式问题需要修复`
  }
};

// 保存报告
fs.writeFileSync('url-consistency-verification-report.json', JSON.stringify(report, null, 2));
console.log('\n📋 验证报告已保存到: url-consistency-verification-report.json');

console.log('\n🎯 修复建议:');
if (issues.length > 0) {
  console.log('1. 修复所有发现的URL格式问题');
  console.log('2. 确保所有canonical URL使用 https://www.periodhub.health');
  console.log('3. 确保所有hreflang URL使用 https://www.periodhub.health');
  console.log('4. 重新运行此验证脚本确认修复效果');
} else {
  console.log('1. ✅ 所有URL格式已正确配置');
  console.log('2. ✅ 可以在Google Search Console中重新提交sitemap');
  console.log('3. ✅ 可以在Bing Webmaster Tools中重新提交sitemap');
  console.log('4. ✅ 使用URL检查工具验证修复效果');
}

console.log('\n🚀 下一步操作:');
console.log('1. 如果发现问题，请修复后重新运行此脚本');
console.log('2. 在搜索引擎控制台中重新提交sitemap.xml');
console.log('3. 使用URL检查工具验证修复效果');
console.log('4. 监控搜索引擎索引状态');
