#!/usr/bin/env node

/**
 * 保守的代码优化脚本
 * 只移除明显未使用的导入，保持代码完整性
 */

const fs = require('fs');
const path = require('path');

// 配置
const ROOT_DIR = path.join(__dirname, '..');

class ConservativeOptimizer {
  constructor() {
    this.results = {
      processedFiles: 0,
      removedImports: 0,
      errors: []
    };
  }

  /**
   * 保守优化
   */
  async optimize() {
    console.log('🔍 开始保守优化...');
    
    // 只处理明显的重复导入和注释清理
    const jsFiles = this.findFiles(['**/*.ts', '**/*.tsx'], ROOT_DIR);
    
    for (const file of jsFiles) {
      try {
        const filePath = path.join(ROOT_DIR, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // 跳过node_modules和.next目录
        if (file.includes('node_modules') || file.includes('.next')) {
          continue;
        }
        
        const optimized = this.conservativeOptimizeFile(content);
        
        if (optimized !== content) {
          fs.writeFileSync(filePath, optimized);
          this.results.processedFiles++;
          console.log(`   ✅ ${file}: 保守优化完成`);
        }
        
      } catch (error) {
        this.results.errors.push(`${file}: ${error.message}`);
        console.log(`   ⚠️ ${file}: 跳过 (${error.message})`);
      }
    }
    
    console.log(`📊 保守优化完成: 处理了 ${this.results.processedFiles} 个文件`);
    return this.results.processedFiles;
  }

  /**
   * 保守优化单个文件
   */
  conservativeOptimizeFile(content) {
    let optimized = content;
    
    // 1. 移除明显的重复导入行
    optimized = this.removeDuplicateImports(optimized);
    
    // 2. 移除多余的空行（保留必要的空行）
    optimized = this.optimizeWhitespace(optimized);
    
    // 3. 移除明显的console.log（生产环境）
    if (process.env.NODE_ENV === 'production') {
      optimized = this.removeConsoleLogs(optimized);
    }
    
    return optimized;
  }

  /**
   * 移除重复的导入
   */
  removeDuplicateImports(content) {
    const lines = content.split('\n');
    const seenImports = new Set();
    const cleanedLines = [];
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('import ')) {
        // 检查是否是重复的导入
        if (seenImports.has(trimmedLine)) {
          console.log(`     移除重复导入: ${trimmedLine}`);
          this.results.removedImports++;
          continue;
        }
        seenImports.add(trimmedLine);
      }
      
      cleanedLines.push(line);
    }
    
    return cleanedLines.join('\n');
  }

  /**
   * 优化空白字符
   */
  optimizeWhitespace(content) {
    // 移除多余的空行，但保留必要的空行
    return content
      .replace(/\n\s*\n\s*\n/g, '\n\n') // 将3个或更多空行替换为2个
      .replace(/[ \t]+$/gm, ''); // 移除行尾空格
  }

  /**
   * 移除console.log
   */
  removeConsoleLogs(content) {
    return content.replace(/console\.(log|warn|error|info)\([^)]*\);?\s*/g, '');
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
    console.log('\n📊 保守优化报告:');
    console.log(`   处理文件: ${this.results.processedFiles} 个`);
    console.log(`   移除导入: ${this.results.removedImports} 个`);
    
    if (this.results.errors.length > 0) {
      console.log(`   错误: ${this.results.errors.length} 个`);
    }
    
    return this.results;
  }

  /**
   * 运行优化
   */
  async run() {
    console.log('🚀 开始保守代码优化...\n');
    
    try {
      await this.optimize();
      console.log('');
      
      const report = this.generateReport();
      
      console.log('\n✅ 保守优化完成！');
      return report;
      
    } catch (error) {
      console.error('❌ 优化过程中出现错误:', error);
      throw error;
    }
  }
}

// 运行优化
if (require.main === module) {
  const optimizer = new ConservativeOptimizer();
  optimizer.run().catch(console.error);
}

module.exports = ConservativeOptimizer;
