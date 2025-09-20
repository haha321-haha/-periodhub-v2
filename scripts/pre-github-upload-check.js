#!/usr/bin/env node

/**
 * GitHub上传前最终检查脚本
 * 确保项目代码质量、安全性和完整性
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class PreGitHubUploadChecker {
    constructor() {
        this.results = {
            codeQuality: {},
            security: {},
            documentation: {},
            performance: {},
            compatibility: {},
            overallScore: 0,
            issues: [],
            warnings: []
        };
        
        this.criticalFiles = [
            'package.json',
            'tsconfig.json',
            'next.config.js',
            'README.md',
            '.gitignore'
        ];
    }

    async runCompleteCheck() {
        console.log('🔍 开始GitHub上传前最终检查...\n');
        
        try {
            // 1. 代码质量检查
            await this.checkCodeQuality();
            
            // 2. 安全性检查
            await this.checkSecurity();
            
            // 3. 文档完整性检查
            await this.checkDocumentation();
            
            // 4. 性能检查
            await this.checkPerformance();
            
            // 5. 兼容性检查
            await this.checkCompatibility();
            
            // 6. 文件结构检查
            await this.checkFileStructure();
            
            // 7. Git状态检查
            await this.checkGitStatus();
            
            // 8. 生成最终报告
            this.generateFinalReport();
            
        } catch (error) {
            console.error('❌ 检查过程中出现错误:', error.message);
            return false;
        }
        
        return this.results.overallScore >= 85;
    }

    async checkCodeQuality() {
        console.log('📝 检查代码质量...');
        
        const checks = {
            typescript: this.checkTypeScript(),
            linting: this.checkLinting(),
            formatting: this.checkFormatting(),
            testing: this.checkTesting(),
            buildSuccess: this.checkBuild()
        };
        
        this.results.codeQuality = checks;
        
        console.log('✅ 代码质量检查完成');
        Object.entries(checks).forEach(([key, result]) => {
            console.log(`   - ${key}: ${result.passed ? '✅' : '❌'} ${result.score}/100`);
        });
        console.log();
    }

    checkTypeScript() {
        try {
            console.log('   检查TypeScript类型...');
            execSync('npx tsc --noEmit', { stdio: 'pipe' });
            return { passed: true, score: 100, message: 'TypeScript类型检查通过' };
        } catch (error) {
            this.results.issues.push('TypeScript类型错误');
            return { passed: false, score: 0, message: 'TypeScript类型检查失败', error: error.message };
        }
    }

    checkLinting() {
        try {
            console.log('   检查代码规范...');
            execSync('npm run lint', { stdio: 'pipe' });
            return { passed: true, score: 100, message: 'ESLint检查通过' };
        } catch (error) {
            this.results.warnings.push('代码规范问题');
            return { passed: false, score: 70, message: 'ESLint检查有警告', error: error.message };
        }
    }

    checkFormatting() {
        try {
            console.log('   检查代码格式...');
            // 检查是否有Prettier配置
            const hasPrettierConfig = fs.existsSync('.prettierrc') || fs.existsSync('prettier.config.js');
            
            if (hasPrettierConfig) {
                execSync('npx prettier --check .', { stdio: 'pipe' });
                return { passed: true, score: 100, message: 'Prettier格式检查通过' };
            } else {
                return { passed: true, score: 90, message: '未配置Prettier，建议添加' };
            }
        } catch (error) {
            this.results.warnings.push('代码格式不一致');
            return { passed: false, score: 80, message: '代码格式需要调整' };
        }
    }

    checkTesting() {
        try {
            console.log('   检查测试覆盖率...');
            
            // 检查是否有测试文件
            const testFiles = this.findTestFiles();
            
            if (testFiles.length === 0) {
                this.results.warnings.push('缺少测试文件');
                return { passed: false, score: 60, message: '建议添加测试文件' };
            }
            
            // 运行测试
            execSync('npm test', { stdio: 'pipe' });
            return { passed: true, score: 95, message: `找到${testFiles.length}个测试文件，测试通过` };
        } catch (error) {
            this.results.issues.push('测试失败');
            return { passed: false, score: 40, message: '测试执行失败', error: error.message };
        }
    }

    checkBuild() {
        try {
            console.log('   检查构建...');
            execSync('npm run build', { stdio: 'pipe' });
            return { passed: true, score: 100, message: '项目构建成功' };
        } catch (error) {
            this.results.issues.push('构建失败');
            return { passed: false, score: 0, message: '项目构建失败', error: error.message };
        }
    }

    async checkSecurity() {
        console.log('🔒 检查安全性...');
        
        const checks = {
            vulnerabilities: this.checkVulnerabilities(),
            sensitiveFiles: this.checkSensitiveFiles(),
            dependencies: this.checkDependencies(),
            secrets: this.checkSecrets()
        };
        
        this.results.security = checks;
        
        console.log('✅ 安全性检查完成');
        Object.entries(checks).forEach(([key, result]) => {
            console.log(`   - ${key}: ${result.passed ? '✅' : '❌'} ${result.score}/100`);
        });
        console.log();
    }

    checkVulnerabilities() {
        try {
            console.log('   检查依赖漏洞...');
            execSync('npm audit --audit-level=high', { stdio: 'pipe' });
            return { passed: true, score: 100, message: '未发现高危漏洞' };
        } catch (error) {
            this.results.issues.push('存在安全漏洞');
            return { passed: false, score: 30, message: '发现安全漏洞，建议修复' };
        }
    }

    checkSensitiveFiles() {
        console.log('   检查敏感文件...');
        
        const sensitivePatterns = [
            '.env',
            '.env.local',
            '.env.production',
            'config/secrets.js',
            'private.key',
            '*.pem',
            'credentials.json'
        ];
        
        const foundSensitiveFiles = [];
        
        sensitivePatterns.forEach(pattern => {
            try {
                const files = execSync(`find . -name "${pattern}" -not -path "./node_modules/*"`, { 
                    encoding: 'utf8', 
                    stdio: 'pipe' 
                }).trim().split('\n').filter(f => f);
                
                foundSensitiveFiles.push(...files);
            } catch (error) {
                // 文件不存在，这是好事
            }
        });
        
        if (foundSensitiveFiles.length > 0) {
            this.results.warnings.push(`发现敏感文件: ${foundSensitiveFiles.join(', ')}`);
            return { passed: false, score: 70, message: '发现敏感文件，请检查.gitignore' };
        }
        
        return { passed: true, score: 100, message: '未发现敏感文件' };
    }

    checkDependencies() {
        console.log('   检查依赖版本...');
        
        try {
            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            const outdatedDeps = [];
            
            // 检查是否有过时的依赖
            try {
                const outdatedOutput = execSync('npm outdated --json', { encoding: 'utf8', stdio: 'pipe' });
                const outdated = JSON.parse(outdatedOutput);
                
                Object.keys(outdated).forEach(dep => {
                    if (outdated[dep].type === 'dependencies') {
                        outdatedDeps.push(dep);
                    }
                });
            } catch (error) {
                // npm outdated 在没有过时依赖时会返回非零退出码
            }
            
            if (outdatedDeps.length > 0) {
                this.results.warnings.push(`过时依赖: ${outdatedDeps.join(', ')}`);
                return { passed: true, score: 85, message: `发现${outdatedDeps.length}个过时依赖` };
            }
            
            return { passed: true, score: 100, message: '依赖版本正常' };
        } catch (error) {
            return { passed: true, score: 90, message: '无法检查依赖版本' };
        }
    }

    checkSecrets() {
        console.log('   检查硬编码密钥...');
        
        const secretPatterns = [
            /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/gi,
            /secret[_-]?key\s*[:=]\s*['"][^'"]+['"]/gi,
            /password\s*[:=]\s*['"][^'"]+['"]/gi,
            /token\s*[:=]\s*['"][^'"]+['"]/gi
        ];
        
        const foundSecrets = [];
        
        try {
            const files = execSync('find . -name "*.js" -o -name "*.ts" -o -name "*.tsx" | grep -v node_modules', { 
                encoding: 'utf8' 
            }).trim().split('\n');
            
            files.forEach(file => {
                if (fs.existsSync(file)) {
                    const content = fs.readFileSync(file, 'utf8');
                    
                    secretPatterns.forEach(pattern => {
                        const matches = content.match(pattern);
                        if (matches) {
                            foundSecrets.push({ file, matches });
                        }
                    });
                }
            });
        } catch (error) {
            // 忽略查找错误
        }
        
        if (foundSecrets.length > 0) {
            this.results.issues.push('发现可能的硬编码密钥');
            return { passed: false, score: 40, message: '发现可能的硬编码密钥' };
        }
        
        return { passed: true, score: 100, message: '未发现硬编码密钥' };
    }

    async checkDocumentation() {
        console.log('📚 检查文档完整性...');
        
        const checks = {
            readme: this.checkReadme(),
            changelog: this.checkChangelog(),
            apiDocs: this.checkApiDocs(),
            comments: this.checkCodeComments()
        };
        
        this.results.documentation = checks;
        
        console.log('✅ 文档检查完成');
        Object.entries(checks).forEach(([key, result]) => {
            console.log(`   - ${key}: ${result.passed ? '✅' : '❌'} ${result.score}/100`);
        });
        console.log();
    }

    checkReadme() {
        console.log('   检查README文件...');
        
        if (!fs.existsSync('README.md')) {
            this.results.issues.push('缺少README.md文件');
            return { passed: false, score: 0, message: '缺少README.md文件' };
        }
        
        const readme = fs.readFileSync('README.md', 'utf8');
        const requiredSections = [
            '# ',  // 标题
            '## Installation',  // 安装说明
            '## Usage',  // 使用说明
        ];
        
        const missingSections = requiredSections.filter(section => 
            !readme.includes(section)
        );
        
        if (missingSections.length > 0) {
            this.results.warnings.push(`README缺少章节: ${missingSections.join(', ')}`);
            return { passed: true, score: 70, message: 'README需要完善' };
        }
        
        return { passed: true, score: 100, message: 'README文档完整' };
    }

    checkChangelog() {
        console.log('   检查CHANGELOG文件...');
        
        const changelogFiles = ['CHANGELOG.md', 'HISTORY.md', 'CHANGES.md'];
        const hasChangelog = changelogFiles.some(file => fs.existsSync(file));
        
        if (!hasChangelog) {
            this.results.warnings.push('建议添加CHANGELOG文件');
            return { passed: true, score: 80, message: '建议添加CHANGELOG文件' };
        }
        
        return { passed: true, score: 100, message: 'CHANGELOG文件存在' };
    }

    checkApiDocs() {
        console.log('   检查API文档...');
        
        // 检查是否有API文档
        const apiDocPaths = [
            'docs/api',
            'api-docs',
            'swagger.json',
            'openapi.json'
        ];
        
        const hasApiDocs = apiDocPaths.some(path => fs.existsSync(path));
        
        if (!hasApiDocs) {
            return { passed: true, score: 90, message: '未检测到API文档（可选）' };
        }
        
        return { passed: true, score: 100, message: 'API文档存在' };
    }

    checkCodeComments() {
        console.log('   检查代码注释...');
        
        try {
            const tsFiles = execSync('find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | head -10', { 
                encoding: 'utf8' 
            }).trim().split('\n');
            
            let totalLines = 0;
            let commentLines = 0;
            
            tsFiles.forEach(file => {
                if (fs.existsSync(file)) {
                    const content = fs.readFileSync(file, 'utf8');
                    const lines = content.split('\n');
                    totalLines += lines.length;
                    
                    lines.forEach(line => {
                        const trimmed = line.trim();
                        if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
                            commentLines++;
                        }
                    });
                }
            });
            
            const commentRatio = totalLines > 0 ? (commentLines / totalLines) * 100 : 0;
            
            if (commentRatio < 5) {
                this.results.warnings.push('代码注释较少');
                return { passed: true, score: 70, message: '建议增加代码注释' };
            }
            
            return { passed: true, score: 95, message: `注释覆盖率: ${commentRatio.toFixed(1)}%` };
        } catch (error) {
            return { passed: true, score: 85, message: '无法检查注释覆盖率' };
        }
    }

    async checkPerformance() {
        console.log('⚡ 检查性能...');
        
        const checks = {
            bundleSize: this.checkBundleSize(),
            dependencies: this.checkDependencySize(),
            optimization: this.checkOptimization()
        };
        
        this.results.performance = checks;
        
        console.log('✅ 性能检查完成');
        Object.entries(checks).forEach(([key, result]) => {
            console.log(`   - ${key}: ${result.passed ? '✅' : '❌'} ${result.score}/100`);
        });
        console.log();
    }

    checkBundleSize() {
        console.log('   检查包大小...');
        
        try {
            // 检查.next/static目录大小
            if (fs.existsSync('.next/static')) {
                const sizeOutput = execSync('du -sh .next/static', { encoding: 'utf8' });
                const size = sizeOutput.split('\t')[0];
                
                return { passed: true, score: 90, message: `构建大小: ${size}` };
            }
            
            return { passed: true, score: 85, message: '未找到构建文件' };
        } catch (error) {
            return { passed: true, score: 80, message: '无法检查包大小' };
        }
    }

    checkDependencySize() {
        console.log('   检查依赖大小...');
        
        try {
            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            const depCount = Object.keys(packageJson.dependencies || {}).length;
            const devDepCount = Object.keys(packageJson.devDependencies || {}).length;
            
            if (depCount > 50) {
                this.results.warnings.push('依赖数量较多');
                return { passed: true, score: 75, message: `依赖: ${depCount}, 开发依赖: ${devDepCount}` };
            }
            
            return { passed: true, score: 95, message: `依赖: ${depCount}, 开发依赖: ${devDepCount}` };
        } catch (error) {
            return { passed: true, score: 80, message: '无法检查依赖大小' };
        }
    }

    checkOptimization() {
        console.log('   检查优化配置...');
        
        const optimizations = [];
        
        // 检查Next.js配置
        if (fs.existsSync('next.config.js')) {
            const config = fs.readFileSync('next.config.js', 'utf8');
            
            if (config.includes('compress')) optimizations.push('gzip压缩');
            if (config.includes('images')) optimizations.push('图片优化');
            if (config.includes('webpack')) optimizations.push('webpack优化');
        }
        
        const score = Math.min(100, 70 + (optimizations.length * 10));
        
        return { 
            passed: true, 
            score, 
            message: `优化配置: ${optimizations.join(', ') || '基础配置'}` 
        };
    }

    async checkCompatibility() {
        console.log('🔄 检查兼容性...');
        
        const checks = {
            nodeVersion: this.checkNodeVersion(),
            browserSupport: this.checkBrowserSupport(),
            typescript: this.checkTypeScriptVersion()
        };
        
        this.results.compatibility = checks;
        
        console.log('✅ 兼容性检查完成');
        Object.entries(checks).forEach(([key, result]) => {
            console.log(`   - ${key}: ${result.passed ? '✅' : '❌'} ${result.score}/100`);
        });
        console.log();
    }

    checkNodeVersion() {
        console.log('   检查Node.js版本...');
        
        const nodeVersion = process.version;
        const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
        
        if (majorVersion < 16) {
            this.results.issues.push('Node.js版本过低');
            return { passed: false, score: 40, message: `Node.js ${nodeVersion} (建议16+)` };
        }
        
        if (majorVersion < 18) {
            this.results.warnings.push('建议升级Node.js版本');
            return { passed: true, score: 80, message: `Node.js ${nodeVersion} (建议18+)` };
        }
        
        return { passed: true, score: 100, message: `Node.js ${nodeVersion}` };
    }

    checkBrowserSupport() {
        console.log('   检查浏览器支持...');
        
        // 检查browserslist配置
        const hasBrowserslist = fs.existsSync('.browserslistrc') || 
                               (fs.existsSync('package.json') && 
                                JSON.parse(fs.readFileSync('package.json', 'utf8')).browserslist);
        
        if (!hasBrowserslist) {
            this.results.warnings.push('建议配置browserslist');
            return { passed: true, score: 85, message: '建议配置browserslist' };
        }
        
        return { passed: true, score: 100, message: 'browserslist已配置' };
    }

    checkTypeScriptVersion() {
        console.log('   检查TypeScript版本...');
        
        try {
            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            const tsVersion = packageJson.devDependencies?.typescript || packageJson.dependencies?.typescript;
            
            if (!tsVersion) {
                return { passed: true, score: 90, message: '未使用TypeScript' };
            }
            
            return { passed: true, score: 100, message: `TypeScript ${tsVersion}` };
        } catch (error) {
            return { passed: true, score: 85, message: '无法检查TypeScript版本' };
        }
    }

    async checkFileStructure() {
        console.log('📁 检查文件结构...');
        
        const checks = {
            criticalFiles: this.checkCriticalFiles(),
            gitignore: this.checkGitignore(),
            packageJson: this.checkPackageJson()
        };
        
        console.log('✅ 文件结构检查完成');
        Object.entries(checks).forEach(([key, result]) => {
            console.log(`   - ${key}: ${result.passed ? '✅' : '❌'} ${result.score}/100`);
        });
        console.log();
    }

    checkCriticalFiles() {
        console.log('   检查关键文件...');
        
        const missingFiles = this.criticalFiles.filter(file => !fs.existsSync(file));
        
        if (missingFiles.length > 0) {
            this.results.issues.push(`缺少关键文件: ${missingFiles.join(', ')}`);
            return { passed: false, score: 60, message: `缺少: ${missingFiles.join(', ')}` };
        }
        
        return { passed: true, score: 100, message: '所有关键文件存在' };
    }

    checkGitignore() {
        console.log('   检查.gitignore...');
        
        if (!fs.existsSync('.gitignore')) {
            this.results.issues.push('缺少.gitignore文件');
            return { passed: false, score: 0, message: '缺少.gitignore文件' };
        }
        
        const gitignore = fs.readFileSync('.gitignore', 'utf8');
        const requiredPatterns = [
            'node_modules',
            '.next',
            '.env',
            'dist'
        ];
        
        const missingPatterns = requiredPatterns.filter(pattern => 
            !gitignore.includes(pattern)
        );
        
        if (missingPatterns.length > 0) {
            this.results.warnings.push(`gitignore缺少: ${missingPatterns.join(', ')}`);
            return { passed: true, score: 80, message: '需要完善.gitignore' };
        }
        
        return { passed: true, score: 100, message: '.gitignore配置完整' };
    }

    checkPackageJson() {
        console.log('   检查package.json...');
        
        try {
            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            
            const requiredFields = ['name', 'version', 'description', 'scripts'];
            const missingFields = requiredFields.filter(field => !packageJson[field]);
            
            if (missingFields.length > 0) {
                this.results.warnings.push(`package.json缺少: ${missingFields.join(', ')}`);
                return { passed: true, score: 80, message: '需要完善package.json' };
            }
            
            return { passed: true, score: 100, message: 'package.json配置完整' };
        } catch (error) {
            this.results.issues.push('package.json格式错误');
            return { passed: false, score: 0, message: 'package.json格式错误' };
        }
    }

    async checkGitStatus() {
        console.log('🔄 检查Git状态...');
        
        try {
            // 检查是否有未提交的更改
            const status = execSync('git status --porcelain', { encoding: 'utf8' });
            
            if (status.trim()) {
                this.results.warnings.push('存在未提交的更改');
                console.log('⚠️  存在未提交的更改');
                console.log(status);
            } else {
                console.log('✅ Git状态干净');
            }
            
            // 检查当前分支
            const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
            console.log(`📍 当前分支: ${branch}`);
            
        } catch (error) {
            console.log('ℹ️  未初始化Git仓库或Git不可用');
        }
        
        console.log();
    }

    findTestFiles() {
        try {
            const testFiles = execSync('find . -name "*.test.*" -o -name "*.spec.*" | grep -v node_modules', { 
                encoding: 'utf8' 
            }).trim().split('\n').filter(f => f);
            
            return testFiles;
        } catch (error) {
            return [];
        }
    }

    generateFinalReport() {
        console.log('📊 生成最终检查报告...\n');
        
        // 计算总体评分
        const categoryScores = [
            this.calculateCategoryScore(this.results.codeQuality),
            this.calculateCategoryScore(this.results.security),
            this.calculateCategoryScore(this.results.documentation),
            this.calculateCategoryScore(this.results.performance),
            this.calculateCategoryScore(this.results.compatibility)
        ];
        
        this.results.overallScore = Math.round(
            categoryScores.reduce((a, b) => a + b, 0) / categoryScores.length
        );
        
        // 显示报告
        console.log('🎯 GitHub上传前检查报告');
        console.log('=' .repeat(50));
        console.log(`📝 代码质量: ${categoryScores[0]}/100`);
        console.log(`🔒 安全性: ${categoryScores[1]}/100`);
        console.log(`📚 文档完整性: ${categoryScores[2]}/100`);
        console.log(`⚡ 性能: ${categoryScores[3]}/100`);
        console.log(`🔄 兼容性: ${categoryScores[4]}/100`);
        console.log('-'.repeat(50));
        console.log(`🏆 总体评分: ${this.results.overallScore}/100`);
        
        // 评级
        const grade = this.getGrade(this.results.overallScore);
        console.log(`📊 评级: ${grade.letter} (${grade.description})`);
        
        // 显示问题和警告
        if (this.results.issues.length > 0) {
            console.log('\n❌ 需要修复的问题:');
            this.results.issues.forEach(issue => console.log(`   - ${issue}`));
        }
        
        if (this.results.warnings.length > 0) {
            console.log('\n⚠️  建议改进的地方:');
            this.results.warnings.forEach(warning => console.log(`   - ${warning}`));
        }
        
        // 上传建议
        console.log('\n📤 上传建议:');
        if (this.results.overallScore >= 90) {
            console.log('✅ 项目质量优秀，可以安全上传到GitHub！');
        } else if (this.results.overallScore >= 80) {
            console.log('⚠️  项目质量良好，建议修复上述问题后上传。');
        } else {
            console.log('❌ 项目存在较多问题，强烈建议修复后再上传。');
        }
        
        // 保存详细报告
        this.saveDetailedReport();
    }

    calculateCategoryScore(category) {
        if (!category || Object.keys(category).length === 0) return 0;
        
        const scores = Object.values(category).map(check => check.score || 0);
        return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    }

    getGrade(score) {
        if (score >= 95) return { letter: 'A+', description: '优秀' };
        if (score >= 90) return { letter: 'A', description: '良好' };
        if (score >= 85) return { letter: 'B+', description: '中上' };
        if (score >= 80) return { letter: 'B', description: '中等' };
        if (score >= 70) return { letter: 'C+', description: '及格' };
        return { letter: 'C', description: '需要改进' };
    }

    saveDetailedReport() {
        const reportPath = 'pre-github-upload-report.json';
        
        const detailedReport = {
            timestamp: new Date().toISOString(),
            checkSuite: 'Pre-GitHub Upload Check',
            version: '1.0.0',
            results: this.results,
            summary: {
                overallScore: this.results.overallScore,
                grade: this.getGrade(this.results.overallScore),
                issuesCount: this.results.issues.length,
                warningsCount: this.results.warnings.length,
                readyForUpload: this.results.overallScore >= 85
            }
        };
        
        try {
            fs.writeFileSync(reportPath, JSON.stringify(detailedReport, null, 2));
            console.log(`\n📄 详细报告已保存至: ${reportPath}`);
        } catch (error) {
            console.error('❌ 保存报告失败:', error.message);
        }
    }
}

// 运行检查
async function main() {
    const checker = new PreGitHubUploadChecker();
    
    console.log('🚀 启动GitHub上传前最终检查');
    console.log('目标: 确保项目质量达到上传标准\n');
    
    const ready = await checker.runCompleteCheck();
    
    if (ready) {
        console.log('\n🎉 检查完成！项目已准备好上传到GitHub。');
        process.exit(0);
    } else {
        console.log('\n⚠️  请修复上述问题后重新检查。');
        process.exit(1);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    main().catch(console.error);
}

module.exports = PreGitHubUploadChecker;