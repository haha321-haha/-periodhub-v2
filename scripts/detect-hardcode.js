#!/usr/bin/env node

/**
 * 硬编码检测脚本
 * 快速扫描项目中的硬编码中文字符串
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
const CONFIG = {
  // 要扫描的目录
  scanDirs: [
    'app/[locale]',
    'components',
    'lib',
    'utils'
  ],
  
  // 要忽略的文件模式
  ignorePatterns: [
    '**/node_modules/**',
    '**/.next/**',
    '**/dist/**',
    '**/*.test.*',
    '**/*.spec.*',
    '**/messages/**',
    '**/eslint-rules/**',
    '**/scripts/**'
  ],
  
  // 允许的硬编码模式（正则表达式）
  allowedPatterns: [
    '^[a-zA-Z0-9\\s\\-_\\.,!?]+$', // 纯英文和数字
    '^https?://', // URL
    '^\\d+$', // 纯数字
    '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', // 邮箱
    '^[a-zA-Z0-9\\-_]+$', // 标识符
    '^[\\s\\-_\\.,!?]*$', // 只有标点符号和空格
    '^\\s*$', // 空白字符串
    '^[\\u4e00-\\u9fff]*[\\s\\-_\\.,!?]*$', // 只有中文标点符号
    '^[a-zA-Z0-9\\s\\-_\\.,!?]*[\\u4e00-\\u9fff]*[a-zA-Z0-9\\s\\-_\\.,!?]*$' // 混合但主要是英文
  ],
  
  // 中文字符正则
  chineseRegex: /[\u4e00-\u9fff]/,
  
  // locale判断正则
  localeRegex: /locale\s*===?\s*['"]zh['"]|locale\s*===?\s*['"]en['"]/
};

class HardcodeDetector {
  constructor() {
    this.results = {
      files: [],
      totalFiles: 0,
      totalIssues: 0,
      summary: {
        chineseHardcode: 0,
        localeCheck: 0,
        metadata: 0
      }
    };
  }

  // 检查文件是否应该被忽略
  shouldIgnoreFile(filePath) {
    return CONFIG.ignorePatterns.some(pattern => {
      const regex = new RegExp(pattern.replace(/\*\*/g, '.*'));
      return regex.test(filePath);
    });
  }

  // 检查文本是否匹配允许的模式
  matchesAllowedPattern(text) {
    return CONFIG.allowedPatterns.some(pattern => {
      const regex = new RegExp(pattern);
      return regex.test(text);
    });
  }

  // 检查是否在metadata相关代码中
  isInMetadata(code, index) {
    const beforeCode = code.substring(0, index);
    const afterCode = code.substring(index);
    
    // 检查是否在title、description、keywords等metadata属性中
    const metadataPatterns = [
      /title\s*:/,
      /description\s*:/,
      /keywords\s*:/,
      /og:\w+\s*:/,
      /twitter:\w+\s*:/,
      /generateMetadata/,
      /metadata\s*:/
    ];
    
    return metadataPatterns.some(pattern => 
      beforeCode.match(pattern) || afterCode.match(pattern)
    );
  }

  // 扫描单个文件
  scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const issues = [];
      
      // 检查中文字符串
      const chineseMatches = content.match(/['"`]([^'"`]*[\u4e00-\u9fff][^'"`]*)['"`]/g);
      if (chineseMatches) {
        chineseMatches.forEach(match => {
          const text = match.slice(1, -1); // 去掉引号
          
          if (!this.matchesAllowedPattern(text)) {
            const index = content.indexOf(match);
            const isMetadata = this.isInMetadata(content, index);
            
            issues.push({
              type: isMetadata ? 'metadata' : 'chineseHardcode',
              text: text.length > 50 ? text.substring(0, 50) + '...' : text,
              line: content.substring(0, index).split('\n').length,
              isMetadata
            });
          }
        });
      }
      
      // 检查locale判断
      const localeMatches = content.match(CONFIG.localeRegex);
      if (localeMatches) {
        localeMatches.forEach(match => {
          const index = content.indexOf(match);
          issues.push({
            type: 'localeCheck',
            text: match,
            line: content.substring(0, index).split('\n').length,
            isMetadata: false
          });
        });
      }
      
      if (issues.length > 0) {
        this.results.files.push({
          file: filePath,
          issues: issues
        });
        this.results.totalIssues += issues.length;
        
        // 更新统计
        issues.forEach(issue => {
          if (issue.isMetadata) {
            this.results.summary.metadata++;
          } else {
            this.results.summary[issue.type]++;
          }
        });
      }
      
    } catch (error) {
      console.error(`扫描文件失败: ${filePath}`, error.message);
    }
  }

  // 递归扫描目录
  scanDirectory(dirPath) {
    if (this.shouldIgnoreFile(dirPath)) return;
    
    try {
      const items = fs.readdirSync(dirPath);
      
      items.forEach(item => {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          this.scanDirectory(fullPath);
        } else if (stat.isFile() && /\.(tsx?|jsx?)$/.test(item)) {
          this.results.totalFiles++;
          this.scanFile(fullPath);
        }
      });
    } catch (error) {
      console.error(`扫描目录失败: ${dirPath}`, error.message);
    }
  }

  // 生成报告
  generateReport() {
    const { files, totalFiles, totalIssues, summary } = this.results;
    
    console.log('\n🔍 硬编码检测报告');
    console.log('='.repeat(50));
    console.log(`📊 统计信息:`);
    console.log(`   - 扫描文件: ${totalFiles}`);
    console.log(`   - 发现问题: ${totalIssues}`);
    console.log(`   - 中文硬编码: ${summary.chineseHardcode}`);
    console.log(`   - Locale判断: ${summary.localeCheck}`);
    console.log(`   - Metadata中: ${summary.metadata}`);
    
    if (files.length === 0) {
      console.log('\n✅ 恭喜！没有发现硬编码问题！');
      return;
    }
    
    console.log(`\n📁 问题文件 (${files.length}个):`);
    
    files.forEach(fileInfo => {
      console.log(`\n📄 ${fileInfo.file}`);
      fileInfo.issues.forEach(issue => {
        const icon = issue.type === 'chineseHardcode' ? '🈲' : 
                    issue.type === 'localeCheck' ? '🌐' : '📝';
        const type = issue.type === 'chineseHardcode' ? '中文硬编码' :
                    issue.type === 'localeCheck' ? 'Locale判断' : 'Metadata';
        
        console.log(`   ${icon} 第${issue.line}行 [${type}]: "${issue.text}"`);
      });
    });
    
    console.log('\n💡 建议:');
    console.log('   - 中文硬编码 → 使用 t("translation.key")');
    console.log('   - Locale判断 → 使用国际化系统');
    console.log('   - Metadata → 可以保持现状');
    
    console.log('\n🔧 修复命令:');
    console.log('   npm run lint -- --fix');
    console.log('   npm run detect-hardcode');
  }

  // 运行检测
  run() {
    console.log('🚀 开始硬编码检测...');
    
    CONFIG.scanDirs.forEach(dir => {
      if (fs.existsSync(dir)) {
        console.log(`📂 扫描目录: ${dir}`);
        this.scanDirectory(dir);
      } else {
        console.log(`⚠️  目录不存在: ${dir}`);
      }
    });
    
    this.generateReport();
    
    // 返回退出码
    return this.results.summary.chineseHardcode + this.results.summary.localeCheck > 0 ? 1 : 0;
  }
}

// 运行检测
if (require.main === module) {
  const detector = new HardcodeDetector();
  const exitCode = detector.run();
  process.exit(exitCode);
}

module.exports = HardcodeDetector;
