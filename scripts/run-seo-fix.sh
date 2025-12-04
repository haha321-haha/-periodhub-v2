#!/bin/bash

# SEO修复执行脚本
# 用于自动化执行SEO修复流程

set -e  # 遇到错误立即退出

# 配置
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPTS_DIR="$PROJECT_ROOT/scripts"
REPORTS_DIR="$PROJECT_ROOT/reports"
LOG_FILE="$REPORTS_DIR/seo-fix-execution.log"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
}

# 检查依赖
check_dependencies() {
    log "检查依赖..."

    # 检查Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js未安装，请先安装Node.js"
        exit 1
    fi

    # 检查npm
    if ! command -v npm &> /dev/null; then
        error "npm未安装，请先安装npm"
        exit 1
    fi

    success "依赖检查通过"
}

# 创建必要目录
setup_directories() {
    log "创建必要目录..."

    mkdir -p "$REPORTS_DIR"
    mkdir -p "$PROJECT_ROOT/backups/seo-fix"

    success "目录创建完成"
}

# 运行验证脚本
run_verification() {
    log "运行SEO验证脚本..."

    cd "$PROJECT_ROOT"

    if [ -f "$SCRIPTS_DIR/seo-fix-verification.js" ]; then
        node "$SCRIPTS_DIR/seo-fix-verification.js"
        success "验证脚本执行完成"
    else
        error "验证脚本不存在: $SCRIPTS_DIR/seo-fix-verification.js"
        exit 1
    fi
}

# 运行修复脚本
run_fix() {
    log "运行SEO修复脚本..."

    cd "$PROJECT_ROOT"

    if [ -f "$SCRIPTS_DIR/seo-fix-implementation.js" ]; then
        node "$SCRIPTS_DIR/seo-fix-implementation.js"
        success "修复脚本执行完成"
    else
        error "修复脚本不存在: $SCRIPTS_DIR/seo-fix-implementation.js"
        exit 1
    fi
}

# 运行监控脚本
run_monitoring() {
    log "运行SEO监控脚本..."

    cd "$PROJECT_ROOT"

    if [ -f "$SCRIPTS_DIR/seo-monitoring-dashboard.js" ]; then
        node "$SCRIPTS_DIR/seo-monitoring-dashboard.js"
        success "监控脚本执行完成"
    else
        error "监控脚本不存在: $SCRIPTS_DIR/seo-monitoring-dashboard.js"
        exit 1
    fi
}

# 显示帮助信息
show_help() {
    echo "SEO修复执行脚本"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  verify     只运行验证脚本"
    echo "  fix        只运行修复脚本"
    echo "  monitor    只运行监控脚本"
    echo "  full       运行完整流程（默认）"
    echo "  help       显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 verify    # 只验证当前状态"
    echo "  $0 fix       # 只执行修复"
    echo "  $0 full      # 完整流程"
}

# 主函数
main() {
    local action="${1:-full}"

    echo "🚀 SEO修复执行脚本"
    echo "=================="

    # 检查依赖
    check_dependencies

    # 创建目录
    setup_directories

    case "$action" in
        "verify")
            log "执行验证模式..."
            run_verification
            ;;
        "fix")
            log "执行修复模式..."
            run_fix
            ;;
        "monitor")
            log "执行监控模式..."
            run_monitoring
            ;;
        "full")
            log "执行完整流程..."
            run_verification
            echo ""
            run_fix
            echo ""
            run_monitoring
            ;;
        "help")
            show_help
            exit 0
            ;;
        *)
            error "未知选项: $action"
            show_help
            exit 1
            ;;
    esac

    success "所有操作完成！"
    echo ""
    echo "📋 查看报告:"
    echo "   - 验证报告: $REPORTS_DIR/seo-verification-*.json"
    echo "   - 修复报告: $REPORTS_DIR/seo-fix-report-*.json"
    echo "   - 监控报告: $REPORTS_DIR/seo-monitoring-*.json"
    echo "   - 执行日志: $LOG_FILE"
}

# 运行主函数
main "$@"
