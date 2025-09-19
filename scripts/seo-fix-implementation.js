#!/usr/bin/env node

/**
 * SEO修复实施脚本
 * 用于自动修复sitemap和robots配置问题
 */

const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  projectRoot: path.join(__dirname, '..'),
  sitemapPath: path.join(__dirname, '..', 'app', 'sitemap.ts'),
  robotsPath: path.join(__dirname, '..', 'app', 'robots.ts'),
  backupDir: path.join(__dirname, '..', 'backups', 'seo-fix'),
  reportDir: path.join(__dirname, '..', 'reports')
};

// 修复类
class SEOFixer {
  constructor() {
    this.backupCreated = false;
    this.fixesApplied = [];
    this.errors = [];
  }

  // 创建备份
  async createBackup() {
    console.log('📦 创建配置备份...');
    
    try {
      // 确保备份目录存在
      if (!fs.existsSync(CONFIG.backupDir)) {
        fs.mkdirSync(CONFIG.backupDir, { recursive: true });
      }
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(CONFIG.backupDir, `seo-fix-backup-${timestamp}`);
      
      // 创建备份目录
      fs.mkdirSync(backupPath, { recursive: true });
      
      // 备份sitemap.ts
      if (fs.existsSync(CONFIG.sitemapPath)) {
        fs.copyFileSync(CONFIG.sitemapPath, path.join(backupPath, 'sitemap.ts'));
        console.log('✅ Sitemap.ts已备份');
      }
      
      // 备份robots.ts
      if (fs.existsSync(CONFIG.robotsPath)) {
        fs.copyFileSync(CONFIG.robotsPath, path.join(backupPath, 'robots.ts'));
        console.log('✅ Robots.ts已备份');
      }
      
      this.backupCreated = true;
      console.log(`✅ 备份完成: ${backupPath}`);
      
      return backupPath;
    } catch (error) {
      this.errors.push(`备份创建失败: ${error.message}`);
      console.log(`❌ 备份创建失败: ${error.message}`);
      throw error;
    }
  }

  // 修复Sitemap配置
  async fixSitemap() {
    console.log('🔧 修复Sitemap配置...');
    
    try {
      if (!fs.existsSync(CONFIG.sitemapPath)) {
        throw new Error('Sitemap.ts文件不存在');
      }
      
      let content = fs.readFileSync(CONFIG.sitemapPath, 'utf8');
      
      // 检查当前PDF路径配置
      const pdfFilesMatch = content.match(/const pdfFiles = \[([\s\S]*?)\];/);
      if (!pdfFilesMatch) {
        throw new Error('未找到PDF文件配置');
      }
      
      const currentPdfConfig = pdfFilesMatch[1];
      const oldPdfPaths = currentPdfConfig.match(/\/pdf-files\/[^"]*\.pdf/g) || [];
      
      if (oldPdfPaths.length === 0) {
        console.log('✅ PDF路径配置已正确，无需修复');
        return;
      }
      
      // 替换PDF路径
      const newContent = content.replace(
        /\/pdf-files\//g,
        '/downloads/'
      );
      
      // 写回文件
      fs.writeFileSync(CONFIG.sitemapPath, newContent, 'utf8');
      
      this.fixesApplied.push({
        file: 'sitemap.ts',
        fix: 'PDF路径统一',
        details: `将 ${oldPdfPaths.length} 个PDF路径从 /pdf-files/ 改为 /downloads/`
      });
      
      console.log(`✅ Sitemap修复完成: 更新了 ${oldPdfPaths.length} 个PDF路径`);
      
    } catch (error) {
      this.errors.push(`Sitemap修复失败: ${error.message}`);
      console.log(`❌ Sitemap修复失败: ${error.message}`);
      throw error;
    }
  }

  // 修复Robots配置
  async fixRobots() {
    console.log('🔧 修复Robots配置...');
    
    try {
      if (!fs.existsSync(CONFIG.robotsPath)) {
        throw new Error('Robots.ts文件不存在');
      }
      
      let content = fs.readFileSync(CONFIG.robotsPath, 'utf8');
      
      // 检查当前icon规则
      const iconStarMatch = content.match(/disallow:\s*\[\s*([\s\S]*?)\]/);
      if (!iconStarMatch) {
        console.log('✅ Robots配置已正确，无需修复');
        return;
      }
      
      const disallowRules = iconStarMatch[1];
      const hasIconStar = disallowRules.includes("'/icon*'");
      
      if (!hasIconStar) {
        console.log('✅ Icon规则已正确，无需修复');
        return;
      }
      
      // 替换过于宽泛的icon规则
      const newContent = content.replace(
        /'\/icon\*',/g,
        "'/icon/',\n          '/icon?*',\n          '/favicon*',\n          '/apple-touch-icon*',"
      );
      
      // 写回文件
      fs.writeFileSync(CONFIG.robotsPath, newContent, 'utf8');
      
      this.fixesApplied.push({
        file: 'robots.ts',
        fix: 'Icon规则精确化',
        details: '将过于宽泛的/icon*规则替换为精确的规则'
      });
      
      console.log('✅ Robots修复完成: Icon规则已精确化');
      
    } catch (error) {
      this.errors.push(`Robots修复失败: ${error.message}`);
      console.log(`❌ Robots修复失败: ${error.message}`);
      throw error;
    }
  }

  // 验证修复结果
  async validateFixes() {
    console.log('🔍 验证修复结果...');
    
    try {
      // 检查sitemap.ts
      if (fs.existsSync(CONFIG.sitemapPath)) {
        const sitemapContent = fs.readFileSync(CONFIG.sitemapPath, 'utf8');
        const oldPdfPaths = sitemapContent.match(/\/pdf-files\//g) || [];
        
        if (oldPdfPaths.length === 0) {
          console.log('✅ Sitemap修复验证通过');
        } else {
          console.log(`⚠️  Sitemap仍有 ${oldPdfPaths.length} 个旧路径`);
        }
      }
      
      // 检查robots.ts
      if (fs.existsSync(CONFIG.robotsPath)) {
        const robotsContent = fs.readFileSync(CONFIG.robotsPath, 'utf8');
        const iconStarRules = robotsContent.match(/\/icon\*/g) || [];
        
        if (iconStarRules.length === 0) {
          console.log('✅ Robots修复验证通过');
        } else {
          console.log(`⚠️  Robots仍有 ${iconStarRules.length} 个过于宽泛的规则`);
        }
      }
      
    } catch (error) {
      this.errors.push(`验证失败: ${error.message}`);
      console.log(`❌ 验证失败: ${error.message}`);
    }
  }

  // 生成修复报告
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      backupCreated: this.backupCreated,
      fixesApplied: this.fixesApplied,
      errors: this.errors,
      status: this.errors.length === 0 ? 'SUCCESS' : 'PARTIAL',
      nextSteps: this.generateNextSteps()
    };
    
    return report;
  }

  // 生成下一步建议
  generateNextSteps() {
    const steps = [];
    
    if (this.fixesApplied.length > 0) {
      steps.push('重新构建项目: npm run build');
      steps.push('重新部署到生产环境');
      steps.push('在Google Search Console中重新提交sitemap');
      steps.push('使用URL检查工具验证关键页面');
    }
    
    if (this.errors.length > 0) {
      steps.push('检查并修复错误');
      steps.push('重新运行修复脚本');
    }
    
    steps.push('运行监控脚本验证修复效果');
    steps.push('建立定期检查机制');
    
    return steps;
  }

  // 保存报告
  async saveReport() {
    const report = this.generateReport();
    
    // 确保报告目录存在
    if (!fs.existsSync(CONFIG.reportDir)) {
      fs.mkdirSync(CONFIG.reportDir, { recursive: true });
    }
    
    // 保存详细报告
    const reportPath = path.join(CONFIG.reportDir, `seo-fix-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📋 修复报告已保存: ${reportPath}`);
    
    return report;
  }

  // 显示修复结果
  displayResults(report) {
    console.log('\n📊 SEO修复结果');
    console.log('='.repeat(50));
    
    // 状态
    console.log(`\n🏆 修复状态: ${report.status}`);
    
    // 修复内容
    if (report.fixesApplied.length > 0) {
      console.log(`\n✅ 已应用的修复:`);
      report.fixesApplied.forEach((fix, index) => {
        console.log(`   ${index + 1}. ${fix.file}: ${fix.fix}`);
        console.log(`      详情: ${fix.details}`);
      });
    }
    
    // 错误
    if (report.errors.length > 0) {
      console.log(`\n❌ 错误:`);
      report.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }
    
    // 下一步
    if (report.nextSteps.length > 0) {
      console.log(`\n🚀 下一步操作:`);
      report.nextSteps.forEach((step, index) => {
        console.log(`   ${index + 1}. ${step}`);
      });
    }
    
    console.log('='.repeat(50));
  }

  // 运行修复
  async run() {
    console.log('🚀 开始SEO修复...\n');
    
    try {
      // 创建备份
      await this.createBackup();
      
      // 修复配置
      await this.fixSitemap();
      await this.fixRobots();
      
      // 验证修复
      await this.validateFixes();
      
      // 生成报告
      const report = await this.saveReport();
      this.displayResults(report);
      
      console.log('\n✅ SEO修复完成！');
      
      return report;
      
    } catch (error) {
      console.log(`\n❌ SEO修复失败: ${error.message}`);
      throw error;
    }
  }
}

// 主函数
async function main() {
  const fixer = new SEOFixer();
  await fixer.run();
}

// 运行主函数
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { SEOFixer, main };
