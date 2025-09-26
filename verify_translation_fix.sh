#!/bin/bash
# 翻译键修复验证脚本

echo "=== 翻译键修复验证 ==="

# 检查关键翻译键是否存在
echo "检查关键翻译键..."

python3 -c "
import json
with open('messages/zh.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

keys_to_check = [
    'interactiveTools.symptomAssessment.messages.assessmentComplete',
    'interactiveTools.symptomAssessment.messages.assessmentCompleteDesc',
    'interactiveTools.symptomAssessment.severity.moderate',
    'interactiveTools.symptomAssessment.severity.workplace',
    'interactiveTools.symptomAssessment.priority.medium'
]

for key_path in keys_to_check:
    keys = key_path.split('.')
    value = data
    try:
        for key in keys:
            value = value[key]
        print(f'✅ {key_path}: {value}')
    except (KeyError, TypeError):
        print(f'❌ {key_path}: 缺失')
"

echo ""
echo "=== 修复完成 ==="
echo "现在可以刷新浏览器页面查看效果"
echo "访问地址: http://localhost:3001/zh/interactive-tools/symptom-assessment?mode=medical"
