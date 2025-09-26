# 翻译键管理流程

## 概述
本文档建立了翻译键管理流程，确保中英文翻译键的同步性和完整性。

## 当前状态
- **中文翻译键数量**: 4,817
- **英文翻译键数量**: 4,831
- **覆盖率**: 99.71%
- **剩余差异**: 14个键

## 键管理流程

### 1. 新增翻译键流程
```bash
# 1. 添加中文键
jq --arg key "newKey" --arg value "新值" '.[$key] = $value' messages/zh.json > temp.json && mv temp.json messages/zh.json

# 2. 添加英文键
jq --arg key "newKey" --arg value "New Value" '.[$key] = $value' messages/en.json > temp.json && mv temp.json messages/en.json

# 3. 验证JSON格式
node -e "JSON.parse(require('fs').readFileSync('messages/zh.json', 'utf8')); console.log('✅ 中文JSON正确');"
node -e "JSON.parse(require('fs').readFileSync('messages/en.json', 'utf8')); console.log('✅ 英文JSON正确');"
```

### 2. 批量添加翻译键流程
```bash
# 使用Python脚本批量添加
python3 supplement_translations.py
```

### 3. 翻译键同步检查流程
```bash
# 检查键数量
echo "中文键数量: $(grep -o '"[^"]*":' messages/zh.json | wc -l)"
echo "英文键数量: $(grep -o '"[^"]*":' messages/en.json | wc -l)"

# 检查覆盖率
echo "覆盖率: $(echo "scale=2; $(grep -o '"[^"]*":' messages/zh.json | wc -l) * 100 / $(grep -o '"[^"]*":' messages/en.json | wc -l)" | bc)%"

# 找出差异键
grep -o '"[^"]*":' messages/en.json | sed 's/":$//' | sed 's/^"//' > en_keys.txt
grep -o '"[^"]*":' messages/zh.json | sed 's/":$//' | sed 's/^"//' > zh_keys.txt
echo "英文独有键: $(comm -23 <(sort en_keys.txt) <(sort zh_keys.txt) | wc -l)"
echo "中文独有键: $(comm -13 <(sort en_keys.txt) <(sort zh_keys.txt) | wc -l)"
```

### 4. 翻译键质量检查流程
```bash
# 检查重要功能键
echo "P3相关键: $(grep -c "p3\|performance\|testing\|documentation" messages/zh.json)"
echo "交互工具键: $(grep -c "interactiveTools" messages/zh.json)"
echo "评估工具键: $(grep -c "assessment\|symptom" messages/zh.json)"

# 检查空值
echo "中文空值: $(grep -c '": ""' messages/zh.json)"
echo "英文空值: $(grep -c '": ""' messages/en.json)"
```

## 自动化脚本

### 翻译键同步检查脚本
```bash
#!/bin/bash
# translation_sync_check.sh

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

# 清理临时文件
rm -f en_keys.txt zh_keys.txt
```

### 翻译键补充脚本
```bash
#!/bin/bash
# supplement_missing_keys.sh

echo "=== 补充缺失翻译键 ==="

# 备份文件
timestamp=$(date +%Y%m%d_%H%M%S)
cp messages/zh.json messages/zh_backup_$timestamp.json
cp messages/en.json messages/en_backup_$timestamp.json

# 运行Python脚本
python3 supplement_translations.py

echo "=== 补充完成 ==="
echo "备份文件: messages/zh_backup_$timestamp.json"
echo "备份文件: messages/en_backup_$timestamp.json"
```

## 最佳实践

### 1. 键命名规范
- 使用驼峰命名法：`assessmentComplete`
- 使用描述性名称：`painLevelDescription`
- 避免重复：检查现有键名

### 2. 翻译质量要求
- 中文翻译要准确、自然
- 英文翻译要符合英语习惯
- 避免直译，注重文化适应性

### 3. 版本控制
- 每次修改前备份文件
- 使用有意义的提交信息
- 定期检查翻译覆盖率

### 4. 测试验证
- 每次修改后验证JSON格式
- 检查翻译覆盖率
- 测试关键功能

## 监控指标

### 关键指标
- **翻译覆盖率**: 目标 ≥ 99%
- **JSON格式正确性**: 100%
- **重要功能键完整性**: 100%
- **空值比例**: < 1%

### 告警阈值
- 覆盖率 < 95%: 立即补充
- JSON格式错误: 立即修复
- 重要功能键缺失: 立即补充
- 空值比例 > 5%: 检查翻译质量

## 维护计划

### 日常维护
- 每日检查翻译覆盖率
- 每周检查JSON格式
- 每月检查翻译质量

### 定期维护
- 每季度全面检查翻译键
- 每半年更新翻译质量
- 每年评估翻译流程

## 工具和资源

### 必需工具
- `jq`: JSON处理
- `node`: JSON验证
- `grep`: 文本搜索
- `comm`: 文件比较

### 辅助脚本
- `supplement_translations.py`: 批量补充
- `translation_sync_check.sh`: 同步检查
- `supplement_missing_keys.sh`: 缺失键补充

## 联系信息
- 维护人员: 开发团队
- 更新频率: 根据需求
- 最后更新: 2024年9月27日
