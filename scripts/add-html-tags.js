#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 需要处理的HTML文件列表
const htmlFiles = [
  // 中文HTML文件
  'parent-communication-guide.html',
  'zhan-zhuang-baduanjin-illustrated-guide.html', 
  'teacher-collaboration-handbook.html',
  'healthy-habits-checklist.html',
  'specific-menstrual-pain-management-guide.html',
  'natural-therapy-assessment.html',
  'menstrual-pain-complications-management.html',
  'magnesium-gut-health-menstrual-pain-guide.html',
  'pain-tracking-form.html',
  'teacher-health-manual.html',
  'constitution-guide.html',
  // 英文HTML文件
  'parent-communication-guide-en.html',
  'zhan-zhuang-baduanjin-illustrated-guide-en.html',
  'teacher-collaboration-handbook-en.html', 
  'healthy-habits-checklist-en.html',
  'specific-menstrual-pain-management-guide-en.html',
  'natural-therapy-assessment-en.html',
  'menstrual-pain-complications-management-en.html',
  'magnesium-gut-health-menstrual-pain-guide-en.html',
  'pain-tracking-form-en.html',
  'teacher-health-manual-en.html',
  'constitution-guide-en.html',
];

function addTagsToHtmlFile(fileName) {
  const filePath = path.join('public/downloads', fileName);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  文件不存在: ${fileName}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  
  // 检查是否已经有hreflang标签
  if (content.includes('rel="alternate" hreflang=')) {
    console.log(`✅ 已处理: ${fileName}`);
    return;
  }

  const isEnglish = fileName.includes('-en.html');
  const baseName = fileName.replace('-en.html', '').replace('.html', '');
  
  // 构建标签
  const hreflangTags = isEnglish ? 
    `    <!-- Hreflang标签 - 语言版本引用 -->
    <link rel="alternate" hreflang="en" href="https://www.periodhub.health/downloads/${fileName}">
    <link rel="alternate" hreflang="zh" href="https://www.periodhub.health/downloads/${baseName}.html">` :
    `    <!-- Hreflang标签 - 语言版本引用 -->
    <link rel="alternate" hreflang="zh" href="https://www.periodhub.health/downloads/${fileName}">
    <link rel="alternate" hreflang="en" href="https://www.periodhub.health/downloads/${baseName}-en.html">`;

  const pdfTags = isEnglish ?
    `    
    <!-- PDF版本引用 - 不占用站点地图空间 -->
    <link rel="alternate" type="application/pdf" href="/downloads/${baseName}-en.pdf" title="PDF Version - Print-friendly">
    <link rel="alternate" type="application/pdf" href="/downloads/${baseName}.pdf" title="中文PDF版本">` :
    `    
    <!-- PDF版本引用 - 不占用站点地图空间 -->
    <link rel="alternate" type="application/pdf" href="/downloads/${baseName}.pdf" title="PDF版本 - 适合打印和离线阅读">
    <link rel="alternate" type="application/pdf" href="/downloads/${baseName}-en.pdf" title="English PDF Version">`;

  // 查找title标签的位置
  const titleMatch = content.match(/(<title>.*?<\/title>)/);
  if (!titleMatch) {
    console.log(`❌ 无法找到title标签: ${fileName}`);
    return;
  }

  // 在title标签后插入新标签
  const newContent = content.replace(
    titleMatch[0],
    titleMatch[0] + '\n' + hreflangTags + pdfTags
  );

  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`✅ 已添加标签: ${fileName}`);
}

// 处理所有文件
console.log('🚀 开始为HTML文件添加hreflang和PDF引用标签...\n');

htmlFiles.forEach(fileName => {
  addTagsToHtmlFile(fileName);
});

console.log('\n🎉 批量标签添加完成！');