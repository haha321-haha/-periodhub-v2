#!/bin/bash

# 批量补充中文翻译键脚本
# 按类别补充重要的翻译键

echo "=== 开始批量补充中文翻译键 ==="

# 备份原文件
cp messages/zh.json messages/zh_backup_$(date +%Y%m%d_%H%M%S).json

# 定义翻译键值对
declare -A translations=(
    # 数字和范围键
    ["0-2"]="0-2"
    ["3-4"]="3-4" 
    ["4"]="4"
    ["5-7"]="5-7"
    ["8-10"]="8-10"
    
    # 功能键
    ["benefitsLabel"]="益处标签"
    ["foods"]="食物"
    ["actionSteps"]="行动步骤"
    ["step"]="步骤"
    ["steps"]="步骤"
    
    # 评估相关
    ["assessment"]="评估"
    ["assessmentTool"]="评估工具"
    ["assessmentResult"]="评估结果"
    ["assessmentHistory"]="评估历史"
    
    # 建议相关
    ["recommendation"]="建议"
    ["recommendations"]="建议"
    ["personalizedRecommendations"]="个性化建议"
    ["immediateRecommendations"]="即时建议"
    ["longTermRecommendations"]="长期建议"
    
    # 症状相关
    ["symptom"]="症状"
    ["symptoms"]="症状"
    ["symptomAssessment"]="症状评估"
    ["symptomTracker"]="症状追踪"
    ["symptomHistory"]="症状历史"
    
    # 疼痛相关
    ["pain"]="疼痛"
    ["painLevel"]="疼痛等级"
    ["painDuration"]="疼痛持续时间"
    ["painLocation"]="疼痛位置"
    ["painTracker"]="疼痛追踪"
    
    # 周期相关
    ["cycle"]="周期"
    ["cycleTracker"]="周期追踪"
    ["cycleLength"]="周期长度"
    ["cycleHistory"]="周期历史"
    
    # 体质相关
    ["constitution"]="体质"
    ["constitutionTest"]="体质测试"
    ["constitutionType"]="体质类型"
    ["constitutionRecommendations"]="体质建议"
    
    # 营养相关
    ["nutrition"]="营养"
    ["nutritionGuide"]="营养指南"
    ["nutritionRecommendations"]="营养建议"
    ["diet"]="饮食"
    ["dietGuide"]="饮食指南"
    
    # 运动相关
    ["exercise"]="运动"
    ["exercises"]="运动"
    ["exerciseGuide"]="运动指南"
    ["stretching"]="拉伸"
    ["yoga"]="瑜伽"
    
    # 生活方式
    ["lifestyle"]="生活方式"
    ["lifestyleRecommendations"]="生活方式建议"
    ["sleep"]="睡眠"
    ["stress"]="压力"
    ["stressManagement"]="压力管理"
    
    # 医疗相关
    ["medical"]="医疗"
    ["medicalAdvice"]="医疗建议"
    ["doctor"]="医生"
    ["doctorVisit"]="看医生"
    ["emergency"]="紧急情况"
    
    # 工具相关
    ["tool"]="工具"
    ["tools"]="工具"
    ["tracker"]="追踪器"
    ["calculator"]="计算器"
    ["guide"]="指南"
    
    # 用户界面
    ["button"]="按钮"
    ["buttons"]="按钮"
    ["menu"]="菜单"
    ["navigation"]="导航"
    ["settings"]="设置"
    ["preferences"]="偏好设置"
    
    # 状态和消息
    ["loading"]="加载中"
    ["error"]="错误"
    ["success"]="成功"
    ["warning"]="警告"
    ["info"]="信息"
    ["message"]="消息"
    ["notification"]="通知"
    
    # 时间和日期
    ["date"]="日期"
    ["time"]="时间"
    ["duration"]="持续时间"
    ["frequency"]="频率"
    ["schedule"]="时间表"
    
    # 数据相关
    ["data"]="数据"
    ["record"]="记录"
    ["records"]="记录"
    ["history"]="历史"
    ["statistics"]="统计"
    ["analytics"]="分析"
    ["report"]="报告"
    ["export"]="导出"
    ["import"]="导入"
    
    # 社交功能
    ["community"]="社区"
    ["social"]="社交"
    ["share"]="分享"
    ["support"]="支持"
    ["help"]="帮助"
    ["feedback"]="反馈"
    
    # 技术相关
    ["sync"]="同步"
    ["backup"]="备份"
    ["restore"]="恢复"
    ["update"]="更新"
    ["version"]="版本"
    ["performance"]="性能"
    ["optimization"]="优化"
    
    # 无障碍
    ["accessibility"]="无障碍"
    ["aria"]="ARIA"
    ["screenReader"]="屏幕阅读器"
    ["keyboard"]="键盘"
    ["focus"]="焦点"
    
    # 测试相关
    ["test"]="测试"
    ["testing"]="测试"
    ["validation"]="验证"
    ["quality"]="质量"
    ["coverage"]="覆盖率"
    
    # 文档相关
    ["documentation"]="文档"
    ["guide"]="指南"
    ["tutorial"]="教程"
    ["manual"]="手册"
    ["api"]="API"
    ["reference"]="参考"
)

# 批量添加翻译
echo "开始添加翻译键..."
count=0
for key in "${!translations[@]}"; do
    value="${translations[$key]}"
    echo "添加键: $key = $value"
    
    # 使用jq添加键值对
    jq --arg key "$key" --arg value "$value" '.[$key] = $value' messages/zh.json > temp.json && mv temp.json messages/zh.json
    ((count++))
done

echo "=== 批量补充完成 ==="
echo "添加的键数量: $count"
echo "新的中文键数量: $(grep -o '"[^"]*":' messages/zh.json | wc -l)"
echo "备份文件: messages/zh_backup_$(date +%Y%m%d_%H%M%S).json"
