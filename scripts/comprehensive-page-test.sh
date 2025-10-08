#!/bin/bash

# 全面的页面测试验证脚本
# 用途: 测试所有核心页面是否有 MISSING_MESSAGE 错误

echo "🔍 ============================================"
echo "   全面页面验证测试"
echo "============================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 计数器
TOTAL=0
PASSED=0
FAILED=0

# 测试函数
test_page() {
    local url=$1
    local name=$2
    
    TOTAL=$((TOTAL + 1))
    
    echo -n "测试 $name ... "
    
    # 检查HTTP状态码
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$status_code" != "200" ]; then
        echo -e "${RED}❌ 失败 (HTTP $status_code)${NC}"
        FAILED=$((FAILED + 1))
        return 1
    fi
    
    # 检查是否包含 MISSING_MESSAGE
    if curl -s "$url" | grep -qi "missing_message"; then
        echo -e "${RED}❌ 失败 (发现 MISSING_MESSAGE)${NC}"
        FAILED=$((FAILED + 1))
        return 1
    fi
    
    echo -e "${GREEN}✅ 通过${NC}"
    PASSED=$((PASSED + 1))
    return 0
}

# 确保服务器运行
echo "📋 检查开发服务器状态..."
if ! pgrep -f "next dev" > /dev/null; then
    echo -e "${YELLOW}⚠️  开发服务器未运行！${NC}"
    echo "请先运行: npm run dev"
    exit 1
fi
echo -e "${GREEN}✅ 服务器运行中${NC}"
echo ""

# 等待服务器就绪
sleep 2

echo "🧪 开始测试核心页面..."
echo "================================"
echo ""

# 测试中文页面
echo "📱 中文版页面测试："
echo "--------------------------------"
test_page "http://localhost:3001/zh" "首页 (zh)"
test_page "http://localhost:3001/zh/privacy-policy" "隐私政策 (zh)"
test_page "http://localhost:3001/zh/downloads" "下载中心 (zh)"
test_page "http://localhost:3001/zh/natural-therapies" "自然疗法 (zh)"
test_page "http://localhost:3001/zh/scenario-solutions" "场景解决方案 (zh)"
test_page "http://localhost:3001/zh/teen-health" "青少年健康 (zh)"
test_page "http://localhost:3001/zh/interactive-tools" "交互工具列表 (zh)"
test_page "http://localhost:3001/zh/interactive-tools/pain-tracker" "疼痛追踪器 (zh)"
test_page "http://localhost:3001/zh/interactive-tools/symptom-assessment" "症状评估 (zh)"
test_page "http://localhost:3001/zh/interactive-tools/workplace-wellness" "职场健康 (zh)"

echo ""
echo "🌐 英文版页面测试："
echo "--------------------------------"
test_page "http://localhost:3001/en" "首页 (en)"
test_page "http://localhost:3001/en/privacy-policy" "隐私政策 (en)"
test_page "http://localhost:3001/en/downloads" "下载中心 (en)"
test_page "http://localhost:3001/en/natural-therapies" "自然疗法 (en)"
test_page "http://localhost:3001/en/scenario-solutions" "场景解决方案 (en)"
test_page "http://localhost:3001/en/teen-health" "青少年健康 (en)"
test_page "http://localhost:3001/en/interactive-tools" "交互工具列表 (en)"
test_page "http://localhost:3001/en/interactive-tools/pain-tracker" "疼痛追踪器 (en)"
test_page "http://localhost:3001/en/interactive-tools/symptom-assessment" "症状评估 (en)"
test_page "http://localhost:3001/en/interactive-tools/workplace-wellness" "职场健康 (en)"

echo ""
echo "================================"
echo "📊 测试结果统计"
echo "================================"
echo ""
echo "总测试数: $TOTAL"
echo -e "${GREEN}通过: $PASSED${NC}"
echo -e "${RED}失败: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 所有测试通过！${NC}"
    exit 0
else
    echo -e "${RED}❌ 有 $FAILED 个测试失败${NC}"
    exit 1
fi

