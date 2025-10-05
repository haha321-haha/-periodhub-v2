#!/bin/bash
# =============================================================================
# 硬编码修复执行前快速检查清单
# 确保修复过程严格按照方案执行，避免功能破坏，保证修复成功
# =============================================================================

echo "📋 硬编码修复执行前准备清单"
echo "====================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 错误计数器
ERRORS=0
WARNINGS=0

# 检查函数
check_item() {
    local description="$1"
    local command="$2"
    local error_msg="$3"

    echo -n "🔍 $description... "

    if eval "$command" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ 通过${NC}"
        return 0
    else
        echo -e "${RED}❌ 失败${NC}"
        echo "   $error_msg"
        ((ERRORS++))
        return 1
    fi
}

warn_item() {
    local description="$1"
    local command="$2"
    local warning_msg="$3"

    echo -n "🔍 $description... "

    if eval "$command" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ 通过${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  警告${NC}"
        echo "   $warning_msg"
        ((WARNINGS++))
        return 1
    fi
}

echo "1. 环境检查"
echo "----------"

# Node.js版本检查
NODE_VERSION=$(node --version 2>/dev/null | sed 's/v//')
if [ -n "$NODE_VERSION" ]; then
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1)
    if [ "$NODE_MAJOR" -ge 16 ]; then
        echo -e "🔍 Node.js版本... ${GREEN}✅ $NODE_VERSION (符合要求 >= 16.0.0)${NC}"
    else
        echo -e "🔍 Node.js版本... ${RED}❌ $NODE_VERSION (需要 >= 16.0.0)${NC}"
        ((ERRORS++))
    fi
else
    echo -e "🔍 Node.js版本... ${RED}❌ 未安装${NC}"
    ((ERRORS++))
fi

# npm版本检查
NPM_VERSION=$(npm --version 2>/dev/null)
if [ -n "$NPM_VERSION" ]; then
    NPM_MAJOR=$(echo $NPM_VERSION | cut -d. -f1)
    if [ "$NPM_MAJOR" -ge 8 ]; then
        echo -e "🔍 npm版本... ${GREEN}✅ $NPM_VERSION (符合要求 >= 8.0.0)${NC}"
    else
        echo -e "🔍 npm版本... ${RED}❌ $NPM_VERSION (需要 >= 8.0.0)${NC}"
        ((ERRORS++))
    fi
else
    echo -e "🔍 npm版本... ${RED}❌ 未安装${NC}"
    ((ERRORS++))
fi

echo ""
echo "2. 项目结构检查"
echo "--------------"

# 检查关键文件
check_item "package.json存在" "[ -f package.json ]" "package.json文件缺失"
check_item "next.config.js存在" "[ -f next.config.js ]" "next.config.js文件缺失"
check_item "tsconfig.json存在" "[ -f tsconfig.json ]" "tsconfig.json文件缺失"
check_item "app目录存在" "[ -d app ]" "app目录缺失"
check_item "components目录存在" "[ -d components ]" "components目录缺失"

echo ""
echo "3. Git状态检查"
echo "-------------"

# 检查Git仓库
if [ -d .git ]; then
    echo -e "🔍 Git仓库... ${GREEN}✅ 存在${NC}"

    # 检查工作区状态
    UNCOMMITTED=$(git status --porcelain | wc -l)
    if [ "$UNCOMMITTED" -eq 0 ]; then
        echo -e "🔍 工作区状态... ${GREEN}✅ 干净${NC}"
    else
        echo -e "🔍 工作区状态... ${YELLOW}⚠️  有 $UNCOMMITTED 个未提交文件${NC}"
        echo "   建议先提交或暂存更改"
        ((WARNINGS++))
    fi

    # 检查当前分支
    CURRENT_BRANCH=$(git branch --show-current)
    echo -e "🔍 当前分支... ${GREEN}✅ $CURRENT_BRANCH${NC}"

else
    echo -e "🔍 Git仓库... ${RED}❌ 不存在${NC}"
    ((ERRORS++))
fi

echo ""
echo "4. 依赖检查"
echo "----------"

# 检查node_modules
if [ -d node_modules ]; then
    echo -e "🔍 node_modules... ${GREEN}✅ 存在${NC}"
else
    echo -e "🔍 node_modules... ${RED}❌ 不存在，请运行 npm install${NC}"
    ((ERRORS++))
fi

# 检查关键依赖
if [ -f package.json ]; then
    if grep -q '"next"' package.json; then
        echo -e "🔍 Next.js依赖... ${GREEN}✅ 存在${NC}"
    else
        echo -e "🔍 Next.js依赖... ${RED}❌ 缺失${NC}"
        ((ERRORS++))
    fi
fi

echo ""
echo "5. 修复工具检查"
echo "--------------"

# 检查修复工具
warn_item "optimized-quick-fix.js" "[ -f scripts/optimized-quick-fix.js ]" "修复工具缺失"
warn_item "syntax-fix-strategy.js" "[ -f scripts/syntax-fix-strategy.js ]" "语法修复工具缺失"
warn_item "detect-hardcoded-urls.js" "[ -f scripts/detect-hardcoded-urls.js ]" "检测工具缺失"

echo ""
echo "6. 测试环境检查"
echo "--------------"

# 检查开发服务器端口
if lsof -ti:3001 >/dev/null 2>&1; then
    echo -e "🔍 端口3001... ${YELLOW}⚠️  被占用${NC}"
    echo "   将尝试使用端口3002"
    ((WARNINGS++))
else
    echo -e "🔍 端口3001... ${GREEN}✅ 可用${NC}"
fi

# 检查构建产物
echo -n "🔍 生产构建检查... "
if [ -d .next ] && [ -f .next/BUILD_ID ]; then
    echo -e "${GREEN}✅ 构建产物存在${NC}"
else
    echo -e "${YELLOW}⚠️  构建产物不存在${NC}"
    echo "   建议运行 npm run build"
    ((WARNINGS++))
fi

echo ""
echo "7. 创建备份"
echo "----------"

# 创建Git标签备份
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_TAG="backup-before-hardcode-fix-$TIMESTAMP"

if git tag "$BACKUP_TAG" >/dev/null 2>&1; then
    echo -e "🔍 Git标签备份... ${GREEN}✅ $BACKUP_TAG${NC}"
else
    echo -e "🔍 Git标签备份... ${YELLOW}⚠️  创建失败${NC}"
    ((WARNINGS++))
fi

echo ""
echo "📊 检查结果汇总"
echo "==============="

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ 所有关键检查通过！${NC}"
    echo -e "${GREEN}🚀 可以开始硬编码修复！${NC}"

    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠️  有 $WARNINGS 个警告，建议处理${NC}"
    fi

    exit 0
else
    echo -e "${RED}❌ 发现 $ERRORS 个关键问题${NC}"
    echo -e "${RED}🛑 请先解决这些问题再开始修复${NC}"

    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠️  还有 $WARNINGS 个警告${NC}"
    fi

    exit 1
fi
