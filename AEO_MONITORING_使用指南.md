# AEO 监控系统使用指南

## 概述

AEO (Answer Engine Optimization) 监控系统是一个完整的Schema验证和质量追踪解决方案，专为Period Hub的健康内容设计。它提供自动化验证、趋势分析和可视化报告，帮助确保所有页面的结构化数据质量。

## 核心功能

### 1. 自动验证与记录
- 自动验证页面Schema结构
- 记录验证结果到统一日志
- 生成趋势分析和改进建议

### 2. 可视化报告
- HTML格式的监控报告
- SVG趋势图表
- 问题分析与修复建议

### 3. CI/CD 集成
- GitHub Actions自动化工作流
- PR评论反馈
- 状态徽章显示

## 快速开始

### 本地使用

1. **验证单个页面**
   ```bash
   node scripts/log-schema-validation.js \
     --page "/zh/articles/comprehensive-medical-guide-to-dysmenorrhea" \
     --schema "MedicalWebPage" \
     --result "✅ 通过" \
     --issues "-" \
     --priority "high" \
     --notes "ICD-10代码已正确添加，分数: 98"
   ```

2. **批量验证与同步**
   ```bash
   # 运行完整验证流程
   npm run aeo:validate
   
   # 或者分步执行
   npm run validate:schema && npm run log:validation && npm run aeo:sync
   ```

3. **查看监控报告**
   ```bash
   # 打开生成的HTML报告
   open reports/AEO-Monitoring-Report.html
   ```

### CI/CD 集成

1. **自动触发**: 当修改相关文件时自动运行验证
2. **定时任务**: 每天UTC 02:00（北京时间10:00）自动验证
3. **PR评论**: 自动在PR中添加验证结果评论
4. **状态徽章**: 根据验证结果设置状态

## 监控报告说明

### 报告结构

```
AEO 监控报告
├── 🔍 Rich Results 验证趋势分析
│   ├── 整体评分卡片
│   ├── 页面统计卡片
│   ├── 质量趋势指示器
│   ├── 📈 过去7天验证分数趋势（图表）
│   ├── 🔧 常见问题分析（表格）
│   └── 💡 改进建议
└── 最后更新时间
```

### 评分标准

- **100分**: 完全通过，无问题
- **80-99分**: 基本通过，有轻微问题
- **60-79分**: 部分通过，有明显问题
- **0-59分**: 严重问题，需要立即修复

### 趋势分析

- **📈 上升趋势**: 质量持续改善
- **➡️ 稳定状态**: 质量保持不变
- **📉 下降趋势**: 质量下降，需要关注

## 文件结构

```
project/
├── scripts/
│   ├── log-schema-validation.js      # 验证日志记录脚本
│   ├── sync-to-aeo-monitoring.js   # 监控系统同步脚本
│   └── validate-schemas.js         # 批量验证脚本
├── lib/seo/
│   └── aeo-monitoring-system.js     # 监控系统核心逻辑
├── logs/
│   ├── schema-validation.log        # 验证日志
│   └── schema-validation-trend.json # 趋势数据JSON
├── reports/
│   └── AEO-Monitoring-Report.html   # HTML监控报告
└── .github/workflows/
    └── aeo-monitoring.yml           # GitHub Actions工作流
```

## 最佳实践

### 1. 开发工作流

```bash
# 开发完成后验证Schema
npm run aeo:validate

# 提交前确保验证通过
git add .
git commit -m "feat: add medical schema with ICD-10 codes"
npm run aeo:validate  # 再次验证
git push
```

### 2. 问题修复优先级

1. **高优先级**: Schema结构错误、必填字段缺失
2. **中优先级**: 推荐字段缺失、格式问题
3. **低优先级**: 可选字段、优化建议

### 3. 常见问题及解决方案

| 问题类型 | 解决方案 |
|---------|---------|
| 缺少ICD-10代码 | 添加medicalEntity.code字段 |
| 缺少citation | 添加isBasedOn数组引用权威来源 |
| 缺少mechanismOfAction | 为药物Schema添加作用机制 |
| 格式错误 | 检查JSON-LD语法和嵌套结构 |

## 高级功能

### 1. 自定义验证规则

在`lib/seo/aeo-monitoring-system.js`中添加自定义验证逻辑：

```javascript
function customValidation(schema, page) {
  const issues = [];
  
  // 自定义验证规则
  if (!schema.medicalEntity || !schema.medicalEntity.code) {
    issues.push('缺少医疗实体的编码信息');
  }
  
  return issues;
}
```

### 2. 集成外部工具

```javascript
// 集成Google Rich Results Test API
async function validateWithGoogleTool(url) {
  const response = await fetch('https://searchconsole.googleapis.com/...', {
    method: 'POST',
    body: JSON.stringify({ url })
  });
  return response.json();
}
```

### 3. 通知集成

```javascript
// Slack通知集成
function sendSlackNotification(message) {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  fetch(webhook, {
    method: 'POST',
    body: JSON.stringify({ text: message })
  });
}
```

## 故障排除

### 常见错误

1. **权限错误**
   ```bash
   chmod +x scripts/*.js
   ```

2. **模块未找到**
   ```bash
   npm install
   ```

3. **日志目录不存在**
   ```bash
   mkdir -p logs
   ```

### 调试方法

1. **详细输出**
   ```bash
   DEBUG=true npm run aeo:validate
   ```

2. **手动测试**
   ```bash
   node scripts/log-schema-validation.js --page "/test" --schema "TestSchema" --result "✅ 通过"
   ```

3. **查看日志**
   ```bash
   tail -f logs/schema-validation.log
   ```

## 扩展计划

### 第二阶段功能（计划中）

1. **Badge系统**: GitHub状态徽章
2. **通知系统**: Slack/Discord/邮件通知
3. **自动修复**: 基于模式的问题自动修复
4. **预提交钩子**: 本地实时验证
5. **性能指标**: 页面加载速度与Schema性能关联

### 第三阶段功能（未来）

1. **AI辅助**: 基于历史数据的智能建议
2. **多站点支持**: 管理多个网站的Schema
3. **竞品分析**: 对比竞争对手的Schema实施
4. **A/B测试**: Schema变体测试框架

## 支持与反馈

如需帮助或提供反馈，请：

1. 查看项目中的issue和讨论
2. 提交新的issue描述问题
3. 参与代码贡献和改进

---

**注意**: 此系统专为Period Hub的健康内容优化，使用前请确保已正确配置相关环境和权限。