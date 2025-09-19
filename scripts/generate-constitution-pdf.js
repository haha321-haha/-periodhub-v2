#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generatePDFFromHTML() {
  console.log('🚀 开始生成constitution-guide-en.pdf...');
  
  let browser;
  try {
    // 启动浏览器
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // 读取英文HTML文件
    const htmlPath = path.join('public/downloads/constitution-guide-en.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // 设置页面内容
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0'
    });
    
    // 生成PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      },
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-size: 10px; color: #666; width: 100%; text-align: center; margin-top: 10px;">
          TCM Constitution Health Guide - periodhub.health
        </div>
      `,
      footerTemplate: `
        <div style="font-size: 10px; color: #666; width: 100%; text-align: center; margin-bottom: 10px;">
          <span class="pageNumber"></span> / <span class="totalPages"></span>
        </div>
      `
    });
    
    // 保存PDF文件
    const outputPath = path.join('public/downloads/constitution-guide-en.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);
    
    console.log('✅ PDF生成成功！');
    console.log(`📁 文件位置: ${outputPath}`);
    
    // 获取文件大小
    const stats = fs.statSync(outputPath);
    const fileSizeInBytes = stats.size;
    const fileSizeInKB = Math.round(fileSizeInBytes / 1024);
    
    console.log(`📊 文件大小: ${fileSizeInKB} KB`);
    console.log(`🌐 预览地址: https://www.periodhub.health/downloads/constitution-guide-en.pdf`);
    
    return outputPath;
    
  } catch (error) {
    console.error('❌ PDF生成失败:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// 验证生成的PDF
async function validatePDF(pdfPath) {
  console.log('\n🔍 验证PDF文件...');
  
  if (!fs.existsSync(pdfPath)) {
    throw new Error('PDF文件不存在');
  }
  
  const stats = fs.statSync(pdfPath);
  if (stats.size < 1000) {
    throw new Error('PDF文件太小，可能生成失败');
  }
  
  console.log('✅ PDF文件验证通过');
}

// 主函数
async function main() {
  try {
    // 检查是否安装了puppeteer
    try {
      require('puppeteer');
    } catch (e) {
      console.log('📦 正在安装puppeteer...');
      const { execSync } = require('child_process');
      execSync('npm install puppeteer', { stdio: 'inherit' });
    }
    
    const pdfPath = await generatePDFFromHTML();
    await validatePDF(pdfPath);
    
    console.log('\n🎉 constitution-guide-en.pdf 生成完成！');
    console.log('📋 下一步：');
    console.log('1. 预览PDF文件确认内容正确');
    console.log('2. 提交更改到Git');
    console.log('3. 部署到生产环境');
    
  } catch (error) {
    console.error('\n❌ 生成失败:', error.message);
    process.exit(1);
  }
}

// 运行脚本
if (require.main === module) {
  main();
}

module.exports = { generatePDFFromHTML, validatePDF };