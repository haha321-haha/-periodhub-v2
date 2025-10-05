#!/usr/bin/env node
// =============================================================================
// 硬编码修复执行前准备清单
// 确保修复过程严格按照方案执行，避免功能破坏，保证修复成功
// =============================================================================

const fs = require('fs').promises;
const { execSync } = require('child_process');
const path = require('path');

class PreExecutionChecklist {
  constructor() {
    this.results = {
      environment: {},
      project: {},
      git: {},
      tools: {},
      dependencies: {},
      tests: {},
      overall: false
    };
    this.errors = [];
    this.warnings = [];
  }

  async run() {
    console.log('📋 硬编码修复执行前准备清单');
    console.log('=====================================');
    console.log('');

    try {
      await this.checkEnvironment();
      await this.checkProject();
      await this.checkGit();
      await this.checkTools();
      await this.checkDependencies();
      await this.checkTests();
      await this.createBackup();
      await this.generateReport();

      console.log('');
      console.log('🎯 准备清单完成！');
      console.log(`✅ 通过: ${Object.values(this.results).filter(r => r === true).length}`);
      console.log(`❌ 失败: ${this.errors.length}`);
      console.log(`⚠️  警告: ${this.warnings.length}`);

      if (this.errors.length > 0) {
        console.log('');
        console.log('❌ 发现关键问题，请先解决：');
        this.errors.forEach((error, index) => {
          console.log(`  ${index + 1}. ${error}`);
        });
        process.exit(1);
      }

      if (this.warnings.length > 0) {
        console.log('');
        console.log('⚠️  发现警告，建议处理：');
        this.warnings.forEach((warning, index) => {
          console.log(`  ${index + 1}. ${warning}`);
        });
      }

      console.log('');
      console.log('🚀 所有检查通过，可以开始硬编码修复！');
      this.results.overall = true;

    } catch (error) {
      console.error('❌ 检查过程中发生错误:', error.message);
      process.exit(1);
    }
  }

  async checkEnvironment() {
    console.log('🔍 1. 环境检查...');

    try {
      // Node.js版本检查
      const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
      const nodeMajor = parseInt(nodeVersion.slice(1).split('.')[0]);

      if (nodeMajor >= 16) {
        console.log(`  ✅ Node.js版本: ${nodeVersion} (符合要求 >= 16.0.0)`);
        this.results.environment.node = true;
      } else {
        this.errors.push(`Node.js版本过低: ${nodeVersion}，需要 >= 16.0.0`);
        this.results.environment.node = false;
      }

      // npm版本检查
      const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
      const npmMajor = parseInt(npmVersion.split('.')[0]);

      if (npmMajor >= 8) {
        console.log(`  ✅ npm版本: ${npmVersion} (符合要求 >= 8.0.0)`);
        this.results.environment.npm = true;
      } else {
        this.errors.push(`npm版本过低: ${npmVersion}，需要 >= 8.0.0`);
        this.results.environment.npm = false;
      }

      // 操作系统检查
      const platform = process.platform;
      console.log(`  ✅ 操作系统: ${platform}`);
      this.results.environment.platform = true;

    } catch (error) {
      this.errors.push(`环境检查失败: ${error.message}`);
      this.results.environment = false;
    }
  }

  async checkProject() {
    console.log('🔍 2. 项目结构检查...');

    try {
      // 检查关键文件
      const criticalFiles = [
        'package.json',
        'next.config.js',
        'tsconfig.json',
        'app',
        'components',
        'lib'
      ];

      for (const file of criticalFiles) {
        try {
          await fs.access(file);
          console.log(`  ✅ ${file} 存在`);
        } catch {
          this.errors.push(`关键文件/目录缺失: ${file}`);
        }
      }

      // 检查package.json内容
      const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));

      if (packageJson.scripts && packageJson.scripts.dev) {
        console.log('  ✅ package.json 脚本配置正常');
        this.results.project.packageJson = true;
      } else {
        this.errors.push('package.json 缺少必要的脚本配置');
        this.results.project.packageJson = false;
      }

      // 检查Next.js版本
      if (packageJson.dependencies && packageJson.dependencies.next) {
        console.log(`  ✅ Next.js版本: ${packageJson.dependencies.next}`);
        this.results.project.nextjs = true;
      } else {
        this.errors.push('未找到Next.js依赖');
        this.results.project.nextjs = false;
      }

    } catch (error) {
      this.errors.push(`项目检查失败: ${error.message}`);
      this.results.project = false;
    }
  }

  async checkGit() {
    console.log('🔍 3. Git状态检查...');

    try {
      // 检查是否在Git仓库中
      execSync('git rev-parse --git-dir', { stdio: 'ignore' });
      console.log('  ✅ 在Git仓库中');

      // 检查工作区状态
      const statusOutput = execSync('git status --porcelain', { encoding: 'utf8' });
      const modifiedFiles = statusOutput.trim().split('\n').filter(line => line.trim());

      if (modifiedFiles.length === 0) {
        console.log('  ✅ 工作区干净，无未提交的更改');
        this.results.git.clean = true;
      } else {
        console.log(`  ⚠️  工作区有 ${modifiedFiles.length} 个未提交的文件:`);
        modifiedFiles.slice(0, 5).forEach(file => {
          console.log(`    - ${file}`);
        });
        if (modifiedFiles.length > 5) {
          console.log(`    ... 还有 ${modifiedFiles.length - 5} 个文件`);
        }
        this.warnings.push('工作区有未提交的更改，建议先提交或暂存');
        this.results.git.clean = false;
      }

      // 检查当前分支
      const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
      console.log(`  ✅ 当前分支: ${currentBranch}`);
      this.results.git.branch = currentBranch;

      // 检查远程仓库
      try {
        execSync('git remote -v', { stdio: 'ignore' });
        console.log('  ✅ 远程仓库配置正常');
        this.results.git.remote = true;
      } catch {
        this.warnings.push('未配置远程仓库');
        this.results.git.remote = false;
      }

    } catch (error) {
      this.errors.push(`Git检查失败: ${error.message}`);
      this.results.git = false;
    }
  }

  async checkTools() {
    console.log('🔍 4. 修复工具检查...');

    try {
      // 检查关键脚本文件
      const toolFiles = [
        'scripts/optimized-quick-fix.js',
        'scripts/syntax-fix-strategy.js',
        'scripts/detect-hardcoded-urls.js'
      ];

      for (const tool of toolFiles) {
        try {
          await fs.access(tool);
          console.log(`  ✅ ${tool} 存在`);
        } catch {
          this.warnings.push(`修复工具缺失: ${tool}`);
        }
      }

      // 检查工具执行权限
      try {
        execSync('ls -la scripts/optimized-quick-fix.js', { encoding: 'utf8' });
        console.log('  ✅ 修复工具权限正常');
        this.results.tools.permissions = true;
      } catch {
        this.warnings.push('修复工具权限可能有问题');
        this.results.tools.permissions = false;
      }

      this.results.tools.available = true;

    } catch (error) {
      this.warnings.push(`工具检查失败: ${error.message}`);
      this.results.tools = false;
    }
  }

  async checkDependencies() {
    console.log('🔍 5. 依赖检查...');

    try {
      // 检查node_modules
      try {
        await fs.access('node_modules');
        console.log('  ✅ node_modules 存在');
        this.results.dependencies.nodeModules = true;
      } catch {
        this.errors.push('node_modules 不存在，请运行 npm install');
        this.results.dependencies.nodeModules = false;
        return;
      }

      // 检查关键依赖
      const criticalDeps = ['next', 'react', 'typescript'];
      const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
      const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };

      for (const dep of criticalDeps) {
        if (allDeps[dep]) {
          console.log(`  ✅ ${dep}: ${allDeps[dep]}`);
        } else {
          this.warnings.push(`关键依赖缺失: ${dep}`);
        }
      }

      this.results.dependencies.installed = true;

    } catch (error) {
      this.errors.push(`依赖检查失败: ${error.message}`);
      this.results.dependencies = false;
    }
  }

  async checkTests() {
    console.log('🔍 6. 测试环境检查...');

    try {
      // 检查开发服务器是否能启动
      console.log('  🔄 测试开发服务器启动...');

      try {
        // 启动开发服务器（后台）
        const devProcess = execSync('npm run dev &', {
          stdio: 'pipe',
          timeout: 10000
        });

        // 等待服务器启动
        await new Promise(resolve => setTimeout(resolve, 5000));

        // 测试页面访问
        try {
          const response = execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/zh', {
            encoding: 'utf8',
            timeout: 5000
          });

          if (response.trim() === '200') {
            console.log('  ✅ 开发服务器正常启动，页面可访问');
            this.results.tests.devServer = true;
          } else {
            this.warnings.push(`开发服务器响应异常: HTTP ${response.trim()}`);
            this.results.tests.devServer = false;
          }
        } catch {
          this.warnings.push('无法访问开发服务器');
          this.results.tests.devServer = false;
        }

        // 停止开发服务器
        try {
          execSync('pkill -f "next dev"', { stdio: 'ignore' });
        } catch {}

      } catch (error) {
        this.warnings.push(`开发服务器测试失败: ${error.message}`);
        this.results.tests.devServer = false;
      }

      // 检查构建
      console.log('  🔄 测试生产构建...');
      try {
        execSync('npm run build', {
          stdio: 'pipe',
          timeout: 60000
        });
        console.log('  ✅ 生产构建成功');
        this.results.tests.build = true;
      } catch (error) {
        this.errors.push(`生产构建失败: ${error.message}`);
        this.results.tests.build = false;
      }

    } catch (error) {
      this.warnings.push(`测试检查失败: ${error.message}`);
      this.results.tests = false;
    }
  }

  async createBackup() {
    console.log('🔍 7. 创建修复前备份...');

    try {
      // 创建Git标签备份
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupTag = `backup-before-hardcode-fix-${timestamp}`;

      execSync(`git tag ${backupTag}`, { stdio: 'pipe' });
      console.log(`  ✅ 创建Git标签备份: ${backupTag}`);

      // 创建修复前快照
      const snapshot = {
        timestamp: new Date().toISOString(),
        gitCommit: execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(),
        gitTag: backupTag,
        modifiedFiles: execSync('git status --porcelain', { encoding: 'utf8' }).trim().split('\n').filter(line => line.trim()),
        environment: {
          node: process.version,
          platform: process.platform,
          arch: process.arch
        }
      };

      await fs.writeFile(
        `backup-snapshot-${timestamp}.json`,
        JSON.stringify(snapshot, null, 2)
      );

      console.log(`  ✅ 创建快照文件: backup-snapshot-${timestamp}.json`);
      this.results.backup = true;

    } catch (error) {
      this.errors.push(`备份创建失败: ${error.message}`);
      this.results.backup = false;
    }
  }

  async generateReport() {
    console.log('🔍 8. 生成检查报告...');

    const report = {
      timestamp: new Date().toISOString(),
      results: this.results,
      errors: this.errors,
      warnings: this.warnings,
      summary: {
        totalChecks: Object.keys(this.results).length,
        passed: Object.values(this.results).filter(r => r === true).length,
        failed: this.errors.length,
        warnings: this.warnings.length,
        ready: this.errors.length === 0
      }
    };

    await fs.writeFile(
      'pre-execution-checklist-report.json',
      JSON.stringify(report, null, 2)
    );

    console.log('  ✅ 检查报告已保存: pre-execution-checklist-report.json');
  }
}

// 执行检查清单
if (require.main === module) {
  const checklist = new PreExecutionChecklist();
  checklist.run().catch(console.error);
}

module.exports = PreExecutionChecklist;
