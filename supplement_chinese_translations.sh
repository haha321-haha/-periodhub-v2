#!/bin/bash

# 补充中文翻译键脚本
# 为英文独有键添加对应的中文翻译

echo "=== 开始补充中文翻译键 ==="

# 创建临时文件
cp messages/zh.json messages/zh_backup.json

# 定义需要补充的键值对
declare -A translations=(
    ["assessmentComplete"]="评估完成"
    ["assessmentCompleteDesc"]="您的症状评估已完成。请查看结果和建议。"
    ["assessmentFailed"]="评估失败"
    ["assessmentFailedDesc"]="评估过程中发生错误。请重试。"
    ["acupressure"]="穴位按摩"
    ["antiInflammatoryDiet"]="抗炎饮食"
    ["antiInflammatoryGuide"]="抗炎指南"
    ["avoidFoods"]="避免食物"
    ["backToOverview"]="返回概览"
    ["benefits"]="益处"
)

# 为每个键添加中文翻译
for key in "${!translations[@]}"; do
    value="${translations[$key]}"
    echo "添加键: $key = $value"
    
    # 使用jq添加键值对
    jq --arg key "$key" --arg value "$value" '.[$key] = $value' messages/zh.json > temp.json && mv temp.json messages/zh.json
done

echo "=== 补充完成 ==="
echo "新的中文键数量: $(grep -o '"[^"]*":' messages/zh.json | wc -l)"
echo "备份文件: messages/zh_backup.json"
