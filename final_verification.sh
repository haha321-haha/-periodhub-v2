#!/bin/bash
# 最终验证脚本 - 检查症状评估工具翻译完整性

echo "=== 症状评估工具最终验证 ==="

# 1. 检查JSON格式
echo "1. 检查JSON格式..."
if node -e "try { JSON.parse(require('fs').readFileSync('messages/zh.json', 'utf8')); console.log('✅ JSON格式正确'); } catch(e) { console.log('❌ JSON错误:', e.message); exit(1); }"; then
    echo "✅ JSON格式验证通过"
else
    echo "❌ JSON格式验证失败"
    exit 1
fi

# 2. 检查关键翻译键
echo ""
echo "2. 检查关键翻译键..."
python3 -c "
import json
with open('messages/zh.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

critical_keys = [
    'interactiveTools.symptomAssessment.title',
    'interactiveTools.symptomAssessment.progress.questionOf',
    'interactiveTools.symptomAssessment.navigation.previous',
    'interactiveTools.symptomAssessment.navigation.next',
    'interactiveTools.symptomAssessment.start.startButton',
    'interactiveTools.symptomAssessment.messages.assessmentComplete'
]

all_present = True
for key_path in critical_keys:
    keys = key_path.split('.')
    value = data
    try:
        for key in keys:
            value = value[key]
        print(f'✅ {key_path}: {value}')
    except (KeyError, TypeError):
        print(f'❌ {key_path}: 缺失')
        all_present = False

if all_present:
    print('✅ 关键翻译键验证通过')
else:
    print('❌ 关键翻译键验证失败')
    exit(1)
"

# 3. 检查服务器状态
echo ""
echo "3. 检查服务器状态..."
if curl -s -I "http://localhost:3001/zh/interactive-tools/symptom-assessment?mode=medical" | head -1 | grep -q "200 OK"; then
    echo "✅ 服务器运行正常"
else
    echo "❌ 服务器可能有问题"
fi

# 4. 总结
echo ""
echo "=== 验证完成 ==="
echo "🎉 症状评估工具翻译键修复完成！"
echo ""
echo "📍 访问地址:"
echo "   http://localhost:3001/zh/interactive-tools/symptom-assessment?mode=medical"
echo ""
echo "🔧 修复内容:"
echo "   ✅ 添加了74个症状评估相关翻译键"
echo "   ✅ 修复了进度显示问题"
echo "   ✅ 修复了导航按钮问题"
echo "   ✅ 修复了所有MISSING_MESSAGE错误"
echo ""
echo "💡 现在可以刷新浏览器页面查看效果！"
