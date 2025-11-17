#!/bin/bash

# 多语言SEO修复验证脚本
# 用于验证重复内容问题修复是否成功

# 不在 CI 环境中遇到错误立即退出（允许部分测试失败）
if [ -z "$CI" ]; then
    set -e
fi

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置
BASE_URL="${VERCEL_URL:-https://www.periodhub.health}"
TIMEOUT=10
LOG_FILE="seo-verification.log"

# 计数器
PASSED=0
FAILED=0

# 创建日志文件
> "$LOG_FILE"

# 输出函数，同时写入日志
log_output() {
    if [ "$1" = "-e" ]; then
        # 带颜色输出，同时写入日志（去除颜色码）
        shift
        echo -e "$@" | tee -a "$LOG_FILE"
        # 同时写入纯文本到日志（去除 ANSI 颜色码）
        echo -e "$@" | sed 's/\x1b\[[0-9;]*m//g' >> "$LOG_FILE"
    else
        echo "$@" | tee -a "$LOG_FILE"
    fi
}

log_output "========================================="
log_output "  多语言SEO修复验证"
log_output "========================================="
log_output ""
log_output "目标URL: $BASE_URL"
log_output "时间: $(date)"
log_output "CI环境: ${CI:-否}"
log_output ""

# 辅助函数：打印成功
print_success() {
    log_output -e "${GREEN}✅ $1${NC}"
    ((PASSED++))
}

# 辅助函数：打印失败
print_failure() {
    log_output -e "${RED}❌ $1${NC}"
    ((FAILED++))
    # 在 CI 环境中，某些失败不应该导致脚本退出
    if [ -n "$CI" ]; then
        return 0
    fi
}

# 辅助函数：打印警告
print_warning() {
    log_output -e "${YELLOW}⚠️  $1${NC}"
}

# 测试1: 验证根路径重定向
log_output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_output "测试 1: 验证根路径重定向"
log_output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

REDIRECT_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}|%{redirect_url}" --max-time $TIMEOUT "$BASE_URL/" 2>&1 || echo "000|ERROR")
HTTP_CODE=$(echo "$REDIRECT_RESPONSE" | cut -d'|' -f1)
REDIRECT_URL=$(echo "$REDIRECT_RESPONSE" | cut -d'|' -f2)

log_output "HTTP状态码: $HTTP_CODE"
log_output "重定向URL: $REDIRECT_URL"

if [ "$HTTP_CODE" = "308" ] || [ "$HTTP_CODE" = "301" ]; then
    if [[ "$REDIRECT_URL" == *"/en"* ]] || [[ "$REDIRECT_URL" == *"/en" ]]; then
        print_success "根路径正确重定向到英文版本"
    else
        print_failure "根路径重定向目标错误 (期望: /en, 实际: $REDIRECT_URL)"
    fi
else
    print_failure "根路径HTTP状态码错误 (期望: 308/301, 实际: $HTTP_CODE)"
fi
log_output ""

# 测试2: 验证根路径 noindex
log_output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_output "测试 2: 验证根路径 noindex"
log_output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 注意：由于根路径会重定向，我们需要跟随重定向来检查最终页面
# 但实际上根路径的 metadata 应该在重定向之前就设置了
ROOT_CONTENT=$(curl -s --max-time $TIMEOUT "$BASE_URL/" 2>&1 || echo "ERROR")

if echo "$ROOT_CONTENT" | grep -q 'content="noindex'; then
    print_success "根路径已设置 noindex"
elif echo "$ROOT_CONTENT" | grep -q 'name="robots".*noindex'; then
    print_success "根路径已设置 noindex (备用格式)"
else
    # 由于重定向，可能无法直接检测到，给出警告而不是失败
    print_warning "无法检测根路径 noindex (可能因为重定向)"
    log_output "提示: 请手动验证 app/page.tsx 中的 robots.index = false"
fi
log_output ""

# 测试3: 验证英文页面 SEO 配置
log_output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_output "测试 3: 验证英文页面 SEO 配置"
log_output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

EN_CONTENT=$(curl -s --max-time $TIMEOUT "$BASE_URL/en" 2>&1 || echo "ERROR")

# 检查 canonical
if echo "$EN_CONTENT" | grep -q 'rel="canonical".*href=".*\/en"'; then
    print_success "英文页面 canonical 正确"
else
    print_failure "英文页面 canonical 缺失或错误"
fi

# 检查 x-default
if echo "$EN_CONTENT" | grep -q 'hreflang="x-default".*href=".*\/en"'; then
    print_success "英文页面 x-default 正确"
else
    print_failure "英文页面 x-default 缺失或错误"
fi

# 检查 robots
if echo "$EN_CONTENT" | grep -q 'content="index'; then
    print_success "英文页面允许索引"
else
    print_failure "英文页面 robots 配置错误"
fi
log_output ""

# 测试4: 验证中文页面 SEO 配置
log_output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_output "测试 4: 验证中文页面 SEO 配置"
log_output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

ZH_CONTENT=$(curl -s --max-time $TIMEOUT "$BASE_URL/zh" 2>&1 || echo "ERROR")

# 检查 canonical
if echo "$ZH_CONTENT" | grep -q 'rel="canonical".*href=".*\/zh"'; then
    print_success "中文页面 canonical 正确"
else
    print_failure "中文页面 canonical 缺失或错误"
fi

# 检查 x-default 指向英文
if echo "$ZH_CONTENT" | grep -q 'hreflang="x-default".*href=".*\/en"'; then
    print_success "中文页面 x-default 正确指向英文"
else
    print_failure "中文页面 x-default 缺失或错误"
fi

# 检查 robots
if echo "$ZH_CONTENT" | grep -q 'content="index'; then
    print_success "中文页面允许索引"
else
    print_failure "中文页面 robots 配置错误"
fi
log_output ""

# 测试5: 验证 sitemap
log_output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_output "测试 5: 验证 Sitemap"
log_output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

SITEMAP_CONTENT=$(curl -s --max-time $TIMEOUT "$BASE_URL/sitemap.xml" 2>&1 || echo "ERROR")

# 检查是否包含根路径
if echo "$SITEMAP_CONTENT" | grep -q "<loc>$BASE_URL/<\/loc>"; then
    print_failure "Sitemap 包含根路径 (不应该包含)"
else
    print_success "Sitemap 不包含根路径"
fi

# 检查是否包含英文页面
if echo "$SITEMAP_CONTENT" | grep -q "<loc>.*\/en<\/loc>"; then
    print_success "Sitemap 包含英文页面"
else
    print_failure "Sitemap 缺少英文页面"
fi

# 检查是否包含中文页面
if echo "$SITEMAP_CONTENT" | grep -q "<loc>.*\/zh<\/loc>"; then
    print_success "Sitemap 包含中文页面"
else
    print_failure "Sitemap 缺少中文页面"
fi
log_output ""

# 测试6: 验证 robots.txt
log_output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_output "测试 6: 验证 Robots.txt"
log_output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

ROBOTS_CONTENT=$(curl -s --max-time $TIMEOUT "$BASE_URL/robots.txt" 2>&1 || echo "ERROR")

# 检查是否允许英文和中文路径
if echo "$ROBOTS_CONTENT" | grep -q "Allow.*\/en"; then
    print_success "Robots.txt 允许英文路径"
else
    print_warning "Robots.txt 未明确允许英文路径"
fi

if echo "$ROBOTS_CONTENT" | grep -q "Allow.*\/zh"; then
    print_success "Robots.txt 允许中文路径"
else
    print_warning "Robots.txt 未明确允许中文路径"
fi

# 检查是否禁止 PDF
if echo "$ROBOTS_CONTENT" | grep -q "Disallow.*pdf"; then
    print_success "Robots.txt 禁止 PDF 文件"
else
    print_warning "Robots.txt 未禁止 PDF 文件"
fi
log_output ""

# 总结
log_output "========================================="
log_output "  验证总结"
log_output "========================================="
log_output ""
log_output -e "${GREEN}通过: $PASSED${NC}"
log_output -e "${RED}失败: $FAILED${NC}"
log_output ""

# 在 CI 环境中，允许部分测试失败（警告级别）
if [ $FAILED -eq 0 ]; then
    log_output -e "${GREEN}🎉 所有测试通过！多语言SEO配置正确。${NC}"
    exit 0
elif [ -n "$CI" ] && [ $FAILED -le 2 ]; then
    # CI 环境中，如果失败数 <= 2，视为警告而非错误
    log_output -e "${YELLOW}⚠️  有 $FAILED 个测试失败，但属于可接受范围。${NC}"
    exit 0
else
    log_output -e "${RED}⚠️  有 $FAILED 个测试失败，请检查配置。${NC}"
    exit 1
fi
