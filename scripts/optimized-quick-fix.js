#!/usr/bin/env node
// =============================================================================
// 优化版快速硬编码修复工具
// 基于用户反馈优化：性能、错误处理、进度反馈
// 版本: 2.0 - 优化版
// =============================================================================

const fs = require('fs').promises;
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');
const execAsync = promisify(exec);

// =============================================================================
// 1. 增强的进度反馈系统
// =============================================================================
class EnhancedProgressBar {
    constructor(total, description = '处理中') {
        this.total = total;
        this.current = 0;
        this.description = description;
        this.startTime = Date.now();
        this.errors = 0;
        this.successes = 0;
    }

    update(current = null, fileName = '', status = 'processing') {
        if (current !== null) this.current = current;
        else this.current++;
        
        if (status === 'success') this.successes++;
        if (status === 'error') this.errors++;
        
        const percentage = Math.round((this.current / this.total) * 100);
        const elapsed = (Date.now() - this.startTime) / 1000;
        const eta = this.current > 0 ? ((elapsed / this.current) * (this.total - this.current)) : 0;
        
        // 彩色进度条
        const completed = Math.round(percentage / 2);
        const bar = '█'.repeat(completed) + '░'.repeat(50 - completed);
        
        // 状态图标
        const statusIcon = status === 'success' ? '✅' : status === 'error' ? '❌' : '🔄';
        
        const line = `\r${statusIcon} ${this.description}: [${bar}] ${percentage}% (${this.current}/${this.total}) | ✅${this.successes} ❌${this.errors} | ETA: ${Math.round(eta)}s`;
        process.stdout.write(line);
        
        if (fileName && this.current <= this.total) {
            const shortName = fileName.length > 40 ? '...' + fileName.slice(-37) : fileName;
            process.stdout.write(`\n  📁 ${shortName}`);
            process.stdout.write(`\r${line}`);
        }
        
        if (this.current >= this.total) {
            console.log(`\n🎉 ${this.description}完成! 用时: ${Math.round(elapsed)}秒`);
            console.log(`📊 结果: ✅ ${this.successes} 成功, ❌ ${this.errors} 失败\n`);
        }
    }
}

// =============================================================================
// 2. 增强的错误处理系统
// =============================================================================
class ErrorHandler {
    constructor() {
        this.errors = [];
        this.warnings = [];
    }

    logError(context, error, filePath = null) {
        const errorInfo = {
            timestamp: new Date().toISOString(),
            context,
            message: error.message,
            filePath,
            stack: error.stack
        };
        
        this.errors.push(errorInfo);
        
        console.error(`❌ ${context}: ${error.message}`);
        if (filePath) {
            console.error(`   📁 文件: ${filePath}`);
        }
    }

    logWarning(context, message, filePath = null) {
        const warningInfo = {
            timestamp: new Date().toISOString(),
            context,
            message,
            filePath
        };
        
        this.warnings.push(warningInfo);
        console.warn(`⚠️ ${context}: ${message}`);
    }

    async saveErrorLog() {
        if (this.errors.length > 0 || this.warnings.length > 0) {
            const logData = {
                timestamp: new Date().toISOString(),
                summary: {
                    totalErrors: this.errors.length,
                    totalWarnings: this.warnings.length
                },
                errors: this.errors,
                warnings: this.warnings
            };
            
            await fs.writeFile('hardcode-fix-error-log.json', JSON.stringify(logData, null, 2));
            console.log(`📄 错误日志已保存到: hardcode-fix-error-log.json`);
        }
    }

    hasErrors() {
        return this.errors.length > 0;
    }

    getSummary() {
        return {
            errors: this.errors.length,
            warnings: this.warnings.length,
            hasIssues: this.errors.length > 0 || this.warnings.length > 0
        };
    }
}

// =============================================================================
// 3. 多环境URL验证器
// =============================================================================
class URLValidator {
    constructor() {
        this.environments = {
            development: process.env.NEXT_PUBLIC_BASE_URL_DEV || 'http://localhost:3001',
            staging: process.env.NEXT_PUBLIC_BASE_URL_STAGING || 'https://staging.periodhub.health',
            production: process.env.NEXT_PUBLIC_BASE_URL || 'https://www.periodhub.health'
        };
    }

    validateUrl(url) {
        try {
            const urlObj = new URL(url);
            
            // 基础格式检查
            if (!urlObj.protocol.startsWith('http')) {
                return { valid: false, message: '协议必须是HTTP或HTTPS' };
            }
            
            // 域名检查
            if (!urlObj.hostname) {
                return { valid: false, message: '缺少有效的域名' };
            }
            
            return { valid: true, message: 'URL格式正确' };
        } catch (error) {
            return { valid: false, message: `URL格式错误: ${error.message}` };
        }
    }

    generateEnvironmentUrls(locale, path) {
        const results = {};
        
        Object.entries(this.environments).forEach(([env, baseUrl]) => {
            const cleanPath = path.startsWith('/') ? path.slice(1) : path;
            const url = `${baseUrl}/${locale}/${cleanPath}`;
            
            results[env] = {
                url,
                validation: this.validateUrl(url)
            };
        });
        
        return results;
    }

    getEnvironmentVariableTemplate() {
        return `
# 多环境URL配置
NEXT_PUBLIC_BASE_URL=https://www.periodhub.health
NEXT_PUBLIC_BASE_URL_DEV=http://localhost:3001
NEXT_PUBLIC_BASE_URL_STAGING=https://staging.periodhub.health

# 当前环境检测
NODE_ENV=development
        `.trim();
    }
}

// =============================================================================
// 4. 性能优化的硬编码检测器
// =============================================================================
class OptimizedHardcodeDetector {
    constructor() {
        this.patterns = [
            { name: 'HTTPS主域名', regex: /https:\/\/www\.periodhub\.health/g, priority: 'high' },
            { name: 'HTTP主域名', regex: /http:\/\/www\.periodhub\.health/g, priority: 'high' },
            { name: '单引号URL', regex: /'https:\/\/www\.periodhub\.health[^']*'/g, priority: 'medium' },
            { name: '双引号URL', regex: /"https:\/\/www\.periodhub\.health[^"]*"/g, priority: 'medium' },
            { name: '短域名', regex: /https:\/\/periodhub\.health/g, priority: 'low' }
        ];
        
        this.excludePatterns = [
            /node_modules/, /\.git/, /dist/, /build/, /\.next/, 
            /backups/, /scripts/, /coverage/, /\.cache/
        ];
        
        this.batchSize = 10; // 优化批处理大小
        this.maxConcurrency = 5; // 限制并发数
    }

    async getAllFiles(dir, extensions = ['.tsx', '.ts', '.js', '.jsx']) {
        const files = [];
        const maxDepth = 10; // 限制扫描深度，防止无限递归
        
        const scanDirectory = async (currentDir, depth = 0) => {
            if (depth > maxDepth) return;
            
            try {
                const entries = await fs.readdir(currentDir, { withFileTypes: true });
                
                const promises = entries.map(async (entry) => {
                    const fullPath = path.join(currentDir, entry.name);
                    
                    // 跳过排除的目录
                    if (this.excludePatterns.some(pattern => pattern.test(fullPath))) {
                        return;
                    }
                    
                    if (entry.isDirectory()) {
                        await scanDirectory(fullPath, depth + 1);
                    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
                        files.push(fullPath);
                    }
                });
                
                // 控制并发数
                await this.limitConcurrency(promises, this.maxConcurrency);
            } catch (error) {
                console.error(`扫描目录错误 ${currentDir}:`, error.message);
            }
        };
        
        await scanDirectory(dir);
        return files;
    }

    async limitConcurrency(promises, limit) {
        for (let i = 0; i < promises.length; i += limit) {
            const batch = promises.slice(i, i + limit);
            await Promise.all(batch);
        }
    }

    async detectInFile(filePath, errorHandler) {
        try {
            const content = await fs.readFile(filePath, 'utf8');
            const fileResults = [];
            
            // 预检查：如果文件不包含域名，跳过详细检查
            if (!content.includes('periodhub.health')) {
                return fileResults;
            }
            
            this.patterns.forEach((patternInfo, patternIndex) => {
                let match;
                const regex = new RegExp(patternInfo.regex.source, patternInfo.regex.flags);
                
                while ((match = regex.exec(content)) !== null) {
                    const lines = content.substring(0, match.index).split('\n');
                    const lineNumber = lines.length;
                    const lineContent = content.split('\n')[lineNumber - 1];
                    
                    fileResults.push({
                        file: filePath,
                        line: lineNumber,
                        match: match[0],
                        context: lineContent.trim(),
                        patternName: patternInfo.name,
                        priority: patternInfo.priority,
                        patternIndex
                    });
                }
            });
            
            return fileResults;
        } catch (error) {
            errorHandler.logError('文件检测失败', error, filePath);
            return [];
        }
    }

    async detectAllOptimized(directory = '.') {
        console.log('🔍 开始优化版硬编码检测...\n');
        const errorHandler = new ErrorHandler();
        
        // 获取所有文件
        const files = await this.getAllFiles(directory);
        if (files.length === 0) {
            console.log('❌ 没有找到需要检测的文件');
            return { results: [], grouped: {}, summary: {} };
        }
        
        console.log(`📁 找到 ${files.length} 个文件需要检测\n`);
        
        // 创建进度条
        const progressBar = new EnhancedProgressBar(files.length, '检测硬编码');
        
        // 优化的批量处理
        const results = [];
        for (let i = 0; i < files.length; i += this.batchSize) {
            const batch = files.slice(i, i + this.batchSize);
            
            const batchPromises = batch.map(async (file) => {
                try {
                    const result = await this.detectInFile(file, errorHandler);
                    progressBar.update(null, file, 'success');
                    return result;
                } catch (error) {
                    errorHandler.logError('批处理检测失败', error, file);
                    progressBar.update(null, file, 'error');
                    return [];
                }
            });
            
            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults.flat());
            
            // 小延迟，避免过度占用CPU
            if (i + this.batchSize < files.length) {
                await new Promise(resolve => setTimeout(resolve, 10));
            }
        }
        
        // 按文件分组统计
        const grouped = this.groupResultsByFile(results);
        const summary = this.generateSummary(results, grouped);
        
        // 保存错误日志
        await errorHandler.saveErrorLog();
        
        return { results, grouped, summary, errors: errorHandler.getSummary() };
    }

    groupResultsByFile(results) {
        const grouped = {};
        results.forEach(result => {
            if (!grouped[result.file]) {
                grouped[result.file] = [];
            }
            grouped[result.file].push(result);
        });
        
        // 按优先级和数量排序
        return Object.entries(grouped)
            .sort(([,a], [,b]) => {
                // 先按高优先级项目数量排序
                const aHighPriority = a.filter(r => r.priority === 'high').length;
                const bHighPriority = b.filter(r => r.priority === 'high').length;
                
                if (aHighPriority !== bHighPriority) {
                    return bHighPriority - aHighPriority;
                }
                
                // 再按总数量排序
                return b.length - a.length;
            })
            .reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {});
    }

    generateSummary(results, grouped) {
        const totalMatches = results.length;
        const totalFiles = Object.keys(grouped).length;
        
        // 按优先级统计
        const priorityStats = {
            high: results.filter(r => r.priority === 'high').length,
            medium: results.filter(r => r.priority === 'medium').length,
            low: results.filter(r => r.priority === 'low').length
        };
        
        // 按模式统计
        const patternStats = {};
        results.forEach(result => {
            const pattern = result.patternName;
            patternStats[pattern] = (patternStats[pattern] || 0) + 1;
        });
        
        return {
            totalMatches,
            totalFiles,
            averagePerFile: totalFiles > 0 ? (totalMatches / totalFiles).toFixed(2) : 0,
            priorityStats,
            patternStats
        };
    }
}

// =============================================================================
// 5. 智能批量修复器
// =============================================================================
class SmartBatchFixer {
    constructor() {
        this.backupDir = `backups/smart_fix_${Date.now()}`;
        this.errorHandler = new ErrorHandler();
        
        // 增强的修复模式
        this.fixPatterns = [
            {
                name: '基础HTTPS URL替换',
                search: /(?<!process\.env\.)https:\/\/www\.periodhub\.health(?!\$)/g,
                replace: '${process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"}',
                priority: 'high'
            },
            {
                name: '单引号URL替换',
                search: /'https:\/\/www\.periodhub\.health([^']*)'/g,
                replace: '`${process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"}$1`',
                priority: 'high'
            },
            {
                name: '双引号URL替换',
                search: /"https:\/\/www\.periodhub\.health([^"]*)"/g,
                replace: '`${process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"}$1`',
                priority: 'medium'
            },
            {
                name: 'URL对象属性',
                search: /(url|canonical|href):\s*["'`]https:\/\/www\.periodhub\.health([^"'`]*)/g,
                replace: '$1: `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"}$2',
                priority: 'high'
            }
        ];
    }

    async createBackup(filePath) {
        try {
            const backupPath = path.join(this.backupDir, filePath);
            const backupDirPath = path.dirname(backupPath);
            
            await fs.mkdir(backupDirPath, { recursive: true });
            await fs.copyFile(filePath, backupPath);
            
            return { success: true, backupPath };
        } catch (error) {
            this.errorHandler.logError('备份失败', error, filePath);
            return { success: false, error: error.message };
        }
    }

    async validateSyntax(filePath) {
        try {
            // 使用TypeScript编译器进行语法检查
            const result = await execAsync(`npx tsc --noEmit --skipLibCheck ${filePath}`, { timeout: 10000 });
            return { valid: true, message: '语法检查通过' };
        } catch (error) {
            // 如果是超时或TypeScript不可用，跳过检查
            if (error.message.includes('timeout') || error.message.includes('not found')) {
                return { valid: true, message: '语法检查跳过' };
            }
            return { valid: false, message: error.message };
        }
    }

    async fixFile(filePath, dryRun = false) {
        try {
            // 1. 预检查
            const syntaxCheck = await this.validateSyntax(filePath);
            if (!syntaxCheck.valid) {
                throw new Error(`语法检查失败: ${syntaxCheck.message}`);
            }

            // 2. 备份文件
            if (!dryRun) {
                const backupResult = await this.createBackup(filePath);
                if (!backupResult.success) {
                    throw new Error(`备份失败: ${backupResult.error}`);
                }
            }

            // 3. 读取文件内容
            let content = await fs.readFile(filePath, 'utf8');
            const originalContent = content;
            const appliedFixes = [];
            let totalChanges = 0;

            // 4. 应用修复模式
            for (const pattern of this.fixPatterns) {
                const beforeContent = content;
                content = content.replace(pattern.search, pattern.replace);
                
                if (beforeContent !== content) {
                    const matches = (beforeContent.match(pattern.search) || []).length;
                    totalChanges += matches;
                    appliedFixes.push({
                        name: pattern.name,
                        matches,
                        priority: pattern.priority
                    });
                }
            }

            // 5. 写入修改后的文件
            if (totalChanges > 0 && !dryRun) {
                await fs.writeFile(filePath, content, 'utf8');
            }

            // 6. 后检查
            if (!dryRun && totalChanges > 0) {
                const postSyntaxCheck = await this.validateSyntax(filePath);
                if (!postSyntaxCheck.valid) {
                    this.errorHandler.logWarning('修复后语法检查失败', postSyntaxCheck.message, filePath);
                }
            }

            return {
                success: true,
                changes: totalChanges,
                appliedFixes,
                sizeChange: content.length - originalContent.length,
                dryRun
            };
        } catch (error) {
            this.errorHandler.logError('文件修复失败', error, filePath);
            return {
                success: false,
                error: error.message,
                changes: 0,
                dryRun
            };
        }
    }

    async batchFix(files, options = {}) {
        const { dryRun = false, batchSize = 5, maxRetries = 2 } = options;
        
        console.log(`\n🔧 ${dryRun ? '模拟' : '开始'}智能批量修复...`);
        console.log(`处理文件数: ${files.length}`);
        console.log(`批处理大小: ${batchSize}`);
        
        if (!dryRun) {
            await fs.mkdir(this.backupDir, { recursive: true });
            console.log(`📁 备份目录: ${this.backupDir}`);
        }
        
        const progressBar = new EnhancedProgressBar(files.length, '修复进度');
        const results = [];
        
        // 分批处理文件
        for (let i = 0; i < files.length; i += batchSize) {
            const batch = files.slice(i, i + batchSize);
            
            const batchResults = await Promise.all(
                batch.map(async (file) => {
                    let attempts = 0;
                    let lastError = null;
                    
                    // 重试机制
                    while (attempts <= maxRetries) {
                        try {
                            const result = await this.fixFile(file, dryRun);
                            const status = result.success ? 'success' : 'error';
                            progressBar.update(null, file, status);
                            return { file, ...result };
                        } catch (error) {
                            lastError = error;
                            attempts++;
                            
                            if (attempts <= maxRetries) {
                                console.log(`⚠️ 重试 ${file} (第${attempts}次)`);
                                await new Promise(resolve => setTimeout(resolve, 1000));
                            }
                        }
                    }
                    
                    // 所有重试都失败了
                    this.errorHandler.logError('文件处理最终失败', lastError, file);
                    progressBar.update(null, file, 'error');
                    return { file, success: false, error: lastError.message, changes: 0 };
                })
            );
            
            results.push(...batchResults);
            
            // 批次间小延迟
            if (i + batchSize < files.length) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        
        // 保存错误日志
        await this.errorHandler.saveErrorLog();
        
        return {
            results,
            summary: this.generateFixSummary(results),
            errors: this.errorHandler.getSummary()
        };
    }

    generateFixSummary(results) {
        const totalFiles = results.length;
        const successfulFixes = results.filter(r => r.success).length;
        const totalChanges = results.reduce((sum, r) => sum + (r.changes || 0), 0);
        const failedFixes = results.filter(r => !r.success);
        
        return {
            totalFiles,
            successfulFixes,
            failedFixes: failedFixes.length,
            totalChanges,
            successRate: totalFiles > 0 ? ((successfulFixes / totalFiles) * 100).toFixed(1) : 0,
            failedFiles: failedFixes.map(f => ({ file: f.file, error: f.error }))
        };
    }
}

// =============================================================================
// 6. 主控制器 - 集成所有功能
// =============================================================================
class OptimizedHardcodeFixer {
    constructor() {
        this.detector = new OptimizedHardcodeDetector();
        this.validator = new URLValidator();
        this.batchFixer = new SmartBatchFixer();
        this.errorHandler = new ErrorHandler();
    }

    async setupEnvironment() {
        console.log('🔧 环境设置与检查...\n');
        
        try {
            // 1. 检查端口冲突
            await this.checkAndFixPortConflict();
            
            // 2. 创建环境变量文件
            await this.setupEnvironmentVariables();
            
            // 3. 验证开发环境
            await this.verifyDevelopmentEnvironment();
            
            console.log('✅ 环境设置完成!\n');
            return true;
        } catch (error) {
            this.errorHandler.logError('环境设置失败', error);
            return false;
        }
    }

    async checkAndFixPortConflict() {
        console.log('🔍 检查端口冲突...');
        
        const ports = [3001, 3002, 3003];
        
        for (const port of ports) {
            try {
                const { stdout } = await execAsync(`lsof -ti:${port}`, { timeout: 5000 });
                if (stdout.trim()) {
                    console.log(`⚠️ 端口 ${port} 被占用，尝试释放...`);
                    try {
                        await execAsync(`kill -9 ${stdout.trim()}`);
                        console.log(`✅ 端口 ${port} 已释放`);
                    } catch (killError) {
                        console.log(`⚠️ 无法释放端口 ${port}，将使用其他端口`);
                    }
                } else {
                    console.log(`✅ 端口 ${port} 可用`);
                }
            } catch (error) {
                // 端口未被占用
                console.log(`✅ 端口 ${port} 可用`);
            }
        }
    }

    async setupEnvironmentVariables() {
        console.log('📝 设置环境变量...');
        
        const envTemplate = this.validator.getEnvironmentVariableTemplate();
        
        try {
            // 检查 .env.local 是否存在
            await fs.access('.env.local');
            console.log('⚠️ .env.local 已存在，跳过创建');
        } catch {
            // 创建 .env.local
            await fs.writeFile('.env.local', envTemplate);
            console.log('✅ 已创建 .env.local 文件');
        }
    }

    async verifyDevelopmentEnvironment() {
        console.log('🔍 验证开发环境...');
        
        // 检查关键文件
        const requiredFiles = ['package.json', 'next.config.js'];
        for (const file of requiredFiles) {
            try {
                await fs.access(file);
                console.log(`✅ ${file} 存在`);
            } catch {
                console.log(`⚠️ ${file} 不存在`);
            }
        }
        
        // 检查依赖
        try {
            await fs.access('node_modules');
            console.log('✅ node_modules 存在');
        } catch {
            console.log('⚠️ node_modules 不存在，请运行: npm install');
        }
    }

    async runQuickDetection(directory = '.') {
        console.log('⚡ 运行快速检测...\n');
        
        const { results, grouped, summary, errors } = await this.detector.detectAllOptimized(directory);
        
        // 生成优化报告
        this.generateOptimizedReport(summary, grouped);
        
        // 保存结果
        const reportData = {
            timestamp: new Date().toISOString(),
            summary,
            detailedResults: grouped,
            errors
        };
        
        await fs.writeFile('optimized-hardcode-report.json', JSON.stringify(reportData, null, 2));
        console.log('📄 详细报告已保存到: optimized-hardcode-report.json');
        
        return reportData;
    }

    generateOptimizedReport(summary, grouped) {
        console.log('\n📊 优化版硬编码检测报告');
        console.log('='.repeat(60));
        console.log(`总硬编码数量: ${summary.totalMatches}`);
        console.log(`受影响文件: ${summary.totalFiles}`);
        console.log(`平均每文件: ${summary.averagePerFile} 个\n`);
        
        // 优先级分布
        console.log('🎯 优先级分布:');
        console.log(`  🔴 高优先级: ${summary.priorityStats.high} 个`);
        console.log(`  🟡 中优先级: ${summary.priorityStats.medium} 个`);
        console.log(`  🟢 低优先级: ${summary.priorityStats.low} 个\n`);
        
        // 模式分布
        console.log('📈 模式分布:');
        Object.entries(summary.patternStats).forEach(([pattern, count]) => {
            console.log(`  ${pattern}: ${count} 个`);
        });
        console.log('');
        
        // Top 10 文件
        const topFiles = Object.entries(grouped).slice(0, 10);
        console.log('🔴 需要优先处理的文件:');
        topFiles.forEach(([file, matches], index) => {
            const highPriority = matches.filter(m => m.priority === 'high').length;
            const total = matches.length;
            const priorityLabel = highPriority >= 5 ? '🔴 高' : highPriority >= 2 ? '🟡 中' : '🟢 低';
            
            console.log(`${index + 1}. ${file}`);
            console.log(`   总计: ${total} 个 | 高优先级: ${highPriority} 个 | 优先级: ${priorityLabel}`);
        });
        
        console.log('\n💡 执行建议:');
        if (summary.totalMatches === 0) {
            console.log('🎉 没有发现硬编码，无需处理！');
        } else if (summary.totalMatches <= 20) {
            console.log('✅ 硬编码数量较少，建议直接批量处理');
        } else {
            console.log('⚠️ 硬编码数量较多，建议分阶段处理：');
            console.log('1. 先处理高优先级文件');
            console.log('2. 分批处理其他文件');
            console.log('3. 每批处理后进行测试验证');
        }
    }

    async runSmartFix(files, dryRun = true) {
        console.log(`\n🤖 运行智能修复 ${dryRun ? '(模拟模式)' : '(实际执行)'}...\n`);
        
        const fixResults = await this.batchFixer.batchFix(files, { 
            dryRun,
            batchSize: 8,
            maxRetries: 2
        });
        
        // 生成修复报告
        this.generateFixReport(fixResults);
        
        return fixResults;
    }

    generateFixReport(fixResults) {
        const { results, summary, errors } = fixResults;
        
        console.log('\n📊 智能修复报告');
        console.log('='.repeat(60));
        console.log(`处理文件: ${summary.totalFiles} 个`);
        console.log(`修复成功: ${summary.successfulFixes} 个`);
        console.log(`修复失败: ${summary.failedFixes} 个`);
        console.log(`总更改数: ${summary.totalChanges} 个`);
        console.log(`成功率: ${summary.successRate}%\n`);
        
        // 失败文件详情
        if (summary.failedFiles.length > 0) {
            console.log('❌ 修复失败的文件:');
            summary.failedFiles.forEach(({ file, error }) => {
                console.log(`  ${file}: ${error}`);
            });
            console.log('');
        }
        
        // 错误统计
        if (errors.hasIssues) {
            console.log('⚠️ 错误统计:');
            console.log(`  错误: ${errors.errors} 个`);
            console.log(`  警告: ${errors.warnings} 个`);
        }
        
        console.log('💡 下一步建议:');
        if (summary.successRate >= 95) {
            console.log('✅ 修复效果excellent！可以继续下一批次');
        } else if (summary.successRate >= 80) {
            console.log('⚠️ 修复效果良好，建议检查失败原因后继续');
        } else {
            console.log('❌ 修复效果不佳，建议检查配置和环境');
        }
    }
}

// =============================================================================
// 7. 命令行接口
// =============================================================================
async function main() {
    const args = process.argv.slice(2);
    const fixer = new OptimizedHardcodeFixer();
    
    console.log('🚀 优化版硬编码修复工具 v2.0\n');
    
    if (args.includes('--help')) {
        console.log(`
使用方法:
  node optimized-quick-fix.js                    # 完整流程 (推荐)
  node optimized-quick-fix.js --setup           # 仅环境设置
  node optimized-quick-fix.js --detect          # 仅快速检测
  node optimized-quick-fix.js --fix-dry         # 模拟修复
  node optimized-quick-fix.js --fix             # 实际修复
  
选项:
  --files="file1,file2"                         # 指定文件
  --batch-size=10                               # 批处理大小
  --help                                        # 显示帮助
        `);
        return;
    }
    
    try {
        if (args.includes('--setup')) {
            await fixer.setupEnvironment();
        } else if (args.includes('--detect')) {
            await fixer.runQuickDetection();
        } else if (args.includes('--fix-dry') || args.includes('--fix')) {
            const filesArg = args.find(arg => arg.startsWith('--files='));
            let files = [];
            
            if (filesArg) {
                files = filesArg.split('=')[1].replace(/"/g, '').split(',');
            } else {
                // 使用检测结果
                try {
                    const reportData = JSON.parse(await fs.readFile('optimized-hardcode-report.json', 'utf8'));
                    const grouped = reportData.detailedResults;
                    
                    // 自动选择前10个需要处理的文件
                    files = Object.keys(grouped).slice(0, 10);
                    
                    if (files.length === 0) {
                        console.log('❌ 没有找到需要修复的文件');
                        return;
                    }
                    
                    console.log(`📋 自动选择了 ${files.length} 个文件进行修复:`);
                    files.forEach((file, index) => {
                        console.log(`  ${index + 1}. ${file}`);
                    });
                    console.log('');
                } catch {
                    console.log('❌ 请先运行检测或使用 --files 指定文件');
                    return;
                }
            }
            
            const dryRun = args.includes('--fix-dry');
            await fixer.runSmartFix(files, dryRun);
        } else {
            // 默认：完整流程
            console.log('🔄 执行完整流程...\n');
            
            // 1. 环境设置
            const envOk = await fixer.setupEnvironment();
            if (!envOk) {
                console.log('❌ 环境设置失败，请检查错误日志');
                return;
            }
            
            // 2. 快速检测
            const reportData = await fixer.runQuickDetection();
            
            if (reportData.summary.totalMatches === 0) {
                console.log('🎉 没有发现硬编码，任务完成！');
                return;
            }
            
            // 3. 自动选择优先文件进行模拟修复
            const grouped = reportData.detailedResults;
            const priorityFiles = Object.keys(grouped).slice(0, 5);
            
            console.log(`\n🧪 对前 ${priorityFiles.length} 个优先文件进行模拟修复...`);
            const dryRunResults = await fixer.runSmartFix(priorityFiles, true);
            
            if (dryRunResults.summary.successRate >= 90) {
                console.log('\n✅ 模拟修复成功！可以执行实际修复');
                console.log('💡 运行命令: node optimized-quick-fix.js --fix');
            } else {
                console.log('\n⚠️ 模拟修复成功率较低，建议检查环境配置');
            }
        }
    } catch (error) {
        console.error('❌ 执行错误:', error);
        process.exit(1);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { OptimizedHardcodeFixer };

