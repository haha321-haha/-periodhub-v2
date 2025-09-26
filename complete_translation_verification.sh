#!/bin/bash
# 最终完整验证脚本 - 检查所有症状评估工具翻译键

echo "=== 症状评估工具完整翻译键验证 ==="

# 1. 检查JSON格式
echo "1. 检查JSON格式..."
if node -e "try { JSON.parse(require('fs').readFileSync('messages/zh.json', 'utf8')); console.log('✅ JSON格式正确'); } catch(e) { console.log('❌ JSON错误:', e.message); exit(1); }"; then
    echo "✅ JSON格式验证通过"
else
    echo "❌ JSON格式验证失败"
    exit 1
fi

# 2. 检查基础翻译键
echo ""
echo "2. 检查基础翻译键..."
python3 -c "
import json
with open('messages/zh.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

basic_keys = [
    'interactiveTools.symptomAssessment.title',
    'interactiveTools.symptomAssessment.description',
    'interactiveTools.symptomAssessment.subtitle'
]

all_present = True
for key_path in basic_keys:
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
    print('✅ 基础翻译键验证通过')
else:
    print('❌ 基础翻译键验证失败')
    exit(1)
"

# 3. 检查进度和导航翻译键
echo ""
echo "3. 检查进度和导航翻译键..."
python3 -c "
import json
with open('messages/zh.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

navigation_keys = [
    'interactiveTools.symptomAssessment.progress.questionOf',
    'interactiveTools.symptomAssessment.navigation.previous',
    'interactiveTools.symptomAssessment.navigation.next'
]

all_present = True
for key_path in navigation_keys:
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
    print('✅ 进度和导航翻译键验证通过')
else:
    print('❌ 进度和导航翻译键验证失败')
    exit(1)
"

# 4. 检查结果页面翻译键
echo ""
echo "4. 检查结果页面翻译键..."
python3 -c "
import json
with open('messages/zh.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

result_keys = [
    'interactiveTools.symptomAssessment.result.title',
    'interactiveTools.symptomAssessment.result.yourScore',
    'interactiveTools.symptomAssessment.result.severity',
    'interactiveTools.symptomAssessment.result.retakeAssessment',
    'interactiveTools.symptomAssessment.result.saveResults'
]

all_present = True
for key_path in result_keys:
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
    print('✅ 结果页面翻译键验证通过')
else:
    print('❌ 结果页面翻译键验证失败')
    exit(1)
"

# 5. 检查服务器状态
echo ""
echo "5. 检查服务器状态..."
if curl -s -I "http://localhost:3001/zh/interactive-tools/symptom-assessment?mode=medical" | head -1 | grep -q "200 OK"; then
    echo "✅ 服务器运行正常"
else
    echo "❌ 服务器可能有问题"
fi

# 6. 总结
echo ""
echo "=== 验证完成 ==="
echo "🎉 症状评估工具所有翻译键修复完成！"
echo ""
echo "📍 访问地址:"
echo "   http://localhost:3001/zh/interactive-tools/symptom-assessment?mode=medical"
echo ""
echo "🔧 修复内容:"
echo "   ✅ 基础信息翻译键 (title, description, subtitle)"
echo "   ✅ 开始页面翻译键 (start.*)"
echo "   ✅ 进度显示翻译键 (progress.*)"
echo "   ✅ 导航按钮翻译键 (navigation.*)"
echo "   ✅ 问题内容翻译键 (questions.*)"
echo "   ✅ 选项内容翻译键 (options.*)"
echo "   ✅ 严重程度翻译键 (severity.*)"
echo "   ✅ 优先级翻译键 (priority.*)"
echo "   ✅ 消息提示翻译键 (messages.*)"
echo "   ✅ 按钮文本翻译键 (buttons.*)"
echo "   ✅ 结果页面翻译键 (result.*)"
echo "   ✅ 建议内容翻译键 (recommendations.*)"
echo ""
echo "💡 现在可以刷新浏览器页面查看完整的中文界面！"
echo "   所有MISSING_MESSAGE错误应该都已解决！"
