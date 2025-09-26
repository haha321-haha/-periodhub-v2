#!/bin/bash
# translation_sync_check.sh
# 翻译键同步检查脚本

echo "=== 翻译键同步检查 ==="
echo "中文键数量: $(grep -o '"[^"]*":' messages/zh.json | wc -l)"
echo "英文键数量: $(grep -o '"[^"]*":' messages/en.json | wc -l)"
echo "覆盖率: $(echo "scale=2; $(grep -o '"[^"]*":' messages/zh.json | wc -l) * 100 / $(grep -o '"[^"]*":' messages/en.json | wc -l)" | bc)%"

# 检查JSON格式
echo "=== JSON格式检查 ==="
node -e "try { JSON.parse(require('fs').readFileSync('messages/zh.json', 'utf8')); console.log('✅ 中文JSON正确'); } catch(e) { console.log('❌ 中文JSON错误:', e.message); }"
node -e "try { JSON.parse(require('fs').readFileSync('messages/en.json', 'utf8')); console.log('✅ 英文JSON正确'); } catch(e) { console.log('❌ 英文JSON错误:', e.message); }"

# 检查差异
echo "=== 差异检查 ==="
grep -o '"[^"]*":' messages/en.json | sed 's/":$//' | sed 's/^"//' > en_keys.txt
grep -o '"[^"]*":' messages/zh.json | sed 's/":$//' | sed 's/^"//' > zh_keys.txt
echo "英文独有键: $(comm -23 <(sort en_keys.txt) <(sort zh_keys.txt) | wc -l)"
echo "中文独有键: $(comm -13 <(sort en_keys.txt) <(sort zh_keys.txt) | wc -l)"

# 检查重要功能键
echo "=== 重要功能键检查 ==="
echo "P3相关键: $(grep -c "p3\|performance\|testing\|documentation" messages/zh.json)"
echo "交互工具键: $(grep -c "interactiveTools" messages/zh.json)"
echo "评估工具键: $(grep -c "assessment\|symptom" messages/zh.json)"

# 检查空值
echo "=== 空值检查 ==="
echo "中文空值: $(grep -c '": ""' messages/zh.json)"
echo "英文空值: $(grep -c '": ""' messages/en.json)"

# 清理临时文件
rm -f en_keys.txt zh_keys.txt

echo "=== 检查完成 ==="
