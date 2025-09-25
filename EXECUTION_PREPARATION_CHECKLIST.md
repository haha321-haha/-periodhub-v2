# 🛡️ 硬编码修复执行前准备清单

## 📋 概述

本清单确保硬编码修复过程严格按照方案执行，避免功能破坏，保证修复成功。**执行修复前必须完成所有检查项目！**

## 🎯 检查目标

- ✅ 环境准备就绪
- ✅ 项目结构完整
- ✅ Git状态安全
- ✅ 依赖安装正确
- ✅ 修复工具可用
- ✅ 测试环境正常
- ✅ 备份机制就位

---

## 🔍 详细检查项目

### 1. 环境检查

#### 1.1 Node.js环境
```bash
# 检查Node.js版本
node --version
# 要求: >= 16.0.0
```

#### 1.2 npm环境
```bash
# 检查npm版本
npm --version
# 要求: >= 8.0.0
```

#### 1.3 操作系统
```bash
# 检查操作系统
uname -a
# 支持: macOS, Linux, Windows
```

### 2. 项目结构检查

#### 2.1 关键文件存在性
```bash
# 检查必要文件
ls -la package.json
ls -la next.config.js
ls -la tsconfig.json
ls -la middleware.ts
```

#### 2.2 关键目录存在性
```bash
# 检查必要目录
ls -la app/
ls -la components/
ls -la lib/
ls -la scripts/
```

#### 2.3 package.json配置
```bash
# 检查脚本配置
grep -A 10 '"scripts"' package.json
# 必须包含: dev, build, start
```

### 3. Git状态检查

#### 3.1 Git仓库状态
```bash
# 检查是否在Git仓库中
git rev-parse --git-dir
```

#### 3.2 工作区状态
```bash
# 检查未提交文件
git status --porcelain
# 理想状态: 无输出（工作区干净）
```

#### 3.3 当前分支
```bash
# 检查当前分支
git branch --show-current
# 建议: main 或 master
```

#### 3.4 远程仓库
```bash
# 检查远程仓库配置
git remote -v
# 确保有origin远程仓库
```

### 4. 依赖检查

#### 4.1 node_modules存在性
```bash
# 检查依赖目录
ls -la node_modules/
```

#### 4.2 关键依赖安装
```bash
# 检查关键依赖
npm list next react typescript
```

#### 4.3 依赖完整性
```bash
# 检查依赖完整性
npm audit
# 无严重安全漏洞
```

### 5. 修复工具检查

#### 5.1 修复脚本存在性
```bash
# 检查修复工具
ls -la scripts/optimized-quick-fix.js
ls -la scripts/syntax-fix-strategy.js
ls -la scripts/detect-hardcoded-urls.js
```

#### 5.2 工具执行权限
```bash
# 检查执行权限
ls -la scripts/*.js | grep -E "(hardcode|fix)"
```

#### 5.3 工具功能测试
```bash
# 测试检测工具
node scripts/detect-hardcoded-urls.js --help
```

### 6. 测试环境检查

#### 6.1 端口可用性
```bash
# 检查开发服务器端口
lsof -ti:3001
# 理想状态: 无输出（端口可用）
```

#### 6.2 开发服务器启动
```bash
# 测试开发服务器
timeout 10 npm run dev &
sleep 5
curl -s http://localhost:3001/zh | head -1
pkill -f "next dev"
```

#### 6.3 生产构建测试
```bash
# 测试生产构建
npm run build
# 必须成功完成
```

### 7. 备份机制检查

#### 7.1 Git标签备份
```bash
# 创建修复前备份标签
git tag "backup-before-hardcode-fix-$(date +%Y%m%d-%H%M%S)"
```

#### 7.2 快照文件备份
```bash
# 创建项目快照
cat > backup-snapshot-$(date +%Y%m%d-%H%M%S).json << EOF
{
  "timestamp": "$(date -Iseconds)",
  "gitCommit": "$(git rev-parse HEAD)",
  "gitBranch": "$(git branch --show-current)",
  "nodeVersion": "$(node --version)",
  "npmVersion": "$(npm --version)",
  "platform": "$(uname -s)",
  "modifiedFiles": $(git status --porcelain | wc -l)
}
EOF
```

---

## 🚀 快速执行检查

### 方法1: 使用快速检查脚本
```bash
# 运行快速检查
./scripts/quick-precheck.sh
```

### 方法2: 使用详细检查脚本
```bash
# 运行详细检查
node scripts/pre-execution-checklist.js
```

### 方法3: 手动检查
按照上述详细检查项目逐一执行。

---

## ⚠️ 常见问题及解决方案

### 问题1: Node.js版本过低
```bash
# 解决方案: 升级Node.js
# 使用nvm管理Node.js版本
nvm install 18
nvm use 18
```

### 问题2: 工作区有未提交文件
```bash
# 解决方案: 提交或暂存文件
git add .
git commit -m "修复前提交"
# 或者
git stash
```

### 问题3: 端口被占用
```bash
# 解决方案: 释放端口
lsof -ti:3001 | xargs kill -9
# 或者使用其他端口
export PORT=3002
```

### 问题4: 依赖安装失败
```bash
# 解决方案: 重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

### 问题5: 构建失败
```bash
# 解决方案: 检查代码错误
npm run build 2>&1 | grep -i error
# 修复错误后重新构建
```

---

## 📊 检查结果标准

### ✅ 通过标准
- 所有关键检查项目通过
- 错误数量 = 0
- 警告数量 ≤ 3

### ❌ 失败标准
- 任何关键检查项目失败
- 错误数量 > 0
- 环境不满足最低要求

### ⚠️ 警告标准
- 非关键检查项目失败
- 建议优化但不阻塞执行
- 警告数量 > 3 时建议处理

---

## 🎯 执行前最后确认

在开始硬编码修复前，请确认：

1. **环境就绪** ✅
   - [ ] Node.js >= 16.0.0
   - [ ] npm >= 8.0.0
   - [ ] 操作系统支持

2. **项目完整** ✅
   - [ ] 关键文件存在
   - [ ] 目录结构完整
   - [ ] 配置正确

3. **Git安全** ✅
   - [ ] 在Git仓库中
   - [ ] 工作区干净
   - [ ] 有远程仓库

4. **依赖正确** ✅
   - [ ] node_modules存在
   - [ ] 关键依赖安装
   - [ ] 无严重漏洞

5. **工具可用** ✅
   - [ ] 修复脚本存在
   - [ ] 执行权限正确
   - [ ] 功能正常

6. **测试通过** ✅
   - [ ] 端口可用
   - [ ] 开发服务器正常
   - [ ] 生产构建成功

7. **备份就位** ✅
   - [ ] Git标签备份
   - [ ] 快照文件备份
   - [ ] 回滚方案准备

---

## 🚨 紧急停止机制

如果修复过程中出现问题，立即执行：

```bash
# 1. 停止所有相关进程
pkill -f "next dev"
pkill -f "hardcode"

# 2. 回滚到修复前状态
git reset --hard backup-before-hardcode-fix-*

# 3. 恢复依赖
npm install

# 4. 重启开发服务器
npm run dev
```

---

## 📞 技术支持

如果遇到无法解决的问题，请：

1. 查看错误日志
2. 检查Git状态
3. 回滚到安全状态
4. 联系技术支持

**记住：安全第一，修复第二！** 🛡️









