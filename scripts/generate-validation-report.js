#!/usr/bin/env node

/**
 * 生成翻译键验证的详细 HTML 报告
 */

const fs = require('fs');
const path = require('path');

console.log('📊 生成翻译键验证报告...');
console.log('');

// 运行验证器并收集结果
const { execSync } = require('child_process');

let validationOutput;
try {
  validationOutput = execSync('node scripts/real-translation-validator.js', {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe']
  });
} catch (error) {
  validationOutput = error.stdout || error.message;
}

// 解析验证结果
const missingZhNamespaces = (validationOutput.match(/中文翻译缺失 (\d+) 个命名空间/) || [])[1] || '0';
const missingEnNamespaces = (validationOutput.match(/英文翻译缺失 (\d+) 个命名空间/) || [])[1] || '0';
const missingZhKeys = (validationOutput.match(/真实缺失的中文翻译键: (\d+)/) || [])[1] || '0';
const missingEnKeys = (validationOutput.match(/真实缺失的英文翻译键: (\d+)/) || [])[1] || '0';

// 生成 HTML 报告
const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>翻译键验证报告</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 10px;
      margin-bottom: 30px;
    }
    .header h1 {
      margin: 0 0 10px 0;
    }
    .header p {
      margin: 0;
      opacity: 0.9;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .card {
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .card h3 {
      margin: 0 0 10px 0;
      color: #333;
    }
    .card .number {
      font-size: 36px;
      font-weight: bold;
      margin: 10px 0;
    }
    .card.success .number { color: #10b981; }
    .card.warning .number { color: #f59e0b; }
    .card.error .number { color: #ef4444; }
    .details {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .details h2 {
      margin-top: 0;
      color: #333;
    }
    pre {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 5px;
      overflow-x: auto;
      line-height: 1.6;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
      margin-right: 8px;
    }
    .badge.success { background: #d1fae5; color: #065f46; }
    .badge.warning { background: #fed7aa; color: #92400e; }
    .badge.error { background: #fee2e2; color: #991b1b; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🔍 翻译键验证报告</h1>
    <p>生成时间: ${new Date().toLocaleString('zh-CN')}</p>
  </div>

  <div class="summary">
    <div class="card ${parseInt(missingZhNamespaces) === 0 ? 'success' : 'error'}">
      <h3>中文命名空间</h3>
      <div class="number">${missingZhNamespaces}</div>
      <p>缺失的命名空间</p>
    </div>

    <div class="card ${parseInt(missingEnNamespaces) === 0 ? 'success' : 'error'}">
      <h3>英文命名空间</h3>
      <div class="number">${missingEnNamespaces}</div>
      <p>缺失的命名空间</p>
    </div>

    <div class="card ${parseInt(missingZhKeys) === 0 ? 'success' : 'error'}">
      <h3>中文翻译键</h3>
      <div class="number">${missingZhKeys}</div>
      <p>缺失的翻译键</p>
    </div>

    <div class="card ${parseInt(missingEnKeys) === 0 ? 'success' : 'error'}">
      <h3>英文翻译键</h3>
      <div class="number">${missingEnKeys}</div>
      <p>缺失的翻译键</p>
    </div>
  </div>

  <div class="details">
    <h2>详细验证结果</h2>
    ${parseInt(missingZhNamespaces) + parseInt(missingEnNamespaces) + parseInt(missingZhKeys) + parseInt(missingEnKeys) === 0 
      ? '<p class="badge success">✅ 所有检查通过！翻译键完整且同步。</p>'
      : '<p class="badge warning">⚠️ 发现翻译键问题，请查看下方详细信息。</p>'
    }
    <pre>${validationOutput.replace(/\x1b\[[0-9;]*m/g, '')}</pre>
  </div>

  <div class="details" style="margin-top: 20px;">
    <h2>💡 下一步建议</h2>
    ${parseInt(missingZhNamespaces) + parseInt(missingEnNamespaces) > 0 
      ? `<p><strong>优先修复缺失的命名空间</strong></p>
         <ul>
           <li>这些是最关键的问题，会导致页面无法加载</li>
           <li>建议按 P0 → P1 → P2 的顺序修复</li>
           <li>每次修复后运行验证确认效果</li>
         </ul>`
      : parseInt(missingZhKeys) + parseInt(missingEnKeys) > 0
      ? `<p><strong>修复缺失的翻译键</strong></p>
         <ul>
           <li>按页面分组修复翻译键</li>
           <li>确保中英文翻译键保持同步</li>
           <li>使用 npm run translations:check 验证</li>
         </ul>`
      : `<p><strong>恭喜！所有翻译键都完整且同步</strong></p>
         <ul>
           <li>✅ 建议设置 Git Hooks 防止新问题</li>
           <li>✅ 定期运行此报告监控质量</li>
           <li>✅ 配置 CI/CD 自动验证</li>
         </ul>`
    }
  </div>
</body>
</html>
`;

// 写入报告文件
const outputPath = path.join(__dirname, '..', 'translation-validation-report.html');
fs.writeFileSync(outputPath, html, 'utf8');

console.log('✅ 验证报告生成成功！');
console.log(`📁 报告文件: ${outputPath}`);
console.log('');
console.log('💡 运行以下命令打开报告:');
console.log('   open translation-validation-report.html');
