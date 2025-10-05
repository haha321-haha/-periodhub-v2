#!/usr/bin/env node

/**
 * 安全的导入清理脚本
 * 只移除未使用的导入，不进行代码压缩
 */

const fs = require('fs');
const path = require('path');

// 配置
const ROOT_DIR = path.join(__dirname, '..');

class SafeImportCleaner {
  constructor() {
    this.results = {
      processedFiles: 0,
      removedImports: 0,
      errors: []
    };
  }

  /**
   * 清理未使用的导入
   */
  async cleanUnusedImports() {
    console.log('🔍 清理未使用的导入...');

    // 只处理TypeScript和JavaScript文件
    const jsFiles = this.findFiles(['**/*.ts', '**/*.tsx'], ROOT_DIR);

    for (const file of jsFiles) {
      try {
        const filePath = path.join(ROOT_DIR, file);
        const content = fs.readFileSync(filePath, 'utf8');

        // 跳过node_modules和.next目录
        if (file.includes('node_modules') || file.includes('.next')) {
          continue;
        }

        const cleaned = this.cleanFileImports(content);

        if (cleaned !== content) {
          fs.writeFileSync(filePath, cleaned);
          this.results.processedFiles++;
          console.log(`   ✅ ${file}: 清理了未使用的导入`);
        }

      } catch (error) {
        this.results.errors.push(`${file}: ${error.message}`);
        console.log(`   ⚠️ ${file}: 跳过 (${error.message})`);
      }
    }

    console.log(`📊 导入清理完成: 处理了 ${this.results.processedFiles} 个文件`);
    return this.results.processedFiles;
  }

  /**
   * 清理单个文件的导入
   */
  cleanFileImports(content) {
    const lines = content.split('\n');
    const cleanedLines = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // 检查是否是导入语句
      if (this.isImportLine(line)) {
        // 检查导入是否被使用
        if (this.isImportUsed(line, content, i)) {
          cleanedLines.push(line);
        } else {
          console.log(`     移除未使用的导入: ${line.trim()}`);
          this.results.removedImports++;
        }
      } else {
        cleanedLines.push(line);
      }
    }

    return cleanedLines.join('\n');
  }

  /**
   * 检查是否是导入语句
   */
  isImportLine(line) {
    return line.trim().startsWith('import ') && line.includes(' from ');
  }

  /**
   * 检查导入是否被使用
   */
  isImportUsed(importLine, content, importIndex) {
    // 提取导入的模块名
    const moduleName = this.extractModuleName(importLine);

    if (!moduleName) return true; // 如果无法提取模块名，保留导入

    // 在导入语句之后查找使用
    const lines = content.split('\n');
    for (let i = importIndex + 1; i < lines.length; i++) {
      const line = lines[i];

      // 跳过注释行
      if (line.trim().startsWith('//') || line.trim().startsWith('/*')) {
        continue;
      }

      // 检查是否使用了导入的模块
      if (this.isModuleUsed(line, moduleName)) {
        return true;
      }
    }

    return false;
  }

  /**
   * 提取模块名
   */
  extractModuleName(importLine) {
    // 匹配 import { ... } from 'module' 或 import Module from 'module'
    const match = importLine.match(/import\s+.*?\s+from\s+['"]([^'"]+)['"]/);
    return match ? match[1] : null;
  }

  /**
   * 检查模块是否被使用
   */
  isModuleUsed(line, moduleName) {
    // 简单的启发式检查
    const moduleBaseName = path.basename(moduleName, path.extname(moduleName));

    // 检查是否在代码中使用了模块
    return line.includes(moduleBaseName) || line.includes(moduleName);
  }

  /**
   * 查找文件
   */
  findFiles(patterns, dir) {
    const files = [];

    function walkDir(currentDir) {
      try {
        const items = fs.readdirSync(currentDir);

        for (const item of items) {
          const fullPath = path.join(currentDir, item);
          const relativePath = path.relative(ROOT_DIR, fullPath);

          // 跳过特定目录
          if (['node_modules', '.git', '.next', 'dist', 'build'].includes(item)) {
            continue;
          }

          const stat = fs.statSync(fullPath);

          if (stat.isDirectory()) {
            walkDir(fullPath);
          } else {
            // 检查文件是否匹配模式
            for (const pattern of patterns) {
              const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
              if (regex.test(relativePath)) {
                files.push(relativePath);
                break;
              }
            }
          }
        }
      } catch (error) {
        // 忽略权限错误
      }
    }

    walkDir(dir);
    return files;
  }

  /**
   * 生成报告
   */
  generateReport() {
    console.log('\n📊 安全导入清理报告:');
    console.log(`   处理文件: ${this.results.processedFiles} 个`);
    console.log(`   移除导入: ${this.results.removedImports} 个`);

    if (this.results.errors.length > 0) {
      console.log(`   错误: ${this.results.errors.length} 个`);
    }

    return this.results;
  }

  /**
   * 运行清理
   */
  async run() {
    console.log('🚀 开始安全导入清理...\n');

    try {
      await this.cleanUnusedImports();
      console.log('');

      const report = this.generateReport();

      console.log('\n✅ 清理完成！');
      return report;

    } catch (error) {
      console.error('❌ 清理过程中出现错误:', error);
      throw error;
    }
  }
}

// 运行清理
if (require.main === module) {
  const cleaner = new SafeImportCleaner();
  cleaner.run().catch(console.error);
}

module.exports = SafeImportCleaner;
